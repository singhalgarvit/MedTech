import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupVerify from "./pages/SignupVerify";
import LoginVerify from "./pages/LoginVerify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Services from "./pages/Services";
import Help from "./pages/Help";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./pages/Dashboards/Dashboard";
import Chatbot from "./pages/Chatbot";
import Register from "./pages/Register";

function Routers() {
  const {token} = useContext(AuthContext);
  return (
    <>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
            <Route path="/signup" element={token ? <Navigate to="/" /> : <Signup />} />
            <Route path="/signup/verify" element={token ? <Navigate to="/" /> : <SignupVerify />} />
            <Route path="/login/verify" element={token ? <Navigate to="/" /> : <LoginVerify />} />
            <Route path="/forgot-password" element={token ? <Navigate to="/" /> : <ForgotPassword />} />
            <Route path="/reset-password" element={token ? <Navigate to="/" /> : <ResetPassword />} />
            <Route path='/doctors' element={<Doctors/>}/>
            <Route path='/doctors/:id' element={<DoctorProfile/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/services' element={<Services/>}/>
            <Route path='/help' element={<Help/>}/>
            <Route path='/faqs' element={<FAQ/>}/>
            <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
            <Route path='/terms-of-service' element={<TermsOfService/>}/>
            <Route path='/contact' element={<Contact/>}/>
            <Route path='/register' element={<ProtectedRoute allowedRoles={['patient']}><Register/></ProtectedRoute>}/>
            <Route path='/chat' element={<ProtectedRoute allowedRoles={['admin','doctor','patient']}><Chatbot/></ProtectedRoute>}/>
            <Route path='/dashboard/*' element={<ProtectedRoute allowedRoles={['admin','doctor','patient']}><Dashboard/></ProtectedRoute>}/>
            <Route path='/*' element={<Navigate to="/"/>}/>
        </Routes>
    </>
  )
}

export default Routers