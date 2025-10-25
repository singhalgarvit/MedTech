//configure dotenv to access env file
import dotenv from 'dotenv';
dotenv.config();                    

import express from "express";      
const app = express();

import bodyParser from 'body-parser';           //body-parser is used to streamline input and parsing the raw data coming from input and manipulate req.body
import cors from 'cors'                         //Must - used to access cross origin request access
import connectDB from './database/index.js'
import vercelConfig from './middleware/vercelConfig.js';
await connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());
app.use(vercelConfig);

app.get('/',(req,res)=>{
    res.send("Hello World");
})

//Routes of the application
import authRoutes from './src/routes/authRoutes.js'
app.use('/auth',authRoutes);


import doctorRoutes from './src/routes/doctorRoutes.js'
app.use('/doctor',doctorRoutes);   

const port = process.env.PORT;

// app.listen(port,()=>{
//     console.log("Server Started");
// });

export default app;