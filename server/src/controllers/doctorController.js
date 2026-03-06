import doctorService from '../services/doctorService.js';

const getAllDoctors = async(req, res) => {
    try {
        const { search, location, qualification } = req.query;
        const data = await doctorService.getAllDoctors({ search, location, qualification });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getFilterOptions = async(req, res) => {
    try {
        const data = await doctorService.getFilterOptions();
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
        const doctorEmail = req.user.email;
        const newDoctor = await doctorService.createDoctor(doctorData,doctorEmail);
        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

const viewAllRegisteredDoctor = async(req,res)=>{
    try {
        const getAllRegistered = await doctorService.viewAllRegisteredDoctors();
        res.status(200).json(getAllRegistered);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

const viewRegisteredDoctor = async(req,res)=>{
    try {
        const {userEmail} = req.params;
        const getRegistered = await doctorService.viewRegisteredDoctor(userEmail);
        res.status(200).json(getRegistered);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

const verifyDoctor = async(req,res) =>{
    try {
        const { userEmail } = req.params;
        const isDoctorVerified = await doctorService.verifyDoctor(userEmail);
        res.status(200).json(isDoctorVerified)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

const rejectDoctor = async(req,res)=>{
    try {
        const {userEmail} = req.params;
        const rejectDoctor = await doctorService.rejectDoctor(userEmail);
        res.status(200).json(rejectDoctor)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await doctorService.deleteDoctorById(id);
        if (!result) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

export default {
    getAllDoctors,
    getDoctorById,
    getFilterOptions,
    createDoctor,
    viewAllRegisteredDoctor,
    viewRegisteredDoctor,
    verifyDoctor,
    rejectDoctor,
    deleteDoctor
};