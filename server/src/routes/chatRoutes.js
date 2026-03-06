import express from "express";
import {getChat, postChat} from "../controllers/chatController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getChat);
router.post("/", verifyToken, postChat);

export default router;
