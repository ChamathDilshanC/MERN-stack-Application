import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const setHeader = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Set Authorization header if token exists
  } else {
    delete apiClient.defaults.headers.common["Authorization"]; // Remove Authorization header if no token
  }
};

export default apiClient;
