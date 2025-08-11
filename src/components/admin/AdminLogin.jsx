// src/components/admin/AdminLogin.jsx (Đã sửa - Chỉ dùng Tailwind CSS)

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner.jsx"; // Đảm bảo đường dẫn đúng
import { adminAuth } from "@/api/authApi.jsx";
import { jwtDecode } from "jwt-decode";

const AdminLogin = () => {
  // --- TOÀN BỘ LOGIC CỦA BẠN ĐƯỢC GIỮ NGUYÊN ---
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
  // --- KẾT THÚC PHẦN LOGIC ---

  return (
    // Sử dụng nền gradient tương tự trang user login nhưng với tông màu hồng-tím
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-violet-600 p-4">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md relative">
        {/* Phần tiêu đề */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full mb-4">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-gray-800 text-2xl sm:text-3xl font-bold mb-1">
            Admin Panel
          </h1>
          <p className="text-gray-500 text-sm">Đăng nhập để quản lý hệ thống</p>
        </div>

        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Hộp thông báo lỗi */}
          {error && (
            <div className="p-3.5 rounded-lg text-sm text-center border-l-4 bg-red-100 text-red-800 border-red-500">
              {error}
            </div>
          )}

          {/* Trường Email Admin */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 font-medium text-gray-700 text-sm"
            >
              Email Admin <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                // Áp dụng style tương tự trang user login
                className="w-full py-3 px-4 pl-11 border-2 border-gray-200 rounded-lg text-base transition-all bg-gray-50 focus:outline-none focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10"
              />
            </div>
          </div>

          {/* Trường Mật khẩu */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 font-medium text-gray-700 text-sm"
            >
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu của bạn"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full py-3 px-4 pl-11 pr-12 border-2 border-gray-200 rounded-lg text-base transition-all bg-gray-50 focus:outline-none focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Nút Đăng nhập Admin */}
          <button
            type="submit"
            disabled={loading}
            // Áp dụng style nút tương tự trang user login
            className="bg-gradient-to-r from-pink-500 to-violet-600 text-white p-3.5 border-none rounded-lg text-base font-semibold cursor-pointer transition-all min-h-[48px] flex items-center justify-center mt-2 hover:-translate-y-0.5 hover:shadow-lg disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {loading ? <LoadingSpinner /> : "Đăng nhập Admin"}
          </button>
        </form>

        {/* Liên kết quay về trang chủ */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <a
            href="/"
            className="text-violet-600 no-underline text-sm font-medium inline-flex items-center gap-2 transition-colors hover:text-violet-800 hover:underline"
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
