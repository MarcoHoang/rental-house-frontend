import React from 'react';
import styled from 'styled-components';
import { Calendar, Users, MessageSquare, MapPin, DollarSign, Clock } from 'lucide-react';

const Container = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
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

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  border-left: 3px solid #3b82f6;
`;

const DetailIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #dbeafe;
  border-radius: 50%;
  color: #1e40af;
  flex-shrink: 0;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-weight: 500;
  color: #1f2937;
`;

const MessageSection = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const MessageTitle = styled.div`
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MessageContent = styled.div`
  color: #92400e;
  line-height: 1.5;
`;

const RejectReason = styled.div`
  background: #fee2e2;
  border: 1px solid #ef4444;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const RejectTitle = styled.div`
  font-weight: 600;
  color: #991b1b;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RejectContent = styled.div`
  color: #991b1b;
  line-height: 1.5;
`;

const RentalRequestDetail = ({ request }) => {
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

  if (!request) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Không tìm thấy thông tin yêu cầu</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Chi tiết yêu cầu thuê nhà</Title>
        <StatusBadge status={request.status}>
          {getStatusLabel(request.status)}
        </StatusBadge>
      </Header>

      <Section>
        <SectionTitle>
          <Users size={20} />
          Thông tin người thuê
        </SectionTitle>
        <Grid>
          <DetailItem>
            <DetailIcon>
              <Users size={20} />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Người thuê</DetailLabel>
              <DetailValue>{request.renterName}</DetailValue>
            </DetailContent>
          </DetailItem>
          <DetailItem>
            <DetailIcon>
              <Users size={20} />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Số lượng khách</DetailLabel>
              <DetailValue>{request.guestCount} người</DetailValue>
            </DetailContent>
          </DetailItem>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>
          <MapPin size={20} />
          Thông tin nhà
        </SectionTitle>
        <Grid>
          <DetailItem>
            <DetailIcon>
              <MapPin size={20} />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Tên nhà</DetailLabel>
              <DetailValue>{request.house?.title || 'Nhà cho thuê'}</DetailValue>
            </DetailContent>
          </DetailItem>
          <DetailItem>
            <DetailIcon>
              <MapPin size={20} />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Địa chỉ</DetailLabel>
              <DetailValue>{request.house?.address || 'Chưa có thông tin'}</DetailValue>
            </DetailContent>
          </DetailItem>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>
          <Calendar size={20} />
          Thông tin đặt thuê
        </SectionTitle>
        <Grid>
          <DetailItem>
            <DetailIcon>
              <Calendar size={20} />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Thời gian bắt đầu</DetailLabel>
              <DetailValue>{formatDate(request.startDate)}</DetailValue>
            </DetailContent>
          </DetailItem>
          <DetailItem>
            <DetailIcon>
              <Calendar size={20} />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Thời gian kết thúc</DetailLabel>
              <DetailValue>{formatDate(request.endDate)}</DetailValue>
            </DetailContent>
          </DetailItem>
          <DetailItem>
            <DetailIcon>
              <Clock size={20} />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Thời gian tạo yêu cầu</DetailLabel>
              <DetailValue>{formatDate(request.createdAt)}</DetailValue>
            </DetailContent>
          </DetailItem>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>
          <DollarSign size={20} />
          Thông tin thanh toán
        </SectionTitle>
        <Grid>
          <DetailItem>
            <DetailIcon>
              <DollarSign size={20} />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Tổng tiền</DetailLabel>
              <DetailValue>{formatPrice(request.totalPrice)} VNĐ</DetailValue>
            </DetailContent>
          </DetailItem>
        </Grid>
      </Section>

      {request.messageToHost && (
        <Section>
          <MessageSection>
            <MessageTitle>
              <MessageSquare size={20} />
              Lời nhắn từ người thuê
            </MessageTitle>
            <MessageContent>{request.messageToHost}</MessageContent>
          </MessageSection>
        </Section>
      )}

      {request.rejectReason && (
        <Section>
          <RejectReason>
            <RejectTitle>
              <MessageSquare size={20} />
              Lý do từ chối
            </RejectTitle>
            <RejectContent>{request.rejectReason}</RejectContent>
          </RejectReason>
        </Section>
      )}

      {request.approvedAt && (
        <Section>
          <SectionTitle>
            <Clock size={20} />
            Thông tin duyệt
          </SectionTitle>
          <Grid>
            <DetailItem>
              <DetailIcon>
                <Clock size={20} />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>Thời gian duyệt</DetailLabel>
                <DetailValue>{formatDate(request.approvedAt)}</DetailValue>
              </DetailContent>
            </DetailItem>
          </Grid>
        </Section>
      )}

      {request.rejectedAt && (
        <Section>
          <SectionTitle>
            <Clock size={20} />
            Thông tin từ chối
          </SectionTitle>
          <Grid>
            <DetailItem>
              <DetailIcon>
                <Clock size={20} />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>Thời gian từ chối</DetailLabel>
                <DetailValue>{formatDate(request.rejectedAt)}</DetailValue>
              </DetailContent>
            </DetailItem>
          </Grid>
        </Section>
      )}
    </Container>
  );
};

export default RentalRequestDetail;
