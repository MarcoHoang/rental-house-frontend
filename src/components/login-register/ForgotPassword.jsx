import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../api/authService";
import { Mail, Lock, Home, KeyRound, Eye, EyeOff } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ text: "Vui lòng nhập email", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setEmailSent(true);
      setStep(2); // Chuyển đến bước kiểm tra email
      setMessage({
        text: "Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến (và cả thư mục spam/junk).",
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

  const handleContinueToToken = () => {
    setStep(3); // Chuyển đến bước nhập token
    setMessage({
      text: "Vui lòng nhập token từ email vào ô bên dưới",
      type: "info",
    });
  };

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage({ text: "Vui lòng nhập token từ email", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      // Token được gửi từ email, user cần copy và paste vào đây
      setStep(4); // Chuyển đến bước đặt mật khẩu mới
      setMessage({
        text: "Token hợp lệ, vui lòng đặt mật khẩu mới",
        type: "success",
      });
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message || "Token không đúng hoặc đã hết hạn",
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
      await authService.resetPassword(token, newPassword);
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

  const handleResendEmail = async () => {
    if (!email) {
      setMessage({ text: "Vui lòng nhập email trước", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setMessage({
        text: "Link đặt lại mật khẩu đã được gửi lại đến email của bạn",
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

  const passwordInputStyle = {
    ...inputStyle,
    paddingRight: "3rem", // Thêm padding bên phải cho icon hiển thị/ẩn mật khẩu
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
            { num: 2, label: "Kiểm tra email" },
            { num: 3, label: "Nhập token" },
            { num: 4, label: "Đặt mật khẩu mới" },
          ].map((s, index) => (
            <div
              key={s.num}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                zIndex: 2,
                flex: 1,
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
            onSubmit={handleRequestReset}
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
              {isLoading ? "Đang xử lý..." : "Gửi link đặt lại mật khẩu"}
            </button>
          </form>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "3rem",
                  height: "3rem",
                  background: "#10b981",
                  borderRadius: "50%",
                  marginBottom: "1rem",
                }}
              >
                <Mail color="white" size={24} />
              </div>
              <h3
                style={{
                  color: "#1a202c",
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  margin: "0 0 0.5rem 0",
                }}
              >
                Email đã được gửi!
              </h3>
              <p
                style={{
                  color: "#718096",
                  fontSize: "0.875rem",
                  margin: 0,
                  lineHeight: "1.5",
                }}
              >
                Chúng tôi đã gửi link đặt lại mật khẩu đến email:
                <br />
                <strong style={{ color: "#1a202c" }}>{email}</strong>
              </p>
            </div>

            <div
              style={{
                background: "#f0f9ff",
                border: "1px solid #0ea5e9",
                borderRadius: "0.5rem",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h4
                style={{
                  color: "#0c4a6e",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  margin: "0 0 0.5rem 0",
                }}
              >
                📧 Hướng dẫn kiểm tra email:
              </h4>
              <ul
                style={{
                  color: "#0c4a6e",
                  fontSize: "0.875rem",
                  margin: "0 0 0 0.5rem",
                  paddingLeft: "1rem",
                  lineHeight: "1.5",
                }}
              >
                <li>Kiểm tra hộp thư đến của bạn</li>
                <li>Kiểm tra thư mục spam/junk nếu không thấy</li>
                <li>Copy token từ email (chuỗi ký tự dài)</li>
                <li>Nhấn "Tiếp tục" để nhập token</li>
              </ul>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={isLoading}
                style={{
                  flex: 1,
                  background: "transparent",
                  color: "#3182ce",
                  padding: "0.75rem 1rem",
                  border: "2px solid #3182ce",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  minHeight: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.background = "#3182ce";
                    e.target.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#3182ce";
                }}
              >
                {isLoading ? "Đang xử lý..." : "Gửi lại email"}
              </button>

              <button
                type="button"
                onClick={handleContinueToToken}
                disabled={isLoading}
                style={{
                  flex: 2,
                  background: "linear-gradient(135deg, #3182ce, #667eea)",
                  color: "white",
                  padding: "0.75rem 1rem",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  minHeight: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form
            onSubmit={handleVerifyToken}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "3rem",
                  height: "3rem",
                  background: "#8b5cf6",
                  borderRadius: "50%",
                  marginBottom: "1rem",
                }}
              >
                <Lock color="white" size={24} />
              </div>
              <h3
                style={{
                  color: "#1a202c",
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  margin: "0 0 0.5rem 0",
                }}
              >
                Nhập token từ email
              </h3>
              <p
                style={{
                  color: "#718096",
                  fontSize: "0.875rem",
                  margin: 0,
                  lineHeight: "1.5",
                }}
              >
                Vui lòng copy token từ email và paste vào ô bên dưới
              </p>
            </div>

            <div>
              <label
                htmlFor="token"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  color: "#4a5568",
                  fontSize: "0.875rem",
                }}
              >
                Token từ email <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <Lock style={iconStyle} />
                <input
                  type="text"
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Nhập token từ email (chuỗi ký tự dài)"
                  required
                  style={{
                    ...inputStyle,
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
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
                  marginTop: "0.5rem",
                  color: "#718096",
                  fontSize: "0.75rem",
                }}
              >
                💡 <strong>Mẹo:</strong> Token thường là một chuỗi ký tự dài (ví dụ: a1b2c3d4-e5f6-7890-abcd-ef1234567890)
              </small>
            </div>
            
            {/* Nút gửi lại email */}
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={isLoading}
              style={{
                background: "transparent",
                color: "#3182ce",
                padding: "0.75rem 1rem",
                border: "2px solid #3182ce",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                minHeight: "2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.background = "#3182ce";
                  e.target.style.color = "white";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#3182ce";
              }}
            >
              {isLoading ? "Đang xử lý..." : "Gửi lại email"}
            </button>

            <button
              type="submit"
              disabled={isLoading || !token}
              style={{
                background: isLoading || !token
                  ? "#a0aec0"
                  : "linear-gradient(135deg, #3182ce, #667eea)",
                color: "white",
                padding: "0.875rem 1rem",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: isLoading || !token ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                minHeight: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "0.5rem",
              }}
              onMouseEnter={(e) => {
                if (!isLoading && token) {
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
              {isLoading ? "Đang xác thực..." : "Xác thực token"}
            </button>
          </form>
        )}

        {step === 4 && (
          <form
            onSubmit={handleResetPassword}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "3rem",
                  height: "3rem",
                  background: "#059669",
                  borderRadius: "50%",
                  marginBottom: "1rem",
                }}
              >
                <KeyRound color="white" size={24} />
              </div>
              <h3
                style={{
                  color: "#1a202c",
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  margin: "0 0 0.5rem 0",
                }}
              >
                Đặt mật khẩu mới
              </h3>
              <p
                style={{
                  color: "#718096",
                  fontSize: "0.875rem",
                  margin: 0,
                  lineHeight: "1.5",
                }}
              >
                Token đã được xác thực thành công. Vui lòng đặt mật khẩu mới cho tài khoản của bạn.
              </p>
            </div>

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
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  minLength={6}
                  required
                  style={{
                    ...passwordInputStyle,
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#a0aec0",
                    padding: "0.25rem",
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <small
                style={{
                  display: "block",
                  marginTop: "0.5rem",
                  color: "#718096",
                  fontSize: "0.75rem",
                }}
              >
                💡 <strong>Gợi ý:</strong> Sử dụng mật khẩu mạnh với ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
              </small>
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
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  minLength={6}
                  required
                  style={{
                    ...passwordInputStyle,
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
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#a0aec0",
                    padding: "0.25rem",
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
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
