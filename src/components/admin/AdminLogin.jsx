import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";
import LoadingSpinner from "../common/LoadingSpinner";
import { adminAuth } from "../../api/adminApi";
import { jwtDecode } from "jwt-decode";

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

const FormGroup = styled.div`
  position: relative;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #4a5568;
    font-size: 0.875rem;
  }

  .input-wrapper {
    position: relative;

    input {
      width: 100%;
      padding: 0.875rem 1rem 0.875rem 2.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.2s;
      background: #f7fafc;

      &:focus {
        outline: none;
        border-color: #3182ce;
        background: white;
        box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
      }

      &::placeholder {
        color: #a0aec0;
      }
    }

    .input-icon {
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      color: #a0aec0;
      width: 1.25rem;
      height: 1.25rem;
    }

    .toggle-password {
      position: absolute;
      right: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      color: #a0aec0;
      cursor: pointer;
      width: 1.25rem;
      height: 1.25rem;
      transition: color 0.2s;
      background: none;
      border: none;
      padding: 0;

      &:hover {
        color: #4a5568;
      }
    }
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #3182ce, #667eea);
  color: white;
  padding: 0.875rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 3rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #742a2a;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  text-align: center;
  border-left: 4px solid #e53e3e;
  margin-bottom: 1rem;
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
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await adminAuth.login(formData);
      const responseData = response.data?.data;
      const token = responseData?.token;

      if (!token) {
        throw new Error("Không nhận được token từ server.");
      }

      const decoded = jwtDecode(token);

      const roleFromToken = decoded?.role?.replace("ROLE_", "") || ""; // lấy từ claim 'role' đã được backend thêm

      if (roleFromToken !== "ADMIN") {
        throw new Error("Bạn không có quyền truy cập Admin.");
      }

      const adminUser = {
        id: decoded?.id || "",
        email: decoded?.sub || "",
        role: roleFromToken,
      };

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(adminUser));

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
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {/* ... (Phần còn lại của JSX giữ nguyên không đổi) ... */}
          <FormGroup>
            <label htmlFor="email">Email Admin</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="admin@renthouse.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </FormGroup>

          <FormGroup>
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Nhập mật khẩu admin"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập Admin"
            )}
          </SubmitButton>
        </Form>
        <BackToHome>
          <a href="/">← Quay về trang chủ</a>
        </BackToHome>
      </LoginCard>
    </LoginContainer>
  );
};

export default AdminLogin;
