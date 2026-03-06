import { createMessage, getAllMessagesForAdmin } from "../services/contactService.js";

export const submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const result = await createMessage({ name, email, subject, message });
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message", details: err.message });
  }
};

export const getAllMessagesAdmin = async (req, res) => {
  try {
    const messages = await getAllMessagesForAdmin();
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages", details: err.message });
  }
};
