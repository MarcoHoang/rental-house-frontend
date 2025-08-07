// src/api/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Tạo một instance axios mặc định
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Xử lý lỗi 401 (Unauthorized)
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Xóa thông tin đăng nhập
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Chuyển hướng về trang đăng nhập
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const authService = {
    // Cập nhật thông tin người dùng
    updateProfile: async (profileData) => {
        try {
            const formData = new FormData();
            
            // Thêm tất cả các trường dữ liệu vào formData
            Object.keys(profileData).forEach(key => {
                if (profileData[key] !== undefined && profileData[key] !== null) {
                    formData.append(key, profileData[key]);
                }
            });

            const response = await api.put('/users/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            const response = await api.post('auth/login', {
                email,
                password
            });

            console.log('API Response:', response.data);

            if (response.data && response.data.data && response.data.data.token) {
                return {
                    token: response.data.data.token,
                    user: {
                        email: email,
                        // Thêm các trường khác nếu cần
                    }
                };
            }
            throw new Error('Phản hồi từ máy chủ không hợp lệ');
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            throw error.response?.data || {
                message: error.message || 'Đăng nhập thất bại',
                status: error.response?.status
            };
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            throw error.response?.data || {
                message: error.message || 'Đăng ký thất bại',
                status: error.response?.status
            };
        }
    },

    getProfile: async () => {
        try {
            const response = await api.get('users/profile');
            return response.data;
        } catch (error) {
            console.error('Lỗi lấy thông tin người dùng:', error);
            throw error.response?.data || {
                message: error.message || 'Không thể lấy thông tin người dùng',
                status: error.response?.status
            };
        }
    },

    // ========== CÁC HÀM QUÊN MẬT KHẨU ==========
    requestPasswordReset: async (email) => {
        try {
            const response = await api.post('users/request-password-reset', { email });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi yêu cầu đặt lại mật khẩu:', error);
            throw error.response?.data || {
                message: error.message || 'Có lỗi xảy ra khi yêu cầu đặt lại mật khẩu',
                status: error.response?.status
            };
        }
    },

    verifyOtp: async (email, otp) => {
        try {
            const response = await api.post('users/verify-otp', { email, otp });
            return response.data;
        } catch (error) {
            console.error('Lỗi xác thực OTP:', error);
            throw error.response?.data || {
                message: error.message || 'Mã OTP không hợp lệ hoặc đã hết hạn',
                status: error.response?.status
            };
        }
    },

    resetPassword: async (email, otp, newPassword) => {
        try {
            const response = await api.post('users/reset-password', {
                email,
                otp,
                newPassword
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi đặt lại mật khẩu:', error);
            throw error.response?.data || {
                message: error.message || 'Có lỗi xảy ra khi đặt lại mật khẩu',
                status: error.response?.status
            };
        }
    }
};

export default authService;