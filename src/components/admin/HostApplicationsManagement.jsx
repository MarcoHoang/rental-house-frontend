import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ChevronLeftIcon, // Thêm icon cho pagination
  ChevronRightIcon, // Thêm icon cho pagination
} from "@heroicons/react/24/outline";
import styled from "styled-components";
import { hostApplicationsApi, usersApi } from "../../api/adminApi"; // Tận dụng cả usersApi
import ConfirmDialog from "../common/ConfirmDialog";
import { useToast } from "../common/Toast";

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
  border-left: 4px solid ${(props) => props.color};
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.color};
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
`;
const PaginationControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;
const PageButton = styled.button`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
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
  const [pagination, setPagination] = useState({ number: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedApp, setSelectedApp] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view', 'reject'
  const [rejectReason, setRejectReason] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const { showSuccess, showError } = useToast();
  const [confirm, setConfirm] = useState({ isOpen: false });

  // --- DATA FETCHING ---
  const fetchApplications = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setError(null);
      // Sửa lại lời gọi API để lấy các đơn đang chờ và có phân trang
      const response = await hostApplicationsApi.getPendingRequests({
        page,
        size: 10,
      });
      setApplications(response.content || []);
      setPagination({
        number: response.number || 0,
        totalPages: response.totalPages || 1,
      });
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Không thể tải danh sách đơn đăng ký.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications(0);
  }, [fetchApplications]);

  // --- HANDLERS ---
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchApplications(newPage);
    }
  };

  const handleApprove = (app) => {
    setConfirm({
      isOpen: true,
      title: "Xác nhận duyệt đơn",
      message: `Bạn có chắc chắn muốn duyệt đơn của "${app.username}"? Tài khoản này sẽ được cấp quyền Chủ nhà.`,
      onConfirm: () => performApprove(app.id),
    });
  };

  const performApprove = async (appId) => {
    setProcessingId(appId);
    try {
      await hostApplicationsApi.approve(appId);
      showSuccess("Thành công", "Đã duyệt đơn đăng ký.");
      fetchApplications(pagination.number); // Tải lại trang hiện tại
    } catch (err) {
      showError("Thất bại", "Có lỗi xảy ra khi duyệt đơn.");
    } finally {
      setProcessingId(null);
      setConfirm({ isOpen: false });
    }
  };

  const handleReject = (app) => {
    setSelectedApp(app);
    setModalType("reject");
  };

  const performReject = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      showError("Lỗi", "Vui lòng nhập lý do từ chối.");
      return;
    }

    setProcessingId(selectedApp.id);
    try {
      await hostApplicationsApi.reject(selectedApp.id, rejectReason);
      showSuccess("Thành công", "Đã từ chối đơn đăng ký.");
      setModalType(null);
      fetchApplications(pagination.number);
    } catch (err) {
      showError("Thất bại", "Có lỗi xảy ra khi từ chối đơn.");
    } finally {
      setProcessingId(null);
    }
  };

  // --- RENDER ---
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <Title>Quản lý đơn đăng ký làm chủ nhà</Title>

      <ApplicationsTable>
        <TableHeader>
          <div>User ID</div>
          <div>Email</div>
          <div>Ngày gửi</div>
          <div>Thao tác</div>
        </TableHeader>

        {applications.map((app) => (
          <TableRow key={app.id}>
            <div>#{app.userId}</div>
            <div>{app.userEmail}</div>
            <div>{new Date(app.requestDate).toLocaleDateString("vi-VN")}</div>
            <div>
              {/* Nút Xem chi tiết User (tái sử dụng trang cũ) */}
              {/* <Link to={`/admin/user-management/${app.userId}`}>
                <ActionButton className="view"><EyeIcon.../></ActionButton>
              </Link> */}

              <ActionButton
                className="approve"
                onClick={() => handleApprove(app)}
                disabled={processingId === app.id}
              >
                Duyệt
              </ActionButton>
              <ActionButton
                className="reject"
                onClick={() => handleReject(app)}
                disabled={processingId === app.id}
              >
                Từ chối
              </ActionButton>
            </div>
          </TableRow>
        ))}
      </ApplicationsTable>

      <PaginationContainer>
        <span>
          Trang <strong>{pagination.number + 1}</strong> trên{" "}
          <strong>{pagination.totalPages}</strong>
        </span>
        <PaginationControls>
          <PageButton
            onClick={() => handlePageChange(pagination.number - 1)}
            disabled={pagination.number === 0}
          >
            <ChevronLeftIcon width={20} />
          </PageButton>
          <PageButton
            onClick={() => handlePageChange(pagination.number + 1)}
            disabled={pagination.number + 1 >= pagination.totalPages}
          >
            <ChevronRightIcon width={20} />
          </PageButton>
        </PaginationControls>
      </PaginationContainer>

      <ConfirmDialog
        {...confirm}
        onClose={() => setConfirm({ isOpen: false })}
      />

      {modalType === "reject" && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Từ chối đơn của "{selectedApp.username}"</ModalTitle>
              <CloseButton onClick={() => setModalType(null)}>
                &times;
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <form onSubmit={performReject}>
                <label>Lý do từ chối:</label>
                <TextArea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                />
                <ActionButton
                  type="submit"
                  className="reject"
                  disabled={processingId === selectedApp.id}
                >
                  {processingId === selectedApp.id
                    ? "Đang xử lý..."
                    : "Xác nhận từ chối"}
                </ActionButton>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default HostApplicationsManagement;
