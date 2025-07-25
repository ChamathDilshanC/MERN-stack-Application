import { Navigate, Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { useAuth } from "../context/useAuth"

const AdminRoutes = () => {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) return <Navigate to='/login' />

  return (
    <div className='flex h-screen overflow-hidden'>
      <div className='flex-shrink-0'>
        <Sidebar />
      </div>
      <div className='flex-1 overflow-y-auto bg-gray-50'>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminRoutes
