import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Home, Calendar, User, Phone, Mail, MessageCircle } from 'lucide-react';
import styled from 'styled-components';
import propertyApi from '../api/propertyApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getHouseTypeLabel, getHouseStatusLabel, getHouseStatusColor } from '../utils/constants';
import RentHouseModal from '../components/house/RentHouseModal';
import ReviewSection from '../components/house/ReviewSection';
import ChatButton from '../components/chat/ChatButton';
import ChatModal from '../components/chat/ChatModal';
import { extractHouseFromResponse } from '../utils/apiHelpers';
import { useAuthContext } from '../contexts/AuthContext';
import GoogleMap from '../components/map/GoogleMap';
import ImageGallery from '../components/house/ImageGallery';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-bottom: 200px; /* Thêm padding bottom để tránh bị che bởi section liên hệ chủ nhà */
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e5e7eb;
  }
`;

const HouseHeader = styled.div`
  margin: 2rem 0;
`;

const HouseTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const HouseLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  ${props => props.color}
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  /* Styles for the image gallery container */
`;

const InfoSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  height: fit-content;
`;

const PriceSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #059669;
  margin-bottom: 0.5rem;
`;

const PriceLabel = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .icon {
    color: #6b7280;
    flex-shrink: 0;
  }
  
  .content {
    flex: 1;
  }
  
  .label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }
  
  .value {
    font-weight: 500;
    color: #1f2937;
  }
`;

const DescriptionSection = styled.div`
  margin-top: 2rem;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }
  
  p {
    color: #4b5563;
    line-height: 1.6;
  }
`;

const PropertyCharacteristicsSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .characteristics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 1rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }

  .left-column, .right-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .characteristic-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #f9fafb;
    }
  }

  .icon-container {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0fdf4;
    border-radius: 0.5rem;
    flex-shrink: 0;
    border: 1px solid #dcfce7;
  }

  .content {
    flex: 1;
    
    .label {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 0.25rem;
      font-weight: 500;
    }
    
    .value {
      font-weight: 600;
      color: #1f2937;
      font-size: 0.95rem;
    }
  }

  .house-outline-icon {
    position: relative;
    width: 20px;
    height: 20px;
  }

  .roof {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    background-color: #4ade80;
    border-radius: 50%;
  }

  .body {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 8px;
    background-color: #4ade80;
    border-radius: 4px;
  }

  .document-icon {
    position: relative;
    width: 20px;
    height: 20px;
  }

  .document-body {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #e0f2fe;
    border-radius: 0.25rem;
    border: 1px solid #bae6fd;
  }

  .document-lines {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background-color: #3b82f6;
    border-radius: 50%;
  }

  .furniture-icon {
    position: relative;
    width: 20px;
    height: 20px;
  }

  .sofa {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fef3c7;
    border-radius: 0.25rem;
    border: 1px solid #fde68a;
  }
`;

const MapSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .map-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem 2rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transform: translateY(-1px);
    }
  }

  .map-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    color: #6b7280;
    text-align: center;
  }

  .map-icon {
    background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
    border-radius: 50%;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #7dd3fc;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(14, 165, 233, 0.25);
    }
  }

  .map-text h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .map-text p {
    font-size: 0.9rem;
    color: #4b5563;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .coming-soon {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-radius: 0.5rem;
    border: 1px solid #fbbf24;
    color: #d97706;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    box-shadow: 0 2px 4px rgba(251, 191, 36, 0.2);
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
    }
  }
