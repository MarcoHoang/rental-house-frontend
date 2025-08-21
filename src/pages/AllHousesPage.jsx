import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import propertyApi from "../api/propertyApi";
import HouseList from "../components/house/HouseList.jsx";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Pagination from "../components/common/Pagination";
import { extractHousesFromResponse } from "../utils/apiHelpers";
import { HOUSE_STATUS, HOUSE_TYPES, HOUSE_STATUS_LABELS, HOUSE_TYPE_LABELS } from "../utils/constants";
import { Search, Filter, MapPin, Home, DollarSign, ChevronRight } from "lucide-react";

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: #64748b;
  margin-bottom: 2rem;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #64748b;
  
  a {
    color: #3182ce;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  .separator {
    color: #cbd5e0;
  }
`;

const SearchAndFilterSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const SearchButton = styled.button`
  padding: 0.875rem 1.5rem;
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #2c5aa0;
  }
  
  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
`;

const FilterSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #4a5568;
  font-size: 0.875rem;
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3182ce;
  }
`;

const PriceRangeInput = styled.input`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3182ce;
  }
`;

const ResultsSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const ResultsInfo = styled.div`
  color: #64748b;
  font-size: 0.875rem;
`;

const SortSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
`;

const ClearFiltersButton = styled.button`
  padding: 0.5rem 1rem;
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #cbd5e0;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  background-color: #fed7d7;
  border: 1px solid #feb2b2;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  margin: 2rem 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const AllHousesPage = () => {
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search và filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [isSearching, setIsSearching] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(8); // 8 nhà mỗi trang

  // Fetch tất cả nhà khi component mount
  useEffect(() => {
    fetchAllHouses();
  }, []);

  const fetchAllHouses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching all houses...");
      const response = await propertyApi.getPublicProperties();
      console.log("Raw response from API:", response);
      const housesData = extractHousesFromResponse(response);
      
      console.log("Houses data received:", housesData);
      setHouses(housesData);
      setFilteredHouses(housesData);
    } catch (err) {
      console.error("Error fetching houses:", err);
      setError("Không thể tải danh sách nhà cho thuê. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Filter và search logic
  useEffect(() => {
    let filtered = [...houses];
    
    // Filter theo status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(house => house.status === statusFilter);
    }
    
    // Filter theo loại nhà
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(house => house.houseType === typeFilter);
    }
    
    // Filter theo khoảng giá
    if (priceRange.min !== '') {
      filtered = filtered.filter(house => house.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max !== '') {
      filtered = filtered.filter(house => house.price <= parseFloat(priceRange.max));
    }
    
    // Search theo tên hoặc địa chỉ
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(house => 
        (house.title && house.title.toLowerCase().includes(term)) ||
        (house.name && house.name.toLowerCase().includes(term)) ||
        (house.address && house.address.toLowerCase().includes(term)) ||
        (house.description && house.description.toLowerCase().includes(term))
      );
    }
    
    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      default:
        break;
    }
    
    setFilteredHouses(filtered);
    setCurrentPage(0); // Reset về trang đầu khi filter thay đổi
  }, [houses, searchTerm, statusFilter, typeFilter, priceRange, sortBy]);

  const handleSearch = () => {
    setIsSearching(true);
    // Search logic đã được xử lý trong useEffect
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
    setCurrentPage(0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderContent = () => {
    console.log("renderContent called with:", { loading, error, housesLength: houses.length, filteredHousesLength: filteredHouses.length });
    
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage>{error}</ErrorMessage>;
    }

    if (houses.length === 0) {
      console.log("No houses found, showing empty state");
      return (
        <EmptyState>
          <EmptyStateIcon>🏠</EmptyStateIcon>
          <h3>Chưa có nhà nào</h3>
          <p>Hiện tại chưa có nhà nào được đăng trong hệ thống.</p>
        </EmptyState>
      );
    }

    if (filteredHouses.length === 0) {
      console.log("No filtered houses found, showing no results state");
      return (
        <EmptyState>
          <EmptyStateIcon>🔍</EmptyStateIcon>
          <h3>Không tìm thấy nhà phù hợp</h3>
          <p>Không có nhà nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
          <ClearFiltersButton onClick={handleClearFilters}>
            Xóa bộ lọc
          </ClearFiltersButton>
        </EmptyState>
      );
    }

    console.log("Rendering HouseList with houses:", filteredHouses);
    
    // Tính toán nhà hiển thị cho trang hiện tại
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const currentHouses = filteredHouses.slice(startIndex, endIndex);
    
    return (
      <>
        <HouseList houses={currentHouses} fromPage="all-houses" />
        {filteredHouses.length > pageSize && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredHouses.length / pageSize)}
            totalElements={filteredHouses.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </>
    );
  };

  return (
    <PageContainer>
      <Header />
      
      <MainContent>
        <PageHeader>
          <PageTitle>Tất cả nhà cho thuê</PageTitle>
          <PageSubtitle>
            Khám phá hàng nghìn ngôi nhà đẹp và phù hợp với nhu cầu của bạn
          </PageSubtitle>
        </PageHeader>

        <SearchAndFilterSection>
          <SearchBar>
            <SearchInput
              type="text"
              placeholder="Tìm kiếm theo tên, địa chỉ, mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <SearchButton onClick={handleSearch} disabled={isSearching}>
              <Search size={16} />
              {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
            </SearchButton>
          </SearchBar>

          <FilterSection>
            <FilterGroup>
              <FilterLabel>Trạng thái</FilterLabel>
              <FilterSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Tất cả trạng thái</option>
                {Object.entries(HOUSE_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Loại nhà</FilterLabel>
              <FilterSelect
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="ALL">Tất cả loại nhà</option>
                {Object.entries(HOUSE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Giá tối thiểu (VNĐ)</FilterLabel>
              <PriceRangeInput
                type="number"
                placeholder="0"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Giá tối đa (VNĐ)</FilterLabel>
              <PriceRangeInput
                type="number"
                placeholder="Không giới hạn"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              />
            </FilterGroup>
          </FilterSection>
        </SearchAndFilterSection>

        <ResultsSection>
          <ResultsHeader>
            <ResultsInfo>
              {filteredHouses.length > 0 ? (
                <>
                  Hiển thị <strong>{filteredHouses.length}</strong> trong tổng số <strong>{houses.length}</strong> nhà cho thuê
                  {searchTerm && (
                    <span className="text-blue-600 ml-2">
                      cho từ khóa "{searchTerm}"
                    </span>
                  )}
                </>
              ) : (
                <>
                  Không tìm thấy nhà nào phù hợp
                  {searchTerm && (
                    <span className="text-blue-600 ml-2">
                      cho từ khóa "{searchTerm}"
                    </span>
                  )}
                </>
              )}
            </ResultsInfo>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="price-low">Giá thấp → cao</option>
                <option value="price-high">Giá cao → thấp</option>
              </SortSelect>
              
              <ClearFiltersButton onClick={handleClearFilters}>
                Xóa bộ lọc
              </ClearFiltersButton>
            </div>
          </ResultsHeader>

          {renderContent()}
        </ResultsSection>
      </MainContent>

      <Footer />
    </PageContainer>
  );
};

export default AllHousesPage; 