import { getAllPatients, deletePatientById, getAdminStats, getPatientProfile, updatePatientProfile } from "../services/userService.js";
import User from "../../database/models/user.schema.js";

export const getAdminStatsController = async (req, res) => {
  try {
    const stats = await getAdminStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

export const getAllPatientsController = async (req, res) => {
  try {
    const patients = await getAllPatients();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

export const deletePatientController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deletePatientById(id);
    if (!result) {
      return res.status(404).json({ error: "Patient not found" });
    }
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    let patientId = req.user._id;
    if (!patientId && req.user.email) {
      const user = await User.findOne({ email: req.user.email }).select("_id").lean();
      patientId = user?._id;
    }
    if (!patientId) {
      return res.status(401).json({ error: "User not found. Please login again." });
    }
    
    const profile = await getPatientProfile(patientId);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to load profile", details: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    let patientId = req.user._id;
    if (!patientId && req.user.email) {
      const user = await User.findOne({ email: req.user.email }).select("_id").lean();
      patientId = user?._id;
    }
    if (!patientId) {
      return res.status(401).json({ error: "User not found. Please login again." });
    }

    const data = { ...req.body };
    if (req.body.imgUrl) {
      // Set by Cloudinary middleware
      data.img = req.body.imgUrl;
    }
    
    const updatedProfile = await updatePatientProfile(patientId, data);
    res.status(200).json({ success: true, profile: updatedProfile });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile", details: err.message });
  }
};
