// Utility functions for safe localStorage operations

/**
 * Safely get and parse JSON data from localStorage
 * @param {string} key - The localStorage key
 * @param {any} defaultValue - Default value if key doesn't exist or parsing fails
 * @returns {any} Parsed data or default value
 */
export const safeGetFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    console.log(`safeGetFromStorage - Key: "${key}", Raw value:`, item);
    
    // localStorage.getItem() returns null if key doesn't exist, never undefined
    if (item === null || item === 'undefined' || item === 'null') {
      console.log(`safeGetFromStorage - Returning default value for "${key}":`, defaultValue);
      return defaultValue;
    }
    
    const parsed = JSON.parse(item);
    console.log(`safeGetFromStorage - Parsed value for "${key}":`, parsed);
    return parsed;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    // Clear invalid data
    localStorage.removeItem(key);
    return defaultValue;
  }
};

/**
 * Safely set JSON data to localStorage
 * @param {string} key - The localStorage key
 * @param {any} value - The value to store
 */
export const safeSetToStorage = (key, value) => {
  try {
    console.log(`safeSetToStorage - Setting key: "${key}", value:`, value);
    
    // Don't store null or undefined values
    if (value === null || value === undefined) {
      console.log(`safeSetToStorage - Removing key "${key}" (null/undefined value)`);
      localStorage.removeItem(key);
      return;
    }
    
    const jsonString = JSON.stringify(value);
    console.log(`safeSetToStorage - JSON string for "${key}":`, jsonString);
    localStorage.setItem(key, jsonString);
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

/**
 * Safely remove data from localStorage
 * @param {string} key - The localStorage key
 */
export const safeRemoveFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = () => {
  const authKeys = ['token', 'user', 'adminToken', 'adminUser'];
  authKeys.forEach(key => safeRemoveFromStorage(key));
};

/**
 * Get user data from localStorage safely
 * @returns {object|null} User data or null
 */
export const getUserFromStorage = () => {
  return safeGetFromStorage('user', null);
};

/**
 * Get admin user data from localStorage safely
 * @returns {object|null} Admin user data or null
 */
export const getAdminUserFromStorage = () => {
  return safeGetFromStorage('adminUser', null);
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isUserAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = getUserFromStorage();
  return !!(token && user);
};

/**
 * Check if admin is authenticated
 * @returns {boolean} True if admin is authenticated
 */
export const isAdminAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  const adminUser = getAdminUserFromStorage();
  return !!(token && adminUser && adminUser.role === 'ADMIN');
};
