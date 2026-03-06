import axios from "axios";

const BASE = `${import.meta.env.VITE_BACKEND_URL}/auth`;

const login = async (data) => {
  const res = await axios.post(`${BASE}/login`, data);
  return res;
};

const signup = async (data) => {
  const res = await axios.post(`${BASE}/signup`, data);
  return res;
};

const sendSignupLink = async (data) => {
  const res = await axios.post(`${BASE}/send-signup-link`, data);
  return res;
};

const verifySignup = async (token) => {
  const res = await axios.post(`${BASE}/verify-signup`, { token });
  return res;
};

const sendLoginLink = async (email) => {
  const res = await axios.post(`${BASE}/send-login-link`, { email });
  return res;
};

const verifyLogin = async (token) => {
  const res = await axios.post(`${BASE}/verify-login`, { token });
  return res;
};

const forgotPassword = async (email) => {
  const res = await axios.post(`${BASE}/forgot-password`, { email });
  return res;
};

const verifyResetToken = async (token) => {
  const res = await axios.get(`${BASE}/verify-reset-token`, { params: { token } });
  return res;
};

const resetPassword = async (token, newPassword) => {
  const res = await axios.post(`${BASE}/reset-password`, { token, newPassword });
  return res;
};

export {
  login,
  signup,
  sendSignupLink,
  verifySignup,
  sendLoginLink,
  verifyLogin,
  forgotPassword,
  verifyResetToken,
  resetPassword,
};
