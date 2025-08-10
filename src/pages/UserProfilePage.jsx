import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { User, Mail, Phone, MapPin, Calendar, Camera, ArrowLeft, Save } from 'lucide-react';
import authService from '../api/authService';
import { useAuth } from '../hooks/useAuth';
import { useForm, validationRules } from '../hooks/useForm';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;

  h1 {
    margin: 0;
    color: #1f2937;
    font-size: 1.875rem;
    font-weight: 600;
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1.5rem;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const AvatarUpload = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  
  &:hover {
    background-color: #e5e7eb;
    border-color: #9ca3af;
  }
`;

const FormSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const UserProfilePage = () => {
  const { user, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  
  const [avatarPreview, setAvatarPreview] = useState('/default-avatar.png');
  const [avatarFile, setAvatarFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const { formData, errors, handleChange, handleBlur, validateForm, setFormDataWithErrors } = useForm(
    {
    email: '',
    fullName: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    },
    {
      email: validationRules.email,
      fullName: validationRules.fullName,
      phone: validationRules.phone,
    }
  );

  // Load user data when component mounts
  useEffect(() => {
    console.log('UserProfilePage.useEffect - User data:', user);
    
    if (user && user.id) {
      console.log('UserProfilePage.useEffect - Setting form data with user:', user);
      
      // Convert birthDate (backend) to dateOfBirth (frontend) format
      let dateOfBirth = '';
      if (user.birthDate) {
        // Backend trả về LocalDate, convert to YYYY-MM-DD format cho input type="date"
        if (typeof user.birthDate === 'string') {
          dateOfBirth = user.birthDate;
        } else if (user.birthDate instanceof Date) {
          dateOfBirth = user.birthDate.toISOString().split('T')[0];
        }
      }
      
      setFormDataWithErrors({
        email: user.email || '',
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: dateOfBirth,
      });
      setAvatarPreview(user.avatarUrl || '/default-avatar.png');
    } else {
      console.log('UserProfilePage.useEffect - No user data available or missing ID');
    }
  }, [user, setFormDataWithErrors]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh hợp lệ');
      return;
    }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
      return;
    }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    if (!validateForm()) {
      return;
    }

    // Kiểm tra user và user.id
    if (!user) {
      setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    if (!user.id) {
      setError('ID người dùng không hợp lệ. Vui lòng đăng nhập lại.');
        return;
      }

    try {
      console.log('UserProfilePage.handleSubmit - Starting profile update');
      console.log('UserProfilePage.handleSubmit - User ID:', user.id);
      console.log('UserProfilePage.handleSubmit - User object:', user);
      console.log('UserProfilePage.handleSubmit - Form data:', formData);

      const profileData = {
        ...formData,
        avatarUrl: avatarPreview // For now, just pass the preview URL
      };

      console.log('UserProfilePage.handleSubmit - Profile data to send:', profileData);

      const result = await updateProfile(user.id, profileData);
      
      console.log('UserProfilePage.handleSubmit - Update result:', result);
      
      if (result.success) {
        setSuccessMessage(result.message || 'Cập nhật thông tin thành công!');
        
        // TODO: Handle avatar upload separately if needed
        if (avatarFile) {
          // Upload avatar file to server
          // const uploadResult = await uploadAvatar(avatarFile);
          // if (uploadResult.success) {
          //   setAvatarPreview(uploadResult.avatarUrl);
          // }
        }
      } else {
        setError(result.message || 'Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch (error) {
      console.error('UserProfilePage.handleSubmit - Error updating profile:', error);
      
      // Xử lý error message
      let errorMessage = 'Có lỗi xảy ra khi cập nhật thông tin';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!user) {
  return (
    <ProfileContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Đang tải thông tin người dùng...</p>
      </div>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <User size={24} style={{ marginRight: '0.5rem' }} />
        <h1>Thông tin cá nhân</h1>
      </ProfileHeader>

      {error && <ErrorMessage type="error" message={error} />}
      {successMessage && <ErrorMessage type="success" message={successMessage} />}
      
      <form onSubmit={handleSubmit}>
          <AvatarContainer>
          <Avatar src={avatarPreview} alt="Avatar" />
          <AvatarUpload>
              <FileInput
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            <FileLabel htmlFor="avatar">
              <Camera size={16} />
              Thay đổi ảnh đại diện
            </FileLabel>
            <small style={{ color: '#6b7280', fontSize: '0.75rem' }}>
              Hỗ trợ: JPG, PNG, GIF. Tối đa 5MB
            </small>
          </AvatarUpload>
          </AvatarContainer>

        <FormSection>
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
            disabled
          />

          <FormField
            label="Họ và tên"
            name="fullName"
            type="text" 
            placeholder="Nhập họ và tên"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.fullName}
            required
            icon={User}
          />

          <FormField
            label="Số điện thoại"
            name="phone"
            type="tel"
            placeholder="Nhập số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.phone}
            required
            icon={Phone}
          />

          <FormField
            label="Ngày sinh"
            name="dateOfBirth"
            type="date"
            placeholder="Chọn ngày sinh"
            value={formData.dateOfBirth}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.dateOfBirth}
            icon={Calendar}
          />

          <FormField
            label="Địa chỉ"
            name="address"
            type="text"
            placeholder="Nhập địa chỉ"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.address}
            icon={MapPin}
          />
        </FormSection>

        <ButtonGroup>
          <Button
            type="button"
            variant="secondary"
            onClick={handleGoBack}
            icon={ArrowLeft}
          >
            Quay lại
          </Button>

        <Button 
          type="submit" 
            variant="primary"
            loading={loading}
            disabled={loading}
            icon={Save}
        >
            {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
        </Button>
        </ButtonGroup>
      </form>
    </ProfileContainer>
  );
};

export default UserProfilePage;
