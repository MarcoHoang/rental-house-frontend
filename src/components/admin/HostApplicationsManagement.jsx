import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { hostApplicationsApi } from "../../api/adminApi";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { useToast } from "../common/Toast";
import ConfirmDialog from "../common/ConfirmDialog";
import AdminSearchBar from "./AdminSearchBar";

// --- STYLED COMPONENTS (Đồng bộ 100% với UserManagement) ---

const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 1rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  th {
    background-color: #f7fafc;
    font-weight: 600;
    color: #4a5568;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }
  td {
    font-size: 0.875rem;
  }
  tbody tr:hover {
    background-color: #f7fafc;
  }
  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  &.view {
    color: #2b6cb0;
    background-color: #ebf8ff;
    border-color: #bee3f8;
    &:hover {
      background-color: #bee3f8;
    }
  }
  &.approve {
    color: #2f855a;
    background-color: #c6f6d5;
    border-color: #9ae6b4;
    &:hover {
      background-color: #9ae6b4;
    }
  }
  &.reject {
    color: #c53030;
    background-color: #fed7d7;
    border-color: #feb2b2;
    &:hover {
      background-color: #feb2b2;
    }
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
  font-size: 0.875rem;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  padding: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  &:hover:not(:disabled) {
    background: #e2e8f0;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  .spinner {
    animation: spin 1s linear infinite;
    width: 2rem;
    height: 2rem;
    color: #3182ce;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #c53030;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 0.5rem;
  margin: 1rem;
`;

// --- Styled Components cho Modal (Đã thu gọn) ---
const ModalOverlay = styled.div`
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
  max-width: 500px;
`;
const ModalHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
  }
`;
const ModalBody = styled.div`
  padding: 1.5rem;
`;
const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;
const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
`;

// --- Component Chính ---
const HostApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ number: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Thêm state cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "ALL",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const [processingId, setProcessingId] = useState(null);
  const { showSuccess, showError } = useToast();
  const [confirm, setConfirm] = useState({ isOpen: false });
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    app: null,
    reason: "",
  });

  const fetchApplications = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setError(null);
      const data = await hostApplicationsApi.getPendingRequests({
        page,
        size: 10,
      });
      
      // API trả về trực tiếp data, không có wrapper
      setApplications(data.content || []);
      setPagination({
        number: data.number || 0,
        totalPages: data.totalPages || 1,
      });
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError("Không thể tải danh sách đơn đăng ký.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Local filter applications (giống trang chủ) - KHÔNG gọi API
  useEffect(() => {
    if (!applications.length) return;

    let filtered = applications;

    // Filter theo status
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    // Search theo tên, email, phone (local search)
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        (app.fullName && app.fullName.toLowerCase().includes(term)) ||
        (app.username && app.username.toLowerCase().includes(term)) ||
        (app.userEmail && app.userEmail.toLowerCase().includes(term)) ||
        (app.phone && app.phone.toLowerCase().includes(term)) ||
        (app.address && app.address.toLowerCase().includes(term))
      );
    }

    setSearchResults(filtered);
    setIsSearchMode(searchTerm.trim() || filters.status !== 'ALL');
  }, [applications, searchTerm, filters]);

  // Search applications với API - chỉ khi bấm nút tìm kiếm
  const searchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hostApplicationsApi.searchRequests(
        searchTerm.trim() || undefined,
        filters.status !== 'ALL' ? filters.status : undefined,
        { page: 0, size: 10 }
      );
      setApplications(Array.isArray(data.content) ? data.content : []);
      // Local filter sẽ tự động chạy sau khi setApplications
    } catch (err) {
      console.error('Error searching applications:', err);
      setError('Không thể tìm kiếm đơn đăng ký. Vui lòng thử lại sau.');
      showError('Lỗi tìm kiếm', 'Không thể tìm kiếm đơn đăng ký');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, showError]);

  useEffect(() => {
    fetchApplications(0);
  }, [fetchApplications]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchApplications(newPage);
    }
  };

  const handleApprove = (app) => {
    setConfirm({
      isOpen: true,
      title: "Xác nhận duyệt đơn",
      message: `Bạn có chắc chắn muốn duyệt đơn của "${
        app.fullName || app.userEmail
      }"?`,
      onConfirm: () => performApprove(app.id),
    });
  };

  const performApprove = async (appId) => {
    setProcessingId(appId);
    try {
      await hostApplicationsApi.approve(appId);
      showSuccess("Thành công", "Đã duyệt đơn đăng ký.");
      fetchApplications(pagination.number);
    } catch (err) {
      showError("Thất bại", "Có lỗi xảy ra khi duyệt đơn.");
    } finally {
      setProcessingId(null);
      setConfirm({ isOpen: false });
    }
  };

  const handleReject = (app) => {
    setRejectModal({ isOpen: true, app: app, reason: "" });
  };

  const performReject = async () => {
    if (!rejectModal.reason.trim()) {
      showError("Lỗi", "Vui lòng nhập lý do từ chối.");
      return;
    }
    const appId = rejectModal.app.id;
    setProcessingId(appId);
    try {
      await hostApplicationsApi.reject(appId, rejectModal.reason);
      showSuccess("Thành công", "Đã từ chối đơn đăng ký.");
      setRejectModal({ isOpen: false, app: null, reason: "" });
      fetchApplications(pagination.number);
    } catch (err) {
      showError("Thất bại", "Có lỗi xảy ra khi từ chối đơn.");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading)
    return (
      <LoadingSpinner>
        <RefreshCw className="spinner" />
      </LoadingSpinner>
    );
  if (error)
    return (
      <ErrorMessage>
        <AlertTriangle /> {error}
      </ErrorMessage>
    );

  return (
    <>
      <AdminSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        onSearch={searchApplications}
        onClear={() => {
          setSearchTerm("");
          setFilters({ status: "ALL" });
          setIsSearchMode(false);
          fetchApplications(0);
        }}
        filterOptions={{
          status: [
            { value: "ALL", label: "Tất cả trạng thái" },
            { value: "PENDING", label: "Đang chờ" },
            { value: "APPROVED", label: "Đã duyệt" },
            { value: "REJECTED", label: "Đã từ chối" },
          ],
        }}
        placeholder="Tìm kiếm theo tên, email, số điện thoại..."
        $showFilters={true}
        debounceMs={300}
      />

      <Card>
        <Table>
          <thead>
            <tr>
              <th>Họ và Tên</th>
              <th>Email</th>
              <th>Ngày gửi</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {(isSearchMode ? searchResults : applications).length > 0 ? (
              (isSearchMode ? searchResults : applications).map((app) => (
                <tr key={app.id}>
                  <td>{app.fullName || app.username || "Chưa cập nhật"}</td>
                  <td>{app.userEmail}</td>
                  <td>{formatDate(app.requestDate)}</td>
                  <td>
                    <ActionContainer>
                      <Link to={`/admin/host-applications/${app.id}`}>
                        <ActionButton className="view" title="Xem chi tiết đơn">
                          <Eye size={16} />
                        </ActionButton>
                      </Link>
                      <ActionButton
                        className="approve"
                        onClick={() => handleApprove(app)}
                        disabled={processingId === app.id}
                        title="Duyệt"
                      >
                        Duyệt
                      </ActionButton>
                      <ActionButton
                        className="reject"
                        onClick={() => handleReject(app)}
                        disabled={processingId === app.id}
                        title="Từ chối"
                      >
                        Từ chối
                      </ActionButton>
                    </ActionContainer>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  {isSearchMode ? "Không tìm thấy đơn đăng ký nào." : "Không có đơn đăng ký nào đang chờ duyệt."}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {!isSearchMode && (
          <PaginationContainer>
            <span>
              Trang <strong>{pagination.number + 1}</strong> trên{" "}
              <strong>{pagination.totalPages || 1}</strong>
            </span>
            <PaginationControls>
              <PageButton
                onClick={() => handlePageChange(pagination.number - 1)}
                disabled={pagination.number === 0}
              >
                <ChevronLeft size={16} />
              </PageButton>
              <PageButton
                onClick={() => handlePageChange(pagination.number + 1)}
                disabled={pagination.number + 1 >= pagination.totalPages}
              >
                <ChevronRight size={16} />
              </PageButton>
            </PaginationControls>
          </PaginationContainer>
        )}
      </Card>

      <ConfirmDialog
        {...confirm}
        onClose={() => setConfirm({ isOpen: false })}
      />

      {rejectModal.isOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h3>
                Từ chối đơn của "
                {rejectModal.app.fullName || rejectModal.app.userEmail}"
              </h3>
            </ModalHeader>
            <ModalBody>
              <label>Lý do từ chối:</label>
              <TextArea
                value={rejectModal.reason}
                onChange={(e) =>
                  setRejectModal((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                rows={4}
                placeholder="Nhập lý do..."
              />
            </ModalBody>
            <ModalFooter>
              <ActionButton
                className="view"
                style={{
                  backgroundColor: "#e5e7eb",
                  color: "#374151",
                  borderColor: "#d1d5db",
                }}
                onClick={() =>
                  setRejectModal({ isOpen: false, app: null, reason: "" })
                }
              >
                Hủy
              </ActionButton>
              <ActionButton
                className="reject"
                onClick={performReject}
                disabled={processingId === rejectModal.app.id}
              >
                {processingId === rejectModal.app.id
                  ? "Đang xử lý..."
                  : "Xác nhận từ chối"}
              </ActionButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default HostApplicationsManagement;
