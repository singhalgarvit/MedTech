  import mongoose, {mongo} from "mongoose";
const {Schema} = mongoose;

const UserSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    img: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: "patient",
      enum: ["patient", "admin", "doctor"],
    },
    doctors: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    doctorDetails: {
      specialization: {type: String},
      experience: {type: Number},
      qualification: {type: String},
      bio: {type: String},
      clinicName: {type: String},
      clinicAddress: {type: String},
      clinicLocation: {type: String},
      consultationFee: {type: Number},
      availableDays: [{type: String}], //This will be the array of days the doctor is available
      availableTime: {
        start: {type: String}, // e.g. "10:00 AM"
        end: {type: String}, // e.g. "5:00 PM"
      },
    },

    medicalHistory: [
      {
        illness: String,
        treatment: String,
        date: Date,
      },
    ],
  },
  {timestamps: true}
);

const User = mongoose.model("User", UserSchema);
export default User;
