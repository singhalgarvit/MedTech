import {AuthContextProvider} from "./AuthContext";
import {DoctorContextProvider} from "./DoctorContext";

const ContextProvider = ({children}) => {
  return (
    <DoctorContextProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </DoctorContextProvider>
  );
};

export default ContextProvider;
