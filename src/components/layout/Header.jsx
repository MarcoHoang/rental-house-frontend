import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import authService from "../../api/authService";
import { getAvatarUrl } from "../../utils/avatarHelper";
import Avatar from "../common/Avatar";
import styled from "styled-components";
import HostRegistrationForm from "../host/HostRegistrationForm";
import ConfirmDialog from "../common/ConfirmDialog";
import { useToast } from "../common/Toast";

// Hàm tạo màu ngẫu nhiên dựa trên tên

// Styled components
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

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;

  &:hover {
    color: #2563eb;
    background-color: #f3f4f6;
  }
`;

// Styles for auth buttons
const AuthButton = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;

  &.login {
    color: #4f46e5;
    &:hover {
      background-color: #eef2ff;
    }
  }

  &.signup {
    background-color: #4f46e5;
    color: white;
    &:hover {
      background-color: #4338ca;
    }
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

  .user-name {
    font-weight: 500;
    color: #1f2937;
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

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHostRegistration, setShowHostRegistration] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    fullName: "",
    avatar: null,
    email: "",
    roleName: "",
  });

  const { showSuccess } = useToast();

  const navigate = useNavigate();

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
      roleName: "",
    });
    setShowDropdown(false);
    // Kích hoạt sự kiện để cập nhật giao diện
    window.dispatchEvent(new Event("storage"));
    showSuccess("Đăng xuất thành công", "Bạn đã đăng xuất khỏi hệ thống");
    navigate("/");
  }, [navigate, showSuccess]);

  // Hàm tải thông tin người dùng
  const loadUserProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      // Thử lấy thông tin từ localStorage trước
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserData({
          username: userData.email || "", // Lưu email vào username để tương thích
          fullName: userData.fullName || "Người dùng",
          avatar: getAvatarUrl(userData.avatarUrl || userData.avatar),
          email: userData.email || "",
          roleName: userData.roleName || "",
        });
        setIsLoggedIn(true);
      }

      // Sau đó gọi API để cập nhật thông tin mới nhất
      const profile = await authService.getProfile();
      if (profile) {
        const userData = {
          username: profile.email || "", // Lưu email vào username để tương thích
          fullName: profile.fullName || "Người dùng",
          avatar: getAvatarUrl(profile.avatarUrl || profile.avatar),
          email: profile.email || "",
          roleName: profile.roleName || "",
        };
        setUserData(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
      // Nếu có lỗi khi lấy thông tin, đăng xuất
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
          console.log("User data from localStorage:", userData); // Thêm dòng này để kiểm tra
          setUserData({
            username: userData.email || "", // Lưu email vào username để tương thích
            fullName: userData.fullName || "Người dùng",
            avatar: getAvatarUrl(userData.avatarUrl || userData.avatar),
            email: userData.email || "",
            roleName: userData.roleName || "",
          });
          console.log("User role set to:", userData.roleName); // Thêm dòng này để kiểm tra
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Lỗi khi đọc dữ liệu người dùng:", error);
          handleLogout();
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    // Kiểm tra ngay lần đầu
    checkAuth();

    // Lắng nghe sự kiện storage thay đổi (từ các tab khác hoặc sau khi đăng nhập)
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        checkAuth();
      }
    };

    // Lắng nghe sự kiện storage tùy chỉnh (từ cùng tab)
    const handleCustomStorageEvent = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("storage", handleCustomStorageEvent);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storage", handleCustomStorageEvent);
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
          <NavLinks>
            <NavLink to="/">
              <HomeIcon className="h-5 w-5" />
              Trang chủ
            </NavLink>
            {/* Chỉ hiển thị nút Quản lý chủ nhà nếu là HOST */}
            {userData?.roleName === "HOST" && (
              <NavLink to="/host" className="text-blue-600 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Quản lý chủ nhà
              </NavLink>
            )}
            <NavLink to="/cho-thue-can-ho">Căn hộ</NavLink>
            <NavLink to="/cho-thue-nha-pho">Nhà phố</NavLink>
            <NavLink to="/blog">Blog</NavLink>
          </NavLinks>
        </Nav>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            // Hiển thị khi đã đăng nhập
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 focus:outline-none hover:bg-gray-100 px-3 py-1 rounded-full transition-colors"
                aria-haspopup="true"
                aria-expanded={showDropdown}
              >
                <Avatar
                  src={userData.avatar}
                  alt={userData.fullName || "Người dùng"}
                  name={userData.fullName || "Người dùng"}
                  size="40px"
                />
                <div className="user-name">
                  {userData?.fullName || "Người dùng"}
                </div>
                <ChevronDownIcon className="w-4 h-4 text-gray-500 hidden md:block" />
              </button>

              {showDropdown && (
                <>
                  {/* Overlay để đóng dropdown khi click ra ngoài */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {userData.fullName || "Người dùng"}
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

                    {/* Ẩn mục xin xét duyệt nếu đã là HOST */}
                    {userData.roleName !== "HOST" && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowDropdown(false);
                          setShowHostRegistration(true);
                        }}
                        className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <HomeIcon className="w-4 h-4 mr-3 text-gray-400" />
                        Xin xét duyệt trở thành chủ nhà
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 text-gray-400" />
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Hiển thị khi chưa đăng nhập
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

      {/* Host Registration Modal */}
      <HostRegistrationForm
        isOpen={showHostRegistration}
        onClose={() => setShowHostRegistration(false)}
        onSubmit={async (formData) => {
          try {
            const token = localStorage.getItem("token");
            if (!token) {
              navigate("/login");
              return;
            }

            // Import hostApi
            const hostApi = (await import("../../api/hostApi")).default;
            const result = await hostApi.submitHostApplication(formData);

            alert(
              "Đã gửi đơn đăng ký trở thành chủ nhà thành công! Chúng tôi sẽ liên hệ với bạn sớm."
            );
            setShowHostRegistration(false);
          } catch (error) {
            console.error("Lỗi khi gửi đơn đăng ký:", error);

            // Hiển thị thông báo lỗi chi tiết hơn
            let errorMessage =
              "Có lỗi xảy ra khi gửi đơn đăng ký. Vui lòng thử lại sau.";

            if (error.response?.data?.message) {
              errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
              errorMessage = error.response.data.error;
            } else if (error.message) {
              errorMessage = error.message;
            }

            alert(`Lỗi: ${errorMessage}`);
          }
        }}
      />

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

export default Header;
