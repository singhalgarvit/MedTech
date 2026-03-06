import { getAllPatients, deletePatientById, getAdminStats } from "../services/userService.js";

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
