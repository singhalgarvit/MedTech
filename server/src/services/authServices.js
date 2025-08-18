//This is the Services folder 
// To interact with Database and third party APIs.
import mongoose from "mongoose";
import User from "../../database/models/user.schema.js";
import jwt from "jsonwebtoken"

const jwtSecret = process.env.jwt_Secret_key;

const createUser = async(userData)=>{
    const {name,email,password} = userData;
    const _id = new mongoose.Types.ObjectId();
    const user = new User({_id,name,email,password});
    await user.save();
    const role = user.role;
    const token = jwt.sign({name,email,role},jwtSecret);
    return token;
}

const getUser = async(userData)=>{
    const {email,password} = userData;
    const {name,password:savedPassword,role} = await User.findOne({email:email});
    if(savedPassword === password){
        const token = jwt.sign({name,email,role},jwtSecret);
        return token;
    }
    else{
        throw new Error("Password is Incorrect");;
    }
}
export default {createUser,getUser}