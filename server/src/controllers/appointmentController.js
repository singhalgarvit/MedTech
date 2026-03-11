import appointmentService from "../services/appointmentService.js";
import User from "../../database/models/user.schema.js";
import Doctor from "../../database/models/doctor.schema.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import {
  sendAppointmentConfirmationToPatient,
  sendAppointmentConfirmationToDoctor,
  buildGoogleCalendarUrl,
  buildIcsContent,
} from "../../utils/appointmentEmails.js";
import Appointment from "../../database/models/appointment.schema.js";
import jwt from "jsonwebtoken";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const pendingOrders = new Map();

const getSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const date = req.query.date;
    if (!date) {
      return res.status(400).json({ error: "Query param date (YYYY-MM-DD) is required" });
    }
    const result = await appointmentService.getAvailableSlots(doctorId, date);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    res.status(200).json({ availableSlots: result.availableSlots, bookedSlots: result.bookedSlots });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    let patientId = req.user._id;
    if (!patientId && req.user.email) {
      const user = await User.findOne({ email: req.user.email }).select("_id").lean();
      patientId = user?._id;
    }
    if (!patientId) return res.status(401).json({ error: "User not found. Please login again." });
    const { doctorId, date, timeSlot, notes } = req.body;
    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ error: "doctorId, date, and timeSlot are required" });
    }
    if (String(patientId) === String(doctorId)) {
      return res.status(400).json({ error: "You cannot book an appointment with yourself." });
    }
    const result = await appointmentService.createOrderAndHoldSlot(
      doctorId,
      patientId,
      date,
      timeSlot,
      notes
    );
    if (!result.success) {
      return res.status(400).json({ error: result.error || "Slot not available" });
    }
    const order = await razorpay.orders.create({
      amount: result.amount,
      currency: result.currency,
      receipt: `apt_${Date.now()}`,
    });
    pendingOrders.set(order.id, {
      patientId,
      doctorId,
      dateStr: date,
      timeSlot,
      notes: result.notes,
    });
    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, razorpaySignature } = req.body;
    if (!orderId || !paymentId || !razorpaySignature) {
      return res.status(400).json({ error: "orderId, paymentId, and razorpaySignature required" });
    }
    const payload = pendingOrders.get(orderId);
    if (!payload) {
      return res.status(400).json({ error: "Order not found or expired" });
    }
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
    if (expected !== razorpaySignature) {
      return res.status(400).json({ error: "Payment verification failed" });
    }
    const appointment = await appointmentService.createAppointmentAfterPayment({
      ...payload,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
    });
    pendingOrders.delete(orderId);

    // Send confirmation emails (don't block response)
    (async () => {
      try {
        const [patient, doctorUser] = await Promise.all([
          User.findById(payload.patientId).select("name email").lean(),
          User.findById(payload.doctorId).select("name email").lean(),
        ]);
        const doctorDoc = doctorUser?.email
          ? await Doctor.findOne({ userEmail: doctorUser.email }).lean()
          : null;
        const dateStr = payload.dateStr;
        const amountPaid = doctorDoc?.consultationFee;
        const location = [doctorDoc?.clinicName, doctorDoc?.clinicAddress].filter(Boolean).join(", ");
        const googleCalendarUrl = buildGoogleCalendarUrl({
          dateStr,
          timeSlot: payload.timeSlot,
          doctorName: doctorUser?.name,
          location,
        });
        const calendarToken = jwt.sign(
          { appointmentId: appointment._id.toString(), purpose: "calendar" },
          process.env.jwt_Secret_key,
          { expiresIn: "7d" }
        );
        const backendUrl = process.env.BACKEND_URL || process.env.API_URL || "";
        const icsDownloadUrl = backendUrl
          ? `${backendUrl.replace(/\/$/, "")}/appointment/calendar-event?token=${calendarToken}`
          : null;

        await Promise.all([
          sendAppointmentConfirmationToPatient({
            patientEmail: patient?.email,
            patientName: patient?.name,
            doctorName: doctorUser?.name,
            doctorEmail: doctorUser?.email,
            doctorDoc,
            dateStr,
            timeSlot: payload.timeSlot,
            notes: payload.notes,
            amountPaid,
            paymentId,
            orderId,
            googleCalendarUrl,
            icsDownloadUrl,
          }),
          sendAppointmentConfirmationToDoctor({
            doctorEmail: doctorUser?.email,
            doctorName: doctorUser?.name,
            doctorDoc,
            patientName: patient?.name,
            patientEmail: patient?.email,
            dateStr,
            timeSlot: payload.timeSlot,
            notes: payload.notes,
          }),
        ]);
      } catch (err) {
        console.error("Appointment confirmation emails failed:", err.message);
      }
    })();

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    let doctorId = req.user._id;
    if (!doctorId && req.user.email) {
      const user = await User.findOne({ email: req.user.email }).select("_id").lean();
      doctorId = user?._id;
    }
    if (!doctorId) {
      return res.status(401).json({ error: "User not found. Please login again." });
    }
    const appointments = await appointmentService.getAppointmentsForDoctor(doctorId);
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

