// src/components/login-register/Register.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserPlus,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Home,
} from "lucide-react";
import axios from "axios"; // **KHÔI PHỤC LẠI AXIOS**

const Register = () => {
  // --- Toàn bộ state và hàm handleChange được giữ nguyên ---
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message) {
      setMessage("");
      setIsError(false);
    }
  };

  // --- HÀM HANDLESUBMIT ĐÃ ĐƯỢC KHÔI PHỤC LẠI LOGIC GỐC CỦA BẠN ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    // Giữ nguyên validation
    if (
      !formData.username ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setMessage("Vui lòng điền đầy đủ các trường bắt buộc");
      setIsError(true);
      setLoading(false);
      return;
    }
    if (!/^0\d{9}$/.test(formData.phone)) {
      setMessage("Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng 0)");
      setIsError(true);
      setLoading(false);
      return;
    }
    if (
      formData.email &&
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    ) {
      setMessage("Email không hợp lệ");
      setIsError(true);
      setLoading(false);
      return;
    }
    if (formData.password.length < 6 || formData.password.length > 32) {
      setMessage("Mật khẩu phải từ 6 đến 32 ký tự");
      setIsError(true);
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      // **KHÔI PHỤC LẠI LỆNH GỌI API GỐC BẰNG AXIOS**
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        formData
      );
      setMessage(response.data.message || "Đăng ký thành công");
      setIsError(false);

      // **KHÔI PHỤC LẠI CÁCH CHUYỂN TRANG GỐC**
      setTimeout(() => {
        navigate(`/login?username=${encodeURIComponent(formData.username)}`);
      }, 1000);
    } catch (error) {
      // Giữ nguyên cách xử lý lỗi
      setMessage(error.response?.data?.message || "Lỗi kết nối server");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };
  // --- KẾT THÚC PHẦN LOGIC ĐÃ SỬA ---

  // --- Giao diện Tailwind CSS vẫn được giữ nguyên ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-500" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full mb-4">
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 className="text-gray-800 text-2xl sm:text-3xl font-bold mb-1">
            Đăng ký tài khoản
          </h1>
          <p className="text-gray-500 text-sm">Tạo tài khoản mới để bắt đầu</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">
              Tên đăng nhập <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                placeholder="Nhập tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full py-3 px-4 pl-11 border-2 border-gray-200 rounded-lg text-base transition-all bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full py-3 px-4 pl-11 border-2 border-gray-200 rounded-lg text-base transition-all bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Nhập email (tùy chọn)"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-3 px-4 pl-11 border-2 border-gray-200 rounded-lg text-base transition-all bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu (6-32 ký tự)"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full py-3 px-4 pl-11 pr-11 border-2 border-gray-200 rounded-lg text-base transition-all bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 transition-colors hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">
              Xác nhận mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full py-3 px-4 pl-11 pr-11 border-2 border-gray-200 rounded-lg text-base transition-all bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 transition-colors hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-3.5 border-none rounded-lg text-base font-semibold cursor-pointer transition-all min-h-[48px] flex items-center justify-center mt-2 hover:-translate-y-0.5 hover:shadow-lg disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="mb-4 text-gray-500 text-sm">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-blue-600 no-underline font-medium transition-colors hover:text-blue-800 hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
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

export default Register;
