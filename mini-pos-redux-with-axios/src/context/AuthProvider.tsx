import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { setHeader } from "../services/apiClient";
import router from "../router";
import { refreshToken } from "../services/authService";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);

  const login = (token : string) => {
    setIsLoggedIn(true)
    setAccessToken(token);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  useEffect(() =>{
    setHeader(accessToken)
  },[accessToken])

  useEffect(() => {
    const tryRefresh = async () => {
      setIsAuthenticating(true);
      try {
        const res = await refreshToken();
        console.log(res);
        setAccessToken(res.accessToken);
        setIsLoggedIn(true);

        const currentPath = window.location.pathname; // <-- Replace if your router has a different way
        if (
          currentPath === "/" ||
          currentPath === "/login" ||
          currentPath === "/signup"
        ) {
          router.navigate("/dashboard");
        }
      } catch {
        setAccessToken("");
        setIsLoggedIn(false);
      }finally{
        setHeader(accessToken);
        setIsAuthenticating(false);
      }
    };
    tryRefresh();
  }, []);


  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout ,isAuthenticating }}>
      {children}
    </AuthContext.Provider>
  );
};
