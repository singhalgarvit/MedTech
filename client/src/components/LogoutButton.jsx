import Button from './Button'
import { useAuth } from '../hooks/useAuth'
import { FiLogOut } from "react-icons/fi";

function LogoutButton({className}) {
  const { handleLogout } = useAuth();

  return (
        <Button value="Logout " icon={<FiLogOut className='inline-block '/>} disabled={false} className={`bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded border-0 ${className}`} onclick={() => handleLogout()}/>
  )
}

export default LogoutButton