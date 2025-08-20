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
  Home,
  MapPin,
  DollarSign,
} from "lucide-react";
import { useToast } from "../common/Toast";
import AdminSearchBar from "./AdminSearchBar";

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
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;



const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 1rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  th {
    background-color: #f7fafc;
    font-weight: 600;
    color: #4a5568;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }
  td {
    font-size: 0.875rem;
  }
  tbody tr:hover {
    background-color: #f7fafc;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;

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

const ActionContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  .spinner {
    animation: spin 1s linear infinite;
    width: 2rem;
    height: 2rem;
    border: 2px solid #e2e8f0;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #718096;
`;

const ResultsInfo = styled.div`
  padding: 1rem 1.5rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #4a5568;
  text-align: center;
`;

const HouseManagement = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search và filter states - tính năng mới
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'ALL',
    houseType: 'ALL'
  });
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();



  // Fetch houses - logic cũ
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

  // Local filter houses (giống trang chủ) - KHÔNG gọi API
  useEffect(() => {
    if (!houses.length) return;

    let filtered = houses;

    // Filter theo status
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(house => house.status === filters.status);
    }

    // Filter theo houseType
    if (filters.houseType !== 'ALL') {
      filtered = filtered.filter(house => house.houseType === filters.houseType);
    }

    // Search theo tên, địa chỉ (local search)
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(house => 
        (house.title && house.title.toLowerCase().includes(term)) ||
        (house.name && house.name.toLowerCase().includes(term)) ||
        (house.address && house.address.toLowerCase().includes(term)) ||
        (house.description && house.description.toLowerCase().includes(term))
      );
    }

    // Sắp xếp theo thời gian tạo mới nhất (mới nhất ở trên)
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.postDate || 0);
      const dateB = new Date(b.createdAt || b.postDate || 0);
      return dateB - dateA; // Mới nhất lên đầu
    });

    setSearchResults(filtered);
    setIsSearchMode(searchTerm.trim() || filters.status !== 'ALL' || filters.houseType !== 'ALL');
  }, [houses, searchTerm, filters]);



  // Handle delete house - logic cũ
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

  // Initial load - logic cũ
  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);



  const displayHouses = isSearchMode ? searchResults : houses;
  const hasResults = displayHouses && displayHouses.length > 0;

  if (loading) {
    return (
      <LoadingSpinner>
        <div className="spinner"></div>
      </LoadingSpinner>
    );
  }

  if (error) {
    return (
      <EmptyState>
        <AlertTriangle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <p>{error}</p>
      </EmptyState>
    );
  }

  return (
    <div>
      <AdminSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        onSearch={() => {}} // Không cần gọi API, chỉ local filtering
        onClear={() => {
          setSearchTerm("");
          setFilters({ status: "ALL", houseType: "ALL" });
          setIsSearchMode(false);
        }}
        filterOptions={{
          status: [
            { value: "ALL", label: "Tất cả trạng thái" },
            { value: "ACTIVE", label: "Đang hoạt động" },
            { value: "INACTIVE", label: "Không hoạt động" },
            { value: "RENTED", label: "Đã cho thuê" },
          ],
          houseType: [
            { value: "ALL", label: "Tất cả loại" },
            { value: "APARTMENT", label: "Căn hộ" },
            { value: "VILLA", label: "Biệt thự" },
            { value: "TOWNHOUSE", label: "Nhà phố" },
            { value: "BOARDING_HOUSE", label: "Nhà trọ" },
            { value: "WHOLE_HOUSE", label: "Nhà nguyên căn" },
          ],
        }}
        placeholder="Tìm kiếm theo tên, địa chỉ..."
        $showFilters={true}
        debounceMs={300}
      />

      <Card>
        <Header>
          <Title>Quản lý nhà cho thuê</Title>
        </Header>

        <ResultsInfo>
          <span>
            {isSearchMode 
              ? `Tìm thấy ${displayHouses.length} kết quả`
              : `Hiển thị ${displayHouses.length} nhà`
            }
          </span>
        </ResultsInfo>

        {hasResults ? (
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên nhà</th>
                <th>Địa chỉ</th>
                <th>Giá</th>
                <th>Loại nhà</th>
                <th>Trạng thái</th>
                <th>Chủ nhà</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {displayHouses.map((house) => (
                <tr key={house.id}>
                  <td>{house.id}</td>
                  <td>{house.title || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={14} />
                      {house.address || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <DollarSign size={14} />
                      {house.price ? `${house.price.toLocaleString()} VNĐ` : 'N/A'}
                    </div>
                  </td>
                  <td>{house.houseType || 'N/A'}</td>
                  <td>
                    <Badge className={house.status?.toLowerCase()}>
                      {house.status || 'N/A'}
                    </Badge>
                  </td>
                  <td>{house.hostName || 'N/A'}</td>
                  <td>
                    <ActionContainer>
                      <button
                        onClick={() => navigate(`/admin/houses/${house.id}`)}
                        title="Xem chi tiết"
                        style={{
                          padding: '0.5rem',
                          background: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          color: '#2b6cb0'
                        }}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/houses/${house.id}/edit`)}
                        title="Chỉnh sửa"
                        style={{
                          padding: '0.5rem',
                          background: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          color: '#4a5568'
                        }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteHouse(house.id)}
                        title="Xóa"
                        style={{
                          padding: '0.5rem',
                          background: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          color: '#e53e3e'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </ActionContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState>
            <Home size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>
              {isSearchMode 
                ? 'Không tìm thấy nhà nào phù hợp với điều kiện tìm kiếm'
                : 'Không có nhà nào'
              }
            </p>
          </EmptyState>
        )}
      </Card>
    </div>
  );
};

export default HouseManagement;