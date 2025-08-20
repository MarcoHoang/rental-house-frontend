// Utility function để map role từ backend sang frontend
export const mapBackendRoleToFrontend = (backendRole) => {
  if (!backendRole) return null;
  
  const roleMap = {
    'ROLE_HOST': 'HOST',
    'ROLE_USER': 'USER',
    'ROLE_ADMIN': 'ADMIN',
    'HOST': 'HOST',
    'USER': 'USER',
    'ADMIN': 'ADMIN'
  };
  
  return roleMap[backendRole] || null;
};

// Utility function để lấy role từ JWT token
export const getRoleFromJWT = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return mapBackendRoleToFrontend(payload.role);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
};

// Utility function để đảm bảo user object có roleName
export const ensureUserHasRoleName = (user, token) => {
  if (!user) return user;
  
  // Nếu user đã có roleName, không cần làm gì
  if (user.roleName) return user;
  
  // Thử lấy role từ JWT token
  const roleFromJWT = getRoleFromJWT(token);
  if (roleFromJWT) {
    user.roleName = roleFromJWT;
    console.log('Set user.roleName from JWT:', roleFromJWT);
  }
  
  return user;
};

// Utility function để sửa user data từ localStorage nếu cần
export const fixUserDataFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userStr || !token) {
      return null;
    }
    
    const user = JSON.parse(userStr);
    
    // Nếu user không có roleName hoặc có role rỗng, thử sửa từ JWT
    if (!user.roleName || user.role === '') {
      const roleFromToken = getRoleFromJWT(token);
      if (roleFromToken) {
        const fixedUser = { ...user, roleName: roleFromToken };
        localStorage.setItem('user', JSON.stringify(fixedUser));
        console.log('fixUserDataFromStorage - Fixed user data:', fixedUser);
        return fixedUser;
      }
    }
    
    return user;
  } catch (error) {
    console.error('fixUserDataFromStorage - Error:', error);
    return null;
  }
};
