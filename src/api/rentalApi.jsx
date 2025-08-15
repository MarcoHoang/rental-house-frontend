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
  // Tạo đơn thuê nhà mới
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
      const response = await api.delete(`/rentals/${rentalId}`);
      
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
      // Gọi API để lấy thông tin nhà và kiểm tra trạng thái
      const houseResponse = await api.get(`/houses/${houseId}`);
      const house = houseResponse.data.data || houseResponse.data;
      
      if (house.status !== "AVAILABLE") {
        return {
          available: false,
          message: "Nhà không khả dụng để thuê",
        };
      }

      // Kiểm tra xem có đơn thuê nào trùng lịch không
      const rentalsResponse = await api.get(`/rentals`);
      const allRentals = rentalsResponse.data.data || rentalsResponse.data || [];
      
      const conflictingRentals = allRentals.filter(rental => {
        if (rental.houseId !== houseId) return false;
        
        const rentalStart = new Date(rental.startDate);
        const rentalEnd = new Date(rental.endDate);
        const requestStart = new Date(startDate);
        const requestEnd = new Date(endDate);
        
        // Kiểm tra xem có trùng lịch không
        return (
          (requestStart >= rentalStart && requestStart < rentalEnd) ||
          (requestEnd > rentalStart && requestEnd <= rentalEnd) ||
          (requestStart <= rentalStart && requestEnd >= rentalEnd)
        );
      });

      if (conflictingRentals.length > 0) {
        return {
          available: false,
          message: "Nhà đã được đặt trong khoảng thời gian này",
        };
      }

      return {
        available: true,
        message: "Nhà có thể thuê trong khoảng thời gian này",
      };
    } catch (error) {
      console.error("rentalApi.checkAvailability - Error:", error);
      logApiError(error, "checkAvailability");
      throw error;
    }
  },
};

export default rentalApi; 