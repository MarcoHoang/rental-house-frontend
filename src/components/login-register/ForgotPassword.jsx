import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../api/authService";
import { Mail, Lock, Home, KeyRound } from "lucide-react"; // Thêm icon KeyRound

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ text: "Vui lòng nhập email", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setStep(2);
      setMessage({
        text: "Mã xác thực đã được gửi đến email của bạn",
        type: "success",
      });
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage({ text: "Vui lòng nhập mã OTP", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyOtp(email, otp);
      setStep(3);
      setMessage({
        text: "Xác thực thành công, vui lòng đặt mật khẩu mới",
        type: "success",
      });
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setMessage({ text: "Vui lòng nhập đầy đủ thông tin", type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: "Mật khẩu xác nhận không khớp", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: "Mật khẩu phải có ít nhất 6 ký tự", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email, otp, newPassword);
      setMessage({
        text: "Đặt lại mật khẩu thành công! Bạn sẽ được chuyển hướng về trang đăng nhập",
        type: "success",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Định nghĩa style cho input và icon để tái sử dụng
  const inputStyle = {
    width: "100%",
    padding: "0.875rem 1rem 0.875rem 2.75rem",
    border: "2px solid #e2e8f0",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    transition: "all 0.2s",
    background: "#f7fafc",
    boxSizing: "border-box",
  };

  const iconStyle = {
    position: "absolute",
    left: "0.875rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#a0aec0",
    width: "1.25rem",
    height: "1.25rem",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2.5rem",
          borderRadius: "1rem",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          width: "100%",
          maxWidth: "480px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Đường viền gradient phía trên */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #3182ce, #667eea)",
          }}
        />

        {/* Phần tiêu đề */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "4rem",
              height: "4rem",
              background: "linear-gradient(135deg, #3182ce, #667eea)",
              borderRadius: "50%",
              marginBottom: "1rem",
            }}
          >
            <KeyRound color="white" size={32} />
          </div>
          <h1
            style={{
              color: "#1a202c",
              fontSize: "1.75rem",
              fontWeight: "bold",
              margin: "0 0 0.5rem 0",
            }}
          >
            Quên mật khẩu
          </h1>
          <p
            style={{
              color: "#718096",
              fontSize: "0.875rem",
              margin: 0,
            }}
          >
            Vui lòng làm theo các bước để đặt lại mật khẩu
          </p>
        </div>

        {/* Step Indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "2rem",
            position: "relative",
          }}
        >
          <div
            style={{
              content: "",
              position: "absolute",
              top: "1rem",
              left: 0,
              right: 0,
              height: "2px",
              backgroundColor: "#e5e7eb",
              zIndex: 1,
            }}
          />
          {[
            { num: 1, label: "Nhập email" },
            { num: 2, label: "Xác thực OTP" },
            { num: 3, label: "Đặt mật khẩu mới" },
          ].map((s, index) => (
            <div
              key={s.num}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                zIndex: 2,
                flex: 1, // Để chia đều không gian
              }}
            >
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  backgroundColor:
                    step === s.num
                      ? "#4f46e5"
                      : step > s.num
                      ? "#a5b4fc"
                      : "#e5e7eb",
                  color: step === s.num || step > s.num ? "white" : "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: step === s.num || step > s.num ? "#4f46e5" : "#9ca3af",
                  fontWeight: step === s.num ? "600" : "400",
                  textAlign: "center",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Hộp thông báo */}
        {message.text && (
          <div
            style={{
              background: message.type === "error" ? "#fed7d7" : "#c6f6d5",
              color: message.type === "error" ? "#742a2a" : "#22543d",
              padding: "0.875rem 1rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              textAlign: "center",
              borderLeft: `4px solid ${
                message.type === "error" ? "#e53e3e" : "#38a169"
              }`,
              marginBottom: "1.25rem",
            }}
          >
            {message.text}
          </div>
        )}

        {step === 1 && (
          <form
            onSubmit={handleRequestOtp}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  color: "#4a5568",
                  fontSize: "0.875rem",
                }}
              >
                Email <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <Mail style={iconStyle} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email đã đăng ký"
                  required
                  style={{
                    ...inputStyle,
                    onFocus: (e) => {
                      e.target.style.outline = "none";
                      e.target.style.borderColor = "#3182ce";
                      e.target.style.background = "white";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(49, 130, 206, 0.1)";
                    },
                    onBlur: (e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.background = "#f7fafc";
                      e.target.style.boxShadow = "none";
                    },
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: isLoading
                  ? "#a0aec0"
                  : "linear-gradient(135deg, #3182ce, #667eea)",
                color: "white",
                padding: "0.875rem 1rem",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                minHeight: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "0.5rem",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow =
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              {isLoading ? "Đang xử lý..." : "Tiếp tục"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={handleVerifyOtp}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div>
              <label
                htmlFor="otp"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  color: "#4a5568",
                  fontSize: "0.875rem",
                }}
              >
                Mã xác thực (OTP) <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <Lock style={iconStyle} /> {/* Dùng icon khóa cho OTP */}
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
                  style={{
                    ...inputStyle,
                    onFocus: (e) => {
                      e.target.style.outline = "none";
                      e.target.style.borderColor = "#3182ce";
                      e.target.style.background = "white";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(49, 130, 206, 0.1)";
                    },
                    onBlur: (e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.background = "#f7fafc";
                      e.target.style.boxShadow = "none";
                    },
                  }}
                />
              </div>
              <small
                style={{
                  display: "block",
                  marginTop: "0.5rem", // Tăng khoảng cách
                  color: "#718096", // Màu sắc đồng bộ
                  fontSize: "0.75rem",
                }}
              >
                Chúng tôi đã gửi mã OTP đến email của bạn. Vui lòng kiểm tra hộp
                thư đến (và cả thư mục spam/junk).
              </small>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: isLoading
                  ? "#a0aec0"
                  : "linear-gradient(135deg, #3182ce, #667eea)",
                color: "white",
                padding: "0.875rem 1rem",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                minHeight: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "0.5rem",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow =
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              {isLoading ? "Đang xác thực..." : "Xác thực"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form
            onSubmit={handleResetPassword}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div>
              <label
                htmlFor="newPassword"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  color: "#4a5568",
                  fontSize: "0.875rem",
                }}
              >
                Mật khẩu mới <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <Lock style={iconStyle} />
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  minLength={6}
                  required
                  style={{
                    ...inputStyle,
                    onFocus: (e) => {
                      e.target.style.outline = "none";
                      e.target.style.borderColor = "#3182ce";
                      e.target.style.background = "white";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(49, 130, 206, 0.1)";
                    },
                    onBlur: (e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.background = "#f7fafc";
                      e.target.style.boxShadow = "none";
                    },
                  }}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  color: "#4a5568",
                  fontSize: "0.875rem",
                }}
              >
                Xác nhận mật khẩu <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <Lock style={iconStyle} />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  minLength={6}
                  required
                  style={{
                    ...inputStyle,
                    onFocus: (e) => {
                      e.target.style.outline = "none";
                      e.target.style.borderColor = "#3182ce";
                      e.target.style.background = "white";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(49, 130, 206, 0.1)";
                    },
                    onBlur: (e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.background = "#f7fafc";
                      e.target.style.boxShadow = "none";
                    },
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: isLoading
                  ? "#a0aec0"
                  : "linear-gradient(135deg, #3182ce, #667eea)",
                color: "white",
                padding: "0.875rem 1rem",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                minHeight: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "0.5rem",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow =
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </form>
        )}

        {/* Phần liên kết chân trang */}
        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <p
            style={{
              margin: "0 0 1rem 0",
              color: "#718096",
              fontSize: "0.875rem",
            }}
          >
            Quay lại{" "}
            <Link
              to="/login"
              style={{
                color: "#3182ce",
                textDecoration: "none",
                fontWeight: "500",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#2c5aa0";
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#3182ce";
                e.target.style.textDecoration = "none";
              }}
            >
              đăng nhập
            </Link>
          </p>
          <Link
            to="/"
            style={{
              color: "#3182ce",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: "500",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#2c5aa0";
              e.target.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#3182ce";
              e.target.style.textDecoration = "none";
            }}
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
