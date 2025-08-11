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
      console.log('AdminLogin.handleSubmit - Starting login with:', formData);
      
      const response = await adminAuth.login(formData);
      console.log('AdminLogin.handleSubmit - Response:', response);
      
      // adminAuth.login đã xử lý việc lưu token và user vào localStorage
      // Chỉ cần kiểm tra xem có token không
      const adminToken = localStorage.getItem("adminToken");
      const adminUser = localStorage.getItem("adminUser");
      
      if (!adminToken) {
        throw new Error("Không nhận được token từ server.");
      }
      
      if (!adminUser) {
        throw new Error("Không nhận được thông tin admin từ server.");
      }
      
      const userData = JSON.parse(adminUser);
      console.log('AdminLogin.handleSubmit - Admin user data:', userData);
      
      if (userData.role !== "ADMIN") {
        throw new Error("Bạn không có quyền truy cập Admin.");
      }

      showSuccess(
        "Đăng nhập Admin thành công!",
        `Chào mừng Admin ${userData.name || userData.email} quay trở lại!`
      );

      console.log('AdminLogin.handleSubmit - Login successful, navigating to dashboard');
      navigate("/admin/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
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

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
          >
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
