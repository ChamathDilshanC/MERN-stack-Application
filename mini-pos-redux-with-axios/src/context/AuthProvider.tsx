import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { setHeader } from "../services/apiClient";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

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

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
