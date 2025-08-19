import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MessageCircle } from 'lucide-react';
import chatApi from '../../api/chatApi';
import { useAuth } from '../../hooks/useAuth';

const BadgeContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Badge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 20px;
  border: 2px solid white;
  
  ${props => !props.show && `
    display: none;
  `}
`;

const ChatNotificationBadge = ({ children, className }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Polling để cập nhật mỗi 30 giây
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      setLoading(true);
      const response = await chatApi.getUnreadMessageCount();
      if (response.code === '00') {
        setUnreadCount(response.data || 0);
      }
    } catch (error) {
      console.error('Error fetching unread message count:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return children;
  }

  return (
    <BadgeContainer className={className}>
      {children}
      <Badge show={unreadCount > 0}>
        {unreadCount > 99 ? '99+' : unreadCount}
      </Badge>
    </BadgeContainer>
  );
};

export default ChatNotificationBadge;
