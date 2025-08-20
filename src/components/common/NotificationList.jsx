import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Bell, X, Trash2, CheckCircle, AlertTriangle, Home, User, FileText, AlertCircle } from 'lucide-react';
import { getMyNotifications, markNotificationAsRead, deleteNotification } from '../../api/notificationApi';
import { useToast } from './Toast';

const NotificationContainer = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  max-height: 500px;
  overflow-y: auto;
  z-index: 1000;
  border: 1px solid #e2e8f0;
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    color: #6b7280;
    transition: all 0.2s;

    &:hover {
      background: #e5e7eb;
      color: #374151;
    }
  }
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;

  &:hover {
    background: #f8fafc;
  }

  ${props => !props.$isRead && `
    background: #eff6ff;
    border-left: 3px solid #3b82f6;
  `}

  .notification-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .notification-type {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .notification-time {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .notification-content {
    font-size: 0.875rem;
    color: #4b5563;
    line-height: 1.4;
    margin-bottom: 0.75rem;
  }

  .notification-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    transition: all 0.2s;

    &.mark-read {
      color: #059669;
      
      &:hover {
        background: #d1fae5;
      }
    }

    &.delete {
      color: #dc2626;
      
      &:hover {
        background: #fee2e2;
      }
    }
  }
`;

const EmptyState = styled.div`
  padding: 2rem 1.5rem;
  text-align: center;
  color: #6b7280;

  svg {
    width: 3rem;
    height: 3rem;
    margin: 0 auto 1rem;
    color: #d1d5db;
  }

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 500;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
  }
`;

const getNotificationIcon = (type) => {
  switch (type) {
    case 'HOUSE_DELETED':
      return <AlertCircle size={16} color="#ef4444" />;
    case 'RENTAL_REQUEST':
      return <CheckCircle size={16} color="#10b981" />;
    case 'RENTAL_CANCELED':
      return <AlertTriangle size={16} color="#f59e0b" />;
    case 'REVIEW_ONE_STAR':
      return <AlertTriangle size={16} color="#ef4444" />;
    case 'RENTAL_APPROVED':
    case 'RENTAL_REJECTED':
      return <FileText size={16} color="#8b5cf6" />;
    default:
      return <Bell size={16} color="#6b7280" />;
  }
};

const getNotificationTypeLabel = (type) => {
  switch (type) {
    case 'HOUSE_DELETED':
      return 'Nhà bị xóa';
    case 'RENTAL_REQUEST':
      return 'Đơn thuê mới';
    case 'RENTAL_CANCELED':
      return 'Đơn thuê bị hủy';
    case 'REVIEW_ONE_STAR':
      return 'Đánh giá 1 sao';
    case 'RENTAL_APPROVED':
      return 'Đơn thuê được duyệt';
    case 'RENTAL_REJECTED':
      return 'Đơn thuê bị từ chối';
    default:
      return 'Thông báo';
  }
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Vừa xong';
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
  return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
};

const NotificationListComponent = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getMyNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      showError('Lỗi', 'Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      showSuccess('Thành công', 'Đã đánh dấu thông báo đã đọc');
    } catch (error) {
      showError('Lỗi', 'Không thể đánh dấu thông báo đã đọc');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      showSuccess('Thành công', 'Đã xóa thông báo');
    } catch (error) {
      showError('Lỗi', 'Không thể xóa thông báo');
    }
  };

  if (!isOpen) return null;

  return (
    <NotificationContainer>
      <NotificationHeader>
        <h3>
          <Bell size={20} />
          Thông báo
        </h3>
        <button className="close-btn" onClick={onClose}>
          <X size={16} />
        </button>
      </NotificationHeader>

      <NotificationList>
        {loading ? (
          <EmptyState>
            <div>Đang tải...</div>
          </EmptyState>
        ) : notifications.length === 0 ? (
          <EmptyState>
            <Bell />
            <h4>Không có thông báo</h4>
            <p>Bạn chưa có thông báo nào</p>
          </EmptyState>
        ) : (
          notifications.map((notification) => (
            <NotificationItem key={notification.id} $isRead={notification.isRead}>
              <div className="notification-header">
                <div className="notification-type">
                  {getNotificationIcon(notification.type)}
                  {getNotificationTypeLabel(notification.type)}
                </div>
                <div className="notification-time">
                  {formatTime(notification.createdAt)}
                </div>
              </div>
              
              <div className="notification-content">
                {notification.content}
              </div>
              
              <div className="notification-actions">
                {!notification.isRead && (
                  <button 
                    className="action-btn mark-read"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
                <button 
                  className="action-btn delete"
                  onClick={() => handleDeleteNotification(notification.id)}
                >
                  <Trash2 size={12} />
                  Xóa
                </button>
              </div>
            </NotificationItem>
          ))
        )}
      </NotificationList>
    </NotificationContainer>
  );
};

export default NotificationListComponent; 