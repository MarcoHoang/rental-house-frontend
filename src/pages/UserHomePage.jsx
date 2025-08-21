import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import propertyApi from "../api/propertyApi";
import HouseList from "../components/house/HouseList.jsx";
import HouseCard from "../components/house/HouseCard.jsx";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import AdvancedSearchBar from "../components/common/AdvancedSearchBar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Pagination from "../components/common/Pagination";
import HeroBackgroundCarousel from "../components/common/HeroBackgroundCarousel";
import { extractHousesFromResponse } from "../utils/apiHelpers";
import { HOUSE_STATUS, HOUSE_TYPES, HOUSE_STATUS_LABELS, HOUSE_TYPE_LABELS } from "../utils/constants";

import { Plus, Home, User, Star, TrendingUp, MapPin, Search } from "lucide-react";
import { FeaturedHousesGrid, FeaturedHouseItem, FeaturedHouseCard } from "../styles/GlobalComponents";

// Styled component cho grid tìm kiếm
const SearchHousesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  align-items: stretch;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  
  @media (min-width: 1025px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
`;

const SearchHouseItem = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SearchHouseCard = styled.div`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const MainContent = styled.main`
  /* Component chính bọc nội dung, đảm bảo không có style thừa */
`;

// Hero section với background carousel động
const HeroSection = styled.section`
  color: white;
  text-align: center;
  padding: 6rem 2rem;
  position: relative;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    position: relative;
    z-index: 3;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  .hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 3rem;
    opacity: 0.95;
    position: relative;
    z-index: 3;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const HeroSearchSection = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 3;
`;

// Section cho nhà nổi bật với thiết kế đặc biệt
const FeaturedSection = styled.section`
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: #1e293b;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    border-radius: 2px;
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  margin-bottom: 3rem;
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
`;



// Section cho tìm kiếm với background khác
const SearchSection = styled.section`
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
`;



const ResultsInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(8); // 8 nhà mỗi trang

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

  // Filter và search nhà - giờ chỉ hiển thị tất cả nhà
  useEffect(() => {
    setFilteredHouses(houses);
    setCurrentPage(0);
  }, [houses]);

  // Hàm search sử dụng API backend (giờ không cần thiết vì đã chuyển sang trang tất cả nhà)
  const handleSearch = async (keyword) => {
    // Hàm này giờ không cần thiết vì tìm kiếm đã được chuyển sang trang tất cả nhà
    console.log('Search keyword:', keyword);
  };

  // Hàm xử lý tìm kiếm nâng cao (giờ sẽ chuyển hướng đến trang tất cả nhà)
  const handleAdvancedSearch = async (searchData) => {
    // AdvancedSearchBar giờ sẽ tự động chuyển hướng đến trang tất cả nhà
    // Hàm này chỉ để backward compatibility
    console.log('Advanced search data:', searchData);
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
            return (
          <>
            {/* Sử dụng SearchHousesGrid để có cùng kích thước với phần Featured */}
            <SearchHousesGrid>
              {filteredHouses.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((house, index) => (
                <SearchHouseItem key={house.id}>
                  <SearchHouseCard>
                    <HouseCard house={house} fromPage="home" />
                  </SearchHouseCard>
                </SearchHouseItem>
              ))}
            </SearchHousesGrid>
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

  // --- JSX to Render ---
  // Cấu trúc HTML của trang chủ
  return (
    <div>
      <Header />

      <MainContent>
        <HeroSection>
          <HeroBackgroundCarousel />
          <h1>Tìm kiếm ngôi nhà mơ ước của bạn</h1>
          <p className="hero-subtitle">
            Khám phá hàng nghìn ngôi nhà đẹp với giá cả hợp lý
          </p>
          
          <HeroSearchSection>
            <AdvancedSearchBar onSearch={handleAdvancedSearch} />
            <div style={{ marginTop: '2rem' }}>
              <Link 
                to="/all-houses" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 2rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <Home size={24} />
                Xem tất cả nhà cho thuê
              </Link>
            </div>
          </HeroSearchSection>
        </HeroSection>

        <FeaturedSection>
          <SectionTitle>Nhà cho thuê nổi bật</SectionTitle>
          <SectionSubtitle>
            Top 5 nhà được yêu thích nhiều nhất
          </SectionSubtitle>
          
          {/* Hiển thị nhà nổi bật trên 1 hàng */}
          {topHouses.length > 0 ? (
            <FeaturedHousesGrid>
              {topHouses.map((house, index) => (
                <FeaturedHouseItem key={house.id}>
                  <FeaturedHouseCard>
                    <div className="featured-badge">
                      <Star size={12} />
                      #{index + 1}
                    </div>
                    <HouseCard house={house} fromPage="home" />
                  </FeaturedHouseCard>
                </FeaturedHouseItem>
              ))}
            </FeaturedHousesGrid>
          ) : (
            <div style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>
              <LoadingSpinner />
              <p style={{ marginTop: "1rem" }}>Đang tải nhà nổi bật...</p>
            </div>
          )}
        </FeaturedSection>

        {/* Section mới cho tìm kiếm và lọc tất cả nhà */}
        <SearchSection>
          <SectionTitle>Tìm kiếm nhà cho thuê</SectionTitle>
          <SectionSubtitle>
            Khám phá và tìm kiếm ngôi nhà phù hợp với nhu cầu của bạn
          </SectionSubtitle>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link 
              to="/all-houses" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2rem',
                backgroundColor: '#667eea',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#5a67d8';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#667eea';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              <Search size={20} />
              Xem tất cả nhà cho thuê
            </Link>
          </div>
          
          <ResultsInfo>
            Hiển thị {filteredHouses.length} trong tổng số {houses.length} nhà cho thuê
          </ResultsInfo>
          
          {renderHouseContent()}
        </SearchSection>
      </MainContent>

      <Footer />
    </div>
  );
};

export default HomePage;
