import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { privateApiClient } from '../../api/apiClient';

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

const BookingNotificationBadge = ({ 
  isInline = false, 
  hideWhenViewed = false 
}) => {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      fetchPendingCount();
      // Polling để cập nhật mỗi 30 giây
      const interval = setInterval(fetchPendingCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchPendingCount = async () => {
    try {
      setLoading(true);
      const response = await privateApiClient.get(`/rentals/host/me/pending/count`);
      if (response.data.code === '00') {
        setPendingCount(response.data.data || 0);
      }
    } catch (error) {
      console.error('Error fetching pending booking count:', error);
    } finally {
      setLoading(false);
    }
  };

  // Nếu hideWhenViewed và đang ở trang bookings, ẩn badge
  if (hideWhenViewed && window.location.pathname === '/host/bookings') {
    return null;
  }

  if (!user) {
    return null;
  }

  if (isInline) {
    return (
      <InlineBadge show={pendingCount > 0}>
        {pendingCount > 99 ? '99+' : pendingCount}
      </InlineBadge>
    );
  }

  return (
    <Badge show={pendingCount > 0}>
      {pendingCount > 99 ? '99+' : pendingCount}
    </Badge>
  );
};

export default BookingNotificationBadge;
