import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { housesApi } from "../../api/adminApi";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Home,
  User,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useToast } from "../common/Toast";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #e53e3e;
  border: none;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;

  &:hover {
    background: #c53030;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const MainImage = styled.div`
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageGallery = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
`;

const Thumbnail = styled.div`
  width: 80px;
  height: 60px;
  border-radius: 0.375rem;
  background: #f7fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid ${props => props.$active ? '#3182ce' : 'transparent'};
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.25rem;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.span`
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
`;

const Value = styled.span`
  font-size: 1rem;
  color: #2d3748;
  font-weight: 600;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2f855a;
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;

  &.available {
    background-color: #c6f6d5;
    color: #22543d;
  }
  &.rented {
    background-color: #fed7d7;
    color: #742a2a;
  }
  &.inactive {
    background-color: #e2e8f0;
    color: #4a5568;
  }
`;

const Description = styled.div`
  line-height: 1.6;
  color: #4a5568;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #4a5568;

  .spinner {
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #e53e3e;
  background-color: #fed7d7;
  border-radius: 0.5rem;
`;

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #718096;
  text-align: center;

  svg {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

// Helper để format tiền tệ
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Helper để format giá theo ngày
const formatPricePerDay = (price) => {
  if (price === null || price === undefined) return "0 ₫/ngày";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price) + "/ngày";
};

// Helper để format ngày
const formatDate = (dateString) => {
  if (!dateString) return "Chưa cập nhật";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const HouseDetailPage = () => {
  const { houseId } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchHouseDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await housesApi.getById(houseId);
        console.log("House details:", data);
        setHouse(data);
      } catch (err) {
        console.error("Error fetching house details:", err);
        setError("Không thể tải thông tin chi tiết nhà.");
      } finally {
        setLoading(false);
      }
    };

    fetchHouseDetails();
  }, [houseId]);

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhà này?")) {
      try {
        await housesApi.delete(houseId);
        showSuccess("Xóa thành công!", "Đã xóa nhà khỏi hệ thống.");
        navigate("/admin/houses");
      } catch (err) {
        showError("Xóa thất bại!", "Không thể xóa nhà. Vui lòng thử lại.");
      }
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return { text: 'Có sẵn', className: 'available' };
      case 'RENTED':
        return { text: 'Đã thuê', className: 'rented' };
      case 'INACTIVE':
        return { text: 'Không hoạt động', className: 'inactive' };
      default:
        return { text: 'Không xác định', className: 'inactive' };
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <RefreshCw className="spinner" />
          <span>Đang tải thông tin chi tiết nhà...</span>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <AlertTriangle style={{ marginRight: "0.5rem" }} />
          {error}
        </ErrorContainer>
      </Container>
    );
  }

  if (!house) {
    return (
      <Container>
        <NotFoundContainer>
          <Home />
          <h3>Không tìm thấy nhà</h3>
          <p>Nhà bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        </NotFoundContainer>
      </Container>
    );
  }

  const status = getStatusDisplay(house.status);
  const images = house.imageUrls ? [...new Set(house.imageUrls)] : [];
  const mainImage = images[selectedImage] || images[0] || null;

  return (
    <Container>
      <Header>
        <div>
          <BackButton onClick={() => navigate("/admin/houses")}>
            <ArrowLeft size={16} />
            Quay lại danh sách nhà
          </BackButton>
          <Title>{house.title || "Không có tên"}</Title>
        </div>
        <Actions>
          <DeleteButton onClick={handleDelete}>
            <Trash2 size={16} />
            Xóa nhà
          </DeleteButton>
        </Actions>
      </Header>

      <Content>
        <ImageSection>
          <MainImage>
            {mainImage ? (
              <img 
                src={mainImage} 
                alt={house.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div style={{ 
              display: mainImage ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%'
            }}>
              <Home size={64} />
            </div>
          </MainImage>
          
          {images.length > 1 && (
            <ImageGallery>
              {images.map((image, index) => (
                <Thumbnail
                  key={index}
                  $active={index === selectedImage}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${house.title} - Ảnh ${index + 1}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </Thumbnail>
              ))}
            </ImageGallery>
          )}
        </ImageSection>

        <InfoSection>
          <Card>
            <CardTitle>
              <Home size={20} />
              Thông tin cơ bản
            </CardTitle>
            <InfoGrid>
              <InfoRow>
                <Label>Tên nhà</Label>
                <Value>{house.title || "Chưa cập nhật"}</Value>
              </InfoRow>
              <InfoRow>
                <Label>Loại nhà</Label>
                <Value>{house.houseType || "Chưa cập nhật"}</Value>
              </InfoRow>
              <InfoRow>
                <Label>Diện tích</Label>
                <Value>{house.area ? `${house.area} m²` : "Chưa cập nhật"}</Value>
              </InfoRow>
              <InfoRow>
                <Label>Trạng thái</Label>
                <Status className={status.className}>
                  {status.text}
                </Status>
              </InfoRow>
            </InfoGrid>
          </Card>

          <Card>
            <CardTitle>
              <DollarSign size={20} />
              Thông tin giá
            </CardTitle>
            <InfoGrid>
              <InfoRow>
                <Label>Giá thuê</Label>
                <Price>{formatPricePerDay(house.price)}</Price>
              </InfoRow>
              <InfoRow>
                <Label>Giá gốc</Label>
                <Value>{formatCurrency(house.price)}</Value>
              </InfoRow>
            </InfoGrid>
          </Card>

          <Card>
            <CardTitle>
              <MapPin size={20} />
              Địa chỉ
            </CardTitle>
            <InfoRow>
              <Label>Địa chỉ</Label>
              <Value>{house.address || "Chưa cập nhật"}</Value>
            </InfoRow>
            {house.latitude && house.longitude && (
              <InfoGrid>
                <InfoRow>
                  <Label>Vĩ độ</Label>
                  <Value>{house.latitude}</Value>
                </InfoRow>
                <InfoRow>
                  <Label>Kinh độ</Label>
                  <Value>{house.longitude}</Value>
                </InfoRow>
              </InfoGrid>
            )}
          </Card>

          <Card>
            <CardTitle>
              <User size={20} />
              Thông tin chủ nhà
            </CardTitle>
            <InfoGrid>
              <InfoRow>
                <Label>Họ và tên</Label>
                <Value>{house.hostName || "Chưa cập nhật"}</Value>
              </InfoRow>
              <InfoRow>
                <Label>ID chủ nhà</Label>
                <Value>{house.hostId || "Chưa cập nhật"}</Value>
              </InfoRow>
            </InfoGrid>
          </Card>

          {house.description && (
            <Card>
              <CardTitle>Mô tả</CardTitle>
              <Description>{house.description}</Description>
            </Card>
          )}

          <Card>
            <CardTitle>
              <Calendar size={20} />
              Thông tin hệ thống
            </CardTitle>
            <InfoGrid>
              <InfoRow>
                <Label>Ngày tạo</Label>
                <Value>{formatDate(house.createdAt)}</Value>
              </InfoRow>
              <InfoRow>
                <Label>Cập nhật lần cuối</Label>
                <Value>{formatDate(house.updatedAt)}</Value>
              </InfoRow>
            </InfoGrid>
          </Card>
        </InfoSection>
      </Content>
    </Container>
  );
};

export default HouseDetailPage; 