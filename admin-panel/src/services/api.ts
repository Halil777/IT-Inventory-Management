import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://80.78.243.221:4002";

const api = axios.create({
  baseURL,
});

export default api;
