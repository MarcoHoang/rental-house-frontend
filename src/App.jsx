import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// Import Layout
import Layout from "./components/layout/Layout";

// Import Pages
import HomePage from "./pages/HomePage";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import AdminPage from "./pages/AdminPage";

// Import Components không dùng Layout
import Register from "./components/login-register/Register";
import Login from "./components/login-register/Login";
import ForgotPassword from "./components/login-register/ForgotPassword";
import AdminLogin from "./components/admin/AdminLogin.jsx";
import AdminRoute from "./components/admin/AdminRoute";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Các Route sử dụng Layout chung --- */}
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <UserProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Thêm các trang khác cần Layout vào đây, ví dụ: */}
        {/* <Route path="/blog" element={<Layout><BlogPage /></Layout>} /> */}

        {/* --- Các Route không sử dụng Layout (trang fullscreen, form riêng biệt) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* --- Route cho trang Admin --- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              {/* Trang admin có thể có layout riêng hoặc không */}
              <AdminPage />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
