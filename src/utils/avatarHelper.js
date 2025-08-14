// src/utils/avatarHelper.js

/**
 * Xử lý URL avatar từ backend
 * Backend trả về fileUrl dạng: "avatar/filename.jpg"
 * Cần chuyển thành: "http://localhost:8080/api/files/avatar/filename.jpg"
 */

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Chuyển đổi fileUrl từ backend thành URL đầy đủ để hiển thị
 * @param {string} fileUrl - URL từ backend (ví dụ: "avatar/filename.jpg")
 * @returns {string} URL đầy đủ để hiển thị
 */
export const getAvatarUrl = (fileUrl) => {
  if (!fileUrl) {
    return '/default-avatar.png';
  }

  // Nếu đã là URL đầy đủ (bắt đầu bằng http), trả về nguyên
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl;
  }

  // Nếu là default avatar, trả về placeholder
  if (fileUrl === '/default-avatar.png' || fileUrl === 'default-avatar.png') {
    return '/default-avatar.png';
  }

  // Nếu là URL tương đối từ backend (ví dụ: "avatar/filename.jpg")
  // Chuyển thành URL đầy đủ
  if (fileUrl.includes('/') && !fileUrl.startsWith('http')) {
    return `${API_BASE_URL}/files/${fileUrl}`;
  }

  // Nếu chỉ là filename (ví dụ: "filename.jpg"), thêm prefix avatar
  return `${API_BASE_URL}/files/avatar/${fileUrl}`;
};

/**
 * Debug function để test các phương pháp load ảnh khác nhau
 * @param {string} imageUrl - URL của ảnh cần test
 */
export const debugImageLoading = async (imageUrl) => {
  console.log('=== DEBUG IMAGE LOADING ===');
  console.log('Testing URL:', imageUrl);
  
  const token = localStorage.getItem('token');
  console.log('Token exists:', !!token);
  
  // Test 1: Load với authentication
  if (token) {
    try {
      console.log('Test 1: Loading with authentication...');
      const response = await fetch(imageUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Test 1 - Status:', response.status);
      console.log('Test 1 - Headers:', response.headers);
      if (response.ok) {
        console.log('✅ Test 1 SUCCESS');
      } else {
        console.log('❌ Test 1 FAILED');
      }
    } catch (error) {
      console.log('❌ Test 1 ERROR:', error.message);
    }
  }
  
  // Test 2: Load không có authentication
  try {
    console.log('Test 2: Loading without authentication...');
    const response = await fetch(imageUrl);
    console.log('Test 2 - Status:', response.status);
    console.log('Test 2 - Headers:', response.headers);
    if (response.ok) {
      console.log('✅ Test 2 SUCCESS');
    } else {
      console.log('❌ Test 2 FAILED');
    }
  } catch (error) {
    console.log('❌ Test 2 ERROR:', error.message);
  }
  
  // Test 3: Kiểm tra CORS preflight
  try {
    console.log('Test 3: Testing CORS preflight...');
    const response = await fetch(imageUrl, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin
      }
    });
    console.log('Test 3 - Status:', response.status);
    console.log('Test 3 - CORS Headers:', {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
    });
  } catch (error) {
    console.log('❌ Test 3 ERROR:', error.message);
  }
  
  console.log('=== END DEBUG ===');
};

/**
 * Load ảnh với authentication token
 * @param {string} imageUrl - URL của ảnh cần load
 * @returns {Promise<string|null>} Blob URL hoặc null nếu lỗi
 */
export const loadAuthenticatedImage = async (imageUrl) => {
  try {
    // Không load authenticated image cho placeholder
    if (imageUrl.includes('via.placeholder.com') || imageUrl === '/default-avatar.png') {
      return imageUrl;
    }

    // Kiểm tra token validity trước
    const token = localStorage.getItem('token');
    const isTokenValid = token && (() => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp > currentTime;
      } catch (error) {
        return false;
      }
    })();
    
    // Thử load với authentication trước
    if (isTokenValid) {
      try {
        const response = await fetch(imageUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        } else if (response.status === 403) {
          console.warn('Access forbidden (403) for image:', imageUrl);
          return null;
        } else if (response.status === 404) {
          console.warn('Image not found (404):', imageUrl);
          return null;
        }
      } catch (authError) {
        console.warn('Failed to load with authentication:', authError);
      }
    } else {
      console.warn('Token is invalid or expired, skipping authenticated load');
    }

    // Nếu không có token hoặc authentication thất bại, thử load không có authentication
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } else if (response.status === 403) {
        console.warn('Access forbidden (403) for image without auth:', imageUrl);
        return null;
      }
    } catch (publicError) {
      console.warn('Failed to load without authentication:', publicError);
    }

    console.error(`Failed to load image: ${imageUrl}`);
    return null;
  } catch (error) {
    console.error('Error loading authenticated image:', error);
    return null;
  }
};

/**
 * Kiểm tra xem URL có cần authentication không
 * @param {string} url - URL cần kiểm tra
 * @returns {boolean}
 */
export const requiresAuthentication = (url) => {
  // Không cần authentication cho placeholder
  if (url.includes('via.placeholder.com')) {
    return false;
  }

  // Cần authentication cho backend URLs
  if (url.includes('localhost:8080') || url.includes('/api/files/')) {
    return true;
  }

  return false;
};

/**
 * Kiểm tra xem URL có phải là avatar URL từ backend không
 * @param {string} url - URL cần kiểm tra
 * @returns {boolean}
 */
export const isBackendAvatarUrl = (url) => {
  return url && (url.includes('/api/files/avatar/') || url.startsWith('avatar/'));
};

/**
 * Lấy filename từ avatar URL
 * @param {string} url - Avatar URL
 * @returns {string} filename
 */
export const getAvatarFilename = (url) => {
  if (!url) return null;
  
  // Nếu là URL đầy đủ, lấy phần cuối
  if (url.includes('/api/files/avatar/')) {
    return url.split('/api/files/avatar/')[1];
  }
  
  // Nếu là URL tương đối
  if (url.startsWith('avatar/')) {
    return url.split('avatar/')[1];
  }
  
  return url;
};

/**
 * Kiểm tra token có hợp lệ không
 * @returns {boolean}
 */
export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Decode JWT token để kiểm tra expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return false;
  }
};

/**
 * Refresh token nếu cần
 * @returns {Promise<boolean>}
 */
export const refreshTokenIfNeeded = async () => {
  if (isTokenValid()) {
    return true;
  }
  
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return false;
    }
    
    const response = await fetch('http://localhost:8080/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      return true;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
  
  return false;
};
