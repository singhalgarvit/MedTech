import axios from "axios";

const login = async (data) => {
  const URL = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;
  const res = await axios.post(URL, data);
  return res;
};
const signup = async (data) => {
  const URL = `${import.meta.env.VITE_BACKEND_URL}/auth/signup`;
  const res = await axios.post(URL, data);
  return res;
};

export {login,signup};
