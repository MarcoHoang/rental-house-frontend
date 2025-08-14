// src/components/admin/HouseManagement.jsx (Đã sửa)

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { housesApi } from "../../api/adminApi";
import {
  RefreshCw,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Home,
  MapPin,
  DollarSign,
} from "lucide-react";
import { useToast } from "../common/Toast";

const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: white;
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }

  &.primary {
    background: #3182ce;
    color: white;
    border-color: #3182ce;

    &:hover {
      background: #2c5aa0;
    }
  }

  &.danger {
    color: #e53e3e;
    &:hover {
      background: #fed7d7;
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
`;

const HouseCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const HouseImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const HouseInfo = styled.div`
  padding: 1rem;
`;

const HouseTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const HouseDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;
`;

const Price = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2f855a;
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  &.available {
    background-color: #c6f6d5;
    color: #22543d;
  }
  &.rented {
    background-color: #fed7d7;
    color: #742a2a;
  }
  &.inactive {
    background-color: #e2e8f0;
    color: #4a5568;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #4a5568;

  .spinner {
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #e53e3e;
  background-color: #fed7d7;
  border-radius: 0.5rem;
  margin: 1.5rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #718096;
  text-align: center;

  svg {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

// Helper để format tiền tệ
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Helper để format giá theo tháng
const formatPricePerMonth = (price) => {
  if (price === null || price === undefined) return "0 ₫/tháng";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price) + "/tháng";
};

const HouseManagement = () => {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { showSuccess, showError } = useToast();

  const fetchHouses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await housesApi.getAll();
      console.log("Houses data:", data);
      setHouses(data.content || data || []);
    } catch (err) {
      console.error("Error fetching houses:", err);
      setError("Không thể tải danh sách nhà.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  const filteredHouses = houses.filter(house =>
    house.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house.hostName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewHouse = (houseId) => {
    navigate(`/admin/houses/${houseId}`);
  };

  const handleDeleteHouse = async (houseId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhà này?")) {
      try {
        await housesApi.delete(houseId);
        showSuccess("Xóa thành công!", "Đã xóa nhà khỏi hệ thống.");
        fetchHouses(); // Refresh list
      } catch (err) {
        showError("Xóa thất bại!", "Không thể xóa nhà. Vui lòng thử lại.");
      }
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return { text: 'Có sẵn', className: 'available' };
      case 'RENTED':
        return { text: 'Đã thuê', className: 'rented' };
      case 'INACTIVE':
        return { text: 'Không hoạt động', className: 'inactive' };
      default:
        return { text: 'Không xác định', className: 'inactive' };
    }
  };

  if (loading) {
    return (
      <Card>
        <LoadingSpinner>
          <RefreshCw className="spinner" />
          <span>Đang tải danh sách nhà...</span>
        </LoadingSpinner>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <ErrorMessage>
          <AlertTriangle style={{ marginRight: "0.5rem" }} />
          {error}
        </ErrorMessage>
      </Card>
    );
  }

  return (
    <Card>
      <Header>
        <Title>Quản lý nhà cho thuê</Title>
        <SearchBar>
          <Search size={16} />
          <SearchInput
            type="text"
            placeholder="Tìm kiếm theo tên, địa chỉ, chủ nhà..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button>
            <Filter size={16} />
            Lọc
          </Button>
          <Button className="primary">
            <Plus size={16} />
            Thêm nhà
          </Button>
        </div>
      </Header>

      {filteredHouses.length === 0 ? (
        <EmptyState>
          <Home />
          <h3>Chưa có nhà nào</h3>
          <p>Hệ thống chưa có nhà cho thuê nào được đăng ký.</p>
        </EmptyState>
      ) : (
        <Grid>
          {filteredHouses.map((house) => {
            const status = getStatusDisplay(house.status);
            const firstImage = house.imageUrls && house.imageUrls.length > 0 
              ? house.imageUrls[0] 
              : null;

            return (
              <HouseCard key={house.id}>
                <HouseImage>
                  {firstImage ? (
                    <img 
                      src={firstImage} 
                      alt={house.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div style={{ 
                    display: firstImage ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%'
                  }}>
                    <Home size={48} />
                  </div>
                </HouseImage>
                
                <HouseInfo>
                  <HouseTitle>{house.title || "Không có tên"}</HouseTitle>
                  
                  <HouseDetails>
                    <DetailRow>
                      <DollarSign size={16} />
                      <Price>{formatPricePerMonth(house.price)}</Price>
                    </DetailRow>
                    
                    <DetailRow>
                      <MapPin size={16} />
                      <span>{house.address || "Chưa cập nhật địa chỉ"}</span>
                    </DetailRow>
                    
                    <DetailRow>
                      <span>Chủ nhà: {house.hostName || "Chưa cập nhật"}</span>
                    </DetailRow>
                  </HouseDetails>

                  <Status className={status.className}>
                    {status.text}
                  </Status>

                  <Actions>
                    <Button onClick={() => handleViewHouse(house.id)}>
                      <Eye size={16} />
                      Xem chi tiết
                    </Button>
                    <Button 
                      className="danger" 
                      onClick={() => handleDeleteHouse(house.id)}
                    >
                      <Trash2 size={16} />
                      Xóa
                    </Button>
                  </Actions>
                </HouseInfo>
              </HouseCard>
            );
          })}
        </Grid>
      )}
    </Card>
  );
};

export default HouseManagement;
