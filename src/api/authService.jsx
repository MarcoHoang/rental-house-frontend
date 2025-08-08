// src/api/authService.jsx
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
        // Đơn giản hóa cấu hình request
        config.withCredentials = false;
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
    updateProfile: async (formData) => {
        try {
            const response = await api.put('/users/profile', formData, {
                headers: formData instanceof FormData 
                    ? { 'Content-Type': 'multipart/form-data' } 
                    : { 'Content-Type': 'application/json' }
            });
            
            // Cập nhật thông tin người dùng mới
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                window.dispatchEvent(new Event('userDataUpdated'));
            }
            
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            throw error;
        }
    },

    // Lấy thông tin người dùng
    getProfile: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
            }

            const response = await api.get('/users/profile');
            const userData = response.data?.data || response.data;

            // Kiểm tra dữ liệu trả về
            if (!userData) {
                throw new Error('Không nhận được dữ liệu người dùng từ API');
            }

            localStorage.setItem('user', JSON.stringify(userData));
            // window.dispatchEvent(new Event('userDataUpdated'));

            return userData;
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
            if (error.response?.status === 403) {
                console.error('Không có quyền truy cập. Token có thể không hợp lệ.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // window.location.href = '/login';
            }
            throw error.response?.data || {
                message: error.message || 'Lỗi khi lấy thông tin người dùng',
                status: error.response?.status
            };
        }
    },

    // Đăng nhập
    login: async (email, password) => {
        try {
            console.log('Gửi yêu cầu đăng nhập đến:', api.defaults.baseURL + '/auth/login');
            const response = await api.post('auth/login', 
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    withCredentials: false
                }
            );
            
            console.log('Phản hồi đăng nhập:', response);
            const responseData = response.data?.data || response.data;

            if (responseData?.token) {
                localStorage.setItem('token', responseData.token);
                
                return responseData;
            }
            
            throw new Error('Đăng nhập thất bại: Không nhận được token');
        } catch (error) {
            console.error('Lỗi đăng nhập chi tiết:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data,
                    headers: error.config?.headers
                }
            });

            let errorMessage = 'Đăng nhập thất bại';
            
            if (error.response) {
                if (error.response.status === 403) {
                    errorMessage = 'Truy cập bị từ chối. Tài khoản của bạn không có quyền truy cập.';
                } else if (error.response.status === 401) {
                    errorMessage = 'Email hoặc mật khẩu không chính xác';
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.request) {
                errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
            }

            const errorToThrow = new Error(errorMessage);
            errorToThrow.status = error.response?.status;
            errorToThrow.response = error.response;
            throw errorToThrow;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('auth/register', userData);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('Lỗi khi đăng ký:', error);
            throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
        }
    },

    // ========== CÁC HÀM QUÊN MẬT KHẨU ==========
    requestPasswordReset: async (email) => {
        try {
            const response = await api.post('auth/forgot-password', { email });
            return response.data?.data || response.data;
        } catch (error) {
            console.error('Lỗi khi yêu cầu đặt lại mật khẩu:', error);
            throw new Error(error.response?.data?.message || 'Yêu cầu đặt lại mật khẩu thất bại');
        }
    },

    verifyOtp: async (email, otp) => {
        try {
            const response = await api.post('auth/verify-otp', { email, otp });
            return response.data?.data || response.data;
        } catch (error) {
            console.error('Lỗi khi xác minh OTP:', error);
            throw new Error(error.response?.data?.message || 'Xác minh OTP thất bại');
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