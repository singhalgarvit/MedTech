import mongoose from "mongoose";
import User from "../../database/models/user.schema.js";
import Doctor from "../../database/models/doctor.schema.js";

const getAllDoctors = async () => {
  const doctors = await User.find({role: "doctor"}).select("-password");
  return doctors;
};

const getDoctorById = async (id) => {
  const doctor = await User.findById(id).select("-password");
  return doctor;
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

const deleteDoctor = async (id) => {
  await User.findByIdAndDelete(id);
};

export default {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  viewAllRegisteredDoctors,
  viewRegisteredDoctor,
  verifyDoctor,
  rejectDoctor,
  updateDoctor,
  deleteDoctor,
};
