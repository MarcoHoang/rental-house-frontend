import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { LogIn, Mail, Lock, Home, CheckCircle, Building2 } from "lucide-react";
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
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
  gap: 1.25rem;
`;

const FooterLinks = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;

  p {
    margin: 0 0 1rem 0;
    color: #718096;
    font-size: 0.875rem;
  }

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

const Login = () => {
  const { login, loading, error } = useAuth();
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

    const result = await login(formData.email, formData.password);

    if (result.success) {
      showSuccess(
        "Đăng nhập thành công!",
        `Chào mừng bạn quay trở lại, ${
          result.data?.user?.fullName || "Người dùng"
        }!`
      );
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <div className="icon-wrapper">
            <LogIn color="white" size={32} />
          </div>
          <h1>Đăng nhập tài khoản</h1>
          <p>Chào mừng bạn quay trở lại!</p>
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

          <Button type="submit" fullWidth loading={loading} disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </Form>

        <FooterLinks>
          <p>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
          <Link to="/forgot-password">Quên mật khẩu?</Link>
          <br />
          <Link to="/">
            <Home size={16} style={{ marginRight: "0.5rem" }} />
            Quay về trang chủ
          </Link>
        </FooterLinks>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
