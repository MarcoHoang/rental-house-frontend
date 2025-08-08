// src/components/auth/AdminProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');

  if (!adminToken) {
    // Không có token -> Chuyển về trang đăng nhập
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(adminToken);
 
    const isAdmin = decodedToken.role === 'ADMIN';

    // Nếu đúng là admin, cho phép vào. Nếu không, về trang đăng nhập.
    return isAdmin ? children : <Navigate to="/admin/login" replace />;

  } catch (error) {
    // Token không hợp lệ (hết hạn, bị sửa đổi) -> Về trang đăng nhập
    console.error("Invalid or expired admin token:", error);
    localStorage.removeItem('adminToken'); // Xóa token hỏng
    return <Navigate to="/admin/login" replace />;
  }
};

export default AdminProtectedRoute;