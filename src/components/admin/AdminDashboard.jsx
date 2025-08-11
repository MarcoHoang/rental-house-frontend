import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import ConfirmDialog from "../common/ConfirmDialog";
import { useToast } from "../common/Toast";

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
  const { showSuccess } = useToast();

  useEffect(() => {
    const adminData = localStorage.getItem("adminUser");
    if (adminData) {
      setCurrentUser(JSON.parse(adminData));
    }
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const performLogout = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
    showSuccess('Đăng xuất thành công', 'Bạn đã đăng xuất khỏi hệ thống admin');
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
    { id: "dashboard", label: "Tổng quan", icon: Home },
    { id: "users", label: "Quản lý User", icon: Users },
    { id: "houses", label: "Quản lý nhà", icon: Home },
    { id: "tenants", label: "Khách thuê", icon: Users },
    { id: "contracts", label: "Hợp đồng", icon: FileText },
    { id: "revenue", label: "Doanh thu", icon: DollarSign },
    { id: "settings", label: "Cài đặt", icon: Settings },
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
              <NavItem
                key={item.id}
                $active={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon />
                {item.label}
              </NavItem>
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
          {activeTab === "dashboard" && (
            <div>
              <StatsGrid>
                <StatCard>
                  <div className="stat-header">
                    <span className="stat-title">Tổng số nhà</span>
                    <div className="stat-icon total">
                      <Home size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{mockStats.totalHouses}</div>
                  <div className="stat-change">+2 từ tháng trước</div>
                </StatCard>

                <StatCard>
                  <div className="stat-header">
                    <span className="stat-title">Nhà có sẵn</span>
                    <div className="stat-icon available">
                      <Home size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{mockStats.availableHouses}</div>
                  <div className="stat-change">72% tổng số nhà</div>
                </StatCard>

                <StatCard>
                  <div className="stat-header">
                    <span className="stat-title">Đã cho thuê</span>
                    <div className="stat-icon rented">
                      <Users size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{mockStats.rentedHouses}</div>
                  <div className="stat-change">
                    {mockStats.totalTenants} khách thuê
                  </div>
                </StatCard>

                <StatCard>
                  <div className="stat-header">
                    <span className="stat-title">Doanh thu tháng</span>
                    <div className="stat-icon revenue">
                      <DollarSign size={20} />
                    </div>
                  </div>
                  <div className="stat-value">
                    {formatPrice(mockStats.monthlyRevenue)}
                  </div>
                  <div className="stat-change">+12% từ tháng trước</div>
                </StatCard>
              </StatsGrid>

              <Card>
                <CardHeader>
                  <h3>Nhà mới nhất</h3>
                  <p>Danh sách các căn nhà được thêm gần đây</p>
                </CardHeader>
                <CardContent>
                  {houses.slice(0, 3).map((house) => (
                    <HouseItem key={house.id}>
                      <img
                        src={house.image || "/placeholder.svg"}
                        alt={house.title}
                      />
                      <div className="house-info">
                        <h4>{house.title}</h4>
                        <p className="address">{house.address}</p>
                        <p className="price">
                          {formatPrice(house.price)}/tháng
                        </p>
                      </div>
                      <Badge className={getStatusBadge(house.status).className}>
                        {getStatusBadge(house.status).label}
                      </Badge>
                    </HouseItem>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "users" && <UserManagement />}

          {activeTab === "houses" && (
            <div>
              <SearchContainer>
                <div className="search-input">
                  <Search />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="available">Có sẵn</option>
                  <option value="rented">Đã thuê</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
              </SearchContainer>

              <Card>
                <Table>
                  <thead>
                    <tr>
                      <th>Nhà</th>
                      <th>Địa chỉ</th>
                      <th>Giá thuê</th>
                      <th>Loại</th>
                      <th>Trạng thái</th>
                      <th>Thông tin</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHouses.map((house) => (
                      <tr key={house.id}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                            }}
                          >
                            <img
                              src={house.image || "/placeholder.svg"}
                              alt={house.title}
                              style={{
                                width: "3rem",
                                height: "3rem",
                                borderRadius: "0.5rem",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: "600" }}>
                                {house.title}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#718096",
                                }}
                              >
                                ID: {house.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{house.address}</td>
                        <td style={{ fontWeight: "600", color: "#38a169" }}>
                          {formatPrice(house.price)}
                        </td>
                        <td style={{ textTransform: "capitalize" }}>
                          {house.type}
                        </td>
                        <td>
                          <Badge
                            className={getStatusBadge(house.status).className}
                          >
                            {getStatusBadge(house.status).label}
                          </Badge>
                        </td>
                        <td>
                          <div style={{ fontSize: "0.875rem" }}>
                            <div>
                              {house.bedrooms} PN • {house.bathrooms} WC
                            </div>
                            <div>{house.area}m²</div>
                          </div>
                        </td>
                        <td>
                          <Button className="ghost">
                            <MoreHorizontal />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </div>
          )}

          {(activeTab === "tenants" ||
            activeTab === "contracts" ||
            activeTab === "revenue" ||
            activeTab === "settings") && (
            <Card>
              <CardHeader>
                <h3>Đang phát triển</h3>
                <p>
                  Tính năng{" "}
                  {sidebarItems.find((item) => item.id === activeTab)?.label}{" "}
                  đang được phát triển
                </p>
              </CardHeader>
              <CardContent>
                <p style={{ color: "#718096" }}>
                  Tính năng này sẽ được cập nhật trong phiên bản tiếp theo.
                </p>
              </CardContent>
            </Card>
          )}
        </Main>
      </MainContent>
      
      {/* Logout Confirmation Dialog */}
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

export default AdminDashboard;
