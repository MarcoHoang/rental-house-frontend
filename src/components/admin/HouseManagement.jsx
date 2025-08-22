// src/components/admin/HouseManagement.jsx (Đã sửa)

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { housesApi } from "../../api/adminApi";
import {
  RefreshCw,
  AlertTriangle,
  Eye,
  Home,
  MapPin,
  DollarSign,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "../common/Toast";
import AdminSearchBar from "./AdminSearchBar";
import { getHouseTypeLabel, getHouseStatusLabel } from "../../utils/constants";

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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
  font-size: 0.875rem;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f7fafc;
    border-color: #cbd5e0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Modal styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 1.5rem 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
  }
`;

const ModalBody = styled.div`
  padding: 1rem 1.5rem;

  p {
    margin: 0 0 0.5rem 0;
    color: #4a5568;
    line-height: 1.5;
  }
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  border-top: 1px solid #e2e8f0;
`;

const CancelButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e53e3e;
  background: #e53e3e;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #c53030;
    border-color: #c53030;
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

// Helper để format giá theo ngày
const formatPricePerDay = (price) => {
  if (price === null || price === undefined) return "0 ₫/ngày";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price) + "/ngày";
};

const HouseManagement = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ status: "ALL", houseType: "ALL" });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [pagination, setPagination] = useState({
    number: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [houseToDelete, setHouseToDelete] = useState(null);

  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();



  // Fetch houses với phân trang
  const fetchHouses = useCallback(async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await housesApi.getAll({ page, size: 8 });
      console.log("Houses data:", data);
      console.log("Houses pagination:", {
        number: data?.number,
        totalPages: data?.totalPages,
        totalElements: data?.totalElements,
        size: data?.size,
        content: data?.content?.length
      });

      setHouses(data?.content || data || []);
      setPagination({
        number: data?.number || 0,
        totalPages: data?.totalPages || 1,
      });
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




  // Handle delete house
  const handleDeleteHouse = async (houseId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhà này?")) {
      try {
        await housesApi.delete(houseId);
        showSuccess("Xóa thành công!", "Đã xóa nhà khỏi hệ thống.");
        fetchHouses(pagination.number); // Refresh list với trang hiện tại
      } catch (err) {
        console.error('Lỗi khi xóa nhà:', err);
        
        let errorMessage = 'Không thể xóa nhà. Vui lòng thử lại.';
        
        // Ưu tiên sử dụng message từ error trước
        if (err.message) {
          errorMessage = err.message;
        } else if (err.response) {
          if (err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.status === 401) {
            errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          } else if (err.response.status === 403) {
            errorMessage = 'Bạn không có quyền xóa nhà này.';
          } else if (err.response.status === 404) {
            errorMessage = 'Không tìm thấy nhà cần xóa.';
          }
        } else if (err.request) {
          errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
        }
        
        showError("Xóa thất bại!", errorMessage);
      }
    }
  };

  // Handle delete house with modal
  const handleDeleteClick = (house) => {
    setHouseToDelete(house);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!houseToDelete) return;

    try {
      await housesApi.delete(houseToDelete.id);
      showSuccess("Xóa thành công!", "Đã xóa nhà khỏi hệ thống.");
      fetchHouses(pagination.number); // Refresh list với trang hiện tại
    } catch (err) {
      console.error('Lỗi khi xóa nhà:', err);
      
      let errorMessage = 'Không thể xóa nhà. Vui lòng thử lại.';
      
      // Ưu tiên sử dụng message từ error trước
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response) {
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (err.response.status === 403) {
          errorMessage = 'Bạn không có quyền xóa nhà này.';
        } else if (err.response.status === 404) {
          errorMessage = 'Không tìm thấy nhà cần xóa.';
        }
      } else if (err.request) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      }
      
      showError("Xóa thất bại!", errorMessage);
    } finally {
      setDeleteModalOpen(false);
      setHouseToDelete(null);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchHouses(newPage);
    }
  };

  // Initial load
  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);



  const displayHouses = isSearchMode ? searchResults : houses;
  const hasResults = displayHouses && displayHouses.length > 0;

  // Debug pagination
  console.log("HouseManagement render:", {
    pagination,
    isSearchMode,
    shouldShowPagination: !isSearchMode && pagination.totalPages > 1,
    housesCount: houses.length,
    displayHousesCount: displayHouses.length
  });



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
            { value: "AVAILABLE", label: getHouseStatusLabel("AVAILABLE") },
            { value: "RENTED", label: getHouseStatusLabel("RENTED") },
            { value: "INACTIVE", label: getHouseStatusLabel("INACTIVE") },
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
              {displayHouses.length > 0 ? (
                displayHouses.map((house) => (
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
                                         <td>
                       {getHouseTypeLabel(house.houseType) || 'N/A'}
                     </td>
                     <td>
                       <Badge className={house.status?.toLowerCase()}>
                         {getHouseStatusLabel(house.status) || 'N/A'}
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
                          onClick={() => handleDeleteClick(house)}
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    {isSearchMode ? "Không tìm thấy nhà nào phù hợp với điều kiện tìm kiếm." : "Không có nhà nào."}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

        {!isSearchMode && pagination.totalPages > 1 && (
          <PaginationContainer>
            <span>
              Trang <strong>{pagination.number + 1}</strong> trên{" "}
              <strong>{pagination.totalPages}</strong>
            </span>
            <PaginationControls>
              <PageButton
                onClick={() => handlePageChange(pagination.number - 1)}
                disabled={pagination.number === 0}
              >
                <ChevronLeft size={16} />
              </PageButton>
              <PageButton
                onClick={() => handlePageChange(pagination.number + 1)}
                disabled={pagination.number + 1 >= pagination.totalPages}
              >
                <ChevronRight size={16} />
              </PageButton>
            </PaginationControls>
          </PaginationContainer>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <AlertTriangle size={24} color="#e53e3e" />
              <h3>Xác nhận xóa nhà</h3>
            </ModalHeader>
            <ModalBody>
              <p>
                Bạn có chắc chắn muốn xóa nhà <strong>"{houseToDelete?.title || 'N/A'}"</strong>?
              </p>
              <p style={{ color: '#e53e3e', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Hành động này không thể hoàn tác.
              </p>
            </ModalBody>
            <ModalFooter>
              <CancelButton onClick={() => setDeleteModalOpen(false)}>
                Hủy
              </CancelButton>
              <DeleteButton onClick={handleConfirmDelete}>
                <Trash2 size={16} />
                Xóa nhà
              </DeleteButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default HouseManagement;