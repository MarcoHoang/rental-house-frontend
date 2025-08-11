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
