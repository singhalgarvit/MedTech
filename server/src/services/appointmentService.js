import Doctor from "../../database/models/doctor.schema.js";
import User from "../../database/models/user.schema.js";
import Appointment from "../../database/models/appointment.schema.js";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Parse time string to minutes since midnight. Handles "10:00", "10:00 AM", "18:30" */
function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return null;
  const trimmed = timeStr.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = (match[3] || "").toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

/** Format minutes since midnight to "HH:mm" */
function minutesToTimeStr(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Return YYYY-MM-DD for the given date in local time (for "is today?" check). */
function toLocalDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Generate 5-minute slots between start and end (inclusive start, exclusive end in terms of next slot) */
function generateSlots(startMinutes, endMinutes) {
  const slots = [];
  for (let m = startMinutes; m < endMinutes; m += 5) {
    slots.push(minutesToTimeStr(m));
  }
  return slots;
}

/** Resolve doctorId (User _id or Doctor _id) to user and doctorDoc. Returns { user, doctorDoc } or null. */
async function resolveDoctor(doctorId) {
  if (!doctorId) return null;
  let user = await User.findById(doctorId).select("email role _id").lean();
  if (user && user.role === "doctor") {
    const doctorDoc = await Doctor.findOne({ userEmail: user.email }).lean();
    return doctorDoc ? { user, doctorDoc } : { user, doctorDoc: null };
  }
  const doctorDoc = await Doctor.findById(doctorId).lean();
  if (!doctorDoc || !doctorDoc.isVerified) return null;
  user = await User.findOne({ email: doctorDoc.userEmail }).select("email role _id").lean();
  if (!user || user.role !== "doctor") return null;
  return { user, doctorDoc };
}

export const getAvailableSlots = async (doctorId, dateStr) => {
  const resolved = await resolveDoctor(doctorId);
  if (!resolved || !resolved.doctorDoc) {
    return { availableSlots: [], bookedSlots: [], error: "Doctor not found" };
  }
  const { user, doctorDoc } = resolved;

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return { availableSlots: [], bookedSlots: [], error: "Invalid date" };

  const dayName = DAY_NAMES[date.getDay()];
  if (!doctorDoc.availableDays || !doctorDoc.availableDays.includes(dayName)) {
    return { availableSlots: [], bookedSlots: [], error: "Doctor not available on this day" };
  }

  const start = parseTimeToMinutes(doctorDoc.availableTime?.start);
  const end = parseTimeToMinutes(doctorDoc.availableTime?.end);
  if (start == null || end == null || start >= end) {
    return { availableSlots: [], bookedSlots: [] };
  }

  const allSlots = generateSlots(start, end);
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const existing = await Appointment.find({
    doctorId: user._id,
    date: startOfDay,
    status: { $nin: ["cancelled"] },
  }).select("timeSlot").lean();

  const bookedSet = new Set(existing.map((a) => a.timeSlot));
  let availableSlots = allSlots.filter((s) => !bookedSet.has(s));
  const bookedSlots = allSlots.filter((s) => bookedSet.has(s));

  // When the selected date is today, only show slots at least 1 hour from now
  const todayLocal = toLocalDateStr(new Date());
  if (dateStr === todayLocal) {
    const now = new Date();
    const minMinutesFromMidnight = now.getHours() * 60 + now.getMinutes() + 60; // 1 hr buffer
    availableSlots = availableSlots.filter((s) => {
      const slotMinutes = parseTimeToMinutes(s);
      return slotMinutes != null && slotMinutes >= minMinutesFromMidnight;
    });
  }

  return { availableSlots, bookedSlots };
};

export const createOrderAndHoldSlot = async (doctorId, patientId, dateStr, timeSlot, notes) => {
  const resolved = await resolveDoctor(doctorId);
  if (!resolved || !resolved.doctorDoc) {
    return { success: false, error: "Doctor not found" };
  }
  const { user, doctorDoc } = resolved;

  const { availableSlots, error } = await getAvailableSlots(doctorId, dateStr);
  if (error || !availableSlots.includes(timeSlot)) {
    return { success: false, error: "Slot not available" };
  }

  const amount = Math.round(Number(doctorDoc.consultationFee) * 100);
  if (amount <= 0) return { success: false, error: "Invalid consultation fee" };

  return {
    success: true,
    doctorId: user._id,
    patientId,
    dateStr,
    timeSlot,
    notes,
    amount,
    currency: "INR",
  };
};

export const createAppointmentAfterPayment = async (payload) => {
  const { patientId, doctorId, dateStr, timeSlot, notes, razorpayOrderId, razorpayPaymentId } = payload;
  const date = new Date(dateStr);
  date.setUTCHours(0, 0, 0, 0);

  const appointment = new Appointment({
    patientId,
    doctorId,
    date,
    timeSlot,
    notes: notes || undefined,
    status: "confirmed",
    razorpayOrderId,
    razorpayPaymentId,
  });
  await appointment.save();
  return appointment;
};

/** Get all appointments for a doctor with patient details (name, email). Sorted by date and timeSlot. */
export const getAppointmentsForDoctor = async (doctorId) => {
  const list = await Appointment.find({ doctorId })
    .populate("patientId", "name email")
    .sort({ date: 1, timeSlot: 1 })
    .lean();
  return list.map((apt) => ({
    _id: apt._id,
    date: apt.date,
    timeSlot: apt.timeSlot,
    status: apt.status,
    notes: apt.notes,
    patient: apt.patientId
      ? { _id: apt.patientId._id, name: apt.patientId.name, email: apt.patientId.email }
      : null,
  }));
};

/** Get all appointments for a patient with doctor details. Sorted by date and timeSlot. */
export const getAppointmentsForPatient = async (patientId) => {
  const list = await Appointment.find({ patientId })
    .populate("doctorId", "name email")
    .sort({ date: 1, timeSlot: 1 })
    .lean();
  const result = [];
  for (const apt of list) {
    const doctorUser = apt.doctorId;
    let doctorName = doctorUser?.name ?? "—";
    let doctorEmail = doctorUser?.email ?? null;
    let specialization = null;
    let doctorIdForProfile = doctorUser?._id ?? null;
    let slug = null;
    if (doctorUser?.email) {
      const doctorDoc = await Doctor.findOne({ userEmail: doctorUser.email }).select("specialization slug").lean();
      if (doctorDoc) {
        specialization = doctorDoc.specialization;
        slug = doctorDoc.slug ?? null;
      }
    }
    result.push({
      _id: apt._id,
      date: apt.date,
      timeSlot: apt.timeSlot,
      status: apt.status,
      notes: apt.notes,
      doctor: {
        _id: doctorIdForProfile,
        name: doctorName,
        email: doctorEmail,
        specialization,
        slug,
      },
    });
  }
  return result;
};

/** Get all appointments for admin with patient and doctor details. Sorted by date and timeSlot. */
export const getAllAppointmentsForAdmin = async () => {
  const list = await Appointment.find({})
    .populate("patientId", "name email")
    .populate("doctorId", "name email")
    .sort({ date: 1, timeSlot: 1 })
    .lean();
  const result = [];
  for (const apt of list) {
    const patient = apt.patientId
      ? { _id: apt.patientId._id, name: apt.patientId.name, email: apt.patientId.email }
      : null;
    const doctorUser = apt.doctorId;
    let doctor = null;
    if (doctorUser) {
      let specialization = null;
      if (doctorUser.email) {
        const doctorDoc = await Doctor.findOne({ userEmail: doctorUser.email }).select("specialization").lean();
        if (doctorDoc) specialization = doctorDoc.specialization;
      }
      doctor = {
        _id: doctorUser._id,
        name: doctorUser.name,
        email: doctorUser.email,
        specialization,
      };
    }
    result.push({
      _id: apt._id,
      date: apt.date,
      timeSlot: apt.timeSlot,
      status: apt.status,
      notes: apt.notes,
      patient,
      doctor,
    });
  }
  return result;
};

export default {
  getAvailableSlots,
  createOrderAndHoldSlot,
  createAppointmentAfterPayment,
  getAppointmentsForDoctor,
  getAppointmentsForPatient,
  getAllAppointmentsForAdmin,
};
