import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { handleApiError, logApiError } from "../utils/apiErrorHandler";
import { safeSetToStorage, safeRemoveFromStorage } from "../utils/localStorage";

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
    if (process.env.NODE_ENV === "development" && !config._retry) {
      console.group(
        `Admin API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
      console.log("Request Config:", {
        method: config.method,
        url: config.url,
        headers: config.headers,
        data: config.data,
      });
      console.groupEnd();
    }

    return config;
  },
  (error) => {
    logApiError(error, "Admin Request Interceptor");
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    logApiError(error, "Admin Response Interceptor");

    // Handle 401 errors for admin
    if (error.response?.status === 401) {
      handleApiError(error, {
        clearAuthOn401: true,
        redirectOn401: true,
        redirectPath: "/admin/login",
      });
    }

    return Promise.reject(error);
  }
);

export const adminAuth = {
  // Admin login
  login: async (credentials) => {
    try {
      console.log(
        "adminAuth.login - Starting login with credentials:",
        credentials
      );

      const response = await apiClient.post(
        `${API_PREFIX}/admin/login`,
        credentials
      );

      console.log("adminAuth.login - Raw response:", response);
      console.log("adminAuth.login - Response data:", response.data);

      // Backend trả về format: { code: "07", message: "...", data: { token: "..." } }
      let loginData, token;

      if (response.data.data) {
        // Format: { code: "07", message: "...", data: { token: "..." } }
        loginData = response.data.data;
        token = loginData.token;
      } else if (response.data.token) {
        // Fallback: Format: { token: "..." }
        token = response.data.token;
      } else {
        console.error(
          "adminAuth.login - Unknown response format:",
          response.data
        );
        throw new Error("Format response không được hỗ trợ");
      }

      console.log("adminAuth.login - Extracted token:", token);

      if (token) {
        console.log("adminAuth.login - Storing admin token in localStorage");
        localStorage.setItem("adminToken", token);

        // Decode token để lấy thông tin admin
        try {
          const decoded = jwtDecode(token);
          const adminUser = {
            id: decoded?.id || "",
            email: decoded?.sub || decoded?.email || "",
            role: decoded?.role?.replace("ROLE_", "") || "",
            name: decoded?.name || "",
          };
          safeSetToStorage("adminUser", adminUser);
          console.log("adminAuth.login - Stored admin user:", adminUser);
        } catch (decodeError) {
          console.error("adminAuth.login - Error decoding token:", decodeError);
        }
      } else {
        throw new Error("Không nhận được token từ server");
      }

      return response.data;
    } catch (error) {
      console.error("adminAuth.login - Error:", error);
      console.error("adminAuth.login - Error response:", error.response);
      logApiError(error, "adminLogin");
      throw error;
    }
  },

  // Admin logout
  logout: () => {
    safeRemoveFromStorage("adminToken");
    safeRemoveFromStorage("adminUser");
    window.dispatchEvent(new Event("adminUnauthorized"));
  },

  // Get admin profile
  getProfile: async () => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/profile`);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "adminGetProfile");
      throw error;
    }
  },

  // Change admin password
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.put(
        `${API_PREFIX}/admin/change-password`,
        passwordData
      );
      return response.data;
    } catch (error) {
      logApiError(error, "adminChangePassword");
      throw error;
    }
  },
};

