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
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
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
          
          {area && (
            <div className="flex items-center gap-2 text-gray-600">
              <Home size={16} />
              <span className="text-sm">{formatArea(area)}</span>
            </div>
          )}
          
          {houseType && (
            <div className="flex items-center gap-2 text-gray-600">
              <Home size={16} />
              <span className="text-sm">{getHouseTypeLabel(houseType)}</span>
            </div>
          )}
        </div>

        {/* Giá tiền */}
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={16} className="text-green-600" />
          <h4 className="text-green-600 font-semibold text-lg">
            {formatPrice(price)}
          </h4>
        </div>

        {/* Nút hành động nếu showActions = true */}
        {showActions && (
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <Link
              to={`/houses/${id}`}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <Eye size={16} />
              Xem chi tiết
            </Link>
            
            <button
              onClick={() => onEdit && onEdit(house)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              <Edit size={16} />
              Chỉnh sửa
            </button>
            
            <button
              onClick={() => onDelete && onDelete(house)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              Xóa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HouseCard;
