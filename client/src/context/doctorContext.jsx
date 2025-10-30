import { createContext, useState } from "react";

const DoctorContext = createContext();

const DoctorContextProvider = ({children})=>{
    const [doctorsList,setDoctorsList] = useState(null);

    return(
        <DoctorContext.Provider value={{doctorsList ,setDoctorsList}}>
            {children}
        </DoctorContext.Provider> 
    )
}
export {DoctorContext, DoctorContextProvider}