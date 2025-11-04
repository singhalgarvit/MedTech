import express from "express";
const router = express.Router();
import {verifyToken} from "../../middleware/authMiddleware.js";
import chatController from "../controllers/chatController.js";

router.post("/", verifyToken, chatController.sendQuery);

export default router;
