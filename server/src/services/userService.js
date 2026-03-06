import User from "../../database/models/user.schema.js";
import Appointment from "../../database/models/appointment.schema.js";

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
