import mongoose from "mongoose";
import User from "../../database/models/user.schema.js";
import Doctor from "../../database/models/doctor.schema.js";
import Appointment from "../../database/models/appointment.schema.js";

/** "Dr Garvit Singhal" or "Garvit Singhal" -> "dr-garvit-singhal" */
function slugFromName(name) {
  if (!name || typeof name !== "string") return "dr-unknown";
  const base = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return base ? `dr-${base}` : "dr-unknown";
}

/** Ensure slug is unique: if taken, try slug-1, slug-2, ... */
async function ensureUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let n = 0;
  while (await Doctor.exists({ slug })) {
    n += 1;
    slug = `${baseSlug}-${n}`;
  }
  return slug;
}

/** Generate slug from name (unique) and optionally save on doctorDoc. Returns slug. */
async function getOrCreateSlugForDoctor(doctorDoc, userName) {
  if (doctorDoc.slug) return doctorDoc.slug;
  const baseSlug = slugFromName(userName);
  const slug = await ensureUniqueSlug(baseSlug);
  await Doctor.findByIdAndUpdate(doctorDoc._id, { $set: { slug } });
  return slug;
}

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
  // Ensure every doctor has a slug (lazy set for existing docs)
  for (const item of list) {
    if (!item.slug && item.email) {
      const doc = byEmail[item.email];
      if (doc) {
        const slug = await getOrCreateSlugForDoctor(doc, item.name);
        item.slug = slug;
      }
    }
  }

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

const getDoctorById = async (idOrSlug) => {
  if (!idOrSlug) return null;
  const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug) && String(new mongoose.Types.ObjectId(idOrSlug)) === String(idOrSlug);

  let user = null;
  let doctorDoc = null;

  if (isObjectId) {
    user = await User.findById(idOrSlug).select("-password").lean();
    if (user && user.role === "doctor") {
      doctorDoc = await Doctor.findOne({ userEmail: user.email }).lean();
      if (!doctorDoc) return { ...user };
    } else {
      doctorDoc = await Doctor.findById(idOrSlug).lean();
      if (!doctorDoc || !doctorDoc.isVerified) return null;
      user = await User.findOne({ email: doctorDoc.userEmail }).select("-password").lean();
      if (!user || user.role !== "doctor") return null;
    }
  } else {
    doctorDoc = await Doctor.findOne({ slug: idOrSlug, isVerified: true }).lean();
    if (!doctorDoc) return null;
    user = await User.findOne({ email: doctorDoc.userEmail }).select("-password").lean();
    if (!user || user.role !== "doctor") return null;
  }

  const { _id: _docId, userEmail, isVerified, doctorIdCard, ...doctorFields } = doctorDoc;
  let result = { ...user, ...doctorFields };
  if (!result.slug) {
    const slug = await getOrCreateSlugForDoctor(doctorDoc, user.name);
    result.slug = slug;
  }
  return result;
};

const createDoctor = async (doctorData, doctorEmail) => {
  const _id = new mongoose.Types.ObjectId();
  const { img, ...restData } = doctorData;

  const doctor = new Doctor({...restData, userEmail: doctorEmail, _id});
  await doctor.save();
  
  if (img) {
    await User.findOneAndUpdate({ email: doctorEmail }, { $set: { img } });
  }

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
  const user = await User.findOne({ email: userEmail }).select("name").lean();
  const updateDoctorModal = await Doctor.findOneAndUpdate(
    { userEmail },
    { $set: { isVerified: true } },
    { new: true }
  ).lean();
  if (!updateDoctorModal) {
    return "Doctor not Found!!";
  }
  const slug = await getOrCreateSlugForDoctor(updateDoctorModal, user?.name);
  await Doctor.findByIdAndUpdate(updateDoctorModal._id, { $set: { slug } });
  await User.findOneAndUpdate(
    { email: userEmail },
    { $set: { role: "doctor" } },
    { new: true }
  );
  return { ...updateDoctorModal, slug };
};

const rejectDoctor = async (userEmail) => {
  const rejectDoctor = await Doctor.findOneAndDelete({userEmail,isVerified:false});

  if (!rejectDoctor) {
    return "Doctor not Found!!";
  }
  return rejectDoctor;

};

const updateDoctor = async (id, doctorData) => {
  const doctor = await User.findByIdAndUpdate(id, doctorData, { new: true });
  return doctor;
};

/** Get current doctor profile by user id (for /doctor/me) */
const getMyProfile = async (userId) => {
  return getDoctorById(userId);
};

/** Update doctor's own profile: name and img (User), clinicLocation, experience (Doctor). Only provided non-empty fields are updated. */
const updateMyProfile = async (userEmail, data) => {
  const { name, clinicLocation, experience, img } = data;
  
  const userUpdate = {};
  if (name != null && String(name).trim() !== "") {
    userUpdate.name = String(name).trim();
  }
  if (img != null) {
    userUpdate.img = img;
  }
  if (Object.keys(userUpdate).length > 0) {
    await User.findOneAndUpdate({ email: userEmail }, { $set: userUpdate });
  }

  const doctorUpdate = {};
  if (clinicLocation != null && String(clinicLocation).trim() !== "") {
    doctorUpdate.clinicLocation = String(clinicLocation).trim();
  }
  if (experience != null && String(experience).trim() !== "") {
    const num = parseInt(experience, 10);
    if (!Number.isNaN(num) && num >= 0) doctorUpdate.experience = num;
  }
  if (Object.keys(doctorUpdate).length) {
    await Doctor.findOneAndUpdate({ userEmail }, { $set: doctorUpdate });
  }
  return getDoctorById((await User.findOne({ email: userEmail }).select("_id").lean())?._id);
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
  getMyProfile,
  updateMyProfile,
};
