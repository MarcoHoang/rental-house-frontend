// Utility functions for handling API errors

export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    // Handle specific error messages from backend
    if (data?.message) {
      return data.message;
    }
    
    // Handle validation errors
    if (data?.errors && Array.isArray(data.errors)) {
      return data.errors.map(err => err.message).join(', ');
    }
    
    // Handle common HTTP status codes
    switch (status) {
      case 400:
        return 'Yêu cầu không hợp lệ';
      case 401:
        return 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại';
      case 403:
        return 'Bạn không có quyền truy cập';
      case 404:
        return 'Không tìm thấy dữ liệu';
      case 409:
        return 'Dữ liệu đã tồn tại';
      case 422:
        return 'Dữ liệu không hợp lệ';
      case 500:
        return 'Lỗi máy chủ, vui lòng thử lại sau';
      default:
        return 'Đã xảy ra lỗi không xác định';
    }
  } else if (error.request) {
    // Network error
    return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại sau.';
  } else {
    // Other errors
    return error.message || 'Đã xảy ra lỗi không xác định';
  }
};

export const handleApiError = (error, options = {}) => {
  const {
    clearAuthOn401 = true,
    redirectOn401 = false,
    redirectPath = '/login'
  } = options;

  const errorMessage = getErrorMessage(error);
  
  // Handle 401 errors
  if (error.response?.status === 401) {
    if (clearAuthOn401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
    
    if (redirectOn401 && typeof window !== 'undefined') {
      window.location.href = redirectPath;
    }
  }
  
  return {
    message: errorMessage,
    status: error.response?.status,
    data: error.response?.data
  };
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const isAuthError = (error) => {
  return error.response?.status === 401;
};

export const isValidationError = (error) => {
  return error.response?.status === 422 || error.response?.status === 400;
};

// Debug helper (only in development)
export const logApiError = (error, context = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`API Error${context ? ` - ${context}` : ''}`);
    console.error('Error:', error);
    console.error('Response:', error.response);
    console.error('Request:', error.request);
    console.error('Message:', getErrorMessage(error));
    console.groupEnd();
  }
};
