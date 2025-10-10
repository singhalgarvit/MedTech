import mongoose, { mongo } from 'mongoose'
const {Schema} = mongoose;

const UserSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  img:{
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
  ]
})

const User = mongoose.model("User",UserSchema);
export default User;