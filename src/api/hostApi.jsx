// src/api/hostApi.jsx
import axios from "axios";
import { AUTH_CONFIG } from "../config/auth";
import { handleApiError, logApiError } from "../utils/apiErrorHandler";
import { privateApiClient } from "./apiClient";

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
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Không set Content-Type cho FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
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

export const hostApi = {
  // Upload file chung - sử dụng fileUploadService
  uploadFile: async (file, uploadType) => {
    try {
      const fileUploadService = (await import('./fileUploadApi')).default;
      return await fileUploadService.uploadFile(file, uploadType);
    } catch (error) {
      console.error("hostApi.uploadFile - Error:", error);
      logApiError(error, "uploadFile");
      throw error;
    }
  },

  // Upload proof of ownership - sử dụng fileUploadService
  uploadProofOfOwnership: async (file) => {
    try {
      const fileUploadService = (await import('./fileUploadApi')).default;
      return await fileUploadService.uploadProofOfOwnership(file);
    } catch (error) {
      console.error("hostApi.uploadProofOfOwnership - Error:", error);
      logApiError(error, "uploadProofOfOwnership");
      throw error;
    }
  },

  getMyProfile: async () => {
    try {
      // Sử dụng endpoint /hosts/my-profile như trong backend
      const response = await api.get("/hosts/my-profile");

      // Xử lý response format từ backend: { code: "00", message: "...", data: HostDTO }
      let hostData;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: HostDTO }
        hostData = response.data.data;
      } else if (response.data.id) {
        // Fallback: Format: HostDTO
        hostData = response.data;
      } else {
        throw new Error('Response format không hợp lệ');
      }
      
      return hostData;
    } catch (error) {
      logApiError(error, "getMyProfile");
      throw error;
    }
  },

  /**
   * Cập nhật thông tin cá nhân của Host đang đăng nhập.
   * @param {object} profileData - Dữ liệu profile cần cập nhật (HostDTO)
   */
  updateMyProfile: async (profileData) => {
    try {
      // Sử dụng endpoint PUT /api/hosts/my-profile
      const response = await api.put("/hosts/my-profile", profileData);

      // Xử lý response format từ backend: { code: "00", message: "...", data: HostDTO }
      let updatedProfile;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: HostDTO }
        updatedProfile = response.data.data;
      } else if (response.data.id) {
        // Fallback: Format: HostDTO
        updatedProfile = response.data;
      } else {
        throw new Error('Response format không hợp lệ');
      }

      // Cập nhật user data trong localStorage
      if (updatedProfile) {
        localStorage.setItem('user', JSON.stringify(updatedProfile));
      }

      return updatedProfile;
    } catch (error) {
      logApiError(error, "updateMyProfile");
      throw error;
    }
  },

  // Gửi đơn đăng ký làm chủ nhà - Sử dụng HostRequestDTO
  submitHostApplication: async (formData) => {
    try {
      console.log("hostApi.submitHostApplication - Starting submission");

      // Lấy thông tin từ FormData
      const userId = formData.get("userId");
      const userEmail = formData.get("userEmail");
      const username = formData.get("username");
      const nationalId = formData.get("nationalId");
      const address = formData.get("address");
      const phone = formData.get("phone");
      const idFrontPhoto = formData.get("idFrontPhoto");
      const idBackPhoto = formData.get("idBackPhoto");
      const proofOfOwnership = formData.get("proofOfOwnership");

      console.log("Form data received:", {
        userId,
        userEmail,
        username,
        nationalId,
        address,
        phone,
        hasFrontPhoto: !!idFrontPhoto,
        hasBackPhoto: !!idBackPhoto,
        hasProofOfOwnership: !!proofOfOwnership,
      });

      // Kiểm tra dữ liệu bắt buộc
      if (!userId || !userEmail || !username || !nationalId) {
        throw new Error(
          "Thiếu thông tin bắt buộc: userId, userEmail, username, nationalId"
        );
      }

      // Upload files trước
      let frontPhotoUrl = null;
      let backPhotoUrl = null;
      let proofOfOwnershipUrl = null;

      if (idFrontPhoto) {
        console.log("Uploading front photo...");
        try {
          const frontPhotoResponse = await hostApi.uploadFile(
            idFrontPhoto,
            "national-id"
          );
          frontPhotoUrl = frontPhotoResponse.fileUrl;
          console.log("Front photo uploaded:", frontPhotoUrl);
        } catch (uploadError) {
          console.error("Error uploading front photo:", uploadError);
          // Vẫn tiếp tục với việc gửi đơn, chỉ không có ảnh
        }
      }

      if (idBackPhoto) {
        console.log("Uploading back photo...");
        try {
          const backPhotoResponse = await hostApi.uploadFile(
            idBackPhoto,
            "national-id"
          );
          backPhotoUrl = backPhotoResponse.fileUrl;
          console.log("Back photo uploaded:", backPhotoUrl);
        } catch (uploadError) {
          console.error("Error uploading back photo:", uploadError);
          // Vẫn tiếp tục với việc gửi đơn, chỉ không có ảnh
        }
      }

      if (proofOfOwnership) {
        console.log("Uploading proof of ownership...");
        try {
          const proofResponse = await hostApi.uploadProofOfOwnership(
            proofOfOwnership
          );
          proofOfOwnershipUrl = proofResponse.fileUrl;
          console.log("Proof of ownership uploaded:", proofOfOwnershipUrl);
        } catch (uploadError) {
          console.error("Error uploading proof of ownership:", uploadError);
          // Vẫn tiếp tục với việc gửi đơn, chỉ không có ảnh
        }
      }

      // Tạo reason với URLs của files
      let reason = `Đăng ký làm chủ nhà - CCCD: ${nationalId}`;
      if (frontPhotoUrl || backPhotoUrl || proofOfOwnershipUrl) {
        reason += "\n\nẢnh đính kèm:";
        if (frontPhotoUrl) reason += `\n- Mặt trước CCCD: ${frontPhotoUrl}`;
        if (backPhotoUrl) reason += `\n- Mặt sau CCCD: ${backPhotoUrl}`;
        if (proofOfOwnershipUrl)
          reason += `\n- Giấy tờ sở hữu: ${proofOfOwnershipUrl}`;
      }

      // Tạo JSON object để gửi đến backend - đảm bảo đúng format HostRequestDTO
      const requestData = {
        userId: parseInt(userId),
        userEmail: userEmail,
        username: username,
        nationalId: nationalId,
        address: address,
        phone: phone,
        idFrontPhotoUrl: frontPhotoUrl,
        idBackPhotoUrl: backPhotoUrl,
        proofOfOwnershipUrl: proofOfOwnershipUrl,
        status: "PENDING",
        reason: reason,
        requestDate: new Date().toISOString(),
      };

      console.log("Sending request data:", requestData);

      // Sử dụng endpoint mới cho HostRequestDTO
      const response = await api.post("/host-requests", requestData);

      console.log("hostApi.submitHostApplication - Response:", response);
      console.log(
        "hostApi.submitHostApplication - Response data:",
        response.data
      );

      // Xử lý response format từ backend
      let result;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: HostRequestDTO }
        result = response.data;
      } else if (response.data.id) {
        // Fallback: Format: HostRequestDTO
        result = response.data;
      } else {
        throw new Error("Response format không hợp lệ");
      }

      return {
        success: true,
        data: result.data || result,
        message: result.message || "Gửi đơn đăng ký thành công",
      };
    } catch (error) {
      console.error("hostApi.submitHostApplication - Error:", error);
      console.error("Error response:", error.response?.data);

      // Xử lý lỗi 400 chi tiết hơn
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.message) {
          throw new Error(`Lỗi validation: ${errorData.message}`);
        } else if (errorData.error) {
          throw new Error(`Lỗi: ${errorData.error}`);
        } else {
          throw new Error(
            "Dữ liệu gửi không hợp lệ. Vui lòng kiểm tra lại thông tin."
          );
        }
      }

      logApiError(error, "submitHostApplication");
      throw error;
    }
  },

  // Lấy đơn đăng ký của user hiện tại
  getMyApplication: async (userId) => {
    try {
      const response = await api.get(`/host-requests/user/${userId}`);

      // Xử lý response format từ backend
      let application;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: HostRequestDTO }
        application = response.data.data;
      } else if (response.data.id) {
        // Fallback: Format: HostRequestDTO
        application = response.data;
      } else {
        throw new Error("Response format không hợp lệ");
      }

      return application;
    } catch (error) {
      console.error("hostApi.getMyApplication - Error:", error);
      logApiError(error, "getMyApplication");
      throw error;
    }
  },

  // Lấy chi tiết đơn đăng ký
  getApplicationById: async (applicationId) => {
    try {
      const response = await api.get(`/host-requests/${applicationId}`);

      // Xử lý response format từ backend
      let application;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: HostRequestDTO }
        application = response.data.data;
      } else if (response.data.id) {
        // Fallback: Format: HostRequestDTO
        application = response.data;
      } else {
        throw new Error("Response format không hợp lệ");
      }

      return application;
    } catch (error) {
      console.error("hostApi.getApplicationById - Error:", error);
      logApiError(error, "getApplicationById");
      throw error;
    }
  },

  // Lấy thông tin host (nếu đã được approve)
  getHostInfo: async (userId) => {
    try {
      const response = await api.get(`/hosts/${userId}`);

      // Xử lý response format từ backend
      let hostInfo;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: HostDTO }
        hostInfo = response.data.data;
      } else if (response.data.id) {
        // Fallback: Format: HostDTO
        hostInfo = response.data;
      } else {
        throw new Error("Response format không hợp lệ");
      }

      return hostInfo;
    } catch (error) {
      console.error("hostApi.getHostInfo - Error:", error);
      logApiError(error, "getHostInfo");
      throw error;
    }
  },

  // Cập nhật thông tin host
  updateHostInfo: async (userId, hostData) => {
    try {
      const response = await api.put(`/hosts/${userId}`, hostData);

      // Xử lý response format từ backend
      let updatedHost;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: HostDTO }
        updatedHost = response.data.data;
      } else if (response.data.id) {
        // Fallback: Format: HostDTO
        updatedHost = response.data;
      } else {
        throw new Error("Response format không hợp lệ");
      }

      return {
        success: true,
        data: updatedHost,
        message: response.data.message || "Cập nhật thông tin host thành công",
      };
    } catch (error) {
      console.error("hostApi.updateHostInfo - Error:", error);
      logApiError(error, "updateHostInfo");
      throw error;
    }
  },

  // Đổi mật khẩu cho host (sử dụng endpoint mới cho host)
  changePassword: async (userId, oldPassword, newPassword, confirmPassword) => {
    try {
      console.log("hostApi.changePassword - Starting password change for user:", userId);
      
      // Sử dụng endpoint mới cho host - không cần userId trong body
      const requestData = {
        oldPassword: oldPassword || '',
        newPassword: newPassword || '',
        confirmPassword: confirmPassword || ''
      };
      
      console.log("hostApi.changePassword - Request data:", requestData);
      console.log("hostApi.changePassword - Request data types:", {
        oldPassword: typeof oldPassword,
        newPassword: typeof newPassword,
        confirmPassword: typeof confirmPassword
      });
      
      const response = await api.put(`/hosts/change-password`, requestData);

      console.log("hostApi.changePassword - Response:", response);
      console.log("hostApi.changePassword - Response data:", response.data);

      // Xử lý response format từ backend: { code: "00", message: "...", data: ... }
      let result;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: ... }
        result = response.data;
      } else {
        // Fallback: Format: { message: "...", ... }
        result = response.data;
      }

      console.log("hostApi.changePassword - Processed result:", result);
      return result;
    } catch (error) {
      console.error("hostApi.changePassword - Error:", error);
      console.error("hostApi.changePassword - Error response:", error.response);
      logApiError(error, "changePassword");
      throw error;
    }
  },

  // Host statistics
  getStatistics: async () => {
    try {
      // Backend endpoint is /hosts/my-stats without period parameter
      const response = await api.get('/hosts/my-stats');
      return response;
    } catch (error) {
      logApiError(error, "getStatistics");
      throw error;
    }
  },
    
  getHostStatistics: async (hostId, period = 'current_month') => {
    try {
      const response = await api.get(`/hosts/${hostId}/statistics?period=${period}`);
      return response;
    } catch (error) {
      logApiError(error, "getHostStatistics");
      throw error;
    }
  },
};

export default hostApi;
