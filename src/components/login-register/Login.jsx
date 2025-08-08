// src/components/login-register/Login.jsx

import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import authService from "../../api/authService";
import { LogIn, Mail, Lock, Home } from "lucide-react";
import styles from "./Login.module.css"; // Import file CSS Module

const Login = () => {
  // Toàn bộ phần logic state và hàm xử lý được giữ nguyên, không thay đổi
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (message) {
      setMessage("");
      setIsError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Đang xử lý...");
    setIsError(false);

    if (!formData.email || !formData.password) {
      setMessage("Vui lòng điền đầy đủ email và mật khẩu.");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(
        formData.email,
        formData.password
      );

      if (response.token) {
        localStorage.setItem("token", response.token);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }

        setMessage("Đăng nhập thành công!");
        setIsError(false);
        window.dispatchEvent(new Event("storage"));

        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1000);
      } else {
        throw new Error("Không nhận được thông tin đăng nhập từ máy chủ");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setMessage(
        error.response?.data?.message || error.message || "Đăng nhập thất bại"
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Sử dụng kết hợp CSS Module cho background và Tailwind cho layout
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${styles.loginContainer}`}
    >
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-lg relative overflow-hidden">
        {/* Đường viền gradient trang trí */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${styles.gradientBorder}`}
        />

        {/* Phần tiêu đề */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${styles.headerIconWrapper}`}
          >
            <LogIn color="white" size={32} />
          </div>
          <h1 className="text-gray-800 text-3xl font-bold mb-2">
            Đăng nhập tài khoản
          </h1>
          <p className="text-gray-500 text-sm">Chào mừng bạn quay trở lại!</p>
        </div>

        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Hộp thông báo */}
          {message && (
            <div
              // Dùng logic để chọn class success hoặc error từ file CSS Module
              className={`${styles.message} ${
                isError ? styles.error : styles.success
              }`}
            >
              {message}
            </div>
          )}

          {/* Trường Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 font-medium text-gray-700 text-sm"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className={styles.inputIcon} />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Địa chỉ email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full p-3.5 border-2 border-gray-200 rounded-lg text-base ${styles.inputField}`}
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
              <Lock className={styles.inputIcon} />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full p-3.5 border-2 border-gray-200 rounded-lg text-base ${styles.inputField}`}
              />
            </div>
          </div>

          {/* Nút Đăng nhập */}
          <button
            type="submit"
            disabled={loading}
            className={`text-white p-3.5 border-none rounded-lg text-base font-semibold cursor-pointer min-h-[48px] flex items-center justify-center mt-2 ${styles.submitButton}`}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Phần liên kết chân trang */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="mb-4 text-gray-600 text-sm">
            Chưa có tài khoản?{" "}
            <Link to="/register" className={`font-medium ${styles.footerLink}`}>
              Đăng ký ngay
            </Link>
          </p>
          <Link
            to="/forgot-password"
            className={`block mb-4 font-medium text-sm ${styles.footerLink}`}
          >
            Quên mật khẩu?
          </Link>
          <Link
            to="/"
            className={`inline-flex items-center gap-2 font-medium text-sm ${styles.footerLink}`}
          >
            <Home size={16} />
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
