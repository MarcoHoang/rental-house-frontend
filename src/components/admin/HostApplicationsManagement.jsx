import React, { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import styled from 'styled-components';
import { hostApplicationsApi } from '../../api/adminApi';
import ConfirmDialog from '../common/ConfirmDialog';

const Container = styled.div`
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color};
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.color};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const ApplicationsTable = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;
  
  &:hover {
    background-color: #f9fafb;
  }
  
  &:last-child {
    border-bottom: none;
  }
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

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  margin-right: 0.5rem;
  
  &.view {
    background-color: #3b82f6;
    color: white;
    
    &:hover {
      background-color: #2563eb;
    }
  }
  
  &.approve {
    background-color: #10b981;
    color: white;
    
    &:hover {
      background-color: #059669;
    }
  }
  
  &.reject {
    background-color: #ef4444;
    color: white;
    
    &:hover {
      background-color: #dc2626;
    }
  }
  
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #374151;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #374151;
`;

const DetailValue = styled.span`
  color: #6b7280;
`;

const RejectForm = styled.form`
  margin-top: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const HostApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await hostApplicationsApi.getAll();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return {
          label: 'Đang chờ duyệt',
          className: 'pending',
          color: '#f59e0b'
        };
      case 'APPROVED':
        return {
          label: 'Đã được duyệt',
          className: 'approved',
          color: '#10b981'
        };
      case 'REJECTED':
        return {
          label: 'Đã bị từ chối',
          className: 'rejected',
          color: '#ef4444'
        };
      default:
        return {
          label: 'Không xác định',
          className: 'pending',
          color: '#6b7280'
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
    setShowRejectForm(false);
    setRejectReason('');
  };

  const handleApprove = async (application) => {
    if (!window.confirm(
      `Bạn có chắc chắn muốn duyệt đơn đăng ký này?\n\n` +
      `Khi duyệt:\n` +
      `• User "${application.username}" sẽ được chuyển từ role USER sang HOST\n` +
      `• User này sẽ được chuyển ra khỏi danh sách quản lý User thường\n` +
      `• User này sẽ có quyền đăng tin cho thuê nhà`
    )) {
      return;
    }

    try {
      setProcessing(true);
      await hostApplicationsApi.approve(application.id);
      
      alert(
        `✅ Đã duyệt đơn đăng ký thành công!\n\n` +
        `User "${application.username}" đã được:\n` +
        `• Chuyển từ role USER sang HOST\n` +
        `• Có quyền đăng tin cho thuê nhà\n` +
        `• Chuyển ra khỏi danh sách quản lý User thường`
      );
      
      fetchApplications();
      setShowModal(false);
    } catch (error) {
      console.error('Error approving application:', error);
      alert('❌ Có lỗi xảy ra khi duyệt đơn đăng ký: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      setProcessing(true);
      await hostApplicationsApi.reject(selectedApplication.id, rejectReason);
      alert('Đã từ chối đơn đăng ký thành công!');
      fetchApplications();
      setShowModal(false);
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Có lỗi xảy ra khi từ chối đơn đăng ký');
    } finally {
      setProcessing(false);
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'PENDING').length,
    approved: applications.filter(app => app.status === 'APPROVED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Đang tải...</span>
        </LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Quản lý đơn đăng ký làm chủ nhà</Title>
      </Header>

      <StatsGrid>
        <StatCard color="#3b82f6">
          <StatNumber color="#3b82f6">{stats.total}</StatNumber>
          <StatLabel>Tổng số đơn</StatLabel>
        </StatCard>
        <StatCard color="#f59e0b">
          <StatNumber color="#f59e0b">{stats.pending}</StatNumber>
          <StatLabel>Đang chờ duyệt</StatLabel>
        </StatCard>
        <StatCard color="#10b981">
          <StatNumber color="#10b981">{stats.approved}</StatNumber>
          <StatLabel>Đã duyệt</StatLabel>
        </StatCard>
        <StatCard color="#ef4444">
          <StatNumber color="#ef4444">{stats.rejected}</StatNumber>
          <StatLabel>Đã từ chối</StatLabel>
        </StatCard>
      </StatsGrid>

      <ApplicationsTable>
        <TableHeader>
          <div>ID</div>
          <div>Thông tin người dùng</div>
          <div>Trạng thái</div>
          <div>Ngày gửi</div>
          <div>Ngày xử lý</div>
          <div>Thao tác</div>
        </TableHeader>

        {applications.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            Không có đơn đăng ký nào
          </div>
        ) : (
          applications.map((application) => {
            const statusConfig = getStatusConfig(application.status);
            return (
              <TableRow key={application.id}>
                <div>#{application.id}</div>
                <div>
                  <div style={{ fontWeight: '500' }}>{application.username}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {application.userEmail}
                  </div>
                </div>
                <div>
                  <StatusBadge className={statusConfig.className}>
                    {statusConfig.label}
                  </StatusBadge>
                </div>
                <div>{formatDate(application.requestDate)}</div>
                <div>{formatDate(application.processedDate)}</div>
                <div>
                  <ActionButton
                    className="view"
                    onClick={() => handleViewApplication(application)}
                  >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    Xem
                  </ActionButton>
                  
                  {application.status === 'PENDING' && (
                    <>
                      <ActionButton
                        className="approve"
                        onClick={() => handleApprove(application)}
                        disabled={processing}
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        Duyệt
                      </ActionButton>
                      <ActionButton
                        className="reject"
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowModal(true);
                          setShowRejectForm(true);
                        }}
                        disabled={processing}
                      >
                        <XCircleIcon className="w-4 h-4 mr-1" />
                        Từ chối
                      </ActionButton>
                    </>
                  )}
                </div>
              </TableRow>
            );
          })
        )}
      </ApplicationsTable>

      {showModal && selectedApplication && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {showRejectForm ? 'Từ chối đơn đăng ký' : 'Chi tiết đơn đăng ký'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <ModalBody>
              {!showRejectForm ? (
                <>
                  <DetailRow>
                    <DetailLabel>ID đơn:</DetailLabel>
                    <DetailValue>#{selectedApplication.id}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>User ID:</DetailLabel>
                    <DetailValue>#{selectedApplication.userId}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Tên người dùng:</DetailLabel>
                    <DetailValue>{selectedApplication.username}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Email:</DetailLabel>
                    <DetailValue>{selectedApplication.userEmail}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Trạng thái:</DetailLabel>
                    <DetailValue>
                      <StatusBadge className={getStatusConfig(selectedApplication.status).className}>
                        {getStatusConfig(selectedApplication.status).label}
                      </StatusBadge>
                    </DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Ngày gửi:</DetailLabel>
                    <DetailValue>{formatDate(selectedApplication.requestDate)}</DetailValue>
                  </DetailRow>
                  {selectedApplication.processedDate && (
                    <DetailRow>
                      <DetailLabel>Ngày xử lý:</DetailLabel>
                      <DetailValue>{formatDate(selectedApplication.processedDate)}</DetailValue>
                    </DetailRow>
                  )}
                  {selectedApplication.reason && (
                    <DetailRow>
                      <DetailLabel>Lý do:</DetailLabel>
                      <DetailValue style={{ whiteSpace: 'pre-wrap', maxWidth: '300px' }}>
                        {selectedApplication.reason}
                      </DetailValue>
                    </DetailRow>
                  )}
                  
                  {/* Hiển thị thông tin host nếu có */}
                  {selectedApplication.nationalId && (
                    <DetailRow>
                      <DetailLabel>Số CCCD/CMT:</DetailLabel>
                      <DetailValue>{selectedApplication.nationalId}</DetailValue>
                    </DetailRow>
                  )}
                  {selectedApplication.address && (
                    <DetailRow>
                      <DetailLabel>Địa chỉ:</DetailLabel>
                      <DetailValue>{selectedApplication.address}</DetailValue>
                    </DetailRow>
                  )}
                  {selectedApplication.phone && (
                    <DetailRow>
                      <DetailLabel>Số điện thoại:</DetailLabel>
                      <DetailValue>{selectedApplication.phone}</DetailValue>
                    </DetailRow>
                  )}
                  {selectedApplication.proofOfOwnershipUrl && (
                    <DetailRow>
                      <DetailLabel>Giấy tờ sở hữu:</DetailLabel>
                      <DetailValue>
                        <a 
                          href={selectedApplication.proofOfOwnershipUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#3b82f6', textDecoration: 'underline' }}
                        >
                          Xem giấy tờ
                        </a>
                      </DetailValue>
                    </DetailRow>
                  )}
                  
                  {selectedApplication.status === 'PENDING' && (
                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                      <ActionButton
                        className="approve"
                        onClick={() => handleApprove(selectedApplication)}
                        disabled={processing}
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        Duyệt
                      </ActionButton>
                      <ActionButton
                        className="reject"
                        onClick={() => setShowRejectForm(true)}
                        disabled={processing}
                      >
                        <XCircleIcon className="w-4 h-4 mr-1" />
                        Từ chối
                      </ActionButton>
                    </div>
                  )}
                </>
              ) : (
                <RejectForm onSubmit={handleReject}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Lý do từ chối <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <TextArea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Nhập lý do từ chối đơn đăng ký..."
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <ActionButton
                      type="button"
                      onClick={() => setShowRejectForm(false)}
                      disabled={processing}
                      style={{ backgroundColor: '#6b7280' }}
                    >
                      Hủy
                    </ActionButton>
                    <ActionButton
                      type="submit"
                      className="reject"
                      disabled={processing}
                    >
                      {processing ? 'Đang xử lý...' : 'Từ chối'}
                    </ActionButton>
                  </div>
                </RejectForm>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default HostApplicationsManagement;
