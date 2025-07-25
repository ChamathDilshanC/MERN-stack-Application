import type { User } from "../types/User";
import apiClient from "./apiClient";

export interface SignUpResponse {
  name: string;
  email: string;
  _id: string;
}

export interface LoginResponse {
  name: string;
  email: string;
  accessToken : string,
  _id: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export const signUp = async (userData: User): Promise<SignUpResponse> => {
  const response = await apiClient.post("/auth/signup", userData);
  return response.data;
};

export const login = async (
  loginData: Omit<User, "name">
): Promise<LoginResponse> => {
  const response = await apiClient.post("/auth/login", loginData);
  return response.data;
};

export const logout = async (): Promise<{ message: string }> => {
  const response = await apiClient.post("/auth/logout");
  return response.data;

};

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post("/auth/refresh-token");
  return response.data;
};
