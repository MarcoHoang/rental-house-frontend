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
import axios from "axios";

const Register = () => {
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
    // Clear message when user starts typing
    if (message) {
      setMessage("");
      setIsError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    // Validation phía client
    if (
      !formData.username ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setMessage("Vui lòng điền đầy đủ các trường");
      setIsError(true);
      setLoading(false);
      return;
    }

    if (!/^0\d{9}$/.test(formData.phone)) {
      setMessage("Số điện thoại không hợp lệ");
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
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        formData
      );
      setMessage(response.data.message || "Đăng ký thành công");
      setIsError(false);

      setTimeout(() => {
        navigate(`/login?username=${encodeURIComponent(formData.username)}`);
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi kết nối server");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Top border gradient */}
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

        {/* Header */}
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
            <UserPlus color="white" size={32} />
          </div>
          <h1
            style={{
              color: "#1a202c",
              fontSize: "1.75rem",
              fontWeight: "bold",
              margin: "0 0 0.5rem 0",
            }}
          >
            Đăng ký tài khoản
          </h1>
          <p
            style={{
              color: "#718096",
              fontSize: "0.875rem",
              margin: 0,
            }}
          >
            Tạo tài khoản mới để bắt đầu
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {/* Message */}
          {message && (
            <div
              style={{
                background: isError ? "#fed7d7" : "#c6f6d5",
                color: isError ? "#742a2a" : "#22543d",
                padding: "0.875rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                textAlign: "center",
                borderLeft: `4px solid ${isError ? "#e53e3e" : "#38a169"}`,
              }}
            >
              {message}
            </div>
          )}

          {/* Username Field */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
                color: "#4a5568",
                fontSize: "0.875rem",
              }}
            >
              Tên đăng nhập <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <User style={iconStyle} />
              <input
                type="text"
                name="username"
                placeholder="Nhập tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
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

          {/* Phone Field */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
                color: "#4a5568",
                fontSize: "0.875rem",
              }}
            >
              Số điện thoại <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <Phone style={iconStyle} />
              <input
                type="text"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={handleChange}
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

          {/* Email Field */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
                color: "#4a5568",
                fontSize: "0.875rem",
              }}
            >
              Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail style={iconStyle} />
              <input
                type="email"
                name="email"
                placeholder="Nhập email (tùy chọn)"
                value={formData.email}
                onChange={handleChange}
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

          {/* Password Field */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
                color: "#4a5568",
                fontSize: "0.875rem",
              }}
            >
              Mật khẩu <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <Lock style={iconStyle} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu (6-32 ký tự)"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  ...inputStyle,
                  paddingRight: "2.75rem",
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
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#4a5568")}
                onMouseLeave={(e) => (e.target.style.color = "#a0aec0")}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
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
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{
                  ...inputStyle,
                  paddingRight: "2.75rem",
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
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#4a5568")}
                onMouseLeave={(e) => (e.target.style.color = "#a0aec0")}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading
                ? "#a0aec0"
                : "linear-gradient(135deg, #3182ce, #667eea)",
              color: "white",
              padding: "0.875rem 1rem",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              minHeight: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "0.5rem",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
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
            {loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
          </button>
        </form>

        {/* Footer Links */}
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
            Đã có tài khoản?{" "}
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
              Đăng nhập ngay
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

export default Register;
