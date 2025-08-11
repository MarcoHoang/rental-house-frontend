import React, { useState } from 'react';
import styled from 'styled-components';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import authService from '../../api/authService';
import { useToast } from './Toast';
import ConfirmModal from './ConfirmModal';

const ChangePasswordContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #1f2937;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 0.875rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
  
  span {
    color: #ef4444;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  background: #f9fafb;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  width: 1.25rem;
  height: 1.25rem;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.2s;
  
  &:hover {
    color: #6b7280;
  }
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #2563eb;
  }
  
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  background: ${props => {
    if (props.strength === 'weak') return '#fef2f2';
    if (props.strength === 'medium') return '#fffbeb';
    if (props.strength === 'strong') return '#f0fdf4';
    return '#f3f4f6';
  }};
  color: ${props => {
    if (props.strength === 'weak') return '#dc2626';
    if (props.strength === 'medium') return '#d97706';
    if (props.strength === 'strong') return '#16a34a';
    return '#6b7280';
  }};
  border: 1px solid ${props => {
    if (props.strength === 'weak') return '#fecaca';
    if (props.strength === 'medium') return '#fed7aa';
    if (props.strength === 'strong') return '#bbf7d0';
    return '#e5e7eb';
  }};
`;

const ChangePassword = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isValidatingOldPassword, setIsValidatingOldPassword] = useState(false);
  const { showSuccess, showError, showInfo } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation real-time cho mật khẩu cũ - Tạm thời bỏ qua để tránh lỗi
  const handleOldPasswordBlur = async (e) => {
    // Tạm thời bỏ qua validation real-time để tránh lỗi backend
    // Chỉ clear error khi user nhập
    const { value } = e.target;
    if (value && value.length > 0) {
      setErrors(prev => ({
        ...prev,
        oldPassword: ''
      }));
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    if (password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 'strong';
    return 'medium';
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 'weak': return 'Mật khẩu yếu';
      case 'medium': return 'Mật khẩu trung bình';
      case 'strong': return 'Mật khẩu mạnh';
      default: return '';
    }
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

  // Kiểm tra mật khẩu cũ có đúng không - Tạm thời bỏ qua
  const validateOldPassword = async () => {
    // Tạm thời return true để tránh lỗi backend
    // Backend sẽ tự validate khi gọi API changePassword
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Hiển thị modal xác nhận
    setShowConfirmModal(true);
    setIsSubmitting(false);
  };

  const handleConfirmChangePassword = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    showInfo('Thông báo', 'Đang xử lý đổi mật khẩu...');
    
    try {
      // Lấy user ID từ localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('ChangePassword - User from localStorage:', user);
      
      if (!user || !user.id) {
        throw new Error('Không tìm thấy thông tin user. Vui lòng đăng nhập lại.');
      }

      // Kiểm tra độ dài mật khẩu mới (backend cũng validate nhưng check trước để UX tốt hơn)
      if (formData.newPassword.length < 6 || formData.newPassword.length > 20) {
        setErrors(prev => ({
          ...prev,
          newPassword: 'Mật khẩu phải từ 6-20 ký tự'
        }));
        showError('Lỗi', 'Mật khẩu phải từ 6-20 ký tự');
        return;
      }
      
      console.log('ChangePassword - Calling changePassword with:', {
        userId: user.id,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      
      await authService.changePassword(
        user.id,
        formData.oldPassword,
        formData.newPassword,
        formData.confirmPassword
      );

      console.log('ChangePassword - Password changed successfully');
      showSuccess('Thành công', 'Đổi mật khẩu thành công! Bạn có thể đăng nhập lại với mật khẩu mới.');
      
      // Reset form
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Gọi callback thành công để đóng modal
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('ChangePassword error:', error);
      
      let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại';
      
      // Xử lý lỗi từ backend
      if (error.response?.status === 400) {
        // Backend trả về lỗi validation
        const backendMessage = error.response?.data?.message || '';
        const backendCode = error.response?.data?.code || '';
        
        console.log('ChangePassword - Backend error message:', backendMessage);
        console.log('ChangePassword - Backend error code:', backendCode);
        
        if (backendCode === 'INVALID_PASSWORD' || 
            backendMessage.includes('INVALID_PASSWORD') || 
            backendMessage.includes('mật khẩu hiện tại') || 
            backendMessage.includes('old password')) {
          setErrors(prev => ({
            ...prev,
            oldPassword: 'Mật khẩu hiện tại không đúng'
          }));
          errorMessage = 'Mật khẩu hiện tại không đúng';
        } else if (backendCode === 'PASSWORD_CONFIRMATION_MISMATCH' || 
                   backendMessage.includes('PASSWORD_CONFIRMATION_MISMATCH') ||
                   backendMessage.includes('xác nhận') ||
                   backendMessage.includes('confirmation')) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: 'Mật khẩu xác nhận không khớp'
          }));
          errorMessage = 'Mật khẩu xác nhận không khớp';
        } else if (backendCode === 'DUPLICATE_OLD_PASSWORD' || 
                   backendMessage.includes('DUPLICATE_OLD_PASSWORD') ||
                   backendMessage.includes('trùng với mật khẩu cũ') ||
                   backendMessage.includes('same as old password')) {
          setErrors(prev => ({
            ...prev,
            newPassword: 'Mật khẩu mới không được trùng với mật khẩu cũ'
          }));
          errorMessage = 'Mật khẩu mới không được trùng với mật khẩu cũ';
        } else if (backendMessage.includes('validation') || 
                   backendMessage.includes('Size') ||
                   backendMessage.includes('NotBlank')) {
          // Lỗi validation từ backend
          if (backendMessage.includes('newPassword') || backendMessage.includes('mật khẩu mới')) {
            setErrors(prev => ({
              ...prev,
              newPassword: 'Mật khẩu mới không hợp lệ'
            }));
            errorMessage = 'Mật khẩu mới không hợp lệ';
          } else if (backendMessage.includes('oldPassword') || backendMessage.includes('mật khẩu hiện tại')) {
            setErrors(prev => ({
              ...prev,
              oldPassword: 'Mật khẩu hiện tại không hợp lệ'
            }));
            errorMessage = 'Mật khẩu hiện tại không hợp lệ';
          } else {
            errorMessage = backendMessage;
          }
        } else {
          errorMessage = backendMessage || 'Có lỗi xảy ra khi đổi mật khẩu';
        }
      } else if (error.response?.status === 403) {
        errorMessage = 'Bạn không có quyền thực hiện hành động này';
      } else if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy thông tin người dùng';
      } else if (error.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = 'Kết nối bị timeout. Vui lòng thử lại.';
      } else if (!error.response) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      }
      
      // Ưu tiên message từ backend nếu có
      if (error.response?.data?.message && !errorMessage.includes('Mật khẩu hiện tại') && !errorMessage.includes('xác nhận')) {
        errorMessage = error.response.data.message;
      } else if (error.message && !errorMessage.includes('Mật khẩu hiện tại') && !errorMessage.includes('xác nhận')) {
        errorMessage = error.message;
      }
      
      showError('Lỗi', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = validatePassword(formData.newPassword);

  return (
    <ChangePasswordContainer>
      <Title>
        <Shield size={24} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
        Đổi mật khẩu
      </Title>
      <Subtitle>
        Vui lòng nhập mật khẩu hiện tại và mật khẩu mới để thay đổi. 
        Hệ thống sẽ kiểm tra tính hợp lệ và xác nhận mật khẩu khi bạn nhấn "Đổi mật khẩu".
      </Subtitle>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="oldPassword">
            Mật khẩu hiện tại <span>*</span>
          </Label>
          <InputWrapper>
            <IconWrapper>
              <Lock size={20} />
            </IconWrapper>
            <Input
              type={showOldPassword ? "text" : "password"}
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              onBlur={handleOldPasswordBlur}
              placeholder="Nhập mật khẩu hiện tại"
              required
            />
            <ToggleButton
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </ToggleButton>
          </InputWrapper>
          {errors.oldPassword && <ErrorText>{errors.oldPassword}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="newPassword">
            Mật khẩu mới <span>*</span>
          </Label>
          <InputWrapper>
            <IconWrapper>
              <Lock size={20} />
            </IconWrapper>
            <Input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              minLength={6}
              required
            />
            <ToggleButton
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </ToggleButton>
          </InputWrapper>
          {errors.newPassword && <ErrorText>{errors.newPassword}</ErrorText>}
          {formData.newPassword && (
            <PasswordStrength strength={passwordStrength}>
              {getPasswordStrengthText(passwordStrength)}
            </PasswordStrength>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="confirmPassword">
            Xác nhận mật khẩu mới <span>*</span>
          </Label>
          <InputWrapper>
            <IconWrapper>
              <Lock size={20} />
            </IconWrapper>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu mới"
              minLength={6}
              required
            />
            <ToggleButton
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </ToggleButton>
          </InputWrapper>
          {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
        </FormGroup>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button
            type="submit"
            disabled={isSubmitting}
            style={{ flex: 1 }}
          >
            {isSubmitting ? (
              <>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  border: '2px solid #ffffff', 
                  borderTop: '2px solid transparent', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px'
                }} />
                Đang xử lý...
              </>
            ) : (
              'Đổi mật khẩu'
            )}
          </Button>
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              style={{ 
                flex: 1, 
                backgroundColor: '#6b7280',
                ':hover': { backgroundColor: '#4b5563' }
              }}
            >
              Hủy
            </Button>
          )}
        </div>
      </Form>
      
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Xác nhận đổi mật khẩu"
        message="Bạn có chắc chắn muốn đổi mật khẩu? Mật khẩu mới sẽ có hiệu lực ngay lập tức."
        type="warning"
        onConfirm={handleConfirmChangePassword}
        onCancel={() => setShowConfirmModal(false)}
        confirmText="Đổi mật khẩu"
        cancelText="Hủy"
      />
    </ChangePasswordContainer>
  );
};

export default ChangePassword;
