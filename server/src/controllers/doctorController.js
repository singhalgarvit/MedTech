import doctorService from '../services/doctorService.js';
import User from '../../database/models/user.schema.js';

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
};

const getMyProfile = async (req, res) => {
    try {
        let userId = req.user._id;
        if (!userId && req.user.email) {
            const user = await User.findOne({ email: req.user.email }).select('_id').lean();
            userId = user?._id;
        }
        if (!userId) {
            return res.status(401).json({ error: 'User not found. Please login again.' });
        }
        const doctor = await doctorService.getMyProfile(userId);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor profile not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

const updateMyProfile = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const { name, clinicLocation, experience } = req.body;
        const img = req.body.img;
        const data = {};
        if (name !== undefined) data.name = name;
        if (clinicLocation !== undefined) data.clinicLocation = clinicLocation;
        if (experience !== undefined) data.experience = experience;
        if (img !== undefined) data.img = img;
        const updated = await doctorService.updateMyProfile(userEmail, data);
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

export default {
    getAllDoctors,
    getDoctorById,
    getFilterOptions,
    createDoctor,
    viewAllRegisteredDoctor,
    viewRegisteredDoctor,
    verifyDoctor,
    rejectDoctor,
    deleteDoctor,
    getMyProfile,
    updateMyProfile
};