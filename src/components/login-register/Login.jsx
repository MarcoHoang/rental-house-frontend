import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, Eye, EyeOff, Home } from "lucide-react";
import { authService } from "../../api/authService";


function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''

    });
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Đang xử lý...');
        setIsError(false);

        try {
            const response = await authService.login(
                formData.email,
                formData.password
            );

            // Lưu token và thông tin người dùng vào localStorage
            if (response.token) {
                localStorage.setItem('token', response.token);
                if (response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
                
                setMessage('Đăng nhập thành công!');
                setIsError(false);

                // Kích hoạt sự kiện để cập nhật giao diện
                window.dispatchEvent(new Event('storage'));

                // Chuyển hướng về trang chủ sau 1 giây
                setTimeout(() => {
                    navigate('/');
                    window.location.reload(); // Tải lại trang để đảm bảo cập nhật giao diện
                }, 1000);
            } else {
                throw new Error('Không nhận được thông tin đăng nhập từ máy chủ');
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            setMessage(error.response?.data?.message || error.message || 'Đăng nhập thất bại');
            setIsError(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Đăng nhập tài khoản
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Địa chỉ email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

    try {
      const response = await authService.login(
        formData.username,
        formData.password
      );

      // Lưu token vào localStorage
      localStorage.setItem("token", response.data);
      setMessage("Đăng nhập thành công!");
      setIsError(false);

      // Chuyển hướng về trang chủ sau 1 giây
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setMessage(error.message || "Đăng nhập thất bại");
      setIsError(true);
    } finally {
      setLoading(false);
    }
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
          maxWidth: "420px",
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
            <User color="white" size={32} />
          </div>
          <h1
            style={{
              color: "#1a202c",
              fontSize: "1.75rem",
              fontWeight: "bold",
              margin: "0 0 0.5rem 0",
            }}
          >
            Đăng nhập
          </h1>
          <p
            style={{
              color: "#718096",
              fontSize: "0.875rem",
              margin: 0,
            }}
          >
            Chào mừng bạn quay trở lại
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
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
              Tên đăng nhập
            </label>
            <div style={{ position: "relative" }}>
              <User
                style={{
                  position: "absolute",
                  left: "0.875rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#a0aec0",
                  width: "1.25rem",
                  height: "1.25rem",
                }}
              />
              <input
                type="text"
                name="username"
                placeholder="Nhập tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 2.75rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  transition: "all 0.2s",
                  background: "#f7fafc",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.outline = "none";
                  e.target.style.borderColor = "#3182ce";
                  e.target.style.background = "white";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(49, 130, 206, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.background = "#f7fafc";
                  e.target.style.boxShadow = "none";
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
              Mật khẩu
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                style={{
                  position: "absolute",
                  left: "0.875rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#a0aec0",
                  width: "1.25rem",
                  height: "1.25rem",
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.875rem 2.75rem 0.875rem 2.75rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  transition: "all 0.2s",
                  background: "#f7fafc",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.outline = "none";
                  e.target.style.borderColor = "#3182ce";
                  e.target.style.background = "white";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(49, 130, 206, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.background = "#f7fafc";
                  e.target.style.boxShadow = "none";
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
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
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
              Đăng ký ngay
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

export default Login;
