// src/components/login-register/ForgotPassword.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../api/authService";
import { Mail, Lock, Home, KeyRound } from "lucide-react";
import styles from "./ForgotPassword.module.css"; // Import CSS Modules

const ForgotPassword = () => {
  // --- Toàn bộ logic và state được giữ nguyên ---
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    /* ... logic giữ nguyên ... */
  };
  const handleVerifyOtp = async (e) => {
    /* ... logic giữ nguyên ... */
  };
  const handleResetPassword = async (e) => {
    /* ... logic giữ nguyên ... */
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email đã đăng ký"
                  required
                  className={`w-full p-3 border-2 border-gray-200 rounded-lg ${styles.inputField}`}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white p-3 rounded-lg font-semibold flex items-center justify-center ${styles.submitButton}`}
            >
              {isLoading ? "Đang xử lý..." : "Tiếp tục"}
            </button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mã xác thực (OTP) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Nhập mã OTP 6 số"
                  maxLength={6}
                  required
                  className={`w-full p-3 border-2 border-gray-200 rounded-lg ${styles.inputField}`}
                />
              </div>
              <small className="block mt-2 text-xs text-gray-500">
                Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư
                đến và thư mục spam.
              </small>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white p-3 rounded-lg font-semibold flex items-center justify-center ${styles.submitButton}`}
            >
              {isLoading ? "Đang xác thực..." : "Xác thực"}
            </button>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  minLength={6}
                  required
                  className={`w-full p-3 border-2 border-gray-200 rounded-lg ${styles.inputField}`}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  minLength={6}
                  required
                  className={`w-full p-3 border-2 border-gray-200 rounded-lg ${styles.inputField}`}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white p-3 rounded-lg font-semibold flex items-center justify-center ${styles.submitButton}`}
            >
              {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${styles.formContainer}`}
    >
      <div
        className={`relative bg-white p-10 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden ${styles.gradientBorder}`}
      >
        <div className="text-center mb-8">
          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${styles.iconWrapper}`}
          >
            <KeyRound color="white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Quên mật khẩu
          </h1>
          <p className="text-gray-500 text-sm">
            Làm theo các bước để đặt lại mật khẩu của bạn
          </p>
        </div>

        {/* Step Indicator */}
        <div className={styles.stepIndicator}>
          {[1, 2, 3].map((s) => (
            <div key={s} className={styles.step}>
              <div
                className={styles.stepCircle}
                style={{
                  backgroundColor:
                    step === s ? "#4f46e5" : step > s ? "#818cf8" : "#e5e7eb",
                  color: step >= s ? "white" : "#9ca3af",
                }}
              >
                {step > s ? "✓" : s}
              </div>
              <span
                className={styles.stepLabel}
                style={{
                  color: step >= s ? "#4f46e5" : "#9ca3af",
                  fontWeight: step === s ? "600" : "400",
                }}
              >
                {s === 1 ? "Nhập email" : s === 2 ? "Xác thực" : "Mật khẩu mới"}
              </span>
            </div>
          ))}
        </div>

        {/* Message Box */}
        {message.text && (
          <div
            className={`p-3 rounded-md text-sm mb-6 text-center border-l-4 ${
              message.type === "error"
                ? "bg-red-100 text-red-800 border-red-500"
                : "bg-green-100 text-green-800 border-green-500"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form Content */}
        {renderStepContent()}

        {/* Footer Links */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="mb-4 text-sm text-gray-600">
            Quay lại trang{" "}
            <Link to="/login" className={`font-medium ${styles.footerLink}`}>
              đăng nhập
            </Link>
          </p>
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

export default ForgotPassword;
