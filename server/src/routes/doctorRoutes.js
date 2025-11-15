import express from 'express';
const router = express.Router();
import doctorController from '../controllers/doctorController.js'
import {verifyToken, requireRole} from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { doctorSchema } from '../../validators/doctorSchema.js'


router.get('/', doctorController.getAllDoctors); //Everyone can see all the list of doctors
router.get('/:id', doctorController.getDoctorById);  // everyone can see the specific doctor detail
router.post('/register',verifyToken,validate(doctorSchema),doctorController.createDoctor) // If a user want to register himself as a doctor
router.get('/notverified/view',verifyToken,requireRole(['admin']),doctorController.viewAllRegisteredDoctor) //admin can see the whole list of doctors who are registered but not verified yet
router.get('/notverified/view/:userEmail',verifyToken,requireRole(['admin']),doctorController.viewRegisteredDoctor) //admin can see the whole list of doctors who are registered but not verified yet
router.post('/verifydoctor/:userEmail',verifyToken,requireRole(['admin']),doctorController.verifyDoctor) //The admin will hit an API with param of userEmail (the doctor who needs to be verified)
router.post('/rejectdoctor/:userEmail',verifyToken,requireRole(['admin']),doctorController.rejectDoctor) //The admin will hit an API with param of userEmail (the doctor who needs to be verified)
// router.post('/', verifyToken,validate(userSchema) ,userExists(false), requireRole(['admin']), doctorController.createDoctor);
// router.put('/:id', verifyToken, requireRole(['admin']), doctorController.updateDoctor);
// router.delete('/:id', verifyToken, requireRole(['admin']), doctorController.deleteDoctor);

export default router;
