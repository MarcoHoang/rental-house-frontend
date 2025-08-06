import axios from "axios";

// Base URL - thay đổi theo backend của bạn
const API_BASE_URL = "http://localhost:3001/api";

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm token vào header
adminApi.interceptors.request.use(
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

// Admin Authentication
export const adminAuth = {
  login: (credentials) => adminApi.post("/admin/login", credentials),
  logout: () => adminApi.post("/admin/logout"),
  getProfile: () => adminApi.get("/admin/profile"),
  changePassword: (passwordData) =>
    adminApi.put("/admin/change-password", passwordData),
};

// Houses Management
export const housesApi = {
  getAll: (params) => adminApi.get("/admin/houses", { params }),
  getById: (id) => adminApi.get(`/admin/houses/${id}`),
  create: (houseData) => adminApi.post("/admin/houses", houseData),
  update: (id, houseData) => adminApi.put(`/admin/houses/${id}`, houseData),
  delete: (id) => adminApi.delete(`/admin/houses/${id}`),
  updateStatus: (id, status) =>
    adminApi.patch(`/admin/houses/${id}/status`, { status }),
};

// Tenants Management
export const tenantsApi = {
  getAll: (params) => adminApi.get("/admin/tenants", { params }),
  getById: (id) => adminApi.get(`/admin/tenants/${id}`),
  create: (tenantData) => adminApi.post("/admin/tenants", tenantData),
  update: (id, tenantData) => adminApi.put(`/admin/tenants/${id}`, tenantData),
  delete: (id) => adminApi.delete(`/admin/tenants/${id}`),
};

// Contracts Management
export const contractsApi = {
  getAll: (params) => adminApi.get("/admin/contracts", { params }),
  getById: (id) => adminApi.get(`/admin/contracts/${id}`),
  create: (contractData) => adminApi.post("/admin/contracts", contractData),
  update: (id, contractData) =>
    adminApi.put(`/admin/contracts/${id}`, contractData),
  delete: (id) => adminApi.delete(`/admin/contracts/${id}`),
  terminate: (id) => adminApi.patch(`/admin/contracts/${id}/terminate`),
};

// Dashboard Statistics
export const dashboardApi = {
  getStats: () => adminApi.get("/admin/dashboard/stats"),
  getRecentHouses: () => adminApi.get("/admin/dashboard/recent-houses"),
  getRevenueChart: (period) =>
    adminApi.get(`/admin/dashboard/revenue?period=${period}`),
};

export default adminApi;
