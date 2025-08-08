// src/components/admin/AdminLogin.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import LoadingSpinner from "../common/LoadingSpinner";
import { adminAuth } from "../../api/adminApi";
import { jwtDecode } from "jwt-decode";
import styles from "./AdminLogin.module.css"; // Import CSS Modules

const AdminLogin = () => {
  // --- Toàn bộ logic và state được giữ nguyên ---
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await adminAuth.login(formData);
      const token = response.data?.data?.token;

      if (!token) throw new Error("Không nhận được token từ server.");

      const decoded = jwtDecode(token);
      const roleFromToken = decoded?.role?.replace("ROLE_", "");

      if (roleFromToken !== "ADMIN")
        throw new Error("Bạn không có quyền truy cập Admin.");

      const adminUser = {
        id: decoded?.id,
        email: decoded?.sub,
        role: roleFromToken,
      };

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(adminUser));

      navigate("/admin/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Đăng nhập thất bại.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${styles.loginContainer}`}
    >
      <div
        className={`relative bg-white p-10 rounded-xl shadow-2xl w-full max-w-md overflow-hidden ${styles.gradientBorder}`}
      >
        <div className="text-center mb-8">
          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${styles.iconWrapper}`}
          >
            <Shield color="white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Admin Panel</h1>
          <p className="text-gray-500 text-sm">Đăng nhập để quản lý hệ thống</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Admin
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="admin@renthouse.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full p-3 border-2 border-gray-200 rounded-lg ${styles.inputField}`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Nhập mật khẩu admin"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full p-3 pr-10 border-2 border-gray-200 rounded-lg ${styles.inputField}`}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${styles.submitButton}`}
          >
            {loading ? <LoadingSpinner /> : "Đăng nhập Admin"}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <a
            href="/"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
