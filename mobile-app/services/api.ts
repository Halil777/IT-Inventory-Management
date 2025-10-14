import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api", // Adjust the base URL according to your backend configuration
});

export default api;
