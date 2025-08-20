import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuthContext } from '../contexts/AuthContext';
import HostRentalRequests from '../components/host/HostRentalRequests';
import HostNotificationBadge from '../components/host/HostNotificationBadge';
import rentalApi from '../api/rentalApi';
import { Home, Users, Calendar, Settings, DollarSign, TrendingUp } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #374151;
`;

const TabContainer = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
`;

const TabContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 0;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  border: none;
  background: none;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.$active ? '#3b82f6' : '#6b7280'};
  border-bottom: 2px solid ${props => props.$active ? '#3b82f6' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${props => props.$active ? '#3b82f6' : '#374151'};
    background-color: ${props => props.$active ? 'transparent' : '#f9fafb'};
  }
`;

const TabIcon = styled.div`
  display: flex;
  align-items: center;
`;

const ContentArea = styled.main`
  flex: 1;
`;

const HostDashboardPage = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    pendingRequests: 0,
    totalRequests: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user?.id]);

  const fetchStats = async () => {
    try {
      const [pendingCountResponse, allRequestsResponse] = await Promise.all([
        rentalApi.getHostPendingRequestsCount(user.id),
        rentalApi.getHostAllRequests(user.id)
      ]);

      // Chuẩn hóa dữ liệu trả về để tránh render object {code, message, data}
      const normalize = (value) => {
        if (value && typeof value === 'object') {
          if ('data' in value && ('code' in value || 'message' in value)) {
            return value.data;
          }
        }
        return value;
      };

      const pendingCountRaw = normalize(pendingCountResponse?.data);
      const allRequestsRaw = normalize(allRequestsResponse?.data);

      const pendingCount = typeof pendingCountRaw === 'number' ? pendingCountRaw : Number(pendingCountRaw) || 0;
      const allRequests = Array.isArray(allRequestsRaw) ? allRequestsRaw : [];
      
      // Tính tổng doanh thu từ các yêu cầu đã được chấp nhận hoặc đã hoàn tất
      const totalEarnings = allRequests
        .filter(request => ['APPROVED','SCHEDULED','CHECKED_IN','CHECKED_OUT'].includes(request.status))
        .reduce((sum, request) => sum + (request.totalPrice || 0), 0);

      setStats({
        pendingRequests: pendingCount,
        totalRequests: allRequests.length,
        totalEarnings: totalEarnings
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Tổng quan',
      icon: <Home size={20} />
    },
    {
      id: 'requests',
      label: 'Yêu cầu thuê nhà',
      icon: <Calendar size={20} />
    },
    {
      id: 'houses',
      label: 'Quản lý nhà',
      icon: <Home size={20} />
    },
    {
      id: 'rentals',
      label: 'Lịch thuê',
      icon: <Users size={20} />
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: <Settings size={20} />
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>Tổng quan</h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #f59e0b'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    background: '#fef3c7',
                    padding: '0.75rem',
                    borderRadius: '50%',
                    color: '#92400e'
                  }}>
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Yêu cầu chờ duyệt</h3>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>
                      {stats.pendingRequests}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #3b82f6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    background: '#dbeafe',
                    padding: '0.75rem',
                    borderRadius: '50%',
                    color: '#1e40af'
                  }}>
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Tổng yêu cầu</h3>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>
                      {stats.totalRequests}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #10b981'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    background: '#d1fae5',
                    padding: '0.75rem',
                    borderRadius: '50%',
                    color: '#065f46'
                  }}>
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Tổng doanh thu</h3>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>
                      {new Intl.NumberFormat('vi-VN').format(stats.totalEarnings)} VNĐ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Hướng dẫn sử dụng</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.375rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>📋 Quản lý yêu cầu</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                    Xem và xử lý các yêu cầu thuê nhà từ người dùng. Chấp nhận hoặc từ chối với lý do cụ thể.
                  </p>
                </div>
                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.375rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>🏠 Quản lý tài sản</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                    Đăng tin mới và quản lý các tài sản đã đăng. Cập nhật thông tin và trạng thái.
                  </p>
                </div>
                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.375rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>📊 Thống kê</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                    Theo dõi doanh thu, số lượng yêu cầu và hiệu suất cho thuê của bạn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'requests':
        return <HostRentalRequests />;
      case 'houses':
        return (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Quản lý nhà</h2>
            <p>Chức năng này sẽ được phát triển sau.</p>
          </div>
        );
      case 'rentals':
        return (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Lịch thuê</h2>
            <p>Chức năng này sẽ được phát triển sau.</p>
          </div>
        );
      case 'settings':
        return (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Cài đặt</h2>
            <p>Chức năng này sẽ được phát triển sau.</p>
          </div>
        );
      default:
        return <HostRentalRequests />;
    }
  };

  if (!user) {
    return (
      <Container>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Vui lòng đăng nhập</h2>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Logo>Host Dashboard</Logo>
          <UserInfo>
            <HostNotificationBadge onClick={() => setActiveTab('requests')} />
            <UserName>Xin chào, {user.fullName || user.username}</UserName>
          </UserInfo>
        </HeaderContent>
      </Header>

      <TabContainer>
        <TabContent>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <TabIcon>{tab.icon}</TabIcon>
              {tab.label}
            </Tab>
          ))}
        </TabContent>
      </TabContainer>

      <ContentArea>
        {renderTabContent()}
      </ContentArea>
    </Container>
  );
};

export default HostDashboardPage;
