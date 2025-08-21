import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import HostHeader from './HostHeader';
import HostSidebar from './HostSidebar';
import Footer from './Footer';

const LayoutContainer = styled.div`
  min-h-screen flex flex-col;
  background-color: #F7FAFC; /* Nền xám rất nhạt cho toàn bộ layout */
`;

const MainLayout = styled.div`
  display: flex;
  flex: 1;
`;

const ContentArea = styled.div`
  flex: 1;
  margin-left: 250px; // Để tránh bị che bởi sidebar
  display: flex;
  flex-direction: column;
  background-color: #F7FAFC; /* Nền xám nhạt cho content area */
`;

const MainContent = styled.main`
  flex: 1;
  padding: 24px 32px; /* Vùng đệm: 24px trên-dưới, 32px trái-phải */
  min-height: calc(100vh - 70px); /* Trừ đi chiều cao header */
  
  /* Responsive padding */
  @media (max-width: 1024px) {
    padding: 20px 24px;
  }
  
  @media (max-width: 768px) {
    padding: 16px 20px;
    margin-left: 0; /* Trên mobile, sidebar sẽ overlay */
  }
`;

const HostLayout = () => {
  return (
    <LayoutContainer>
      <HostHeader />
      <MainLayout>
        <HostSidebar />
        <ContentArea>
          <MainContent>
            <Outlet />
          </MainContent>
          <Footer />
        </ContentArea>
      </MainLayout>
    </LayoutContainer>
  );
};

export default HostLayout;
