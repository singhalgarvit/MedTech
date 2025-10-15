import express from 'express';
const router = express.Router();
import doctorController from '../controllers/doctorController.js'
import {verifyToken, requireRole} from '../../middleware/authMiddleware.js';
import userExists from '../../middleware/userExist.js';
import { validate } from '../../middleware/validate.js';
import { userSchema } from '../../validators/userSchema.js';


router.get('/', verifyToken, doctorController.getAllDoctors);
router.get('/:id', verifyToken, doctorController.getDoctorById);
router.post('/', verifyToken,validate(userSchema) ,userExists(false), requireRole(['admin']), doctorController.createDoctor);
// router.put('/:id', verifyToken, requireRole(['admin']), doctorController.updateDoctor);
// router.delete('/:id', verifyToken, requireRole(['admin']), doctorController.deleteDoctor);

export default router;
