// src/components/admin/HouseManagement.jsx (Đã sửa)

import React, { useState, useEffect, useCallback } from "react";
import {
  adminGetHouses,
  adminDeleteHouse,
  adminUpdateHouse,
  adminCreateHouse,
} from "@/api/houseApi.jsx"; // <<< Dùng bí danh '@'
import LoadingSpinner from "@/components/common/LoadingSpinner.jsx";
import EditHouseModal from "./EditHouseModal.jsx";
import AddHouseModal from "./AddHouseModal.jsx";
import { useToast } from "@/components/common/Toast.jsx";

// ... (Toàn bộ phần còn lại của component giữ nguyên, nó đã được viết đúng)
// Component nhỏ để hiển thị trạng thái cho đẹp
const StatusBadge = ({ status }) => {
  const statusStyles = {
    AVAILABLE: "bg-green-100 text-green-800",
    RENTED: "bg-blue-100 text-blue-800",
    INACTIVE: "bg-red-100 text-red-800",
    MAINTENANCE: "bg-yellow-100 text-yellow-800",
  };
  const statusText = {
    AVAILABLE: "CÒN SẴN",
    RENTED: "ĐÃ THUÊ",
    INACTIVE: "KHÔNG HOẠT ĐỘNG",
    MAINTENANCE: "BẢO TRÌ",
  };

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {statusText[status] || status}
    </span>
  );
};

const HouseManagement = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Đổi tên để rõ ràng hơn
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // <<< State mới cho modal thêm
  const [editingHouse, setEditingHouse] = useState(null);
  const { showSuccess, showError } = useToast();

  const handleOpenEditModal = (house) => {
    setEditingHouse(house);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    // Đổi tên để rõ ràng hơn
    setIsEditModalOpen(false);
    setEditingHouse(null);
  };

  const handleOpenAddModal = () => {
    // <<< Hàm mở modal thêm mới
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    // <<< Hàm đóng modal thêm mới
    setIsAddModalOpen(false);
  };

  const handleUpdateHouse = async (updatedHouseData) => {
    try {
      const response = await adminUpdateHouse(
        updatedHouseData.id,
        updatedHouseData
      );
      const updatedHouse = response.data.data;

      setHouses((currentHouses) =>
        currentHouses.map((h) => (h.id === updatedHouse.id ? updatedHouse : h))
      );
      showSuccess("Cập nhật thành công!", "Thông tin nhà đã được cập nhật thành công.");
      handleCloseEditModal();
    } catch (err) {
      console.error(
        "Lỗi khi cập nhật nhà:",
        err.response ? err.response.data : err.message
      );
      showError("Lỗi cập nhật!", "Có lỗi xảy ra khi cập nhật. Vui lòng kiểm tra lại thông tin.");
    }
  };

  const handleAddHouse = async (newHouseData) => {
    // <<< Hàm xử lý thêm nhà mới
    try {
      // Gọi API để thêm nhà mới
      // Bạn cần đảm bảo hàm adminCreateHouse tồn tại trong houseApi.jsx
      // và nhận vào dữ liệu nhà mới
      const response = await adminCreateHouse(newHouseData);
      const addedHouse = response.data.data;

      // Sau khi thêm thành công, làm mới danh sách hoặc thêm trực tiếp vào state
      // Để đơn giản, chúng ta sẽ fetch lại danh sách để đảm bảo phân trang đúng
      showSuccess("Thêm nhà thành công!", "Nhà mới đã được thêm vào hệ thống thành công.");
      handleCloseAddModal();
      fetchHouses(); // Tải lại dữ liệu để hiển thị nhà mới
    } catch (err) {
      console.error(
        "Lỗi khi thêm nhà:",
        err.response ? err.response.data : err.message
      );
      showError("Lỗi thêm nhà!", "Có lỗi xảy ra khi thêm nhà mới. Vui lòng kiểm tra lại thông tin.");
    }
  };

  const handleDeleteHouse = async (houseId) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhà có ID: ${houseId}?`)) {
      try {
        await adminDeleteHouse(houseId);
        showSuccess("Xóa nhà thành công!", "Nhà đã được xóa khỏi hệ thống thành công.");
        // Filter nhà đã xóa khỏi danh sách hiện tại
        setHouses((currentHouses) =>
          currentHouses.filter((house) => house.id !== houseId)
        );
        // Nếu trang hiện tại bị trống sau khi xóa, hoặc tổng số trang thay đổi,
        // thì cần điều chỉnh lại pagination hoặc fetch lại.
        // Tốt nhất là fetch lại để đảm bảo dữ liệu luôn đồng bộ.
        fetchHouses();
      } catch (err) {
        console.error(
          "Lỗi khi xóa nhà:",
          err.response ? err.response.data : err.message
        );
        showError("Lỗi xóa nhà!", "Có lỗi xảy ra khi xóa nhà. Vui lòng thử lại.");
      }
    }
  };

  const fetchHouses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        size: pagination.size,
        sort: "createdAt,desc",
      };
      const response = await adminGetHouses(params);
      const pageData = response.data.data;

      setHouses(pageData.content);
      setPagination((prev) => ({
        ...prev,
        totalPages: pageData.totalPages,
        totalElements: pageData.totalElements,
      }));
    } catch (err) {
      console.error(
        "Lỗi khi tải dữ liệu nhà:",
        err.response ? err.response.data : err.message
      );
      setError("Không thể tải dữ liệu từ server. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size]);

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages - 1) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 0) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý nhà</h1>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
          className="p-2 border rounded-md w-1/3"
        />
        <div>
          <button className="p-2 border rounded-md mr-2">Lọc</button>
          {/* NÚT THÊM MỚI ĐƯỢC THÊM HÀM XỬ LÝ */}
          <button
            onClick={handleOpenAddModal} // <<< Gắn hàm mở modal thêm mới
            className="p-2 bg-blue-500 text-white rounded-md"
          >
            + Thêm mới
          </button>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nhà
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá thuê
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {houses.length > 0 ? (
              houses.map((house) => (
                <tr key={house.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {house.title}
                    </div>
                    <div className="text-sm text-gray-500">id: {house.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {house.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                    {house.price ? house.price.toLocaleString("vi-VN") : "N/A"}{" "}
                    đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {house.houseType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={house.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleOpenEditModal(house)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteHouse(house.id)}
                      className="ml-4 text-red-600 hover:text-red-900 font-medium"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Không có dữ liệu nhà để hiển thị.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {pagination.totalPages > 0 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={pagination.page === 0}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50"
          >
            Trước
          </button>
          <span>
            Trang {pagination.page + 1} / {pagination.totalPages} (Tổng số:{" "}
            {pagination.totalElements} nhà)
          </span>
          <button
            onClick={handleNextPage}
            disabled={pagination.page >= pagination.totalPages - 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
      <EditHouseModal
        isOpen={isEditModalOpen} // Đổi tên prop
        onClose={handleCloseEditModal} // Đổi tên prop
        house={editingHouse}
        onSave={handleUpdateHouse}
      />
      {/* MODAL THÊM NHÀ MỚI */}
      <AddHouseModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleAddHouse} // Hàm để xử lý lưu nhà mới
      />
    </div>
  );
};

export default HouseManagement;
