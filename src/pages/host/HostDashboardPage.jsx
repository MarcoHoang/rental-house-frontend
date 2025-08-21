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
  User,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import propertyApi from '../../api/propertyApi';
import HouseList from '../../components/house/HouseList.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EditHouseModal from '../../components/admin/EditHouseModal';
import ToastContainer from '../../components/common/ToastContainer';
import ConfirmModal from '../../components/common/ConfirmModal';
import HostChatManager from '../../components/host/HostChatManager';
import HostStatistics from '../../components/host/HostStatistics';
import { extractHousesFromResponse } from '../../utils/apiHelpers';
import { HOUSE_STATUS_LABELS } from '../../utils/constants';

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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  
  // Toast state
  const [toasts, setToasts] = useState([]);
  
  // Confirm delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [houseToDelete, setHouseToDelete] = useState(null);
  
  // Chat manager state
  const [showChatManager, setShowChatManager] = useState(false);
  
  // Statistics state
  const [showStatistics, setShowStatistics] = useState(false);

  // Toast helper functions
  const showToast = (type, title, message) => {
    const id = Date.now();
    const newToast = { id, type, title, message };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (!user?.id) {
          setLoading(false);
          return;
        }
        
        // Fetch properties của chủ nhà - sử dụng my-houses endpoint
        const propertiesResponse = await propertyApi.getMyHouses();
        
        // Xử lý response format từ API
        let properties = [];
        if (Array.isArray(propertiesResponse)) {
          properties = propertiesResponse;
        } else if (propertiesResponse && Array.isArray(propertiesResponse.data)) {
          properties = propertiesResponse.data;
        } else if (propertiesResponse && Array.isArray(propertiesResponse.content)) {
          properties = propertiesResponse.content;
        } else {
          console.warn('Unexpected response format from getMyHouses:', propertiesResponse);
          properties = [];
        }
        
        setHouses(properties);
        setFilteredHouses(properties);
        
        // Cập nhật stats dựa trên dữ liệu thực tế
        const newStats = {
          totalProperties: properties.length,
          activeBookings: 0, // Sẽ fetch từ API booking sau
          totalIncome: 0, // Sẽ fetch từ API revenue sau
          averageRating: 0 // Sẽ fetch từ API rating sau
        };
        
        setStats(newStats);
        setError(null);
              } catch (err) {
          console.error('Lỗi khi fetch dữ liệu:', err);
          
          // Hiển thị thông báo lỗi chi tiết hơn
          let errorMessage = 'Không thể tải dữ liệu. Vui lòng thử lại sau.';
          
          if (err.response) {
            // Lỗi từ server
            if (err.response.data && err.response.data.message) {
              errorMessage = err.response.data.message;
            } else if (err.response.status === 401) {
              errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
            } else if (err.response.status === 403) {
              errorMessage = 'Bạn không có quyền truy cập dữ liệu này.';
            } else if (err.response.status === 404) {
              errorMessage = 'Không tìm thấy dữ liệu.';
            }
          } else if (err.request) {
            // Lỗi network
            errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
          }
          
          // Đảm bảo errorMessage là string
          setError(String(errorMessage));
          showToast('error', 'Lỗi tải dữ liệu', String(errorMessage));
        } finally {
          setLoading(false);
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
    setSelectedHouse(house);
    setEditModalOpen(true);
  };

  // Xử lý lưu chỉnh sửa nhà
  const handleSaveEdit = async (updatedHouse) => {
    try {
      // Gọi API cập nhật nhà thực tế
      await propertyApi.updateHouse(updatedHouse.id, updatedHouse);
      
      // Cập nhật danh sách sau khi chỉnh sửa
      setHouses(prevHouses => 
        prevHouses.map(h => h.id === updatedHouse.id ? updatedHouse : h)
      );
      
      setEditModalOpen(false);
      setSelectedHouse(null);
      
      // Hiển thị thông báo thành công
      showToast('success', 'Cập nhật nhà thành công', 'Nhà đã được cập nhật thành công.');
    } catch (error) {
      console.error('Lỗi khi cập nhật nhà:', error);
      
      // Hiển thị thông báo lỗi chi tiết hơn
      let errorMessage = 'Có lỗi xảy ra khi cập nhật nhà. Vui lòng thử lại.';
      
      if (error.response) {
        // Lỗi từ server
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.status === 403) {
          errorMessage = 'Bạn không có quyền cập nhật nhà này.';
        } else if (error.response.status === 404) {
          errorMessage = 'Không tìm thấy nhà cần cập nhật.';
        }
      } else if (error.request) {
        // Lỗi network
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      }
      
      showToast('error', 'Lỗi cập nhật nhà', errorMessage);
    }
  };

  // Refresh dữ liệu house sau khi thao tác ảnh
  const handleHouseUpdate = async () => {
    try {
      if (!selectedHouse?.id) return;
      
      // Fetch lại dữ liệu house cụ thể
      const updatedHouse = await propertyApi.getHouseById(selectedHouse.id);
      
      // Chỉ cập nhật imageUrls, giữ nguyên các field khác của selectedHouse
      const houseWithUpdatedImages = {
        ...selectedHouse,
        imageUrls: updatedHouse.imageUrls
      };
      
      // Cập nhật selectedHouse và houses
      setSelectedHouse(houseWithUpdatedImages);
      setHouses(prevHouses => 
        prevHouses.map(h => h.id === updatedHouse.id ? houseWithUpdatedImages : h)
      );
    } catch (error) {
      console.error('Lỗi khi refresh dữ liệu house:', error);
    }
  };

  // Xử lý xóa nhà
  const handleDeleteHouse = async (house) => {
    setHouseToDelete(house);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!houseToDelete) return;

    try {
      // Gọi API xóa nhà thực tế
      await propertyApi.deleteHouse(houseToDelete.id);
      
      // Cập nhật danh sách sau khi xóa
      setHouses(prevHouses => prevHouses.filter(h => h.id !== houseToDelete.id));
      
      // Cập nhật stats
      setStats(prev => ({
        ...prev,
        totalProperties: prev.totalProperties - 1
      }));
      
      showToast('success', 'Xóa nhà thành công', 'Nhà đã được xóa thành công.');
    } catch (error) {
      console.error('Lỗi khi xóa nhà:', error);
      
      // Hiển thị thông báo lỗi chi tiết hơn
      let errorMessage = 'Có lỗi xảy ra khi xóa nhà. Vui lòng thử lại.';
      
      if (error.response) {
        // Lỗi từ server
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.status === 403) {
          errorMessage = 'Bạn không có quyền xóa nhà này.';
        } else if (error.response.status === 404) {
          errorMessage = 'Không tìm thấy nhà cần xóa.';
        }
      } else if (error.request) {
        // Lỗi network
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      }
      
      showToast('error', 'Lỗi xóa nhà', errorMessage);
    } finally {
      setDeleteModalOpen(false);
      setHouseToDelete(null);
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
            {Object.entries(HOUSE_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
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
            fromPage="host"
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

        {/* Statistics Section */}
        {showStatistics && (
          <div style={{ marginBottom: '2rem' }}>
            <HostStatistics />
          </div>
        )}

        <PropertiesSection>
          <SectionTitle>
            <Home size={20} />
            Nhà đã đăng ({filteredHouses.length}/{houses.length})
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={() => setShowStatistics(!showStatistics)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: showStatistics ? '#10b981' : '#f3f4f6',
                  color: showStatistics ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <TrendingUp size={16} />
                {showStatistics ? 'Ẩn thống kê' : 'Xem thống kê'}
              </button>
              <button
                onClick={() => setShowChatManager(!showChatManager)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: showChatManager ? '#3b82f6' : '#f3f4f6',
                  color: showChatManager ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <MessageCircle size={16} />
                {showChatManager ? 'Ẩn tin nhắn' : 'Xem tin nhắn'}
              </button>
              {houses.length > 0 && (
                <span style={{ fontSize: '0.875rem', color: '#718096' }}>
                  Tổng cộng {houses.length} nhà
                </span>
              )}
            </div>
          </SectionTitle>
          {renderPropertiesContent()}
        </PropertiesSection>

        {/* Chat Manager Section */}
        {showChatManager && (
          <div style={{ marginTop: '2rem' }}>
            <HostChatManager />
          </div>
        )}
      </MainContent>

      {/* Modal chỉnh sửa nhà */}
      <EditHouseModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedHouse(null);
        }}
        house={selectedHouse}
        onSave={handleSaveEdit}
        onHouseUpdate={handleHouseUpdate}
      />

             {/* Toast messages */}
       <ToastContainer 
         toasts={toasts}
         onRemoveToast={removeToast}
       />

             {/* Confirm delete modal */}
       <ConfirmModal
         isOpen={deleteModalOpen}
         onCancel={() => setDeleteModalOpen(false)}
         onConfirm={handleConfirmDelete}
         title="Xác nhận xóa nhà"
         message={`Bạn có chắc chắn muốn xóa nhà "${houseToDelete?.title || houseToDelete?.name}"?`}
         type="danger"
         confirmText="Xóa nhà"
         cancelText="Hủy"
       />
    </DashboardContainer>
  );
};

export default HostDashboardPage;

