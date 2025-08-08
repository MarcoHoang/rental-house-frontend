import React, { useState, useEffect } from "react";
import { getHouses } from "../api/houseApi";
import HouseList from "../components/house/HouseList";
import SearchBar from "../components/house/SearchBar";
import LoadingSpinner from "../components/common/LoadingSpinner";
// Header và Footer đã được chuyển ra Layout, không cần import ở đây nữa

const HomePage = () => {
  // --- Toàn bộ phần logic state và data fetching được giữ nguyên ---
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        setLoading(true);
        const response = await getHouses();
        setHouses(response.data);
        setError(null);
      } catch (err) {
        setError("Rất tiếc, đã có lỗi xảy ra. Không thể tải dữ liệu.");
        console.error("Lỗi khi fetch dữ liệu nhà:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  // --- Logic render content giữ nguyên ---
  const renderHouseContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error)
      return (
        <div className="text-red-800 bg-red-100 p-4 rounded-lg text-center my-8">
          {error}
        </div>
      );
    if (houses.length === 0)
      return (
        <p className="text-center text-gray-500">
          Hiện chưa có nhà nào để hiển thị.
        </p>
      );
    return <HouseList houses={houses} />;
  };

  return (
    <>
      {/* Section 1: Nền gradient toàn màn hình */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
        {/* Nội dung bên trong được căn giữa bởi .container */}
        <div className="container py-20 px-4">
          <h1
            className="text-5xl font-bold mb-6"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
          >
            Tìm kiếm ngôi nhà mơ ước của bạn
          </h1>
          <SearchBar />
        </div>
      </section>

      {/* Section 2: Nền trắng toàn màn hình */}
      <section className="bg-white">
        {/* Nội dung bên trong được căn giữa bởi .container */}
        <div className="container py-16 px-4">
          <h2 className="text-4xl font-semibold text-center mb-12 text-gray-800">
            Nhà cho thuê nổi bật
          </h2>
          {renderHouseContent()}
        </div>
      </section>
    </>
  );
};

export default HomePage;
