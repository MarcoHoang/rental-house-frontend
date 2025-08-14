import axios from 'axios';
import { AUTH_CONFIG } from '../config/auth';
import { handleApiError, logApiError } from '../utils/apiErrorHandler';

// Cấu hình axios cho file upload
const fileUploadApi = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 30000, // Tăng timeout cho upload file
  headers: {
    'Accept': 'application/json'
  }
});

// Interceptor để thêm token
fileUploadApi.interceptors.request.use(
  config => {
    if (AUTH_CONFIG.ENABLE_AUTH) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Không set Content-Type cho FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  error => {
    logApiError(error, 'FileUpload Request Interceptor');
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
fileUploadApi.interceptors.response.use(
  response => response,
  error => {
    logApiError(error, 'FileUpload Response Interceptor');
    return Promise.reject(error);
  }
);

const fileUploadService = {
  /**
   * Upload avatar - sử dụng endpoint chuyên biệt
   * @param {File} file - File ảnh avatar
   * @returns {Promise<Object>} Kết quả upload
   */
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fileUploadApi.post('/files/upload/avatar', formData);

      // Xử lý response theo format của backend
      let result;
      if (response.data && response.data.data) {
        // Format: { code: "00", message: "...", data: FileUploadResponse }
        result = response.data.data;
      } else if (response.data && response.data.fileUrl) {
        // Format: { fileUrl: "...", ... }
        result = response.data;
      } else if (typeof response.data === 'string') {
        // Format: "avatar/filename.jpg"
        result = { fileUrl: response.data };
      } else {
        throw new Error('Response format không hợp lệ');
      }

      return result;
    } catch (error) {
      console.error('fileUploadService.uploadAvatar - Error:', error);
      logApiError(error, 'uploadAvatar');
      throw error;
    }
  },

  /**
   * Upload ảnh nhà - sử dụng endpoint chuyên biệt
   * @param {File[]} files - Danh sách file ảnh
   * @returns {Promise<Array>} Kết quả upload
   */
  uploadHouseImages: async (files) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fileUploadApi.post('/files/upload/house-images', formData);

      // Xử lý response theo format của backend
      if (response.data && response.data.data) {
        return response.data.data.map(item => {
          if (typeof item === 'string') {
            return item;
          }
          return item.fileUrl || item.url || item.path || '';
        }).filter(url => url);
      }
      
      return [];
    } catch (error) {
      console.error('fileUploadService.uploadHouseImages - Error:', error);
      logApiError(error, 'uploadHouseImages');
      throw error;
    }
  },

  /**
   * Upload proof of ownership - sử dụng endpoint chuyên biệt
   * @param {File} file - File giấy tờ chứng minh quyền sở hữu
   * @returns {Promise<Object>} Kết quả upload
   */
  uploadProofOfOwnership: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fileUploadApi.post('/files/upload/proof-of-ownership', formData);

      // Xử lý response format từ backend
      let result;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: FileUploadResponse }
        result = response.data.data;
      } else if (response.data.fileUrl) {
        // Fallback: Format: FileUploadResponse
        result = response.data;
      } else {
        throw new Error('Response format không hợp lệ');
      }

      return result;
    } catch (error) {
      console.error('fileUploadService.uploadProofOfOwnership - Error:', error);
      logApiError(error, 'uploadProofOfOwnership');
      throw error;
    }
  },

  /**
   * Upload file chung với uploadType
   * @param {File} file - File cần upload
   * @param {string} uploadType - Loại upload (avatar, house-image, proof-of-ownership, etc.)
   * @returns {Promise<Object>} Kết quả upload
   */
  uploadFile: async (file, uploadType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadType', uploadType);

      const response = await fileUploadApi.post('/files/upload', formData);

      // Xử lý response format từ backend
      let result;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: FileUploadResponse }
        result = response.data.data;
      } else if (response.data.fileUrl) {
        // Fallback: Format: FileUploadResponse
        result = response.data;
      } else {
        throw new Error('Response format không hợp lệ');
      }

      return result;
    } catch (error) {
      console.error('fileUploadService.uploadFile - Error:', error);
      logApiError(error, 'uploadFile');
      throw error;
    }
  },

  /**
   * Upload nhiều file với uploadType
   * @param {Array<File>} files - Danh sách file cần upload
   * @param {string} uploadType - Loại upload
   * @returns {Promise<Array<Object>>} Danh sách kết quả upload
   */
  uploadMultipleFiles: async (files, uploadType) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('uploadType', uploadType);

      const response = await fileUploadApi.post('/files/upload/multiple', formData);

      // Xử lý response format từ backend
      let results;
      if (response.data.data) {
        // Format: { code: "00", message: "...", data: [FileUploadResponse] }
        results = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Fallback: Format: [FileUploadResponse]
        results = response.data;
      } else {
        throw new Error('Response format không hợp lệ');
      }

      return results;
    } catch (error) {
      console.error('fileUploadService.uploadMultipleFiles - Error:', error);
      logApiError(error, 'uploadMultipleFiles');
      throw error;
    }
  },

  /**
   * Xóa file
   * @param {string} fileUrl - URL của file cần xóa
   * @returns {Promise<boolean>} Kết quả xóa
   */
  deleteFile: async (fileUrl) => {
    try {
      const response = await fileUploadApi.delete('/files/delete', {
        params: { fileUrl }
      });

      return response.status === 200;
    } catch (error) {
      console.error('fileUploadService.deleteFile - Error:', error);
      logApiError(error, 'deleteFile');
      throw error;
    }
  }
};

export default fileUploadService;
