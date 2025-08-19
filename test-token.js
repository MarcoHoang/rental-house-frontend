// Test script để decode JWT token
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Lấy token từ localStorage
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);

if (token) {
  console.log('Token (first 50 chars):', token.substring(0, 50) + '...');
  
  const decoded = decodeJWT(token);
  console.log('Decoded token:', decoded);
  
  if (decoded) {
    console.log('User ID from token:', decoded.id);
    console.log('Email from token:', decoded.email);
    console.log('Role from token:', decoded.role);
    console.log('Expiration:', new Date(decoded.exp * 1000));
  }
} else {
  console.log('No token found in localStorage');
}

