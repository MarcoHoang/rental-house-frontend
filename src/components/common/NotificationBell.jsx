import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Bell } from 'lucide-react';
import { getMyNotifications } from '../../api/notificationApi';
import NotificationListComponent from './NotificationList';
import { useToast } from './Toast';

const NotificationBellContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const BellButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  color: #6b7280;
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  border: 2px solid white;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }
`;

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0);
  const { showInfo } = useToast();

  useEffect(() => {
    fetchNotifications();
    // Polling để cập nhật notification mỗi 10 giây
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      console.log('NotificationBell.fetchNotifications - Response data:', data);
      setNotifications(data || []);
      const unread = data?.filter(notif => !notif.isRead).length || 0;
      
      // Kiểm tra nếu có notification mới
      if (unread > previousUnreadCount && previousUnreadCount > 0) {
        const newNotifications = data?.filter(notif => !notif.isRead && 
          new Date(notif.createdAt).getTime() > Date.now() - 60000); // Trong 1 phút gần đây
        
        if (newNotifications && newNotifications.length > 0) {
          const latestNotification = newNotifications[0];
          showInfo('Thông báo mới', latestNotification.content);
        }
      }
      
      setPreviousUnreadCount(unread);
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications(); // Refresh notifications when opening
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <NotificationBellContainer>
      <BellButton onClick={handleBellClick}>
        <Bell />
        {unreadCount > 0 && (
          <NotificationBadge>
            {unreadCount > 99 ? '99+' : unreadCount}
          </NotificationBadge>
        )}
      </BellButton>
      
      <NotificationListComponent 
        isOpen={isOpen}
        onClose={handleClose}
      />
    </NotificationBellContainer>
  );
};

export default NotificationBell; 