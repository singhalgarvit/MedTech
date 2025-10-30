import {AuthContextProvider} from "./authContext";
import {DoctorContextProvider} from "./doctorContext";

const ContextProvider = ({children}) => {
  return (
    <DoctorContextProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </DoctorContextProvider>
  );
};

export default ContextProvider;
