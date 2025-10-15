import User from '../database/models/user.schema.js';

const userExist = (bool) =>async(req,res,next)=>{
    const isUser = await User.findOne({email:req.body.email});
    
    if(isUser && bool == true){                             //This is the logic for Login the User, if User exist and boolean is passed true it will be true;
        next();
    }
    else if(!isUser && bool == false){                      //This is the logic for Signup the User if User doesn't exist and boolean is passed false it will be true;
        next();
    }
    else if(isUser && bool == false){                       //if user exist already but the user has made signup request;
        return res.status(409).json({error:"User with this Email is Already exist."})
    }
    else{                                                   //if user does not exist but the user has made login request;
        return res.status(404).json({error:"User not found with this Email."});
    }
}

export default userExist;