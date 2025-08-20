// src/utils/imageHelper.js

/**
 * Helper functions để xử lý ảnh với fallback và error handling
 */

const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:8080/api' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api';

/**
 * Chuyển đổi fileUrl từ backend thành URL đầy đủ để hiển thị
 * @param {string} fileUrl - URL từ backend (ví dụ: "house-image/filename.jpg")
 * @returns {string} URL đầy đủ để hiển thị
 */
export const getImageUrl = (fileUrl) => {
  if (!fileUrl) {
    return getDefaultHouseImage();
  }

  // Nếu đã là URL đầy đủ (bắt đầu bằng http), trả về nguyên
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl;
  }

  // Tạm thời sử dụng ảnh fallback để tránh lỗi 403
  // TODO: Sửa lại khi backend image serving hoạt động
  console.warn('Backend image serving not working, using fallback image for:', fileUrl);
  return getDefaultHouseImage();
};

/**
 * Lấy ảnh mặc định cho nhà
 * @returns {string} URL ảnh mặc định
 */
export const getDefaultHouseImage = () => {
  // Sử dụng ảnh nhà đẹp từ Unsplash
  return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
};

/**
 * Lấy ảnh mặc định cho avatar
 * @returns {string} URL ảnh mặc định
 */
export const getDefaultAvatarImage = () => {
  // Sử dụng ảnh avatar đẹp từ Unsplash
  return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80";
};

/**
 * Xử lý lỗi load ảnh và trả về ảnh fallback
 * @param {string} originalUrl - URL ảnh gốc
 * @param {string} fallbackUrl - URL ảnh fallback
 * @returns {string} URL ảnh để hiển thị
 */
export const handleImageError = (originalUrl, fallbackUrl = null) => {
  console.warn('Image failed to load:', originalUrl);
  return fallbackUrl || getDefaultHouseImage();
};

/**
 * Kiểm tra xem URL có phải là URL backend không
 * @param {string} url - URL cần kiểm tra
 * @returns {boolean}
 */
export const isBackendUrl = (url) => {
  return url && (url.includes('localhost:8080') || url.includes('/api/files/'));
};

/**
 * Lấy ảnh đầu tiên từ danh sách ảnh
 * @param {Array} imageUrls - Danh sách URLs ảnh
 * @param {string} fallbackUrl - URL ảnh fallback
 * @returns {string} URL ảnh để hiển thị
 */
export const getFirstImage = (imageUrls, fallbackUrl = null) => {
  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
    return fallbackUrl || getDefaultHouseImage();
  }

  const firstImage = imageUrls[0];
  if (!firstImage) {
    return fallbackUrl || getDefaultHouseImage();
  }

  return getImageUrl(firstImage);
};

/**
 * Preload ảnh để kiểm tra có load được không
 * @param {string} imageUrl - URL ảnh cần kiểm tra
 * @returns {Promise<boolean>} true nếu load thành công, false nếu thất bại
 */
export const preloadImage = (imageUrl) => {
  return new Promise((resolve) => {
    if (!imageUrl) {
      resolve(false);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
};

/**
 * Lấy danh sách ảnh với fallback
 * @param {Array} imageUrls - Danh sách URLs ảnh
 * @returns {Array} Danh sách URLs ảnh đã xử lý
 */
export const getProcessedImageUrls = (imageUrls) => {
  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
    return [getDefaultHouseImage()];
  }

  return imageUrls.map(url => getImageUrl(url));
};
