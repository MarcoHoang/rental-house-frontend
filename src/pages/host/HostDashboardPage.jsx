import React, { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  UserIcon, 
  DocumentTextIcon,
  PlusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import styled from 'styled-components';
import HostInfo from '../../components/host/HostInfo';
import HostApplicationStatus from '../../components/host/HostApplicationStatus';
import HostRegistrationForm from '../../components/host/HostRegistrationForm';
import { getUserFromStorage } from '../../utils/localStorage';
import hostApi from '../../api/hostApi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #4338ca;
  }
  
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color};
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.color};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const WelcomeMessage = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const WelcomeText = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
`;

const HostDashboardPage = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [hasApplication, setHasApplication] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = getUserFromStorage();
      if (!userData) {
        setUserRole('GUEST');
        return;
      }

      setUser(userData);
      setUserRole(userData.roleName || 'USER');

      // Kiểm tra xem user có phải là host không
      if (userData.roleName === 'HOST') {
        setIsHost(true);
        return;
      }

      // Kiểm tra xem user đã gửi đơn đăng ký chưa
      try {
        await hostApi.getMyApplication(userData.id);
        setHasApplication(true);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Error checking application:', error);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSubmit = async (formData) => {
    try {
      await hostApi.submitHostApplication(formData);
      setHasApplication(true);
      alert('Đơn đăng ký đã được gửi thành công! Admin sẽ xem xét và phản hồi sớm nhất.');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Có lỗi xảy ra khi gửi đơn đăng ký: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      </Container>
    );
  }

  if (userRole === 'GUEST') {
    return (
      <Container>
        <Card>
          <div className="text-center py-8">
            <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Vui lòng đăng nhập
            </h2>
            <p className="text-gray-600">
              Bạn cần đăng nhập để truy cập trang này.
            </p>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <HomeIcon className="w-8 h-8" />
          Dashboard Chủ nhà
        </Title>
        
        {!isHost && !hasApplication && (
          <ActionButton onClick={() => setShowRegistrationForm(true)}>
            <PlusIcon className="w-5 h-5" />
            Đăng ký làm chủ nhà
          </ActionButton>
        )}
      </Header>

      {isHost && (
        <WelcomeMessage>
          <WelcomeTitle>
            Chào mừng bạn, {user?.fullName || user?.username || 'Chủ nhà'}! 🎉
          </WelcomeTitle>
          <WelcomeText>
            Bạn đã được approve làm chủ nhà. Bây giờ bạn có thể đăng tin cho thuê nhà và quản lý các tin đăng của mình.
          </WelcomeText>
        </WelcomeMessage>
      )}

      <ContentGrid>
        <MainContent>
          {isHost ? (
            <>
              <HostInfo />
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    <ChartBarIcon className="w-5 h-5" />
                    Thống kê hoạt động
                  </CardTitle>
                </CardHeader>
                
                <StatsGrid>
                  <StatCard color="#3b82f6">
                    <StatNumber color="#3b82f6">0</StatNumber>
                    <StatLabel>Tin đã đăng</StatLabel>
                  </StatCard>
                  <StatCard color="#10b981">
                    <StatNumber color="#10b981">0</StatNumber>
                    <StatLabel>Tin đang hiển thị</StatLabel>
                  </StatCard>
                  <StatCard color="#f59e0b">
                    <StatNumber color="#f59e0b">0</StatNumber>
                    <StatLabel>Lượt xem</StatLabel>
                  </StatCard>
                  <StatCard color="#8b5cf6">
                    <StatNumber color="#8b5cf6">0</StatNumber>
                    <StatLabel>Liên hệ</StatLabel>
                  </StatCard>
                </StatsGrid>
                
                <div className="text-center py-4 text-gray-500">
                  <p>Chức năng đăng tin và quản lý sẽ được phát triển trong phiên bản tiếp theo.</p>
                </div>
              </Card>
            </>
          ) : (
            <HostApplicationStatus />
          )}
        </MainContent>

        <Sidebar>
          {!isHost && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <DocumentTextIcon className="w-5 h-5" />
                  Hướng dẫn
                </CardTitle>
              </CardHeader>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Để trở thành chủ nhà:</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Điền đầy đủ thông tin cá nhân</li>
                    <li>• Tải lên ảnh CCCD/CMT (mặt trước và sau)</li>
                    <li>• Tải lên giấy tờ chứng minh quyền sở hữu</li>
                    <li>• Gửi đơn đăng ký và chờ admin duyệt</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Sau khi được duyệt:</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Có thể đăng tin cho thuê nhà</li>
                    <li>• Quản lý các tin đăng của mình</li>
                    <li>• Nhận thông báo từ người thuê</li>
                    <li>• Xem thống kê hoạt động</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                <UserIcon className="w-5 h-5" />
                Thông tin tài khoản
              </CardTitle>
            </CardHeader>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-500">Họ tên</div>
                <div className="text-sm text-gray-900">
                  {user?.fullName || user?.username || 'Chưa cập nhật'}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Email</div>
                <div className="text-sm text-gray-900">{user?.email}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Vai trò</div>
                <div className="text-sm text-gray-900">
                  {userRole === 'HOST' ? 'Chủ nhà' : 'Người dùng'}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Trạng thái</div>
                <div className="text-sm text-gray-900">
                  {user?.active ? 'Hoạt động' : 'Đã khóa'}
                </div>
              </div>
            </div>
          </Card>
        </Sidebar>
      </ContentGrid>

      {showRegistrationForm && (
        <HostRegistrationForm
          isOpen={showRegistrationForm}
          onClose={() => setShowRegistrationForm(false)}
          onSubmit={handleRegistrationSubmit}
        />
      )}
    </Container>
  );
};

export default HostDashboardPage;

