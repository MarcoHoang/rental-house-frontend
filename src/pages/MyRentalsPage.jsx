import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Calendar, MapPin, DollarSign, Home, User, Phone } from 'lucide-react';
import rentalApi from '../api/rentalApi';
import { useToast } from '../components/common/Toast';
import { useAuthContext } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import CancelRentalModal from '../components/common/CancelRentalModal';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: #f8fafc;
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
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const RentalCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const RentalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const HouseTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &.pending {
    background: #fef3c7;
    color: #92400e;
  }

  &.approved {
    background: #d1fae5;
    color: #065f46;
  }

  &.scheduled {
    background: #dbeafe;
    color: #1e40af;
  }

  &.rejected {
    background: #fee2e2;
    color: #991b1b;
  }

  &.scheduled {
    background: #dbeafe;
    color: #1e40af;
  }

  &.checked-in {
    background: #d1fae5;
    color: #065f46;
  }

  &.checked-out {
    background: #e0e7ff;
    color: #3730a3;
  }

  &.canceled {
    background: #fee2e2;
    color: #991b1b;
  }
`;

const RentalDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;

  .icon {
    color: #9ca3af;
  }

  .value {
    font-weight: 500;
    color: #374151;
  }
`;

const PriceInfo = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const PriceTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const PriceDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;

  &:last-child {
    font-weight: 600;
    font-size: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  }

  &.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover {
      background: #e5e7eb;
    }
  }

  &.danger {
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fecaca;

    &:hover {
      background: #fecaca;
    }
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

const getStatusLabel = (status) => {
  switch (status) {
    case 'PENDING':
      return 'Chờ duyệt';
    case 'APPROVED':
      return 'Đã chấp nhận';
    case 'REJECTED':
      return 'Đã từ chối';
    case 'SCHEDULED':
      return 'Đã lên lịch';
    case 'CHECKED_IN':
      return 'Đã nhận phòng';
    case 'CHECKED_OUT':
      return 'Đã trả phòng';
    case 'CANCELED':
      return 'Đã hủy';
    default:
      return status;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'pending';
    case 'APPROVED':
      return 'approved';
    case 'REJECTED':
      return 'rejected';
    case 'SCHEDULED':
      return 'scheduled';
    case 'CHECKED_IN':
      return 'checked-in';
    case 'CHECKED_OUT':
      return 'checked-out';
    case 'CANCELED':
      return 'canceled';
    default:
      return 'scheduled';
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const MyRentalsPage = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [rentalToCancel, setRentalToCancel] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        
        console.log('MyRentalsPage - User check:', {
          user: user,
          userId: user?.id,
          userRole: user?.roleName,
          hasToken: !!localStorage.getItem('token'),
          token: localStorage.getItem('token')?.substring(0, 50) + '...'
        });
        
        if (!user || !user.id) {
          setError('Vui lòng đăng nhập để xem đơn thuê của bạn');
          return;
        }

        // Debug: Thử gọi API ngay cả khi user không phải USER role
        console.log('Attempting to fetch rentals for user:', user.roleName);

        const rentalsData = await rentalApi.getMyRentals();
        console.log('MyRentalsPage - Raw rentals data:', rentalsData);
        console.log('MyRentalsPage - Rentals statuses:', rentalsData.map(r => ({ id: r.id, status: r.status, title: r.houseTitle })));
        setRentals(rentalsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching rentals:', err);
        setError('Không thể tải danh sách đơn thuê. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRentals();
    }
  }, [user]);

  const handleCancelRental = (rental) => {
    setRentalToCancel(rental);
    setShowCancelModal(true);
  };

  const confirmCancelRental = async (reason) => {
    if (!rentalToCancel) return;

    try {
      setCancelLoading(true);
      await rentalApi.cancelRental(rentalToCancel.id, reason);
      showSuccess('Thành công', 'Đã hủy đơn thuê thành công');
      
      // Cập nhật danh sách
      setRentals(rentals.filter(rental => rental.id !== rentalToCancel.id));
      setShowCancelModal(false);
      setRentalToCancel(null);
    } catch (err) {
      console.error('Error canceling rental:', err);
      
      // Xử lý lỗi chi tiết hơn
      let errorMessage = 'Không thể hủy đơn thuê. Vui lòng thử lại sau.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      showError('Lỗi', errorMessage);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setRentalToCancel(null);
  };

  const handleViewHouse = (houseId) => {
    navigate(`/houses/${houseId}`);
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
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Quay lại
          </BackButton>
        </Header>
        <div style={{ textAlign: 'center', color: '#ef4444', marginTop: '2rem' }}>
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Quay lại
        </BackButton>
        <PageTitle>Đơn thuê của tôi</PageTitle>
      </Header>

      {rentals.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🏠</EmptyIcon>
          <EmptyTitle>Chưa có đơn thuê nào</EmptyTitle>
          <EmptyDescription>
            Bạn chưa có đơn thuê nhà nào. Hãy khám phá các ngôi nhà đẹp và đặt thuê ngay!
          </EmptyDescription>
          <Button 
            className="primary" 
            onClick={() => navigate('/all-houses')}
          >
            Khám phá nhà cho thuê
          </Button>
        </EmptyState>
      ) : (
        rentals.map((rental) => (
          <RentalCard key={rental.id}>
            <RentalHeader>
              <HouseTitle>{rental.houseTitle}</HouseTitle>
              <StatusBadge className={getStatusColor(rental.status)}>
                {getStatusLabel(rental.status)}
              </StatusBadge>
            </RentalHeader>

            <RentalDetails>
              <DetailItem>
                <Calendar size={16} className="icon" />
                <span>Ngày bắt đầu:</span>
                <span className="value">{formatDate(rental.startDate)}</span>
              </DetailItem>
              
              <DetailItem>
                <Calendar size={16} className="icon" />
                <span>Ngày kết thúc:</span>
                <span className="value">{formatDate(rental.endDate)}</span>
              </DetailItem>
              
              <DetailItem>
                <MapPin size={16} className="icon" />
                <span>Địa chỉ:</span>
                <span className="value">{rental.houseAddress || 'Chưa có thông tin'}</span>
              </DetailItem>
              
              <DetailItem>
                <User size={16} className="icon" />
                <span>Số khách:</span>
                <span className="value">{rental.guestCount || 1} người</span>
              </DetailItem>
              
              <DetailItem>
                <Calendar size={16} className="icon" />
                <span>Ngày đặt:</span>
                <span className="value">{formatDateTime(rental.createdAt)}</span>
              </DetailItem>
            </RentalDetails>

            {rental.messageToHost && (
              <div style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                marginBottom: '1rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Lời nhắn cho chủ nhà:
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {rental.messageToHost}
                </div>
              </div>
            )}

            {rental.rejectReason && (
              <div style={{ 
                background: '#fef2f2', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                marginBottom: '1rem',
                border: '1px solid #fecaca'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#dc2626' }}>
                  Lý do từ chối:
                </div>
                <div style={{ color: '#991b1b', fontSize: '0.875rem' }}>
                  {rental.rejectReason}
                </div>
              </div>
            )}

            {(rental.status === 'APPROVED' || rental.status === 'SCHEDULED') && (
              <div style={{ 
                background: '#f0fdf4', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                marginBottom: '1rem',
                border: '1px solid #bbf7d0'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#166534' }}>
                  ✅ Yêu cầu đã được chấp nhận!
                </div>
                <div style={{ color: '#15803d', fontSize: '0.875rem' }}>
                  Chủ nhà đã chấp nhận yêu cầu thuê nhà của bạn. Vui lòng liên hệ với chủ nhà để sắp xếp thời gian nhận phòng.
                </div>
              </div>
            )}

            {rental.status === 'CHECKED_IN' && (
              <div style={{ 
                background: '#eff6ff', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                marginBottom: '1rem',
                border: '1px solid #bfdbfe'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#1e40af' }}>
                  🏠 Đã nhận phòng!
                </div>
                <div style={{ color: '#1e40af', fontSize: '0.875rem' }}>
                  Bạn đã nhận phòng thành công. Chúc bạn có một kỳ nghỉ tuyệt vời!
                </div>
              </div>
            )}

            {rental.status === 'CHECKED_OUT' && (
              <div style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                marginBottom: '1rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#475569' }}>
                  📋 Đã hoàn tất!
                </div>
                <div style={{ color: '#475569', fontSize: '0.875rem' }}>
                  Kỳ thuê nhà đã hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
                </div>
              </div>
            )}

            {rental.totalPrice && (
              <PriceInfo>
                <PriceTitle>Thông tin giá</PriceTitle>
                <PriceDetails>
                  <span>Tổng tiền:</span>
                  <span>{rental.totalPrice.toLocaleString()} VNĐ</span>
                </PriceDetails>
              </PriceInfo>
            )}

            <ActionButtons>
              <Button 
                className="primary" 
                onClick={() => handleViewHouse(rental.houseId)}
              >
                <Home size={16} />
                Xem chi tiết nhà
              </Button>
              
              {(rental.status === 'PENDING' || rental.status === 'APPROVED' || rental.status === 'SCHEDULED') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Button 
                    className="danger" 
                    onClick={() => handleCancelRental(rental)}
                  >
                    Hủy yêu cầu
                  </Button>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#6b7280', 
                    fontStyle: 'italic',
                    textAlign: 'center'
                  }}>
                    ⚠️ Chỉ có thể hủy trước 24 giờ so với thời gian bắt đầu thuê
                  </div>
                </div>
              )}
                          </ActionButtons>
            </RentalCard>
          ))
      )}

      <CancelRentalModal
        isOpen={showCancelModal}
        onClose={handleCloseCancelModal}
        onConfirm={confirmCancelRental}
        rental={rentalToCancel}
        loading={cancelLoading}
      />
    </Container>
  );
};

export default MyRentalsPage; 