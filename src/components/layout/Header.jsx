// src/components/layout/Header.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import authService from "../../api/authService";
// Xóa "styled-components" vì không còn sử dụng
// import styled from 'styled-components';

// Hàm lấy ký tự đầu tiên của tên (Không thay đổi)
const getInitials = (name) => {
  if (!name) return "U";
  const names = name.split(" ");
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    : name[0].toUpperCase();
};

const Header = () => {
  // --- Toàn bộ state và logic bên trong component được giữ nguyên ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    fullName: "",
    avatar: null,
  });
  const navigate = useNavigate();

  // Hàm xử lý đăng xuất (Không thay đổi)
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData({ username: "", fullName: "", avatar: null });
    setShowDropdown(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  }, [navigate]);

  // Các hàm loadUserProfile và useEffect cũng được giữ nguyên hoàn toàn
  // vì chúng không liên quan đến styling
  const loadUserProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserData({
          username: userData.username || "",
          fullName: userData.fullName || userData.username || "",
          avatar: userData.avatar || null,
          email: userData.email || "",
        });
        setIsLoggedIn(true);
      }

      const profile = await authService.getProfile();
      if (profile) {
        const userData = {
          username: profile.username || "",
          fullName: profile.fullName || profile.username || "",
          avatar: profile.avatar || null,
          email: profile.email || "",
        };
        setUserData(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  }, [handleLogout]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          setUserData({
            username: userData.username || "",
            fullName: userData.fullName || userData.username || "",
            avatar: userData.avatar || null,
            email: userData.email || "",
          });
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Lỗi khi đọc dữ liệu người dùng:", error);
          handleLogout();
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuth();

    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [handleLogout]);

  useEffect(() => {
    if (isLoggedIn) {
      loadUserProfile();
    }
  }, [isLoggedIn, loadUserProfile]);
  // --- Kết thúc phần logic không thay đổi ---

  // --- JSX to Render (Đã cập nhật với Tailwind CSS) ---
  return (
    // Thay thế <HeaderWrapper> bằng <header> với các lớp Tailwind
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Thay thế <HeaderContainer> bằng <div> */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* Thay thế <Logo> bằng <Link> */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 no-underline flex items-center gap-2"
        >
          RentalHouse
        </Link>

        {/* Thay thế <Nav> bằng <nav> */}
        <nav className="hidden md:flex gap-6 items-center">
          {/* Thay thế <NavLink> bằng <Link> */}
          <Link
            to="/cho-thue-can-ho"
            className="text-gray-600 no-underline font-medium transition-colors hover:text-blue-600"
          >
            Căn hộ
          </Link>
          <Link
            to="/cho-thue-nha-pho"
            className="text-gray-600 no-underline font-medium transition-colors hover:text-blue-600"
          >
            Nhà phố
          </Link>
          <Link
            to="/blog"
            className="text-gray-600 no-underline font-medium transition-colors hover:text-blue-600"
          >
            Blog
          </Link>
        </nav>

        {/* Phần này đã sử dụng Tailwind, giữ nguyên và tích hợp */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 focus:outline-none hover:bg-gray-100 px-3 py-1 rounded-full transition-colors"
                aria-haspopup="true"
                aria-expanded={showDropdown}
              >
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.fullName || "User"}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        userData.fullName || userData.username || "U"
                      )}&background=random`;
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                    {getInitials(userData.fullName || userData.username || "U")}
                  </div>
                )}
                <span className="text-gray-700 font-medium hidden md:inline">
                  {userData.fullName || userData.username}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-gray-500 hidden md:block" />
              </button>

              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
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
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                      Thông tin cá nhân
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 text-gray-400" />
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              {/* Thay thế <AuthButton> bằng <Link> với các lớp Tailwind */}
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors font-medium"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
