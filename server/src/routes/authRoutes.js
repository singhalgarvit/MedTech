import express from 'express';
const router = express.Router();
import authController from '../controllers/authController.js'
import userExist from '../../middleware/userExist.js'
import {validate} from '../../middleware/validate.js'
import { userSchema } from '../../validators/userSchema.js'

router.post('/login',validate(userSchema),userExist(true),authController.login)
router.post('/signup',validate(userSchema),userExist(false),authController.signup)

export default router;