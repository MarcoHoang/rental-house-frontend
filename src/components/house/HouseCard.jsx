import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Eye, Trash2, MapPin, DollarSign, Home } from "lucide-react";
import { 
  getHouseTypeLabel, 
  getHouseStatusLabel, 
  getHouseStatusColor 
} from "../../utils/constants";

const HouseCard = ({ house, showActions = false, onEdit, onDelete }) => {
  const { id, title, name, address, price, area, houseType, status, imageUrls, imageUrl } = house;
  
  // Sử dụng title nếu có, nếu không thì dùng name
  const displayName = title || name || 'Không có tên';
  
  // Cải thiện logic lấy ảnh
  const getDisplayImage = () => {
    // Ưu tiên imageUrls array
    if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
      const firstImage = imageUrls[0];
      
      // Kiểm tra xem URL có phải là URL backend không
      if (firstImage && firstImage.includes('localhost:8080')) {
        return firstImage;
      }
      
      // Nếu là URL khác (Unsplash, etc.)
      return firstImage;
    }
    
    // Fallback về imageUrl
    if (imageUrl) {
      return imageUrl;
    }
    
    // Placeholder cuối cùng
    return "https://via.placeholder.com/300x200/6B7280/FFFFFF?text=Không+có+ảnh";
  };

  const [imageError, setImageError] = useState(false);
  const displayImage = imageError ? "https://via.placeholder.com/300x200/6B7280/FFFFFF?text=Không+có+ảnh" : getDisplayImage();

  // Format giá tiền
  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    return `${price.toLocaleString("vi-VN")} VNĐ/tháng`;
  };

  // Format diện tích
  const formatArea = (area) => {
    if (!area) return '';
    return `${area}m²`;
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer group">
      {/* Hình ảnh */}
      <div className="relative">
        <img
          className="w-full h-48 object-cover"
          src={displayImage}
          alt={displayName}
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
        {status && (
          <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getHouseStatusColor(status)}`}>
            {getHouseStatusLabel(status)}
          </span>
        )}
      </div>

      {/* Nội dung */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{displayName}</h3>
        
        {/* Thông tin cơ bản */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} />
            <span className="text-sm line-clamp-1">{address || 'Chưa có địa chỉ'}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            {area && (
              <div className="flex items-center gap-2">
                <Home size={16} />
                <span>{formatArea(area)}</span>
              </div>
            )}
            
            {houseType && (
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {getHouseTypeLabel(houseType)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Giá tiền */}
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={16} className="text-green-600" />
          <h4 className="text-green-600 font-semibold text-lg">
            {formatPrice(price)}
          </h4>
        </div>

        {/* Nút xem chi tiết và các nút hành động quản lý */}
        {showActions ? (
          // Khi ở trang quản lý chủ nhà - hiển thị tất cả nút trên 1 hàng
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            {/* Nút xem chi tiết */}
            <Link
              to={`/houses/${id}`}
              state={{ from: window.location.pathname }}
              className="group relative flex-1 flex items-center justify-center p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 hover:scale-105"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Clicking on house detail link for house ID:', id);
              }}
              title="Xem chi tiết nhà"
            >
              <Eye size={18} />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Xem chi tiết nhà
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </Link>
            
            {/* Nút chỉnh sửa */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit(house);
              }}
              className="group relative flex-1 flex items-center justify-center p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-200 hover:scale-105"
              title="Chỉnh sửa nhà"
            >
              <Edit size={18} />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Chỉnh sửa nhà
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </button>
            
            {/* Nút xóa */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(house);
              }}
              className="group relative flex-1 flex items-center justify-center p-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200 hover:scale-105"
              title="Xóa nhà"
            >
              <Trash2 size={18} />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Xóa nhà
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </button>
          </div>
        ) : (
          // Khi ở trang chủ - chỉ hiển thị nút xem chi tiết như cũ
          <div className="pt-3 border-t border-gray-100">
            <Link
              to={`/houses/${id}`}
              state={{ from: window.location.pathname }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Clicking on house detail link for house ID:', id);
              }}
            >
              <Eye size={16} />
              Xem chi tiết
            </Link>
          </div>
        )}
      </div>
      
      {/* Overlay click để xem chi tiết nhà */}
      <Link
        to={`/houses/${id}`}
        state={{ from: window.location.pathname }}
        className="absolute inset-0 z-0"
        onClick={() => console.log('Clicking on house card for house ID:', id)}
        aria-label={`Xem chi tiết nhà ${displayName}`}
      />
    </div>
  );
};

export default HouseCard;
