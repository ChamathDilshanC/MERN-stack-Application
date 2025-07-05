import axios, { AxiosError } from "axios";

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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await apiClient.post("/auth/refresh-token");
        const newAccessToken = response.data?.accessToken; // Adjust property name as per your API response
        setHeader(newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 403) {
            console.error("Access token expired or invalid");
            window.location.href = "/login";
          } else {
            console.error("Error refreshing access token:", error.message);
          }
        }
      }
    }
  }
);

export default apiClient;
