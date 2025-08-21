import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Send, RefreshCw, MessageCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import chatApi from '../../api/chatApi';
import LoadingSpinner from '../common/LoadingSpinner';
import Avatar from '../common/Avatar';
import { extractConversationsFromResponse, extractMessagesFromResponse } from '../../utils/apiHelpers';

const ChatManagerContainer = styled.div`
  display: flex;
  height: calc(100vh - 120px);
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ConversationsList = styled.div`
  width: 350px;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
`;

const ChatManagerHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RefreshButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem;
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

const ConversationsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
`;

const ConversationItem = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  
  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
  
  ${props => props.isActive && `
    background: #eff6ff;
    border-color: #3b82f6;
  `}
`;

const ConversationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserDetails = styled.div`
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
  border-radius: 50%;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
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

const SharedChatManager = ({ userType = 'user' }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Optimized refresh state - only refresh when needed
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [isPageVisible, setIsPageVisible] = useState(true);

  // Handle page visibility for better performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
      if (!document.hidden) {
        // Refresh when user comes back to tab
        loadConversations();
        if (selectedConversation) {
          loadMessages(selectedConversation.id);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedConversation]);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      markMessagesAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Optimized refresh function - only refresh when page is visible
  const autoRefresh = async () => {
    if (!isPageVisible) return;
    
    try {
      setLastRefresh(Date.now());
      
      // Refresh conversations (chỉ load conversation đã tồn tại)
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

  // Improved error handling with retry mechanism
  const sendMessageWithRetry = async (messageData, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await chatApi.sendMessage(messageData);
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      setError(null);
      
      console.log('Sending message:', newMessage);
      console.log('Current conversationId:', selectedConversation.id);
      
      const messageData = {
        houseId: selectedConversation.houseId,
        receiverId: userType === 'user' ? selectedConversation.hostId : selectedConversation.userId,
        content: newMessage.trim()
      };

      console.log('Sending message data:', messageData);
      const response = await sendMessageWithRetry(messageData);
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
        
        // Refresh conversations to update last message
        await loadConversations();
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

  // Get conversation display info based on user type
  const getConversationDisplayInfo = (conversation) => {
    if (userType === 'user') {
      return {
        name: conversation.hostName || 'Chủ nhà',
        avatar: conversation.hostAvatar,
        title: conversation.houseTitle || 'Nhà cho thuê'
      };
    } else {
      return {
        name: conversation.userName || 'Người thuê',
        avatar: conversation.userAvatar,
        title: conversation.houseTitle || 'Nhà cho thuê'
      };
    }
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
              <p>{userType === 'user' ? 'Bắt đầu chat với chủ nhà để thuê nhà!' : 'Khi có người liên hệ, tin nhắn sẽ xuất hiện ở đây'}</p>
            </EmptyState>
          ) : (
            conversations.map((conversation) => {
              const displayInfo = getConversationDisplayInfo(conversation);
              return (
                <ConversationItem
                  key={conversation.id}
                  isActive={selectedConversation?.id === conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <ConversationHeader>
                    <UserInfo>
                      <UserAvatar>
                        <Avatar
                          src={displayInfo.avatar}
                          alt={displayInfo.name}
                          name={displayInfo.name}
                          size="40px"
                        />
                      </UserAvatar>
                      <UserDetails>
                        <h4>{displayInfo.name}</h4>
                        <p>{displayInfo.title}</p>
                      </UserDetails>
                    </UserInfo>
                    {conversation.unreadCount > 0 && (
                      <UnreadBadge>
                        {conversation.unreadCount}
                      </UnreadBadge>
                    )}
                  </ConversationHeader>
                  
                  <LastMessage>
                    <MessagePreview>
                      {conversation.lastMessageContent || 'Chưa có tin nhắn'}
                    </MessagePreview>
                    <MessageTime>
                      {conversation.lastMessageAt 
                        ? formatDate(conversation.lastMessageAt)
                        : ''
                      }
                    </MessageTime>
                  </LastMessage>
                </ConversationItem>
              );
            })
          )}
        </ConversationsContainer>
      </ConversationsList>

      <ChatArea>
        {selectedConversation ? (
          <>
            <ChatHeader>
              <ChatAvatar>
                {(() => {
                  const displayInfo = getConversationDisplayInfo(selectedConversation);
                  return (
                    <Avatar
                      src={displayInfo.avatar}
                      alt={displayInfo.name}
                      name={displayInfo.name}
                      size="40px"
                    />
                  );
                })()}
              </ChatAvatar>
              <ChatInfo>
                {(() => {
                  const displayInfo = getConversationDisplayInfo(selectedConversation);
                  return (
                    <>
                      <h3>{displayInfo.name}</h3>
                      <p>{displayInfo.title}</p>
                    </>
                  );
                })()}
              </ChatInfo>
            </ChatHeader>

            <MessagesArea>
              {messages.length === 0 ? (
                <EmptyState>
                  <MessageCircle size={48} />
                  <p>Chưa có tin nhắn nào</p>
                  <p>Bắt đầu cuộc trò chuyện!</p>
                </EmptyState>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.senderId === user?.id;
                  const displayInfo = getConversationDisplayInfo(selectedConversation);
                  return (
                    <div key={message.id} style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                      marginBottom: '0.5rem'
                    }}>
                      {!isOwnMessage && (
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          marginBottom: '0.25rem',
                          marginLeft: '0.5rem'
                        }}>
                          {displayInfo.name}
                        </div>
                      )}
                      <MessageBubble isOwn={isOwnMessage}>
                        <div>{message.content}</div>
                        <MessageBubbleTime isOwn={isOwnMessage}>
                          {formatTime(message.createdAt)}
                          {isOwnMessage && (
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
              <div ref={messagesEndRef} />
            </MessagesArea>

            <InputArea>
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

export default SharedChatManager;
