import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";
import LoadingSpinner from "../common/LoadingSpinner";
import { adminAuth } from "../../api/adminApi";
import { useForm, validationRules } from "../../hooks/useForm";
import FormField from "../common/FormField";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { useToast } from "../common/Toast";

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
`;

const LoginCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 420px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3182ce, #667eea);
  }
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  .icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    background: linear-gradient(135deg, #3182ce, #667eea);
    border-radius: 50%;
    margin-bottom: 1rem;

    svg {
      color: white;
      width: 2rem;
      height: 2rem;
    }
  }

  h1 {
    color: #1a202c;
    font-size: 1.75rem;
    font-weight: bold;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #718096;
    font-size: 0.875rem;
    margin: 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BackToHome = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;

  a {
    color: #3182ce;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
      color: #2c5aa0;
      text-decoration: underline;
    }
  }
`;

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  const { formData, errors, handleChange, handleBlur, validateForm } = useForm(
    {
      email: "",
      password: "",
    },
    {
      email: validationRules.email,
      password: validationRules.password,
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      console.log("AdminLogin.handleSubmit - Starting login with:", formData);

      const response = await adminAuth.login(formData);
      console.log("AdminLogin.handleSubmit - Response:", response);
      console.log("AdminLogin.handleSubmit - Response status:", response?.status);
      console.log("AdminLogin.handleSubmit - Response data:", response?.data);

      // Kiểm tra response data - cải thiện logic
      console.log("AdminLogin.handleSubmit - Full response data:", response.data);
      
      let userData;
      
      // Kiểm tra các format response có thể có
      if (response.data.user) {
        userData = response.data.user;
      } else if (response.data.data && response.data.data.user) {
        userData = response.data.data.user;
      } else if (response.data.data) {
        userData = response.data.data;
      } else if (response.data) {
        userData = response.data;
      } else {
        throw new Error("Không nhận được thông tin admin từ server.");
      }
      
      console.log("AdminLogin.handleSubmit - Extracted userData:", userData);
      console.log("AdminLogin.handleSubmit - Admin user data:", userData);

      // Kiểm tra role - hỗ trợ nhiều format
      const userRole = userData.role || userData.roleName || userData.authorities?.[0]?.authority;
      console.log("AdminLogin.handleSubmit - User role:", userRole);
      
      if (userRole !== "ADMIN" && userRole !== "ROLE_ADMIN") {
        throw new Error("Bạn không có quyền truy cập Admin.");
      }

      // Lưu token và user data vào localStorage
      const token = response.data.token || response.data.data?.token || userData.token || response.data.data?.user?.token;
      if (token) {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminUser", JSON.stringify(userData));
        console.log("AdminLogin.handleSubmit - Token and user data saved to localStorage");
        console.log("AdminLogin.handleSubmit - Token:", token);
        console.log("AdminLogin.handleSubmit - UserData:", userData);
      } else {
        console.error("AdminLogin.handleSubmit - No token found in response");
      }

      showSuccess(
        "Đăng nhập Admin thành công!",
        `Chào mừng Admin ${userData.name || userData.email} quay trở lại!`
      );

      console.log(
        "AdminLogin.handleSubmit - Login successful, navigating to dashboard"
      );
      
      // Thêm delay nhỏ để đảm bảo state được cập nhật
      setTimeout(() => {
        console.log("AdminLogin.handleSubmit - Executing navigation");
        console.log("AdminLogin.handleSubmit - Current URL:", window.location.href);
        navigate("/admin/dashboard");
        console.log("AdminLogin.handleSubmit - Navigation executed");
      }, 100);
    } catch (err) {
      console.error("AdminLogin.handleSubmit - Error:", err);
      
      let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";
      
      // Xử lý các lỗi authentication cụ thể
      if (err.response?.status === 401) {
        errorMessage = "Email hoặc mật khẩu không đúng";
      } else if (err.response?.status === 403) {
        errorMessage = "Bạn không có quyền truy cập Admin";
      } else if (err.response?.status === 404) {
        errorMessage = "Tài khoản không tồn tại";
      } else if (err.response?.status === 500) {
        errorMessage = "Lỗi máy chủ (500). Vui lòng liên hệ quản trị viên hoặc thử lại sau.";
        console.error("Server Error Details:", err.response.data);
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.request) {
        errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.";
      }
      
      // Log chi tiết lỗi để debug
      console.error("Error Details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        code: err.code
      });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <div className="icon-wrapper">
            <Shield />
          </div>
          <h1>Admin Panel</h1>
          <p>Đăng nhập để quản lý hệ thống</p>
        </LoginHeader>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage type="error" message={error} />}

          <FormField
            label="Email Admin"
            name="email"
            type="email"
            placeholder="admin@renthouse.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            required
            icon={Mail}
          />

          <FormField
            label="Mật khẩu"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu admin"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            required
            icon={Lock}
            showToggle={true}
            onToggle={() => setShowPassword(!showPassword)}
            toggleIcon={showPassword ? EyeOff : Eye}
          />

          <Button type="submit" fullWidth loading={loading} disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập Admin"}
          </Button>
        </Form>

        <BackToHome>
          <a href="/">← Quay về trang chủ</a>
        </BackToHome>
      </LoginCard>
    </LoginContainer>
  );
};

export default AdminLogin;
