import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Home, 
  Plus, 
  FileText, 
  Users, 
  DollarSign, 
  Star, 
  Calendar,
  TrendingUp,
  Settings,
  User
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 1rem;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  
  .stat-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #1a202c;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    color: #718096;
    font-size: 0.875rem;
  }
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ActionCard = styled(Link)`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
  }
  
  .action-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .action-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .action-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 0.5rem;
  }
  
  .action-description {
    color: #718096;
    line-height: 1.5;
  }
`;

const RecentActivity = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const ActivityTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .activity-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.875rem;
  }
  
  .activity-content {
    flex: 1;
  }
  
  .activity-title {
    font-weight: 500;
    color: #1a202c;
    margin-bottom: 0.25rem;
  }
  
  .activity-time {
    font-size: 0.875rem;
    color: #718096;
  }
`;

const HostDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeBookings: 0,
    totalIncome: 0,
    averageRating: 0
  });

  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      totalProperties: 3,
      activeBookings: 5,
      totalIncome: 2500000,
      averageRating: 4.5
    });
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <DashboardContainer>
      <MainContent>
        <WelcomeSection>
          <WelcomeTitle>Chào mừng trở lại, {user?.fullName || 'Chủ nhà'}!</WelcomeTitle>
          <WelcomeSubtitle>
            Quản lý tài sản và đơn đặt phòng của bạn một cách dễ dàng
          </WelcomeSubtitle>
        </WelcomeSection>

        <StatsGrid>
          <StatCard>
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#3b82f6' }}>
                <Home size={20} />
              </div>
            </div>
            <div className="stat-value">{stats.totalProperties}</div>
            <div className="stat-label">Tài sản đang cho thuê</div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#10b981' }}>
                <Calendar size={20} />
              </div>
            </div>
            <div className="stat-value">{stats.activeBookings}</div>
            <div className="stat-label">Đơn đặt phòng hiện tại</div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#f59e0b' }}>
                <DollarSign size={20} />
              </div>
            </div>
            <div className="stat-value">{formatCurrency(stats.totalIncome)}</div>
            <div className="stat-label">Tổng thu nhập tháng này</div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#8b5cf6' }}>
                <Star size={20} />
              </div>
            </div>
            <div className="stat-value">{stats.averageRating}</div>
            <div className="stat-label">Đánh giá trung bình</div>
          </StatCard>
        </StatsGrid>

        <ActionsGrid>
          <ActionCard to="/host/post">
            <div className="action-header">
              <div className="action-icon" style={{ background: '#3b82f6' }}>
                <Plus size={20} />
              </div>
            </div>
            <div className="action-title">Đăng tin mới</div>
            <div className="action-description">
              Thêm tài sản mới vào hệ thống cho thuê của bạn
            </div>
          </ActionCard>

          <ActionCard to="/host/properties">
            <div className="action-header">
              <div className="action-icon" style={{ background: '#10b981' }}>
                <FileText size={20} />
              </div>
            </div>
            <div className="action-title">Quản lý tài sản</div>
            <div className="action-description">
              Xem và chỉnh sửa thông tin các tài sản đang cho thuê
            </div>
          </ActionCard>

          <ActionCard to="/host/bookings">
            <div className="action-header">
              <div className="action-icon" style={{ background: '#f59e0b' }}>
                <Users size={20} />
              </div>
            </div>
            <div className="action-title">Đơn đặt phòng</div>
            <div className="action-description">
              Quản lý các đơn đặt phòng và yêu cầu từ khách hàng
            </div>
          </ActionCard>

          <ActionCard to="/host/analytics">
            <div className="action-header">
              <div className="action-icon" style={{ background: '#8b5cf6' }}>
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="action-title">Thống kê & Báo cáo</div>
            <div className="action-description">
              Xem báo cáo chi tiết về hiệu suất và thu nhập
            </div>
          </ActionCard>

          <ActionCard to="/host/profile">
            <div className="action-header">
              <div className="action-icon" style={{ background: '#ef4444' }}>
                <User size={20} />
              </div>
            </div>
            <div className="action-title">Thông tin cá nhân</div>
            <div className="action-description">
              Cập nhật thông tin profile và tài khoản của bạn
            </div>
          </ActionCard>
        </ActionsGrid>

        <RecentActivity>
          <ActivityTitle>
            <Calendar size={20} />
            Hoạt động gần đây
          </ActivityTitle>
          
          <ActivityItem>
            <div className="activity-icon" style={{ background: '#10b981' }}>
              <Plus size={16} />
            </div>
            <div className="activity-content">
              <div className="activity-title">Đăng tin mới: Căn hộ 2 phòng ngủ tại Quận 1</div>
              <div className="activity-time">2 giờ trước</div>
            </div>
          </ActivityItem>

          <ActivityItem>
            <div className="activity-icon" style={{ background: '#3b82f6' }}>
              <Users size={16} />
            </div>
            <div className="activity-content">
              <div className="activity-title">Có đơn đặt phòng mới từ Nguyễn Văn A</div>
              <div className="activity-time">5 giờ trước</div>
            </div>
          </ActivityItem>

          <ActivityItem>
            <div className="activity-icon" style={{ background: '#f59e0b' }}>
              <Star size={16} />
            </div>
            <div className="activity-content">
              <div className="activity-title">Nhận đánh giá 5 sao từ khách hàng</div>
              <div className="activity-time">1 ngày trước</div>
            </div>
          </ActivityItem>

          <ActivityItem>
            <div className="activity-icon" style={{ background: '#8b5cf6' }}>
              <DollarSign size={16} />
            </div>
            <div className="activity-content">
              <div className="activity-title">Thanh toán thành công: 2,500,000 VND</div>
              <div className="activity-time">2 ngày trước</div>
            </div>
          </ActivityItem>
        </RecentActivity>
      </MainContent>
    </DashboardContainer>
  );
};

export default HostDashboardPage;

