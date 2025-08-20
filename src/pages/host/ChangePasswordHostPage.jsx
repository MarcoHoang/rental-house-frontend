import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Save,
  ArrowLeft,
  User,
  Shield,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "../../components/common/Toast";
import hostApi from "../../api/hostApi";
import { getUserFromStorage } from "../../utils/localStorage";
import HostPageWrapper from "../../components/layout/HostPageWrapper";

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem;
`;

const ProfileCard = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
  position: relative;

  .back-button {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    font-weight: 500;
    
    &:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
  }
  
  .host-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.75rem 1.5rem;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 600;
    margin-top: 1.5rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0 0 0.75rem 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  p {
    font-size: 1.25rem;
    margin: 0;
    opacity: 0.95;
    font-weight: 500;
  }
`;

const ProfileForm = styled.form`
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 900px;
  margin: 0 auto;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActionButtons = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 2rem;
  margin-top: 1rem;
`;

const FormField = ({
  label,
  name,
  value,
  onChange,
  error,
  icon: Icon,
  required,
  type = "text",
  showToggle = false,
  onToggle,
  toggleIcon: ToggleIcon,
  ...props
}) => (
  <div style={{ gridColumn: name === "address" ? "1 / -1" : "auto" }}>
    <label style={{ display: "block", marginBottom: "0.5rem" }}>
      {label} {required && "*"}
    </label>
    <div style={{ position: "relative" }}>
      {Icon && (
        <Icon
          size={18}
          style={{
            position: "absolute",
            left: "0.75rem",
            top: "0.875rem",
            color: "#9ca3af",
            zIndex: 1,
          }}
        />
      )}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        {...props}
        style={{
          width: "100%",
          padding: "0.75rem",
          paddingLeft: Icon ? "2.5rem" : "0.75rem",
          paddingRight: showToggle ? "2.5rem" : "0.75rem",
          borderRadius: "0.5rem",
          border: "1px solid #d1d5db",
          fontSize: "1rem",
          transition: "all 0.3s ease",
        }}
        onFocus={(e) => {
          e.target.style.outline = "none";
          e.target.style.borderColor = "#667eea";
          e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#d1d5db";
          e.target.style.boxShadow = "none";
        }}
      />
      {showToggle && ToggleIcon && (
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "0.75rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.25rem",
            borderRadius: "0.25rem",
            color: "#6b7280",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "#374151";
            e.target.style.backgroundColor = "#f3f4f6";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#6b7280";
            e.target.style.backgroundColor = "transparent";
          }}
          title={type === "password" ? "Hiện mật khẩu" : "Ẩn mật khẩu"}
        >
          <ToggleIcon size={18} />
        </button>
      )}
    </div>
    {error && (
      <p style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem" }}>
        {error}
      </p>
    )}
  </div>
);

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: center;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ChangePasswordHostPage = () => {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (fieldName) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại';
      isValid = false;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
      isValid = false;
    } else if (formData.newPassword === formData.oldPassword) {
      newErrors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu cũ';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Lấy user ID từ localStorage sử dụng utility function
      const user = getUserFromStorage();
      console.log('ChangePasswordHostPage - User from localStorage:', user);
      
      // Debug: Kiểm tra dữ liệu localStorage trực tiếp
      const rawUserData = localStorage.getItem('user');
      console.log('ChangePasswordHostPage - Raw localStorage user data:', rawUserData);
      
      if (!user) {
        console.error('ChangePasswordHostPage - No user data found in localStorage');
        throw new Error('Không tìm thấy thông tin user. Vui lòng đăng nhập lại.');
      }
      
      if (!user.id) {
        console.error('ChangePasswordHostPage - User data missing ID field:', user);
        
        // Fallback: Thử lấy thông tin host từ API
        try {
          console.log('ChangePasswordHostPage - Trying to fetch host profile from API...');
          const hostProfile = await hostApi.getMyProfile();
          console.log('ChangePasswordHostPage - Host profile from API:', hostProfile);
          
          if (hostProfile && hostProfile.id) {
            console.log('ChangePasswordHostPage - Using host profile ID:', hostProfile.id);
            user.id = hostProfile.id;
          } else {
            throw new Error('Không thể lấy thông tin user từ server. Vui lòng đăng nhập lại.');
          }
        } catch (apiError) {
          console.error('ChangePasswordHostPage - Error fetching host profile:', apiError);
          throw new Error('Thông tin user không hợp lệ - thiếu ID. Vui lòng đăng nhập lại.');
        }
      }

      // Kiểm tra độ dài mật khẩu mới
      if (formData.newPassword.length < 6 || formData.newPassword.length > 20) {
        setErrors(prev => ({
          ...prev,
          newPassword: 'Mật khẩu phải từ 6-20 ký tự'
        }));
        showError('Lỗi', 'Mật khẩu phải từ 6-20 ký tự');
        return;
      }
      
      // Lấy userId trực tiếp từ localStorage, giống như user thường
      const userId = user.id;
      
      console.log('ChangePasswordHostPage - Current user from localStorage:', user);
      console.log('ChangePasswordHostPage - Final userId:', userId);
      console.log('ChangePasswordHostPage - Calling changePassword with:', {
        userId: userId,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      
      await hostApi.changePassword(
        userId,
        formData.oldPassword,
        formData.newPassword,
        formData.confirmPassword
      );

      console.log('ChangePasswordHostPage - Password changed successfully');
      showSuccess('Thành công!', 'Mật khẩu đã được thay đổi thành công.');
      
      // Reset form
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Quay lại trang profile
      navigate('/host/profile');
      
    } catch (error) {
      console.error('ChangePasswordHostPage error:', error);
      
      // Xử lý lỗi cụ thể
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.message) {
          showError('Lỗi', errorData.message);
        } else {
          showError('Lỗi', 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
        }
      } else if (error.message) {
        showError('Lỗi', error.message);
      } else {
        showError('Lỗi', 'Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HostPageWrapper 
      title="Đổi mật khẩu"
      subtitle="Bảo mật tài khoản của bạn"
      showBackButton={true}
      backUrl="/host/profile"
    >
      <div style={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
        padding: '1.5rem', 
        borderRadius: '1rem',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <Shield size={20} style={{ color: "#667eea" }} />
        <span style={{ color: "#4a5568", fontWeight: "500" }}>
          Bảo mật
        </span>
      </div>

        <ProfileForm onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: '1 / -1' }}>
            <div>
              <h3 style={{ 
                color: "#1a202c", 
                fontSize: "1.25rem", 
                fontWeight: "600", 
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <Lock size={20} /> Thông tin đổi mật khẩu
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <FormField
                  label="Mật khẩu hiện tại"
                  name="oldPassword"
                  type={showPasswords.oldPassword ? "text" : "password"}
                  value={formData.oldPassword}
                  onChange={handleChange}
                  required
                  icon={Lock}
                  error={errors.oldPassword}
                  showToggle={true}
                  onToggle={() => togglePasswordVisibility('oldPassword')}
                  toggleIcon={showPasswords.oldPassword ? EyeOff : Eye}
                />
                <FormField
                  label="Mật khẩu mới"
                  name="newPassword"
                  type={showPasswords.newPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  icon={Lock}
                  error={errors.newPassword}
                  showToggle={true}
                  onToggle={() => togglePasswordVisibility('newPassword')}
                  toggleIcon={showPasswords.newPassword ? EyeOff : Eye}
                />
                <FormField
                  label="Xác nhận mật khẩu mới"
                  name="confirmPassword"
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  icon={Lock}
                  error={errors.confirmPassword}
                  showToggle={true}
                  onToggle={() => togglePasswordVisibility('confirmPassword')}
                  toggleIcon={showPasswords.confirmPassword ? EyeOff : Eye}
                />
              </div>
            </div>

            <div>
              <h3 style={{ 
                color: "#1a202c", 
                fontSize: "1.25rem", 
                fontWeight: "600", 
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <Shield size={20} /> Lưu ý bảo mật
              </h3>
              <div style={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
                padding: '1.5rem', 
                borderRadius: '1rem',
                border: '1px solid #e2e8f0'
              }}>
                <p style={{ 
                  color: "#4a5568", 
                  fontSize: "1rem",
                  fontWeight: "500",
                  margin: "0 0 0.5rem 0"
                }}>
                  • Mật khẩu phải có ít nhất 6 ký tự
                </p>
                <p style={{ 
                  color: "#4a5568", 
                  fontSize: "1rem",
                  fontWeight: "500",
                  margin: "0 0 0.5rem 0"
                }}>
                  • Mật khẩu mới không được trùng với mật khẩu cũ
                </p>
                <p style={{ 
                  color: "#4a5568", 
                  fontSize: "1rem",
                  fontWeight: "500",
                  margin: "0"
                }}>
                  • Sau khi đổi mật khẩu, bạn sẽ cần đăng nhập lại
                </p>
              </div>
            </div>
          </div>

          <ActionButtons>
            <Button 
              type="button" 
              onClick={() => navigate("/host/profile")}
              style={{
                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                color: '#475569',
                border: '1px solid #cbd5e0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <ArrowLeft size={16} />
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}
            >
              <Save size={16} />
              {isSubmitting ? "Đang lưu..." : "Đổi mật khẩu"}
            </Button>
          </ActionButtons>
        </ProfileForm>
    </HostPageWrapper>
  );
};

export default ChangePasswordHostPage;
