import { createContext, useState } from "react";

const AuthContext = createContext();

const AuthContextProvider = ({children})=>{
    const [token,setToken] = useState(localStorage.getItem("token"));

    return(
        <AuthContext.Provider value={{token ,setToken}}>
            {children}
        </AuthContext.Provider> 
    )
}
export {AuthContext, AuthContextProvider}