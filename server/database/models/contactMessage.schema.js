import mongoose from "mongoose";
const { Schema } = mongoose;

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const ContactMessage = mongoose.model("ContactMessage", ContactMessageSchema);
export default ContactMessage;
