// src/components/house/HouseList.jsx
import React, { useState, useMemo, useEffect } from "react";
import HouseCard from "./HouseCard.jsx";
import HouseFilter from "./HouseFilter";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../common/Toast";

const HouseList = ({ houses, showActions = false, onEdit, onDelete, fromPage }) => {
  const { user, isHost } = useAuth();
  const { showSuccess } = useToast();
  const [currentFilter, setCurrentFilter] = useState("all");
  const [hasShownMyHousesMessage, setHasShownMyHousesMessage] = useState(false);

  // Filter houses based on current filter
  const filteredHouses = useMemo(() => {
    if (!houses || houses.length === 0) {
      return [];
    }

    if (currentFilter === "my-houses" && user && user.id) {
      return houses.filter(house => Number(house.hostId) === Number(user.id));
    }

    return houses;
  }, [houses, currentFilter, user]);

  const handleFilterChange = (filterType) => {
    setCurrentFilter(filterType);
    
    // Hiển thị thông báo khi chủ nhà chọn xem nhà của mình lần đầu
    if (filterType === "my-houses" && user && user.id && !hasShownMyHousesMessage) {
      const myHousesCount = houses.filter(house => Number(house.hostId) === Number(user.id)).length;
      if (myHousesCount > 0) {
        showSuccess('Nhà của bạn', `Bạn có ${myHousesCount} nhà được đăng. Các nhà của bạn được đánh dấu bằng badge màu vàng.`);
        setHasShownMyHousesMessage(true);
      }
    }
  };

  // Logic không thay đổi
  if (!houses || houses.length === 0) {
    return (
      <div>
        {/* Chỉ hiển thị filter khi là chủ nhà */}
        {isHost && (
          <HouseFilter onFilterChange={handleFilterChange} currentFilter={currentFilter} houses={houses} />
        )}
        <p className="text-center text-gray-500">
          Không tìm thấy nhà nào phù hợp.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Chỉ hiển thị filter khi là chủ nhà */}
      {isHost && (
        <HouseFilter onFilterChange={handleFilterChange} currentFilter={currentFilter} houses={houses} />
      )}
      
      {filteredHouses.length === 0 ? (
        <p className="text-center text-gray-500">
          {currentFilter === "my-houses" 
            ? "Bạn chưa có nhà nào được đăng." 
            : "Không tìm thấy nhà nào phù hợp với bộ lọc."
          }
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredHouses.map((house) => (
            <HouseCard 
              key={house.id} 
              house={house} 
              showActions={showActions}
              onEdit={onEdit}
              onDelete={onDelete}
              fromPage={fromPage}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HouseList;
