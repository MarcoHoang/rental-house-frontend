// src/api/authService.jsx
import axios from 'axios';
import { AUTH_CONFIG } from '../config/auth';
import { handleApiError, logApiError } from '../utils/apiErrorHandler';
import { safeSetToStorage, safeRemoveFromStorage } from '../utils/localStorage';
import { mapBackendRoleToFrontend, ensureUserHasRoleName } from '../utils/roleMapper';

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
    // Đăng nhập với vai trò host (sử dụng endpoint login chung)
    loginAsHost: async (email, password) => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            // Xử lý response format từ backend
            let loginData, token, hostData;
            
            console.log('authService.loginAsHost - Raw response.data:', response.data);
            console.log('authService.loginAsHost - response.data.data:', response.data.data);
            
            if (response.data.data) {
                loginData = response.data.data;
                token = loginData.token;
                hostData = loginData.user;
                
                console.log('authService.loginAsHost - loginData.role:', loginData.role);
                console.log('authService.loginAsHost - hostData.roleName (before):', hostData.roleName);
                
                // Backend trả về role riêng biệt, cần merge vào user object
                if (loginData.role && !hostData.roleName) {
                    const roleName = mapBackendRoleToFrontend(loginData.role);
                    if (roleName) {
                        hostData.roleName = roleName;
                        console.log('authService.loginAsHost - Set hostData.roleName to:', roleName);
                    }
                }
                
                console.log('authService.loginAsHost - hostData.roleName (after):', hostData.roleName);
            } else {
                throw new Error('Format response không được hỗ trợ');
            }

            // Lưu token
            if (token) {
                localStorage.setItem('token', token);
            } else {
                throw new Error('Không nhận được token từ server');
            }

            // Nếu không có host data trong response, thử gọi API để lấy
            if (!hostData) {
                console.log('authService.loginAsHost - No host data in response, trying to fetch host profile...');
                try {
                    hostData = await authService.getHostProfile();
                    console.log('authService.loginAsHost - Successfully fetched host data:', hostData);
                } catch (profileError) {
                    console.error('authService.loginAsHost - Error fetching host profile:', profileError);
                    throw new Error('Không thể lấy thông tin host. Vui lòng thử lại.');
                }
            }

            // Kiểm tra role phải là HOST
            if (!hostData) {
                throw new Error('Không nhận được thông tin người dùng từ server');
            }
            
            // Kiểm tra role phải là HOST
            if (hostData.roleName !== 'HOST') {
                console.error('authService.loginAsHost - User role is not HOST:', hostData.roleName);
                throw new Error(`Tài khoản này có role ${hostData.roleName}, không phải là chủ nhà. Vui lòng sử dụng tài khoản chủ nhà hợp lệ.`);
            }
            
            // Đảm bảo roleName được set đúng
            if (!hostData.roleName) {
                hostData.roleName = 'HOST';
            }

            // Lưu host data
            console.log('authService.loginAsHost - Storing host data in localStorage:', hostData);
            safeSetToStorage('user', hostData);
            
            return {
                success: true,
                data: {
                    token,
                    user: hostData
                },
                message: response.data.message || 'Đăng nhập host thành công'
            };
            
        } catch (error) {
            console.error('authService.loginAsHost - Error:', error);
            logApiError(error, 'loginAsHost');
            throw error;
        }
    },

    // Lấy thông tin host hiện tại (riêng biệt với user thường)
    getHostProfile: async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('authService.getHostProfile - Token exists:', !!token);
            
            if (!token) {
                throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
            }

            // Thử gọi endpoint host profile riêng biệt
            let response;
            try {
                response = await api.get('/hosts/profile');
                console.log('authService.getHostProfile - Using /hosts/profile endpoint');
            } catch (error) {
                // Nếu không có endpoint host riêng, thử endpoint user chung
                console.log('authService.getHostProfile - Host endpoint not found, trying user endpoint');
                response = await api.get('/users/profile');
            }
            
            if (!response.data) {
                throw new Error('Không nhận được dữ liệu từ server');
            }
            
            console.log('authService.getHostProfile - Raw response:', response.data);
            
            // Backend trả về format: { code: "00", message: "...", data: HostDTO }
            let hostData;
            if (response.data.data) {
                hostData = response.data.data;
            } else if (response.data.id) {
                hostData = response.data;
            } else {
                console.error('authService.getHostProfile - Unknown response format:', response.data);
                throw new Error('Format response không được hỗ trợ');
            }
            
            console.log('=== DEBUG HOST PROFILE DATA ===');
            console.log('authService.getHostProfile - Extracted host data:', hostData);
            console.log('=== END DEBUG ===');
            
            if (!hostData) {
                throw new Error('Không nhận được thông tin host từ server');
            }
            
            if (!hostData.id) {
                throw new Error('Thông tin host không hợp lệ - thiếu ID');
            }

            // Đảm bảo role là HOST
            if (!hostData.roleName) {
                const token = localStorage.getItem('token');
                hostData = ensureUserHasRoleName(hostData, token);
            }
            
            // Lưu thông tin host vào localStorage
            console.log('authService.getHostProfile - Storing host data in localStorage:', hostData);
            safeSetToStorage('user', hostData);
            
            return hostData;
            
        } catch (error) {
            console.error('authService.getHostProfile - Error:', error);
            logApiError(error, 'getHostProfile');
            throw error;
        }
    },

    // Lấy thông tin user hiện tại
    getCurrentUser: async () => {
        try {
            // Kiểm tra token trước khi gọi API
            const token = localStorage.getItem('token');
            console.log('authService.getCurrentUser - Token exists:', !!token);
            console.log('authService.getCurrentUser - Token value:', token ? token.substring(0, 20) + '...' : 'null');
            
            if (!token) {
                throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
            }

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
            
            console.log('=== DEBUG PROFILE DATA ===');
            console.log('authService.getCurrentUser - Extracted user data:', userData);
            console.log('authService.getCurrentUser - userData.fullName (tên hiển thị từ backend):', userData.fullName);
            console.log('authService.getCurrentUser - userData.email (email từ backend):', userData.email);
            console.log('authService.getCurrentUser - userData.username (username từ backend):', userData.username);
            console.log('authService.getCurrentUser - userData.roleName (role từ backend):', userData.roleName);
            console.log('=== END DEBUG ===');
            
            // Kiểm tra xem user data có id không
            if (!userData) {
                console.error('authService.getCurrentUser - No user data received');
                throw new Error('Không nhận được thông tin user từ server');
            }
            
            if (!userData.id) {
                console.error('authService.getCurrentUser - User data missing ID:', userData);
                throw new Error('Thông tin user không hợp lệ - thiếu ID');
            }
            
            // Kiểm tra xem fullName có phải là email không
            if (userData.fullName && userData.fullName.includes('@') && userData.fullName === userData.email) {
                console.warn('authService.getCurrentUser - fullName is same as email, this might be a backend issue');
                // Nếu fullName giống email, có thể backend đã lưu sai
                // Chúng ta sẽ để fullName trống để hiển thị "Người dùng"
                userData.fullName = '';
            }
            
            // Đảm bảo roleName được set đúng
            if (!userData.roleName) {
                const token = localStorage.getItem('token');
                userData = ensureUserHasRoleName(userData, token);
            }
            
            // Lưu thông tin user vào localStorage
            console.log('authService.getCurrentUser - Storing user data in localStorage:', userData);
            safeSetToStorage('user', userData);
            
            return userData;
            
        } catch (error) {
            console.error('authService.getCurrentUser - Error:', error);
            console.error('authService.getCurrentUser - Error response:', error.response);
            console.error('authService.getCurrentUser - Error status:', error.response?.status);
            logApiError(error, 'getCurrentUser');
            
            // Nếu lỗi 401 hoặc 403, clear auth data và redirect
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.warn('authService.getCurrentUser - Unauthorized/Forbidden, clearing auth data');
                console.warn('authService.getCurrentUser - This might be because user role changed to HOST');
                handleApiError(error, { clearAuthOn401: true });
                
                // Thay vì redirect ngay, hãy thông báo cho user biết cần đăng nhập lại
                // vì role đã thay đổi
                const currentUser = localStorage.getItem('user');
                if (currentUser) {
                    try {
                        const user = JSON.parse(currentUser);
                        if (user.roleName === 'USER') {
                            // Có thể user đã được approve thành host
                            console.log('authService.getCurrentUser - User role might have changed to HOST, need to login again');
                        }
                    } catch (e) {
                        console.error('authService.getCurrentUser - Error parsing current user:', e);
                    }
                }
                
                // Redirect to login với thông báo đặc biệt
                window.location.href = '/login?roleChanged=true';
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
                console.log('authService.login - Token to store:', token.substring(0, 20) + '...');
                localStorage.setItem('token', token);
                
                // Kiểm tra xem token có được lưu đúng không
                const storedToken = localStorage.getItem('token');
                console.log('authService.login - Stored token verification:', storedToken ? 'SUCCESS' : 'FAILED');
                console.log('authService.login - Stored token value:', storedToken ? storedToken.substring(0, 20) + '...' : 'null');
            } else {
                throw new Error('Không nhận được token từ server');
            }

            // Nếu không có user data trong response, thử gọi API để lấy
            if (!user) {
                console.log('authService.login - No user data in response, trying to fetch user profile...');
                try {
                    user = await authService.getCurrentUser();
                    console.log('authService.login - Successfully fetched user data:', user);
                } catch (profileError) {
                    console.error('authService.login - Error fetching user profile:', profileError);
                    // Tạo user data cơ bản từ email để tránh lỗi
                    user = {
                        id: null,
                        email: email,
                        fullName: '',
                        username: email.split('@')[0],
                        roleName: 'USER'
                    };
                    console.log('authService.login - Created fallback user data:', user);
                }
            } else {
                console.log('authService.login - User data already in response, using it directly');
            }

            // Kiểm tra xem user data có id không
            if (!user) {
                console.error('authService.login - No user data available');
                throw new Error('Không thể lấy thông tin user. Vui lòng thử lại.');
            }

            // Nếu user không có id, tạo id tạm thời
            if (!user.id) {
                console.warn('authService.login - User data missing ID, creating temporary ID');
                user.id = Date.now(); // ID tạm thời
            }

            // Kiểm tra xem fullName có phải là email không
            if (user && user.fullName && user.fullName.includes('@') && user.fullName === user.email) {
                console.warn('authService.login - fullName is same as email, this might be a backend issue');
                // Nếu fullName giống email, có thể backend đã lưu sai
                // Chúng ta sẽ để fullName trống để hiển thị "Người dùng"
                user.fullName = '';
            }
            
            // Đảm bảo roleName được set đúng
            if (!user.roleName) {
                user = ensureUserHasRoleName(user, token);
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
            console.log('authService.register - Starting registration for:', userData.email);
            
            const response = await api.post('/auth/register', userData);
            console.log('authService.register - Response:', response.data);
            
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'Đăng ký thành công'
            };
        } catch (error) {
            console.error('authService.register - Error:', error);
            logApiError(error, 'register');
            throw error;
        }
    },

    // Google OAuth login (tạm thời loại bỏ)

    // Upload avatar - sử dụng fileUploadService
    uploadAvatar: async (file) => {
        try {
            const fileUploadService = (await import('./fileUploadApi')).default;
            return await fileUploadService.uploadAvatar(file);
        } catch (error) {
            console.error('authService.uploadAvatar - Error:', error);
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
                        // Kiểm tra ngày sinh không được vượt quá ngày hiện tại
                        const today = new Date();
                        today.setHours(23, 59, 59, 999); // Đặt thời gian cuối ngày hôm nay
                        
                        if (date > today) {
                            throw new Error('Ngày sinh không được vượt quá ngày hiện tại');
                        }
                        
                        birthDate = date.toISOString().split('T')[0];
                        console.log('authService.updateProfile - Parsed birthDate:', birthDate);
                    } else {
                        console.warn('authService.updateProfile - Invalid dateOfBirth:', userData.dateOfBirth);
                        throw new Error('Ngày sinh không hợp lệ');
                    }
                } catch (error) {
                    console.error('authService.updateProfile - Error parsing dateOfBirth:', error);
                    throw error;
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
            
            // Kiểm tra xem fullName có phải là email không
            if (updatedUser && updatedUser.fullName && updatedUser.fullName.includes('@') && updatedUser.fullName === updatedUser.email) {
                console.warn('authService.updateProfile - fullName is same as email, this might be a backend issue');
                // Nếu fullName giống email, có thể backend đã lưu sai
                // Chúng ta sẽ để fullName trống để hiển thị "Người dùng"
                updatedUser.fullName = '';
            }
            
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
            let userData = response.data.data || response.data;
            
            console.log('=== DEBUG GET PROFILE ===');
            console.log('authService.getProfile - Raw response data:', response.data);
            console.log('authService.getProfile - userData.fullName (tên hiển thị từ backend):', userData?.fullName);
            console.log('authService.getProfile - userData.email (email từ backend):', userData?.email);
            console.log('authService.getProfile - userData.username (username từ backend):', userData?.username);
            console.log('=== END DEBUG ===');
            
            // Kiểm tra xem fullName có phải là email không
            if (userData && userData.fullName && userData.fullName.includes('@') && userData.fullName === userData.email) {
                console.warn('authService.getProfile - fullName is same as email, this might be a backend issue');
                // Nếu fullName giống email, có thể backend đã lưu sai
                // Chúng ta sẽ để fullName trống để hiển thị "Người dùng"
                userData.fullName = '';
            }
            
            return userData;
        } catch (error) {
            logApiError(error, 'getProfile');
            throw error;
        }
    },

    // Đổi mật khẩu
    changePassword: async (userId, oldPassword, newPassword, confirmPassword) => {
        try {
            console.log('authService.changePassword - Starting password change for user:', userId);
            console.log('authService.changePassword - Request data:', {
                oldPassword: oldPassword ? '***' : 'empty',
                newPassword: newPassword ? '***' : 'empty',
                confirmPassword: confirmPassword ? '***' : 'empty'
            });

            const response = await api.put(`/users/${userId}/change-password`, {
                oldPassword,
                newPassword,
                confirmPassword
            });

            console.log('authService.changePassword - Response:', response);
            console.log('authService.changePassword - Response data:', response.data);

            // Xử lý response format từ backend: { code: "00", message: "...", data: ... }
            let result;
            if (response.data.data) {
                // Format: { code: "00", message: "...", data: ... }
                result = response.data;
            } else {
                // Fallback: Format: { message: "...", ... }
                result = response.data;
            }

            console.log('authService.changePassword - Processed result:', result);
            return result;
        } catch (error) {
            console.error('authService.changePassword - Error:', error);
            console.error('authService.changePassword - Error response:', error.response);
            logApiError(error, 'changePassword');
            throw error;
        }
    },

    // Quên mật khẩu - Gửi request để nhận token reset password
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

    // Check email exists
    checkEmailExists: async (email) => {
        try {
            const response = await api.get('/users/check-email', {
                params: { email }
            });
            return response.data;
        } catch (error) {
            logApiError(error, 'checkEmailExists');
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

    // Verify OTP
    verifyOtp: async (otp) => {
        try {
            const response = await api.post('/users/password-reset/verify', null, {
                params: { otp }
            });
            return response.data;
        } catch (error) {
            logApiError(error, 'verifyOtp');
            throw error;
        }
    },

    // Reset mật khẩu - Sử dụng endpoint có sẵn từ backend
    resetPassword: async (otp, newPassword) => {
        try {
            const response = await api.post('/users/password-reset/confirm', null, {
                params: { otp, newPassword }
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
        // Thông báo đăng xuất thành công sẽ được hiển thị từ component gọi logout
    }
};

export default authService;