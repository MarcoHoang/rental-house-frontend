// src/api/adminApi.jsx

import axios from "axios";

// --- CẤU HÌNH TRUNG TÂM ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api";

// 1. Chỉ một instance duy nhất cho toàn bộ file
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Gắn Interceptor vào instance duy nhất này
//    Nó sẽ tự động thêm token vào MỌI request cần xác thực.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Đảm bảo MỌI HÀM đều dùng apiClient và có API_PREFIX
//    để tạo ra URL chính xác (ví dụ: /api/v1/admin/login)

// Admin Authentication
export const adminAuth = {
  login: (credentials) =>
    apiClient.post(`${API_PREFIX}/admin/login`, credentials),
  logout: () => apiClient.post(`${API_PREFIX}/admin/logout`),
  getProfile: () => apiClient.get(`${API_PREFIX}/admin/profile`),
  changePassword: (passwordData) =>
    apiClient.put(`${API_PREFIX}/admin/change-password`, passwordData),
};

// User Management
export const usersApi = {
  getAll: (params) => apiClient.get(`${API_PREFIX}/admin/users`, { params }),
  updateStatus: (id, active) =>
    apiClient.patch(`${API_PREFIX}/admin/users/${id}/status`, { active }),
};

// Houses Management
export const housesApi = {
  getAll: (params) => apiClient.get(`${API_PREFIX}/admin/houses`, { params }),
  getById: (id) => apiClient.get(`${API_PREFIX}/admin/houses/${id}`),
  create: (houseData) =>
    apiClient.post(`${API_PREFIX}/admin/houses`, houseData),
  update: (id, houseData) =>
    apiClient.put(`${API_PREFIX}/admin/houses/${id}`, houseData),
  delete: (id) => apiClient.delete(`${API_PREFIX}/admin/houses/${id}`),
  updateStatus: (id, status) =>
    apiClient.patch(`${API_PREFIX}/admin/houses/${id}/status`, { status }),
};

// Tenants Management
export const tenantsApi = {
  getAll: (params) => apiClient.get(`${API_PREFIX}/admin/tenants`, { params }),
  getById: (id) => apiClient.get(`${API_PREFIX}/admin/tenants/${id}`),
  create: (tenantData) =>
    apiClient.post(`${API_PREFIX}/admin/tenants`, tenantData),
  update: (id, tenantData) =>
    apiClient.put(`${API_PREFIX}/admin/tenants/${id}`, tenantData),
  delete: (id) => apiClient.delete(`${API_PREFIX}/admin/tenants/${id}`),
};

// Contracts Management
export const contractsApi = {
  getAll: (params) =>
    apiClient.get(`${API_PREFIX}/admin/contracts`, { params }),
  getById: (id) => apiClient.get(`${API_PREFIX}/admin/contracts/${id}`),
  create: (contractData) =>
    apiClient.post(`${API_PREFIX}/admin/contracts`, contractData),
  update: (id, contractData) =>
    apiClient.put(`${API_PREFIX}/admin/contracts/${id}`, contractData),
  delete: (id) => apiClient.delete(`${API_PREFIX}/admin/contracts/${id}`),
  terminate: (id) =>
    apiClient.patch(`${API_PREFIX}/admin/contracts/${id}/terminate`),
};

// Dashboard Statistics
export const dashboardApi = {
  getStats: () => apiClient.get(`${API_PREFIX}/admin/dashboard/stats`),
  getRecentHouses: () =>
    apiClient.get(`${API_PREFIX}/admin/dashboard/recent-houses`),
  getRevenueChart: (period) =>
    apiClient.get(`${API_PREFIX}/admin/dashboard/revenue?period=${period}`),
};

export default apiClient;
