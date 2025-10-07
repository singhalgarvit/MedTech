import {useContext} from "react";
import {login, signup} from "../services/authService";
import {AuthContext} from "../context/authContext";

export const useAuth = () => {
  const {token, setToken} = useContext(AuthContext);

  const handleLogin = async (data) => {
    try {
      const res = await login(data);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      throw err;
    }
  };

  const handleSignup = async (data) => {
    try {
      const res = await signup(data);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      throw err;
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };
  
  return {handleLogin, handleSignup, handleLogout};
};
