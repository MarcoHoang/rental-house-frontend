import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ChangePassword from '../components/common/ChangePassword';
import { useAuth } from '../hooks/useAuth';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
`;

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Kiểm tra xem user đã đăng nhập chưa
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSuccess = () => {
    // Có thể chuyển hướng về trang profile hoặc trang chủ
    navigate('/profile');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <PageContainer>
      <BackButton onClick={() => navigate('/profile')}>
        ← Quay lại
      </BackButton>
      
      <ChangePassword 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </PageContainer>
  );
};

export default ChangePasswordPage;
