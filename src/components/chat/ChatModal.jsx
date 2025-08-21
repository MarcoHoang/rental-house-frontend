import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { X, Send, User, Home } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import chatApi from '../../api/chatApi';
import LoadingSpinner from '../common/LoadingSpinner';
import Avatar from '../common/Avatar';
import { extractMessagesFromResponse } from '../../utils/apiHelpers';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 500px;
  height: 80%;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ModalHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9fafb;
  border-radius: 0.75rem 0.75rem 0 0;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AvatarContainer = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const UserInfo = styled.div`
  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
  }
  
  p {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #6b7280;
  transition: all 0.2s;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  word-wrap: break-word;
  margin-bottom: 0.5rem;
  position: relative;
  
  ${props => props.isOwn ? `
    background: #3b82f6;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 0.25rem;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
    
    &::before {
      content: '';
      position: absolute;
      right: -8px;
      bottom: 0;
      width: 0;
      height: 0;
      border-left: 8px solid #3b82f6;
      border-bottom: 8px solid transparent;
    }
  ` : `
    background: #f3f4f6;
    color: #1f2937;
    align-self: flex-start;
    border-bottom-left-radius: 0.25rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    &::before {
      content: '';
      position: absolute;
      left: -8px;
      bottom: 0;
      width: 0;
      height: 0;
      border-right: 8px solid #f3f4f6;
      border-bottom: 8px solid transparent;
    }
  `}
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.isOwn ? 'rgba(255, 255, 255, 0.7)' : '#9ca3af'};
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const MessageStatus = styled.span`
  font-size: 0.625rem;
  opacity: 0.8;
`;

const InputContainer = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem;
  resize: none;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.25rem;
  max-height: 100px;
  min-height: 40px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const SendButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
  text-align: center;
  
  p {
    margin: 0.5rem 0;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin: 1rem;
  font-size: 0.875rem;
`;

