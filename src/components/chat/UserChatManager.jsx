import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Send, User, Home, RefreshCw, MessageCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import chatApi from '../../api/chatApi';
import LoadingSpinner from '../common/LoadingSpinner';
import Avatar from '../common/Avatar';
import { extractConversationsFromResponse, extractMessagesFromResponse } from '../../utils/apiHelpers';

const ChatManagerContainer = styled.div`
  display: flex;
  height: calc(100vh - 300px);
  background: white;
  overflow: hidden;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ConversationsList = styled.div`
  width: 350px;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
`;

const ChatManagerHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  color: #1a202c;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const RefreshButton = styled.button`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    transform: scale(1.05);
  }
  
  &:disabled {
    background: rgba(102, 126, 234, 0.05);
    color: #a0aec0;
    cursor: not-allowed;
    transform: none;
  }
`;

const ConversationsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
`;

const ConversationItem = styled.div`
  padding: 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: #f8fafc;
    border-color: #cbd5e0;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    &::before {
      left: 100%;
    }
  }
  
  ${props => props.isActive && `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    color: white;
    
    h4, p {
      color: white;
    }
    
    &::before {
      display: none;
    }
  `}
`;

const ConversationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const HostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const HostAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  > div {
    width: 100% !important;
    height: 100% !important;
  }
`;

const HostDetails = styled.div`
  h4 {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
  }
  
  p {
    margin: 0;
    font-size: 0.75rem;
    color: #6b7280;
  }
`;

const UnreadBadge = styled.span`
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
`;

const LastMessage = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MessagePreview = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
`;

const MessageTime = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
`;

const ChatHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f9fafb;
`;

const ChatAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  > div {
    width: 100% !important;
    height: 100% !important;
  }
`;

const ChatInfo = styled.div`
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

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;
    
    &:hover {
      background: #a0aec0;
    }
  }
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 1rem 1.25rem;
  border-radius: 1.25rem;
  word-wrap: break-word;
  margin-bottom: 0.75rem;
  position: relative;
  animation: fadeInUp 0.3s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  ${props => props.isOwn ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }
    
    &::before {
      content: '';
      position: absolute;
      right: -8px;
      bottom: 0;
      width: 0;
      height: 0;
      border-left: 8px solid #667eea;
      border-bottom: 8px solid transparent;
    }
  ` : `
    background: white;
    color: #1a202c;
    align-self: flex-start;
    border-bottom-left-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
    
    &::before {
      content: '';
      position: absolute;
      left: -8px;
      bottom: 0;
      width: 0;
      height: 0;
      border-right: 8px solid white;
      border-bottom: 8px solid transparent;
    }
  `}
`;

const MessageBubbleTime = styled.div`
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

const InputArea = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: white;
`;

const InputRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
`;

const CharCounter = styled.div`
  font-size: 0.75rem;
  color: ${props => props.isNearLimit ? '#f59e0b' : props.isOverLimit ? '#dc2626' : '#6b7280'};
  text-align: right;
  margin-top: 0.25rem;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
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

