import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";
import {
  Home,
  Users,
  FileText,
  DollarSign,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import UserManagement from "./UserManagement";
import HostManagement from "./HostManagement";
import HostApplicationsManagement from "./HostApplicationsManagement";
import ConfirmDialog from "../common/ConfirmDialog";
import { useToast } from "../common/Toast";
import UserDetailPage from "./UserDetailPage";
import HostApplicationDetailPage from "./HostApplicationDetailPage";
import HostDetailPage from "./HostDetailPage";

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f8fafc;
`;

const Sidebar = styled.div`
  width: 280px;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 2rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #3182ce, #667eea);
  color: white;

  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0 0 0.5rem 0;
  }

  p {
    font-size: 0.875rem;
    opacity: 0.9;
    margin: 0;
  }
`;

const SidebarNav = styled.nav`
  flex: 1;
  padding: 1.5rem 0;
`;

const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  color: ${(props) => (props.$active ? "#3182ce" : "#4a5568")};
  background-color: ${(props) => (props.$active ? "#ebf8ff" : "transparent")};
  border-right: ${(props) => (props.$active ? "3px solid #3182ce" : "none")};
  font-weight: ${(props) => (props.$active ? "600" : "500")};

  &:hover {
    background-color: #f7fafc;
    color: #3182ce;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.875rem;
  }
`;

const UserInfo = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;

  .user-profile {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    margin-bottom: 1rem;
  }

  .avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #3182ce, #667eea);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1rem;
  }

  .user-details {
    flex: 1;

    .name {
      font-weight: 600;
      font-size: 0.875rem;
      color: #1a202c;
      margin: 0 0 0.25rem 0;
    }

    .email {
      font-size: 0.75rem;
      color: #718096;
      margin: 0;
    }
  }

  .logout-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #e2e8f0;
    border: none;
    border-radius: 0.5rem;
    color: #4a5568;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;

    &:hover {
      background: #cbd5e0;
      color: #2d3748;
    }
  }
`;

const MainContent = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e2e8f0;
  padding: 1.25rem 2rem;

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a202c;
    margin: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .stat-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #4a5568;
  }

  .stat-icon {
    padding: 0.5rem;
    border-radius: 0.5rem;

    &.total {
      background: #ebf8ff;
      color: #3182ce;
    }
    &.available {
      background: #f0fff4;
      color: #38a169;
    }
    &.rented {
      background: #fffaf0;
      color: #d69e2e;
    }
    &.revenue {
      background: #f0fff4;
      color: #38a169;
    }
  }

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #1a202c;
    margin-bottom: 0.5rem;
  }

  .stat-change {
    font-size: 0.75rem;
    color: #718096;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f7fafc;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a202c;
    margin: 0 0 0.25rem 0;
  }

  p {
    font-size: 0.875rem;
    color: #718096;
    margin: 0;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  .search-input {
    position: relative;
    flex: 1;

    input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;

      &:focus {
        outline: none;
        border-color: #3182ce;
        box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
      }
    }

    svg {
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.25rem;
      height: 1.25rem;
      color: #a0aec0;
    }
  }

  select {
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
    background: white;
    font-size: 0.875rem;
    min-width: 150px;

    &:focus {
      outline: none;
      border-color: #3182ce;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 1rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    background-color: #f7fafc;
    font-weight: 600;
    color: #4a5568;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  td {
    font-size: 0.875rem;
  }

  tbody tr:hover {
    background-color: #f7fafc;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;

  &.available {
    background-color: #c6f6d5;
    color: #22543d;
  }

  &.rented {
    background-color: #bee3f8;
    color: #2a4365;
  }

  &.maintenance {
    background-color: #fed7d7;
    color: #742a2a;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1.25rem;
  border: 2px solid ${(props) => (props.primary ? "#3182ce" : "#e2e8f0")};
  border-radius: 0.5rem;
  background: ${(props) => (props.primary ? "#3182ce" : "white")};
  color: ${(props) => (props.primary ? "white" : "#4a5568")};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.primary ? "#2c5aa0" : "#f7fafc")};
    transform: translateY(-1px);
  }

  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }

  &.ghost {
    border: none;
    background: transparent;
    padding: 0.5rem;

    &:hover {
      background: #f7fafc;
      transform: none;
    }
  }
`;

const HouseItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  img {
    width: 4rem;
    height: 4rem;
    border-radius: 0.5rem;
    object-fit: cover;
  }

  .house-info {
    flex: 1;

    h4 {
      font-weight: 600;
      margin: 0 0 0.25rem 0;
      color: #1a202c;
    }

    .address {
      font-size: 0.875rem;
      color: #718096;
      margin: 0 0 0.25rem 0;
    }

    .price {
      font-size: 0.875rem;
      font-weight: 600;
      color: #38a169;
      margin: 0;
    }
  }
