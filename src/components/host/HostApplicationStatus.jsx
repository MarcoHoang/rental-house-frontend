import React, { useState, useEffect } from 'react';
import { ClockIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import styled from 'styled-components';
import hostApi from '../../api/hostApi';
import { getUserFromStorage } from '../../utils/localStorage';

const StatusContainer = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  margin-bottom: 1rem;
`;

const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatusTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
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
  
  &.pending {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  &.approved {
    background-color: #d1fae5;
    color: #065f46;
  }
  
  &.rejected {
    background-color: #fee2e2;
    color: #991b1b;
  }
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin-right: 0.75rem;
  
  &.pending {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  &.approved {
    background-color: #d1fae5;
    color: #065f46;
  }
  
  &.rejected {
    background-color: #fee2e2;
    color: #991b1b;
  }
`;

const StatusDetails = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const DetailValue = styled.span`
  font-size: 0.875rem;
  color: #111827;
  font-weight: 500;
`;

const ReasonText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.5rem 0 0 0;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  border-left: 4px solid #e5e7eb;
`;

const NoApplication = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const HostApplicationStatus = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const user = getUserFromStorage();
        if (!user || !user.id) {
          setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
          return;
        }

        const application = await hostApi.getMyApplication(user.id);
        setApplication(application);
      } catch (error) {
        console.error('Error fetching application:', error);
        if (error.response?.status === 404) {
          setError('Bạn chưa gửi đơn đăng ký làm chủ nhà.');
        } else {
          setError('Không thể tải thông tin đơn đăng ký. Vui lòng thử lại.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, []);

  const getStatusConfig = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return {
          icon: ClockIcon,
          label: 'Đang chờ duyệt',
          className: 'pending',
          color: '#92400e'
        };
      case 'APPROVED':
        return {
          icon: CheckCircleIcon,
          label: 'Đã được duyệt',
          className: 'approved',
          color: '#065f46'
        };
      case 'REJECTED':
        return {
          icon: XCircleIcon,
          label: 'Đã bị từ chối',
          className: 'rejected',
          color: '#991b1b'
        };
      default:
        return {
          icon: ExclamationTriangleIcon,
          label: 'Không xác định',
          className: 'pending',
          color: '#92400e'
        };
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
      <StatusContainer>
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      </StatusContainer>
    );
  }

  if (error) {
    return (
      <StatusContainer>
        <div className="text-center py-4 text-red-600">
          <ExclamationTriangleIcon className="w-6 h-6 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </StatusContainer>
    );
  }

  if (!application) {
    return (
      <StatusContainer>
        <NoApplication>
          <ClockIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có đơn đăng ký
          </h3>
          <p className="text-gray-600">
            Bạn chưa gửi đơn đăng ký làm chủ nhà. Hãy gửi đơn để bắt đầu!
          </p>
        </NoApplication>
      </StatusContainer>
    );
  }

  const statusConfig = getStatusConfig(application.status);
  const StatusIconComponent = statusConfig.icon;

  return (
    <StatusContainer>
      <StatusHeader>
        <StatusTitle>Trạng thái đơn đăng ký làm chủ nhà</StatusTitle>
        <StatusBadge className={statusConfig.className}>
          {statusConfig.label}
        </StatusBadge>
      </StatusHeader>

      <div className="flex items-center">
        <StatusIcon className={statusConfig.className}>
          <StatusIconComponent className="w-5 h-5" />
        </StatusIcon>
        <div>
          <p className="font-medium text-gray-900">
            Đơn đăng ký #{application.id}
          </p>
          <p className="text-sm text-gray-600">
            {application.userEmail}
          </p>
        </div>
      </div>

      <StatusDetails>
        <DetailRow>
          <DetailLabel>Ngày gửi đơn:</DetailLabel>
          <DetailValue>{formatDate(application.requestDate)}</DetailValue>
        </DetailRow>
        
        {application.processedDate && (
          <DetailRow>
            <DetailLabel>Ngày xử lý:</DetailLabel>
            <DetailValue>{formatDate(application.processedDate)}</DetailValue>
          </DetailRow>
        )}
        
        <DetailRow>
          <DetailLabel>Trạng thái:</DetailLabel>
          <DetailValue>{statusConfig.label}</DetailValue>
        </DetailRow>

        {/* Hiển thị thông tin host nếu có */}
        {application.nationalId && (
          <DetailRow>
            <DetailLabel>Số CCCD/CMT:</DetailLabel>
            <DetailValue>{application.nationalId}</DetailValue>
          </DetailRow>
        )}
        
        {application.address && (
          <DetailRow>
            <DetailLabel>Địa chỉ:</DetailLabel>
            <DetailValue>{application.address}</DetailValue>
          </DetailRow>
        )}
        
        {application.phone && (
          <DetailRow>
            <DetailLabel>Số điện thoại:</DetailLabel>
            <DetailValue>{application.phone}</DetailValue>
          </DetailRow>
        )}
      </StatusDetails>

      {application.reason && (
        <ReasonText>
          <strong>Lý do:</strong> 
          <div style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>
            {application.reason}
          </div>
        </ReasonText>
      )}

      {/* Hiển thị giấy tờ sở hữu nếu có */}
      {application.proofOfOwnershipUrl && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Giấy tờ sở hữu:</strong>
          </p>
          <a 
            href={application.proofOfOwnershipUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            Xem giấy tờ sở hữu
          </a>
        </div>
      )}

      {application.status === 'APPROVED' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            🎉 Chúc mừng! Đơn đăng ký của bạn đã được duyệt. Bây giờ bạn có thể đăng tin cho thuê nhà.
          </p>
        </div>
      )}

      {application.status === 'REJECTED' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            Đơn đăng ký của bạn đã bị từ chối. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết.
          </p>
        </div>
      )}
    </StatusContainer>
  );
};

export default HostApplicationStatus;
