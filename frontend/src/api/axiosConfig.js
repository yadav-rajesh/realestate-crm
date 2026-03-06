import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// Automatically attach JWT to every request
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

    if (error.response && error.response.status === 401) {
      alert("Session expired. Please login again.");

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default API;