`;

const mockHouses = [
  {
    id: 1,
    title: "Villa 2 tầng gần biển",
    address: "123 Đường Biển, Đà Nẵng",
    price: 15000000,
    status: "available",
    type: "villa",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    image: "/placeholder.svg?height=64&width=64&text=Villa",
  },
  {
    id: 2,
    title: "Căn hộ cao cấp trung tâm",
    address: "456 Lê Lợi, TP.HCM",
    price: 12000000,
    status: "rented",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 80,
    image: "/placeholder.svg?height=64&width=64&text=Apartment",
  },
  {
    id: 3,
    title: "Nhà phố 3 tầng",
    address: "789 Nguyễn Huệ, Hà Nội",
    price: 20000000,
    status: "maintenance",
    type: "house",
    bedrooms: 4,
    bathrooms: 3,
    area: 150,
    image: "/placeholder.svg?height=64&width=64&text=House",
  },
];

const mockStats = {
  totalHouses: 25,
  availableHouses: 18,
  rentedHouses: 5,
  maintenanceHouses: 2,
  monthlyRevenue: 180000000,
  totalTenants: 15,
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [houses] = useState(mockHouses);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess } = useToast();

  useEffect(() => {
    const path = location.pathname.split("/")[2] || "dashboard"; // Lấy phần sau '/admin/'
    setActiveTab(path);
  }, [location.pathname]);

  useEffect(() => {
    const adminData = localStorage.getItem("adminUser");
    if (adminData) {
      setCurrentUser(JSON.parse(adminData));
    }
  }, []);

  const handleLogout = () => setShowLogoutConfirm(true);

  const performLogout = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
    showSuccess("Đăng xuất thành công", "Bạn đã đăng xuất khỏi hệ thống admin");
    navigate("/admin/login");
  };

  const filteredHouses = houses.filter((house) => {
    const matchesSearch =
      house.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || house.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { label: "Có sẵn", className: "available" },
      rented: { label: "Đã thuê", className: "rented" },
      maintenance: { label: "Bảo trì", className: "maintenance" },
    };
    return statusConfig[status] || statusConfig.available;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Tổng quan",
      icon: Home,
      path: "/admin/dashboard",
    },
    {
      id: "user-management",
      label: "Quản lý User",
      icon: Users,
      path: "/admin/user-management",
    },
    {
      id: "host-applications",
      label: "Đơn đăng ký chủ nhà",
      icon: FileText,
      path: "/admin/host-applications",
    },
    {
      id: "host-management",
      label: "Quản lý Chủ nhà",
      icon: Home,
      path: "/admin/host-management",
    },
    { id: "houses", label: "Quản lý nhà", icon: Home, path: "/admin/houses" },
    { id: "tenants", label: "Khách thuê", icon: Users, path: "/admin/tenants" },
    {
      id: "contracts",
      label: "Hợp đồng",
      icon: FileText,
      path: "/admin/contracts",
    },
    {
      id: "revenue",
      label: "Doanh thu",
      icon: DollarSign,
      path: "/admin/revenue",
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarHeader>
          <h1>Admin Panel</h1>
          <p>Hệ thống quản lý thuê nhà</p>
        </SidebarHeader>

        <SidebarNav>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              // Bọc trong Link để thay đổi URL
              <Link
                to={item.path}
                key={item.id}
                style={{ textDecoration: "none" }}
              >
                <NavItem $active={activeTab === item.id}>
                  <Icon />
                  {item.label}
                </NavItem>
              </Link>
            );
          })}
        </SidebarNav>

        <UserInfo>
          <div className="user-profile">
            <div className="avatar">
              {currentUser?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="user-details">
              <p className="name">{currentUser?.name || "Admin User"}</p>
              <p className="email">
                {currentUser?.email || "admin@renthouse.com"}
              </p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Đăng xuất
          </button>
        </UserInfo>
      </Sidebar>

      <MainContent>
        <Header>
          <div className="header-content">
            <h2>{sidebarItems.find((item) => item.id === activeTab)?.label}</h2>
            <div className="header-actions">
              <Button>
                <Filter />
                Lọc
              </Button>
              <Button $primary>
                <Plus />
                Thêm mới
              </Button>
            </div>
          </div>
        </Header>

        <Main>
          <Routes>
            {/* Route cho Dashboard */}
            <Route index element={<DashboardContent />} />
            <Route path="dashboard" element={<DashboardContent />} />

            {/* Route cho User Management */}
            <Route path="user-management" element={<UserManagement />} />

            {/* Route cho User Detail Page */}
            <Route
              path="user-management/:userId"
              element={<UserDetailPage />}
            />

            {/* Route cho Host Applications Management */}
            <Route
              path="host-applications"
              element={<HostApplicationsManagement />}
            />

            {/* Route cho Host Management */}
            <Route path="host-management" element={<HostManagement />} />
            <Route
              path="host-management/:userId"
              element={<HostDetailPage />}
            />

            {/* Route cho các trang khác (ví dụ) */}
            <Route path="houses" element={<HousesContent />} />

            {/* Các route đang phát triển */}
            <Route
              path="tenants"
              element={
                <DevelopingFeaturePage featureName="Quản lý khách thuê" />
              }
            />
            <Route
              path="contracts"
              element={<DevelopingFeaturePage featureName="Quản lý hợp đồng" />}
            />

            <Route
              path="host-applications/:requestId"
              element={<HostApplicationDetailPage />}
            />
          </Routes>
        </Main>
      </MainContent>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={performLogout}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống admin?"
        type="warning"
        confirmText="Đăng xuất"
        cancelText="Hủy"
      />
    </DashboardContainer>
  );
};

const DashboardContent = () => (
  <div>
    <p>Nội dung trang tổng quan (Dashboard)...</p>
  </div>
);

const HousesContent = () => (
  <div>
    <p>Nội dung trang quản lý nhà (Houses)...</p>
  </div>
);

const DevelopingFeaturePage = ({ featureName }) => (
  <Card>
    <CardHeader>
      <h3>Đang phát triển</h3>
    </CardHeader>
    <CardContent>Tính năng "{featureName}" đang được phát triển.</CardContent>
  </Card>
);

export default AdminDashboard;
