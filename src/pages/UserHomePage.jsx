import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { getHouses } from "../api/houseApi";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
