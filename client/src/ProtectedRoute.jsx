import getRole from './utils/getRole'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children, allowedRoles}) {
  const role = getRole()

  if(!role || !allowedRoles.includes(role)){
    return  <Navigate to="/"/>
  }

  return children;
}

export default ProtectedRoute