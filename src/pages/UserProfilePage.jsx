// src/pages/UserProfilePage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../api/authService";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import styles from "./UserProfilePage.module.css"; // Import CSS Modules

const UserProfilePage = () => {
  // --- Toàn bộ logic, state và các hàm xử lý được giữ nguyên ---
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [profile, setProfile] = useState({
    email: user?.email || "",
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: user?.address || "",
    dateOfBirth: user?.dateOfBirth || "",
    avatar: null,
    avatarPreview: user?.avatar || "/default-avatar.png",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        email: user.email || "",
        fullName: user.fullName || "",
        phone: user.phone || "",
        address: user.address || "",
        dateOfBirth: user.dateOfBirth || "",
        avatarPreview: user.avatar || "/default-avatar.png",
      }));
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    /* ... logic giữ nguyên ... */
  };
  const handleAvatarChange = (e) => {
    /* ... logic giữ nguyên ... */
  };
  const validateForm = () => {
    /* ... logic giữ nguyên ... */
  };
  const handleSubmit = async (e) => {
    /* ... logic giữ nguyên ... */
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 md:p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Hồ sơ cá nhân
        </h1>
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Quay lại
        </button>
      </div>

      {/* Message Box */}
      {message.text && (
        <div
          className={`p-4 mb-6 rounded-md text-sm ${
            message.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Ảnh đại diện
          </label>
          <div className="flex items-center gap-6">
            <img
              src={profile.avatarPreview}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />
            <div>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className={styles.fileInput}
              />
              <label
                htmlFor="avatar"
                className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md cursor-pointer hover:bg-gray-300 transition-colors"
              >
                Chọn ảnh
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Định dạng: JPG, PNG. Tối đa: 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Email (Disabled) */}
        <div>
          <label
            htmlFor="email"
            className="block mb-1.5 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block mb-1.5 text-sm font-medium text-gray-700"
          >
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm ${
              styles.inputField
            } ${errors.fullName ? "border-red-500" : ""}`}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
          )}
        </div>

        {/* Grid for Date of Birth & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block mb-1.5 text-sm font-medium text-gray-700"
            >
              Ngày sinh
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={
                profile.dateOfBirth ? profile.dateOfBirth.split("T")[0] : ""
              }
              onChange={handleChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm ${styles.inputField}`}
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block mb-1.5 text-sm font-medium text-gray-700"
            >
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm ${
                styles.inputField
              } ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block mb-1.5 text-sm font-medium text-gray-700"
          >
            Địa chỉ
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={profile.address || ""}
            onChange={handleChange}
            placeholder="Nhập địa chỉ"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm ${
              styles.inputField
            } ${errors.address ? "border-red-500" : ""}`}
          />
          {errors.address && (
            <p className="mt-1 text-xs text-red-600">{errors.address}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfilePage;
