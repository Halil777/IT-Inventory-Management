import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.10.20.77:4002";

const api = axios.create({
  baseURL,
});

export default api;
