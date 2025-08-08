// src/components/host/HostRegistrationForm.jsx

import React, { useState, useCallback } from "react";
import {
  XMarkIcon,
  DocumentTextIcon,
  PhotoIcon,
  MapPinIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import styles from "./HostRegistrationForm.module.css"; // Import CSS Modules

const HostRegistrationForm = ({ isOpen, onClose, onSubmit }) => {
  // --- Toàn bộ logic, state, và các hàm xử lý được giữ nguyên ---
  const [formData, setFormData] = useState({
    idNumber: "",
    address: "",
    submissionDate: new Date().toISOString().split("T")[0],
    idFrontPhoto: null,
    idBackPhoto: null,
  });
  const [frontPreviewUrl, setFrontPreviewUrl] = useState(null);
  const [backPreviewUrl, setBackPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = "Vui lòng nhập số căn cước công dân/CMT";
    } else if (!/^[0-9]{9,12}$/.test(formData.idNumber)) {
      newErrors.idNumber = "Số căn cước/CMT không hợp lệ";
    }
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.idFrontPhoto)
      newErrors.idFrontPhoto = "Vui lòng tải ảnh mặt trước";
    if (!formData.idBackPhoto)
      newErrors.idBackPhoto = "Vui lòng tải ảnh mặt sau";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "idFrontPhoto" || name === "idBackPhoto") {
      const file = files && files[0];
      if (!file) return;
      setFormData((prev) => ({ ...prev, [name]: file }));
      const fileUrl = URL.createObjectURL(file);
      name === "idFrontPhoto"
        ? setFrontPreviewUrl(fileUrl)
        : setBackPreviewUrl(fileUrl);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("idNumber", formData.idNumber);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("submissionDate", formData.submissionDate);
      formDataToSend.append("idFrontPhoto", formData.idFrontPhoto);
      formDataToSend.append("idBackPhoto", formData.idBackPhoto);

      await onSubmit(formDataToSend);
      onClose(); // Đóng modal sau khi submit thành công
    } catch (error) {
      console.error("Lỗi khi gửi đơn đăng ký:", error);
      // Có thể hiển thị một thông báo lỗi ở đây
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Modal Overlay: Nền mờ bao phủ toàn màn hình
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000] p-4">
      {/* Modal Content: Hộp thoại chính */}
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Đăng ký trở thành chủ nhà
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Form Group: ID Number */}
          <div>
            <label
              htmlFor="idNumber"
              className="block mb-1.5 text-sm font-medium text-gray-700"
            >
              Số căn cước công dân/CMT <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DocumentTextIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                placeholder="Nhập số căn cước/CMT"
                className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm ${
                  styles.inputField
                } ${errors.idNumber ? "border-red-500" : "border-gray-300"}`}
              />
            </div>
            {errors.idNumber && (
              <p className="mt-1 text-xs text-red-600">{errors.idNumber}</p>
            )}
          </div>

          {/* Form Group: Address */}
          <div>
            <label
              htmlFor="address"
              className="block mb-1.5 text-sm font-medium text-gray-700"
            >
              Địa chỉ thường trú <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPinIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ thường trú"
                className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm ${
                  styles.inputField
                } ${errors.address ? "border-red-500" : "border-gray-300"}`}
              />
            </div>
            {errors.address && (
              <p className="mt-1 text-xs text-red-600">{errors.address}</p>
            )}
          </div>

          {/* Form Group: Submission Date */}
          <div>
            <label
              htmlFor="submissionDate"
              className="block mb-1.5 text-sm font-medium text-gray-700"
            >
              Ngày gửi đơn
            </label>
            <div className="relative">
              <CalendarIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                id="submissionDate"
                name="submissionDate"
                value={formData.submissionDate}
                onChange={handleChange}
                disabled
                className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300`}
              />
            </div>
          </div>

          {/* Form Group: File Uploads (chia 2 cột) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="idFrontPhoto"
                className="block mb-1.5 text-sm font-medium text-gray-700"
              >
                Ảnh mặt trước CCCD/CMT <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="idFrontPhoto"
                name="idFrontPhoto"
                accept="image/*"
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full text-sm text-gray-500 rounded-md ${
                  styles.fileInput
                } ${
                  errors.idFrontPhoto ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.idFrontPhoto && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.idFrontPhoto}
                </p>
              )}
              {frontPreviewUrl && (
                <img
                  src={frontPreviewUrl}
                  alt="Mặt trước"
                  className="mt-2 w-full h-auto rounded-md border border-gray-200"
                />
              )}
            </div>
            <div>
              <label
                htmlFor="idBackPhoto"
                className="block mb-1.5 text-sm font-medium text-gray-700"
              >
                Ảnh mặt sau CCCD/CMT <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="idBackPhoto"
                name="idBackPhoto"
                accept="image/*"
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full text-sm text-gray-500 rounded-md ${
                  styles.fileInput
                } ${errors.idBackPhoto ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.idBackPhoto && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.idBackPhoto}
                </p>
              )}
              {backPreviewUrl && (
                <img
                  src={backPreviewUrl}
                  alt="Mặt sau"
                  className="mt-2 w-full h-auto rounded-md border border-gray-200"
                />
              )}
            </div>
          </div>

          <p className="mt-1 text-xs text-gray-500">
            Vui lòng tải lên ảnh rõ nét, đầy đủ thông tin trên giấy tờ tùy thân.
          </p>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-indigo-600 text-white rounded-md font-semibold text-sm cursor-pointer hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi đơn đăng ký"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostRegistrationForm;
