import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Heart, Search, Filter, MapPin, DollarSign, Home, Trash2 } from 'lucide-react';
import favoriteApi from '../api/favoriteApi';
import { useToast } from '../components/common/Toast';
import { useAuthContext } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import HouseCard from '../components/house/HouseCard.jsx';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: #f8fafc;
`;

const Header = styled.div`
  margin-bottom: 3rem;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  pointer-events: auto;
  
  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    position: static;
    margin-bottom: 1rem;
    align-self: flex-start;
  }
`;

const HeaderContent = styled.div`
  text-align: center;
  padding-left: 120px; /* Tạo khoảng trống cho nút quay lại */
  
  @media (max-width: 768px) {
    padding-left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  margin-top: 0.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchAndFilterSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const StatsSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  flex: 1;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
`;

const HousesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const MyFavoritesPage = () => {
  const [favoriteHouses, setFavoriteHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { user } = useAuthContext();
  const location = useLocation();
  const [previousPage, setPreviousPage] = useState(null);

  // Lưu trang trước đó khi component mount
  useEffect(() => {
    const referrer = document.referrer;
    console.log('MyFavoritesPage referrer:', referrer);
    
    if (referrer && referrer.includes(window.location.origin)) {
      try {
        const referrerUrl = new URL(referrer);
        const referrerPath = referrerUrl.pathname;
        console.log('Referrer path:', referrerPath);
        
        // Chỉ lưu referrer nếu nó không phải là trang chi tiết nhà
        if (referrerPath !== '/my-favorites' && !referrerPath.startsWith('/houses/')) {
          setPreviousPage(referrerPath);
          console.log('Set previous page to:', referrerPath);
        }
      } catch (error) {
        console.error('Error parsing referrer URL:', error);
      }
    }
  }, []);

  const handleBackClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('MyFavoritesPage handleBackClick called');
    console.log('Current location:', window.location.href);
    console.log('Referrer:', document.referrer);
    console.log('Navigating to home page');
    navigate('/');
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          setError('Vui lòng đăng nhập để xem danh sách yêu thích');
          return;
        }

        // Lấy danh sách nhà yêu thích với thông tin chi tiết
        const response = await favoriteApi.getMyFavoriteHouses();
        console.log('Get favorite houses response:', response);
        const favoriteHousesData = response?.data || [];
        console.log('Favorite houses data:', favoriteHousesData);
        
        setFavoriteHouses(favoriteHousesData);
        setFilteredHouses(favoriteHousesData);
        
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Không thể tải danh sách yêu thích. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  // Xử lý tìm kiếm
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredHouses(favoriteHouses);
      return;
    }

    const filtered = favoriteHouses.filter(house => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (house.title && house.title.toLowerCase().includes(searchLower)) ||
        (house.name && house.name.toLowerCase().includes(searchLower)) ||
        (house.address && house.address.toLowerCase().includes(searchLower)) ||
        (house.description && house.description.toLowerCase().includes(searchLower))
      );
    });

    setFilteredHouses(filtered);
  }, [searchTerm, favoriteHouses]);

  const handleRemoveFromFavorites = async (houseId) => {
    try {
      console.log('Removing house from favorites:', houseId);
      const response = await favoriteApi.toggleFavorite(houseId);
      console.log('Toggle favorite response:', response);
      
      // Cập nhật danh sách yêu thích sau khi xóa
      setFavoriteHouses(prev => prev.filter(house => house.id !== houseId));
      setFilteredHouses(prev => prev.filter(house => house.id !== houseId));
      
      showSuccess('Thành công', 'Đã xóa khỏi danh sách yêu thích');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      
      // Xử lý lỗi cụ thể hơn
      if (error.response?.status === 400) {
        // Hiển thị thông báo lỗi cụ thể từ server
        const errorMessage = error.response?.data?.message || 'Không thể xóa khỏi danh sách yêu thích';
        showError('Lỗi', errorMessage);
      } else if (error.response?.status === 401) {
        showError('Lỗi', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        window.location.href = '/login';
      } else if (error.response?.data?.message) {
        showError('Lỗi', error.response.data.message);
      } else {
        showError('Lỗi', 'Không thể xóa khỏi danh sách yêu thích');
      }
    }
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
        <div style={{ textAlign: 'center', color: '#ef4444' }}>
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBackClick}>
          <ArrowLeft size={16} />
          Quay lại
        </BackButton>
        <HeaderContent>
          <PageTitle>
            <Heart size={24} />
            Nhà yêu thích của tôi
          </PageTitle>
          <Subtitle>
            {favoriteHouses.length > 0 
              ? `Bạn có ${favoriteHouses.length} nhà trong danh sách yêu thích`
              : 'Bạn chưa có nhà nào trong danh sách yêu thích'
            }
          </Subtitle>
        </HeaderContent>
      </Header>

      {favoriteHouses.length === 0 ? (
        <EmptyState>
          <EmptyIcon>❤️</EmptyIcon>
          <EmptyTitle>Chưa có nhà yêu thích</EmptyTitle>
          <EmptyDescription>
            Bạn chưa thêm nhà nào vào danh sách yêu thích. Hãy khám phá và yêu thích những ngôi nhà phù hợp với bạn.
          </EmptyDescription>
          <ActionButton onClick={() => navigate('/all-houses')}>
            Khám phá nhà
          </ActionButton>
        </EmptyState>
      ) : (
        <>
          <SearchAndFilterSection>
            <StatsSection>
              <StatCard>
                <StatNumber>{favoriteHouses.length}</StatNumber>
                <StatLabel>Tổng số nhà yêu thích</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{filteredHouses.length}</StatNumber>
                <StatLabel>Kết quả hiển thị</StatLabel>
              </StatCard>
            </StatsSection>

            <SearchBar>
              <SearchInput
                type="text"
                placeholder="Tìm kiếm nhà yêu thích..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FilterSelect
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="all">Tất cả giá</option>
                <option value="low">Dưới 5 triệu</option>
                <option value="medium">5-15 triệu</option>
                <option value="high">Trên 15 triệu</option>
              </FilterSelect>
            </SearchBar>
          </SearchAndFilterSection>

          <HousesGrid>
            {filteredHouses.map((house) => (
              <HouseCard
                key={house.id}
                house={house}
                fromPage="favorites"
                onRemoveFromFavorites={() => handleRemoveFromFavorites(house.id)}
              />
            ))}
          </HousesGrid>
        </>
      )}
    </Container>
  );
};

export default MyFavoritesPage;
