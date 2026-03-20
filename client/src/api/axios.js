import axios from "axios";

const API = axios.create({
  baseURL: "https://preptrack-6bxk.onrender.com",
});

export default API;