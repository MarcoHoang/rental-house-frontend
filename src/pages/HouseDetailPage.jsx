import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHouseById } from '../api/houseApi';
import styled from 'styled-components';

// Styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #4a5568;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
  
  &:hover {
    color: #2b6cb0;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const HouseHeader = styled.div`
  margin-bottom: 2rem;
`;

const HouseTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const HouseAddress = styled.p`
  color: #4a5568;
  font-size: 1.125rem;
  margin-bottom: 1rem;
`;

const HousePrice = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2b6cb0;
  margin-bottom: 1.5rem;
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 200px 200px;
  gap: 1rem;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
  overflow: hidden;
  
  & > *:first-child {
    grid-row: 1 / -1;
  }
`;

const MainImage = styled.div`
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const Thumbnail = styled.div`
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const HouseDescription = styled.p`
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: #4a5568;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  padding: 4rem 0;
  color: #718096;
`;

const ErrorText = styled.p`
  text-align: center;
  padding: 4rem 0;
  color: #e53e3e;
`;

const HouseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const response = await getHouseById(id);
        setHouse(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setMainImage(response.data.images[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching house details:', err);
        setError('Không thể tải thông tin chi tiết ngôi nhà. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchHouse();
  }, [id]);

  if (loading) {
    return <LoadingText>Đang tải thông tin chi tiết...</LoadingText>;
  }

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  if (!house) {
    return <ErrorText>Không tìm thấy thông tin ngôi nhà</ErrorText>;
  }

  // Prepare images for gallery (first 4 images)
  const galleryImages = house.images?.slice(0, 4) || [];
  const remainingImages = galleryImages.slice(1);

  return (
    <PageContainer>
      <BackButton onClick={() => navigate(-1)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Quay lại
      </BackButton>

      <HouseHeader>
        <HouseTitle>{house.name}</HouseTitle>
        <HouseAddress>{house.address}</HouseAddress>
        <HousePrice>
          {new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
          }).format(house.price || 0)} / tháng
        </HousePrice>
      </HouseHeader>

      <ImageGallery>
        <MainImage 
          src={mainImage || 'https://via.placeholder.com/800x600?text=No+Image'} 
          alt={house.name}
        />
        {remainingImages.map((image, index) => (
          <Thumbnail 
            key={index} 
            src={image} 
            onClick={() => setMainImage(image)}
            alt={`${house.name} - ${index + 2}`}
          />
        ))}
      </ImageGallery>

      <Section>
        <SectionTitle>Mô tả</SectionTitle>
        <HouseDescription>
          {house.description || 'Chưa có mô tả chi tiết về ngôi nhà này.'}
        </HouseDescription>
      </Section>

      <Section>
        <SectionTitle>Thông tin chi tiết</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Diện tích</p>
            <p className="font-medium">{house.area || '--'} m²</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Số phòng ngủ</p>
            <p className="font-medium">{house.bedrooms || '--'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Số phòng tắm</p>
            <p className="font-medium">{house.bathrooms || '--'}</p>
          </div>
        </div>
      </Section>

      {house.amenities && house.amenities.length > 0 && (
        <Section>
          <SectionTitle>Tiện ích</SectionTitle>
          <AmenitiesGrid>
            {house.amenities.map((amenity, index) => (
              <AmenityItem key={index}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {amenity}
              </AmenityItem>
            ))}
          </AmenitiesGrid>
        </Section>
      )}

      <Section>
        <SectionTitle>Thông tin liên hệ</SectionTitle>
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-gray-700 mb-2">Liên hệ chủ nhà để xem nhà và đặt lịch hẹn.</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Liên hệ ngay
          </button>
        </div>
      </Section>
    </PageContainer>
  );
};

export default HouseDetailPage;
