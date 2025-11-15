import express from 'express';
const router = express.Router();
import authController from '../controllers/authController.js'
import userExist from '../../middleware/userExist.js'
import {validate} from '../../middleware/validate.js'
import { loginSchema, signupSchema } from '../../validators/userSchema.js'

router.post('/login',validate(loginSchema),userExist(true),authController.login)
router.post('/signup',validate(signupSchema),userExist(false),authController.signup)

export default router;