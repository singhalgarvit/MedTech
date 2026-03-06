import Chat from "../../database/models/chat.schema.js";

export const getChatByUserId = async (userId) => {
  const doc = await Chat.findOne({ userId }).lean();
  if (!doc) return { messages: [] };
  return { messages: doc.messages || [] };
};

export const saveChat = async (userId, messages) => {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return { success: true };
  }
  await Chat.findOneAndUpdate(
    { userId },
    { $set: { messages } },
    { upsert: true, new: true }
  );
  return { success: true };
};
