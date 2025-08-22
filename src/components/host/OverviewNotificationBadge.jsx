import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { privateApiClient } from '../../api/apiClient';
import chatApi from '../../api/chatApi';

const Badge = styled.div`
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
  min-width: 1.25rem;
  border: 2px solid white;
  position: absolute;
  top: -4px;
  right: -4px;
  
  ${props => !props.show && `
    display: none;
  `}
`;

const InlineBadge = styled.div`
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  min-width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
  position: relative;
  z-index: 10;
  white-space: nowrap;
  
  ${props => !props.show && `
    display: none;
  `}
`;

const OverviewNotificationBadge = ({ 
  isInline = false, 
  hideWhenViewed = false 
}) => {
  const { user } = useAuth();
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      fetchTotalCount();
      // Polling để cập nhật mỗi 30 giây
      const interval = setInterval(fetchTotalCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchTotalCount = async () => {
    try {
      setLoading(true);
      
      // Lấy số tin nhắn chưa đọc
      let messageCount = 0;
      try {
        const messageResponse = await chatApi.getUnreadMessageCount();
        if (messageResponse.code === '00') {
          messageCount = messageResponse.data || 0;
        }
      } catch (error) {
        console.error('Error fetching message count:', error);
      }

      // Lấy số đơn đặt phòng chờ duyệt
      let bookingCount = 0;
      try {
        const bookingResponse = await privateApiClient.get(`/rentals/host/me/pending/count`);
        if (bookingResponse.data.code === '00') {
          bookingCount = bookingResponse.data.data || 0;
        }
      } catch (error) {
        console.error('Error fetching booking count:', error);
      }

      setTotalCount(messageCount + bookingCount);
    } catch (error) {
      console.error('Error fetching total notification count:', error);
    } finally {
      setLoading(false);
    }
  };

  // Nếu hideWhenViewed và đang ở trang overview, ẩn badge
  if (hideWhenViewed && window.location.pathname === '/host') {
    return null;
  }

  if (!user) {
    return null;
  }

  if (isInline) {
    return (
      <InlineBadge show={totalCount > 0}>
        {totalCount > 99 ? '99+' : totalCount}
      </InlineBadge>
    );
  }

  return (
    <Badge show={totalCount > 0}>
      {totalCount > 99 ? '99+' : totalCount}
    </Badge>
  );
};

export default OverviewNotificationBadge;
