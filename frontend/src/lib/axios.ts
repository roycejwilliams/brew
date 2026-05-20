import { useUserStore } from "@/stores/useUserStore";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthRoute = url.includes("/auth/");

    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !isAuthRoute
    ) {
      useUserStore.getState().clearUser();
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
