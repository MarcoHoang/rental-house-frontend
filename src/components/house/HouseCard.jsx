import React from "react";

const HouseCard = ({ house }) => {
  const { name, address, price, imageUrl } = house;

  return (
    // Thay thế <CardWrapper> bằng <div> với các lớp Tailwind
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md transition-transform duration-200 hover:-translate-y-1">
      {/* Thay thế <CardImage> bằng <img> */}
      <img
        className="w-full h-48 object-cover" // h-48 tương đương 200px nếu bạn cấu hình base là 4px
        src={imageUrl || "https://via.placeholder.com/300x200"}
        alt={name}
      />
      {/* Thay thế <CardBody> bằng <div> */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{address}</p>
        <h4 className="text-blue-600 font-semibold">
          {price.toLocaleString("vi-VN")} VNĐ/tháng
        </h4>
      </div>
    </div>
  );
};

export default HouseCard;
