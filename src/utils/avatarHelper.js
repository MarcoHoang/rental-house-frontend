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
    return 'https://via.placeholder.com/150/cccccc/666666?text=User';
  }

  // Nếu đã là URL đầy đủ (bắt đầu bằng http), trả về nguyên
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl;
  }

  // Nếu là default avatar, trả về placeholder
  if (fileUrl === '/default-avatar.png' || fileUrl === 'default-avatar.png') {
    return 'https://via.placeholder.com/150/cccccc/666666?text=User';
  }

  // Nếu là URL tương đối từ backend (ví dụ: "avatar/filename.jpg")
  if (fileUrl.startsWith('avatar/')) {
    return `${API_BASE_URL}/files/${fileUrl}`;
  }

  // Nếu chỉ là filename, thêm prefix avatar/
  if (!fileUrl.includes('/')) {
    return `${API_BASE_URL}/files/avatar/${fileUrl}`;
  }

  // Trường hợp khác, trả về URL đầy đủ
  return `${API_BASE_URL}/files/${fileUrl}`;
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
    if (imageUrl.includes('via.placeholder.com')) {
      return imageUrl;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found for image loading');
      return null;
    }

    // Thử load với authentication trước
    try {
      const response = await fetch(imageUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    } catch (authError) {
      console.warn('Failed to load with authentication, trying without:', authError);
    }

    // Nếu authentication thất bại, thử load không có authentication (cho public images)
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
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

  return url && (
    url.includes('/api/files/') || 
    url.includes('localhost:8080') ||
    url.startsWith('avatar/')
  );
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
