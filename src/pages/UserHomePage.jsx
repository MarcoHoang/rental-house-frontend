import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import propertyApi from "../api/propertyApi";
import HouseList from "../components/house/HouseList";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/house/SearchBar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { extractHousesFromResponse } from "../utils/apiHelpers";
import { HOUSE_STATUS, HOUSE_TYPES, HOUSE_STATUS_LABELS, HOUSE_TYPE_LABELS } from "../utils/constants";

import { Plus, Home, User } from "lucide-react";

const MainContent = styled.main`
  /* Component chính bọc nội dung, đảm bảo không có style thừa */
`;

// Section cho phần banner chính, chiếm toàn bộ chiều rộng
const HeroSection = styled.section`
  background: linear-gradient(to right, #6a82fb, #fc5c7d);
  color: white;
  text-align: center;
  padding: 5rem 2rem; /* Tăng padding để trông rộng rãi hơn */

  h1 {
    font-size: 3rem; /* Tăng kích thước chữ cho tiêu đề chính */
    font-weight: 700;
    margin-bottom: 1.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Thêm bóng đổ cho chữ để nổi bật */
  }
`;

// Section cho danh sách nhà nổi bật
const FeaturedSection = styled.section`
  padding: 4rem 2rem; /* Khoảng đệm trên/dưới và hai bên */
  background-color: #ffffff; /* Thêm nền trắng để tách biệt với nền body xám nhạt */
`;

const SectionTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 3rem; /* Tăng khoảng cách với danh sách bên dưới */
  color: #343a40;
`;

const SearchAndFilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  max-width: 400px;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #6a82fb;
    box-shadow: 0 0 0 3px rgba(106, 130, 251, 0.1);
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
    border-color: #6a82fb;
  }
`;

const ResultsInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: #64748b;
  font-size: 0.875rem;
`;

// Box hiển thị thông báo lỗi
const ErrorMessage = styled.div`
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  text-align: center;
  margin: 2rem auto;
  max-width: 600px;
