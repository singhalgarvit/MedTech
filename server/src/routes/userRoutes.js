import express from "express";
import { getAdminStatsController, getAllPatientsController, deletePatientController, getProfile, updateProfile } from "../controllers/userController.js";
import { verifyToken, requireRole } from "../../middleware/authMiddleware.js";

const router = express.Router();

import { multerUpload, cloudinaryUploadProfileImgOptional } from "../../middleware/uploadMiddleware.js";

router.get("/admin/stats", verifyToken, requireRole(["admin"]), getAdminStatsController);
router.get("/admin/patients", verifyToken, requireRole(["admin"]), getAllPatientsController);
router.delete("/admin/patients/:id", verifyToken, requireRole(["admin"]), deletePatientController);

router.get("/profile", verifyToken, requireRole(["patient"]), getProfile);
router.put(
  "/profile",
  verifyToken,
  requireRole(["patient"]),
  multerUpload.single("img"),
  cloudinaryUploadProfileImgOptional,
  updateProfile
);

export default router;
