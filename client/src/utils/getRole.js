import { jwtDecode } from "jwt-decode";

const getRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.role; 
    } catch (error) {
        console.error("Token decoding failed", error);
        return null;
    }
};

export default getRole;