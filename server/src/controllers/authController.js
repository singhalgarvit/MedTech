import { jwtSign } from "../../utils/jwtSign.js";
import authService from "../services/authServices.js";
import {sendSignupLink, verifySignupToken, sendLoginLink, verifyLoginToken, sendForgotPasswordLink, verifyResetToken, resetPasswordWithToken} from "../services/magicLinkService.js";

const loginController = async (req, res) => {
  try {
    const data = await authService.getUser(req.body);
    const jwtToken = jwtSign(data);
    res.status(200).json({ token: jwtToken });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const signupController   = async (req, res) => {
  try {
    const data = await authService.createUser(req.body);
    const jwtToken = jwtSign(data);
    res.status(200).json({ token: jwtToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendSignupLinkController = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const result = await sendSignupLink(email, name, password);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    res.status(200).json({ message: "Check your email for the signup link." });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to send link." });
  }
};

const verifySignupController = async (req, res) => {
  try {
    const token = req.query.token || req.body?.token;
    if (!token) return res.status(400).json({ error: "Token is required." });
    const result = await verifySignupToken(token);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    res.status(200).json({ token: result.token });
  } catch (err) {
    res.status(500).json({ error: err.message || "Verification failed." });
  }
};

const sendLoginLinkController = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await sendLoginLink(email);
    if (result.error) {
      return res.status(404).json({ error: result.error });
    }
    res.status(200).json({ message: "Check your email for the login link." });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to send link." });
  }
};

const verifyLoginController = async (req, res) => {
  try {
    const token = req.query.token || req.body?.token;
    if (!token) return res.status(400).json({ error: "Token is required." });
    const result = await verifyLoginToken(token);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    res.status(200).json({ token: result.token });
  } catch (err) {
    res.status(500).json({ error: err.message || "Verification failed." });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    await sendForgotPasswordLink(email);
    res.status(200).json({ message: "If an account exists, you will receive a password reset link." });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to send link." });
  }
};

const verifyResetTokenController = async (req, res) => {
  try {
    const token = req.query.token || req.body?.token;
    if (!token) return res.status(400).json({ error: "Token is required." });
    const result = await verifyResetToken(token);
    if (!result.valid) {
      return res.status(400).json({ error: result.error });
    }
    res.status(200).json({ valid: true });
  } catch (err) {
    res.status(500).json({ error: err.message || "Verification failed." });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await resetPasswordWithToken(token, newPassword);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    res.status(200).json({ token: result.token });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to reset password." });
  }
};

export {
  loginController,
  signupController,
  sendSignupLinkController,
  verifySignupController,
  sendLoginLinkController,
  verifyLoginController,
  forgotPasswordController,
  verifyResetTokenController,
  resetPasswordController,
};
