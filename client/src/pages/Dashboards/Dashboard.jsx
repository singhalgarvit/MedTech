import { Navigate } from "react-router-dom";
import getRole from "../../utils/getRole";
import AdminDashboard from "./AdminDashboard";
import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard"


function Dashboard() {

    const role = getRole();

  return (
    <>
        {role === 'admin' && <AdminDashboard />}
        {role === 'patient' && <PatientDashboard />}
        {role === 'doctor' && <DoctorDashboard />}
    </>
  )
}

export default Dashboard