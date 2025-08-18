// src/api/rentalApi.jsx
import axios from "axios";
import { AUTH_CONFIG } from "../config/auth";
import { handleApiError, logApiError } from "../utils/apiErrorHandler";

// Cấu hình axios mặc định
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor để thêm token
api.interceptors.request.use(
  (config) => {
    if (AUTH_CONFIG.ENABLE_AUTH) {
      const token = localStorage.getItem("token");
      console.log("rentalApi - Token check:", {
        enableAuth: AUTH_CONFIG.ENABLE_AUTH,
        hasToken: !!token,
        tokenLength: token?.length,
        url: config.url
      });
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    logApiError(error, "Request Interceptor");
    return Promise.reject(error);
  }
);

// Xử lý lỗi response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    logApiError(error, "Response Interceptor");

    if (error.response?.status === 401 && AUTH_CONFIG.ENABLE_AUTH) {
      handleApiError(error, { clearAuthOn401: true });
      window.dispatchEvent(new Event("unauthorized"));
    }

    return Promise.reject(error);
  }
);

const rentalApi = {
  // Tạo yêu cầu thuê nhà mới (workflow mới)
  createRequest: async (requestData) => {
    try {
      console.log("rentalApi.createRequest - Starting request creation:", requestData);
      
      const response = await api.post("/rentals/request", requestData);
      
      console.log("rentalApi.createRequest - Response:", response);
      
      // Xử lý response format từ backend
      let result;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: RentalDTO }
        result = response.data.data;
      } else if (response.data.id) {
        // Fallback: Format: RentalDTO
        result = response.data;
      } else {
        throw new Error("Response format không hợp lệ");
      }

      return {
        success: true,
        data: result,
        message: response.data.message || "Gửi yêu cầu thuê nhà thành công",
      };
    } catch (error) {
      console.error("rentalApi.createRequest - Error:", error);
      logApiError(error, "createRequest");
      throw error;
    }
  },

  // Tạo đơn thuê nhà mới (legacy - giữ lại để tương thích)
  createRental: async (rentalData) => {
    try {
      console.log("rentalApi.createRental - Starting rental creation:", rentalData);
      
      const response = await api.post("/rentals", rentalData);
      
      console.log("rentalApi.createRental - Response:", response);
      
      // Xử lý response format từ backend
      let result;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: RentalDTO }
        result = response.data.data;
      } else if (response.data.id) {
        // Fallback: Format: RentalDTO
        result = response.data;
      } else {
        throw new Error("Response format không hợp lệ");
      }

      return {
        success: true,
        data: result,
        message: response.data.message || "Tạo đơn thuê nhà thành công",
      };
    } catch (error) {
      console.error("rentalApi.createRental - Error:", error);
      logApiError(error, "createRental");
      throw error;
    }
  },

  // Lấy danh sách đơn thuê của user hiện tại
  getMyRentals: async () => {
    try {
      const response = await api.get("/rentals/user/me");
      
      // Xử lý response format từ backend
      let rentals;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: [RentalDTO] }
        rentals = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Fallback: Format: [RentalDTO]
        rentals = response.data;
      } else {
        throw new Error("Response format không hợp lệ");
      }

      return rentals;
    } catch (error) {
      console.error("rentalApi.getMyRentals - Error:", error);
      logApiError(error, "getMyRentals");
      throw error;
    }
  },

  // Lấy chi tiết đơn thuê theo ID
  getRentalById: async (rentalId) => {
    try {
      const response = await api.get(`/rentals/${rentalId}`);
      
      // Xử lý response format từ backend
      let rental;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: RentalDTO }
        rental = response.data.data;
      } else if (response.data.id) {
        // Fallback: Format: RentalDTO
        rental = response.data;
      } else {
        throw new Error("Response format không hợp lệ");
      }

      return rental;
    } catch (error) {
      console.error("rentalApi.getRentalById - Error:", error);
      logApiError(error, "getRentalById");
      throw error;
    }
  },

  // Cập nhật đơn thuê
  updateRental: async (rentalId, rentalData) => {
    try {
      const response = await api.put(`/rentals/${rentalId}`, rentalData);
      
      // Xử lý response format từ backend
      let result;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: RentalDTO }
        result = response.data.data;
      } else if (response.data.id) {
        // Fallback: Format: RentalDTO
        result = response.data;
      } else {
        throw new Error("Response format không hợp lệ");
      }

      return {
        success: true,
        data: result,
        message: response.data.message || "Cập nhật đơn thuê thành công",
      };
    } catch (error) {
      console.error("rentalApi.updateRental - Error:", error);
      logApiError(error, "updateRental");
      throw error;
    }
  },

  // Hủy đơn thuê
  cancelRental: async (rentalId) => {
    try {
      const response = await api.put(`/rentals/${rentalId}/cancel`);
      
      return {
        success: true,
        message: response.data.message || "Hủy đơn thuê thành công",
      };
    } catch (error) {
      console.error("rentalApi.cancelRental - Error:", error);
      logApiError(error, "cancelRental");
      throw error;
    }
  },

  // Check-in (chỉ dành cho host)
  checkin: async (rentalId) => {
    try {
      const response = await api.put(`/rentals/${rentalId}/checkin`);
      
      // Xử lý response format từ backend
      let result;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: RentalDTO }
        result = response.data.data;
      } else if (response.data.id) {
        // Fallback: Format: RentalDTO
        result = response.data;
      } else {
        throw new Error("Response format không hợp lệ");
      }

      return {
        success: true,
        data: result,
        message: response.data.message || "Check-in thành công",
      };
    } catch (error) {
      console.error("rentalApi.checkin - Error:", error);
      logApiError(error, "checkin");
      throw error;
    }
  },

  // Check-out (chỉ dành cho host)
  checkout: async (rentalId) => {
    try {
      const response = await api.put(`/rentals/${rentalId}/checkout`);
      
      // Xử lý response format từ backend
      let result;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: RentalDTO }
        result = response.data.data;
      } else if (response.data.id) {
        // Fallback: Format: RentalDTO
        result = response.data;
      } else {
        throw new Error("Response format không hợp lệ");
      }

      return {
        success: true,
        data: result,
        message: response.data.message || "Check-out thành công",
      };
    } catch (error) {
      console.error("rentalApi.checkout - Error:", error);
      logApiError(error, "checkout");
      throw error;
    }
  },

  // Kiểm tra xem nhà có thể thuê trong khoảng thời gian không
  checkAvailability: async (houseId, startDate, endDate) => {
    try {
      console.log("rentalApi.checkAvailability - Checking availability:", { houseId, startDate, endDate });
      
      const response = await api.get(`/rentals/check-availability`, {
        params: { houseId, startDate, endDate }
      });
      
      console.log("rentalApi.checkAvailability - Response:", response);
      
      const result = response.data.data || response.data;

      return {
        available: result.available,
        message: result.message
      };
    } catch (error) {
      console.error("rentalApi.checkAvailability - Error:", error);
      logApiError(error, "checkAvailability");
      throw error;
    }
  },

  // === HOST METHODS ===
  
  // Lấy tất cả yêu cầu (mọi trạng thái) của host
  getHostAllRequests: async (hostId) => {
    try {
      const response = await api.get(`/rentals/host/${hostId}`);
      
      return {
        success: true,
        data: response.data.data || response.data || [],
        message: response.data.message || "Lấy danh sách yêu cầu thành công",
      };
    } catch (error) {
      console.error("rentalApi.getHostAllRequests - Error:", error);
      logApiError(error, "getHostAllRequests");
      throw error;
    }
  },
  
  // Lấy danh sách yêu cầu thuê nhà của host
  getHostPendingRequests: async (hostId) => {
    try {
      const response = await api.get(`/rentals/host/${hostId}/pending`);
      
      return {
        success: true,
        data: response.data.data || response.data || [],
        message: response.data.message || "Lấy danh sách yêu cầu thành công",
      };
    } catch (error) {
      console.error("rentalApi.getHostPendingRequests - Error:", error);
      logApiError(error, "getHostPendingRequests");
      throw error;
    }
  },

  // Chấp nhận yêu cầu thuê nhà
  approveRequest: async (rentalId) => {
    try {
      const response = await api.put(`/rentals/${rentalId}/approve`);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "Chấp nhận yêu cầu thành công",
      };
    } catch (error) {
      console.error("rentalApi.approveRequest - Error:", error);
      logApiError(error, "approveRequest");
      throw error;
    }
  },

  // Từ chối yêu cầu thuê nhà
  rejectRequest: async (rentalId, reason) => {
    try {
      const response = await api.put(`/rentals/${rentalId}/reject`, { reason });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "Từ chối yêu cầu thành công",
      };
    } catch (error) {
      console.error("rentalApi.rejectRequest - Error:", error);
      logApiError(error, "rejectRequest");
      throw error;
    }
  },

  // Lấy số lượng yêu cầu chờ duyệt
  getHostPendingRequestsCount: async (hostId) => {
    try {
      const response = await api.get(`/rentals/host/${hostId}/pending/count`);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "Lấy số lượng yêu cầu thành công",
      };
    } catch (error) {
      console.error("rentalApi.getHostPendingRequestsCount - Error:", error);
      logApiError(error, "getHostPendingRequestsCount");
      throw error;
    }
  },
};

export default rentalApi; 