const UserChatManager = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const messagesAreaRef = useRef(null);
  
  // Auto-refresh state
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  useEffect(() => {
    loadConversations();
    
    // Start auto-refresh every 3 seconds
    const interval = setInterval(() => {
      if (Date.now() - lastRefresh > 2000) { // Only refresh if last refresh was more than 2 seconds ago
        autoRefresh();
      }
    }, 3000);
    
    setAutoRefreshInterval(interval);
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      markMessagesAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Auto-refresh function
  const autoRefresh = async () => {
    try {
      setLastRefresh(Date.now());
      
      // Refresh conversations
      const conversationsResponse = await chatApi.getUserConversations();
      const newConversations = extractConversationsFromResponse(conversationsResponse);
      setConversations(newConversations);
      
      // Update selected conversation if it exists
      if (selectedConversation) {
        const updatedConversation = newConversations.find(c => c.id === selectedConversation.id);
        if (updatedConversation) {
          setSelectedConversation(updatedConversation);
        }
      }
      
      // Refresh messages if conversation is selected
      if (selectedConversation) {
        const messagesResponse = await chatApi.getConversationMessages(selectedConversation.id, 0, 50);
        const newMessages = extractMessagesFromResponse(messagesResponse);
        setMessages(newMessages);
      }
    } catch (error) {
      console.warn('Auto-refresh error:', error);
    }
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading conversations for user:', user?.id);
      const response = await chatApi.getUserConversations();
      console.log('Conversations response:', response);
      
      const conversations = extractConversationsFromResponse(response);
      setConversations(conversations);
      console.log('Loaded conversations:', conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setError('Không thể tải danh sách cuộc hội thoại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      console.log('Loading messages for conversation:', conversationId);
      const response = await chatApi.getConversationMessages(conversationId, 0, 50);
      console.log('Messages response:', response);
      
      const messages = extractMessagesFromResponse(response);
      setMessages(messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Không thể tải tin nhắn. Vui lòng thử lại.');
    }
  };

  const markMessagesAsRead = async (conversationId) => {
    try {
      await chatApi.markMessagesAsRead(conversationId);
      // Refresh conversations to update unread counts
      await loadConversations();
    } catch (error) {
      console.warn('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Validation cho tin nhắn
    if (newMessage.trim().length > 300) {
      setError('Tin nhắn không được vượt quá 300 ký tự');
      return;
    }

    try {
      setSending(true);
      setError(null);
      
      console.log('Sending message:', newMessage);
      console.log('Current conversationId:', selectedConversation.id);
      
      const messageData = {
        houseId: selectedConversation.houseId,
        receiverId: selectedConversation.hostId,
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
        await autoRefresh();
      } else {
        throw new Error(response?.message || 'Không thể gửi tin nhắn');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      if (error.response?.data?.message) {
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

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return 'Hôm nay';
      } else if (diffDays === 2) {
        return 'Hôm qua';
      } else if (diffDays <= 7) {
        return date.toLocaleDateString('vi-VN', { weekday: 'long' });
      } else {
        return date.toLocaleDateString('vi-VN');
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    if (selectedConversation) {
      await loadMessages(selectedConversation.id);
    }
    setRefreshing(false);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <ChatManagerContainer>
      <ConversationsList>
        <ChatManagerHeader>
          <HeaderTitle>
            <MessageCircle size={20} />
            Tin nhắn
          </HeaderTitle>
          <RefreshButton onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw 
              size={16} 
              style={{ 
                animation: refreshing ? 'spin 1s linear infinite' : 'none' 
              }} 
            />
          </RefreshButton>
        </ChatManagerHeader>

        <ConversationsContainer>
          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}
          
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <LoadingSpinner />
            </div>
          ) : conversations.length === 0 ? (
            <EmptyState>
              <MessageCircle size={48} />
              <p>Chưa có cuộc hội thoại nào</p>
              <p>Bắt đầu chat với chủ nhà để thuê nhà!</p>
            </EmptyState>
          ) : (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                isActive={selectedConversation?.id === conversation.id}
                onClick={() => setSelectedConversation(conversation)}
              >
                <ConversationHeader>
                  <HostInfo>
                    <HostAvatar>
                      <Avatar
                        src={conversation.hostAvatar}
                        alt={conversation.hostName || 'Chủ nhà'}
                        name={conversation.hostName || 'Chủ nhà'}
                        size="40px"
                      />
                    </HostAvatar>
                    <HostDetails>
                      <h4>{conversation.hostName || 'Chủ nhà'}</h4>
                      <p>{conversation.houseTitle || 'Nhà cho thuê'}</p>
                    </HostDetails>
                  </HostInfo>
                  {conversation.unreadCount > 0 && (
                    <UnreadBadge>
                      {conversation.unreadCount}
                    </UnreadBadge>
                  )}
                </ConversationHeader>
                
                <LastMessage>
                  <MessagePreview>
                    {conversation.lastMessage?.content || 'Chưa có tin nhắn'}
                  </MessagePreview>
                  <MessageTime>
                    {conversation.lastMessage?.createdAt 
                      ? formatDate(conversation.lastMessage.createdAt)
                      : ''
                    }
                  </MessageTime>
                </LastMessage>
              </ConversationItem>
            ))
          )}
        </ConversationsContainer>
      </ConversationsList>

      <ChatArea>
        {selectedConversation ? (
          <>
            <ChatHeader>
              <ChatAvatar>
                <Avatar
                  src={selectedConversation.hostAvatar}
                  alt={selectedConversation.hostName || 'Chủ nhà'}
                  name={selectedConversation.hostName || 'Chủ nhà'}
                  size="40px"
                />
              </ChatAvatar>
              <ChatInfo>
                <h3>{selectedConversation.hostName || 'Chủ nhà'}</h3>
                <p>{selectedConversation.houseTitle || 'Nhà cho thuê'}</p>
              </ChatInfo>
            </ChatHeader>

            <MessagesArea ref={messagesAreaRef}>
              {messages.length === 0 ? (
                <EmptyState>
                  <Home size={48} />
                  <p>Chưa có tin nhắn nào</p>
                  <p>Bắt đầu cuộc trò chuyện với chủ nhà!</p>
                </EmptyState>
              ) : (
                messages.map((message) => {
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
                          {selectedConversation.hostName || 'Chủ nhà'}
                        </div>
                      )}
                      <MessageBubble isOwn={isUserMessage}>
                        <div>{message.content}</div>
                        <MessageBubbleTime isOwn={isUserMessage}>
                          {formatTime(message.createdAt)}
                          {isUserMessage && (
                            <MessageStatus>
                              {message.isRead ? '✓✓' : '✓'}
                            </MessageStatus>
                          )}
                        </MessageBubbleTime>
                      </MessageBubble>
                    </div>
                  );
                })
              )}
            </MessagesArea>

            <InputArea>
              <InputRow>
                <MessageInput
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  disabled={sending}
                  maxLength={300}
                />
                <SendButton onClick={sendMessage} disabled={!newMessage.trim() || sending || newMessage.length > 300}>
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
              </InputRow>
              <CharCounter 
                isNearLimit={newMessage.length > 250 && newMessage.length <= 300}
                isOverLimit={newMessage.length > 300}
              >
                {newMessage.length}/300 ký tự
              </CharCounter>
            </InputArea>
          </>
        ) : (
          <EmptyState>
            <MessageCircle size={48} />
            <p>Chọn một cuộc hội thoại để bắt đầu chat</p>
          </EmptyState>
        )}
      </ChatArea>
    </ChatManagerContainer>
  );
};

export default UserChatManager;
