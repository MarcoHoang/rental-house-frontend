// src/api/apiClient.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api";

// Client cho các API công khai (public)
const publicApiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
});

// Gắn interceptor cho publicApiClient để xử lý lỗi
publicApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Public API Error:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Client cho các API của Admin (private, cần token)
const privateApiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}/admin`,
});

// Client cho các API của Host (private, cần token)
const hostApiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
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

// Gắn token vào mỗi request của host
hostApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý tự động khi token hết hạn (401 Unauthorized) - Admin
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

// Xử lý tự động khi token hết hạn (401 Unauthorized) - Host
hostApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Chuyển về trang login
    }
    return Promise.reject(error);
  }
);

export { publicApiClient, privateApiClient, hostApiClient };
