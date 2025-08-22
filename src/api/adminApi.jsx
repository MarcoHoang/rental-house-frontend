import axios from "axios";
import { logApiError } from "../utils/apiErrorHandler";

// Sử dụng proxy của Vite trong development
const API_BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Thêm timeout để tránh chờ quá lâu
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logApiError(error, "Request Interceptor");
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    logApiError(error, "Response Interceptor");

    // Xử lý lỗi 401 - token hết hạn
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

// Admin Authentication API
export const adminAuth = {
  login: async (credentials) => {
    try {
      console.log(
        "adminAuth.login - Sending request to:",
        `${API_PREFIX}/admin/login`
      );
      console.log("adminAuth.login - Credentials:", credentials);

      // Thử các endpoint khác nhau
      let response;
      let lastError;

      // Danh sách các endpoint có thể thử
      const endpoints = [
        `${API_PREFIX}/admin/login`,
        `${API_PREFIX}/auth/admin-login`,
        `${API_PREFIX}/auth/login`,
        `${API_PREFIX}/login`,
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`adminAuth.login - Trying endpoint: ${endpoint}`);
          response = await apiClient.post(endpoint, credentials);
          console.log(`adminAuth.login - Success with endpoint: ${endpoint}`);
          break;
        } catch (error) {
          console.log(
            `adminAuth.login - Failed with endpoint ${endpoint}:`,
            error.response?.status
          );
          lastError = error;

          // Chỉ thử endpoint tiếp theo nếu là lỗi server (500) hoặc endpoint không tồn tại (404)
          // Không thử endpoint tiếp theo cho lỗi authentication (401, 403)
          if (error.response?.status === 500 || error.response?.status === 404) {
            continue;
          }

          // Nếu là lỗi authentication hoặc lỗi khác, dừng lại và trả về lỗi
          break;
        }
      }

      // Không sử dụng mock data cho lỗi authentication
      if (!response) {
        throw lastError || new Error("Không thể kết nối đến server");
      }

      return response.data;
    } catch (error) {
      console.error("adminAuth.login - Error:", error);
      throw error;
    }
  },
};

