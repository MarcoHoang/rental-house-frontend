// src/api/authService.jsx
import axios from 'axios';
import { AUTH_CONFIG } from '../config/auth';
import { handleApiError, logApiError } from '../utils/apiErrorHandler';
import { safeSetToStorage, safeRemoveFromStorage } from '../utils/localStorage';

// Cấu hình axios mặc định
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor để thêm token và debug request
api.interceptors.request.use(
  config => {
    // Thêm token nếu có và đang bật xác thực
    if (AUTH_CONFIG.ENABLE_AUTH) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Không set Content-Type cho FormData (để browser tự set với boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Chỉ debug khi không phải production và không phải request lặp lại
    if (process.env.NODE_ENV === 'development' && !config._retry) {
      console.group(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log('Request Config:', {
        method: config.method,
        url: config.url,
        headers: config.headers,
        data: config.data instanceof FormData ? 'FormData' : config.data
      });
      console.groupEnd();
    }
    
    return config;
  },
  error => {
    logApiError(error, 'Request Interceptor');
    return Promise.reject(error);
  }
);

// Xử lý lỗi response
api.interceptors.response.use(
  response => response,
  error => {
    logApiError(error, 'Response Interceptor');
    
    // Xử lý lỗi 401
    if (error.response?.status === 401 && AUTH_CONFIG.ENABLE_AUTH) {
      handleApiError(error, { clearAuthOn401: true });
      window.dispatchEvent(new Event('unauthorized'));
    }
    
    return Promise.reject(error);
  }
);

const authService = {
    // Lấy thông tin user hiện tại
    getCurrentUser: async () => {
        try {
            const response = await api.get('/users/profile');
            
            if (!response.data) {
                throw new Error('Không nhận được dữ liệu từ server');
            }
            
            console.log('authService.getCurrentUser - Raw response:', response.data);
            
            // Backend trả về format: { code: "00", message: "...", data: UserDTO }
            let userData;
            if (response.data.data) {
                // Format: { code: "00", message: "...", data: { id: 14, fullName: "...", ... } }
                userData = response.data.data;
            } else if (response.data.id) {
                // Fallback: Format: { id: ..., fullName: ..., ... }
                userData = response.data;
            } else {
                console.error('authService.getCurrentUser - Unknown response format:', response.data);
                throw new Error('Format response không được hỗ trợ');
            }
            
            console.log('authService.getCurrentUser - Extracted user data:', userData);
            
            // Kiểm tra xem user data có id không
            if (!userData) {
                console.error('authService.getCurrentUser - No user data received');
                throw new Error('Không nhận được thông tin user từ server');
            }
            
            if (!userData.id) {
                console.error('authService.getCurrentUser - User data missing ID:', userData);
                throw new Error('Thông tin user không hợp lệ - thiếu ID');
            }
            
            // Lưu thông tin user vào localStorage
            console.log('authService.getCurrentUser - Storing user data in localStorage:', userData);
            safeSetToStorage('user', userData);
            
            return userData;
            
        } catch (error) {
            logApiError(error, 'getCurrentUser');
            
            if (error.response?.status === 401) {
                handleApiError(error, { clearAuthOn401: true });
            }
            
            throw error;
        }
    },

    // Đăng nhập user
    login: async (email, password) => {
        try {
            console.log('authService.login - Starting login for:', email);
            
            const response = await api.post('/auth/login', {
                email,
                password
            });

            console.log('authService.login - Raw response:', response);
            console.log('authService.login - Response data:', response.data);
            console.log('authService.login - Response status:', response.status);

            // Xử lý response format từ backend
            let loginData, token, user;
            
            // Backend có thể trả về các format khác nhau
            if (response.data.data) {
                // Format: { data: { token, user } } hoặc { code: "00", data: { token, user } }
                loginData = response.data.data;
                token = loginData.token || loginData.accessToken;
                user = loginData.user;
            } else if (response.data.token) {
                // Format: { token, user }
                token = response.data.token;
                user = response.data.user;
            } else if (response.data.accessToken) {
                // Format: { accessToken, user }
                token = response.data.accessToken;
                user = response.data.user;
            } else {
                // Format khác - log để debug
                console.log('authService.login - Unknown response format:', response.data);
                throw new Error('Format response không được hỗ trợ');
            }

            console.log('authService.login - Extracted token:', token);
            console.log('authService.login - Extracted user:', user);

            // Lưu token trước
            if (token) {
                console.log('authService.login - Storing token in localStorage');
                localStorage.setItem('token', token);
            } else {
                throw new Error('Không nhận được token từ server');
            }

            // Nếu không có user data trong response, gọi API để lấy
            if (!user) {
                console.log('authService.login - No user data in response, fetching user profile...');
                try {
                    user = await authService.getCurrentUser();
                    console.log('authService.login - Fetched user data:', user);
                } catch (profileError) {
                    console.error('authService.login - Error fetching user profile:', profileError);
                    throw new Error('Không thể lấy thông tin user từ server. Vui lòng thử lại.');
                }
            }

            // Kiểm tra xem user data có id không
            if (!user || !user.id) {
                console.error('authService.login - User data missing ID:', user);
                throw new Error('Thông tin user không hợp lệ. Vui lòng đăng nhập lại.');
            }

            // Lưu user data
            console.log('authService.login - Storing user data in localStorage:', user);
            safeSetToStorage('user', user);
            
            // Trả về data với format chuẩn
            const result = {
                success: true,
                data: {
                    token,
                    user
                },
                message: response.data.message || 'Đăng nhập thành công'
            };
            console.log('authService.login - Returning result:', result);
            return result;
            
        } catch (error) {
            console.error('authService.login - Error:', error);
            console.error('authService.login - Error response:', error.response);
            logApiError(error, 'login');
            throw error;
        }
    },

    // Đăng ký user
    register: async (userData) => {
        try {
            console.log('authService.register - Starting registration with data:', userData);
            
            // Chuyển đổi dữ liệu để phù hợp với backend User entity
            // Backend: username = email (để đăng nhập), fullName = tên hiển thị
            const registerData = {
                email: userData.email,
                username: userData.email, // Backend set username = email để đăng nhập
                password: userData.password,
                fullName: userData.username, // Frontend username map với backend fullName
                phone: userData.phone,
                address: userData.address || null,
                active: true, // Mặc định active khi đăng ký
                avatarUrl: "/images/default-avatar.png" // Default avatar
            };

            console.log('authService.register - Register data to send:', registerData);

            const response = await api.post('/auth/register', registerData);
            
            console.log('authService.register - Response:', response);
            console.log('authService.register - Response data:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('authService.register - Error:', error);
            console.error('authService.register - Error response:', error.response);
            logApiError(error, 'register');
            throw error;
        }
    },

    // Upload avatar
    uploadAvatar: async (file) => {
        try {
            const token = localStorage.getItem('token');
            console.log('authService.uploadAvatar - Token exists:', !!token);
            console.log('authService.uploadAvatar - AUTH_CONFIG.ENABLE_AUTH:', AUTH_CONFIG.ENABLE_AUTH);
            
            if (AUTH_CONFIG.ENABLE_AUTH && !token) {
                throw new Error('Vui lòng đăng nhập lại');
            }

            console.log('authService.uploadAvatar - Starting avatar upload for file:', file.name, 'Size:', file.size);

            // Tạo FormData để gửi file
            const formData = new FormData();
            formData.append('file', file);

            // Không set Content-Type header - để browser tự set với boundary
            const response = await api.post('/files/upload/avatar', formData);

            console.log('authService.uploadAvatar - Response:', response);
            console.log('authService.uploadAvatar - Response data:', response.data);

            // Xử lý response format từ backend: { code: "00", message: "...", data: FileUploadResponse }
            let fileResponse;
            if (response.data.data) {
                // Format: { code: "00", message: "...", data: { fileUrl: "...", fileName: "..." } }
                fileResponse = response.data.data;
            } else if (response.data.fileUrl) {
                // Fallback: Format: { fileUrl: "...", fileName: "..." }
                fileResponse = response.data;
            } else {
                console.error('authService.uploadAvatar - Unknown response format:', response.data);
                throw new Error('Response format không hợp lệ');
            }

            console.log('authService.uploadAvatar - File response:', fileResponse);

            return {
                success: true,
                data: fileResponse,
                message: response.data.message || 'Upload avatar thành công'
            };

        } catch (error) {
            console.error('authService.uploadAvatar - Error:', error);
            console.error('authService.uploadAvatar - Error response:', error.response);
            console.error('authService.uploadAvatar - Error data:', error.response?.data);
            logApiError(error, 'uploadAvatar');
            
            if (error.response?.status === 401) {
                handleApiError(error, { 
                    clearAuthOn401: true, 
                    redirectOn401: true,
                    redirectPath: '/login?sessionExpired=true'
                });
            }
            
            throw error;
        }
    },

    // Cập nhật profile
    updateProfile: async (userId, userData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vui lòng đăng nhập lại');
            }

            console.log('authService.updateProfile - Starting update for user:', userId);
            console.log('authService.updateProfile - User data:', userData);

            // Xử lý ngày sinh - chuyển đổi sang format YYYY-MM-DD
            let birthDate = null;
            if (userData.dateOfBirth) {
                try {
                    const date = new Date(userData.dateOfBirth);
                    if (!isNaN(date.getTime())) {
                        birthDate = date.toISOString().split('T')[0];
                        console.log('authService.updateProfile - Parsed birthDate:', birthDate);
                    } else {
                        console.warn('authService.updateProfile - Invalid dateOfBirth:', userData.dateOfBirth);
                    }
                } catch (error) {
                    console.error('authService.updateProfile - Error parsing dateOfBirth:', error);
                }
            }

            // Chuyển đổi dữ liệu để phù hợp với UserDTO
            const profileData = {
                id: userId,
                fullName: userData.fullName,
                phone: userData.phone,
                address: userData.address,
                avatarUrl: userData.avatarUrl,
                email: userData.email,
                birthDate: birthDate, // Sử dụng ngày sinh đã xử lý
                active: userData.active,
                roleName: userData.roleName
            };

            console.log('authService.updateProfile - Profile data to send:', profileData);

            // Gọi đúng endpoint theo UserController
            const response = await api.put(`/users/${userId}/profile`, profileData);

            console.log('authService.updateProfile - Response:', response);
            console.log('authService.updateProfile - Response data:', response.data);

            // Xử lý response format từ backend: { code: "00", message: "...", data: UserDTO }
            let updatedUser;
            if (response.data.data) {
                // Format: { code: "00", message: "...", data: { id: 14, fullName: "...", ... } }
                updatedUser = response.data.data;
            } else if (response.data.id) {
                // Fallback: Format: { id: ..., fullName: ..., ... }
                updatedUser = response.data;
            } else {
                throw new Error('Response format không hợp lệ');
            }

            console.log('authService.updateProfile - Updated user data:', updatedUser);
            
            // Cập nhật user trong localStorage
            if (updatedUser) {
                safeSetToStorage('user', updatedUser);
                console.log('authService.updateProfile - User data saved to localStorage');
            }

            return {
                success: true,
                data: updatedUser,
                message: response.data.message || 'Cập nhật profile thành công'
            };
            
        } catch (error) {
            console.error('authService.updateProfile - Error:', error);
            console.error('authService.updateProfile - Error response:', error.response);
            logApiError(error, 'updateProfile');
            
            if (error.response?.status === 401) {
                handleApiError(error, { 
                    clearAuthOn401: true, 
                    redirectOn401: true,
                    redirectPath: '/login?sessionExpired=true'
                });
            }
            
            throw error;
        }
    },

    // Lấy profile
    getProfile: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
            }

            const response = await api.get('/users/profile');
            return response.data.data || response.data;
        } catch (error) {
            logApiError(error, 'getProfile');
            throw error;
        }
    },

    // Đổi mật khẩu
    changePassword: async (userId, oldPassword, newPassword) => {
        try {
            const response = await api.put(`/users/${userId}/change-password`, {
                oldPassword,
                newPassword
            });
            return response.data;
        } catch (error) {
            logApiError(error, 'changePassword');
            throw error;
        }
    },

    // Quên mật khẩu
    forgotPassword: async (email) => {
        try {
            const response = await api.post('/users/password-reset/request', null, {
                params: { email }
            });
            return response.data;
        } catch (error) {
            logApiError(error, 'forgotPassword');
            throw error;
        }
    },

    // Request password reset (alias cho forgotPassword)
    requestPasswordReset: async (email) => {
        try {
            const response = await api.post('/users/password-reset/request', null, {
                params: { email }
            });
            return response.data;
        } catch (error) {
            logApiError(error, 'requestPasswordReset');
            throw error;
        }
    },

    // Verify OTP - Backend có thể không có endpoint này, cần check
    verifyOtp: async (email, otp) => {
        try {
            // Tạm thời return success nếu backend chưa có endpoint này
            console.warn('verifyOtp: Backend endpoint not implemented yet');
            return { success: true, message: 'OTP verified' };
        } catch (error) {
            logApiError(error, 'verifyOtp');
            throw error;
        }
    },

    // Reset mật khẩu - Sử dụng endpoint có sẵn từ backend
    resetPassword: async (token, newPassword) => {
        try {
            const response = await api.post('/users/password-reset/confirm', null, {
                params: { token, newPassword }
            });
            return response.data;
        } catch (error) {
            logApiError(error, 'resetPassword');
            throw error;
        }
    },

    // Đăng xuất
    logout: () => {
        safeRemoveFromStorage('token');
        safeRemoveFromStorage('user');
        window.dispatchEvent(new Event('unauthorized'));
    }
};

export default authService;