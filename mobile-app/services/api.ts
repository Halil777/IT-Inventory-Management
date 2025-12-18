import axios from "axios";

const baseURL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://80.78.243.22:4002";

const api = axios.create({
  baseURL,
});

export default api;
