// src/components/layout/Header.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import HostRegistrationForm from "../host/HostRegistrationForm";
// Không cần import Header.module.css nữa

// --- Các hàm tiện ích (giữ nguyên, không thay đổi) ---
const stringToColor = (string) => {
  let hash = 0;
  if (string.length === 0) return "#e5e7eb";
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const getInitials = (name) => {
  if (!name) return "U";
  const names = name.split(" ");
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    : name[0].toUpperCase();
};

const Header = () => {
  // --- Toàn bộ phần logic, state và các hàm xử lý được giữ nguyên ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHostRegistration, setShowHostRegistration] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    fullName: "",
    avatar: null,
    email: "",
    role: "",
  });
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData({
      username: "",
      fullName: "",
      avatar: null,
      email: "",
      role: "",
    });
    setShowDropdown(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  }, [navigate]);

  // Các useEffect để xử lý logic auth được giữ nguyên
  const loadUserProfile = useCallback(async () => {
    /* ... */
  }, [handleLogout]);
  useEffect(() => {
    /* ... */
  }, [handleLogout]);
  useEffect(() => {
    /* ... */
  }, [isLoggedIn, loadUserProfile]);

  return (
    // Thẻ header có nền trắng, bóng đổ, và trải dài hết màn hình
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      {/* div con trực tiếp sử dụng lớp "container" để căn giữa nội dung */}
      <div className="container h-16 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          RentalHouse
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-600 font-medium px-3 py-2 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            <HomeIcon className="h-5 w-5" />
            Trang chủ
          </Link>
          {userData?.role === "HOST" && (
            <Link
              to="/host"
              className="text-blue-600 font-semibold px-3 py-2 rounded-md hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <BuildingStorefrontIcon className="h-5 w-5" /> Quản lý chủ nhà
            </Link>
          )}
          <Link
            to="/cho-thue-can-ho"
            className="text-gray-600 font-medium px-3 py-2 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors"
          >
            Căn hộ
          </Link>
          <Link
            to="/cho-thue-nha-pho"
            className="text-gray-600 font-medium px-3 py-2 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors"
          >
            Nhà phố
          </Link>
          <Link
            to="/blog"
            className="text-gray-600 font-medium px-3 py-2 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors"
          >
            Blog
          </Link>
        </nav>

        {/* Auth Buttons & User Menu */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 focus:outline-none hover:bg-gray-100 p-1.5 rounded-full transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white text-sm border-2 border-white shadow-sm"
                  style={{
                    backgroundColor: stringToColor(
                      userData.fullName || userData.username
                    ),
                  }}
                >
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt={userData.fullName || userData.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(userData.fullName || userData.username)
                  )}
                </div>
                <div className="font-medium text-gray-800 text-sm max-w-[120px] truncate hidden md:block">
                  {userData?.fullName || userData?.username || "Người dùng"}
                </div>
                <ChevronDownIcon className="w-4 h-4 text-gray-500 hidden md:block" />
              </button>

              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {userData.fullName || userData.username}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {userData.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                      Thông tin cá nhân
                    </Link>
                    {userData.role !== "HOST" && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowDropdown(false);
                          setShowHostRegistration(true);
                        }}
                        className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <HomeIcon className="w-4 h-4 mr-3 text-gray-400" />
                        Trở thành chủ nhà
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Host Registration Modal (Giữ nguyên) */}
      <HostRegistrationForm
        isOpen={showHostRegistration}
        onClose={() => setShowHostRegistration(false)}
        onSubmit={async (formData) => {
          /* ... */
        }}
      />
    </header>
  );
};

export default Header;
