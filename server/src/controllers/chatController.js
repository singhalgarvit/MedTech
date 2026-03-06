import { getChatByUserId, saveChat, getAllChatLogsForAdmin } from "../services/chatService.js";
import User from "../../database/models/user.schema.js";

const resolveUserId = async (req) => {
  let userId = req.user._id;
  if (!userId && req.user.email) {
    const user = await User.findOne({ email: req.user.email }).select("_id").lean();
    userId = user?._id;
  }
  return userId;
};

export const getChat = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "User not found. Please login again." });
    }
    const { messages } = await getChatByUserId(userId);
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ error: "Failed to load chat", details: err.message });
  }
};

export const postChat = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "User not found. Please login again." });
    }
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages must be an array" });
    }
    await saveChat(userId, messages);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save chat", details: err.message });
  }
};

export const getChatLogsAdmin = async (req, res) => {
  try {
    const logs = await getAllChatLogsForAdmin();
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to load chat logs", details: err.message });
  }
};
