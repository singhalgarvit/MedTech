import express from "express";
const router = express.Router();
import {loginController,
  signupController,
  sendSignupLinkController,
  verifySignupController,
  sendLoginLinkController,
  verifyLoginController,
  forgotPasswordController,
  verifyResetTokenController,
  resetPasswordController} from "../controllers/authController.js";
import userExist from "../../middleware/userExist.js";
import { validate } from "../../middleware/validate.js";
import {
  loginSchema,
  signupSchema,
  sendSignupLinkSchema,
  magicLinkEmailSchema,
  resetPasswordSchema,
} from "../../validators/userSchema.js";

router.post("/login", validate(loginSchema), userExist(true), loginController);
router.post("/signup", validate(signupSchema), userExist(false), signupController);

router.post("/send-signup-link", validate(sendSignupLinkSchema), sendSignupLinkController);
router.get("/verify-signup", verifySignupController);
router.post("/verify-signup", verifySignupController);

router.post("/send-login-link", validate(magicLinkEmailSchema), sendLoginLinkController);
router.get("/verify-login", verifyLoginController);
router.post("/verify-login", verifyLoginController);

router.post("/forgot-password", validate(magicLinkEmailSchema), forgotPasswordController);
router.get("/verify-reset-token", verifyResetTokenController);
router.post("/verify-reset-token", verifyResetTokenController);
router.post("/reset-password", validate(resetPasswordSchema), resetPasswordController);

export default router;