// src/utils/avatarHelper.js

/**
 * Xử lý URL avatar từ backend
 * Backend trả về fileUrl dạng: "avatar/filename.jpg"
 * Cần chuyển thành: "http://localhost:8080/api/files/avatar/filename.jpg"
 */

const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:8080/api' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api';

/**
 * Chuyển đổi fileUrl từ backend thành URL đầy đủ để hiển thị
 * @param {string} fileUrl - URL từ backend (ví dụ: "avatar/filename.jpg" hoặc "http://localhost:8080/api/files/avatar/filename.jpg")
 * @returns {string} URL đầy đủ để hiển thị
 */
export const getAvatarUrl = (fileUrl) => {
  if (!fileUrl) {
    return null; // Trả về null để component Avatar tự xử lý với chữ cái đầu
  }

  // Nếu là blob URL (preview từ file được chọn), trả về nguyên
  if (fileUrl.startsWith('blob:')) {
    return fileUrl;
  }

  // Nếu đã là URL đầy đủ (bắt đầu bằng http), trả về nguyên
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl;
  }

  // Nếu là default avatar, trả về null để component Avatar tự xử lý
  if (fileUrl === '/default-avatar.png' || fileUrl === 'default-avatar.png' || fileUrl === '/images/default-avatar.png') {
    return null;
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
 * Load ảnh với authentication token
 * @param {string} imageUrl - URL của ảnh cần load
 * @returns {Promise<string|null>} Blob URL hoặc null nếu lỗi
 */
export const loadAuthenticatedImage = async (imageUrl) => {
  try {
    // Không load authenticated image cho placeholder
    if (imageUrl.includes('via.placeholder.com') || imageUrl.includes('placeholder.com')) {
      return null;
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
          return null;
        } else if (response.status === 404) {
          return null;
        }
      } catch (authError) {
        // Continue to try without authentication
      }
    }

    // Nếu không có token hoặc authentication thất bại, thử load không có authentication
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } else if (response.status === 403) {
        return null;
      }
    } catch (publicError) {
      // Continue to return null
    }

    return null;
  } catch (error) {
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
  if (url.includes('via.placeholder.com') || url.includes('placeholder.com')) {
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
