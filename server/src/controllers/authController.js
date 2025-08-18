import jwtSign from '../../utils/jwtSign.js';
import authService from '../services/authServices.js'

const login = async(req,res)=>{
    try{
        const data = await authService.getUser(req.body);
        const jwtToken = jwtSign(data);
        res.status(200).send(jwtToken);
    }
    catch(err){
        res.status(500).json("Something Went Wrong !!!");
    }
}
const signup = async(req,res)=>{
    try{
        const data = await authService.createUser(req.body);
        const jwtToken = jwtSign(data);
        res.status(200).send(jwtToken);
    }
    catch(err){
        res.status(500).json("Something Went Wrong !!!"+err);
    }
}

export default {login,signup};