// src/components/admin/AddHouseModal.jsx
import React, { useState, useEffect } from "react";
import { HOUSE_TYPES, HOUSE_STATUS, HOUSE_TYPE_LABELS, HOUSE_STATUS_LABELS } from "../../utils/constants";

const AddHouseModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    price: "",
    description: "",
    houseType: HOUSE_TYPES.APARTMENT,
    numBedrooms: "",
    numBathrooms: "",
    area: "",
    status: HOUSE_STATUS.AVAILABLE,
    // Thêm trường mới để lưu trữ các file ảnh được chọn
    images: [], // Đây sẽ là một mảng các File object
  });

  const [imagePreviews, setImagePreviews] = useState([]); // State để hiển thị ảnh preview

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        address: "",
        price: "",
        description: "",
        houseType: HOUSE_TYPES.APARTMENT,
        numBedrooms: "",
        numBathrooms: "",
        area: "",
        status: HOUSE_STATUS.AVAILABLE,
        images: [],
      });
      setImagePreviews([]); // Reset previews khi modal mở
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["price", "numBedrooms", "numBathrooms", "area"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  // Hàm xử lý khi chọn file ảnh
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files], // Thêm các file mới vào mảng
    }));

    // Tạo URL preview cho mỗi ảnh mới
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Hàm xóa ảnh preview và file khỏi state
  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    // Quan trọng: Thu hồi URL object để tránh rò rỉ bộ nhớ
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Khi gửi form, chúng ta sẽ gửi FormData thay vì JSON
    const dataToSend = new FormData();

    // Thêm các trường dữ liệu văn bản vào FormData
    for (const key in formData) {
      if (key !== "images") {
        // Bỏ qua mảng images vì sẽ xử lý riêng
        dataToSend.append(key, formData[key]);
      }
    }

    // Thêm từng file ảnh vào FormData
    formData.images.forEach((image, index) => {
      dataToSend.append(`images`, image); // 'images' là tên trường bạn mong đợi ở backend
    });

    onSave(dataToSend); // Gửi FormData đi
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[95vh] overflow-y-auto relative transform transition-all scale-100 opacity-100 duration-300 ease-out">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Thêm nhà mới</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none font-light"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Các trường nhập liệu khác vẫn giữ nguyên */}
          {/* Tiêu đề */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tiêu đề:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Địa chỉ */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Địa chỉ:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Giá thuê */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Giá thuê (VNĐ):
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
              min="0"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mô tả:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y"
            ></textarea>
          </div>

          {/* Loại nhà */}
          <div>
            <label
              htmlFor="houseType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Loại nhà:
            </label>
            <select
              id="houseType"
              name="houseType"
              value={formData.houseType}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {Object.entries(HOUSE_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="numBedrooms"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phòng ngủ:
              </label>
              <input
                type="number"
                id="numBedrooms"
                name="numBedrooms"
                value={formData.numBedrooms}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                min="0"
              />
            </div>
            <div>
              <label
                htmlFor="numBathrooms"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phòng tắm:
              </label>
              <input
                type="number"
                id="numBathrooms"
                name="numBathrooms"
                value={formData.numBathrooms}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                min="0"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="area"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Diện tích (m²):
            </label>
            <input
              type="number"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min="0"
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Trạng thái:
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {Object.entries(HOUSE_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Trường upload ảnh */}
          <div>
            <label
              htmlFor="images"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ảnh nhà:
            </label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*" // Chỉ chấp nhận file ảnh
              multiple // Cho phép chọn nhiều ảnh
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {/* Hiển thị ảnh preview */}
            <div className="mt-2 flex flex-wrap gap-2">
              {imagePreviews.map((src, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 border rounded-md overflow-hidden"
                >
                  <img
                    src={src}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer modal - Nút lưu/hủy */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHouseModal;
