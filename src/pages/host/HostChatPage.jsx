import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MessageCircle, Send, Home, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import chatApi from '../../api/chatApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';
import { extractMessagesFromResponse } from '../../utils/apiHelpers';
import HostPageWrapper from '../../components/layout/HostPageWrapper';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #6b7280;
    font-size: 1.1rem;
  }
`;

const ConversationsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  height: 600px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ConversationsSidebar = styled.div`
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const SidebarHeader = styled.div`
  padding: 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
`;

const ConversationItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f9fafb;
  }
  
  ${props => props.active && `
    background: #eff6ff;
    border-left: 4px solid #3b82f6;
  `}
`;

const ConversationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const ConversationDetails = styled.div`
  flex: 1;
  
  h3 {
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

const ChatArea = styled.div`
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
  ` : `
    background: #f3f4f6;
    color: #1f2937;
    align-self: flex-start;
    border-bottom-left-radius: 0.25rem;
  `}
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.isOwn ? 'rgba(255, 255, 255, 0.7)' : '#9ca3af'};
  margin-top: 0.25rem;
`;

const InputContainer = styled.div`
  padding: 1rem;
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

const HostChatPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await chatApi.getUserConversations();
      if (response && response.data) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await chatApi.getConversationMessages(conversationId, 0, 50);
      const messages = extractMessagesFromResponse(response);
      setMessages(messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      
      const messageData = {
        houseId: selectedConversation.houseId,
        receiverId: selectedConversation.userId,
        content: newMessage.trim()
      };

      const response = await chatApi.sendMessage(messageData);
      
      if (response && response.data) {
        const newMessageObj = {
          ...response.data,
          senderId: user?.id,
          senderName: user?.fullName || 'Bạn'
        };
        setMessages(prev => [...prev, newMessageObj]);
        setNewMessage('');
        
        // Refresh messages
        await loadMessages(selectedConversation.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
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
      return '';
    }
  };

  return (
    <HostPageWrapper>
      <Container>
        <Header>
          <h1>Tin nhắn</h1>
          <p>Quản lý tin nhắn từ người thuê nhà</p>
        </Header>

        <ConversationsList>
          <ConversationsSidebar>
            <SidebarHeader>
              <MessageCircle size={20} />
              Cuộc hội thoại
            </SidebarHeader>
            
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <LoadingSpinner />
              </div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                <Home size={48} />
                <p>Chưa có cuộc hội thoại nào</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  active={selectedConversation?.id === conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <ConversationInfo>
                    <Avatar
                      src={conversation.userAvatar}
                      alt={conversation.userName}
                      name={conversation.userName}
                      size="40px"
                    />
                    <ConversationDetails>
                      <h3>{conversation.userName}</h3>
                      <p>{conversation.houseTitle}</p>
                    </ConversationDetails>
                  </ConversationInfo>
                </ConversationItem>
              ))
            )}
          </ConversationsSidebar>

          <ChatArea>
            {selectedConversation ? (
              <>
                <ChatHeader>
                  <Avatar
                    src={selectedConversation.userAvatar}
                    alt={selectedConversation.userName}
                    name={selectedConversation.userName}
                    size="40px"
                  />
                  <ChatInfo>
                    <h3>{selectedConversation.userName}</h3>
                    <p>{selectedConversation.houseTitle}</p>
                  </ChatInfo>
                </ChatHeader>

                <MessagesContainer>
                  {messages.length === 0 ? (
                    <EmptyState>
                      <MessageCircle size={48} />
                      <p>Chưa có tin nhắn nào</p>
                      <p>Bắt đầu cuộc trò chuyện!</p>
                    </EmptyState>
                  ) : (
                    messages.map((message) => {
                      const isOwnMessage = message.senderId === user?.id;
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
                              {selectedConversation.userName}
                            </div>
                          )}
                          <MessageBubble isOwn={isOwnMessage}>
                            <div>{message.content}</div>
                            <MessageTime isOwn={isOwnMessage}>
                              {formatTime(message.createdAt)}
                            </MessageTime>
                          </MessageBubble>
                        </div>
                      );
                    })
                  )}
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
                    <Send size={18} />
                  </SendButton>
                </InputContainer>
              </>
            ) : (
              <EmptyState>
                <MessageCircle size={48} />
                <p>Chọn một cuộc hội thoại để bắt đầu chat</p>
              </EmptyState>
            )}
          </ChatArea>
        </ConversationsList>
      </Container>
    </HostPageWrapper>
  );
};

export default HostChatPage;

