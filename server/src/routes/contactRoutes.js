import express from "express";
import { submitMessage, getAllMessagesAdmin } from "../controllers/contactController.js";
import { verifyToken, requireRole } from "../../middleware/authMiddleware.js";

const router = express.Router();

    router.post("/", submitMessage);
router.get("/admin/all", verifyToken, requireRole(["admin"]), getAllMessagesAdmin);

export default router;
