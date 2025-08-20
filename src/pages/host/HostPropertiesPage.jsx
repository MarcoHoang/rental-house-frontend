import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import propertyApi from '../../api/propertyApi';
import HouseList from '../../components/house/HouseList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EditHouseModal from '../../components/admin/EditHouseModal';
import ToastContainer from '../../components/common/ToastContainer';
import ConfirmModal from '../../components/common/ConfirmModal';
import { extractHousesFromResponse } from '../../utils/apiHelpers';
import { HOUSE_STATUS_LABELS } from '../../utils/constants';
import HostPageWrapper from '../../components/layout/HostPageWrapper';
import { Plus, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #5a67d8;
    transform: translateY(-1px);
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

const HostPropertiesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
        
        // Fetch properties của chủ nhà
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
        setError(null);
      } catch (err) {
        console.error('Lỗi khi fetch dữ liệu:', err);
        
        let errorMessage = 'Không thể tải dữ liệu. Vui lòng thử lại sau.';
        
        if (err.response) {
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
          errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
        }
        
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
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(house =>
        (house.title && house.title.toLowerCase().includes(term)) ||
        (house.name && house.name.toLowerCase().includes(term)) ||
        (house.address && house.address.toLowerCase().includes(term))
      );
    }

    setFilteredHouses(filtered);
  }, [houses, searchTerm, statusFilter]);

  const handleEditHouse = (house) => {
    setSelectedHouse(house);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedHouse) => {
    try {
      // Gọi API cập nhật nhà
      await propertyApi.updateHouse(updatedHouse.id, updatedHouse);
      
      // Cập nhật danh sách
      setHouses(prevHouses =>
        prevHouses.map(house =>
          house.id === updatedHouse.id ? { ...house, ...updatedHouse } : house
        )
      );
      
      showToast('success', 'Cập nhật thành công', 'Thông tin nhà đã được cập nhật.');
      setEditModalOpen(false);
      setSelectedHouse(null);
    } catch (error) {
      console.error('Lỗi khi cập nhật nhà:', error);
      showToast('error', 'Lỗi cập nhật', 'Không thể cập nhật thông tin nhà.');
    }
  };

  const handleHouseUpdate = (updatedHouse) => {
    setHouses(prevHouses =>
      prevHouses.map(house =>
        house.id === updatedHouse.id ? updatedHouse : house
      )
    );
  };

  const handleDeleteHouse = (house) => {
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
      
      showToast('success', 'Xóa nhà thành công', 'Nhà đã được xóa thành công.');
    } catch (error) {
      console.error('Lỗi khi xóa nhà:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi xóa nhà. Vui lòng thử lại.';
      
      if (error.response) {
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
            <Plus size={24} />
          </div>
          <div className="empty-title">Chưa có nhà nào được đăng</div>
          <div className="empty-description">
            Bắt đầu bằng cách đăng tin cho thuê đầu tiên của bạn
          </div>
          <button 
            onClick={() => navigate('/host/post')} 
            className="empty-action"
          >
            <Plus size={16} />
            Đăng tin mới
          </button>
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
          <ActionButton onClick={() => navigate('/host/post')}>
            <Plus size={16} />
            Đăng tin mới
          </ActionButton>
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
    <HostPageWrapper 
      title="Quản lý tài sản"
      subtitle="Đăng tin mới và quản lý các tài sản đã đăng"
    >
      {renderPropertiesContent()}

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
    </HostPageWrapper>
  );
};

export default HostPropertiesPage;
