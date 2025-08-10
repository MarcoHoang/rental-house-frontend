import axios from "axios";
import { handleApiError, logApiError } from '../utils/apiErrorHandler';
import { safeSetToStorage, safeRemoveFromStorage } from '../utils/localStorage';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development' && !config._retry) {
      console.group(`Admin API Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log('Request Config:', {
        method: config.method,
        url: config.url,
        headers: config.headers,
        data: config.data
      });
      console.groupEnd();
    }
    
    return config;
  },
  (error) => {
    logApiError(error, 'Admin Request Interceptor');
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    logApiError(error, 'Admin Response Interceptor');
    
    // Handle 401 errors for admin
    if (error.response?.status === 401) {
      handleApiError(error, { 
        clearAuthOn401: true,
        redirectOn401: true,
        redirectPath: '/admin/login'
      });
    }
    
    return Promise.reject(error);
  }
);

export const adminAuth = {
  // Admin login
  login: async (credentials) => {
    try {
      const response = await apiClient.post(`${API_PREFIX}/admin/login`, credentials);
      const loginData = response.data.data || response.data;
      
      if (loginData.token) {
        localStorage.setItem("adminToken", loginData.token);
        safeSetToStorage("adminUser", loginData.user);
      }
      
      return response.data;
    } catch (error) {
      logApiError(error, 'adminLogin');
      throw error;
    }
  },

  // Admin logout
  logout: () => {
    safeRemoveFromStorage("adminToken");
    safeRemoveFromStorage("adminUser");
    window.dispatchEvent(new Event('adminUnauthorized'));
  },

  // Get admin profile
  getProfile: async () => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/profile`);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'adminGetProfile');
      throw error;
    }
  },

  // Change admin password
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.put(`${API_PREFIX}/admin/change-password`, passwordData);
      return response.data;
    } catch (error) {
      logApiError(error, 'adminChangePassword');
      throw error;
    }
  },
};

// User Management
export const usersApi = {
  // Get all users with pagination
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/users`, { params });
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'getAllUsers');
      throw error;
    }
  },

  // Update user status (active/inactive)
  updateStatus: async (id, active) => {
    try {
      const response = await apiClient.patch(`${API_PREFIX}/admin/users/${id}/status`, { active });
      return response.data;
    } catch (error) {
      logApiError(error, 'updateUserStatus');
      throw error;
    }
  },

  // Get user by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/users/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'getUserById');
      throw error;
    }
  },

  // Create user
  create: async (userData) => {
    try {
      const response = await apiClient.post(`${API_PREFIX}/users`, userData);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'createUser');
      throw error;
    }
  },

  // Update user
  update: async (id, userData) => {
    try {
      const response = await apiClient.put(`${API_PREFIX}/users/${id}`, userData);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'updateUser');
      throw error;
    }
  },

  // Delete user
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${API_PREFIX}/users/${id}`);
      return response.data;
    } catch (error) {
      logApiError(error, 'deleteUser');
      throw error;
    }
  },
};

// Houses Management
export const housesApi = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/houses`, { params });
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'getAllHouses');
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/houses/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'getHouseById');
      throw error;
    }
  },

  create: async (houseData) => {
    try {
      const response = await apiClient.post(`${API_PREFIX}/admin/houses`, houseData);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'createHouse');
      throw error;
    }
  },

  update: async (id, houseData) => {
    try {
      const response = await apiClient.put(`${API_PREFIX}/admin/houses/${id}`, houseData);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'updateHouse');
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${API_PREFIX}/admin/houses/${id}`);
      return response.data;
    } catch (error) {
      logApiError(error, 'deleteHouse');
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`${API_PREFIX}/admin/houses/${id}/status`, { status });
      return response.data;
    } catch (error) {
      logApiError(error, 'updateHouseStatus');
      throw error;
    }
  },
};

// Tenants Management
export const tenantsApi = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/tenants`, { params });
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'getAllTenants');
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/tenants/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'getTenantById');
      throw error;
    }
  },

  create: async (tenantData) => {
    try {
      const response = await apiClient.post(`${API_PREFIX}/admin/tenants`, tenantData);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'createTenant');
      throw error;
    }
  },

  update: async (id, tenantData) => {
    try {
      const response = await apiClient.put(`${API_PREFIX}/admin/tenants/${id}`, tenantData);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'updateTenant');
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${API_PREFIX}/admin/tenants/${id}`);
      return response.data;
    } catch (error) {
      logApiError(error, 'deleteTenant');
      throw error;
    }
  },
};

// Contracts Management
export const contractsApi = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/contracts`, { params });
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'getAllContracts');
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/contracts/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'getContractById');
      throw error;
    }
  },

  create: async (contractData) => {
    try {
      const response = await apiClient.post(`${API_PREFIX}/admin/contracts`, contractData);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'createContract');
      throw error;
    }
  },

  update: async (id, contractData) => {
    try {
      const response = await apiClient.put(`${API_PREFIX}/admin/contracts/${id}`, contractData);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'updateContract');
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${API_PREFIX}/admin/contracts/${id}`);
      return response.data;
    } catch (error) {
      logApiError(error, 'deleteContract');
      throw error;
    }
  },

  terminate: async (id) => {
    try {
      const response = await apiClient.patch(`${API_PREFIX}/admin/contracts/${id}/terminate`);
      return response.data;
    } catch (error) {
      logApiError(error, 'terminateContract');
      throw error;
    }
  },
};

// Dashboard Statistics
export const dashboardApi = {
  getStats: async () => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/dashboard/stats`);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'getDashboardStats');
      throw error;
    }
  },

  getRecentHouses: async () => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/dashboard/recent-houses`);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'getRecentHouses');
      throw error;
    }
  },

  getRevenueChart: async (period) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/dashboard/revenue?period=${period}`);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, 'getRevenueChart');
      throw error;
    }
  },
};

export default apiClient;
