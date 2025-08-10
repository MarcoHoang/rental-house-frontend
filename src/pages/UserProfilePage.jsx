import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import  authService  from '../api/authService';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  
  span {
    color: #ef4444;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 1px #4f46e5;
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1.5rem;
  border: 2px solid #e5e7eb;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  padding: 0.5rem 1rem;
  background-color: #e5e7eb;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #d1d5db;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #4338ca;
  }
  
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    avatar: null,
    avatarPreview: '/default-avatar.png'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  // Lấy thông tin user khi component mount
  useEffect(() => {
    console.log('UserProfilePage mounted or updated');
    let isMounted = true;
    
    const fetchUserProfile = async () => {
      console.log('Starting to fetch user profile...');
      if (!isMounted) return;
      
      setIsSubmitting(true);
      try {
        // Kiểm tra token trước khi gọi API
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login', { 
            state: { 
              from: '/profile',
              error: 'Vui lòng đăng nhập để tiếp tục'
            },
            replace: true 
          });
          return;
        }

        const userData = await authService.getCurrentUser();
        console.log('Received user data:', userData);
        
        if (!isMounted) {
          console.log('Component unmounted, skipping state update');
          return;
        }
        
        // Cập nhật state với dữ liệu người dùng
        setUser(userData);
        setUserId(userData.id);
        
        setProfile(prev => ({
          ...prev,
          email: userData.email || '',
          fullName: userData.fullName || '',
          phone: userData.phone || '',
          address: userData.address || '',
          dateOfBirth: userData.dateOfBirth || '',
          avatar: userData.avatar,
          avatarPreview: userData.avatar || '/default-avatar.png'
        }));
        
      } catch (error) {
        if (!isMounted) return;
        
        if (error.response?.status === 401) {
          // Chuyển hướng về trang đăng nhập nếu chưa đăng nhập
          navigate('/login', { 
            state: { 
              from: '/profile',
              error: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại' 
            },
            replace: true 
          });
        } else {
          setMessage({
            text: 'Không thể tải thông tin người dùng',
            type: 'error'
          });
        }
      } finally {
        if (isMounted) {
          setIsSubmitting(false);
        }
      }
    };

    fetchUserProfile();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Hàm xử lý quay lại trang trước
  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  // Cập nhật thông tin profile khi user thay đổi
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        email: user.email || '',
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth || '',
        avatarPreview: user.avatar || '/default-avatar.png'
      }));
    } else {
      // Nếu không có thông tin user, chuyển hướng về trang đăng nhập
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra loại file
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ text: "Chỉ chấp nhận file JPG hoặc PNG", type: "error" });
      return;
    }

    // Kiểm tra dung lượng file (tối đa 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ text: "Kích thước ảnh tối đa 5MB", type: "error" });
      return;
    }

    // Tạo URL tạm để hiển thị preview
    const previewUrl = URL.createObjectURL(file);
    setProfile(prev => ({
      ...prev,
      avatar: file,
      avatarPreview: previewUrl
    }));
  };


  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!profile.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
      isValid = false;
    } else if (!/^[\p{L}\s]+$/u.test(profile.fullName)) {
      newErrors.fullName = 'Họ và tên không được chứa ký tự đặc biệt';
      isValid = false;
    }

    if (!profile.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
      isValid = false;
    } else if (!/^0\d{9,10}$/.test(profile.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
      isValid = false;
    }

    if (profile.address && !/^[\p{L}0-9\s,./-]+$/u.test(profile.address)) {
      newErrors.address = 'Địa chỉ chứa ký tự không hợp lệ';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !userId) {
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      // Chuẩn bị dữ liệu gửi đi
      const userData = {
        fullName: profile.fullName,
        phone: profile.phone,
        address: profile.address || null,
        dateOfBirth: profile.dateOfBirth || null,
        avatar: typeof profile.avatar === 'string' ? profile.avatar : null
      };

      // Gọi API cập nhật profile
      const updatedUser = await authService.updateProfile(userId, userData);
      
      // Nếu updatedUser là null, có thể đã xảy ra lỗi 401 và đã xử lý redirect
      if (!updatedUser) {
        return;
      }

      // Cập nhật thông tin trong localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newUserData = { ...currentUser, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUserData));
      
      setUser(newUserData);
      setMessage({
        text: 'Cập nhật thông tin thành công!',
        type: 'success'
      });

      // Cập nhật lại giao diện
      window.dispatchEvent(new Event('storage'));

    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      // Chỉ hiển thị thông báo nếu không phải lỗi 401 (đã xử lý trong authService)
      if (error.response?.status !== 401) {
        setMessage({
          text: error.message || 'Có lỗi xảy ra khi cập nhật thông tin',
          type: 'error'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProfileContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Hồ sơ cá nhân</h1>
        <button 
          onClick={handleGoBack}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#e5e7eb',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d1d5db'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Quay lại
        </button>
      </div>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Ảnh đại diện</Label>
          <AvatarContainer>
            <Avatar 
              src={profile.avatarPreview} 
              alt="Avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
            <div>
              <FileInput
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <FileLabel htmlFor="avatar">Chọn ảnh</FileLabel>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                Định dạng: JPG, PNG. Kích thước tối đa: 5MB
              </p>
            </div>
          </AvatarContainer>
        </FormGroup>

        <FormGroup>
          <Label>Email</Label>
          <Input 
            type="email" 
            name="email" 
            value={profile.email}
            disabled
            placeholder="Email"
            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Họ và tên <span>*</span></Label>
          <Input 
            type="text" 
            name="fullName" 
            value={profile.fullName} 
            onChange={handleChange}
            placeholder="Nhập họ và tên"
          />
          {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
        </FormGroup>
        
        <FormGroup>
          <Label>Ngày sinh</Label>
          <Input 
            type="date" 
            name="dateOfBirth"
            value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : ''}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">Số điện thoại <span>*</span></Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
          />
          {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="address">Địa chỉ</Label>
          <Input
            type="text"
            id="address"
            name="address"
            value={profile.address || ''}
            onChange={handleChange}
            placeholder="Nhập địa chỉ"
          />
          {errors.address && <ErrorText>{errors.address}</ErrorText>}
        </FormGroup>

        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </form>
    </ProfileContainer>
  );
};

export default UserProfilePage;
