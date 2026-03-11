import express from "express";
import appointmentController from "../controllers/appointmentController.js";
import { verifyToken, requireRole } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/doctor/my-appointments", verifyToken, requireRole(["doctor"]), appointmentController.getMyAppointments);
router.get("/doctor/earnings", verifyToken, requireRole(["doctor"]), appointmentController.getDoctorEarnings);
router.patch("/:id/status", verifyToken, requireRole(["doctor"]), appointmentController.updateAppointmentStatus);
router.get("/patient/my-appointments", verifyToken, requireRole(["patient", "doctor"]), appointmentController.getMyAppointmentsPatient);
router.get("/admin/all", verifyToken, requireRole(["admin"]), appointmentController.getAllAppointmentsAdmin);
router.get("/slots/:doctorId", appointmentController.getSlots);
router.get("/calendar-event", appointmentController.getCalendarEvent);
router.post("/create-order", verifyToken, requireRole(["patient", "doctor"]), appointmentController.createOrder);
router.post("/verify", verifyToken, requireRole(["patient", "doctor"]), appointmentController.verifyPayment);

export default router;
