// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HostHomePage from "./pages/HostHomePage";
import PostPropertyPage from "./pages/host/PostPropertyPage";
import Register from './components/login-register/Register';
import Login from './components/login-register/Login';
import UserProfilePage from './pages/UserProfilePage';
import ForgotPassword from './components/login-register/ForgotPassword';
import AdminLogin from './components/admin/AdminLogin';
import HostLayout from './components/layout/HostLayout';

// Protected Route Component - Tạm thời tắt xác thực
const ProtectedRoute = ({ children, requireHost = false }) => {
  // Tắt xác thực tạm thời để kiểm thử giao diện
  const ENABLE_AUTH = false;
  
  if (ENABLE_AUTH) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    
    if (requireHost && user.role !== 'HOST') {
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

// Component rỗng để giữ cấu trúc
const RoleBasedRedirect = () => {
  return null;
};

function App() {
  return (
    <Router>
      <RoleBasedRedirect />
      <Routes>
        {/* Các route công khai */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Các route yêu cầu đăng nhập */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          } 
        />

        {/* Các route dành cho chủ nhà */}
        <Route 
          path="/host" 
          element={
            <ProtectedRoute requireHost>
              <HostLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HostHomePage />} />
          <Route path="post" element={<PostPropertyPage />} />
        </Route>

        {/* Chuyển hướng các đường dẫn không xác định về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
