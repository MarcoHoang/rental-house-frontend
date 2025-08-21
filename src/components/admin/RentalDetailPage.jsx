import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  User, 
  Home, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock as ClockIcon
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatDate, formatCurrency } from '../../utils/timeUtils';

// Function tính số ngày giữa 2 ngày (giống logic trong RentHouseModal)
const calculateDurationInDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const hours = (end - start) / (1000 * 60 * 60);
  
  // Tính số ngày, nếu ít hơn hoặc bằng 24 giờ thì tính 1 ngày, nếu nhiều hơn thì làm tròn lên
  return hours <= 24 ? 1 : Math.ceil(hours / 24);
};

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
`;

const MainSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const SideSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: #1f2937;
  font-weight: 500;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;

  &.pending {
    background-color: #fef3c7;
    color: #92400e;
  }
  &.active {
    background-color: #c6f6d5;
    color: #22543d;
  }
  &.completed {
    background-color: #dbeafe;
    color: #1e40af;
  }
  &.cancelled {
    background-color: #fed7d7;
    color: #742a2a;
  }
`;

const Description = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
`;

const RentalDetailPage = () => {
  const { rentalId } = useParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRentalDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getRentalDetails(rentalId);
        setRental(data);
      } catch (err) {
        console.error('Error fetching rental details:', err);
        setError("Không thể tải thông tin hợp đồng.");
      } finally {
        setLoading(false);
      }
    };

    fetchRentalDetails();
  }, [rentalId]);

  const getStatusInfo = (status) => {
    const statusConfig = {
      PENDING: {
        label: 'Chờ duyệt',
        className: 'pending',
        icon: ClockIcon
      },
      APPROVED: {
        label: 'Đã duyệt',
        className: 'active',
        icon: CheckCircle
      },
      REJECTED: {
        label: 'Đã từ chối',
        className: 'cancelled',
        icon: XCircle
      },
      SCHEDULED: {
        label: 'Đã xác nhận',
        className: 'active',
        icon: CheckCircle
      },
      CHECKED_IN: {
        label: 'Đã nhận phòng',
        className: 'active',
        icon: CheckCircle
      },
      CHECKED_OUT: {
        label: 'Đã trả phòng',
        className: 'completed',
        icon: CheckCircle
      },
      CANCELED: {
        label: 'Đã hủy',
        className: 'cancelled',
        icon: XCircle
      }
    };
    return statusConfig[status] || statusConfig.PENDING;
  };

  if (loading) {
    return (
      <LoadingSpinner>
        <div className="spinner"></div>
      </LoadingSpinner>
    );
  }

  if (error) {
    return (
      <EmptyState>
        <AlertTriangle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <p>{error}</p>
      </EmptyState>
    );
  }

  if (!rental) {
    return (
      <EmptyState>
        <p>Không tìm thấy thông tin hợp đồng.</p>
      </EmptyState>
    );
  }

  const statusInfo = getStatusInfo(rental.status);
  const StatusIcon = statusInfo.icon;

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/admin/contracts')}>
          <ArrowLeft size={20} />
          Quay lại
        </BackButton>
        <Title>Chi tiết hợp đồng #{rental.id}</Title>
      </Header>

      <Content>
        <MainSection>
          <SectionTitle>
            <Home size={24} />
            Thông tin hợp đồng
          </SectionTitle>

          <InfoGrid>
            <InfoItem>
              <InfoLabel>Trạng thái</InfoLabel>
              <StatusBadge className={statusInfo.className}>
                <StatusIcon size={16} />
                {statusInfo.label}
              </StatusBadge>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Ngày tạo</InfoLabel>
              <InfoValue>{formatDate(rental.createdAt)}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Ngày bắt đầu</InfoLabel>
              <InfoValue>{formatDate(rental.startDate)}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Ngày kết thúc</InfoLabel>
              <InfoValue>{formatDate(rental.endDate)}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Thời hạn</InfoLabel>
              <InfoValue>{calculateDurationInDays(rental.startDate, rental.endDate)} ngày</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Giá thuê/tháng</InfoLabel>
              <InfoValue>{formatCurrency(rental.monthlyRent)}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Tổng tiền</InfoLabel>
              <InfoValue>{formatCurrency(rental.totalPrice)}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Số khách</InfoLabel>
              <InfoValue>{rental.guestCount || 'N/A'} người</InfoValue>
            </InfoItem>
          </InfoGrid>

          {rental.messageToHost && (
            <div>
              <InfoLabel>Ghi chú cho chủ nhà</InfoLabel>
              <Description>{rental.messageToHost}</Description>
            </div>
          )}

          {rental.cancelReason && (
            <div style={{ marginTop: '1rem' }}>
              <InfoLabel>Lý do hủy</InfoLabel>
              <Description style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}>
                {rental.cancelReason}
              </Description>
            </div>
          )}
        </MainSection>

        <SideSection>
          <Card>
            <SectionTitle>
              <User size={20} />
              Thông tin người thuê
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Tên</InfoLabel>
                <InfoValue>{rental.renterName || 'N/A'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{rental.renterEmail || 'N/A'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Số điện thoại</InfoLabel>
                <InfoValue>{rental.renterPhone || 'N/A'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Địa chỉ</InfoLabel>
                <InfoValue>{rental.renterAddress || 'N/A'}</InfoValue>
              </InfoItem>
              {rental.renterAvatar && (
                <InfoItem>
                  <InfoLabel>Avatar</InfoLabel>
                  <InfoValue>
                    <img 
                      src={rental.renterAvatar} 
                      alt="Avatar" 
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                  </InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </Card>

          <Card>
            <SectionTitle>
              <Home size={20} />
              Thông tin nhà
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Tên nhà</InfoLabel>
                <InfoValue>{rental.houseTitle || 'N/A'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Địa chỉ</InfoLabel>
                <InfoValue>{rental.houseAddress || 'N/A'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Loại nhà</InfoLabel>
                <InfoValue>{rental.houseType || 'N/A'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Trạng thái nhà</InfoLabel>
                <InfoValue>{rental.houseStatus || 'N/A'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Giá/tháng</InfoLabel>
                <InfoValue>{formatCurrency(rental.housePrice)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Diện tích</InfoLabel>
                <InfoValue>{rental.houseArea ? `${rental.houseArea}m²` : 'N/A'}</InfoValue>
              </InfoItem>
              {rental.houseDescription && (
                <InfoItem style={{ gridColumn: '1 / -1' }}>
                  <InfoLabel>Mô tả</InfoLabel>
                  <InfoValue>{rental.houseDescription}</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </Card>

          <Card>
            <SectionTitle>
              <User size={20} />
              Thông tin chủ nhà
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Tên chủ nhà</InfoLabel>
                <InfoValue>{rental.hostName || 'N/A'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{rental.hostEmail || 'N/A'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Số điện thoại</InfoLabel>
                <InfoValue>{rental.hostPhone || 'N/A'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Địa chỉ</InfoLabel>
                <InfoValue>{rental.hostAddress || 'N/A'}</InfoValue>
              </InfoItem>
              {rental.hostAvatar && (
                <InfoItem>
                  <InfoLabel>Avatar</InfoLabel>
                  <InfoValue>
                    <img 
                      src={rental.hostAvatar} 
                      alt="Host Avatar" 
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                  </InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </Card>

          <Card>
            <SectionTitle>
              <Calendar size={20} />
              Lịch sử
            </SectionTitle>
            <InfoGrid>
              {rental.createdAt && (
                <InfoItem>
                  <InfoLabel>Tạo lúc</InfoLabel>
                  <InfoValue>{formatDate(rental.createdAt)}</InfoValue>
                </InfoItem>
              )}
              {rental.approvedAt && (
                <InfoItem>
                  <InfoLabel>Duyệt lúc</InfoLabel>
                  <InfoValue>{formatDate(rental.approvedAt)}</InfoValue>
                </InfoItem>
              )}
              {rental.approvedByName && (
                <InfoItem>
                  <InfoLabel>Duyệt bởi</InfoLabel>
                  <InfoValue>{rental.approvedByName}</InfoValue>
                </InfoItem>
              )}
              {rental.rejectedAt && (
                <InfoItem>
                  <InfoLabel>Từ chối lúc</InfoLabel>
                  <InfoValue>{formatDate(rental.rejectedAt)}</InfoValue>
                </InfoItem>
              )}
              {rental.rejectedByName && (
                <InfoItem>
                  <InfoLabel>Từ chối bởi</InfoLabel>
                  <InfoValue>{rental.rejectedByName}</InfoValue>
                </InfoItem>
              )}
              {rental.canceledAt && (
                <InfoItem>
                  <InfoLabel>Hủy lúc</InfoLabel>
                  <InfoValue>{formatDate(rental.canceledAt)}</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </Card>
        </SideSection>
      </Content>
    </Container>
  );
};

export default RentalDetailPage;
