import User from "../../database/models/user.schema.js";
import Appointment from "../../database/models/appointment.schema.js";
import Doctor from "../../database/models/doctor.schema.js";
import Chat from "../../database/models/chat.schema.js";

/** Get start/end of today in UTC (for appointment date comparison). */
function getTodayRangeUTC() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
  return { start, end };
}

/** Get start/end of current month in UTC. */
function getThisMonthRangeUTC() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));
  return { start, end };
}

/** Admin dashboard stats: counts for patients, doctors, appointments, AI searches, new users. */
export const getAdminStats = async () => {
  const { start: todayStart, end: todayEnd } = getTodayRangeUTC();
  const { start: monthStart, end: monthEnd } = getThisMonthRangeUTC();

  const [
    totalPatients,
    totalDoctors,
    appointmentsToday,
    appointmentsThisMonth,
    totalAiSearchesResult,
    newUsersToday,
    newUsersThisMonth,
  ] = await Promise.all([
    User.countDocuments({ role: "patient" }),
    Doctor.countDocuments({ isVerified: true }),
    Appointment.countDocuments({ date: { $gte: todayStart, $lte: todayEnd }, status: { $ne: "cancelled" } }),
    Appointment.countDocuments({ date: { $gte: monthStart, $lte: monthEnd }, status: { $ne: "cancelled" } }),
    Chat.aggregate([
      { $project: { userMessages: { $size: { $filter: { input: "$messages", as: "m", cond: { $eq: ["$$m.role", "user"] } } } } } },
      { $group: { _id: null, total: { $sum: "$userMessages" } } },
    ]),
    User.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
    User.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } }),
  ]);

  const totalAiSearches = totalAiSearchesResult[0]?.total ?? 0;

  return {
    totalPatients,
    totalDoctors,
    appointmentsToday,
    appointmentsThisMonth,
    totalAiSearches,
    newUsersToday,
    newUsersThisMonth,
  };
};

/** Get all patients (role === 'patient') for admin. Excludes password. */
export const getAllPatients = async () => {
  const users = await User.find({ role: "patient" })
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();
  return users.map((u) => ({
    _id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
  }));
};

/** Delete a patient by id. Only users with role 'patient' can be deleted. Returns deleted user or null. */
export const deletePatientById = async (id) => {
  const user = await User.findById(id).select("role").lean();
  if (!user) return null;
  if (user.role !== "patient") return { error: "Only patients can be deleted" };
  await Appointment.deleteMany({ patientId: id });
  await User.findByIdAndDelete(id);
  return { deleted: true };
};

export const getPatientProfile = async (userId) => {
  const user = await User.findById(userId).select("-password").lean();
  return user;
};

export const updatePatientProfile = async (userId, data) => {
  const { name, img } = data;
  const updateData = {};
  if (name != null && String(name).trim() !== "") {
    updateData.name = String(name).trim();
  }
  if (img != null) {
    updateData.img = img;
  }
  
  if (Object.keys(updateData).length > 0) {
    const user = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select("-password").lean();
    return user;
  }
  return await getPatientProfile(userId);
};
