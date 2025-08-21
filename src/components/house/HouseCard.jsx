import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Edit, Eye, Trash2, MapPin, DollarSign, Home, Heart, Crown } from "lucide-react";
import { 
  getHouseTypeLabel, 
  getHouseStatusLabel, 
  getHouseStatusColor 
} from "../../utils/constants";
import { formatPostingTime } from "../../utils/timeUtils";
import favoriteApi from "../../api/favoriteApi";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../common/Toast";

const HouseCard = ({ house, showActions = false, onEdit, onDelete, fromPage }) => {
  const { id, title, name, address, price, area, houseType, status, imageUrls, imageUrl, createdAt, favoriteCount, hostId, hostName, hostPhone, hostAvatar } = house;
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();
  
  // Sử dụng title nếu có, nếu không thì dùng name
  const displayName = title || name || 'Không có tên';
  
  // Kiểm tra xem nhà này có phải của chủ nhà đang đăng nhập không
  const isMyHouse = user && user.id && hostId && user.id === hostId;
  
  // State cho yêu thích
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  
  // Xác định trang quay lại
  const getBackPage = () => {
    console.log('getBackPage called with fromPage:', fromPage);
    let backPage;
    
    if (fromPage === 'favorites') {
      backPage = '/my-favorites';
    } else if (fromPage === 'all-houses') {
      backPage = '/all-houses';
    } else if (fromPage === 'host') {
      backPage = '/host';
    } else if (fromPage === 'home') {
      backPage = '/';
    } else {
      // Nếu không có fromPage, sử dụng URL hiện tại
      backPage = window.location.pathname;
    }
    
    console.log('getBackPage returning:', backPage);
    return backPage;
  };

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

  // Kiểm tra trạng thái yêu thích khi component mount
  useEffect(() => {
    if (user && id) {
      const checkFavoriteStatus = async () => {
        try {
          setFavoriteLoading(true);
          const response = await favoriteApi.checkFavorite(id);
          console.log('Check favorite response:', response);
          
          // Xử lý response format từ API
          let isFavorited = false;
          if (typeof response === 'boolean') {
            isFavorited = response;
          } else if (response && typeof response.data === 'boolean') {
            isFavorited = response.data;
          } else if (response && response.data && typeof response.data.data === 'boolean') {
            isFavorited = response.data.data;
          } else {
            console.warn('Unexpected favorite response format:', response);
            isFavorited = false;
          }
          
          console.log('Setting initial favorite status to:', isFavorited);
          setIsFavorite(isFavorited);
        } catch (error) {
          console.error('Error checking favorite status:', error);
          // Don't show error for unauthenticated users, just set to false
          if (error.response?.status === 401) {
            setIsFavorite(false);
          }
        } finally {
          setFavoriteLoading(false);
        }
      };
      checkFavoriteStatus();
    } else {
      // Reset favorite status when user is not logged in
      setIsFavorite(false);
    }
  }, [user, id]);

  // Xử lý yêu thích
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Nếu chưa đăng nhập, có thể redirect đến trang login
      showError('Lỗi', 'Vui lòng đăng nhập để yêu thích nhà');
      return;
    }

    try {
      setFavoriteLoading(true);
      const response = await favoriteApi.toggleFavorite(id);
      console.log('Toggle favorite response:', response);
      
      // Xử lý response format từ API
      let isFavorited = false;
      if (typeof response === 'boolean') {
        isFavorited = response;
      } else if (response && typeof response.data === 'boolean') {
        isFavorited = response.data;
      } else if (response && response.data && typeof response.data.data === 'boolean') {
        isFavorited = response.data.data;
      } else {
        console.warn('Unexpected favorite toggle response format:', response);
        // Toggle trạng thái hiện tại nếu không biết response format
        isFavorited = !isFavorite;
      }
      
      console.log('Setting favorite status to:', isFavorited);
      setIsFavorite(isFavorited);
      
      // Hiển thị thông báo thành công
      if (isFavorited) {
        showSuccess('Thành công', 'Đã thêm vào danh sách yêu thích');
      } else {
        showSuccess('Thành công', 'Đã bỏ khỏi danh sách yêu thích');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      // Xử lý lỗi cụ thể hơn
      if (error.response?.status === 401) {
        showError('Lỗi', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        // Có thể redirect đến trang login
        window.location.href = '/login';
      } else if (error.response?.status === 400) {
        // Hiển thị thông báo lỗi cụ thể từ server
        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi yêu thích nhà';
        showError('Lỗi', errorMessage);
      } else if (error.response?.status === 403) {
        showError('Lỗi', 'Bạn không có quyền thực hiện hành động này');
      } else if (error.response?.data?.message) {
        showError('Lỗi', error.response.data.message);
      } else {
        showError('Lỗi', 'Có lỗi xảy ra khi yêu thích nhà. Vui lòng thử lại sau.');
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Format giá tiền
  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    return `${price.toLocaleString("vi-VN")} VNĐ/ngày`;
  };

  // Format diện tích
  const formatArea = (area) => {
    if (!area) return '';
    return `${area}m²`;
  };

  return (
    <div className={`bg-white border-0 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer group h-full flex flex-col ${
      isMyHouse 
        ? 'ring-2 ring-yellow-400 shadow-yellow-100' 
        : 'border-gray-100'
    }`}>
      {/* Hình ảnh - Chiều cao cố định */}
      <div className="relative card-image">
        <img
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={displayImage}
          alt={displayName}
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
        {status && (
          <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${getHouseStatusColor(status)}`}>
            {getHouseStatusLabel(status)}
          </span>
        )}
        
        {/* Badge "Nhà của tôi" */}
        {isMyHouse && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse group-hover:scale-105 transition-transform duration-200" title="Đây là nhà của bạn">
            <Crown size={12} className="text-yellow-200" />
            <span className="text-yellow-100">Nhà của tôi</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Nội dung - Flex grow để chiếm hết không gian còn lại */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Tiêu đề - Chiều cao cố định */}
        <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 card-title">
          {displayName}
        </h3>
        
        {/* Thông tin cơ bản - Chiều cao cố định */}
        <div className="space-y-2 mb-3 flex-1">
          {/* Địa chỉ - Chiều cao cố định */}
          <div className="flex items-start gap-2 text-gray-600 card-address">
            <MapPin size={16} className="mt-0.5 flex-shrink-0" />
            <span className="text-sm line-clamp-2 leading-relaxed">
              {address || 'Chưa có địa chỉ'}
            </span>
          </div>
          
          {/* Diện tích và loại nhà - Chiều cao cố định */}
          <div className="flex items-center justify-between text-sm card-info">
            <div className="flex items-center gap-2 text-gray-600">
              {area ? (
                <React.Fragment>
                  <Home size={16} />
                  <span className="font-medium">{formatArea(area)}</span>
                </React.Fragment>
              ) : (
                <div className="h-4"></div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {houseType ? (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  {getHouseTypeLabel(houseType)}
                </span>
              ) : (
                <div className="h-4"></div>
              )}
            </div>
          </div>
          
                  {/* Thông tin chủ nhà - Chiều cao cố định */}
        <div className="flex items-center gap-3 text-sm text-gray-600 pt-2 border-t border-gray-100 card-host">
            {hostName ? (
              <React.Fragment>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden shadow-md flex-shrink-0">
                  {hostAvatar ? (
                    <img 
                      src={hostAvatar} 
                      alt={hostName} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full text-white text-sm font-bold flex items-center justify-center" style={{ display: hostAvatar ? 'none' : 'flex' }}>
                    {hostName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-700 truncate block">{hostName}</span>
                  {isMyHouse && (
                    <span className="text-xs text-yellow-600 font-medium">(Bạn)</span>
                  )}
                </div>
              </React.Fragment>
            ) : (
              <div className="flex-1 h-8"></div>
            )}
          </div>
        </div>

        {/* Giá tiền - Chiều cao cố định */}
        <div className="flex items-center gap-2 mb-3 card-price">
          <DollarSign size={18} className="text-green-600 flex-shrink-0" />
          <h4 className="text-green-600 font-bold text-lg truncate">
            {formatPrice(price)}
          </h4>
        </div>

        {/* Hiển thị số lượng yêu thích - Chiều cao cố định */}
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 card-favorites">
          {house.favoriteCount !== undefined && house.favoriteCount > 0 ? (
            <React.Fragment>
              <Heart size={16} className="text-red-500 flex-shrink-0" />
              <span className="font-medium">{house.favoriteCount} người yêu thích</span>
            </React.Fragment>
          ) : (
            <div className="h-4"></div>
          )}
        </div>

        {/* Nút xem chi tiết và các nút hành động quản lý */}
        {showActions ? (
          // Khi ở trang quản lý chủ nhà - hiển thị tất cả nút trên 1 hàng
          <div className="flex gap-2 card-actions">
            {/* Nút xem chi tiết */}
            <Link
              to={`/houses/${id}`}
              state={{ from: getBackPage() }}
              className="relative flex-1 flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Clicking on house detail link for house ID:', id);
              }}
              title="Xem chi tiết nhà"
            >
              <Eye size={18} />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
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
              className="relative flex-1 flex items-center justify-center p-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 hover:scale-105 shadow-md"
              title="Chỉnh sửa nhà"
            >
              <Edit size={18} />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
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
              className="relative flex-1 flex items-center justify-center p-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 hover:scale-105 shadow-md"
              title="Xóa nhà"
            >
              <Trash2 size={18} />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Xóa nhà
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </button>
          </div>
        ) : (
          // Khi ở trang chủ - hiển thị thời gian đăng bài và nút yêu thích
          <div className="card-actions">
            <div className="flex items-center justify-between">
              {/* Thời gian đăng bài */}
              <div className="text-sm text-gray-500 font-medium">
                {formatPostingTime(createdAt)}
              </div>
              
              {/* Nút yêu thích */}
              <button
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 shadow-md ${
                  isFavorite 
                    ? 'text-red-500 hover:text-red-600 bg-red-50' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
              >
                <Heart 
                  size={20} 
                  fill={isFavorite ? 'currentColor' : 'none'} 
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay click để xem chi tiết nhà - chỉ áp dụng cho ảnh và tiêu đề */}
      <Link
        to={`/houses/${id}?from=${encodeURIComponent(getBackPage())}`}
        className="absolute inset-0 z-0 pointer-events-none"
        aria-label={`Xem chi tiết nhà ${displayName}`}
      />
      
      {/* Clickable areas cho ảnh và tiêu đề */}
      <Link
        to={`/houses/${id}?from=${encodeURIComponent(getBackPage())}`}
        className="absolute top-0 left-0 w-full h-48 z-10 pointer-events-auto"
        aria-label={`Xem chi tiết nhà ${displayName}`}
      />
      
      <Link
        to={`/houses/${id}?from=${encodeURIComponent(getBackPage())}`}
        className="absolute top-48 left-0 w-full h-20 z-10 pointer-events-auto"
        aria-label={`Xem chi tiết nhà ${displayName}`}
      />
    </div>
  );
};

export default HouseCard;
