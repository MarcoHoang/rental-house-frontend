import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Eye, Calendar, MapPin, DollarSign, Clock, AlertTriangle, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import AdminSearchBar from './AdminSearchBar';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import { formatDate, formatCurrency } from '../../utils/timeUtils';
import { Link } from 'react-router-dom'; // Added Link import

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
  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  display: flex;
  align-items: center;

  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }

  &.view {
    color: #2b6cb0;
    &:hover {
      background: #ebf8ff;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;

  &.pending {
    background-color: #fef3c7;
    color: #92400e;
  }
  &.approved {
    background-color: #c6f6d5;
    color: #22543d;
  }
  &.rejected {
    background-color: #fed7d7;
    color: #742a2a;
  }
  &.scheduled {
    background-color: #dbeafe;
    color: #1e40af;
  }
  &.checked_in {
    background-color: #c6f6d5;
    color: #22543d;
  }
  &.checked_out {
    background-color: #dbeafe;
    color: #1e40af;
  }
  &.canceled {
    background-color: #fed7d7;
    color: #742a2a;
  }
`;

const ResultsInfo = styled.div`
  padding: 1rem 1.5rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #4a5568;
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #718096;
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
  padding: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;

  &:hover:not(:disabled) {
    background: #f7fafc;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Function tính số ngày giữa 2 ngày (giống logic trong RentHouseModal)
const calculateDurationInDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const hours = (end - start) / (1000 * 60 * 60);
  
  // Tính số ngày, nếu ít hơn hoặc bằng 24 giờ thì tính 1 ngày, nếu nhiều hơn thì làm tròn lên
  return hours <= 24 ? 1 : Math.ceil(hours / 24);
};

const RentalManagement = () => {
  const [rentals, setRentals] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'ALL',
    houseType: 'ALL'
  });
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [pagination, setPagination] = useState({
    number: 0,
    totalPages: 1
  });
  
  // Pagination states for local filtering
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5); // 5 rentals mỗi trang

  const fetchRentals = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getAllRentals({
        page,
        size: 8,
      });
      
      console.log('Rentals data:', data); // Debug log
      console.log('Rentals pagination:', {
        number: data?.number,
        totalPages: data?.totalPages,
        totalElements: data?.totalElements,
        size: data?.size,
        content: data?.content?.length
      });
      setRentals(data.content || []);
      setPagination({
        number: data.number || 0,
        totalPages: data.totalPages || 1,
      });
    } catch (err) {
      console.error('Error fetching rentals:', err);
      setError("Không thể tải danh sách hợp đồng.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Local filter rentals (giống trang chủ) - KHÔNG gọi API
  useEffect(() => {
    if (!rentals.length) return;


    let filtered = rentals;

    // Filter theo status
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(rental => rental.status === filters.status);
    }

    // Filter theo houseType
    if (filters.houseType !== 'ALL') {
      filtered = filtered.filter(rental => {
        const rentalHouseType = rental.houseType;
        if (typeof rentalHouseType === 'object' && rentalHouseType !== null) {
          return rentalHouseType.name === filters.houseType;
        }
        return rentalHouseType === filters.houseType;
      });
    }

    // Search theo tên nhà, tên người thuê, địa chỉ (local search)
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(rental => 
        (rental.houseTitle && rental.houseTitle.toLowerCase().includes(term)) ||
        (rental.renterName && rental.renterName.toLowerCase().includes(term)) ||
        (rental.houseAddress && rental.houseAddress.toLowerCase().includes(term)) ||
        (rental.renterEmail && rental.renterEmail.toLowerCase().includes(term))
      );
    }

    // Sắp xếp theo thời gian tạo mới nhất (mới nhất ở trên)
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.rentalDate || 0);
      const dateB = new Date(b.createdAt || b.rentalDate || 0);
      return dateB - dateA; // Mới nhất lên đầu
    });

    setSearchResults(filtered);
    setIsSearchMode(searchTerm.trim() || filters.status !== 'ALL' || filters.houseType !== 'ALL');
    setCurrentPage(0); // Reset về trang đầu khi filter thay đổi
  }, [rentals, searchTerm, filters]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchRentals(newPage);
    }
  };

  // Initial load
  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const displayRentals = isSearchMode ? searchResults : rentals;
  const hasResults = displayRentals && displayRentals.length > 0;

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
          status: {
            ALL: 'Tất cả trạng thái',
            PENDING: 'Chờ duyệt',
            APPROVED: 'Đã duyệt',
            REJECTED: 'Đã từ chối',
            SCHEDULED: 'Đã xác nhận',
            CHECKED_IN: 'Đã nhận phòng',
            CHECKED_OUT: 'Đã trả phòng',
            CANCELED: 'Đã hủy'
          },
          houseType: {
            ALL: 'Tất cả loại nhà',
            APARTMENT: 'Chung cư',
            VILLA: 'Biệt thự',
            TOWNHOUSE: 'Nhà phố',
            BOARDING_HOUSE: 'Nhà trọ',
            WHOLE_HOUSE: 'Nhà nguyên căn'
          }
        }}
        $showFilters={true}
        debounceMs={300}
      />

      <Card>
        <Table>
                 <thead>
           <tr>
             <th style={{ width: '20%' }}>Nhà thuê</th>
             <th style={{ width: '15%' }}>Người thuê</th>
             <th style={{ width: '12%' }}>Ngày thuê</th>
             <th style={{ width: '12%' }}>Ngày trả</th>
             <th style={{ width: '10%' }}>Số ngày</th>
             <th style={{ width: '15%' }}>Trạng thái</th>
             <th style={{ width: '16%' }}>Thao tác</th>
           </tr>
         </thead>
        <tbody>
          {displayRentals.length > 0 ? (
            displayRentals
              .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
              .map((rental) => (
              <tr key={rental.id}>
                <td>
                  <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
                    <div style={{ 
                      fontWeight: 600, 
                      marginBottom: '0.25rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {rental.houseTitle || 'Chưa có tên'}
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      <MapPin size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                      {rental.houseAddress || 'Chưa có địa chỉ'}
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
                    <div style={{ 
                      fontWeight: 500, 
                      marginBottom: '0.25rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {rental.renterName || 'Chưa có tên'}
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {rental.renterEmail || 'Chưa có email'}
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.875rem' }}>
                    <Calendar size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    {formatDate(rental.startDate)}
                  </div>
                </td>
                                 <td>
                   <div style={{ fontSize: '0.875rem' }}>
                     <Calendar size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                     {formatDate(rental.endDate)}
                   </div>
                 </td>
                                   <td>
                    <div style={{ fontSize: '0.875rem' }}>
                      <Clock size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                      {calculateDurationInDays(rental.startDate, rental.endDate)} ngày
                    </div>
                  </td>
                <td>
                  <Badge className={rental.status?.toLowerCase()}>
                    {rental.status === 'PENDING' && 'Chờ duyệt'}
                    {rental.status === 'APPROVED' && 'Đã duyệt'}
                    {rental.status === 'REJECTED' && 'Đã từ chối'}
                    {rental.status === 'SCHEDULED' && 'Đã xác nhận'}
                    {rental.status === 'CHECKED_IN' && 'Đã nhận phòng'}
                    {rental.status === 'CHECKED_OUT' && 'Đã trả phòng'}
                    {rental.status === 'CANCELED' && 'Đã hủy'}
                    {(!rental.status || !['PENDING', 'APPROVED', 'REJECTED', 'SCHEDULED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELED'].includes(rental.status)) && 'Không xác định'}
                  </Badge>
                </td>
                <td>
                  <ActionContainer>
                    <Link to={`/admin/contracts/${rental.id}`}>
                      <button
                        title="Xem chi tiết hợp đồng"
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
                    </Link>
                  </ActionContainer>
                </td>
              </tr>
            ))
          ) : (
            <tr>
                             <td
                 colSpan="7"
                 style={{ textAlign: "center", padding: "2rem" }}
               >
                {isSearchMode 
                  ? 'Không tìm thấy hợp đồng nào phù hợp với điều kiện tìm kiếm.'
                  : 'Không có hợp đồng nào.'
                }
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
        
        {isSearchMode && searchResults.length > pageSize && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(searchResults.length / pageSize)}
            totalElements={searchResults.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>
    </div>
  );
};

export default RentalManagement;
