import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import { Building2, Mail, Lock, Home, CheckCircle } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 480px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;

  .icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    margin-bottom: 1rem;
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
  }

  h1 {
    color: #1a202c;
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #718096;
    font-size: 0.875rem;
    margin: 0;
  }

  .host-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 600;
    margin-top: 0.5rem;
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.25);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterLinks = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;

  p {
    margin: 0 0 0.75rem 0;
    color: #718096;
    font-size: 0.875rem;
  }

  a {
    color: #667eea;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 600;
    transition: all 0.2s ease-in-out;

    &:hover {
      color: #5a67d8;
      text-decoration: underline;
    }
  }
`;

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const HostLogin = () => {
  const { loginAsHost, loading, error } = useAuth();
  const { showSuccess } = useToast();
  const [searchParams] = useSearchParams();
  const [roleChangedMessage, setRoleChangedMessage] = useState("");
  
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

  // Kiểm tra URL params khi component mount
  useEffect(() => {
    const roleChanged = searchParams.get('roleChanged');
    const sessionExpired = searchParams.get('sessionExpired');
    
    if (roleChanged === 'true') {
      setRoleChangedMessage("Tài khoản của bạn đã được nâng cấp thành chủ nhà! Vui lòng đăng nhập lại để cập nhật quyền truy cập.");
    } else if (sessionExpired === 'true') {
      setRoleChangedMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    console.log('HostLogin.handleSubmit - Starting host login process');
    const result = await loginAsHost(formData.email, formData.password);
    console.log('HostLogin.handleSubmit - Login result:', result);
    
    if (result.success) {
      showSuccess(
        "Đăng nhập host thành công!",
        `Chào mừng bạn quay trở lại, ${result.data?.user?.fullName || 'Chủ nhà'}!`
      );
    } else {
      // Hiển thị lỗi từ result.error hoặc từ error state
      const errorMessage = result.error || error || 'Đăng nhập host thất bại';
      console.log('HostLogin.handleSubmit - Error message:', errorMessage);
      showError("Lỗi đăng nhập", errorMessage);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <div className="icon-wrapper">
            <Building2 color="white" size={32} />
          </div>
          <h1>Đăng nhập tài khoản chủ nhà</h1>
          <p>Quản lý tài sản và đơn đặt phòng của bạn</p>
          <div className="host-badge">
            <Building2 size={16} />
            Chủ nhà
          </div>
        </LoginHeader>

        <Form onSubmit={handleSubmit}>
          {roleChangedMessage && (
            <SuccessMessage>
              <CheckCircle size={20} />
              {roleChangedMessage}
            </SuccessMessage>
          )}
          
          {error && <ErrorMessage type="error" message={error} />}

          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="Địa chỉ email"
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
            type="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            required
            icon={Lock}
          />

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập chủ nhà"}
          </Button>
        </Form>

        <FooterLinks>
          <p>
            Chưa có tài khoản chủ nhà?{" "}
            <Link to="/register">Đăng ký ngay</Link>
          </p>
          <Link to="/forgot-password">Quên mật khẩu?</Link>
          <br />
          <Link to="/login">
            <Home size={16} style={{ marginRight: '0.5rem' }} />
            Đăng nhập người dùng thường
          </Link>
          <br />
          <Link to="/">
            <Home size={16} style={{ marginRight: '0.5rem' }} />
            Quay về trang chủ
          </Link>
        </FooterLinks>
      </LoginCard>
    </LoginContainer>
  );
};

export default HostLogin;
