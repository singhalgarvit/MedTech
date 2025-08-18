import express from 'express';
const router = express.Router();
import authController from '../controllers/authController.js'
import userExist from '../../middleware/userExist.js'

router.post('/login',userExist(true),authController.login)
router.post('/signup',userExist(false),authController.signup)

export default router;