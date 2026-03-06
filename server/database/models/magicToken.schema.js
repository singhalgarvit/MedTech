import mongoose from "mongoose";
const { Schema } = mongoose;

const MagicTokenSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true },
    token: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ["signup", "login", "password_reset"],
    },
    payload: { type: Schema.Types.Mixed }, // e.g. { name } for signup
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

MagicTokenSchema.index({ token: 1 });
MagicTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL optional

const MagicToken = mongoose.model("MagicToken", MagicTokenSchema);
export default MagicToken;
