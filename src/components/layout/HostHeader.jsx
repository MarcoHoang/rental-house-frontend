import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { MessageCircle } from "lucide-react";
import authService from "../../api/authService";
import { getAvatarUrl } from "../../utils/avatarHelper";
import Avatar from "../common/Avatar";
import NotificationBell from "../common/NotificationBell";
import ChatNotificationBadge from "../common/ChatNotificationBadge";
import styled from "styled-components";
import ConfirmDialog from "../common/ConfirmDialog";
import { useToast } from "../common/Toast";
import { useAuthContext } from "../../contexts/AuthContext";

// Styled components (giống với Header.jsx)
const HeaderWrapper = styled.header`
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2563eb;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  padding: 0.25rem 0.5rem 0.25rem 0.25rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const UserAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: ${(props) => props.$bgColor || "#e5e7eb"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 0.875rem;
  flex-shrink: 0;
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 12rem;
  z-index: 10;
  overflow: hidden;
`;

const UserMenuHeader = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const UserName = styled.p`
  font-weight: 500;
  color: #111827;
`;

const UserEmail = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const UserMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #4b5563;
  text-decoration: none;
  font-size: 0.875rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #fef2f2;
  }
`;

const PostButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

// Hàm tạo màu ngẫu nhiên dựa trên tên

const HostHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userData, setUserData] = useState({
    id: null,
    username: "",
    fullName: "",
    avatar: null,
    email: "",
    role: "",
  });
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const { user: authUser } = useAuthContext();

  // Hàm xử lý đăng xuất
  const handleLogout = useCallback(() => {
    setShowLogoutConfirm(true);
  }, []);

  // Hàm thực hiện đăng xuất sau khi xác nhận
  const performLogout = useCallback(() => {
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

    window.dispatchEvent(new Event("storage"));
    showSuccess("Đăng xuất thành công", "Bạn đã đăng xuất khỏi hệ thống");
    navigate("/");
  }, [navigate, showSuccess]);

  // Tải thông tin người dùng
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
        console.log('HostHeader.loadUserProfile - Parsed userData:', userData);
        setUserData({
          id: userData.id,
          username: userData.email || "", // Lưu email vào username để tương thích
          fullName: userData.fullName || "Người dùng",
          avatar: getAvatarUrl(userData.avatarUrl || userData.avatar),
          email: userData.email || "",
          role: userData.role || "",
        });
        setIsLoggedIn(true);
      }

      const profile = await authService.getProfile();
      console.log('HostHeader.loadUserProfile - API profile:', profile);
      if (profile) {
        const userData = {
          id: profile.id,
          username: profile.email || "", // Lưu email vào username để tương thích
          fullName: profile.fullName || "Người dùng",
          avatar: getAvatarUrl(profile.avatarUrl || profile.avatar),
          email: profile.email || "",
          role: profile.role || "",
        };
        console.log('HostHeader.loadUserProfile - Formatted userData:', userData);
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

  // Kiểm tra đăng nhập khi component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          console.log('HostHeader.checkAuth - Parsed userData:', userData);
          setUserData({
            id: userData.id,
            username: userData.email || "", // Lưu email vào username để tương thích
            fullName: userData.fullName || "Người dùng",
            avatar: getAvatarUrl(userData.avatarUrl || userData.avatar),
            email: userData.email || "",
            role: userData.role || "",
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

    // Lắng nghe sự kiện storage tùy chỉnh (từ cùng tab)
    const handleCustomStorageEvent = () => {
      checkAuth();
    };

    // Lắng nghe sự kiện avatarUpdated từ HostProfilePage
    const handleAvatarUpdated = (event) => {
      const { avatarUrl } = event.detail;
      setUserData(prev => ({
        ...prev,
        avatar: getAvatarUrl(avatarUrl)
      }));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("storage", handleCustomStorageEvent);
    window.addEventListener("avatarUpdated", handleAvatarUpdated);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storage", handleCustomStorageEvent);
      window.removeEventListener("avatarUpdated", handleAvatarUpdated);
    };
  }, [handleLogout]);

  // Tải thông tin người dùng khi đã đăng nhập
  useEffect(() => {
    if (isLoggedIn) {
      loadUserProfile();
    }
  }, [isLoggedIn, loadUserProfile]);

  return (
    <HeaderWrapper>
      <HeaderContainer>
        <Logo to="/">RentalHouse</Logo>

        <Nav>
          <NavLink to="/cho-thue-can-ho">Căn hộ</NavLink>
          <NavLink to="/cho-thue-nha-pho">Nhà phố</NavLink>
          <NavLink to="/blog">Blog</NavLink>
        </Nav>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              {console.log('HostHeader.render - userData:', userData)}
              {console.log('HostHeader.render - authUser:', authUser)}
              <NotificationBell />
              <ChatNotificationBadge>
                <Link
                  to="/host/messages"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="hidden md:inline">Tin nhắn</span>
                </Link>
              </ChatNotificationBadge>
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full">
                <Avatar
                  src={userData.avatar}
                  alt={userData.fullName || "Người dùng"}
                  name={userData.fullName || "Người dùng"}
                  size="40px"
                />
                <div className="user-name">
                  {userData?.fullName || "Người dùng"}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </HeaderContainer>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={performLogout}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?"
        type="warning"
        confirmText="Đăng xuất"
        cancelText="Hủy"
      />
    </HeaderWrapper>
  );
};

export default HostHeader;
