import React, { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Home, 
  Plus, 
  FileText, 
  Users, 
  TrendingUp, 
  User,
  Building2,
  LogOut,
  Lock,
  MessageCircle
} from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog';
import { useToast } from '../common/Toast';
import HostNotificationBadge from '../host/HostNotificationBadge';
import BookingNotificationBadge from '../host/BookingNotificationBadge';
import OverviewNotificationBadge from '../host/OverviewNotificationBadge';

const SidebarContainer = styled.div`
  width: 280px;
  background: #F7FAFC;
  border-right: 1px solid #E2E8F0;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 40;
  padding-top: 70px; // Để tránh bị che bởi header
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding-top: 60px;
    width: 250px;
  }
`;

const SidebarContent = styled.div`
  padding: 2rem 0;
  height: 100%;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #E2E8F0;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #CBD5E0;
    border-radius: 3px;
    
    &:hover {
      background: #A0AEC0;
    }
  }
`;

const SidebarHeader = styled.div`
  padding: 0 2rem 2rem;
  border-bottom: 1px solid #E2E8F0;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1rem;
    font-weight: 700;
    color: #2D3748;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0;
  }
`;

const NavSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const NavTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 1rem 2rem;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  color: ${(props) => (props.$active ? "#4299E1" : "#2D3748")};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  background: ${(props) => (props.$active ? "#EDF2F7" : "transparent")};
  border-right: ${(props) => (props.$active ? "3px solid #4299E1" : "none")};
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(66, 153, 225, 0.1), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: #EDF2F7;
    color: #4299E1;
    transform: translateX(4px);
    
    &::before {
      left: 100%;
    }
  }
  
  .notification-badge {
    background: #ef4444;
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    min-width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
    position: relative;
    z-index: 10;
    white-space: nowrap;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  color: #E53E3E;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(229, 62, 62, 0.1), transparent);
    transition: left 0.5s;
  }

  &:hover {
    background: #FED7D7;
    color: #C53030;
    transform: translateX(8px);
    
    &::before {
      left: 100%;
    }
  }

  .icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }
`;

const SidebarFooter = styled.div`
  padding: 2rem;
  border-top: 1px solid #E2E8F0;
  margin-top: auto;
`;

const UserInfo = styled.div`
  text-align: center;
  color: #4A5568;
  
  .user-name {
    font-weight: 600;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }
  
  .user-role {
    font-size: 0.75rem;
    opacity: 0.7;
  }
`;

const HostSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Hàm xử lý đăng xuất
  const handleLogout = useCallback(() => {
    setShowLogoutConfirm(true);
  }, []);

  // Hàm thực hiện đăng xuất sau khi xác nhận
  const performLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Kích hoạt sự kiện để cập nhật giao diện
    window.dispatchEvent(new Event("storage"));
    showSuccess("Đăng xuất thành công", "Bạn đã đăng xuất khỏi hệ thống");
    navigate("/");
  }, [navigate, showSuccess]);

  return (
    <SidebarContainer>
      <SidebarContent>
        <SidebarHeader>
          <h3>Quản lý chủ nhà</h3>
        </SidebarHeader>

        <NavSection>
          <NavTitle>Dashboard</NavTitle>
          <NavItem to="/host" $active={isActive('/host')}>
            <Home className="icon" />
            Tổng quan
            <OverviewNotificationBadge isInline={true} hideWhenViewed={true} />
          </NavItem>
        </NavSection>

        <NavSection>
          <NavTitle>Tài sản</NavTitle>
          <NavItem to="/host/post" $active={isActive('/host/post')}>
            <Plus className="icon" />
            Đăng tin mới
          </NavItem>
          <NavItem to="/host/properties" $active={isActive('/host/properties')}>
            <FileText className="icon" />
            Quản lý tài sản
          </NavItem>
        </NavSection>

        <NavSection>
          <NavTitle>Đơn đặt phòng</NavTitle>
          <NavItem to="/host/bookings" $active={isActive('/host/bookings')}>
            <Users className="icon" />
            Quản lý đơn đặt
            <BookingNotificationBadge isInline={true} hideWhenViewed={true} />
          </NavItem>
        </NavSection>

        <NavSection>
          <NavTitle>Giao tiếp</NavTitle>
          <NavItem to="/host/messages" $active={isActive('/host/messages')}>
            <MessageCircle className="icon" />
            Tin nhắn từ người thuê
            <HostNotificationBadge isInline={true} hideWhenViewed={true} type="message" />
          </NavItem>
        </NavSection>

        <NavSection>
          <NavTitle>Báo cáo</NavTitle>
          <NavItem to="/host/analytics" $active={isActive('/host/analytics')}>
            <TrendingUp className="icon" />
            Thống kê & Báo cáo
          </NavItem>
        </NavSection>

        <NavSection>
          <NavTitle>Tài khoản</NavTitle>
          <NavItem to="/host/profile" $active={isActive('/host/profile')}>
            <User className="icon" />
            Thông tin cá nhân
          </NavItem>
          <NavItem to="/host/change-password" $active={isActive('/host/change-password')}>
            <Lock className="icon" />
            Đổi mật khẩu
          </NavItem>
          <LogoutButton onClick={handleLogout}>
            <LogOut className="icon" />
            Đăng xuất
          </LogoutButton>
        </NavSection>
      </SidebarContent>

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
    </SidebarContainer>
  );
};

export default HostSidebar;
