import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { useContext } from 'react'
import { AuthContext } from './context/authContext'
import Doctors from './pages/Doctors'

function Routers() {
  const {token} = useContext(AuthContext);
  return (
    <>
        <Routes>
            <Route path='/' element={token ?<Home/>:<Navigate to="/login"/>}/>
            <Route path='/login' element={token?<Navigate to="/"/>:<Login/>}/>
            <Route path='/signup' element={token?<Navigate to="/"/>:<Signup/>}/>
            <Route path='/doctors' element={token?<Doctors/>:<Navigate to="/login"/>}/>
            <Route path='/*' element={<Navigate to="/login"/>}/>
        </Routes>
    </>
  )
}

export default Routers