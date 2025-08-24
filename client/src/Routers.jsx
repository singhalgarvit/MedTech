import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { useContext } from 'react'
import { AuthContext } from './context/authContext'

function Routers() {
  const {token} = useContext(AuthContext);
  return (
    <>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={token?<Navigate to="/"/>:<Login/>}/>
            <Route path='/signup' element={token?<Navigate to="/"/>:<Signup/>}/>
        </Routes>
    </>
  )
}

export default Routers