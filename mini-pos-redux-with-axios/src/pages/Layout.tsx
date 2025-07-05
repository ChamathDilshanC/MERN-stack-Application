import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/useAuth"
import { ScaleLoader } from "react-spinners";

const Layout = () => {
  const { isAuthenticating } = useAuth();

  if (isAuthenticating) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <ScaleLoader
            color="#4F46E5"
            loading={isAuthenticating}
            height={35}
            width={4}
            radius={2}
            margin={2}
          />
          <p className="mt-4 text-gray-600">💛 Loading 💛</p>
        </div>
      </div>
    );

  }
  return (
    <div className='h-screen'>
      <div className='fixed top-0 left-0 right-0 z-50'>
        <Navbar />
      </div>
      <main className='pt-16 h-full overflow-y-auto'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
