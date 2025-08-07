import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import authService from "../../api/authService"; // Giữ nguyên import authService
import { LogIn, Mail, Lock, Home } from "lucide-react"; // Thêm các icon từ lucide-react

const Login = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Xóa thông báo khi người dùng bắt đầu nhập
    if (message) {
      setMessage("");
      setIsError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu loading
    setMessage("Đang xử lý...");
    setIsError(false);

    // Kiểm tra validation cơ bản phía client
    if (!formData.email || !formData.password) {
      setMessage("Vui lòng điền đầy đủ email và mật khẩu.");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      // Giữ nguyên cách gọi API qua authService
      const response = await authService.login(
        formData.email,
        formData.password
      );

      // Lưu token và thông tin người dùng vào localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }

        setMessage("Đăng nhập thành công!");
        setIsError(false);

        // Kích hoạt sự kiện để cập nhật giao diện
        window.dispatchEvent(new Event("storage"));

        // Chuyển hướng về trang chủ sau 1 giây
        setTimeout(() => {
          navigate("/");
          window.location.reload(); // Tải lại trang để đảm bảo cập nhật giao diện
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
      setLoading(false); // Kết thúc loading
    }
  };

  // Định nghĩa style cho input và icon để tái sử dụng
  const inputStyle = {
    width: "100%",
    padding: "0.875rem 1rem 0.875rem 2.75rem", // Thêm padding cho icon
    border: "2px solid #e2e8f0",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    transition: "all 0.2s",
    background: "#f7fafc",
    boxSizing: "border-box", // Đảm bảo padding không làm tăng kích thước tổng thể
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
            <LogIn color="white" size={32} />
          </div>
          <h1
            style={{
              color: "#1a202c",
              fontSize: "1.75rem",
              fontWeight: "bold",
              margin: "0 0 0.5rem 0",
            }}
          >
            Đăng nhập tài khoản
          </h1>
          <p
            style={{
              color: "#718096",
              fontSize: "0.875rem",
              margin: 0,
            }}
          >
            Chào mừng bạn quay trở lại!
          </p>
        </div>

        {/* Form đăng nhập */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {/* Hộp thông báo */}
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

          {/* Trường Email */}
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
                id="email"
                name="email"
                type="email"
                placeholder="Địa chỉ email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  ...inputStyle,
                  // Thêm hiệu ứng focus/blur
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

          {/* Trường Mật khẩu */}
          <div>
            <label
              htmlFor="password"
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
                id="password"
                name="password"
                type="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  ...inputStyle,
                  // Thêm hiệu ứng focus/blur
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

          {/* Nút Đăng nhập */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading
                ? "#a0aec0" // Màu xám khi đang loading
                : "linear-gradient(135deg, #3182ce, #667eea)", // Gradient khi không loading
              color: "white",
              padding: "0.875rem 1rem",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              minHeight: "3rem", // Đảm bảo chiều cao tối thiểu
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "0.5rem",
            }}
            // Hiệu ứng hover
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
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

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
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              style={{
                color: "#3182ce",
                textDecoration: "none",
                fontWeight: "500",
                transition: "color 0.2s",
              }}
              // Hiệu ứng hover
              onMouseEnter={(e) => {
                e.target.style.color = "#2c5aa0";
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#3182ce";
                e.target.style.textDecoration = "none";
              }}
            >
              Đăng ký ngay
            </Link>
          </p>
          <Link
            to="/forgot-password"
            style={{
              color: "#3182ce",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "color 0.2s",
              display: "block",
              marginBottom: "1rem",
            }}
            // Hiệu ứng hover
            onMouseEnter={(e) => {
              e.target.style.color = "#2c5aa0";
              e.target.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#3182ce";
              e.target.style.textDecoration = "none";
            }}
          >
            Quên mật khẩu?
          </Link>
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
            // Hiệu ứng hover
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

export default Login;
