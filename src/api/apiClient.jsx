// src/api/apiClient.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api";

// Client cho các API công khai (public)
const publicApiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
});

// Gắn token cho public API nếu có (để user đã đăng nhập có thể truy cập dữ liệu của mình)
publicApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gắn interceptor cho publicApiClient để xử lý lỗi
publicApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging but don't spam console
    if (error.response?.status !== 401) {
      console.error('Public API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method,
        message: error.message
      });
    }
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Silent handling for unauthenticated requests
      return Promise.reject(error);
    } else if (error.response?.status === 403) {
      console.warn('Access forbidden:', error.config?.url);
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.config?.url);
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