`;

const ContactHostSection = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }

  h2 {
    display: none; /* Ẩn tiêu đề để tiết kiệm không gian */
  }

  .contact-container {
    background: transparent;
    border: none;
    overflow: visible;
    max-width: 1200px;
    margin: 0 auto;
  }

  .host-contact-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
  }

  .host-avatar {
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }

  .host-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .verification-badge {
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: 18px;
    height: 18px;
    background: #14b8a6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    color: white;
    font-size: 9px;
    font-weight: bold;
  }

  .host-info {
    flex: 1;
    min-width: 0; /* Để text không bị tràn */
  }

  .host-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.125rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .host-status {
    font-size: 0.7rem;
    color: #6b7280;
    white-space: nowrap;
  }

  .contact-buttons {
    display: flex;
    gap: 0.75rem;
    flex-shrink: 0;
    
    @media (max-width: 640px) {
      gap: 0.5rem;
    }
    
    @media (max-width: 480px) {
      gap: 0.375rem;
    }
  }

  .chat-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    color: #374151;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.8rem;
    min-height: 44px;
    white-space: nowrap;
    min-width: 120px;
    
    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }
    
    @media (max-width: 480px) {
      font-size: 0.75rem;
      padding: 0.625rem 0.75rem;
      min-width: 100px;
    }
  }

  .phone-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #14b8a6;
    border: 1px solid #14b8a6;
    border-radius: 0.5rem;
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.8rem;
    min-height: 44px;
    white-space: nowrap;
    min-width: 120px;
    
    &:hover {
      background: #0d9488;
      border-color: #0d9488;
    }
    
    @media (max-width: 480px) {
      font-size: 0.75rem;
      padding: 0.625rem 0.75rem;
      min-width: 100px;
    }
  }

  .phone-icon {
    position: relative;
  }

  .phone-ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 14px;
    height: 14px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    animation: ripple 1.5s infinite;
  }

  @keyframes ripple {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }

  .phone-number {
    font-weight: 600;
  }

  .show-number-text {
    font-size: 0.7rem;
    opacity: 0.9;
  }
`;

const HouseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showRentModal, setShowRentModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [previousPage, setPreviousPage] = useState(null);

  // Lưu trang trước đó khi component mount
  useEffect(() => {
    console.log('HouseDetailPage mounted, location state:', location.state);
    console.log('Current pathname:', location.pathname);
    console.log('Current search:', location.search);
    
    // Đọc URL parameter 'from'
    const urlParams = new URLSearchParams(location.search);
    const fromParam = urlParams.get('from');
    console.log('URL parameter "from":', fromParam);
    
    // Lưu trang trước đó
    if (fromParam) {
      setPreviousPage(fromParam);
      console.log('Set previous page to:', fromParam, 'from URL parameter');
    } else if (location.state?.from) {
      setPreviousPage(location.state.from);
      console.log('Set previous page to:', location.state.from, 'from location state');
    } else {
      // Fallback: kiểm tra referrer
      const referrer = document.referrer;
      console.log('Referrer:', referrer);
      
      if (referrer && referrer.includes(window.location.origin)) {
        try {
          const referrerUrl = new URL(referrer);
          const referrerPath = referrerUrl.pathname;
          console.log('Referrer path:', referrerPath);
          
          // Chỉ lưu referrer nếu nó là một trang hợp lệ
          if (referrerPath === '/my-favorites' || 
              referrerPath === '/all-houses' || 
              referrerPath === '/host' || 
              referrerPath === '/') {
            setPreviousPage(referrerPath);
            console.log('Set previous page to:', referrerPath, 'from referrer');
          } else {
            console.log('Referrer path not recognized, not setting previous page');
          }
        } catch (error) {
          console.error('Error parsing referrer URL:', error);
        }
      }
    }
  }, [location.state, location.pathname, location.search]);

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        setLoading(true);
        
        console.log('Testing API call for house ID:', id);
        const response = await propertyApi.getHouseById(id);
        console.log('API response:', response);
        const houseData = extractHouseFromResponse(response);
        console.log('Extracted house data:', houseData);
        console.log('House data from API - hostPhone:', houseData.hostPhone, 'hostName:', houseData.hostName);
        
        // Nếu người dùng đang đăng nhập với vai trò chủ nhà và đang xem nhà của mình
        console.log('Debug host info:', {
          user: user ? { id: user.id, roleName: user.roleName, phone: user.phone } : null,
          houseData: { hostId: houseData.hostId, hostName: houseData.hostName, hostPhone: houseData.hostPhone },
          isHost: user && user.roleName === 'HOST',
          isOwnHouse: Number(houseData.hostId) === Number(user?.id),
          shouldUpdate: user && user.roleName === 'HOST' && Number(houseData.hostId) === Number(user.id)
        });
        
        if (user && user.roleName === 'HOST' && Number(houseData.hostId) === Number(user.id)) {
          // Sử dụng thông tin từ context thay vì từ API
          houseData.hostName = user.fullName || user.username || user.email;
          // Chỉ cập nhật phone nếu user context có thông tin phone
          if (user.phone) {
            houseData.hostPhone = user.phone;
          }
          console.log('Updated house data with user info:', {
            hostName: houseData.hostName,
            hostPhone: houseData.hostPhone,
            userPhone: user.phone
          });
        }
        
        setHouse(houseData);
        setError(null);
      } catch (err) {
        console.error('Error fetching house details:', err);
        
        if (err.response?.status === 404) {
          setError('Không tìm thấy nhà với ID này. Vui lòng kiểm tra lại.');
        } else if (err.response?.status === 500) {
          setError('Lỗi server. Vui lòng thử lại sau.');
        } else {
          setError('Không thể tải thông tin nhà. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHouseDetails();
    }
  }, [id, user]);

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    return `${price.toLocaleString("vi-VN")} VNĐ/ngày`;
  };

  const formatArea = (area) => {
    if (!area) return 'Chưa có thông tin';
    return `${area}m²`;
  };

  const getImages = () => {
    if (!house) return [];
    
    let images = [];
    
    if (house.imageUrls && Array.isArray(house.imageUrls) && house.imageUrls.length > 0) {
      images = [...house.imageUrls];
    }
    
    if (house.imageUrl && !images.includes(house.imageUrl)) {
      images.push(house.imageUrl);
    }
    
    // Loại bỏ ảnh trùng lặp
    return [...new Set(images)];
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Quay lại
        </BackButton>
        <div style={{ textAlign: 'center', color: '#ef4444', marginTop: '2rem' }}>
          {error}
        </div>
      </Container>
    );
  }

  if (!house) {
    return (
      <Container>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Quay lại
        </BackButton>
        <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>
          Không tìm thấy thông tin nhà
        </div>
      </Container>
    );
  }

  const images = getImages();
  
  const handleBackClick = () => {
    console.log('Current location state:', location.state);
    console.log('Current pathname:', location.pathname);
    console.log('Previous page state:', previousPage);
    console.log('Referrer:', document.referrer);
    
    // Ưu tiên sử dụng previousPage state (được set từ URL parameter)
    if (previousPage) {
      console.log('Navigating to previous page:', previousPage);
      navigate(previousPage);
      return;
    }
    
    // Fallback: kiểm tra URL parameter 'from'
    const urlParams = new URLSearchParams(location.search);
    const fromParam = urlParams.get('from');
    if (fromParam) {
      console.log('Navigating to from URL parameter:', fromParam);
      navigate(fromParam);
      return;
    }
    
    // Fallback: kiểm tra location.state
    if (location.state?.from === '/my-favorites') {
      console.log('Navigating to /my-favorites');
      navigate('/my-favorites');
    } else if (location.state?.from === '/all-houses') {
      console.log('Navigating to /all-houses');
      navigate('/all-houses');
    } else if (location.state?.from === '/host') {
      console.log('Navigating to /host');
      navigate('/host');
    } else if (location.state?.from === '/') {
      console.log('Navigating to /');
      navigate('/');
    } else {
      // Fallback cuối cùng: sử dụng document.referrer hoặc navigate(-1)
      const referrer = document.referrer;
      console.log('Using referrer:', referrer);
      
      if (referrer && referrer.includes(window.location.origin)) {
        // Nếu referrer là từ cùng domain, thử parse URL
        try {
          const referrerUrl = new URL(referrer);
          const referrerPath = referrerUrl.pathname;
          console.log('Referrer path:', referrerPath);
          
          // Kiểm tra xem referrer có phải là trang hợp lệ không
          if (referrerPath === '/my-favorites' || 
              referrerPath === '/all-houses' || 
              referrerPath === '/host' || 
              referrerPath === '/') {
            navigate(referrerPath);
            return;
          }
        } catch (error) {
          console.error('Error parsing referrer URL:', error);
        }
      }
      
      // Fallback cuối cùng: quay lại trang trước đó
      console.log('Using navigate(-1) as final fallback');
      navigate(-1);
    }
  };
  
  return (
    <Container>
      <BackButton onClick={handleBackClick}>
        <ArrowLeft size={16} />
        Quay lại
      </BackButton>

      <HouseHeader>
        <HouseTitle>{house.title || house.name || 'Không có tên'}</HouseTitle>
        <HouseLocation>
          <MapPin size={20} />
          {house.address || 'Chưa có địa chỉ'}
        </HouseLocation>
      </HouseHeader>

      <MainContent>
        <div>
          <ImageSection>
            <ImageGallery 
              images={images}
              title={house.title || house.name}
            />
          </ImageSection>

          <DescriptionSection>
            <h2>Mô tả</h2>
            <p>{house.description || 'Chưa có mô tả chi tiết.'}</p>
          </DescriptionSection>

          {/* Section Đặc điểm bất động sản */}
          <PropertyCharacteristicsSection>
            <h2>Đặc điểm bất động sản</h2>
            <div className="characteristics-grid">
              {/* Cột trái */}
              <div className="left-column">
                <div className="characteristic-item">
                  <div className="icon-container">
                    <DollarSign size={20} />
                  </div>
                  <div className="content">
                    <div className="label">Mức giá</div>
                    <div className="value">{formatPrice(house.price)}</div>
                  </div>
                </div>
                
                <div className="characteristic-item">
                  <div className="icon-container">
                    <Home size={20} />
                  </div>
                  <div className="content">
                    <div className="label">Diện tích</div>
                    <div className="value">{formatArea(house.area)}</div>
                  </div>
                </div>
                
                <div className="characteristic-item">
                  <div className="icon-container">
                    <div className="house-outline-icon">
                      <div className="roof"></div>
                      <div className="body"></div>
                    </div>
                  </div>
                  <div className="content">
                    <div className="label">Mặt tiền</div>
                    <div className="value">10 m</div>
                  </div>
                </div>
              </div>
              
              {/* Cột phải */}
              <div className="right-column">
                <div className="characteristic-item">
                  <div className="icon-container">
                    <div className="document-icon">
                      <div className="document-body"></div>
                      <div className="document-lines"></div>
                    </div>
                  </div>
                  <div className="content">
                    <div className="label">Pháp lý</div>
                    <div className="value">Sổ đỏ/ Sổ hồng</div>
                  </div>
                </div>
                
                <div className="characteristic-item">
                  <div className="icon-container">
                    <div className="furniture-icon">
                      <div className="sofa"></div>
                    </div>
                  </div>
                  <div className="content">
                    <div className="label">Nội thất</div>
                    <div className="value">Thô</div>
                  </div>
                </div>
              </div>
            </div>
          </PropertyCharacteristicsSection>

                     {/* Section Bản đồ */}
           <MapSection>
             <h2>Bản đồ</h2>
             <div className="map-container">
               <GoogleMap
                 latitude={house.latitude}
                 longitude={house.longitude}
                 address={house.address}
                 height="400px"
                 width="100%"
                 showMarker={true}
                 zoom={15}
                 className="house-map"
                 lazyLoad={true}
               />
             </div>
           </MapSection>

          {/* Section Đánh giá */}
          <ReviewSection houseId={house.id} house={house} />

          {/* Section Liên hệ chủ nhà */}
          {house.hostName && (house.hostPhone || house.hostAvatar) && (
            <ContactHostSection>
              <h2>Liên hệ chủ nhà</h2>
              <div className="contact-container">
                <div className="host-contact-row">
                  <div className="host-avatar">
                    <img 
                      src={house.hostAvatar || "/default-avatar.png" || "https://via.placeholder.com/50x50/6B7280/FFFFFF?text=CH"}
                      alt={house.hostName}
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                    <div className="verification-badge">✓</div>
                  </div>
                  
                  <div className="host-info">
                    <div className="host-name">{house.hostName}</div>
                    <div className="host-status">Chủ nhà đã được xác minh</div>
                  </div>
                  
                  <div className="contact-buttons">
                    <button className="chat-button">
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        background: '#0068ff', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        Z
                      </div>
                      Chat Zalo
                    </button>
                    
                    <button 
                      className="phone-button"
                      onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                    >
                      <div className="phone-icon">
                        <Phone size={16} />
                        <div className="phone-ripple"></div>
                      </div>
                      <div>
                        {showPhoneNumber ? (
                          <div className="phone-number">{house.hostPhone || 'Chưa có số điện thoại'}</div>
                        ) : (
                          <>
                            <div className="phone-number">
                              {house.hostPhone ? 
                                `${house.hostPhone.substring(0, 4)} ${house.hostPhone.substring(4, 7)} ***` : 
                                'Chưa có số điện thoại'
                              }
                            </div>
                            <div className="show-number-text">
                              {house.hostPhone ? 'Hiện số' : 'Không có số'}
                            </div>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </ContactHostSection>
          )}
        </div>

        <InfoSection>
          
          <PriceSection>
            <Price>{formatPrice(house.price)}</Price>
            <PriceLabel>Giá thuê mỗi tháng</PriceLabel>
            <div style={{ 
              marginTop: '0.5rem',
              padding: '0.5rem',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              color: '#166534',
              textAlign: 'center'
            }}>
              💰 Giá đã bao gồm phí dịch vụ cơ bản
            </div>
          </PriceSection>

          <InfoGrid>
            <InfoItem>
              <Home size={20} className="icon" />
              <div className="content">
                <div className="label">Loại nhà</div>
                <div className="value">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {getHouseTypeLabel(house.houseType)}
                  </span>
                </div>
              </div>
            </InfoItem>

            <InfoItem>
              <Home size={20} className="icon" />
              <div className="content">
                <div className="label">Diện tích</div>
                <div className="value">{formatArea(house.area)}</div>
              </div>
            </InfoItem>

            {/* Thông tin chủ nhà - hiển thị cho tất cả user */}
            {house.hostName && (
              <InfoItem>
                <User size={20} className="icon" />
                <div className="content">
                  <div className="label">Chủ nhà</div>
                  <div className="value">
                    <div style={{ marginBottom: '0.25rem' }}>
                      <strong>{house.hostName}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Chủ nhà đã được xác minh ✅
                    </div>
                  </div>
                </div>
              </InfoItem>
            )}

            {/* Số điện thoại chủ nhà */}
            <InfoItem>
              <Phone size={20} className="icon" />
              <div className="content">
                <div className="label">Số điện thoại</div>
                <div className="value">
                  {house.hostPhone || 'Chưa cập nhật'}
                  {user && user.roleName === 'HOST' && Number(house.hostId) === Number(user.id) && !house.hostPhone && (
                    <div style={{ 
                      marginTop: '0.25rem',
                      fontSize: '0.75rem',
                      color: '#ef4444',
                      fontStyle: 'italic'
                    }}>
                      💡 Bạn cần cập nhật số điện thoại trong <a href="/profile" style={{ color: '#3b82f6', textDecoration: 'underline' }}>hồ sơ cá nhân</a> để người thuê có thể liên hệ
                    </div>
                  )}
                </div>
              </div>
            </InfoItem>

            {house.createdAt && (
              <InfoItem>
                <Calendar size={20} className="icon" />
                <div className="content">
                  <div className="label">Ngày đăng</div>
                  <div className="value">
                    {new Date(house.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </InfoItem>
            )}

            {/* Thông tin trạng thái nhà */}
            {house.status && (
              <InfoItem>
                <Home size={20} className="icon" />
                <div className="content">
                  <div className="label">Trạng thái</div>
                  <div className="value">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHouseStatusColor(house.status)}`}>
                      {getHouseStatusLabel(house.status)}
                    </span>
                  </div>
                </div>
              </InfoItem>
            )}
          </InfoGrid>

          {/* Phần hành động */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>

            

              
              {/* Nút thuê nhà */}
              {user && user.roleName !== 'HOST' && (
                <button
                  onClick={() => setShowRentModal(true)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  🏠 Thuê nhà ngay
                </button>
              )}

              {/* Nút chat với chủ nhà */}
              {user && house && house.hostId && user.id !== house.hostId && (
                <div style={{ marginBottom: '1rem' }}>
                  <ChatButton
                    hostId={house.hostId}
                    houseId={house.id}
                    onClick={() => setShowChatModal(true)}
                    className="w-full"
                  />
                </div>
              )}
              
              {/* Thông báo cho chủ nhà */}
              {user && house && house.hostId && user.id === house.hostId && (
                <div style={{ 
                  marginBottom: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #0ea5e9',
                  borderRadius: '0.5rem',
                  textAlign: 'center',
                  color: '#0369a1'
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    🏠 Đây là nhà của bạn
                  </div>
                  <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    Bạn có thể quản lý nhà này trong trang chủ nhà
                  </div>
                </div>
              )}
              
              {/* Thông tin bổ sung */}
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#64748b',
                  textAlign: 'center',
                  lineHeight: '1.5'
                }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    ⏰ <strong>Thời gian tư vấn:</strong> 8:00 - 22:00 hàng ngày
                  </div>
                  <div>
                    📞 <strong>Hỗ trợ:</strong> Gọi điện trực tiếp để được tư vấn nhanh nhất
                  </div>
                </div>
              </div>
            </div>
        
        </InfoSection>
      </MainContent>

      {/* Modal thuê nhà */}
      <RentHouseModal
        isOpen={showRentModal}
        onClose={() => setShowRentModal(false)}
        house={house}
        onSuccess={(rentalData) => {
          console.log('Rental created successfully:', rentalData);
          // Có thể thêm logic redirect hoặc cập nhật UI ở đây
        }}
      />

      {/* Modal chat */}
      {house && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          hostId={house.hostId}
          houseId={house.id}
          hostName={house.hostName}
          houseTitle={house.title}
        />
      )}
    </Container>
  );
};

export default HouseDetailPage;
