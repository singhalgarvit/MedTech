import mongoose from "mongoose";
import User from "../../database/models/user.schema.js";

const getAllDoctors = async()=>{
    const doctors = await User.find({role:"doctor"}).select('-password');
    return doctors;
}

const getDoctorById = async(id)=>{
    const doctor = await User.findById(id).select('-password');
    return doctor;
}

const createDoctor = async(doctorData)=>{
    const _id = new mongoose.Types.ObjectId();
    const doctor = new User({...doctorData, _id, role:"doctor"});
    await doctor.save();
    return doctor;
}

const updateDoctor = async(id, doctorData)=>{
    const doctor = await User.findByIdAndUpdate(id, doctorData, {new: true});
    return doctor;
}

const deleteDoctor = async(id)=>{
    await User.findByIdAndDelete(id);
}

export default {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
};
