// src/components/admin/HostManagement.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
// Sửa lại import: dùng hostApplicationsApi và usersApi
import { hostApplicationsApi, usersApi } from "../../api/adminApi";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { useToast } from "../common/Toast";

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

const ActionButton = styled.button`
  padding: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  display: flex;
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
  &.view {
    color: #2b6cb0;
    &:hover {
      background: #ebf8ff;
    }
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

const HostManagement = () => {
  const [hosts, setHosts] = useState([]);
  const [pagination, setPagination] = useState({ number: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useToast();

  const fetchHosts = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setError(null);
      const data = await hostApplicationsApi.getAllHosts({ page, size: 10 });
      setHosts(data.content || []);
      setPagination({
        number: data.number || 0,
        totalPages: data.totalPages || 1,
      });
    } catch (err) {
      console.error("Error fetching hosts:", err);
      setError("Không thể tải danh sách chủ nhà. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHosts(0);
  }, [fetchHosts]);

  const handleToggleStatus = async (host) => {
    const currentStatus = host.active; // Lấy trạng thái hiện tại của host
    try {
      // Tái sử dụng API từ usersApi, truyền vào userId của Host
      await usersApi.updateStatus(host.id, !currentStatus);

      // Cập nhật UI ngay lập tức
      setHosts((currentHosts) =>
        currentHosts.map((h) =>
          h.id === host.id ? { ...h, active: !currentStatus } : h
        )
      );

      const action = !currentStatus ? "mở khóa" : "khóa";
      showSuccess(
        "Cập nhật thành công!",
        `Đã ${action} tài khoản của chủ nhà ${host.fullName || host.username}.`
      );
    } catch (err) {
      showError(
        "Cập nhật thất bại!",
        "Không thể cập nhật trạng thái của chủ nhà."
      );
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchHosts(newPage);
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
          {hosts.length > 0 ? (
            hosts.map((host) => (
              <tr key={host.id}>
                <td>{host.fullName || "Chưa cập nhật"}</td>
                <td>{host.email}</td>
                <td>{host.phone || "Chưa cập nhật"}</td>
                <td>
                  <Badge className={host.active ? "active" : "locked"}>
                    {host.active ? "Đang hoạt động" : "Đã khóa"}
                  </Badge>
                </td>
                <td>
                  <ActionContainer>
                    <Link
                      to={`/admin/user-management/${host.id}`}
                      title="Xem chi tiết"
                    >
                      <ActionButton className="view">
                        <Eye size={16} />
                      </ActionButton>
                    </Link>
                    <ActionButton
                      title={
                        host.active ? "Khóa tài khoản" : "Mở khóa tài khoản"
                      }
                      className={host.active ? "lock" : "unlock"}
                      onClick={() => handleToggleStatus(host)}
                    >
                      {host.active ? "Khóa" : "Mở khóa"}
                    </ActionButton>
                  </ActionContainer>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
                Không có chủ nhà nào.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
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
    </Card>
  );
};

export default HostManagement;
