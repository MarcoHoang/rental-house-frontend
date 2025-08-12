// src/api/houseApi.jsx
import axios from "axios";
import { mockHouses } from "./mockData";

// Toggle between mock data and real API
// In Vite, use import.meta.env.MODE or import.meta.env.DEV
const USE_MOCK_DATA = import.meta.env.DEV;  // true in development, false in production

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

// Create axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.status, error.response.data);
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized (e.g., redirect to login)
        console.error('Unauthorized access - please login again');
      } else if (error.response.status === 404) {
        console.error('Resource not found');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Get all houses with optional query parameters
 * @param {Object} params - Query parameters for filtering/sorting/pagination
 * @returns {Promise<Array>} List of houses
 */
export const getHouses = async (params = {}) => {
  if (USE_MOCK_DATA) {
    console.log("Using mock data for getHouses");
    return new Promise((resolve) => {
      setTimeout(() => {
        // Apply simple filtering for mock data
        let results = [...mockHouses];
        
        // Simple filtering by search query if provided
        if (params.search) {
          const searchLower = params.search.toLowerCase();
          results = results.filter(house => 
            house.name.toLowerCase().includes(searchLower) ||
            house.address.toLowerCase().includes(searchLower) ||
            house.description?.toLowerCase().includes(searchLower)
          );
        }
        
        resolve({ data: results });
      }, 500);
    });
  }

  try {
    const response = await apiClient.get("/houses", { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching houses:', error);
    throw error;
  }
};

/**
 * Search houses by query string
 * @param {string} query - Search query string
 * @returns {Promise<Array>} Filtered list of houses
 */
export const searchHouses = async (query) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query) {
          resolve({ data: mockHouses });
          return;
        }
        
        const queryLower = query.toLowerCase();
        const results = mockHouses.filter(
          (house) =>
            house.name.toLowerCase().includes(queryLower) ||
            house.address.toLowerCase().includes(queryLower) ||
            house.description?.toLowerCase().includes(queryLower) ||
            house.amenities?.some(a => a.toLowerCase().includes(queryLower))
        );
        resolve({ data: results });
      }, 300);
    });
  }

  try {
    const response = await apiClient.get(`/houses/search`, { 
      params: { q: query } 
    });
    return response.data;
  } catch (error) {
    console.error('Error searching houses:', error);
    throw error;
  }
};

/**
 * Get house details by ID
 * @param {string|number} id - House ID
 * @returns {Promise<Object>} House details
 */
export const getHouseById = async (id) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const house = mockHouses.find(h => h.id === id || h.id === Number(id));
        if (house) {
          resolve({ data: house });
        } else {
          const error = new Error('House not found');
          error.response = { status: 404 };
          reject(error);
        }
      }, 400);
    });
  }

  try {
    const response = await apiClient.get(`/houses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching house with ID ${id}:`, error);
    throw error;
  }
};

// Export the API client in case it's needed directly
export { apiClient };
