import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Home, 
  Calendar, 
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/timeUtils';
import { hostApi } from '../../api/hostApi';
import { useToast } from '../common/Toast';

const StatisticsContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const StatisticsHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const StatisticsContent = styled.div`
  padding: 1.5rem;
`;

const PeriodSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const PeriodButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#5a67d8' : '#f8fafc'};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  
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
    margin-bottom: 0.5rem;
  }
  
  .stat-change {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .stat-change.positive {
    color: #10b981;
  }
  
  .stat-change.negative {
    color: #ef4444;
  }
`;

const ChartSection = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartPlaceholder = styled.div`
  height: 300px;
  background: #f1f5f9;
  border: 2px dashed #cbd5e1;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 1.125rem;
`;

const TopHousesSection = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

const TopHousesTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HouseRanking = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  border: 1px solid #e2e8f0;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RankingNumber = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${props => {
    if (props.rank === 1) return '#fbbf24';
    if (props.rank === 2) return '#9ca3af';
    if (props.rank === 3) return '#cd7f32';
    return '#e5e7eb';
  }};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
`;

const HouseInfo = styled.div`
  flex: 1;
  
  .house-name {
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 0.25rem;
  }
  
  .house-address {
    color: #718096;
    font-size: 0.875rem;
  }
`;

const HouseStats = styled.div`
  text-align: right;
  
  .rental-count {
    font-weight: 600;
    color: #1a202c;
    font-size: 1.125rem;
  }
  
  .revenue {
    color: #10b981;
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #64748b;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
`;

const HostStatistics = () => {
  console.log('HostStatistics component - Component is rendering');
  
  const { user } = useAuth();
  const { showInfo } = useToast();
  const [period, setPeriod] = useState('current_month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [testMode, setTestMode] = useState(false); // Mode test để kiểm tra redirect
  const [stats, setStats] = useState({
    totalHouses: 0, // Số nhà đã đăng
    totalRentals: 0,
    totalRevenue: 0,
    netRevenue: 0,
    topHouses: [],
    leastRentedHouses: [],
    monthlyTrend: [],
    rentalChangePercentage: undefined,
    revenueChangePercentage: undefined,
    occupancyRate: undefined,
    taxAmount: 0,
    platformFee: 0,
    totalDeductions: 0
  });

  const periods = [
    { key: 'current_month', label: 'Tháng này' },
    { key: 'last_month', label: 'Tháng trước' },
    { key: 'last_3_months', label: '3 tháng gần đây' },
    { key: 'last_6_months', label: '6 tháng gần đây' },
    { key: 'current_year', label: 'Năm nay' }
  ];

  useEffect(() => {
    console.log('HostStatistics useEffect - user:', user);
    console.log('HostStatistics useEffect - user.id:', user?.id);
    console.log('HostStatistics useEffect - user.roleName:', user?.roleName);
    console.log('HostStatistics useEffect - period:', period);
    console.log('HostStatistics useEffect - Starting useEffect');
    
    // Cập nhật debug info
    setDebugInfo({
      user: user,
      userId: user?.id,
      userRole: user?.roleName || user?.role || 'N/A',
      token: localStorage.getItem('token') ? 'Yes' : 'No',
      timestamp: new Date().toISOString()
    });
    
    // Kiểm tra quyền truy cập
    if (!user) {
      console.log('HostStatistics useEffect - No user, setting error');
      setError('Vui lòng đăng nhập để xem thống kê');
      setLoading(false);
      return;
    }
    
    // Kiểm tra và sửa roleName nếu cần
    let currentUser = user;
    
    // Kiểm tra cả role và roleName
    const hasValidRole = (user.roleName && user.roleName.toUpperCase() === 'HOST') || 
                        (user.role && user.role.toUpperCase() === 'HOST');
    
    if (!hasValidRole) {
      console.log('HostStatistics useEffect - User has no valid HOST role, trying to fix from JWT token');
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('HostStatistics useEffect - JWT payload:', payload);
          
          if (payload.role === 'ROLE_HOST') {
            currentUser = { ...user, roleName: 'HOST', role: 'HOST' };
            console.log('HostStatistics useEffect - Fixed user roleName and role to HOST');
            
            // Cập nhật localStorage và context
            localStorage.setItem('user', JSON.stringify(currentUser));
            // Dispatch event để cập nhật context
            window.dispatchEvent(new CustomEvent('userRoleUpdated', { detail: currentUser }));
          }
        }
      } catch (error) {
        console.error('HostStatistics useEffect - Error parsing JWT token:', error);
      }
    }
    
    if (!currentUser.roleName && !currentUser.role) {
      console.log('HostStatistics useEffect - User is not HOST, setting error');
      setError('Bạn không có quyền truy cập thống kê chủ nhà');
      setLoading(false);
      return;
    }
    
    // Kiểm tra xem có phải HOST không
    const isHost = (currentUser.roleName && currentUser.roleName.toUpperCase() === 'HOST') || 
                   (currentUser.role && currentUser.role.toUpperCase() === 'HOST');
    
    if (!isHost) {
      console.log('HostStatistics useEffect - User is not HOST, setting error');
      setError('Bạn không có quyền truy cập thống kê chủ nhà');
      setLoading(false);
      return;
    }
    
    if (currentUser?.id) {
      console.log('HostStatistics useEffect - Fetching statistics for user:', currentUser.id);
      fetchStatistics();
    } else {
      console.log('HostStatistics useEffect - No user ID, setting error');
      setError('Không thể xác định thông tin người dùng');
      setLoading(false);
    }
  }, [user?.id, user?.roleName, period]);

  // Theo dõi URL changes để debug redirect
  useEffect(() => {
    const handleUrlChange = () => {
      console.log('HostStatistics URL change detected:', window.location.href);
      setDebugInfo(prev => ({
        ...prev,
        urlChanges: (prev.urlChanges || 0) + 1,
        lastUrlChange: window.location.href,
        timestamp: new Date().toISOString()
      }));
    };

    // Theo dõi popstate event (back/forward button)
    window.addEventListener('popstate', handleUrlChange);
    
    // Theo dõi pushstate/replacestate
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      console.log('HostStatistics pushState called:', args);
      originalPushState.apply(history, args);
      handleUrlChange();
    };
    
    history.replaceState = function(...args) {
      console.log('HostStatistics replaceState called:', args);
      originalReplaceState.apply(history, args);
      handleUrlChange();
    };

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  const fetchStatistics = async () => {
    try {
      console.log('HostStatistics fetchStatistics - Starting fetch for period:', period);
      console.log('HostStatistics fetchStatistics - About to call hostApi.getStatistics');
      setLoading(true);
      setError(null);
      
      // Truyền period parameter để backend có thể lọc theo kỳ thời gian
      const response = await hostApi.getStatistics(period);
      console.log('HostStatistics fetchStatistics - API response received:', response);
      console.log('HostStatistics fetchStatistics - Response data:', response.data);
      
      // Xử lý response format từ backend: { code: "00", message: "...", data: HostStatisticsDTO }
      let statisticsData;
      if (response.data && response.data.data) {
        statisticsData = response.data.data;
        console.log('HostStatistics fetchStatistics - Using response.data.data:', statisticsData);
      } else if (response.data) {
        statisticsData = response.data;
        console.log('HostStatistics fetchStatistics - Using response.data directly:', statisticsData);
      } else {
        throw new Error('Response format không hợp lệ');
      }
      
      console.log('HostStatistics fetchStatistics - Setting stats with:', statisticsData);
      setStats(statisticsData);
      
    } catch (err) {
      console.error('HostStatistics fetchStatistics - Error:', err);
      console.error('HostStatistics fetchStatistics - Error response:', err.response);
      console.error('HostStatistics fetchStatistics - Error status:', err.response?.status);
      
      let errorMessage = 'Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        // Không redirect, chỉ hiển thị lỗi
      } else if (err.response?.status === 403) {
        errorMessage = 'Bạn không có quyền truy cập dữ liệu thống kê.';
        // Không redirect, chỉ hiển thị lỗi
      } else if (err.response?.status === 404) {
        errorMessage = 'Không tìm thấy dữ liệu thống kê.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.data) {
        // Trường hợp backend trả về error message trong data field
        errorMessage = err.response.data.data;
      }
      
      // Thêm thông tin debug chi tiết hơn
      console.error('HostStatistics fetchStatistics - Detailed error info:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url,
        method: err.config?.method
      });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    // TODO: Implement export functionality
    showInfo('Thông báo', 'Tính năng xuất báo cáo sẽ được phát triển sau');
  };

  const handleFixUserData = () => {
    console.log('HostStatistics - Manual fix user data triggered');
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('HostStatistics - JWT payload:', payload);
        
        if (payload.role === 'ROLE_HOST') {
          const fixedUser = { ...user, roleName: 'HOST', role: 'HOST' };
          localStorage.setItem('user', JSON.stringify(fixedUser));
          console.log('HostStatistics - Fixed user data manually:', fixedUser);
          
          // Dispatch event để cập nhật context
          window.dispatchEvent(new CustomEvent('userRoleUpdated', { detail: fixedUser }));
          
          // Reload component
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('HostStatistics - Error fixing user data:', error);
    }
  };

  const handleRefresh = () => {
    fetchStatistics();
  };

  // Test component để kiểm tra redirect
  if (process.env.NODE_ENV === 'development') {
    console.log('HostStatistics render - Component rendering, user:', user);
    console.log('HostStatistics render - Current URL:', window.location.href);
  }

  // Test mode - chỉ hiển thị debug info
  if (testMode) {
    return (
      <StatisticsContainer>
        <StatisticsHeader>
          <HeaderTitle>
            <BarChart3 size={24} />
            Test Mode - Debug Info
          </HeaderTitle>
          <HeaderActions>
            <ActionButton onClick={() => setTestMode(false)}>
              Tắt Test Mode
            </ActionButton>
          </HeaderActions>
        </StatisticsHeader>
        <StatisticsContent>
          <div style={{ 
            background: '#f0f9ff', 
            border: '1px solid #bae6fd', 
            borderRadius: '0.5rem', 
            padding: '1rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            <strong>Test Mode Debug Info:</strong><br/>
            User ID: {debugInfo.userId || 'N/A'}<br/>
            User Role: {debugInfo.userRole || 'N/A'}<br/>
            Token exists: {debugInfo.token || 'N/A'}<br/>
            Timestamp: {debugInfo.timestamp || 'N/A'}<br/>
            Current URL: {window.location.href}<br/>
            URL Changes: {debugInfo.urlChanges || 0}<br/>
            Last URL Change: {debugInfo.lastUrlChange || 'N/A'}<br/>
            User Object: {JSON.stringify(debugInfo.user, null, 2)}
          </div>
          <div style={{ 
            background: '#fef3c7', 
            border: '1px solid #fbbf24', 
            borderRadius: '0.5rem', 
            padding: '1rem',
            fontSize: '0.875rem'
          }}>
            <strong>Test Mode Active:</strong> Component này chỉ hiển thị debug info và không gọi API. 
            Sử dụng để kiểm tra xem có bị redirect không.
          </div>
        </StatisticsContent>
      </StatisticsContainer>
    );
  }

  if (loading) {
    return (
      <StatisticsContainer>
        <LoadingSpinner>
          <RefreshCw size={24} className="animate-spin" />
          <span style={{ marginLeft: '0.5rem' }}>Đang tải thống kê...</span>
        </LoadingSpinner>
      </StatisticsContainer>
    );
  }

  if (error) {
    return (
      <StatisticsContainer>
        <ErrorMessage>
          <div style={{ marginBottom: '1rem' }}>⚠️ {error}</div>
          <div style={{ 
            background: '#f0f9ff', 
            border: '1px solid #bae6fd', 
            borderRadius: '0.5rem', 
            padding: '1rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            <strong>Debug Info:</strong><br/>
            User ID: {debugInfo.userId || 'N/A'}<br/>
            User Role: {debugInfo.userRole || 'N/A'}<br/>
            Token exists: {debugInfo.token || 'N/A'}<br/>
            Timestamp: {debugInfo.timestamp || 'N/A'}<br/>
            Current URL: {window.location.href}<br/>
            URL Changes: {debugInfo.urlChanges || 0}<br/>
            Last URL Change: {debugInfo.lastUrlChange || 'N/A'}<br/>
            User Object: {JSON.stringify(debugInfo.user, null, 2)}
          </div>
          <ActionButton onClick={handleRefresh}>
            <RefreshCw size={16} />
            Thử lại
          </ActionButton>
          <ActionButton 
            onClick={handleFixUserData}
            style={{ 
              background: '#059669', 
              color: 'white',
              marginLeft: '0.5rem'
            }}
          >
            🔧 Sửa quyền truy cập
          </ActionButton>
          <ActionButton 
            onClick={() => {
              console.log('Testing API endpoint manually...');
              fetchStatistics();
            }}
            style={{ 
              background: '#7c3aed', 
              color: 'white',
              marginLeft: '0.5rem'
            }}
          >
            🧪 Test API
          </ActionButton>
        </ErrorMessage>
      </StatisticsContainer>
    );
  }

  return (
    <StatisticsContainer>
      <StatisticsHeader>
        <HeaderTitle>
          <BarChart3 size={24} />
          Thống kê & Báo cáo
        </HeaderTitle>
        <HeaderActions>
          <ActionButton onClick={handleRefresh}>
            <RefreshCw size={16} />
            Làm mới
          </ActionButton>
          <ActionButton onClick={handleExportReport}>
            <Download size={16} />
            Xuất báo cáo
          </ActionButton>
        </HeaderActions>
      </StatisticsHeader>

      <StatisticsContent>
        <PeriodSelector>
          {periods.map((p) => (
            <PeriodButton
              key={p.key}
              active={period === p.key}
              onClick={() => setPeriod(p.key)}
            >
              {p.label}
            </PeriodButton>
          ))}
        </PeriodSelector>

        <StatsGrid>
          <StatCard>
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#3b82f6' }}>
                <Home size={20} />
              </div>
            </div>
            <div className="stat-value">{stats.totalHouses}</div>
            <div className="stat-label">Số nhà đã đăng</div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#10b981' }}>
                <Home size={20} />
              </div>
            </div>
            <div className="stat-value">{stats.totalRentals}</div>
            <div className="stat-label">Số nhà được thuê</div>
            {stats.rentalChangePercentage !== undefined && (
              <div className={`stat-change ${stats.rentalChangePercentage >= 0 ? 'positive' : 'negative'}`}>
                {stats.rentalChangePercentage >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {stats.rentalChangePercentage >= 0 ? '+' : ''}{stats.rentalChangePercentage.toFixed(1)}% so với kỳ trước
              </div>
            )}
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#f59e0b' }}>
                <DollarSign size={20} />
              </div>
            </div>
            <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
            <div className="stat-label">Doanh thu dự kiến</div>
            {stats.revenueChangePercentage !== undefined && (
              <div className={`stat-change ${stats.revenueChangePercentage >= 0 ? 'positive' : 'negative'}`}>
                {stats.revenueChangePercentage >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {stats.revenueChangePercentage >= 0 ? '+' : ''}{stats.revenueChangePercentage.toFixed(1)}% so với kỳ trước
              </div>
            )}
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#8b5cf6' }}>
                <Calendar size={20} />
              </div>
            </div>
            <div className="stat-value">{stats.occupancyRate ? `${stats.occupancyRate.toFixed(1)}%` : 'N/A'}</div>
            <div className="stat-label">Tỷ lệ lấp đầy</div>
            <div className="stat-change positive">
              <TrendingUp size={16} />
              Dựa trên thời gian thuê thực tế
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#ef4444' }}>
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="stat-value">{formatCurrency(stats.netRevenue)}</div>
            <div className="stat-label">Doanh thu sau thuế & phí</div>
            {stats.revenueChangePercentage !== undefined && (
              <div className={`stat-change ${stats.revenueChangePercentage >= 0 ? 'positive' : 'negative'}`}>
                {stats.revenueChangePercentage >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {stats.revenueChangePercentage >= 0 ? '+' : ''}{stats.revenueChangePercentage.toFixed(1)}% so với kỳ trước
              </div>
            )}
          </StatCard>
        </StatsGrid>

        <ChartSection>
          <ChartTitle>
            <TrendingUp size={20} />
            Xu hướng doanh thu theo tháng
          </ChartTitle>
          {stats.monthlyTrend && stats.monthlyTrend.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '1rem' 
            }}>
              {stats.monthlyTrend.map((month, index) => (
                <div key={index} style={{ 
                  background: 'white', 
                  padding: '1rem', 
                  borderRadius: '0.5rem', 
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontWeight: '600', color: '#1a202c', marginBottom: '0.5rem' }}>
                    Tháng {month.month}/{month.year}
                  </div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.25rem' }}>
                    {formatCurrency(month.revenue)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                    {month.rentalCount} đơn thuê
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ChartPlaceholder>
              Chưa có dữ liệu xu hướng doanh thu
            </ChartPlaceholder>
          )}
        </ChartSection>

        <TopHousesSection>
          <TopHousesTitle>
            <Home size={20} />
            Top nhà được thuê nhiều nhất
          </TopHousesTitle>
          
          {stats.topHouses && stats.topHouses.length > 0 ? (
            stats.topHouses.map((house, index) => (
              <HouseRanking key={house.houseId}>
                <RankingNumber rank={index + 1}>{index + 1}</RankingNumber>
                <HouseInfo>
                  <div className="house-name">{house.houseTitle}</div>
                  <div className="house-address">{house.address}</div>
                </HouseInfo>
                <HouseStats>
                  <div className="rental-count">{house.rentalCount} lần</div>
                  <div className="revenue">{formatCurrency(house.totalRevenue)}</div>
                </HouseStats>
              </HouseRanking>
            ))
          ) : (
            <div style={{ textAlign: 'center', color: '#718096', padding: '1rem' }}>
              Chưa có dữ liệu về nhà được thuê
            </div>
          )}

          {stats.leastRentedHouses && stats.leastRentedHouses.length > 0 && (
            <>
              <TopHousesTitle style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                <Home size={20} />
                Nhà được thuê ít nhất
              </TopHousesTitle>
              {stats.leastRentedHouses.map((house, index) => (
                <HouseRanking key={house.houseId}>
                  <RankingNumber rank={stats.leastRentedHouses.length - index}>↓</RankingNumber>
                  <HouseInfo>
                    <div className="house-name">{house.houseTitle}</div>
                    <div className="house-address">{house.address}</div>
                  </HouseInfo>
                  <HouseStats>
                    <div className="rental-count">{house.rentalCount} lần</div>
                    <div className="revenue">{formatCurrency(house.totalRevenue)}</div>
                  </HouseStats>
                </HouseRanking>
              ))}
            </>
          )}
        </TopHousesSection>

        <div style={{ 
          background: '#f0f9ff', 
          border: '1px solid #bae6fd', 
          borderRadius: '0.5rem', 
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{ fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem' }}>
            💡 Thông tin về thuế và phí
          </div>
          <div style={{ fontSize: '0.875rem', color: '#0c4a6e', marginBottom: '1rem' }}>
            • Thuế thu nhập: 10% trên doanh thu<br/>
            • Phí sàn: 10% trên doanh thu<br/>
            • Doanh thu thực nhận = Doanh thu gốc × 0.8
          </div>
          {stats.taxAmount && stats.platformFee && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem',
              fontSize: '0.875rem'
            }}>
              <div style={{ background: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
                <div style={{ color: '#0369a1', fontWeight: '600' }}>Thuế thu nhập:</div>
                <div style={{ color: '#0c4a6e' }}>{formatCurrency(stats.taxAmount)}</div>
              </div>
              <div style={{ background: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
                <div style={{ color: '#0369a1', fontWeight: '600' }}>Phí sàn:</div>
                <div style={{ color: '#0c4a6e' }}>{formatCurrency(stats.platformFee)}</div>
              </div>
              <div style={{ background: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
                <div style={{ color: '#0369a1', fontWeight: '600' }}>Tổng khấu trừ:</div>
                <div style={{ color: '#0c4a6e' }}>{formatCurrency(stats.totalDeductions)}</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ 
          background: '#f0f4ff', 
          border: '1px solid #c7d2fe', 
          borderRadius: '0.5rem', 
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{ fontWeight: '600', color: '#3730a3', marginBottom: '0.5rem' }}>
            🏠 Thông tin tổng quan về nhà đã đăng
          </div>
          <div style={{ fontSize: '0.875rem', color: '#312e81', marginBottom: '1rem' }}>
            • Tổng số nhà đã đăng: {stats.totalHouses} nhà<br/>
            • Số nhà được thuê trong kỳ: {stats.totalRentals} nhà<br/>
            • Tỷ lệ nhà được thuê: {stats.totalHouses > 0 ? ((stats.totalRentals / stats.totalHouses) * 100).toFixed(1) : 0}%<br/>
            • Tỷ lệ lấp đầy: {stats.occupancyRate ? `${stats.occupancyRate.toFixed(1)}%` : 'N/A'}
          </div>
          {stats.totalHouses > 0 && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem',
              fontSize: '0.875rem'
            }}>
              <div style={{ background: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #c7d2fe' }}>
                <div style={{ color: '#3730a3', fontWeight: '600' }}>Tổng số nhà:</div>
                <div style={{ color: '#312e81', fontSize: '1.125rem', fontWeight: 'bold' }}>{stats.totalHouses} nhà</div>
              </div>
              <div style={{ background: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #c7d2fe' }}>
                <div style={{ color: '#3730a3', fontWeight: '600' }}>Nhà được thuê:</div>
                <div style={{ color: '#10b981', fontSize: '1.125rem', fontWeight: 'bold' }}>{stats.totalRentals} nhà</div>
              </div>
              <div style={{ background: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #c7d2fe' }}>
                <div style={{ color: '#3730a3', fontWeight: '600' }}>Tỷ lệ thuê:</div>
                <div style={{ color: '#8b5cf6', fontSize: '1.125rem', fontWeight: 'bold' }}>
                  {stats.totalHouses > 0 ? ((stats.totalRentals / stats.totalHouses) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div style={{ background: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #c7d2fe' }}>
                <div style={{ color: '#3730a3', fontWeight: '600' }}>Tỷ lệ lấp đầy:</div>
                <div style={{ color: '#8b5cf6', fontSize: '1.125rem', fontWeight: 'bold' }}>
                  {stats.occupancyRate ? `${stats.occupancyRate.toFixed(1)}%` : 'N/A'}
                </div>
              </div>
            </div>
          )}
        </div>
      </StatisticsContent>
    </StatisticsContainer>
  );
};

export default HostStatistics;
