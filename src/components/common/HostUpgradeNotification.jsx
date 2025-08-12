import React from 'react';
import styled from 'styled-components';
import { CheckCircle, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationContainer = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;

  .icon {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
  }
`;

const NotificationContent = styled.div`
  margin-bottom: 1rem;

  p {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 0.75rem;

  .action-button {
    flex: 1;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background-color 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  .dismiss-button {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const HostUpgradeNotification = ({ onDismiss }) => {
  return (
    <NotificationContainer>
      <NotificationHeader>
        <div className="icon">
          <CheckCircle size={20} />
        </div>
        <h3>Tài khoản đã được nâng cấp!</h3>
      </NotificationHeader>

      <NotificationContent>
        <p>
          Chúc mừng! Tài khoản của bạn đã được phê duyệt làm chủ nhà. 
          Bây giờ bạn có thể đăng tin cho thuê và quản lý tài sản của mình.
        </p>
      </NotificationContent>

      <NotificationActions>
        <Link to="/host" className="action-button">
          <Building2 size={16} />
          Vào trang chủ nhà
          <ArrowRight size={16} />
        </Link>
        <button className="dismiss-button" onClick={onDismiss}>
          ✕
        </button>
      </NotificationActions>
    </NotificationContainer>
  );
};

export default HostUpgradeNotification;
