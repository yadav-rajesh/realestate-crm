import axios from "axios";
import { clearAuthSession, redirectToLogin } from "../utils/auth";

export const API_BASE_URL = "http://localhost:8080";

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession();
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export default API;
