import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';
import { AUTH_CONFIG } from '../config/auth';
import { 
  getUserFromStorage,
  safeSetToStorage, 
  clearAuthData as clearAuthDataUtil 
} from '../utils/localStorage';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
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
        
        console.log('=== AUTH PROVIDER DEBUG ===');
        console.log('AuthProvider.checkAuth - Token exists:', !!token);
        console.log('AuthProvider.checkAuth - Token value:', token ? token.substring(0, 20) + '...' : 'null');
        console.log('AuthProvider.checkAuth - User data from storage:', userData);
        console.log('AuthProvider.checkAuth - User data ID:', userData?.id);
        console.log('AuthProvider.checkAuth - User data role:', userData?.roleName);
        console.log('AuthProvider.checkAuth - User data valid:', !!(userData && userData.id));
        console.log('=====================================');
        
        if (token) {
          if (userData && userData.id) {
            // Có token và user data hợp lệ
            console.log('AuthProvider.checkAuth - Setting user state with valid data:', userData);
            setUser(userData);
            console.log('AuthProvider.checkAuth - User state set successfully');
          } else {
            // Có token nhưng không có user data hoặc thiếu ID - thử gọi API
            console.log('AuthProvider.checkAuth - Token exists but no valid user data, trying to fetch from API...');
            try {
              const freshUserData = await authService.getCurrentUser();
              if (freshUserData && freshUserData.id) {
                console.log('AuthProvider.checkAuth - Successfully fetched user data from API:', freshUserData);
                setUser(freshUserData);
              } else {
                console.error('AuthProvider.checkAuth - API returned invalid user data, clearing auth');
                clearAuthData();
              }
            } catch (apiError) {
              console.error('AuthProvider.checkAuth - Error fetching user from API:', apiError);
              clearAuthData();
            }
          }
        } else {
          console.log('AuthProvider.checkAuth - No token found');
        }
      } catch (err) {
        console.error('AuthProvider.checkAuth - Error checking auth:', err);
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
    
    console.log('AuthProvider.login - Starting login process for:', email);
    
    try {
      const response = await authService.login(email, password);
      console.log('AuthProvider.login - Response from authService:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Đăng nhập thất bại');
      }

      // Lấy user data từ response
      const { token, user: userData } = response.data;
      console.log('AuthProvider.login - Extracted token and user:', { token: !!token, userData });

      if (token && userData) {
        // Lưu token và user data vào localStorage
        safeSetToStorage('token', token);
        safeSetToStorage('user', userData);
        
        // Cập nhật state
        console.log('AuthProvider.login - Setting user state:', userData);
        setUser(userData);
        
        // Redirect based on role
        console.log('AuthProvider.login - User role:', userData.roleName);
        if (userData.roleName === 'HOST') {
          console.log('AuthProvider.login - Redirecting to /host');
          navigate("/host");
        } else if (userData.roleName === 'ADMIN') {
          console.log('AuthProvider.login - Redirecting to /admin');
          navigate("/admin");
        } else {
          console.log('AuthProvider.login - Redirecting to /');
          navigate("/");
        }
      } else {
        throw new Error('Không nhận được thông tin đăng nhập từ server');
      }

      return { success: true };
    } catch (err) {
      console.error('AuthProvider.login - Error:', err);
      
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

  const loginAsHost = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    console.log('AuthProvider.loginAsHost - Starting host login process for:', email);
    
    try {
      const response = await authService.loginAsHost(email, password);
      console.log('AuthProvider.loginAsHost - Response from authService:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Đăng nhập host thất bại');
      }

      // Lấy host data từ response
      const { token, user: hostData } = response.data;
      console.log('AuthProvider.loginAsHost - Extracted token and host:', { token: !!token, hostData });

      if (token && hostData) {
        // Lưu token và host data vào localStorage
        safeSetToStorage('token', token);
        safeSetToStorage('user', hostData);
        
        // Cập nhật state
        console.log('AuthProvider.loginAsHost - Setting user state:', hostData);
        setUser(hostData);
        
        // Redirect to host dashboard
        console.log('AuthProvider.loginAsHost - Redirecting to /host');
        navigate("/host");
      } else {
        throw new Error('Không nhận được thông tin đăng nhập host từ server');
      }

      return { success: true };
    } catch (err) {
      console.error('AuthProvider.loginAsHost - Error:', err);
      
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
      console.error('AuthProvider.register - Error:', err);
      
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
      console.log('AuthProvider.updateProfile - Starting update for user:', userId);
      console.log('AuthProvider.updateProfile - Profile data:', profileData);
      
      const response = await authService.updateProfile(userId, profileData);
      console.log('AuthProvider.updateProfile - Response from authService:', response);
      
      if (response && response.success) {
        // Cập nhật user state với user data mới
        if (response.data) {
          console.log('AuthProvider.updateProfile - Updating user state with:', response.data);
          setUser(response.data);
        }
        return { success: true, data: response.data, message: response.message };
      } else {
        throw new Error(response?.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error('AuthProvider.updateProfile - Error:', err);
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

  // Debug user state
  console.log('=== AUTH PROVIDER STATE ===');
  console.log('Current user state:', user);
  console.log('isAuthenticated:', isAuthenticated);
  console.log('isHost:', isHost);
  console.log('isAdmin:', isAdmin);
  console.log('isUser:', isUser);
  console.log('==========================');

  const value = {
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 