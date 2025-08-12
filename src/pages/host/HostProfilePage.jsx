import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera, 
  Save, 
  ArrowLeft,
  Building2,
  Shield
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useForm, validationRules } from '../../hooks/useForm';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem;
`;

const ProfileCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  position: relative;

  .back-button {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    padding: 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  .host-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 500;
    margin-top: 1rem;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin: 0 0 0.5rem 0;
  }

  p {
    font-size: 1.125rem;
    margin: 0;
    opacity: 0.9;
  }
`;

const AvatarSection = styled.div`
  text-align: center;
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;

  .avatar-container {
    position: relative;
    display: inline-block;
    margin-bottom: 1rem;
  }

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #e2e8f0;
  }

  .avatar-upload {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #1e40af;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;

    &:hover {
      background: #1e3a8a;
    }
  }

  .avatar-input {
    display: none;
  }
`;

const ProfileForm = styled.form`
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  grid-column: 1 / -1;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
  margin-top: 1rem;

  h3 {
    color: #1a202c;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ActionButtons = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HostProfilePage = () => {
  const { user, updateProfile, loading, error } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const { formData, errors, handleChange, handleBlur, validateForm, setFormData } = useForm(
    {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      dateOfBirth: user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
    },
    {
      fullName: validationRules.required,
      email: validationRules.email,
      phone: validationRules.phone,
      address: validationRules.required,
    }
  );

  // Cập nhật form data khi user thay đổi
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
      });
      setAvatarPreview(user.avatarUrl);
    }
  }, [user, setFormData]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const profileData = {
        ...formData,
        avatarUrl: user?.avatarUrl, // Giữ nguyên avatar cũ nếu không upload mới
      };

      const result = await updateProfile(user.id, profileData);
      
      if (result.success) {
        showSuccess('Cập nhật thành công!', 'Thông tin profile đã được cập nhật.');
      }
    } catch (err) {
      showError('Cập nhật thất bại!', err.message || 'Có lỗi xảy ra khi cập nhật profile.');
    }
  };

  const handleBack = () => {
    navigate('/host');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <h1>Thông tin chủ nhà</h1>
          <p>Quản lý thông tin cá nhân và tài khoản của bạn</p>
          <div className="host-badge">
            <Building2 size={16} />
            Chủ nhà
          </div>
        </ProfileHeader>

        <AvatarSection>
          <div className="avatar-container">
            <img
              src={avatarPreview || '/default-avatar.png'}
              alt="Avatar"
              className="avatar"
            />
            <label className="avatar-upload">
              <Camera size={20} />
              <input
                type="file"
                className="avatar-input"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <p>Nhấp vào biểu tượng camera để thay đổi ảnh đại diện</p>
        </AvatarSection>

        <ProfileForm onSubmit={handleSubmit}>
          <FormSection>
            <h3>
              <User size={20} />
              Thông tin cá nhân
            </h3>
          </FormSection>

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
            label="Email"
            name="email"
            type="email"
            placeholder="Nhập địa chỉ email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            required
            icon={Mail}
            disabled
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
            label="Địa chỉ"
            name="address"
            type="text"
            placeholder="Nhập địa chỉ"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.address}
            required
            icon={MapPin}
          />

          <FormField
            label="Ngày sinh"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.dateOfBirth}
            icon={Calendar}
          />

          <FormSection>
            <h3>
              <Shield size={20} />
              Thông tin tài khoản
            </h3>
            <p style={{ color: '#718096', marginBottom: '1rem' }}>
              Email: {user.email} (không thể thay đổi)
            </p>
            <p style={{ color: '#718096' }}>
              Vai trò: Chủ nhà (đã được phê duyệt)
            </p>
          </FormSection>

          {error && <ErrorMessage type="error" message={error} />}

          <ActionButtons>
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              <Save size={16} style={{ marginRight: '0.5rem' }} />
              {loading ? 'Đang cập nhật...' : 'Cập nhật profile'}
            </Button>
          </ActionButtons>
        </ProfileForm>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default HostProfilePage;
