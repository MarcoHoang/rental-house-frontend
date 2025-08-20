import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../common/Toast';
import rentalApi from '../../api/rentalApi';
import hostApi from '../../api/hostApi';
import RejectRequestModal from './RejectRequestModal';
import RequestDetailModal from './RequestDetailModal';
import { Clock, CheckCircle, XCircle, Eye, Calendar, Users, MessageSquare } from 'lucide-react';

const Container = styled.div`
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color || '#3b82f6'};
`;

const StatTitle = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
`;

const RequestsContainer = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const RequestCard = styled.div`
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9fafb;
  }
`;

const RequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const RequestInfo = styled.div`
  flex: 1;
`;

const RequestTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const RequestMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => {
    switch (props.status) {
      case 'PENDING': return '#fef3c7';
      case 'APPROVED': return '#d1fae5';
      case 'REJECTED': return '#fee2e2';
      case 'SCHEDULED': return '#dbeafe';
      case 'CHECKED_IN': return '#e0e7ff';
      case 'CHECKED_OUT': return '#f3f4f6';
      case 'CANCELED': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'PENDING': return '#92400e';
      case 'APPROVED': return '#065f46';
      case 'REJECTED': return '#991b1b';
      case 'SCHEDULED': return '#1e40af';
      case 'CHECKED_IN': return '#3730a3';
      case 'CHECKED_OUT': return '#374151';
      case 'CANCELED': return '#374151';
      default: return '#374151';
    }
  }};
`;

const RequestDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: #374151;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &.primary {
    background: #10b981;
    color: white;

    &:hover {
      background: #059669;
    }

    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  }

  &.danger {
    background: #ef4444;
    color: white;

    &:hover {
      background: #dc2626;
    }

    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background: #6b7280;
    color: white;

    &:hover {
      background: #4b5563;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const HostRentalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    total: 0,
    approved: 0,
    rejected: 0,
  });
  const [processingRequest, setProcessingRequest] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState(null);
  const { user } = useAuthContext();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (user?.id) {
      fetchRequests();
    }
  }, [user?.id]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      // Debug: Log user information
      console.log('HostRentalRequests - User info:', {
        userId: user?.id,
        userEmail: user?.email,
        userRole: user?.roleName,
        userFullName: user?.fullName
      });
      
      // Lấy tất cả yêu cầu của host (mọi trạng thái)
      console.log('HostRentalRequests - Calling API with user ID:', user.id);
      const response = await rentalApi.getHostAllRequests(user.id);
      
      // Debug: Log raw response
      console.log('HostRentalRequests - Raw API response:', response);
      
      // Chuẩn hóa dữ liệu trả về để tránh render object {code, message, data}
      const normalize = (value) => {
        if (value && typeof value === 'object') {
          if ('data' in value && ('code' in value || 'message' in value)) {
            return value.data;
          }
        }
        return value;
      };

      const requestsData = normalize(response?.data) || [];
      console.log('HostRentalRequests - Normalized data:', requestsData);
      console.log('HostRentalRequests - Data type:', typeof requestsData);
      console.log('HostRentalRequests - Is array:', Array.isArray(requestsData));
      console.log('HostRentalRequests - Requests length:', requestsData.length);
      
      if (requestsData.length === 0) {
        console.log('HostRentalRequests - No rental requests found for user ID:', user.id);
      } else {
        console.log('HostRentalRequests - Found rental requests:', requestsData);
      }
      
      setRequests(requestsData);
      
      // Tính toán stats
      const pendingCount = requestsData.filter(r => r.status === 'PENDING').length || 0;
      const approvedCount = requestsData.filter(r => r.status === 'APPROVED' || r.status === 'SCHEDULED' || r.status === 'CHECKED_IN' || r.status === 'CHECKED_OUT').length || 0;
      const rejectedCount = requestsData.filter(r => r.status === 'REJECTED' || r.status === 'CANCELED').length || 0;
      setStats({
        pending: pendingCount,
        total: requestsData.length || 0,
        approved: approvedCount,
        rejected: rejectedCount,
      });
    } catch (error) {
      console.error('Error fetching requests:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      showError('Lỗi', 'Không thể tải danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setProcessingRequest(requestId);
      await rentalApi.approveRequest(requestId);
      showSuccess('Thành công', 'Đã chấp nhận yêu cầu thuê nhà');
      fetchRequests(); // Refresh danh sách
    } catch (error) {
      console.error('Error approving request:', error);
      showError('Lỗi', 'Không thể chấp nhận yêu cầu');
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleReject = async (requestId, reason) => {
    try {
      setProcessingRequest(requestId);
      await rentalApi.rejectRequest(requestId, reason);
      showSuccess('Thành công', 'Đã từ chối yêu cầu thuê nhà');
      fetchRequests(); // Refresh danh sách
    } catch (error) {
      console.error('Error rejecting request:', error);
      showError('Lỗi', 'Không thể từ chối yêu cầu');
    } finally {
      setProcessingRequest(null);
    }
  };

  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setSelectedRequest(null);
  };

  const openDetailModal = (request) => {
    setSelectedRequestForDetail(request);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedRequestForDetail(null);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'Chờ duyệt';
      case 'APPROVED': return 'Đã chấp nhận';
      case 'REJECTED': return 'Đã từ chối';
      case 'SCHEDULED': return 'Đã lên lịch';
      case 'CHECKED_IN': return 'Đã nhận phòng';
      case 'CHECKED_OUT': return 'Đã trả phòng';
      case 'CANCELED': return 'Đã hủy';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <LoadingSpinner />
          <p>Đang tải...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Yêu cầu thuê nhà</Title>
      </Header>

      <StatsContainer>
        <StatCard color="#f59e0b">
          <StatTitle>Yêu cầu chờ duyệt</StatTitle>
          <StatValue>{stats.pending}</StatValue>
        </StatCard>
        <StatCard color="#3b82f6">
          <StatTitle>Tổng yêu cầu</StatTitle>
          <StatValue>{stats.total}</StatValue>
        </StatCard>
        <StatCard color="#10b981">
          <StatTitle>Đã chấp nhận/Hoàn tất</StatTitle>
          <StatValue>{stats.approved}</StatValue>
        </StatCard>
        <StatCard color="#ef4444">
          <StatTitle>Đã từ chối/Hủy</StatTitle>
          <StatValue>{stats.rejected}</StatValue>
        </StatCard>
      </StatsContainer>

      <RequestsContainer>
        {requests.length === 0 ? (
          <EmptyState>
            <Clock size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>Chưa có yêu cầu thuê nhà nào</h3>
            <p>Khi có người gửi yêu cầu thuê nhà của bạn, chúng sẽ xuất hiện ở đây.</p>
          </EmptyState>
        ) : (
          requests.map((request) => (
            <RequestCard key={request.id}>
              <RequestHeader>
                <RequestInfo>
                  <RequestTitle>{request.house?.title || 'Nhà cho thuê'}</RequestTitle>
                  <RequestMeta>
                    <MetaItem>
                      <Calendar size={14} />
                      {formatDate(request.startDate)} - {formatDate(request.endDate)}
                    </MetaItem>
                    <MetaItem>
                      <Users size={14} />
                      {request.guestCount} khách
                    </MetaItem>
                    <MetaItem>
                      <MessageSquare size={14} />
                      {request.renterName}
                    </MetaItem>
                  </RequestMeta>
                </RequestInfo>
                <StatusBadge status={request.status}>
                  {getStatusLabel(request.status)}
                </StatusBadge>
              </RequestHeader>

              <RequestDetails>
                <DetailItem>
                  <DetailLabel>Người thuê:</DetailLabel>
                  <span>{request.renterName}</span>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Thời gian:</DetailLabel>
                  <span>{formatDate(request.startDate)} - {formatDate(request.endDate)}</span>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Số khách:</DetailLabel>
                  <span>{request.guestCount} người</span>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Tổng tiền:</DetailLabel>
                  <span>{formatPrice(request.totalPrice)} VNĐ</span>
                </DetailItem>
                {request.messageToHost && (
                  <DetailItem style={{ gridColumn: '1 / -1' }}>
                    <DetailLabel>Lời nhắn:</DetailLabel>
                    <span>{request.messageToHost}</span>
                  </DetailItem>
                )}
              </RequestDetails>

              <ActionButtons>
                <Button
                  className="secondary"
                  onClick={() => openDetailModal(request)}
                >
                  <Eye size={16} />
                  Xem chi tiết
                </Button>
                {request.status === 'PENDING' && (
                  <>
                    <Button
                      className="primary"
                      onClick={() => handleApprove(request.id)}
                      disabled={processingRequest === request.id}
                    >
                      {processingRequest === request.id ? (
                        <LoadingSpinner />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                      Chấp nhận
                    </Button>
                    <Button
                      className="danger"
                      onClick={() => openRejectModal(request)}
                      disabled={processingRequest === request.id}
                    >
                      {processingRequest === request.id ? (
                        <LoadingSpinner />
                      ) : (
                        <XCircle size={16} />
                      )}
                      Từ chối
                    </Button>
                  </>
                )}
              </ActionButtons>


            </RequestCard>
          ))
        )}
      </RequestsContainer>

      <RejectRequestModal
        isOpen={rejectModalOpen}
        onClose={closeRejectModal}
        onReject={handleReject}
        requestInfo={selectedRequest}
      />

      <RequestDetailModal
        isOpen={detailModalOpen}
        onClose={closeDetailModal}
        request={selectedRequestForDetail}
      />
    </Container>
  );
};

export default HostRentalRequests;
