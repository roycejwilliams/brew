import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

//interceptor request or responses before methods
//like .get() or .post()
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
