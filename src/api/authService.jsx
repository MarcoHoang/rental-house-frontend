// src/api/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

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

export const authService = {
    // Cập nhật thông tin người dùng
    updateProfile: async (profileData) => {
        try {
            const formData = new FormData();
            
            // Thêm các trường dữ liệu vào formData
            if (profileData.fullName) formData.append('fullName', profileData.fullName);
            if (profileData.phone) formData.append('phone', profileData.phone);
            if (profileData.address) formData.append('address', profileData.address);
            if (profileData.dateOfBirth) formData.append('dateOfBirth', profileData.dateOfBirth);
            if (profileData.avatar) formData.append('avatar', profileData.avatar);
            
            const response = await api.put('/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            throw error.response?.data || { 
                message: error.message || 'Có lỗi xảy ra khi cập nhật thông tin' 
            };
        }
    },
    
    login: async (email, password) => {
        try {
            const response = await api.post('/login', { 
                email, 
                password 
            });
            
            console.log('API Response:', response.data); // Thêm log để debug
            
            // Đảm bảo phản hồi có đúng định dạng
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
            const response = await api.post('/register', userData);
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
            const response = await api.get('/profile');
            return response.data;
        } catch (error) {
            console.error('Lỗi lấy thông tin người dùng:', error);
            throw error.response?.data || { 
                message: error.message || 'Không thể lấy thông tin người dùng',
                status: error.response?.status
            };
        }
    }
};