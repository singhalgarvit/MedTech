import mongoose from "mongoose";
const {Schema} = mongoose;

const DoctorSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userEmail: {
      type: String,
      ref: "User",
      required: true,
      unique: true,
    },
    img: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    clinicName: {
      type: String,
      required: true,
    },
    clinicAddress: {
      type: String,
      required: true,
    },
    clinicLocation: {
      type: String,
      required: true,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    availableDays: [{type: String}], //This will be the array of days the doctor is available
    availableTime: {
      start: {type: String}, // e.g. "10:00 AM"
      end: {type: String}, // e.g. "5:00 PM"
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    doctorIdCard: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

const Doctor = mongoose.model("Doctor", DoctorSchema);
export default Doctor;
