import React from 'react';
import styled from 'styled-components';
import { MessageCircle } from 'lucide-react';
import HostChatManager from '../../components/host/HostChatManager';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  p {
    color: #6b7280;
    font-size: 1.1rem;
  }
`;

const HostMessagesPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <h1>
          <MessageCircle size={28} />
          Quản lý tin nhắn
        </h1>
        <p>Xem và trả lời tin nhắn từ người thuê nhà</p>
      </PageHeader>
      
      <HostChatManager />
    </PageContainer>
  );
};

export default HostMessagesPage;
