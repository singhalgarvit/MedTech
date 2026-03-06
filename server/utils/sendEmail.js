/**
 * Magic link emails. Set in .env:
 * SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM (optional), FRONTEND_URL
 */
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const from = process.env.SMTP_FROM || process.env.SMTP_USER || "MedTech <noreply@medtech.com>";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

export async function sendMagicLinkEmail({ to, subject, html, text }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP not configured. Magic link email (to " + to + "): " + (text || subject));
    return;
  }
  await transporter.sendMail({
    from,
    to,
    subject,
    html: html || text,
    text: text || html?.replace(/<[^>]*>/g, ""),
  });
}

/** Send a generic email (e.g. appointment confirmations). */
export async function sendEmail({ to, subject, html, text }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP not configured. Email to " + to + ": " + (subject || text));
    return;
  }
  await transporter.sendMail({
    from,
    to,
    subject,
    html: html || text,
    text: text || (html && html.replace(/<[^>]*>/g, "")) || subject,
  });
}

export function getSignupVerifyUrl(token) {
  return `${frontendUrl}/signup/verify?token=${encodeURIComponent(token)}`;
}

export function getLoginVerifyUrl(token) {
  return `${frontendUrl}/login/verify?token=${encodeURIComponent(token)}`;
}

export function getResetPasswordUrl(token) {
  return `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;
}

export { frontendUrl };
