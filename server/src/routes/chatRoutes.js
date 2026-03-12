import express from "express";
import { getChat, postChat, getChatLogsAdmin, deleteChatAdmin } from "../controllers/chatController.js";
import { verifyToken, requireRole } from "../../middleware/authMiddleware.js";
import { chat, syncDoctors } from "../controllers/aiController.js";

const router = express.Router();

router.get("/", verifyToken, getChat);
router.post("/", verifyToken, postChat);
router.get("/admin/all", verifyToken, requireRole(["admin"]), getChatLogsAdmin);
router.delete("/admin/:userId/messages", verifyToken, requireRole(["admin"]), deleteChatAdmin);
router.post("/ai", chat);
router.post("/sync", syncDoctors);

export default router;