const ChatModal = ({ isOpen, onClose, hostId, houseId, hostName, houseTitle, hostAvatar }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Auto-refresh state
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  useEffect(() => {
    if (isOpen && hostId && houseId) {
      initializeConversation();
      
      // Start auto-refresh every 2 seconds when modal is open
      const interval = setInterval(() => {
        if (Date.now() - lastRefresh > 1500) { // Only refresh if last refresh was more than 1.5 seconds ago
          autoRefreshMessages();
        }
      }, 2000);
      
      setAutoRefreshInterval(interval);
      
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [isOpen, hostId, houseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-refresh messages
  const autoRefreshMessages = async () => {
    if (!conversationId) return;
    
    try {
      setLastRefresh(Date.now());
      const response = await chatApi.getConversationMessages(conversationId, 0, 50);
      const messages = extractMessagesFromResponse(response);
      setMessages(messages);
    } catch (error) {
      console.warn('Auto-refresh error:', error);
    }
  };

  const initializeConversation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Initializing conversation for hostId:', hostId, 'houseId:', houseId);
      
      const response = await chatApi.createOrGetConversation(hostId, houseId);
      console.log('Conversation response:', response);
      console.log('Response code:', response.code);
      console.log('Response data:', response.data);
      console.log('Response message:', response.message);
      
      // Check if response is successful (any success code)
      if (response && response.data) {
        setConversationId(response.data.id);
        await loadMessages(response.data.id);
        // Mark messages as read
        try {
          await chatApi.markMessagesAsRead(response.data.id);
        } catch (readError) {
          console.warn('Error marking messages as read:', readError);
        }
      } else {
        console.error('Invalid response:', response);
        throw new Error(response?.message || 'Không thể tạo cuộc hội thoại');
      }
    } catch (error) {
      console.error('Error initializing conversation:', error);
      
      // Handle different types of errors
      if (error.response?.data?.message) {
        // API error response
        setError(error.response.data.message);
      } else if (error.message && error.message.includes('Không thể chat với chính mình')) {
        setError('Bạn không thể chat với chính mình.');
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Không thể khởi tạo cuộc hội thoại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (convId) => {
    try {
      console.log('Loading messages for conversation:', convId);
      const response = await chatApi.getConversationMessages(convId, 0, 50);
      console.log('Messages response:', response);
      
      const messages = extractMessagesFromResponse(response);
      setMessages(messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Không thể tải tin nhắn. Vui lòng thử lại.');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      setError(null);
      
      console.log('Sending message:', newMessage);
      console.log('Current conversationId:', conversationId);
      
      // Nếu chưa có conversationId, tạo conversation trước
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        console.log('No conversationId, creating new conversation...');
        const conversationResponse = await chatApi.createOrGetConversation(hostId, houseId);
        console.log('New conversation response:', conversationResponse);
        
        if (conversationResponse && conversationResponse.data) {
          currentConversationId = conversationResponse.data.id;
          setConversationId(currentConversationId);
        } else {
          throw new Error(conversationResponse?.message || 'Không thể tạo cuộc hội thoại');
        }
      }

      const messageData = {
        houseId: houseId,
        receiverId: hostId,
        content: newMessage.trim()
      };

      console.log('Sending message data:', messageData);
      const response = await chatApi.sendMessage(messageData);
      console.log('Send message response:', response);
      
      if (response && response.data) {
        // Thêm tin nhắn mới vào danh sách với thông tin sender
        const newMessageObj = {
          ...response.data,
          senderId: user?.id,
          senderName: user?.fullName || 'Bạn'
        };
        setMessages(prev => [...prev, newMessageObj]);
        setNewMessage('');
        
        // Force immediate refresh to sync with server
        setLastRefresh(0); // Reset last refresh time to force immediate refresh
        await autoRefreshMessages();
      } else {
        throw new Error(response?.message || 'Không thể gửi tin nhắn');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Handle different types of errors
      if (error.response?.data?.message) {
        // API error response
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Không thể gửi tin nhắn. Vui lòng thử lại.');
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderInfo>
            <Avatar
              src={hostAvatar}
              alt={hostName || 'Chủ nhà'}
              name={hostName || 'Chủ nhà'}
              size="40px"
            />
            <UserInfo>
              <h3>{hostName || 'Chủ nhà'}</h3>
              <p>{houseTitle || 'Nhà cho thuê'}</p>
            </UserInfo>
          </HeaderInfo>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <MessagesContainer>
          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}
          
          {loading ? (
            <LoadingSpinner />
          ) : messages.length === 0 ? (
            <EmptyState>
              <Home size={48} />
              <p>Chưa có tin nhắn nào</p>
              <p>Bắt đầu cuộc trò chuyện với chủ nhà!</p>
            </EmptyState>
          ) : (
            messages.map((message) => {
              // Xác định tin nhắn có phải của user không
              const isUserMessage = message.senderId === user?.id;
              return (
                <div key={message.id} style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: isUserMessage ? 'flex-end' : 'flex-start',
                  marginBottom: '0.5rem'
                }}>
                  {!isUserMessage && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem',
                      marginLeft: '0.5rem'
                    }}>
                      {hostName || 'Chủ nhà'}
                    </div>
                  )}
                  <MessageBubble isOwn={isUserMessage}>
                    <div>{message.content}</div>
                    <MessageTime isOwn={isUserMessage}>
                      {formatTime(message.createdAt)}
                      {isUserMessage && (
                        <MessageStatus>
                          {message.isRead ? '✓✓' : '✓'}
                        </MessageStatus>
                      )}
                    </MessageTime>
                  </MessageBubble>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer>
          <MessageInput
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            disabled={sending}
          />
                          <SendButton onClick={sendMessage} disabled={!newMessage.trim() || sending}>
                  {sending ? (
                    <div style={{ 
                      width: '18px', 
                      height: '18px', 
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  ) : (
                    <Send size={18} />
                  )}
                </SendButton>
        </InputContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ChatModal; 