const getMyAppointmentsPatient = async (req, res) => {
  try {
    let patientId = req.user._id;
    if (!patientId && req.user.email) {
      const user = await User.findOne({ email: req.user.email }).select("_id").lean();
      patientId = user?._id;
    }
    if (!patientId) {
      return res.status(401).json({ error: "User not found. Please login again." });
    }
    const appointments = await appointmentService.getAppointmentsForPatient(patientId);
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

const getAllAppointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentService.getAllAppointmentsForAdmin();
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

/** GET /appointment/calendar-event?token=... — returns ICS file for adding appointment to calendar. */
const getCalendarEvent = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).json({ error: "Token required" });
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.jwt_Secret_key);
    } catch {
      return res.status(400).json({ error: "Invalid or expired link" });
    }
    if (decoded.purpose !== "calendar" || !decoded.appointmentId) {
      return res.status(400).json({ error: "Invalid link" });
    }
    const appointment = await Appointment.findById(decoded.appointmentId)
      .populate("doctorId", "name email")
      .lean();
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });
    const doctorUser = appointment.doctorId;
    const doctorDoc = doctorUser?.email
      ? await Doctor.findOne({ userEmail: doctorUser.email }).select("clinicName clinicAddress clinicLocation").lean()
      : null;
    const date = appointment.date;
    const dateStr = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
    const timeSlot = appointment.timeSlot;
    const title = "Consultation with Dr. " + (doctorUser?.name || "Doctor");
    const location = [doctorDoc?.clinicName, doctorDoc?.clinicAddress].filter(Boolean).join(", ");
    const description = "MedTech appointment. Bring your previous reports if any.";
    const ics = buildIcsContent({ title, description, location, dateStr, timeSlot });
    if (!ics) return res.status(500).json({ error: "Could not generate calendar file" });
    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="medtech-appointment.ics"');
    res.send(ics);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    let doctorId = req.user._id;
    if (!doctorId && req.user.email) {
      const user = await User.findOne({ email: req.user.email }).select("_id").lean();
      doctorId = user?._id;
    }
    if (!doctorId) {
      return res.status(401).json({ error: "User not found. Please login again." });
    }
    const { id } = req.params;
    const { status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ error: "Appointment id and status are required" });
    }
    const result = await appointmentService.updateAppointmentStatus(id, doctorId, status);
    if (!result.success) {
      return res.status(400).json({ error: result.error || "Update failed" });
    }
    res.status(200).json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

const getDoctorEarnings = async (req, res) => {
  try {
    let doctorId = req.user._id;
    if (!doctorId && req.user.email) {
      const user = await User.findOne({ email: req.user.email }).select("_id").lean();
      doctorId = user?._id;
    }
    if (!doctorId) {
      return res.status(401).json({ error: "User not found. Please login again." });
    }
    const earnings = await appointmentService.getDoctorEarnings(doctorId);
    res.status(200).json(earnings);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

export default { getSlots, createOrder, verifyPayment, getMyAppointments, getMyAppointmentsPatient, getAllAppointmentsAdmin, getCalendarEvent, updateAppointmentStatus, getDoctorEarnings };
