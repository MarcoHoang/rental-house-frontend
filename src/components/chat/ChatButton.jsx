import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import chatApi from '../../api/chatApi';

const ChatButtonContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ChatButtonStyled = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  
  &:hover {
    background: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const NotificationBadge = styled.div`
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
  
  ${props => !props.show && `
    display: none;
  `}
`;

const ChatButton = ({ hostId, houseId, onClick, className }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && hostId && houseId) {
      fetchUnreadCount();
    }
  }, [user, hostId, houseId]);

  const fetchUnreadCount = async () => {
    try {
      setLoading(true);
      // Get conversation first
      const conversationResponse = await chatApi.createOrGetConversation(hostId, houseId);
      if (conversationResponse && conversationResponse.data) {
        const conversationId = conversationResponse.data.id;
        const unreadResponse = await chatApi.getUnreadMessageCountForConversation(conversationId);
        if (unreadResponse && unreadResponse.data !== undefined) {
          setUnreadCount(unreadResponse.data || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    if (onClick) {
      onClick();
    }
    // Mark messages as read when chat is opened
    if (unreadCount > 0) {
      try {
        const conversationResponse = await chatApi.createOrGetConversation(hostId, houseId);
        if (conversationResponse && conversationResponse.data) {
          await chatApi.markMessagesAsRead(conversationResponse.data.id);
          setUnreadCount(0);
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  if (!user) {
    return null; // Don't show chat button for unauthenticated users
  }

  return (
    <ChatButtonContainer className={className}>
      <ChatButtonStyled onClick={handleClick} disabled={loading}>
        <MessageCircle size={18} />
        Chat với chủ nhà
      </ChatButtonStyled>
      <NotificationBadge show={unreadCount > 0}>
        {unreadCount > 99 ? '99+' : unreadCount}
      </NotificationBadge>
    </ChatButtonContainer>
  );
};

export default ChatButton; 