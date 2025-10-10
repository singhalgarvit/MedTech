import doctorService from '../services/doctorService.js';

const getAllDoctors = async(req, res) => {
    try {
        const data = await doctorService.getAllDoctors();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getDoctorById = async(req, res) => {
    try {
        const { id } = req.params;  
        const doctor = await doctorService.getDoctorById(id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

const createDoctor = async(req, res) => {
    try {
        const doctorData = req.body;
        const newDoctor = await doctorService.createDoctor(doctorData);
        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

export default {
    getAllDoctors,
    getDoctorById,
    createDoctor
};