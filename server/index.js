//configure dotenv to access env file
import dotenv from 'dotenv';
dotenv.config();             

import { setServers } from 'dns';
if(process.env.environment ==='dev'){
    setServers(['8.8.8.8', '8.8.4.4']);
}

import express from "express";      
const app = express();

import bodyParser from 'body-parser';           //body-parser is used to streamline input and parsing the raw data coming from input and manipulate req.body
import cors from 'cors';                        //Must - used to access cross origin request access
import connectDB from './database/index.js';
import vercelConfig from './middleware/vercelConfig.js';
await connectDB();

// CORS: allow frontend origin and preflight (OPTIONS)
app.use(cors({
  origin: true, // reflect request origin (e.g. http://localhost:5173)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(vercelConfig);

app.get('/',(req,res)=>{
    res.send("Hello World");
})

//Routes of the application
import authRoutes from './src/routes/authRoutes.js'
app.use('/auth',authRoutes);


import doctorRoutes from './src/routes/doctorRoutes.js'
import appointmentRoutes from './src/routes/appointmentRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';

app.use('/doctor', doctorRoutes);
app.use('/appointment', appointmentRoutes);
app.use('/contact', contactRoutes);
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

const port = process.env.PORT;

if(process.env.environment ==='dev'){
    app.listen(port,()=>{
        console.log("Server Started");
    });
}

export default app;