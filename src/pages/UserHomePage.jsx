import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { getHouses } from "../api/houseApi";
import HouseList from "../components/house/HouseList";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/house/SearchBar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getUserFromStorage } from "../utils/localStorage";
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

// Section cho các action buttons
const ActionSection = styled.section`
  padding: 2rem;
  background-color: #f8f9fa;
  text-align: center;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ActionCard = styled(Link)`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: #6a82fb;
  }
  
  .action-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    color: white;
    font-size: 1.5rem;
  }
  
  .action-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #343a40;
  }
  
  .action-description {
    color: #6c757d;
    line-height: 1.6;
  }
`;

const HostWelcomeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  margin: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const HostWelcomeTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const HostWelcomeText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
`;

const HostActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #667eea;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// --- HomePage Component ---
// Đây là component chính của trang chủ

const HomePage = () => {
  // --- State Management ---
  // Quản lý trạng thái của component: danh sách nhà, đang tải, và lỗi
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // --- Data Fetching ---
  // Sử dụng useEffect để gọi API (hoặc dữ liệu giả) một lần khi component render
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        setLoading(true); // Bắt đầu tải, bật spinner
        const response = await getHouses(); // Gọi hàm lấy dữ liệu
        setHouses(response.data); // Cập nhật state với dữ liệu nhận được
        setError(null); // Xóa bất kỳ lỗi nào trước đó
      } catch (err) {
        // Nếu có lỗi, cập nhật state lỗi
        setError(
          "Rất tiếc, đã có lỗi xảy ra. Không thể tải dữ liệu nhà cho thuê."
        );
        console.error("Lỗi khi fetch dữ liệu nhà:", err);
      } finally {
        // Dù thành công hay thất bại, cũng tắt spinner
        setLoading(false);
      }
    };

    // Lấy thông tin user
    const userData = getUserFromStorage();
    setUser(userData);

    fetchHouses();
  }, []); // Mảng rỗng `[]` đảm bảo useEffect chỉ chạy một lần duy nhất

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
    return <HouseList houses={houses} />;
  };

  // Render action section dựa trên role
  const renderActionSection = () => {
    if (!user) return null;

    if (user.roleName === 'HOST') {
      return (
        <ActionSection>
          <HostWelcomeSection>
            <HostWelcomeTitle>
              Chào mừng trở lại, {user.fullName || 'Chủ nhà'}! 🎉
            </HostWelcomeTitle>
            <HostWelcomeText>
              Bạn đã được approve làm chủ nhà. Bây giờ bạn có thể đăng tin cho thuê nhà và quản lý các tin đăng của mình.
            </HostWelcomeText>
            <HostActionButton to="/host/post">
              <Plus size={20} />
              Đăng tin mới
            </HostActionButton>
          </HostWelcomeSection>
          
          <ActionGrid>
            <ActionCard to="/host/post">
              <div className="action-icon" style={{ background: '#3b82f6' }}>
                <Plus size={24} />
              </div>
              <div className="action-title">Đăng tin mới</div>
              <div className="action-description">
                Thêm tài sản mới vào hệ thống cho thuê của bạn
              </div>
            </ActionCard>

            <ActionCard to="/host/properties">
              <div className="action-icon" style={{ background: '#10b981' }}>
                <Home size={24} />
              </div>
              <div className="action-title">Quản lý tài sản</div>
              <div className="action-description">
                Xem và chỉnh sửa thông tin các tài sản đang cho thuê
              </div>
            </ActionCard>

            <ActionCard to="/host/bookings">
              <div className="action-icon" style={{ background: '#f59e0b' }}>
                <User size={24} />
              </div>
              <div className="action-title">Đơn đặt phòng</div>
              <div className="action-description">
                Quản lý các đơn đặt phòng và yêu cầu từ khách hàng
              </div>
            </ActionCard>
          </ActionGrid>
        </ActionSection>
      );
    }

    // Nếu là USER thường, hiển thị nút đăng ký làm chủ nhà
    return (
      <ActionSection>
        <ActionGrid>
          <ActionCard to="/host-application-test">
            <div className="action-icon" style={{ background: '#8b5cf6' }}>
              <Home size={24} />
            </div>
            <div className="action-title">Đăng ký làm chủ nhà</div>
            <div className="action-description">
              Bạn có nhà muốn cho thuê? Đăng ký ngay để trở thành chủ nhà và bắt đầu kiếm thu nhập!
            </div>
          </ActionCard>
        </ActionGrid>
      </ActionSection>
    );
  };

  // --- JSX to Render ---
  // Cấu trúc HTML của trang chủ
  return (
    <div>
      <Header />

      <MainContent>
        <HeroSection>
          <h1>Tìm kiếm ngôi nhà mơ ước của bạn</h1>
          <SearchBar />
        </HeroSection>

        {renderActionSection()}

        <FeaturedSection>
          <SectionTitle>Nhà cho thuê nổi bật</SectionTitle>
          {renderHouseContent()}
        </FeaturedSection>
      </MainContent>

      <Footer />
    </div>
  );
};

export default HomePage;
