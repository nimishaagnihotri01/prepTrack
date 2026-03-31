import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_URL;
const fallbackBaseUrl = import.meta.env.DEV ? "http://localhost:5000" : "";

const API = axios.create({
  baseURL: (configuredBaseUrl || fallbackBaseUrl).replace(/\/$/, ""),
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
