import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import HostHeader from './HostHeader';
import HostSidebar from './HostSidebar';
import Footer from './Footer';

const LayoutContainer = styled.div`
  min-h-screen flex flex-col;
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
`;

const MainContent = styled.main`
  flex: 1;
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
