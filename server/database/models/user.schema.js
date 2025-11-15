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
    role: {
      type: String,
      required: true,
      default: "patient",
      enum: ["patient", "admin", "doctor"],
    },
    doctors: [
      {
        type: Schema.Types.ObjectId,
        ref:"Doctor"
      },
    ],

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
