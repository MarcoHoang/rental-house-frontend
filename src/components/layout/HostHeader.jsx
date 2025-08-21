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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(10px);
`;

const HeaderContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
    height: 60px;
  }
`;

const Logo = styled(Link)`
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }
  
  .logo-icon {
    width: 2rem;
    height: 2rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    
    .logo-icon {
      width: 1.75rem;
      height: 1.75rem;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 1024px) {
    gap: 1rem;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    
    &::before {
      left: 100%;
    }
  }
  
  .nav-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  @media (max-width: 1024px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
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
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .user-name {
    font-weight: 600;
    color: white;
    font-size: 0.9375rem;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  min-width: 14rem;
  z-index: 10;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const UserMenuHeader = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
`;

const UserName = styled.p`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9375rem;
`;

const UserEmail = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
`;

const UserMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  color: #475569;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    color: #1e293b;
    transform: translateX(4px);
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
    color: #dc2626;
    transform: translateX(4px);
  }
`;

const PostButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(238, 90, 36, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: linear-gradient(135deg, #ee5a24, #ff6b6b);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(238, 90, 36, 0.4);
    
    &::before {
      left: 100%;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
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
