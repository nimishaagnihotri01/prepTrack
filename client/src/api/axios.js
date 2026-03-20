import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://preptrack-6bxk.onrender.com/api",
});

export default API;