// src/api/apiClient.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api";

// Client cho các API công khai (public)
const publicApiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
});

// Client cho các API của Admin (private, cần token)
const privateApiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}/admin`,
});

// Gắn token vào mỗi request của admin
privateApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý tự động khi token hết hạn (401 Unauthorized)
privateApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login"; // Chuyển về trang login
    }
    return Promise.reject(error);
  }
);

export { publicApiClient, privateApiClient };
