import express from "express";
import { getAdminStatsController, getAllPatientsController, deletePatientController } from "../controllers/userController.js";
import { verifyToken, requireRole } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin/stats", verifyToken, requireRole(["admin"]), getAdminStatsController);
router.get("/admin/patients", verifyToken, requireRole(["admin"]), getAllPatientsController);
router.delete("/admin/patients/:id", verifyToken, requireRole(["admin"]), deletePatientController);

export default router;
