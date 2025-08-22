import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MessageCircle, Users, RefreshCw } from 'lucide-react';
import HostChatManager from '../../components/host/HostChatManager';
import chatApi from '../../api/chatApi';
import { extractConversationsFromResponse } from '../../utils/apiHelpers';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
`;

const MainCard = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  border: 1px solid #e2e8f0;
`;

const PageHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    animation: shine 3s ease-in-out infinite;
  }
  
  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const HeaderIcon = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 1.25rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const HeaderText = styled.div`
  h1 {
    margin: 0;
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  p {
    margin: 0;
    font-size: 1.125rem;
    opacity: 0.9;
    font-weight: 500;
  }
`;

const HeaderStats = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.15);
  padding: 1.25rem 1.75rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.2);
  }
  
  .stat-number {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .stat-label {
    font-size: 0.875rem;
    opacity: 0.9;
    font-weight: 500;
  }
`;

const ContentArea = styled.div`
  padding: 0;
  background: white;
`;

const HostMessagesPage = () => {
  const [stats, setStats] = useState({
    totalConversations: 0,
    unreadMessages: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await chatApi.getUserConversations();
      const conversations = extractConversationsFromResponse(response);
      
      const totalConversations = conversations.length;
      const unreadMessages = conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
      
      setStats({
        totalConversations,
        unreadMessages
      });
    } catch (error) {
      console.error('Error loading message stats:', error);
    }
  };

  return (
    <PageContainer>
      <MainCard>
        <PageHeader>
          <HeaderContent>
            <HeaderLeft>
              <HeaderIcon>
                <MessageCircle size={36} />
              </HeaderIcon>
              <HeaderText>
                <h1>Quản lý tin nhắn</h1>
                <p>Xem và trả lời tin nhắn từ người thuê nhà</p>
              </HeaderText>
            </HeaderLeft>
            
                         <HeaderStats>
               <StatItem>
                 <div className="stat-number">{stats.totalConversations}</div>
                 <div className="stat-label">Cuộc hội thoại</div>
               </StatItem>
               <StatItem>
                 <div className="stat-number">{stats.unreadMessages}</div>
                 <div className="stat-label">Tin nhắn mới</div>
               </StatItem>
             </HeaderStats>
          </HeaderContent>
        </PageHeader>

        <ContentArea>
          <HostChatManager />
        </ContentArea>
      </MainCard>
    </PageContainer>
  );
};

export default HostMessagesPage;
