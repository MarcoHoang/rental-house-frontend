import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Home, Calendar, User, Phone, Mail } from 'lucide-react';
import styled from 'styled-components';
import propertyApi from '../api/propertyApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getHouseTypeLabel, getHouseStatusLabel, getHouseStatusColor } from '../utils/constants';
import RentHouseModal from '../components/house/RentHouseModal';
import { extractHouseFromResponse } from '../utils/apiHelpers';
import { useAuthContext } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
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
  .main-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.5rem;
  }
  
  .thumbnail {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 0.8;
    }
  }
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

const HouseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showRentModal, setShowRentModal] = useState(false);

  console.log('=== HOUSE DETAIL PAGE DEBUG ===');
  console.log('Component rendered');
  console.log('User object:', user);
  console.log('User exists:', !!user);
  console.log('User role:', user?.roleName);
  console.log('User ID:', user?.id);
  console.log('Token exists:', !!localStorage.getItem('token'));
  console.log('================================');

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching house details for ID:', id);
        console.log('Current user:', {
          user: user,
          roleName: user?.roleName,
          id: user?.id
        });
        
        const response = await propertyApi.getHouseById(id);
        const houseData = extractHouseFromResponse(response);
        
        console.log('House details:', houseData);
        console.log('House status:', houseData?.status);
        console.log('House status type:', typeof houseData?.status);
        
        // Nếu người dùng đang đăng nhập với vai trò chủ nhà và đang xem nhà của mình
        if (user && user.roleName === 'HOST' && houseData.hostId === user.id) {
          // Sử dụng thông tin từ context thay vì từ API
          houseData.hostName = user.fullName || user.username || user.email;
          houseData.hostPhone = user.phone;
        }
        
        setHouse(houseData);
        setError(null);
      } catch (err) {
        console.error('Error fetching house details:', err);
        
        // Log chi tiết lỗi để debug
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
        } else if (err.request) {
          console.error('Request error:', err.request);
        } else {
          console.error('Error message:', err.message);
        }
        
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
    return `${price.toLocaleString("vi-VN")} VNĐ/tháng`;
  };

  const formatArea = (area) => {
    if (!area) return 'Chưa có thông tin';
    return `${area}m²`;
  };

  const getImages = () => {
    if (!house) return [];
    
    if (house.imageUrls && Array.isArray(house.imageUrls) && house.imageUrls.length > 0) {
      return house.imageUrls;
    }
    
    if (house.imageUrl) {
      return [house.imageUrl];
    }
    
    return [];
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
  const mainImage = images[selectedImage] || "https://via.placeholder.com/600x400/6B7280/FFFFFF?text=Không+có+ảnh";

  const handleBackClick = () => {
    // Kiểm tra xem người dùng đến từ trang nào
    if (location.state?.from === 'all-houses') {
      navigate('/all-houses');
    } else {
      navigate(-1);
    }
  };

  console.log('=== HOUSE DETAIL PAGE RENDER ===');
  console.log('User exists:', !!user);
  console.log('User role:', user?.roleName);
  console.log('House exists:', !!house);
  console.log('Should show rent button:', !!user);
  console.log('================================');
  
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
            <img
              src={mainImage}
              alt={house.title || house.name}
              className="main-image"
            />
            {images.length > 1 && (
              <div className="image-grid">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Ảnh ${index + 1}`}
                    className="thumbnail"
                    onClick={() => setSelectedImage(index)}
                    style={{
                      border: selectedImage === index ? '2px solid #3b82f6' : 'none'
                    }}
                  />
                ))}
              </div>
            )}
          </ImageSection>

          <DescriptionSection>
            <h2>Mô tả</h2>
            <p>{house.description || 'Chưa có mô tả chi tiết.'}</p>
          </DescriptionSection>
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
            {house.hostPhone && (
              <InfoItem>
                <Phone size={20} className="icon" />
                <div className="content">
                  <div className="label">Số điện thoại</div>
                  <div className="value">{house.hostPhone}</div>
                </div>
              </InfoItem>
            )}

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
            {/* Thông báo cho người dùng thường */}
            {user?.roleName !== 'ADMIN' && user?.roleName !== 'HOST' && (
              <div style={{ 
                marginBottom: '1rem', 
                padding: '0.75rem', 
                backgroundColor: '#f0f9ff', 
                border: '1px solid #bae6fd', 
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: '#0369a1'
              }}>
                💡 <strong>Mẹo:</strong> Gọi điện trực tiếp để được tư vấn chi tiết và đặt lịch xem nhà!
              </div>
            )}
            

              
              {/* Nút thuê nhà */}
              {user && (
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
    </Container>
  );
};

export default HouseDetailPage;
