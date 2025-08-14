// src/components/house/HouseList.jsx
import React from "react";
import HouseCard from "./HouseCard";

const HouseList = ({ houses, showActions = false, onEdit, onDelete }) => {
  // Logic không thay đổi
  if (!houses || houses.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Không tìm thấy nhà nào phù hợp.
      </p>
    );
  }

  return (
    // Thay thế <ListWrapper> bằng các lớp grid của Tailwind
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {houses.map((house) => (
        <HouseCard 
          key={house.id} 
          house={house} 
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default HouseList;
