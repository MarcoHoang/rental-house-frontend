// src/api/authService.jsx
import axios from 'axios';

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
    // Thêm token nếu có
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Chỉ debug khi không phải production và không phải request lặp lại
    if (import.meta.env.MODE !== 'production' && !config._retry) {
      console.group(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log('Request Config:', {
        method: config.method,
        url: config.url,
        headers: config.headers,
        data: config.data
      });
      console.groupEnd();
    }
    
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Xử lý lỗi response
api.interceptors.response.use(
  response => response,
  error => {
    const { status } = error.response || {};
    
    if (status === 401) {
      // Xóa thông tin đăng nhập
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Kích hoạt sự kiện để các component khác biết
      window.dispatchEvent(new Event('unauthorized'));
    }
    
    return Promise.reject(error);
  }
);

const authService = {
    // Lấy thông tin user hiện tại
    getCurrentUser: async () => {
        console.log('Bắt đầu lấy thông tin người dùng...');
        try {
            const response = await api.get('/users/profile');
            
            if (!response.data) {
                throw new Error('Không nhận được dữ liệu từ server');
            }
            
            const userData = response.data.data || response.data;
            
            // Lưu thông tin user vào localStorage
            if (userData) {
                localStorage.setItem('user', JSON.stringify(userData));
            }
            
            console.log('Lấy thông tin người dùng thành công');
            return userData;
            
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            
            if (error.response?.status === 401) {
                console.log('Lỗi 401: Xác thực thất bại, xóa token');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Không chuyển hướng ở đây, để component tự xử lý
                return null;
            }
            
            // Nếu có lỗi khác, vẫn trả về null để component xử lý
            return null;
        }
    },

    // Cập nhật thông tin người dùng
    updateProfile: async (userId, userData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vui lòng đăng nhập lại');
            }

            const response = await api.put(`/users/${userId}/profile`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.data) {
                throw new Error('Không nhận được phản hồi từ server');
            }

            const updatedUser = response.data.data || response.data;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('userDataUpdated'));
            return updatedUser;
            
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            
            if (error.response?.status === 401) {
                // Nếu lỗi 401, xóa thông tin đăng nhập
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login?sessionExpired=true';
                return null;
            }
            
            throw error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật thông tin';
        }
    },

    // Giữ nguyên các hàm khác
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
            return userData;
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
            if (error.response?.status === 403) {
                console.error('Không có quyền truy cập. Token có thể không hợp lệ.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
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