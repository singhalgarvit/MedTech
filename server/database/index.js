import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

    
const connectDB = async () => {
    const URI=process.env.MONGO_URI
    try {
        await mongoose.connect(URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

export default connectDB;