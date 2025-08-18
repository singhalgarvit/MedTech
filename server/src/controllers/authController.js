import authService from '../services/authServices.js'

const login = async(req,res)=>{
    try{
        const jwtToken = await authService.getUser(req.body);
        console.log(jwtToken)
        res.status(200).send(jwtToken);
    }
    catch(err){
        res.status(500).json("Something Went Wrong !!!");
    }
}
const signup = async(req,res)=>{
    try{
        const jwtToken = await authService.createUser(req.body);
        res.status(200).send(jwtToken);
    }
    catch(err){
        res.status(500).json("Something Went Wrong !!!");
    }
}

export default {login,signup};