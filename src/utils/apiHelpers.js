// Utility functions để xử lý API response theo cấu trúc backend
import { API_RESPONSE_STRUCTURE, HOUSE_DTO_FIELDS } from './constants';

/**
 * Extract data từ API response theo cấu trúc backend
 * @param {Object} response - Response từ API
 * @returns {*} - Data được extract
 */
export const extractApiData = (response) => {
  if (!response) return null;
  
  // Nếu response có cấu trúc ApiResponse của backend
  if (response.data && typeof response.data === 'object') {
    return response.data.data || response.data;
  }
  
  // Nếu response trực tiếp là data
  return response;
};

/**
 * Extract danh sách houses từ API response
 * @param {Object} response - Response từ API
 * @returns {Array} - Array of houses
 */
export const extractHousesFromResponse = (response) => {
  const data = extractApiData(response);
  
  if (Array.isArray(data)) {
    return data;
  }
  
  if (data && data.content && Array.isArray(data.content)) {
    return data.content;
  }
  
  return [];
};

/**
 * Extract single house từ API response
 * @param {Object} response - Response từ API
 * @returns {Object|null} - House object hoặc null
 */
export const extractHouseFromResponse = (response) => {
  const data = extractApiData(response);
  return data || null;
};

/**
 * Validate house object theo DTO structure
 * @param {Object} house - House object
 * @returns {boolean} - True nếu valid
 */
export const validateHouseObject = (house) => {
  if (!house || typeof house !== 'object') return false;
  
  const requiredFields = [
    HOUSE_DTO_FIELDS.ID,
    HOUSE_DTO_FIELDS.TITLE,
    HOUSE_DTO_FIELDS.ADDRESS,
    HOUSE_DTO_FIELDS.PRICE,
    HOUSE_DTO_FIELDS.STATUS,
    HOUSE_DTO_FIELDS.HOUSE_TYPE
  ];
  
  return requiredFields.every(field => house.hasOwnProperty(field));
};

/**
 * Format house data để hiển thị
 * @param {Object} house - House object từ API
 * @returns {Object} - Formatted house object
 */
export const formatHouseForDisplay = (house) => {
  if (!house) return null;
  
  return {
    id: house.id,
    hostId: house.hostId,
    hostName: house.hostName,
    hostPhone: house.hostPhone,
    title: house.title || '',
    description: house.description || '',
    address: house.address || '',
    price: parseFloat(house.price) || 0,
    area: parseFloat(house.area) || 0,
    latitude: parseFloat(house.latitude) || 0,
    longitude: parseFloat(house.longitude) || 0,
    status: house.status || 'INACTIVE',
    houseType: house.houseType || 'APARTMENT',
    imageUrls: Array.isArray(house.imageUrls) ? house.imageUrls : [],
    createdAt: house.createdAt,
    updatedAt: house.updatedAt
  };
};

/**
 * Format house data để gửi lên API
 * @param {Object} houseData - House data từ form
 * @returns {Object} - Formatted house data cho API
 */
export const formatHouseForApi = (houseData) => {
  return {
    title: houseData.title?.trim(),
    description: houseData.description?.trim(),
    address: houseData.address?.trim(),
    price: parseFloat(houseData.price) || 0,
    area: parseFloat(houseData.area) || 0,
    latitude: parseFloat(houseData.latitude) || 0,
    longitude: parseFloat(houseData.longitude) || 0,
    status: houseData.status || 'AVAILABLE',
    houseType: houseData.houseType || 'APARTMENT',
    imageUrls: Array.isArray(houseData.imageUrls) ? houseData.imageUrls : []
  };
};

/**
 * Check if API response is successful
 * @param {Object} response - API response
 * @returns {boolean} - True nếu successful
 */
export const isApiResponseSuccess = (response) => {
  if (!response) return false;
  
  // Check theo cấu trúc ApiResponse của backend
  if (response.data && response.data.success !== undefined) {
    return response.data.success === true;
  }
  
  // Check HTTP status
  return response.status >= 200 && response.status < 300;
};

/**
 * Get error message từ API response
 * @param {Object} error - Error object
 * @returns {string} - Error message
 */
export const getApiErrorMessage = (error) => {
  if (!error) return 'Có lỗi xảy ra';
  
  // Nếu có response từ server
  if (error.response?.data) {
    const serverError = error.response.data;
    
    // Check theo cấu trúc ApiResponse
    if (serverError.message) {
      return serverError.message;
    }
    
    // Check validation errors
    if (serverError.errors) {
      return Object.values(serverError.errors).flat().join(', ');
    }
  }
  
  // Nếu có message từ client
  if (error.message) {
    return error.message;
  }
  
  return 'Có lỗi xảy ra khi kết nối với server';
};
