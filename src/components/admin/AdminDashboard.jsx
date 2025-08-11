// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  DollarSign,
  Settings,
  LogOut,
  Plus,
  Filter,
} from "lucide-react";

// <<< THAY ĐỔI 1: Import file CSS vừa tạo
import "./AdminDashboard.css";
import HouseManagement from "./HouseManagement";
import UserManagement from "./UserManagement";

// Dữ liệu giả cho trang tổng quan
const mockStats = {
  totalHouses: 25,
  availableHouses: 18,
  rentedHouses: 5,
  maintenanceHouses: 2,
  monthlyRevenue: 180000000,
  totalTenants: 15,
};

const mockRecentHouses = [
  {
    id: 1,
    title: "Villa 2 tầng gần biển",
    address: "123 Đường Biển, Đà Nẵng",
    price: 15000000,
    status: "available",
    image: "/placeholder.svg?height=64&width=64&text=Villa",
  },
  {
    id: 2,
    title: "Căn hộ cao cấp trung tâm",
    address: "456 Lê Lợi, TP.HCM",
    price: 12000000,
    status: "rented",
    image: "/placeholder.svg?height=64&width=64&text=Apartment",
  },
  {
    id: 3,
    title: "Nhà phố 3 tầng",
    address: "789 Nguyễn Huệ, Hà Nội",
    price: 20000000,
    status: "maintenance",
    image: "/placeholder.svg?height=64&width=64&text=House",
  },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const adminData = localStorage.getItem("adminUser");
    if (adminData) {
      setCurrentUser(JSON.parse(adminData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  // Helper functions
  const getStatusBadgeClass = (status) => {
    const statusMap = {
      available: "available",
      rented: "rented",
      maintenance: "maintenance",
    };
    return statusMap[status] || "available";
  };
  const getStatusLabel = (status) => {
    const statusMap = {
      available: "Có sẵn",
      rented: "Đã thuê",
      maintenance: "Bảo trì",
    };
    return statusMap[status] || "N/A";
  };
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const sidebarItems = [
    { id: "dashboard", label: "Tổng quan", icon: Home },
    { id: "houses", label: "Quản lý nhà", icon: Home },
    { id: "users", label: "Quản lý User", icon: Users },
    { id: "tenants", label: "Khách thuê", icon: Users },
    { id: "contracts", label: "Hợp đồng", icon: FileText },
    { id: "revenue", label: "Doanh thu", icon: DollarSign },
    { id: "settings", label: "Cài đặt", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      case "houses":
        return <HouseManagement />; // <<< Sử dụng component đã hoàn thiện
      case "users":
        return <UserManagement />;
      default:
        return <ComingSoonContent />;
    }
  };

  const DashboardContent = () => (
    <div>
      <div className="stats-grid">
        <StatCard
          title="Tổng số nhà"
          value={mockStats.totalHouses}
          change="+2 từ tháng trước"
          icon={<Home size={20} />}
          type="total"
        />
        <StatCard
          title="Nhà có sẵn"
          value={mockStats.availableHouses}
          change="72% tổng số nhà"
          icon={<Home size={20} />}
          type="available"
        />
        <StatCard
          title="Đã cho thuê"
          value={mockStats.rentedHouses}
          change={`${mockStats.totalTenants} khách thuê`}
          icon={<Users size={20} />}
          type="rented"
        />
        <StatCard
          title="Doanh thu tháng"
          value={formatPrice(mockStats.monthlyRevenue)}
          change="+12% từ tháng trước"
          icon={<DollarSign size={20} />}
          type="revenue"
        />
      </div>
      <div className="card">
        <div className="card-header">
          <h3>Nhà mới nhất</h3>
          <p>Danh sách các căn nhà được thêm gần đây</p>
        </div>
        <div className="card-content">
          {mockRecentHouses.map((house) => (
            <div key={house.id} className="house-item">
              <img src={house.image} alt={house.title} />
              <div className="house-info">
                <h4>{house.title}</h4>
                <p className="address">{house.address}</p>
                <p className="price">{formatPrice(house.price)}/tháng</p>
              </div>
              <span className={`badge ${getStatusBadgeClass(house.status)}`}>
                {getStatusLabel(house.status)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const StatCard = ({ title, value, change, icon, type }) => (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <div className={`stat-icon ${type}`}>{icon}</div>
      </div>
      <p className="stat-value">{value}</p>
      <p className="stat-change">{change}</p>
    </div>
  );

  const ComingSoonContent = () => {
    const currentItem = sidebarItems.find((item) => item.id === activeTab);
    return (
      <div className="card">
        <div className="card-header">
          <h3>Đang phát triển</h3>
          <p>Tính năng "{currentItem?.label}" đang được phát triển</p>
        </div>
        <div className="card-content">
          <p>Tính năng này sẽ được cập nhật trong phiên bản tiếp theo.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Admin Panel</h1>
          <p>Hệ thống quản lý thuê nhà</p>
        </div>
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="user-info">
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
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </div>

      <div className="main-content">
        <header className="main-content-header">
          <div className="header-content">
            <h2>{sidebarItems.find((item) => item.id === activeTab)?.label}</h2>
            <div className="header-actions">
              <button className="btn">
                <Filter />
                Lọc
              </button>
              <button className="btn primary">
                <Plus />
                Thêm mới
              </button>
            </div>
          </div>
        </header>
        <main>{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
