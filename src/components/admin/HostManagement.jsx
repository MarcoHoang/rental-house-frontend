// src/components/admin/HostManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  DocumentTextIcon,
  EyeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import styled from 'styled-components';
import { hostApplicationsApi } from '../../api/adminApi';

const Container = styled.div`
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
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

const HostsTable = styled.div`
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
  
  &.approved {
    background-color: #d1fae5;
    color: #065f46;
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const HostManagement = () => {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHost, setSelectedHost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchHosts();
  }, []);

  const fetchHosts = async () => {
    try {
      setLoading(true);
      const data = await hostApplicationsApi.getAllHosts();
      setHosts(data);
    } catch (error) {
      console.error('Error fetching hosts:', error);
    } finally {
      setLoading(false);
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

  const handleViewHost = (host) => {
    setSelectedHost(host);
    setShowModal(true);
  };

  const stats = {
    total: hosts.length,
    approved: hosts.filter(host => host.approved).length,
    active: hosts.filter(host => host.approved && host.active !== false).length
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
        <Title>Quản lý chủ nhà</Title>
      </Header>

      <StatsGrid>
        <StatCard color="#3b82f6">
          <StatNumber color="#3b82f6">{stats.total}</StatNumber>
          <StatLabel>Tổng số chủ nhà</StatLabel>
        </StatCard>
        <StatCard color="#10b981">
          <StatNumber color="#10b981">{stats.approved}</StatNumber>
          <StatLabel>Đã được duyệt</StatLabel>
        </StatCard>
        <StatCard color="#059669">
          <StatNumber color="#059669">{stats.active}</StatNumber>
          <StatLabel>Đang hoạt động</StatLabel>
        </StatCard>
      </StatsGrid>

      <HostsTable>
        <TableHeader>
          <div>ID</div>
          <div>Thông tin chủ nhà</div>
          <div>Số CCCD</div>
          <div>Số điện thoại</div>
          <div>Ngày duyệt</div>
          <div>Thao tác</div>
        </TableHeader>

        {hosts.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            Không có chủ nhà nào
          </div>
        ) : (
          hosts.map((host) => (
            <TableRow key={host.id}>
              <div>#{host.id}</div>
              <div>
                <div style={{ fontWeight: '500' }}>{host.fullName || host.username}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {host.email}
                </div>
              </div>
              <div>{host.nationalId || 'N/A'}</div>
              <div>{host.phone || 'N/A'}</div>
              <div>{formatDate(host.approvedDate)}</div>
              <div>
                <ActionButton
                  className="view"
                  onClick={() => handleViewHost(host)}
                >
                  <EyeIcon className="w-4 h-4 mr-1" />
                  Xem
                </ActionButton>
              </div>
            </TableRow>
          ))
        )}
      </HostsTable>

      {showModal && selectedHost && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Chi tiết chủ nhà</ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <DetailRow>
                <DetailLabel>ID:</DetailLabel>
                <DetailValue>#{selectedHost.id}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Họ tên:</DetailLabel>
                <DetailValue>{selectedHost.fullName || selectedHost.username}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Username:</DetailLabel>
                <DetailValue>{selectedHost.username}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Email:</DetailLabel>
                <DetailValue>{selectedHost.email}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Số điện thoại:</DetailLabel>
                <DetailValue>{selectedHost.phone || 'N/A'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Avatar:</DetailLabel>
                <DetailValue>
                  {selectedHost.avatar ? (
                    <img 
                      src={selectedHost.avatar} 
                      alt="Avatar" 
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    'Không có'
                  )}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Số CCCD/CMT:</DetailLabel>
                <DetailValue>{selectedHost.nationalId || 'N/A'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Giấy tờ sở hữu:</DetailLabel>
                <DetailValue>
                  {selectedHost.proofOfOwnershipUrl ? (
                    <a 
                      href={selectedHost.proofOfOwnershipUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#3b82f6', textDecoration: 'underline' }}
                    >
                      Xem giấy tờ
                    </a>
                  ) : (
                    'N/A'
                  )}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Địa chỉ:</DetailLabel>
                <DetailValue>{selectedHost.address || 'N/A'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Ngày duyệt:</DetailLabel>
                <DetailValue>{formatDate(selectedHost.approvedDate)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Trạng thái:</DetailLabel>
                <DetailValue>
                  <StatusBadge className="approved">
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    Đã duyệt
                  </StatusBadge>
                </DetailValue>
              </DetailRow>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default HostManagement;

