import {login, signup} from "../services/authService";

export const useAuth = () => {
  const handleLogin = async (data) => {
    try {
      const token = await login(data);
      return token;
    } catch (err) {
      throw err;
    }
  };
  const handleSignup = async (data) => {
    try {
      const token = await signup(data);
      return token;
    } catch (err) {
      throw err;
    }
  };
  return {handleLogin,handleSignup};
};
