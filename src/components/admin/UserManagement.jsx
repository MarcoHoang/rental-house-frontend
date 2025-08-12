// src/components/admin/UserManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { usersApi } from "../../api/adminApi";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { useToast } from "../common/Toast";

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
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;

  &.active {
    background-color: #c6f6d5;
    color: #22543d;
  }
  &.locked {
    background-color: #fed7d7;
    color: #742a2a;
  }
`;

// Bước 2: Cải tiến ActionButton và thêm ActionContainer
const ActionButton = styled.button`
  padding: 0.5rem; // Tăng padding để nhấn dễ hơn
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  display: flex; // Cần thiết để icon hiển thị đúng
  align-items: center;

  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }

  &.lock {
    color: #c53030;
    &:hover {
      background: #fed7d7;
    }
  }
  &.unlock {
    color: #2f855a;
    &:hover {
      background: #c6f6d5;
    }
  }
  // Thêm style cho nút xem
  &.view {
    color: #2b6cb0;
    &:hover {
      background: #ebf8ff;
    }
  }
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 0.5rem; // Khoảng cách giữa các nút
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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ number: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useToast();

  const fetchUsers = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setError(null);

      console.log("UserManagement.fetchUsers - Fetching users for page:", page);

      // Thêm filter để chỉ lấy user có role USER (không lấy HOST)
      const params = {
        page: page,
        size: 10,
        roleName: "USER", // Chỉ lấy user có role USER
      };

      const data = await usersApi.getAll(params);
      console.log("UserManagement.fetchUsers - Received data:", data);

      setUsers(data.content || data);
      setPagination({
        number: data.number || page,
        totalPages: data.totalPages || 1,
        totalElements: data.totalElements || 0,
      });
    } catch (err) {
      console.error("UserManagement.fetchUsers - Error:", err);
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchUsers(0);
  }, [fetchUsers]);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      console.log(
        "UserManagement.handleToggleStatus - Toggling status for user:",
        userId,
        "from",
        currentStatus,
        "to",
        !currentStatus
      );

      await usersApi.updateStatus(userId, !currentStatus);
      console.log(
        "UserManagement.handleToggleStatus - Status updated successfully"
      );

      // Cập nhật lại trạng thái của user trong state để UI thay đổi ngay lập tức
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId ? { ...user, active: !currentStatus } : user
        )
      );

      // Hiển thị thông báo thành công
      const user = users.find((u) => u.id === userId);
      const action = !currentStatus ? "mở khóa" : "khóa";
      showSuccess(
        "Cập nhật thành công!",
        `Đã ${action} tài khoản của ${
          user?.fullName || user?.email || "người dùng"
        }`
      );
    } catch (err) {
      console.error("UserManagement.handleToggleStatus - Error:", err);
      showError(
        "Cập nhật thất bại!",
        "Không thể cập nhật trạng thái người dùng. Vui lòng thử lại."
      );
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner>
        <RefreshCw className="spinner" />
      </LoadingSpinner>
    );
  }

  if (error) {
    return (
      <ErrorMessage>
        <AlertTriangle style={{ marginRight: "0.5rem" }} /> {error}
      </ErrorMessage>
    );
  }

  return (
    <Card>
      <Table>
        <thead>
          <tr>
            <th>Họ và Tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName || "Chưa cập nhật"}</td>
              <td>{user.email || "Chưa cập nhật"}</td>
              <td>{user.phone || "Chưa cập nhật"}</td>
              <td>
                {user.active ? (
                  <Badge className="active">Đang hoạt động</Badge>
                ) : (
                  <Badge className="locked">Đã khóa</Badge>
                )}
              </td>
              <td>
                {/* Bước 3: Thêm nút Xem chi tiết và nhóm các nút lại */}
                <ActionContainer>
                  <Link
                    to={`/admin/user-management/${user.id}`}
                    title="Xem chi tiết"
                  >
                    <ActionButton className="view">
                      <Eye size={16} />
                    </ActionButton>
                  </Link>
                  <ActionButton
                    title={user.active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                    className={user.active ? "lock" : "unlock"}
                    onClick={() => handleToggleStatus(user.id, user.active)}
                  >
                    {user.active ? "Khóa" : "Mở khóa"}
                  </ActionButton>
                </ActionContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
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
    </Card>
  );
};
export default UserManagement;
