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
import propertyApi from '../../api/propertyApi';
import HouseList from '../../components/house/HouseList';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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

const PropertiesSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchAndFilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #718096;
  
  .empty-icon {
    width: 4rem;
    height: 4rem;
    margin: 0 auto 1rem;
    background: #f1f5f9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
  }
  
  .empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #475569;
  }
  
  .empty-description {
    margin-bottom: 1.5rem;
  }
  
  .empty-action {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #667eea;
    color: white;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
    
    &:hover {
      background: #5a67d8;
      transform: translateY(-1px);
    }
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
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        console.log('=== FETCHING DATA START ===');
        console.log('User object:', user);
        console.log('User ID:', user?.id);
        
        if (!user?.id) {
          console.log('User ID not available yet, skipping fetch');
          setLoading(false);
          return;
        }
        
        console.log('Fetching properties for user ID:', user.id);
        
        // Fetch properties của chủ nhà theo hostId
        const propertiesResponse = await propertyApi.getPropertiesByHostId(user.id);
        console.log('API Response:', propertiesResponse);
        
        const properties = propertiesResponse.content || propertiesResponse.data || [];
        console.log('Extracted properties:', properties);
        console.log('Properties length:', properties.length);
        
        setHouses(properties);
        setFilteredHouses(properties);
        
        // Cập nhật stats dựa trên dữ liệu thực tế
        const newStats = {
          totalProperties: properties.length,
          activeBookings: 0, // Sẽ fetch từ API booking sau
          totalIncome: 0, // Sẽ fetch từ API revenue sau
          averageRating: 0 // Sẽ fetch từ API rating sau
        };
        
        console.log('Setting new stats:', newStats);
        setStats(newStats);
        
        setError(null);
        console.log('=== FETCHING DATA SUCCESS ===');
      } catch (err) {
        console.error('=== FETCHING DATA ERROR ===');
        console.error('Lỗi khi fetch dữ liệu:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
        console.log('=== FETCHING DATA END ===');
      }
    };

    fetchData();
  }, [user?.id]);

  // Filter và search nhà
  useEffect(() => {
    let filtered = houses;
    
    // Filter theo status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(house => house.status === statusFilter);
    }
    
    // Search theo tên hoặc địa chỉ
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(house => 
        (house.title && house.title.toLowerCase().includes(term)) ||
        (house.name && house.name.toLowerCase().includes(term)) ||
        (house.address && house.address.toLowerCase().includes(term))
      );
    }
    
    setFilteredHouses(filtered);
  }, [houses, searchTerm, statusFilter]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Xử lý chỉnh sửa nhà
  const handleEditHouse = (house) => {
    // TODO: Chuyển hướng đến trang chỉnh sửa
    console.log('Chỉnh sửa nhà:', house);
    // Có thể chuyển hướng đến trang edit: navigate(`/host/properties/${house.id}/edit`)
  };

  // Xử lý xóa nhà
  const handleDeleteHouse = async (house) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhà "${house.title || house.name}"?`)) {
      try {
        // TODO: Gọi API xóa nhà
        console.log('Xóa nhà:', house);
        // await propertyApi.deleteProperty(house.id);
        
        // Cập nhật danh sách sau khi xóa
        setHouses(prevHouses => prevHouses.filter(h => h.id !== house.id));
        
        // Cập nhật stats
        setStats(prev => ({
          ...prev,
          totalProperties: prev.totalProperties - 1
        }));
        
        alert('Đã xóa nhà thành công!');
      } catch (error) {
        console.error('Lỗi khi xóa nhà:', error);
        alert('Có lỗi xảy ra khi xóa nhà. Vui lòng thử lại.');
      }
    }
  };

  const renderPropertiesContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    
    if (error) {
      return (
        <div style={{ textAlign: 'center', color: '#ef4444' }}>
          {error}
        </div>
      );
    }
    
    if (houses.length === 0) {
      return (
        <EmptyState>
          <div className="empty-icon">
            <Home size={24} />
          </div>
          <div className="empty-title">Chưa có nhà nào được đăng</div>
          <div className="empty-description">
            Bắt đầu bằng cách đăng tin cho thuê đầu tiên của bạn
          </div>
          <Link to="/host/post" className="empty-action">
            <Plus size={16} />
            Đăng tin mới
          </Link>
        </EmptyState>
      );
    }
    
    return (
      <>
        <SearchAndFilterBar>
          <SearchInput
            type="text"
            placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang cho thuê</option>
            <option value="INACTIVE">Tạm dừng</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="RENTED">Đã cho thuê</option>
          </FilterSelect>
        </SearchAndFilterBar>
        
        {filteredHouses.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>
            Không tìm thấy nhà nào phù hợp với tiêu chí tìm kiếm.
          </div>
        ) : (
          <HouseList 
            houses={filteredHouses} 
            showActions={true}
            onEdit={handleEditHouse}
            onDelete={handleDeleteHouse}
          />
        )}
      </>
    );
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

        <PropertiesSection>
          <SectionTitle>
            <Home size={20} />
            Nhà đã đăng ({filteredHouses.length}/{houses.length})
            {houses.length > 0 && (
              <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: '#718096' }}>
                Tổng cộng {houses.length} nhà
              </span>
            )}
          </SectionTitle>
          {renderPropertiesContent()}
        </PropertiesSection>
      </MainContent>
    </DashboardContainer>
  );
};

export default HostDashboardPage;

