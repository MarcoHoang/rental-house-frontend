// src/components/admin/EditHouseModal.jsx
import React, { useState, useEffect } from "react";
import { HOUSE_TYPE_LABELS, HOUSE_STATUS_LABELS } from "../../utils/constants";

const EditHouseModal = ({ isOpen, onClose, house, onSave }) => {
  // State nội bộ của form, được khởi tạo từ prop 'house'
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Khi prop `house` thay đổi (khi người dùng click sửa một nhà khác),
  // chúng ta cần cập nhật lại state của form.
  useEffect(() => {
    if (house) {
      setFormData({ ...house });
    }
  }, [house]);

  // Nếu modal không mở hoặc không có dữ liệu nhà, không render gì cả
  if (!isOpen || !formData) {
    return null;
  }

  // Hàm xử lý chung cho việc thay đổi giá trị trong các input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt reload
    setIsSaving(true);
    await onSave(formData); // Gọi hàm onSave được truyền từ component cha
    setIsSaving(false);
  };

  return (
    // Lớp phủ (overlay) toàn màn hình
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      {/* Panel của Modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-4 border-b sticky top-0 bg-white">
            <h2 className="text-xl font-bold">Chỉnh sửa thông tin nhà</h2>
            <p className="text-sm text-gray-500">ID: {formData.id}</p>
          </div>

          {/* Body - Các trường của Form */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cột 1 */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Tiêu đề
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Mô tả
              </label>
              <textarea
                name="description"
                id="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* Cột 2 */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Giá thuê (VNĐ)
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="area"
                className="block text-sm font-medium text-gray-700"
              >
                Diện tích (m²)
              </label>
              <input
                type="number"
                name="area"
                id="area"
                value={formData.area}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="houseType"
                className="block text-sm font-medium text-gray-700"
              >
                Loại nhà
              </label>
              <select
                name="houseType"
                id="houseType"
                value={formData.houseType}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {Object.entries(HOUSE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Trạng thái
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {Object.entries(HOUSE_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer - Các nút hành động */}
          <div className="p-4 border-t flex justify-end space-x-2 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:bg-blue-300"
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHouseModal;
