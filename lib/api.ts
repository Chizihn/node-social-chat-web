// lib/api.ts
import { API_URL } from "@/constants";
import { axiosErrorHandler } from "@/utils/error";
import { cookieStorage } from "@/utils/session";
import axios, { AxiosInstance } from "axios";

// Create the API instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = cookieStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle expired/invalid token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = axiosErrorHandler(error);
    const status = error.response?.status;
    const message = errorMessage || "";

    // Check for auth errors
    if (
      status === 401 ||
      status === 403 ||
      message.toLowerCase().includes("jwt expired") ||
      message.toLowerCase().includes("token expired")
    ) {
      console.log("Token is expired or invalid");

      // Clear cookies
      cookieStorage.removeItem("token");
      cookieStorage.removeItem("chat-auth");

      // Clear localStorage if available
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem("auth");
      }

      // Handle logout in a safe way
      if (typeof window !== "undefined") {
        // Use dynamic import to avoid server-side issues
        import("@/store/useAuthStore")
          .then(({ useAuthStore }) => {
            useAuthStore.getState().logout();
            // Use client-side navigation instead of redirect
            window.location.href = "/login";
          })
          .catch(() => {
            // If store import fails, just redirect
            window.location.href = "/login";
          });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
