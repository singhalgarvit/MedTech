import mongoose from "mongoose";
const { Schema } = mongoose;

const AppointmentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "rejected", "no_show"],
      default: "pending",
    },
    amount: { type: Number }, // consultation fee in INR at time of booking (for earnings)
    notes: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { timestamps: true }
);

AppointmentSchema.index({ doctorId: 1, date: 1, timeSlot: 1 });

const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment;