// User Management
export const usersApi = {
  // Get all users with pagination
  getAll: async (params = {}) => {
    try {
      console.log("usersApi.getAll - Fetching users with params:", params);

      const response = await apiClient.get(`${API_PREFIX}/admin/users`, {
        params,
      });
      console.log("usersApi.getAll - Raw response:", response);
      console.log("usersApi.getAll - Response data:", response.data);

      // Backend trả về format: { code: "04", message: "...", data: { content: [...], totalPages: 1, ... } }
      let usersData;
      if (response.data.data) {
        // Format: { code: "04", message: "...", data: { content: [...], totalPages: 1, ... } }
        usersData = response.data.data;
      } else if (response.data.content) {
        // Fallback: Format: { content: [...], totalPages: 1, ... }
        usersData = response.data;
      } else {
        console.error(
          "usersApi.getAll - Unknown response format:",
          response.data
        );
        throw new Error("Format response không được hỗ trợ");
      }

      console.log("usersApi.getAll - Extracted users data:", usersData);
      return usersData;
    } catch (error) {
      console.error("usersApi.getAll - Error:", error);
      console.error("usersApi.getAll - Error response:", error.response);
      logApiError(error, "getAllUsers");
      throw error;
    }
  },

  // Update user status (active/inactive)
  updateStatus: async (id, active) => {
    try {
      console.log(
        "usersApi.updateStatus - Updating status for user:",
        id,
        "to:",
        active
      );

      const response = await apiClient.patch(
        `${API_PREFIX}/admin/users/${id}/status`,
        { active }
      );
      console.log("usersApi.updateStatus - Response:", response);
      console.log("usersApi.updateStatus - Response data:", response.data);

      return response.data;
    } catch (error) {
      console.error("usersApi.updateStatus - Error:", error);
      console.error("usersApi.updateStatus - Error response:", error.response);
      logApiError(error, "updateUserStatus");
      throw error;
    }
  },

  getDetailsForAdmin: async (userId) => {
    try {
      console.log(
        "usersApi.getDetailsForAdmin - Fetching details for user:",
        userId
      );

      // Sử dụng endpoint admin mà chúng ta đã tạo ở backend
      const response = await apiClient.get(
        `${API_PREFIX}/admin/users/${userId}`
      );

      console.log("usersApi.getDetailsForAdmin - Raw response:", response);

      // Tuân thủ cấu trúc response.data.data
      if (response.data && response.data.data) {
        console.log(
          "usersApi.getDetailsForAdmin - Extracted user details:",
          response.data.data
        );
        return response.data.data;
      } else {
        console.error(
          "usersApi.getDetailsForAdmin - Unexpected response format:",
          response.data
        );
        throw new Error("Format response không được hỗ trợ");
      }
    } catch (error) {
      console.error("usersApi.getDetailsForAdmin - Error:", error);
      logApiError(error, "getDetailsForAdmin"); // Sử dụng trình xử lý lỗi của bạn
      throw error;
    }
  },
  // Get user by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/users/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "getUserById");
      throw error;
    }
  },

  // Create user
  create: async (userData) => {
    try {
      const response = await apiClient.post(`${API_PREFIX}/users`, userData);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "createUser");
      throw error;
    }
  },

  // Update user
  update: async (id, userData) => {
    try {
      const response = await apiClient.put(
        `${API_PREFIX}/users/${id}`,
        userData
      );
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "updateUser");
      throw error;
    }
  },

  // Delete user
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${API_PREFIX}/users/${id}`);
      return response.data;
    } catch (error) {
      logApiError(error, "deleteUser");
      throw error;
    }
  },
};

// Houses Management
export const housesApi = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/houses`, {
        params,
      });
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "getAllHouses");
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/houses/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "getHouseById");
      throw error;
    }
  },

  create: async (houseData) => {
    try {
      const response = await apiClient.post(
        `${API_PREFIX}/admin/houses`,
        houseData
      );
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "createHouse");
      throw error;
    }
  },

  update: async (id, houseData) => {
    try {
      const response = await apiClient.put(
        `${API_PREFIX}/admin/houses/${id}`,
        houseData
      );
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "updateHouse");
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(
        `${API_PREFIX}/admin/houses/${id}`
      );
      return response.data;
    } catch (error) {
      logApiError(error, "deleteHouse");
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(
        `${API_PREFIX}/admin/houses/${id}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      logApiError(error, "updateHouseStatus");
      throw error;
    }
  },
};

// Tenants Management
export const tenantsApi = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/tenants`, {
        params,
      });
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "getAllTenants");
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/tenants/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "getTenantById");
      throw error;
    }
  },

  create: async (tenantData) => {
    try {
      const response = await apiClient.post(
        `${API_PREFIX}/admin/tenants`,
        tenantData
      );
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "createTenant");
      throw error;
    }
  },

  update: async (id, tenantData) => {
    try {
      const response = await apiClient.put(
        `${API_PREFIX}/admin/tenants/${id}`,
        tenantData
      );
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "updateTenant");
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(
        `${API_PREFIX}/admin/tenants/${id}`
      );
      return response.data;
    } catch (error) {
      logApiError(error, "deleteTenant");
      throw error;
    }
  },
};

// Contracts Management
export const contractsApi = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/contracts`, {
        params,
      });
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "getAllContracts");
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(
        `${API_PREFIX}/admin/contracts/${id}`
      );
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "getContractById");
      throw error;
    }
  },

  create: async (contractData) => {
    try {
      const response = await apiClient.post(
        `${API_PREFIX}/admin/contracts`,
        contractData
      );
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "createContract");
      throw error;
    }
  },

  update: async (id, contractData) => {
    try {
      const response = await apiClient.put(
        `${API_PREFIX}/admin/contracts/${id}`,
        contractData
      );
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "updateContract");
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(
        `${API_PREFIX}/admin/contracts/${id}`
      );
      return response.data;
    } catch (error) {
      logApiError(error, "deleteContract");
      throw error;
    }
  },

  terminate: async (id) => {
    try {
      const response = await apiClient.patch(
        `${API_PREFIX}/admin/contracts/${id}/terminate`
      );
      return response.data;
    } catch (error) {
      logApiError(error, "terminateContract");
      throw error;
    }
  },
};

// Dashboard Statistics
export const dashboardApi = {
  getStats: async () => {
    try {
      const response = await apiClient.get(
        `${API_PREFIX}/admin/dashboard/stats`
      );
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "getDashboardStats");
      throw error;
    }
  },

  getRecentHouses: async () => {
    try {
      const response = await apiClient.get(
        `${API_PREFIX}/admin/dashboard/recent-houses`
      );
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "getRecentHouses");
      throw error;
    }
  },

  getRevenueChart: async (period) => {
    try {
      const response = await apiClient.get(
        `${API_PREFIX}/admin/dashboard/revenue?period=${period}`
      );
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "getRevenueChart");
      throw error;
    }
  },
};

// Host Applications Management
export const hostApplicationsApi = {
  getAllHosts: async (params = {}) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/admin/hosts`, {
        params,
      });
      return response.data.data; // Dữ liệu trả về là một Page object
    } catch (error) {
      logApiError(error, "getAllHosts");
      throw error;
    }
  },

  getPendingRequests: async (params = {}) => {
    try {
      const response = await apiClient.get(
        `${API_PREFIX}/admin/host-requests`,
        { params }
      );
      return response.data.data; // Dữ liệu trả về là một Page object
    } catch (error) {
      logApiError(error, "getPendingRequests");
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
      // SỬA LẠI URL: Thêm /admin/
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
  updateStatus: async (hostId, active) => {
    try {
      const response = await apiClient.patch(
        `${API_PREFIX}/admin/hosts/${hostId}/status`,
        { active }
      );
      return response.data;
    } catch (error) {
      logApiError(error, "updateHostStatus");
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
};

export default apiClient;
