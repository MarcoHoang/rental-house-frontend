import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import UserHomePage from "./pages/UserHomePage";
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
const ProtectedRoute = ({ children, requireHost = false, requireUser = false }) => {
  const ENABLE_AUTH = false; // đổi sang false để tắt xác thực khi test UI

  if (!ENABLE_AUTH) {
    return children;
  }

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireHost && user.roleName !== 'HOST') {
    return <Navigate to="/" replace />;
  }

  if (requireUser && user.roleName === 'HOST') {
    return <Navigate to="/host" replace />;
  }

  return children;
};

// Component điều hướng dựa trên vai trò
// Luôn điều hướng về trang chủ chung
const RoleBasedRedirect = () => {
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Các route công khai */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Trang chủ chung cho tất cả người dùng */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <UserHomePage />
            </ProtectedRoute>
          }
        />

        {/* Các route yêu cầu đăng nhập (chỉ dành cho user thường) */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute requireUser={true}>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Trang admin */}
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
            <ProtectedRoute requireHost={true}>
              <HostLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HostHomePage />} />
          <Route path="post" element={<PostPropertyPage />} />
        </Route>

        {/* Chuyển hướng dựa trên vai trò */}
        <Route path="/redirect" element={<RoleBasedRedirect />} />

        {/* Chuyển hướng các đường dẫn không xác định về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
