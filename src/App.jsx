import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HostHomePage from "./pages/HostHomePage";
import PostPropertyPage from "./pages/host/PostPropertyPage";
import Register from './components/login-register/Register';
import Login from './components/login-register/Login';
import ForgotPassword from './components/login-register/ForgotPassword';
import AdminLogin from './components/admin/AdminLogin';
import HostLayout from './components/layout/HostLayout';
import UserProfilePage from "./pages/UserProfilePage";
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./components/admin/AdminRoute";

// Protected Route Component (đã gộp)
const ProtectedRoute = ({ children, requireHost = false }) => {
  const ENABLE_AUTH = true; // đổi sang false để tắt xác thực khi test UI

  if (!ENABLE_AUTH) {
    return children;
  }

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireHost && user.role !== 'HOST') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Component rỗng để giữ cấu trúc
const RoleBasedRedirect = () => null;

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

        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
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
