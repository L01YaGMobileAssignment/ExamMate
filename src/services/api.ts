import axios from "axios";
import { clearAuth, getToken } from "../store/secureStore";
import { resetAndNavigate } from "../navigation/navigationRef";
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001",
  timeout: 180000,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  config => {
    const load = async () => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (config.data instanceof FormData) {
        if (config.headers && typeof (config.headers as any).delete === 'function') {
          (config.headers as any).delete("Content-Type");
        } else if (config.headers) {
          delete config.headers["Content-Type"];
        }
      }
      return config;
    };
    return load();
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    const handleError = async () => {
      if (error.response?.status === 401) {
        await clearAuth();
        resetAndNavigate("Login");
      }
      if (error.response?.status === 403) {
      }
      if (error.response?.status >= 500) {
      }
      return Promise.reject(error);
    };
    return handleError();
  }
);

export default api;
