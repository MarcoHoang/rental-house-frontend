import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
    return Promise.reject(error);
  }
);

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
  getAll: (params) => apiClient.get(`${API_PREFIX}/users`, { params }),
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

// Host Applications Management
export const hostApplicationsApi = {
  // Lấy tất cả đơn đăng ký làm chủ nhà
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/host-requests`, {
        params,
      });
      
      // Xử lý response format từ backend
      let applications;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: [HostRequestDTO] }
        applications = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Fallback: Format: [HostRequestDTO]
        applications = response.data;
      } else {
        throw new Error('Response format không hợp lệ');
      }
      
      return applications;
    } catch (error) {
      logApiError(error, "getAllHostApplications");
      throw error;
    }
  },

  // Lấy chi tiết đơn đăng ký
  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/host-requests/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "getHostApplicationById");
      throw error;
    }
  },

  // Duyệt đơn đăng ký - cập nhật role user từ USER sang HOST
  approve: async (id) => {
    try {
      console.log('hostApplicationsApi.approve - Approving application:', id);
      
      // Gọi API approve đơn đăng ký
      const response = await apiClient.post(`${API_PREFIX}/host-requests/${id}/approve`);
      
      console.log('hostApplicationsApi.approve - Response:', response.data);
      
      // Backend sẽ tự động:
      // 1. Cập nhật status của đơn đăng ký thành 'APPROVED'
      // 2. Cập nhật role của user từ 'USER' sang 'HOST'
      // 3. Cập nhật processedDate
      // 4. Tạo bản ghi HostDTO mới
      
      return response.data;
    } catch (error) {
      console.error('hostApplicationsApi.approve - Error:', error);
      logApiError(error, "approveHostApplication");
      throw error;
    }
  },

  // Từ chối đơn đăng ký
  reject: async (id, reason) => {
    try {
      console.log('hostApplicationsApi.reject - Rejecting application:', id, 'with reason:', reason);
      
      const response = await apiClient.post(`${API_PREFIX}/host-requests/${id}/reject`, {
        reason: reason
      });
      
      console.log('hostApplicationsApi.reject - Response:', response.data);
      
      // Backend sẽ tự động:
      // 1. Cập nhật status của đơn đăng ký thành 'REJECTED'
      // 2. Cập nhật reason và processedDate
      // 3. User vẫn giữ role 'USER'
      
      return response.data;
    } catch (error) {
      console.error('hostApplicationsApi.reject - Error:', error);
      logApiError(error, "rejectHostApplication");
      throw error;
    }
  },

  // Lấy danh sách tất cả host đã được approve
  getAllHosts: async (params = {}) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/hosts`, {
        params,
      });
      
      // Xử lý response format từ backend
      let hosts;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: [HostDTO] }
        hosts = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Fallback: Format: [HostDTO]
        hosts = response.data;
      } else {
        throw new Error('Response format không hợp lệ');
      }
      
      return hosts;
    } catch (error) {
      logApiError(error, "getAllHosts");
      throw error;
    }
  },

  // Lấy chi tiết thông tin host
  getHostById: async (id) => {
    try {
      const response = await apiClient.get(`${API_PREFIX}/hosts/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error, "getHostById");
      throw error;
    }
  }
};

export default apiClient;
