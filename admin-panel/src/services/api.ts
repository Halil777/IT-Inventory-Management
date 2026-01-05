import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://10.10.20.77:4002";

const api = axios.create({
  baseURL,
});

export default api;
