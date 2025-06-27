import axios from "axios"

export const BASE_URL = "http://localhost:3000/api"

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export default apiClient
