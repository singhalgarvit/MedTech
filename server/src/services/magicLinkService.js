import crypto from "crypto";
import mongoose from "mongoose";
import User from "../../database/models/user.schema.js";
import MagicToken from "../../database/models/magicToken.schema.js";
import {
  sendMagicLinkEmail,
  getSignupVerifyUrl,
  getLoginVerifyUrl,
  getResetPasswordUrl,
} from "../../utils/sendEmail.js";
import { jwtSign } from "../../utils/jwtSign.js";

const TOKEN_EXPIRY_MINUTES = 15;

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function sendSignupLink(email, name, password) {
  const existing = await User.findOne({ email }).lean();
  if (existing) {
    return { error: "User with this email already exists." };
  }
  const token = generateToken();
  await MagicToken.deleteMany({ email, type: "signup" });
  await MagicToken.create({
    email,
    token,
    type: "signup",
    payload: { name: name || "", password: password || "" },
    expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000),
  });
  const url = getSignupVerifyUrl(token);
  await sendMagicLinkEmail({
    to: email,
    subject: "Verify your MedTech signup",
    text: `Click the link to verify your email and complete registration: ${url}\n\nThis link expires in ${TOKEN_EXPIRY_MINUTES} minutes.`,
    html: `<p>Click the link below to verify your email and complete registration:</p><p><a href="${url}">Verify my email</a></p><p>This link expires in ${TOKEN_EXPIRY_MINUTES} minutes.</p>`,
  });
  return { success: true };
}

export async function verifySignupToken(token) {
  const doc = await MagicToken.findOne({ token, type: "signup" }).lean();
  if (!doc) return { error: "Invalid or expired link." };
  if (new Date() > doc.expiresAt) {
    await MagicToken.deleteOne({ token });
    return { error: "Link has expired." };
  }
  const existing = await User.findOne({ email: doc.email }).lean();
  if (existing) return { error: "User already registered." };
  const password = doc.payload?.password;
  if (!password) return { error: "Invalid signup link." };
  const _id = new mongoose.Types.ObjectId();
  const user = new User({
    _id,
    name: doc.payload?.name || doc.email.split("@")[0],
    email: doc.email,
    password,
    role: "patient",
  });
  await user.save();
  await MagicToken.deleteOne({ token });
  const jwtToken = jwtSign({ _id: user._id, name: user.name, email: user.email, role: user.role });
  return { token: jwtToken };
}

export async function sendLoginLink(email) {
  const user = await User.findOne({ email }).select("name email role").lean();
  if (!user) return { error: "No account found with this email." };
  const token = generateToken();
  await MagicToken.deleteMany({ email, type: "login" });
  await MagicToken.create({
    email,
    token,
    type: "login",
    expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000),
  });
  const url = getLoginVerifyUrl(token);
  await sendMagicLinkEmail({
    to: email,
    subject: "Log in to MedTech",
    text: `Click to log in: ${url}\n\nThis link expires in ${TOKEN_EXPIRY_MINUTES} minutes.`,
    html: `<p>Click to log in:</p><p><a href="${url}">Log in to MedTech</a></p><p>This link expires in ${TOKEN_EXPIRY_MINUTES} minutes.</p>`,
  });
  return { success: true };
}

export async function verifyLoginToken(token) {
  const doc = await MagicToken.findOne({ token, type: "login" }).lean();
  if (!doc) return { error: "Invalid or expired link." };
  if (new Date() > doc.expiresAt) {
    await MagicToken.deleteOne({ token });
    return { error: "Link has expired." };
  }
  const user = await User.findOne({ email: doc.email }).select("_id name email role").lean();
  if (!user) return { error: "User not found." };
  await MagicToken.deleteOne({ token });
  const jwtToken = jwtSign({ _id: user._id, name: user.name, email: user.email, role: user.role });
  return { token: jwtToken };
}

export async function sendForgotPasswordLink(email) {
  const user = await User.findOne({ email }).lean();
  if (!user) return { success: true }; // Don't reveal if email exists
  const token = generateToken();
  await MagicToken.deleteMany({ email, type: "password_reset" });
  await MagicToken.create({
    email,
    token,
    type: "password_reset",
    expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000),
  });
  const url = getResetPasswordUrl(token);
  await sendMagicLinkEmail({
    to: email,
    subject: "Reset your MedTech password",
    text: `Click to reset your password: ${url}\n\nThis link expires in ${TOKEN_EXPIRY_MINUTES} minutes.`,
    html: `<p>Click to reset your password:</p><p><a href="${url}">Reset password</a></p><p>This link expires in ${TOKEN_EXPIRY_MINUTES} minutes.</p>`,
  });
  return { success: true };
}

export async function verifyResetToken(token) {
  const doc = await MagicToken.findOne({ token, type: "password_reset" }).lean();
  if (!doc) return { valid: false, error: "Invalid or expired link." };
  if (new Date() > doc.expiresAt) {
    await MagicToken.deleteOne({ token });
    return { valid: false, error: "Link has expired." };
  }
  return { valid: true };
}

export async function resetPasswordWithToken(token, newPassword) {
  const doc = await MagicToken.findOne({ token, type: "password_reset" }).lean();
  if (!doc) return { error: "Invalid or expired link." };
  if (new Date() > doc.expiresAt) {
    await MagicToken.deleteOne({ token });
    return { error: "Link has expired." };
  }
  const user = await User.findOne({ email: doc.email });
  if (!user) return { error: "User not found." };
  user.password = newPassword;
  await user.save();
  await MagicToken.deleteOne({ token });
  const jwtToken = jwtSign({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
  return { token: jwtToken };
}