`;

// --- HomePage Component ---
// Đây là component chính của trang chủ

const HomePage = () => {
  // --- State Management ---
  // Quản lý trạng thái của component: danh sách nhà, đang tải, và lỗi
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [topHouses, setTopHouses] = useState([]); // State cho nhà nổi bật
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // --- Data Fetching ---
  // Sử dụng useEffect để gọi API (hoặc dữ liệu giả) một lần khi component render
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        setLoading(true); // Bắt đầu tải, bật spinner
        
        // Lấy nhà nổi bật theo số lượng yêu thích cho section "Nhà cho thuê nổi bật"
        const topHousesResponse = await propertyApi.getTopHousesByFavorites(5);
        const topHousesData = extractHousesFromResponse(topHousesResponse);
        setTopHouses(topHousesData); // Lưu nhà nổi bật
        
        // Lấy tất cả nhà cho phần tìm kiếm và lọc
        const allHousesResponse = await propertyApi.getPublicProperties();
        const allHousesData = extractHousesFromResponse(allHousesResponse);
        
        setHouses(allHousesData); // Cập nhật state với dữ liệu tất cả nhà
        setFilteredHouses(allHousesData);
        setError(null); // Xóa bất kỳ lỗi nào trước đó
      } catch (err) {
        // Nếu có lỗi, cập nhật state lỗi
        console.error("Error in fetchHouses:", err);
        setError(
          "Rất tiếc, đã có lỗi xảy ra. Không thể tải dữ liệu nhà cho thuê."
        );
      } finally {
        // Dù thành công hay thất bại, cũng tắt spinner
        setLoading(false);
      }
    };

    fetchHouses();
  }, []); // Mảng rỗng `[]` đảm bảo useEffect chỉ chạy một lần duy nhất

  // Filter và search nhà
  useEffect(() => {
    let filtered = houses;
    
    // Filter theo status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(house => house.status === statusFilter);
    }
    
    // Filter theo loại nhà
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(house => house.houseType === typeFilter);
    }
    
    // Search theo tên hoặc địa chỉ (local search)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(house => 
        (house.title && house.title.toLowerCase().includes(term)) ||
        (house.name && house.name.toLowerCase().includes(term)) ||
        (house.address && house.address.toLowerCase().includes(term))
      );
    }
    
    setFilteredHouses(filtered);
  }, [houses, searchTerm, statusFilter, typeFilter]);

  // Hàm search sử dụng API backend
  const handleSearch = async (keyword) => {
    if (!keyword || keyword.trim() === '') {
      // Nếu không có từ khóa, hiển thị tất cả nhà
      setFilteredHouses(houses);
      return;
    }

    try {
      setLoading(true);
      
      const response = await propertyApi.searchHouses(keyword);
      const searchResults = extractHousesFromResponse(response);
      setFilteredHouses(searchResults);
    } catch (error) {
              console.error('Search error:', error);
      // Nếu search API thất bại, fallback về local search
      const term = keyword.toLowerCase();
      const localResults = houses.filter(house => 
        (house.title && house.title.toLowerCase().includes(term)) ||
        (house.name && house.name.toLowerCase().includes(term)) ||
        (house.address && house.address.toLowerCase().includes(term))
      );
      setFilteredHouses(localResults);
    } finally {
      setLoading(false);
    }
  };

  // --- Content Rendering Logic ---
  // Một hàm nhỏ để quyết định hiển thị gì dựa trên trạng thái (loading, error, success)
  const renderHouseContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorMessage>{error}</ErrorMessage>;
    }
    if (houses.length === 0) {
      return (
        <div>
          <p style={{ textAlign: "center" }}>Hiện chưa có nhà nào để hiển thị.</p>
        </div>
      );
    }
    if (filteredHouses.length === 0) {
      return (
        <div style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>
          <p>Không tìm thấy nhà nào phù hợp với tiêu chí tìm kiếm.</p>
          <p>Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
        </div>
      );
    }
    return <HouseList houses={filteredHouses} fromPage="home" />;
  };

  // --- JSX to Render ---
  // Cấu trúc HTML của trang chủ
  return (
    <div>
      <Header />

      <MainContent>
        <HeroSection>
          <h1>Tìm kiếm ngôi nhà mơ ước của bạn</h1>
          <SearchBar onSearch={handleSearch} />
          <div style={{ marginTop: '2rem' }}>
            <Link 
              to="/all-houses" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                transition: 'all 0.2s',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <Home size={20} />
              Xem tất cả nhà cho thuê
            </Link>
          </div>
        </HeroSection>

        <FeaturedSection>
          <SectionTitle>Nhà cho thuê nổi bật</SectionTitle>
          
          {/* Hiển thị nhà nổi bật theo số lượng yêu thích */}
          {topHouses.length > 0 ? (
            <div>
              <p style={{ textAlign: "center", marginBottom: "2rem", color: "#64748b" }}>
                Top 5 nhà được yêu thích nhiều nhất
              </p>
              <HouseList houses={topHouses} fromPage="home" />
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#64748b" }}>
              <p>Đang tải nhà nổi bật...</p>
            </div>
          )}
        </FeaturedSection>

        {/* Section mới cho tìm kiếm và lọc tất cả nhà */}
        <FeaturedSection style={{ backgroundColor: "#f8fafc" }}>
          <SectionTitle>Tìm kiếm nhà cho thuê</SectionTitle>
          
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
            <FilterSelect
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">Tất cả loại nhà</option>
              {Object.entries(HOUSE_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </FilterSelect>
          </SearchAndFilterBar>
          
          <ResultsInfo>
            Hiển thị {filteredHouses.length} trong tổng số {houses.length} nhà cho thuê
          </ResultsInfo>
          
          {renderHouseContent()}
        </FeaturedSection>
      </MainContent>

      <Footer />
    </div>
  );
};

export default HomePage;