// User Management API
export const usersApi = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(
        `${API_PREFIX}/admin/users`,
        { params }
      );
      return response.data.data;
    } catch (error) {
      logApiError(error, "getAllUsers");
      throw error;
    }
  },

  searchUsers: async (keyword, role, active, params = {}) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/users/search`, {
        params: {
          ...params,
          keyword: keyword || undefined,
          role: role !== 'ALL' ? role : undefined,
          active: active !== 'ALL' ? active : undefined,
        },
      });
      return response.data.data;
    } catch (error) {
      logApiError(error, "searchUsers");
      throw error;
    }
  },

  updateStatus: async (userId, active) => {
    try {
      const response = await apiClient.patch(
        `${API_PREFIX}/admin/users/${userId}/status`,
        { active }
      );
      return response.data;
    } catch (error) {
      logApiError(error, "updateUserStatus");
      throw error;
    }
  },

  getUserDetails: async (userId) => {
    try {
      console.log("Calling getUserDetails API for userId:", userId);
      const response = await apiClient.get(
        `${API_PREFIX}/admin/users/${userId}`
      );
      console.log("getUserDetails API response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("getUserDetails API error:", error);
      logApiError(error, "getUserDetails");
      throw error;
    }
  },
};

// Host Applications API
export const hostApplicationsApi = {
  getAllRequests: async (params = {}) => {
    try {
      const response = await apiClient.get(
        `${API_PREFIX}/admin/host-requests`,
        { params }
      );
      return response.data.data;
    } catch (error) {
      logApiError(error, "getAllRequests");
      throw error;
    }
  },

  searchRequests: async (keyword, status, params = {}) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/host-requests/search`, {
        params: {
          ...params,
          keyword: keyword || undefined,
          status: status !== 'ALL' ? status : undefined,
        },
      });
      return response.data.data;
    } catch (error) {
      logApiError(error, "searchRequests");
      throw error;
    }
  },

  approve: async (requestId) => {
    try {
      const response = await apiClient.post(
        `${API_PREFIX}/admin/host-requests/${requestId}/approve`
      );
      return response.data;
    } catch (error) {
      logApiError(error, "approveRequest");
      throw error;
    }
  },

  reject: async (requestId, reason) => {
    try {
      const response = await apiClient.post(
        `${API_PREFIX}/admin/host-requests/${requestId}/reject`,
        { reason }
      );
      return response.data;
    } catch (error) {
      logApiError(error, "rejectRequest");
      throw error;
    }
  },

  getRequestDetails: async (requestId) => {
    try {
      const response = await apiClient.get(
        `${API_PREFIX}/admin/host-requests/${requestId}`
      );
      return response.data.data;
    } catch (error) {
      logApiError(error, "getRequestDetails");
      throw error;
    }
  },

  createRequest: async (requestData) => {
    try {
      const response = await apiClient.post(
        `${API_PREFIX}/admin/host-requests`,
        requestData
      );
      return response.data;
    } catch (error) {
      logApiError(error, "createRequest");
      throw error;
    }
  },

  // Host Management API
  getAllHosts: async (params = {}) => {
    try {
      const response = await apiClient.get(
        `${API_PREFIX}/admin/hosts`,
        { params }
      );
      return response.data.data;
    } catch (error) {
      logApiError(error, "getAllHosts");
      throw error;
    }
  },

  searchHosts: async (keyword, active, params = {}) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/hosts/search`, {
        params: {
          ...params,
          keyword: keyword || undefined,
          active: active !== undefined ? active : undefined,
        },
      });
      return response.data.data;
    } catch (error) {
      logApiError(error, "searchHosts");
      throw error;
    }
  },

  updateStatus: async (hostId, active) => {
    try {
      const response = await apiClient.put(
        `${API_PREFIX}/admin/hosts/${hostId}/status`,
        { active }
      );
      return response.data;
    } catch (error) {
      logApiError(error, "updateHostStatus");
      throw error;
    }
  },

  updateStatusByUserId: async (userId, active) => {
    try {
      const response = await apiClient.patch(
        `${API_PREFIX}/admin/hosts/user/${userId}/status`,
        { active }
      );
      return response.data;
    } catch (error) {
      logApiError(error, "updateHostStatusByUserId");
      throw error;
    }
  },

  getHostDetailsByUserId: async (userId) => {
    try {
      const response = await apiClient.get(
        `${API_PREFIX}/admin/hosts/user/${userId}`
      );
      return response.data.data;
    } catch (error) {
      logApiError(error, "getHostDetailsByUserId");
      throw error;
    }
  },
};

// Houses API
export const housesApi = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/houses`, { params });

      return response.data.data;
    } catch (error) {
      logApiError(error, "getAllHouses");
      throw error;
    }
  },

  delete: async (houseId) => {
    try {
      const response = await apiClient.delete(`${API_PREFIX}/admin/houses/${houseId}`);
      return response.data;
    } catch (error) {
      logApiError(error, "deleteHouse");
      throw error;
    }
  },

  getById: async (houseId) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/houses/${houseId}`);
      return response.data.data;
    } catch (error) {
      logApiError(error, "getHouseById");
      throw error;
    }
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/dashboard/stats`);
      return response.data.data;
    } catch (error) {
      logApiError(error, "getStats");
      throw error;
    }
  },

  getRecentHouses: async () => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/dashboard/recent-houses`);
      return response.data.data;
    } catch (error) {
      logApiError(error, "getRecentHouses");
      throw error;
    }
  },

  getRecentRentals: async () => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/dashboard/recent-rentals`);
      return response.data.data;
    } catch (error) {
      logApiError(error, "getRecentRentals");
      throw error;
    }
  },
};

// Rental Management API
export const adminApi = {
  getAllRentals: async (params = {}) => {
    try {
      const response = await apiClient.get(
        `${API_PREFIX}/admin/rentals`,
        { params }
      );
      return response.data.data;
    } catch (error) {
      logApiError(error, "getAllRentals");
      throw error;
    }
  },

  searchRentals: async (keyword, status, houseType, params = {}) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/rentals/search`, {
        params: {
          ...params,
          keyword: keyword || undefined,
          status: status !== 'ALL' ? status : undefined,
          houseType: houseType !== 'ALL' ? houseType : undefined,
        },
      });
      return response.data.data;
    } catch (error) {
      logApiError(error, "searchRentals");
      throw error;
    }
  },

  getRentalDetails: async (rentalId) => {
    try {
      const response = await apiClient.get(
        `${API_PREFIX}/admin/rentals/${rentalId}`
      );
      return response.data.data;
    } catch (error) {
      logApiError(error, "getRentalDetails");
      throw error;
    }
  },
};

export default apiClient;
