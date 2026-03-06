import { jwtDecode } from "jwt-decode";

const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded._id ?? null;
  } catch {
    return null;
  }
};

export default getUserId;
