// src/components/admin/UserManagement.jsx

import React, { useState, useEffect, useCallback } from "react";
import { usersApi } from "../../api/adminApi";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import styles from "./UserManagement.module.css"; // Import CSS Modules

const UserManagement = () => {
  // --- Toàn bộ logic, state và các hàm xử lý được giữ nguyên ---
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ number: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersApi.getAll({ page: page, size: 10 });
      const pageData = response.data.data;
      setUsers(pageData.content || []);
      setPagination({
        number: pageData.number || 0,
        totalPages: pageData.totalPages || 1,
      });
    } catch (err) {
      console.error("Lỗi khi fetch users:", err);
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(0);
  }, [fetchUsers]);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await usersApi.updateStatus(userId, !currentStatus);
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId ? { ...user, active: !currentStatus } : user
        )
      );
    } catch (err) {
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-16">
        <RefreshCw className={styles.spinner} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 p-8 text-center text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center gap-2">
        <AlertTriangle /> {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Họ và Tên</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Số điện thoại</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {user.fullName || "Chưa cập nhật"}
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">
                  {user.active ? (
                    <span className={`${styles.badge} ${styles.active}`}>
                      Hoạt động
                    </span>
                  ) : (
                    <span className={`${styles.badge} ${styles.locked}`}>
                      Đã khóa
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    className={`${styles.actionButton} ${
                      user.active ? styles.lock : styles.unlock
                    }`}
                    onClick={() => handleToggleStatus(user.id, user.active)}
                  >
                    {user.active ? "Khóa" : "Mở khóa"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-6 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
        <span>
          Trang <strong>{pagination.number + 1}</strong> trên{" "}
          <strong>{pagination.totalPages}</strong>
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(pagination.number - 1)}
            disabled={pagination.number === 0}
            className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => handlePageChange(pagination.number + 1)}
            disabled={pagination.number + 1 >= pagination.totalPages}
            className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
