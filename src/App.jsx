import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import UserHomePage from "./pages/UserHomePage";
import HostHomePage from "./pages/HostHomePage";
import HostDashboardPage from "./pages/host/HostDashboardPage";
import PostPropertyPage from "./pages/host/PostPropertyPage";
import HostProfilePage from "./pages/host/HostProfilePage";
import Register from "./components/login-register/Register";
import Login from "./components/login-register/Login";
import ForgotPassword from "./components/login-register/ForgotPassword";
import AdminLogin from "./components/admin/AdminLogin";
import HostLayout from "./components/layout/HostLayout";
import UserProfilePage from "./pages/UserProfilePage";
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./components/admin/AdminRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ToastProvider from "./components/common/Toast";
import { AUTH_CONFIG } from "./config/auth";
import { getUserFromStorage } from "./utils/localStorage";
import AvatarTestPage from "./pages/AvatarTestPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import HouseListPage from "./pages/HouseListPage";
import HouseDetailPage from "./pages/HouseDetailPage";
import HostApplicationTestPage from "./pages/HostApplicationTestPage";

// Protected Route Component (đã cải thiện)
const ProtectedRoute = ({
  children,
  requireHost = false,
  requireUser = false,
}) => {
  const ENABLE_AUTH = AUTH_CONFIG.ENABLE_AUTH;

  // Debug log ban đầu
  console.log('\n=== ProtectedRoute Debug ===');
  console.log('Path:', window.location.pathname);
  console.log('ENABLE_AUTH:', ENABLE_AUTH);

  if (!ENABLE_AUTH) {
    console.log('Auth is disabled, allowing access');
    return children;
  }

  // Lấy thông tin user
  const user = getUserFromStorage() || {};
  console.log('User from storage:', JSON.stringify(user, null, 2));
  
  // Kiểm tra roleName (không phân biệt hoa thường)
  const userRole = user.roleName ? user.roleName.toUpperCase() : null;
  console.log('User role (uppercase):', userRole);

  // Debug logs
  console.log('requireHost:', requireHost);
  console.log('requireUser:', requireUser);

  // Kiểm tra yêu cầu HOST
  if (requireHost) {
    if (userRole === 'HOST') {
      console.log('User is HOST, allowing access to host route');
      return children;
    } else {
      console.log('User is not HOST, redirecting to /');
      return <Navigate to="/" replace />;
    }
  }

  // Kiểm tra yêu cầu USER thường
  if (requireUser) {
    if (userRole === 'USER') {
      console.log('User is regular USER, allowing access to user route');
      return children;
    } else if (userRole === 'HOST') {
      console.log('User is HOST, redirecting to /host');
      return <Navigate to="/host" replace />;
    } else {
      console.log('User not authenticated, redirecting to /');
      return <Navigate to="/" replace />;
    }
  }

  console.log('No specific role required, allowing access');
  return children;
};

// Component điều hướng dựa trên vai trò
const RoleBasedRedirect = () => {
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
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

            {/* Trang đổi mật khẩu */}
            <Route
              path="/change-password"
              element={
                <ProtectedRoute requireUser={true}>
                  <ChangePasswordPage />
                </ProtectedRoute>
              }
            />

            {/* Trang test avatar upload */}
            <Route path="/avatar-test" element={<AvatarTestPage />} />

            {/* Trang test đơn đăng ký làm chủ nhà */}
            <Route
              path="/host-application-test"
              element={<HostApplicationTestPage />}
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
              <Route 
                path="post" 
                element={
                  <div style={{ padding: '20px' }}>
                    <PostPropertyPage />
                  </div>
                } 
              />
            </Route>

            {/* Chuyển hướng dựa trên vai trò */}
            <Route path="/redirect" element={<RoleBasedRedirect />} />

            {/* Chuyển hướng các đường dẫn không xác định về trang chủ */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
