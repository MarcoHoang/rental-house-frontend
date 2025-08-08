// src/components/layout/Header.jsx

// --- Imports: Kết hợp từ cả hai nhánh ---
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon, // Thêm từ nhánh 'dev'
} from "@heroicons/react/24/outline";
import authService from "../../api/authService";
import HostRegistrationForm from "../host/HostRegistrationForm"; // Thêm từ nhánh 'dev'

// --- Hàm tiện ích: Giữ lại hàm getInitials ---
const getInitials = (name) => {
  if (!name) return "U";
  const names = name.split(" ");
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    : name[0].toUpperCase();
};

const Header = () => {
  // --- State: Kết hợp state từ cả hai nhánh, bao gồm cả role và modal ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHostRegistration, setShowHostRegistration] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    fullName: "",
    avatar: null,
    email: "",
    role: "", // Thêm 'role' từ nhánh 'dev'
  });
  const navigate = useNavigate();

  // --- Logic Functions: Kết hợp và tối ưu hóa từ cả hai nhánh ---

  // Sử dụng handleLogout từ nhánh 'dev' vì nó reset cả 'role'
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData({ username: "", fullName: "", avatar: null, email: "", role: "" });
    setShowDropdown(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  }, [navigate]);

  // Sử dụng loadUserProfile từ nhánh 'dev' vì nó lấy cả 'role'
  const loadUserProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      // Tải dữ liệu mới nhất từ server
      const profile = await authService.getProfile();
      if (profile) {
        const freshUserData = {
          username: profile.username || "",
          fullName: profile.fullName || profile.username || "",
          avatar: profile.avatar || null,
          email: profile.email || "",
          role: profile.role || "",
        };
        setUserData(freshUserData);
        localStorage.setItem("user", JSON.stringify(freshUserData));
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  }, [handleLogout]);

  // useEffect để kiểm tra trạng thái đăng nhập ban đầu và lắng nghe thay đổi
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(user));
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  // useEffect để tải thông tin chi tiết khi người dùng đã đăng nhập
  useEffect(() => {
    if (isLoggedIn) {
      loadUserProfile();
    }
  }, [isLoggedIn, loadUserProfile]);

  // Logic xử lý submit form đăng ký chủ nhà từ nhánh 'dev'
  const handleHostSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await fetch('http://localhost:8080/api/host-applications', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
      });
      
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Có lỗi xảy ra khi gửi đơn đăng ký');
      }
      
      alert('Đã gửi đơn đăng ký trở thành chủ nhà thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      setShowHostRegistration(false);
    } catch (error) {
      console.error('Lỗi khi gửi đơn đăng ký:', error);
      alert(error.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  // --- JSX to Render: Sử dụng cấu trúc Tailwind và tích hợp các tính năng mới ---
  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 no-underline flex items-center gap-2">
            RentalHouse
          </Link>

          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/" className="text-gray-600 no-underline font-medium transition-colors hover:text-blue-600 flex items-center gap-2">
              <HomeIcon className="h-5 w-5" />
              Trang chủ
            </Link>
            
            {/* TÍNH NĂNG MỚI: Link quản lý cho Host */}
            {userData?.role === 'HOST' && (
              <Link to="/host" className="text-blue-600 font-semibold no-underline transition-colors hover:text-blue-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Quản lý chủ nhà
              </Link>
            )}

            <Link to="/cho-thue-can-ho" className="text-gray-600 no-underline font-medium transition-colors hover:text-blue-600">
              Căn hộ
            </Link>
            <Link to="/cho-thue-nha-pho" className="text-gray-600 no-underline font-medium transition-colors hover:text-blue-600">
              Nhà phố
            </Link>
            <Link to="/blog" className="text-gray-600 no-underline font-medium transition-colors hover:text-blue-600">
              Blog
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none hover:bg-gray-100 px-3 py-1 rounded-full transition-colors"
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
                        )}&background=random&color=fff`;
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                      {getInitials(userData.fullName || userData.username)}
                    </div>
                  )}
                  <span className="text-gray-700 font-medium hidden md:inline max-w-[120px] truncate">
                    {userData.fullName || userData.username}
                  </span>
                  <ChevronDownIcon className="w-4 h-4 text-gray-500 hidden md:block" />
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{userData.fullName || userData.username}</p>
                        <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowDropdown(false)}>
                        <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                        Thông tin cá nhân
                      </Link>
                      
                      {/* TÍNH NĂNG MỚI: Nút đăng ký làm Host */}
                      {userData.role !== 'HOST' && (
                        <button onClick={() => { setShowDropdown(false); setShowHostRegistration(true); }} className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                          <HomeIcon className="w-4 h-4 mr-3 text-gray-400" />
                          Trở thành chủ nhà
                        </button>
                      )}

                      <div className="border-t border-gray-100">
                        <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50">
                          <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 text-red-400" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors font-medium">
                  Đăng nhập
                </Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* TÍNH NĂNG MỚI: Modal đăng ký Host */}
      <HostRegistrationForm 
        isOpen={showHostRegistration}
        onClose={() => setShowHostRegistration(false)}
        onSubmit={handleHostSubmit}
      />
    </>
  );
};

export default Header;