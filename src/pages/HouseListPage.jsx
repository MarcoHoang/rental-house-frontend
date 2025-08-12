import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHouses } from '../api/houseApi';
import styled from 'styled-components';
import { FaBed, FaBath, FaRulerCombined, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

// Styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.75rem;
`;

const PageSubtitle = styled.p`
  color: #718096;
  font-size: 1.125rem;
  max-width: 700px;
  margin: 0 auto;
`;

const SearchContainer = styled.div`
  max-width: 700px;
  margin: 2rem auto 3rem;
  display: flex;
  gap: 1rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.875rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
`;

const SearchButton = styled.button`
  background-color: #2b6cb0;
  color: white;
  font-weight: 600;
  padding: 0 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2c5282;
  }
`;

const HouseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const HouseCard = styled(Link)`
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;

const HouseImage = styled.div`
  width: 100%;
  height: 220px;
  background-color: #e2e8f0;
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const HouseTypeBadge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const HousePrice = styled.span`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background-color: rgba(43, 108, 176, 0.9);
  color: white;
  font-size: 1.125rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
`;

const HouseInfo = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const HouseTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.75rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3.5rem;
`;

const HouseAddress = styled.div`
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const HouseMeta = styled.div`
  display: flex;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #edf2f7;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #4a5568;
`;

const HouseDescription = styled.p`
  color: #4a5568;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
`;

const HouseFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ecc94b;
  font-weight: 600;
  font-size: 0.9375rem;
`;

const ReviewCount = styled.span`
  color: #718096;
  font-size: 0.8125rem;
  margin-left: 0.25rem;
`;

const ViewDetails = styled.span`
  color: #2b6cb0;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: color 0.2s;
  
  ${HouseCard}:hover & {
    color: #2c5282;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const LoadingText = styled.p`
  color: #718096;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ErrorText = styled.p`
  text-align: center;
  padding: 3rem 1rem;
  color: #e53e3e;
  font-size: 1.125rem;
  background-color: #fff5f5;
  border-radius: 0.5rem;
  max-width: 600px;
  margin: 0 auto;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #4a5568;
  background-color: #f7fafc;
  border-radius: 0.5rem;
  grid-column: 1 / -1;
`;

const HouseListPage = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHouses, setFilteredHouses] = useState([]);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await getHouses();
        const housesData = response.data || [];
        setHouses(housesData);
        setFilteredHouses(housesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching houses:', err);
        setError('Không thể tải danh sách nhà. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchHouses();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredHouses(houses);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = houses.filter(
        house =>
          house.name.toLowerCase().includes(query) ||
          house.address.toLowerCase().includes(query) ||
          house.description?.toLowerCase().includes(query) ||
          house.type?.toLowerCase().includes(query)
      );
      setFilteredHouses(filtered);
    }
  }, [searchQuery, houses]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The search is handled by the useEffect above
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>Đang tải danh sách nhà...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Tìm kiếm chỗ ở lý tưởng của bạn</PageTitle>
        <PageSubtitle>
          Khám phá hàng ngàn lựa chọn nhà ở, căn hộ, biệt thự với đầy đủ tiện nghi
        </PageSubtitle>
      </PageHeader>

      <form onSubmit={handleSearch}>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Tìm kiếm theo địa điểm, loại nhà, tiện ích..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchButton type="submit">
            Tìm kiếm
          </SearchButton>
        </SearchContainer>
      </form>
      
      {filteredHouses.length > 0 ? (
        <HouseGrid>
          {filteredHouses.map((house) => (
            <HouseCard key={house.id} to={`/houses/${house.id}`}>
              <HouseImage 
                imageUrl={house.images?.[0] || 'https://via.placeholder.com/800x600?text=No+Image'} 
                alt={house.name} 
              >
                {house.type && <HouseTypeBadge>{house.type}</HouseTypeBadge>}
                <HousePrice>
                  {new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND',
                    maximumFractionDigits: 0
                  }).format(house.price || 0)}/tháng
                </HousePrice>
              </HouseImage>
              <HouseInfo>
                <HouseTitle>{house.name}</HouseTitle>
                <HouseAddress>
                  <FaMapMarkerAlt />
                  {house.address}
                </HouseAddress>
                
                <HouseMeta>
                  <MetaItem title="Số phòng ngủ">
                    <FaBed />
                    {house.bedrooms || 'N/A'}
                  </MetaItem>
                  <MetaItem title="Số phòng tắm">
                    <FaBath />
                    {house.bathrooms || 'N/A'}
                  </MetaItem>
                  <MetaItem title="Diện tích">
                    <FaRulerCombined />
                    {house.area ? `${house.area}m²` : 'N/A'}
                  </MetaItem>
                </HouseMeta>
                
                <HouseDescription>
                  {house.description || 'Chưa có mô tả chi tiết.'}
                </HouseDescription>
                
                <HouseFooter>
                  {house.rating !== undefined && (
                    <Rating>
                      <FaStar />
                      {house.rating.toFixed(1)}
                      <ReviewCount>({house.reviewCount || 0})</ReviewCount>
                    </Rating>
                  )}
                  <ViewDetails>Xem chi tiết →</ViewDetails>
                </HouseFooter>
              </HouseInfo>
            </HouseCard>
          ))}
        </HouseGrid>
      ) : (
        <NoResults>
          <h3>Không tìm thấy nhà phù hợp</h3>
          <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc xem lại bộ lọc của bạn.</p>
        </NoResults>
      )}
    </PageContainer>
  );
};

export default HouseListPage;
