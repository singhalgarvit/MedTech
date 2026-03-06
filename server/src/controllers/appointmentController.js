import appointmentService from "../services/appointmentService.js";
import User from "../../database/models/user.schema.js";
import Razorpay from "razorpay";
import crypto from "crypto";

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

export default { getSlots, createOrder, verifyPayment, getMyAppointments, getMyAppointmentsPatient, getAllAppointmentsAdmin };
