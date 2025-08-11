import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { UserPlus, User, Phone, Mail, Lock, Eye, EyeOff, MapPin } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useForm, validationRules } from "../../hooks/useForm";
import FormField from "../common/FormField";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { useToast } from "../common/Toast";

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
`;

const RegisterCard = styled.div`
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

const RegisterHeader = styled.div`
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
    margin: 0;
    color: #718096;
    font-size: 0.875rem;
  }

  a {
    color: #3182ce;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
      color: #2c5aa0;
      text-decoration: underline;
    }
  }
`;

const Register = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { formData, errors, handleChange, handleBlur, validateForm } = useForm(
    {
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      username: "",
      address: "",
    },
    {
      email: validationRules.email,
      phone: validationRules.phone,
      password: validationRules.password,
      confirmPassword: validationRules.confirmPassword,
      username: validationRules.username,
      address: validationRules.address,
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const userData = {
      email: formData.email,
      password: formData.password,
      username: formData.username,
      phone: formData.phone || undefined,
      address: formData.address || undefined
    };
    
    console.log('=== DEBUG REGISTER FORM DATA ===');
    console.log('Register.handleSubmit - formData.username (tên người dùng từ form):', formData.username);
    console.log('Register.handleSubmit - formData.email (email từ form):', formData.email);
    console.log('Register.handleSubmit - userData.username (sẽ gửi đến authService):', userData.username);
    console.log('Register.handleSubmit - userData.email (sẽ gửi đến authService):', userData.email);
    console.log('Register.handleSubmit - userData object:', userData);
    console.log('=== END DEBUG ===');

    const result = await register(userData);
    
    if (result.success) {
      showSuccess(
        "Đăng ký thành công!",
        `Tài khoản của bạn đã được tạo thành công. Bạn sẽ được chuyển đến trang đăng nhập.`
      );
      
      // Chuyển hướng về trang đăng nhập sau 2 giây
      setTimeout(() => {
        navigate(`/login?email=${encodeURIComponent(formData.email)}`);
      }, 2000);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <div className="icon-wrapper">
            <UserPlus color="white" size={32} />
          </div>
          <h1>Đăng ký tài khoản</h1>
          <p>Tạo tài khoản mới để bắt đầu</p>
        </RegisterHeader>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage type="error" message={error} />}

          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="Nhập email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            required
            icon={Mail}
          />

          <FormField
            label="Số điện thoại"
            name="phone"
            type="tel"
            placeholder="Nhập số điện thoại (9-12 số)"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.phone}
            required
            icon={Phone}
            inputMode="numeric"
          />

          <FormField
            label="Tên người dùng"
            name="username"
            type="text"
            placeholder="Nhập tên người dùng"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.username}
            required
            icon={User}
            maxLength={100}
          />

          <FormField
            label="Địa chỉ (tùy chọn)"
            name="address"
            type="text"
            placeholder="Nhập địa chỉ"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.address}
            icon={MapPin}
          />

          <FormField
            label="Mật khẩu"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu (6-32 ký tự)"
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

          <FormField
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.confirmPassword}
            required
            icon={Lock}
            showToggle={true}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            toggleIcon={showConfirmPassword ? EyeOff : Eye}
          />

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </Form>

        <FooterLinks>
          <p>
            Đã có tài khoản?{' '}
            <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </FooterLinks>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
