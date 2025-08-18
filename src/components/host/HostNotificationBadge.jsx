import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Bell } from 'lucide-react';
import rentalApi from '../../api/rentalApi';
import { useAuthContext } from '../../contexts/AuthContext';

const BadgeContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const NotificationIcon = styled.div`
  position: relative;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  color: #6b7280;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

const Badge = styled.div`
  position: ${props => props.$isInline ? 'static' : 'absolute'};
  top: ${props => props.$isInline ? 'auto' : '-2px'};
  right: ${props => props.$isInline ? 'auto' : '-2px'};
  background: #ef4444;
  color: white;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0 0.25rem;
  animation: ${props => props.$hasNew ? 'pulse 2s infinite' : 'none'};

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

const HostNotificationBadge = ({ onClick, isInline = false, hideWhenViewed = false }) => {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user?.id) {
      fetchPendingCount();
    }
  }, [user?.id]);

  // Reset hasViewed when pendingCount changes (new notifications)
  useEffect(() => {
    if (pendingCount > 0 && hasViewed) {
      setHasViewed(false);
    }
  }, [pendingCount]);

  const fetchPendingCount = async () => {
    try {
      setLoading(true);
      const response = await rentalApi.getHostPendingRequestsCount(user.id);
      setPendingCount(response.data || 0);
    } catch (error) {
      console.error('Error fetching pending count:', error);
      setPendingCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (hideWhenViewed) {
      setHasViewed(true);
    }
    if (onClick) {
      onClick();
    }
  };

  if (!user) return null;

  return (
    <BadgeContainer>
      <NotificationIcon onClick={handleClick}>
        <Bell size={20} />
        {pendingCount > 0 && !hasViewed && (
          <Badge $hasNew={pendingCount > 0} $isInline={isInline}>
            {pendingCount > 99 ? '99+' : pendingCount}
          </Badge>
        )}
      </NotificationIcon>
    </BadgeContainer>
  );
};

export default HostNotificationBadge;
