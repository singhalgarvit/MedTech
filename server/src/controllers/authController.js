import {jwtSign} from "../../utils/jwtSign.js";
import authService from "../services/authServices.js";

const login = async (req, res) => {
  try {
    const data = await authService.getUser(req.body);
    const jwtToken = jwtSign(data);
    res.status(200).json({token:jwtToken});
  } catch (err) {
    res.status(401).json({error: err.message});
  }
};
const signup = async (req, res) => {
  try {
    const data = await authService.createUser(req.body);
    const jwtToken = jwtSign(data);
    res.status(200).json({token:jwtToken});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
};

export default {login, signup};
