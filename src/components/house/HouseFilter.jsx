import React from "react";
import { Filter, Home, Crown } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const HouseFilter = ({ onFilterChange, currentFilter = "all", houses = [] }) => {
  const { user } = useAuth();
  
  // Tính toán số lượng nhà của chủ nhà
  const myHousesCount = houses.filter(house => house.hostId === user?.id).length;
  const totalHousesCount = houses.length;

  const handleFilterChange = (filterType) => {
    if (onFilterChange) {
      onFilterChange(filterType);
    }
  };

  const filterOptions = [
    {
      id: "all",
      label: "Tất cả nhà",
      icon: Home,
      description: "Hiển thị tất cả nhà",
      count: totalHousesCount
    },
    {
      id: "my-houses",
      label: "Nhà của tôi",
      icon: Crown,
      description: "Chỉ hiển thị nhà của bạn",
      count: myHousesCount
    }
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-3">
        {filterOptions.map((option) => {
          const IconComponent = option.icon;
          const isActive = currentFilter === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => handleFilterChange(option.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${
                isActive
                  ? "bg-blue-500 text-white border-blue-500 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
              }`}
              title={option.description}
            >
              <IconComponent size={16} />
              <span className="font-medium">{option.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                isActive 
                  ? "bg-white bg-opacity-20 text-white" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                {option.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HouseFilter;
