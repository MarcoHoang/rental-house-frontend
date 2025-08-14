// src/utils/uploadTest.js

/**
 * Test upload avatar với các phương pháp khác nhau
 */

const API_BASE_URL = 'http://localhost:8080/api';

export const testAvatarUpload = async (file) => {
  console.log('=== TESTING AVATAR UPLOAD ===');
  console.log('File:', file);
  console.log('File name:', file.name);
  console.log('File size:', file.size);
  console.log('File type:', file.type);

  const token = localStorage.getItem('token');
  console.log('Token exists:', !!token);

  // Test 1: Sử dụng fetch với FormData
  try {
    console.log('\n--- Test 1: Fetch with FormData ---');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadType', 'avatar');

    const response = await fetch(`${API_BASE_URL}/files/upload/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: formData
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      console.log('✅ Test 1 SUCCESS');
      return data;
    } else {
      console.log('❌ Test 1 FAILED');
    }
  } catch (error) {
    console.log('❌ Test 1 ERROR:', error);
  }

  // Test 2: Sử dụng fetch với endpoint chung
  try {
    console.log('\n--- Test 2: Fetch with general endpoint ---');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadType', 'avatar');

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: formData
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      console.log('✅ Test 2 SUCCESS');
      return data;
    } else {
      console.log('❌ Test 2 FAILED');
    }
  } catch (error) {
    console.log('❌ Test 2 ERROR:', error);
  }

  // Test 3: Sử dụng axios trực tiếp
  try {
    console.log('\n--- Test 3: Axios direct ---');
    const axios = (await import('axios')).default;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadType', 'avatar');

    const response = await axios.post(`${API_BASE_URL}/files/upload/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    console.log('✅ Test 3 SUCCESS');
    return response.data;
  } catch (error) {
    console.log('❌ Test 3 ERROR:', error.response?.data || error.message);
  }

  console.log('\n=== ALL TESTS COMPLETED ===');
  return null;
};

// Test function để kiểm tra backend endpoints
export const testBackendEndpoints = async () => {
  const baseUrl = 'http://localhost:8080/api';
  
  console.log('=== TESTING BACKEND ENDPOINTS ===');
  
  // Test 1: Houses endpoint
  try {
    console.log('Test 1: Testing /api/houses endpoint...');
    const response = await fetch(`${baseUrl}/houses`);
    console.log('Houses endpoint status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('Houses endpoint data:', data);
    }
  } catch (error) {
    console.error('Houses endpoint error:', error);
  }
  
  // Test 2: Files endpoint
  try {
    console.log('Test 2: Testing /api/files endpoint...');
    const response = await fetch(`${baseUrl}/files`);
    console.log('Files endpoint status:', response.status);
    if (response.ok) {
      const data = await response.text();
      console.log('Files endpoint response:', data);
    }
  } catch (error) {
    console.error('Files endpoint error:', error);
  }
  
  // Test 3: Avatar endpoint
  try {
    console.log('Test 3: Testing avatar access...');
    const avatarUrl = `${baseUrl}/files/avatar/test.jpg`;
    const response = await fetch(avatarUrl);
    console.log('Avatar endpoint status:', response.status);
    console.log('Avatar endpoint headers:', response.headers);
  } catch (error) {
    console.error('Avatar endpoint error:', error);
  }
  
  console.log('=== END TESTING ===');
};

// Test function để kiểm tra authentication
export const testAuthentication = async () => {
  const token = localStorage.getItem('token');
  console.log('=== TESTING AUTHENTICATION ===');
  console.log('Token exists:', !!token);
  console.log('Token length:', token?.length);
  
  if (token) {
    try {
      const response = await fetch('http://localhost:8080/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Auth test status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Auth test data:', data);
      }
    } catch (error) {
      console.error('Auth test error:', error);
    }
  }
  
  console.log('=== END AUTHENTICATION TEST ===');
};
