// src/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // frontend env variable
  withCredentials: true, // needed if using cookies
});

export default axiosInstance;
