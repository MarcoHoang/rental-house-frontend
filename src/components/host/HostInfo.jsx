import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import styled from 'styled-components';
import hostApi from '../../api/hostApi';
import { getUserFromStorage } from '../../utils/localStorage';

const Container = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  margin-bottom: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #d1fae5;
  color: #065f46;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #e5e7eb;
  color: #6b7280;
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f0f9ff;
  border-radius: 0.5rem;
  border: 1px solid #bae6fd;
`;

const Avatar = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0ea5e9;
`;

const AvatarInfo = styled.div`
  flex: 1;
`;

const AvatarName = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #0c4a6e;
  margin-bottom: 0.25rem;
`;

const AvatarEmail = styled.div`
  font-size: 0.875rem;
  color: #0369a1;
`;

const DocumentSection = styled.div`
  padding: 1rem;
  background-color: #fef3c7;
  border-radius: 0.5rem;
  border: 1px solid #f59e0b;
`;

const DocumentTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DocumentLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f59e0b;
  color: white;
  text-decoration: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #d97706;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
  text-align: center;
`;

const HostInfo = () => {
  const [hostInfo, setHostInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHostInfo();
  }, []);

  const fetchHostInfo = async () => {
    try {
      setLoading(true);
      const user = getUserFromStorage();
      if (!user || !user.id) {
        setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }

      const info = await hostApi.getHostInfo(user.id);
      setHostInfo(info);
    } catch (error) {
      console.error('Error fetching host info:', error);
      if (error.response?.status === 404) {
        setError('Bạn chưa được approve làm chủ nhà.');
      } else {
        setError('Không thể tải thông tin chủ nhà. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Đang tải thông tin chủ nhà...</span>
        </LoadingSpinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>
          <p>{String(error)}</p>
        </ErrorMessage>
      </Container>
    );
  }

  if (!hostInfo) {
    return (
      <Container>
        <ErrorMessage>
          <p>Không tìm thấy thông tin chủ nhà.</p>
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <UserIcon className="w-6 h-6" />
          Thông tin chủ nhà
        </Title>
        <StatusBadge>
          <CheckCircleIcon className="w-4 h-4 mr-1" />
          Đã được duyệt
        </StatusBadge>
      </Header>

      <AvatarSection>
        <Avatar 
          src={hostInfo.avatar} 
          alt={hostInfo.fullName || hostInfo.username || "Host Avatar"}
          name={hostInfo.fullName || hostInfo.username}
          size="80px"
        />
        <AvatarInfo>
          <AvatarName>{hostInfo.fullName || hostInfo.username}</AvatarName>
          <AvatarEmail>{hostInfo.email}</AvatarEmail>
        </AvatarInfo>
      </AvatarSection>

      <InfoGrid>
        <InfoSection>
          <InfoItem>
            <InfoIcon>
              <UserIcon className="w-5 h-5" />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Username</InfoLabel>
              <InfoValue>{hostInfo.username}</InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <EnvelopeIcon className="w-5 h-5" />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{hostInfo.email}</InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <PhoneIcon className="w-5 h-5" />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Số điện thoại</InfoLabel>
              <InfoValue>{hostInfo.phone || 'Chưa cập nhật'}</InfoValue>
            </InfoContent>
          </InfoItem>
        </InfoSection>

        <InfoSection>
          <InfoItem>
            <InfoIcon>
              <DocumentTextIcon className="w-5 h-5" />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Số CCCD/CMT</InfoLabel>
              <InfoValue>{hostInfo.nationalId || 'Chưa cập nhật'}</InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <MapPinIcon className="w-5 h-5" />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Địa chỉ</InfoLabel>
              <InfoValue>{hostInfo.address || 'Chưa cập nhật'}</InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <CalendarIcon className="w-5 h-5" />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Ngày được duyệt</InfoLabel>
              <InfoValue>{formatDate(hostInfo.approvedDate)}</InfoValue>
            </InfoContent>
          </InfoItem>
        </InfoSection>
      </InfoGrid>

      {hostInfo.proofOfOwnershipUrl && (
        <DocumentSection>
          <DocumentTitle>
            <DocumentTextIcon className="w-5 h-5" />
            Giấy tờ chứng minh quyền sở hữu
          </DocumentTitle>
          <DocumentLink 
            href={hostInfo.proofOfOwnershipUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <DocumentTextIcon className="w-4 h-4" />
            Xem giấy tờ
          </DocumentLink>
        </DocumentSection>
      )}
    </Container>
  );
};

export default HostInfo;

