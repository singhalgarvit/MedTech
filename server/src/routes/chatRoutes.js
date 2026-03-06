import express from "express";
import { getChat, postChat, getChatLogsAdmin } from "../controllers/chatController.js";
import { verifyToken, requireRole } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getChat);
router.post("/", verifyToken, postChat);
router.get("/admin/all", verifyToken, requireRole(["admin"]), getChatLogsAdmin);

export default router;
