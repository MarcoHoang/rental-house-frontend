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
import AdminSearchBar from "./AdminSearchBar";

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

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #e53e3e;
  background-color: #fed7d7;
  border-radius: 0.5rem;
  margin: 1.5rem;
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
    border: 2px solid #e2e8f0;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ number: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search và filter states - tính năng mới
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'ALL'
  });
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Thêm processingId để theo dõi trạng thái xử lý
  const [processingId, setProcessingId] = useState(null);

  const { showSuccess, showError } = useToast();

  // Fetch users với phân trang - logic cũ
  const fetchUsers = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setError(null);

      // Backend đã được sửa để chỉ trả về các User có vai trò là USER
      const data = await usersApi.getAll({ page: page, size: 8 });

      // Lấy dữ liệu từ response và đảm bảo luôn là một mảng
      const userList = data?.content || [];

      setUsers(userList);
      setPagination({
        number: data?.number || 0,
        totalPages: data?.totalPages || 1,
      });
    } catch (err) {
      console.error("UserManagement.fetchUsers - Error:", err);
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại.");
      setUsers([]); // Nếu có lỗi, đảm bảo danh sách là rỗng
    } finally {
      setLoading(false);
    }
  }, []);

  // Local filter users (giống trang chủ) - KHÔNG gọi API
  useEffect(() => {
    if (!users.length) return;

    let filtered = users;

    // Filter theo status
    if (filters.status !== 'ALL') {
      const isActive = filters.status === 'true';
      filtered = filtered.filter(user => user.active === isActive);
    }

    // Search theo tên, email, phone (local search)
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        (user.fullName && user.fullName.toLowerCase().includes(term)) ||
        (user.email && user.email.toLowerCase().includes(term)) ||
        (user.phone && user.phone.toLowerCase().includes(term)) ||
        (user.address && user.address.toLowerCase().includes(term))
      );
    }

    // Sắp xếp theo thời gian tạo mới nhất (mới nhất ở trên)
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.registrationDate || 0);
      const dateB = new Date(b.createdAt || b.registrationDate || 0);
      return dateB - dateA; // Mới nhất lên đầu
    });

    setSearchResults(filtered);
    setIsSearchMode(searchTerm.trim() || filters.status !== 'ALL');
  }, [users, searchTerm, filters]);

  // Search users với API - chỉ khi bấm nút tìm kiếm
  const searchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await usersApi.searchUsers(
        searchTerm.trim() || undefined,
        undefined, // role parameter removed
        filters.status !== 'ALL' ? filters.status === 'true' : undefined
      );
      
      setUsers(Array.isArray(data) ? data : []);
      // Local filter sẽ tự động chạy sau khi setUsers
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Không thể tìm kiếm người dùng. Vui lòng thử lại sau.');
      showError('Lỗi tìm kiếm', 'Không thể tìm kiếm người dùng');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, showError]);

  // Handle pagination - logic cũ
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  // Handle user status update - logic cũ
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      setProcessingId(userId); // Bắt đầu xử lý
      
      console.log(
        "UserManagement.handleToggleStatus - Updating status from",
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
    } finally {
      setProcessingId(null); // Kết thúc xử lý
    }
  };

  // Initial load - logic cũ
  useEffect(() => {
    fetchUsers(0);
  }, [fetchUsers]);

  if (loading) {
    return (
      <LoadingSpinner>
        <div className="spinner"></div>
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
    <div>
      <AdminSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        onSearch={searchUsers}
        onClear={() => {
          setSearchTerm("");
          setFilters({ status: "ALL" });
          setIsSearchMode(false);
          fetchUsers(0);
        }}
        filterOptions={{
          status: [
            { value: "ALL", label: "Tất cả trạng thái" },
            { value: "true", label: "Hoạt động" },
            { value: "false", label: "Đã khóa" },
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
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {(isSearchMode ? searchResults : users).length > 0 ? (
              (isSearchMode ? searchResults : users).map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName || "Chưa cập nhật"}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "Chưa cập nhật"}</td>
                  <td>
                    <Badge className={user.active ? "active" : "locked"}>
                      {user.active ? "Đang hoạt động" : "Đã khóa"}
                    </Badge>
                  </td>
                  <td>
                    <ActionContainer>
                      <Link to={`/admin/user-management/${user.id}`}>
                        <ActionButton className="view" title="Xem chi tiết">
                          <Eye size={16} />
                        </ActionButton>
                      </Link>
                      <ActionButton
                        className={user.active ? "lock" : "unlock"}
                        onClick={() => handleToggleStatus(user.id, user.active)}
                        disabled={processingId === user.id}
                        title={user.active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                      >
                        {user.active ? "Khóa" : "Mở khóa"}
                      </ActionButton>
                    </ActionContainer>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  {isSearchMode ? "Không tìm thấy người dùng nào." : "Không có người dùng nào."}
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {!isSearchMode && pagination.totalPages > 1 && (
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
        )}
      </Card>
    </div>
  );
};

export default UserManagement;
