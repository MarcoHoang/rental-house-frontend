// Test API connection
import { publicApiClient } from '../api/apiClient';

export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test 1: Basic connection
    const response = await publicApiClient.get('/houses');
    console.log('API Response:', response);
    console.log('API Status:', response.status);
    console.log('API Data:', response.data);
    
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    console.error('API Test Error:', error);
    console.error('Error Response:', error.response);
    console.error('Error Message:', error.message);
    
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

export const testBackendHealth = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/houses');
    console.log('Backend Health Check:', response);
    return response.ok;
  } catch (error) {
    console.error('Backend Health Check Error:', error);
    return false;
  }
};
