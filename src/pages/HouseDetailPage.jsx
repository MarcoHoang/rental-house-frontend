import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Home, Calendar, User, Phone, Mail } from 'lucide-react';
import styled from 'styled-components';
import propertyApi from '../api/propertyApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getHouseTypeLabel, getHouseStatusLabel, getHouseStatusColor } from '../utils/constants';
import { extractHouseFromResponse } from '../utils/apiHelpers';

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

const ContactSection = styled.div`
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-top: 1.5rem;
`;

const ContactTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const ContactButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #2563eb;
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
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching house details for ID:', id);
        
        const response = await propertyApi.getHouseById(id);
        const houseData = extractHouseFromResponse(response);
        
        console.log('House details:', houseData);
        setHouse(houseData);
        setError(null);
      } catch (err) {
        console.error('Error fetching house details:', err);
        setError('Không thể tải thông tin nhà. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHouseDetails();
    }
  }, [id]);

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

  const handleContactHost = () => {
    // TODO: Implement contact functionality
    alert('Tính năng liên hệ chủ nhà sẽ được phát triển sau!');
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

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        Quay lại
      </BackButton>

      <HouseHeader>
        <HouseTitle>{house.title || house.name || 'Không có tên'}</HouseTitle>
        <HouseLocation>
          <MapPin size={20} />
          {house.address || 'Chưa có địa chỉ'}
        </HouseLocation>
        {house.status && (
          <StatusBadge color={getHouseStatusColor(house.status)}>
            {getHouseStatusLabel(house.status)}
          </StatusBadge>
        )}
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
          </PriceSection>

          <InfoGrid>
            <InfoItem>
              <Home size={20} className="icon" />
              <div className="content">
                <div className="label">Loại nhà</div>
                <div className="value">{getHouseTypeLabel(house.houseType)}</div>
              </div>
            </InfoItem>

            <InfoItem>
              <Home size={20} className="icon" />
              <div className="content">
                <div className="label">Diện tích</div>
                <div className="value">{formatArea(house.area)}</div>
              </div>
            </InfoItem>

            {house.hostName && (
              <InfoItem>
                <User size={20} className="icon" />
                <div className="content">
                  <div className="label">Chủ nhà</div>
                  <div className="value">{house.hostName}</div>
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
          </InfoGrid>

          <ContactSection>
            <ContactTitle>Liên hệ chủ nhà</ContactTitle>
            <ContactButton onClick={handleContactHost}>
              <Phone size={16} style={{ marginRight: '0.5rem' }} />
              Liên hệ ngay
            </ContactButton>
          </ContactSection>
        </InfoSection>
      </MainContent>
    </Container>
  );
};

export default HouseDetailPage;
