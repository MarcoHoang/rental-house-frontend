import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import UserHomePage from "./pages/UserHomePage";
import HostDashboardPage from "./pages/HostDashboardPage";
import HostDashboardPageOld from "./pages/host/HostDashboardPage";
import HostRentalRequests from "./components/host/HostRentalRequests";
import PostPropertyPage from "./pages/host/PostPropertyPage";
import HostProfilePage from "./pages/host/HostProfilePage";
import HostMessagesPage from "./pages/host/HostMessagesPage";
import HostStatistics from "./components/host/HostStatistics";
import HostPropertiesPage from "./pages/host/HostPropertiesPage";
import Register from "./components/login-register/Register";
import Login from "./components/login-register/Login";
import ForgotPassword from "./components/login-register/ForgotPassword";
import AdminLogin from "./components/admin/AdminLogin";
import HostLayout from "./components/layout/HostLayout";
import UserProfilePage from "./pages/UserProfilePage";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminRoute from "./components/admin/AdminRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ToastProvider from "./components/common/Toast";
import { AUTH_CONFIG } from "./config/auth";
import { getUserFromStorage } from "./utils/localStorage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ChangePasswordHostPage from "./pages/host/ChangePasswordHostPage";
import HouseListPage from "./pages/HouseListPage";
import HouseDetailPage from "./pages/HouseDetailPage";
import AllHousesPage from "./pages/AllHousesPage";
import MyRentalsPage from "./pages/MyRentalsPage";
import MyFavoritesPage from "./pages/MyFavoritesPage";
import ChatPage from "./pages/ChatPage";

// Protected Route Component (đã cải thiện)
const ProtectedRoute = ({
  children,
  requireHost = false,
  requireUser = false,
}) => {
  const ENABLE_AUTH = AUTH_CONFIG.ENABLE_AUTH;

  if (!ENABLE_AUTH) {
    return children;
  }

  // Sử dụng utility function để lấy user data an toàn
  const user = getUserFromStorage() || {};

  // Kiểm tra roleName (không phân biệt hoa thường)
  const userRole = user.roleName ? user.roleName.toUpperCase() : null;

  // Kiểm tra yêu cầu HOST
  if (requireHost) {
    if (userRole === "HOST") {
      return children;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Kiểm tra yêu cầu USER thường
  if (requireUser) {
    if (userRole === "USER") {
      return children;
    } else if (userRole === "HOST") {
      return <Navigate to="/host" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Nếu không có yêu cầu cụ thể, chỉ cần kiểm tra đăng nhập
  if (user && user.id) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
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
            <AuthProvider>
              <Routes>
              {/* Các route công khai */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Trang chủ chung cho tất cả người dùng */}
              <Route
                path="/"
                element={<UserHomePage />}
              />

              {/* Trang chi tiết nhà - công khai cho tất cả */}
              <Route
                path="/houses/:id"
                element={<HouseDetailPage />}
              />

              {/* Trang tất cả nhà cho thuê - công khai */}
              <Route
                path="/all-houses"
                element={<AllHousesPage />}
              />

              {/* Trang đơn thuê - cho phép cả user và host */}
              <Route
                path="/my-rentals"
                element={
                  <ProtectedRoute>
                    <MyRentalsPage />
                  </ProtectedRoute>
                }
              />

              {/* Trang yêu thích - cho phép cả user và host */}
              <Route
                path="/my-favorites"
                element={
                  <ProtectedRoute>
                    <MyFavoritesPage />
                  </ProtectedRoute>
                }
              />

              {/* Trang tin nhắn - cho phép cả user và host */}
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <ChatPage />
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


              {/* Trang admin */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminDashboard />
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
              <Route index element={<HostDashboardPage />} />
              <Route
                path="post"
                element={<PostPropertyPage />}
              />
              <Route
                path="properties"
                element={<HostPropertiesPage />}
              />
              <Route
                path="bookings"
                element={<HostRentalRequests />}
              />
              <Route
                path="profile"
                element={<HostProfilePage />}
              />
              <Route
                path="change-password"
                element={<ChangePasswordHostPage />}
              />
              <Route
                path="messages"
                element={<HostMessagesPage />}
              />
              <Route
                path="analytics"
                element={<HostStatistics />}
              />
            </Route>

              {/* Test route cho bản đồ */}
              

              {/* Chuyển hướng dựa trên vai trò */}
              <Route path="/redirect" element={<RoleBasedRedirect />} />

              {/* Chuyển hướng các đường dẫn không xác định về trang chủ */}
              <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
            </AuthProvider>
            </Router>
          </ToastProvider>
        </ErrorBoundary>
    );
  }

export default App;
