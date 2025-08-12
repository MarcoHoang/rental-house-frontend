import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';
import { AUTH_CONFIG } from '../config/auth';
import { 
  getUserFromStorage, 
  safeSetToStorage, 
  clearAuthData as clearAuthDataUtil 
} from '../utils/localStorage';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Kiểm tra user từ localStorage khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = getUserFromStorage();
        
        console.log('useAuth.checkAuth - Token exists:', !!token);
        console.log('useAuth.checkAuth - User data from storage:', userData);
        
        if (token) {
          if (userData && userData.id) {
            // Có token và user data hợp lệ
            console.log('useAuth.checkAuth - Setting user state with valid data:', userData);
            setUser(userData);
          } else {
            // Có token nhưng không có user data hoặc thiếu ID - thử gọi API
            console.log('useAuth.checkAuth - Token exists but no valid user data, trying to fetch from API...');
            try {
              const freshUserData = await authService.getCurrentUser();
              if (freshUserData && freshUserData.id) {
                console.log('useAuth.checkAuth - Successfully fetched user data from API:', freshUserData);
                setUser(freshUserData);
              } else {
                console.error('useAuth.checkAuth - API returned invalid user data, clearing auth');
                clearAuthData();
              }
            } catch (apiError) {
              console.error('useAuth.checkAuth - Error fetching user from API:', apiError);
              clearAuthData();
            }
          }
        } else {
          console.log('useAuth.checkAuth - No token found');
        }
      } catch (err) {
        console.error('useAuth.checkAuth - Error checking auth:', err);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const clearAuthData = useCallback(() => {
    clearAuthDataUtil();
    setUser(null);
    setError(null);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    console.log('useAuth.login - Starting login process for:', email);
    
    try {
      const response = await authService.login(email, password);
      console.log('useAuth.login - Response from authService:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Đăng nhập thất bại');
      }

      // Lấy user data từ response
      const { token, user: userData } = response.data;
      console.log('useAuth.login - Extracted token and user:', { token: !!token, userData });

      if (token && userData) {
        // Cập nhật state
        console.log('useAuth.login - Setting user state:', userData);
        setUser(userData);
        
        // Redirect based on role
        console.log('useAuth.login - User role:', userData.roleName);
        if (userData.roleName === 'HOST') {
          console.log('useAuth.login - Redirecting to /host');
          navigate("/host");
        } else if (userData.roleName === 'ADMIN') {
          console.log('useAuth.login - Redirecting to /admin');
          navigate("/admin");
        } else {
          console.log('useAuth.login - Redirecting to /');
          navigate("/");
        }
      } else {
        throw new Error('Không nhận được thông tin đăng nhập từ server');
      }

      return { success: true };
    } catch (err) {
      console.error('useAuth.login - Error:', err);
      
      // Specific error handling
      let errorMessage = 'Đăng nhập thất bại';
      
      if (err.response?.status === 401) {
        errorMessage = 'Email hoặc mật khẩu không đúng';
      } else if (err.response?.status === 403) {
        errorMessage = 'Tài khoản đã bị khóa';
      } else if (err.response?.status === 404) {
        errorMessage = 'Tài khoản không tồn tại';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        clearAuthData();
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [navigate, clearAuthData]);

  // Đăng nhập với vai trò host
  const loginAsHost = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    console.log('useAuth.loginAsHost - Starting host login process for:', email);
    
    try {
      const response = await authService.loginAsHost(email, password);
      console.log('useAuth.loginAsHost - Response from authService:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Đăng nhập host thất bại');
      }

      // Lấy host data từ response
      const { token, user: hostData } = response.data;
      console.log('useAuth.loginAsHost - Extracted token and host:', { token: !!token, hostData });

      if (token && hostData) {
        // Cập nhật state
        console.log('useAuth.loginAsHost - Setting user state:', hostData);
        setUser(hostData);
        
        // Redirect to host dashboard
        console.log('useAuth.loginAsHost - Redirecting to /host');
        navigate("/host");
      } else {
        throw new Error('Không nhận được thông tin đăng nhập host từ server');
      }

      return { success: true };
    } catch (err) {
      console.error('useAuth.loginAsHost - Error:', err);
      
      // Specific error handling for host login
      let errorMessage = 'Đăng nhập host thất bại';
      
      if (err.response?.status === 401) {
        errorMessage = 'Email hoặc mật khẩu không đúng';
      } else if (err.response?.status === 403) {
        errorMessage = 'Tài khoản host đã bị khóa hoặc chưa được phê duyệt';
      } else if (err.response?.status === 404) {
        errorMessage = 'Tài khoản host không tồn tại';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        clearAuthData();
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [navigate, clearAuthData]);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      setError(null);
      return { success: true, data: response };
    } catch (err) {
      console.error('useAuth.register - Error:', err);
      
      // Specific error handling for registration
      let errorMessage = 'Đăng ký thất bại';
      
      if (err.response?.status === 409) {
        if (err.response?.data?.message?.includes('email')) {
          errorMessage = 'Email đã được sử dụng';
        } else if (err.response?.data?.message?.includes('phone')) {
          errorMessage = 'Số điện thoại đã được sử dụng';
        } else {
          errorMessage = 'Thông tin đã tồn tại trong hệ thống';
        }
      } else if (err.response?.status === 400) {
        errorMessage = 'Thông tin không hợp lệ';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthData();
    navigate('/login');
  }, [clearAuthData, navigate]);

  const updateProfile = useCallback(async (userId, profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('useAuth.updateProfile - Starting update for user:', userId);
      console.log('useAuth.updateProfile - Profile data:', profileData);
      
      const response = await authService.updateProfile(userId, profileData);
      console.log('useAuth.updateProfile - Response from authService:', response);
      
      if (response && response.success) {
        // Cập nhật user state với user data mới
        if (response.data) {
          console.log('useAuth.updateProfile - Updating user state with:', response.data);
          setUser(response.data);
        }
        return { success: true, data: response.data, message: response.message };
      } else {
        throw new Error(response?.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error('useAuth.updateProfile - Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Cập nhật thất bại';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = !!user;
  const isHost = user?.roleName === 'HOST';
  const isAdmin = user?.roleName === 'ADMIN';
  const isUser = user?.roleName === 'USER';

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isHost,
    isAdmin,
    isUser,
    login,
    loginAsHost,
    register,
    logout,
    updateProfile,
    clearAuthData
  };
};
