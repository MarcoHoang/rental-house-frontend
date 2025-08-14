import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import propertyApi from "../api/propertyApi";
import HouseList from "../components/house/HouseList";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/house/SearchBar";
import LoadingSpinner from "../components/common/LoadingSpinner";

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
        console.log('🏠 Starting to fetch houses...');
        
        const response = await propertyApi.getPublicProperties(); // Gọi API lấy bài đăng công khai
        console.log('🏠 API Response:', response);
        console.log('🏠 Response type:', typeof response);
        console.log('🏠 Response keys:', response ? Object.keys(response) : 'no response');
        
        // Xử lý response format một cách linh hoạt
        let housesData = [];
        
        if (response && response.content) {
          console.log('🏠 Using response.content');
          housesData = response.content;
        } else if (response && response.data) {
          console.log('🏠 Using response.data');
          housesData = response.data;
        } else if (Array.isArray(response)) {
          console.log('🏠 Response is array, using directly');
          housesData = response;
        } else if (response && typeof response === 'object') {
          console.log('🏠 Response is object, checking for data');
          // Kiểm tra xem có phải là mock data không
          if (response.content && Array.isArray(response.content)) {
            housesData = response.content;
          } else {
            console.warn('🏠 No valid data structure found in response');
            housesData = [];
          }
        } else {
          console.warn('🏠 Invalid response format');
          housesData = [];
        }
        
        console.log('🏠 Extracted houses data:', housesData);
        console.log('🏠 Houses data length:', housesData.length);
        
        // Kiểm tra xem có phải là mock data không
        if (housesData.length > 0) {
          const firstHouse = housesData[0];
          console.log('🏠 First house sample:', {
            id: firstHouse.id,
            title: firstHouse.title,
            name: firstHouse.name,
            address: firstHouse.address,
            price: firstHouse.price,
            isMock: firstHouse.isMock || false
          });
        }
        
        setHouses(housesData); // Cập nhật state với dữ liệu nhận được
        setFilteredHouses(housesData);
        setError(null); // Xóa bất kỳ lỗi nào trước đó
        
        console.log('🏠 Successfully set houses data, count:', housesData.length);
      } catch (err) {
        // Nếu có lỗi, cập nhật state lỗi
        console.error("🏠 Error in fetchHouses:", err);
        setError(
          "Rất tiếc, đã có lỗi xảy ra. Không thể tải dữ liệu nhà cho thuê."
        );
      } finally {
        // Dù thành công hay thất bại, cũng tắt spinner
        setLoading(false);
        console.log('🏠 Fetch houses completed');
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
      console.log('🔍 Searching houses with keyword:', keyword);
      
      const response = await propertyApi.searchHouses(keyword);
      console.log('🔍 Search response:', response);
      
      const searchResults = response.content || response.data || [];
      setFilteredHouses(searchResults);
      
      console.log('🔍 Search completed, found:', searchResults.length, 'houses');
    } catch (error) {
      console.error('🔍 Search error:', error);
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
        <p style={{ textAlign: "center" }}>Hiện chưa có nhà nào để hiển thị.</p>
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
    return <HouseList houses={filteredHouses} />;
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
        </HeroSection>

        <FeaturedSection>
          <SectionTitle>Nhà cho thuê nổi bật</SectionTitle>
          
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
            <FilterSelect
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">Tất cả loại nhà</option>
              <option value="APARTMENT">Căn hộ</option>
              <option value="HOUSE">Nhà phố</option>
              <option value="VILLA">Biệt thự</option>
              <option value="STUDIO">Studio</option>
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
