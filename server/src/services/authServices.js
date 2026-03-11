//This is the Services folder 
// To interact with Database and third party APIs.
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../../database/models/user.schema.js";


const createUser = async(userData)=>{
    const {name,email,password} = userData;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const _id = new mongoose.Types.ObjectId();
    const user = new User({_id,name,email,password:hashedPassword});
    await user.save();
    const role = user.role;
    // img defaults to ""
    return { _id: user._id, name, email, role, img: user.img };
}

const getUser = async(userData)=>{
    const {email,password} = userData;
    const user = await User.findOne({email:email});
    if(!user) {
        throw new Error("User does not exist");
    }
    const {name,password:savedPassword,role,img} = user;
    const isMatch = await bcrypt.compare(password, savedPassword);
    if(isMatch){
        return { _id: user._id, name, email, role, img };
    }
    else{
        throw new Error("Password is Incorrect");
    }
}
export default {createUser,getUser}