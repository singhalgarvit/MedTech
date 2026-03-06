import ContactMessage from "../../database/models/contactMessage.schema.js";

export const createMessage = async (data) => {
  const { name, email, subject, message } = data;
  if (!name || !email || !subject || !message) {
    return { success: false, error: "Name, email, subject and message are required" };
  }
  const doc = new ContactMessage({ name, email, subject, message });
  await doc.save();
  return { success: true, message: doc };
};

export const getAllMessagesForAdmin = async () => {
  const list = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
  return list.map((m) => ({
    _id: m._id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    createdAt: m.createdAt,
  }));
};
