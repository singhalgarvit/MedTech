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

/** For admin: get all users' chat history as flat list of { user, query, answer } */
export const getAllChatLogsForAdmin = async () => {
  const docs = await Chat.find({})
    .populate("userId", "name email")
    .lean();
  const logs = [];
  for (const doc of docs) {
    const user = doc.userId;
    const userName = user?.name ?? "—";
    const userEmail = user?.email ?? "—";
    const userId = doc.userId?._id ?? doc.userId;
    const messages = doc.messages || [];
    for (let i = 0; i < messages.length - 1; i += 2) {
      const m1 = messages[i];
      const m2 = messages[i + 1];
      if (m1?.role === "user" && m2?.role === "assistant") {
        logs.push({
          userId,
          userName,
          userEmail,
          query: m1.content,
          answer: m2.content,
        });
      }
    }
  }
  return logs;
};
