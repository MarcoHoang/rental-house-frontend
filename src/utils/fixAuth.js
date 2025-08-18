// Utility để fix authentication issues

/**
 * Kiểm tra và sửa dữ liệu authentication trong localStorage
 */
export const fixAuthData = () => {
  console.log('=== FIXING AUTH DATA ===');
  
  // Kiểm tra token
  const token = localStorage.getItem('token');
  console.log('Token exists:', !!token);
  
  // Kiểm tra user data
  const rawUser = localStorage.getItem('user');
  console.log('Raw user data:', rawUser);
  
  try {
    if (rawUser) {
      const userData = JSON.parse(rawUser);
      console.log('Parsed user data:', userData);
      
      // Kiểm tra tính hợp lệ
      if (userData && typeof userData === 'object' && userData.id) {
        console.log('✅ User data is valid');
        return { success: true, user: userData };
      } else {
        console.log('❌ User data is invalid, clearing...');
        localStorage.removeItem('user');
        return { success: false, error: 'Invalid user data' };
      }
    } else {
      console.log('❌ No user data found');
      return { success: false, error: 'No user data' };
    }
  } catch (error) {
    console.log('❌ Error parsing user data:', error);
    localStorage.removeItem('user');
    return { success: false, error: 'Parse error' };
  }
};

/**
 * Force clear tất cả auth data
 */
export const forceClearAuth = () => {
  console.log('=== FORCE CLEARING AUTH DATA ===');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  console.log('✅ All auth data cleared');
};

/**
 * Kiểm tra và log tất cả localStorage
 */
export const debugLocalStorage = () => {
  console.log('=== LOCALSTORAGE DEBUG ===');
  console.log('All localStorage keys:', Object.keys(localStorage));
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`${key}:`, value);
  }
};

/**
 * Tạo mock user data để test
 */
export const createMockUser = () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    fullName: 'Test User',
    roleName: 'USER',
    phone: '0123456789',
    active: true
  };
  
  localStorage.setItem('user', JSON.stringify(mockUser));
  localStorage.setItem('token', 'mock-token-for-testing');
  
  console.log('✅ Mock user created:', mockUser);
  return mockUser;
}; 