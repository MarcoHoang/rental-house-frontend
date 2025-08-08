// src/components/login-register/Login.jsx

import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import authService from "../../api/authService";
import { LogIn, Mail, Lock, Home } from "lucide-react";

const Login = () => {
  // --- Toàn bộ logic và state được giữ nguyên vẹn ---
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(
    location.state?.message || "" // Hiển thị thông báo nếu có
  );
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
  // --- Kết thúc phần logic không thay đổi ---

  // --- JSX đã được chuyển đổi sang Tailwind CSS ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Đường viền gradient phía trên */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-500" />

        {/* Phần tiêu đề */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full mb-4">
            <LogIn className="text-white" size={32} />
          </div>
          <h1 className="text-gray-800 text-2xl sm:text-3xl font-bold mb-1">
            Đăng nhập tài khoản
          </h1>
          <p className="text-gray-500 text-sm">Chào mừng bạn quay trở lại!</p>
        </div>

        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Hộp thông báo */}
          {message && (
            <div
              className={`p-3.5 rounded-lg text-sm text-center border-l-4 ${
                isError
                  ? "bg-red-100 text-red-800 border-red-500"
                  : "bg-green-100 text-green-800 border-green-500"
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
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Địa chỉ email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full py-3 px-4 pl-11 border-2 border-gray-200 rounded-lg text-base transition-all bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
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
                type="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full py-3 px-4 pl-11 border-2 border-gray-200 rounded-lg text-base transition-all bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
              />
            </div>
          </div>

          {/* Nút Đăng nhập */}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-3.5 border-none rounded-lg text-base font-semibold cursor-pointer transition-all min-h-[48px] flex items-center justify-center mt-2 hover:-translate-y-0.5 hover:shadow-lg disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Phần liên kết chân trang */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="mb-4 text-gray-500 text-sm">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-blue-600 no-underline font-medium transition-colors hover:text-blue-800 hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
          <Link
            to="/forgot-password"
            className="block mb-4 text-blue-600 no-underline text-sm font-medium transition-colors hover:text-blue-800 hover:underline"
          >
            Quên mật khẩu?
          </Link>
          <Link
            to="/"
            className="text-blue-600 no-underline text-sm font-medium inline-flex items-center gap-2 transition-colors hover:text-blue-800 hover:underline"
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
