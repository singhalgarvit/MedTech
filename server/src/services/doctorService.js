import mongoose from "mongoose";
import User from "../../database/models/user.schema.js";
import Doctor from "../../database/models/doctor.schema.js";
import Appointment from "../../database/models/appointment.schema.js";

const getAllDoctors = async (query = {}) => {
  const users = await User.find({ role: "doctor" }).select("-password").lean();
  const emails = users.map((u) => u.email);
  const doctorDocs = await Doctor.find({ userEmail: { $in: emails }, isVerified: true }).lean();
  const byEmail = Object.fromEntries(doctorDocs.map((d) => [d.userEmail, d]));
  let list = users.map((user) => {
    const doc = byEmail[user.email];
    if (!doc) return { ...user };
    const { userEmail, isVerified, doctorIdCard, ...doctorFields } = doc;
    return { ...user, ...doctorFields };
  });

  const search = (query.search || "").trim().toLowerCase();
  const location = (query.location || "").trim().toLowerCase();
  const qualification = (query.qualification || "").trim().toLowerCase();

  if (search) {
    list = list.filter(
      (d) =>
        (d.name && d.name.toLowerCase().includes(search)) ||
        (d.qualification && d.qualification.toLowerCase().includes(search)) ||
        (d.specialization && d.specialization.toLowerCase().includes(search))
    );
  }
  if (location) {
    list = list.filter((d) => d.clinicLocation && d.clinicLocation.toLowerCase().includes(location));
  }
  if (qualification) {
    list = list.filter((d) => d.qualification && d.qualification.toLowerCase().includes(qualification));
  }

  return list;
};

const getFilterOptions = async () => {
  const users = await User.find({ role: "doctor" }).select("email").lean();
  const emails = users.map((u) => u.email);
  const doctorDocs = await Doctor.find({ userEmail: { $in: emails }, isVerified: true })
    .select("qualification clinicLocation")
    .lean();
  const qualifications = [...new Set(doctorDocs.map((d) => d.qualification).filter(Boolean))].sort();
  const locations = [...new Set(doctorDocs.map((d) => d.clinicLocation).filter(Boolean))].sort();
  return { qualifications, locations };
};

const getDoctorById = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;
  // Try by User _id first (how doctor list links work)
  let user = await User.findById(id).select("-password").lean();
  if (user && user.role === "doctor") {
    const doctorDoc = await Doctor.findOne({ userEmail: user.email }).lean();
    if (!doctorDoc) return user;
    const { _id: _docId, userEmail, isVerified, doctorIdCard, ...doctorFields } = doctorDoc;
    return { ...user, ...doctorFields };
  }
  // Fallback: id might be Doctor collection _id (e.g. from another source)
  const doctorDoc = await Doctor.findById(id).lean();
  if (!doctorDoc || !doctorDoc.isVerified) return null;
  user = await User.findOne({ email: doctorDoc.userEmail }).select("-password").lean();
  if (!user || user.role !== "doctor") return null;
  const { _id: _docId, userEmail, isVerified, doctorIdCard, ...doctorFields } = doctorDoc;
  return { ...user, ...doctorFields };
};

const createDoctor = async (doctorData, doctorEmail) => {
  const _id = new mongoose.Types.ObjectId();
  const doctor = new Doctor({...doctorData, userEmail: doctorEmail, _id});
  await doctor.save();
  return doctor;
};

const viewAllRegisteredDoctors = async () => {
  const registeredDoctors = await Doctor.aggregate([
    {
      $match: {isVerified: false},
    },
    {
      $lookup: {
        from: "users",
        localField: "userEmail",
        foreignField: "email",
        as: "userData",
      },
    },
    {$unwind: "$userData"},
    {
      $addFields: {
        name: "$userData.name",
      },
    },
    {
      $project: {
        userData: 0,
      },
    },
  ]);
  return registeredDoctors;
};

const viewRegisteredDoctor = async (userEmail) => {
  const doctor = await Doctor.findOne({userEmail});
  if (!doctor) {
    return null;
  }
  const user = await User.findOne({email: userEmail});

  // 3. Add name to doctor object
  const doctorWithName = {
    ...doctor.toObject(),
    name: user?.name || null,
  };
  return doctorWithName;
};

const verifyDoctor = async (userEmail) => {
  const updateDoctorModal = await Doctor.findOneAndUpdate(
    {userEmail},
    {$set: {isVerified: true}},
    {new: true}
  ); //set the isVerified to true in doctor table/model
  if (!updateDoctorModal) {
    return "Doctor not Found!!";
  }
  const updateUserModal = await User.findOneAndUpdate(
    {email: userEmail},
    {$set: {role: "doctor"}},
    {new: true}
  ); // set the role to doctor in user table/model
  return updateDoctorModal;
};

const rejectDoctor = async (userEmail) => {
  const rejectDoctor = await Doctor.findOneAndDelete({userEmail,isVerified:false});

  if (!rejectDoctor) {
    return "Doctor not Found!!";
  }
  return rejectDoctor;

};

const updateDoctor = async (id, doctorData) => {
  const doctor = await User.findByIdAndUpdate(id, doctorData, {new: true});
  return doctor;
};

/** Delete doctor by User _id. Removes their appointments, Doctor document, then User. Only users with role "doctor" can be deleted. */
const deleteDoctorById = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;
  const user = await User.findById(id).select("email role").lean();
  if (!user) return null;
  if (user.role !== "doctor") return { error: "Only doctors can be deleted" };
  await Appointment.deleteMany({ doctorId: id });
  await Doctor.deleteOne({ userEmail: user.email });
  await User.findByIdAndDelete(id);
  return { deleted: true };
};

export default {
  getAllDoctors,
  getDoctorById,
  getFilterOptions,
  createDoctor,
  viewAllRegisteredDoctors,
  viewRegisteredDoctor,
  verifyDoctor,
  rejectDoctor,
  updateDoctor,
  deleteDoctorById,
};
