import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { useContext } from 'react'
import { AuthContext } from './context/authContext'
import Doctors from './pages/Doctors'
import ProtectedRoute from './ProtectedRoute'
import Dashboard from './pages/Dashboards/Dashboard'
import Chatbot from './pages/Chatbot'

function Routers() {
  const {token} = useContext(AuthContext);
  return (
    <>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={token?<Navigate to="/"/>:<Login/>}/>
            <Route path='/signup' element={token?<Navigate to="/"/>:<Signup/>}/>
            <Route path='/doctors' element={<Doctors/>}/>
            <Route path='/chat' element={<ProtectedRoute allowedRoles={['admin','doctor','patient']}><Chatbot/></ProtectedRoute>}/>
            <Route path='/dashboard/*' element={<ProtectedRoute allowedRoles={['admin','doctor','patient']}><Dashboard/></ProtectedRoute>}/>
            <Route path='/*' element={<Navigate to="/"/>}/>
        </Routes>
    </>
  )
}

export default Routers