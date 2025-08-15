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
  Lock
} from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog';
import { useToast } from '../common/Toast';

const SidebarContainer = styled.div`
  width: 250px;
  background: white;
  border-right: 1px solid #e2e8f0;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 40;
  padding-top: 64px; // Để tránh bị che bởi header
`;

const SidebarContent = styled.div`
  padding: 1.5rem 0;
`;

const SidebarHeader = styled.div`
  padding: 0 1.5rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1rem;

  h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0;
  }
`;

const NavSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const NavTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.5rem 1.5rem;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: ${props => props.$active ? '#1e40af' : '#4b5563'};
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: ${props => props.$active ? '500' : '400'};
  background: ${props => props.$active ? '#eff6ff' : 'transparent'};
  border-right: ${props => props.$active ? '3px solid #1e40af' : 'none'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#eff6ff' : '#f9fafb'};
    color: ${props => props.$active ? '#1e40af' : '#1f2937'};
  }

  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: #ef4444;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 400;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fef2f2;
    color: #dc2626;
  }

  .icon {
    width: 1.25rem;
    height: 1.25rem;
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
