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
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import UserManagement from "./UserManagement";
import styles from "./AdminDashboard.module.css";

// --- Dữ liệu mẫu (Được khôi phục để component hoạt động) ---
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
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=tinysrgb&w=600",
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
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=tinysrgb&w=600",
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
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=tinysrgb&w=600",
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

  // LỖI ĐÃ ĐƯỢC SỬA Ở ĐÂY: Khôi phục lại logic filter đầy đủ
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div
          className={`p-6 border-b border-gray-200 text-white ${styles.sidebarHeader}`}
        >
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm opacity-90">Hệ thống quản lý thuê nhà</p>
        </div>

        <nav className="flex-1 py-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`${styles.navItem} ${
                  activeTab === item.id ? styles.active : ""
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
              {currentUser?.email?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">
                {currentUser?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500">{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {sidebarItems.find((item) => item.id === activeTab)?.label}
            </h2>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Filter size={16} /> Lọc
              </button>
              <button className="px-4 py-2 bg-blue-600 border border-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus size={16} /> Thêm mới
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Grid Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Các card thống kê */}
                <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-gray-500">
                      Tổng số nhà
                    </span>
                    <div className={`${styles.statIcon} ${styles.total}`}>
                      <Home size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {mockStats.totalHouses}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    +2 từ tháng trước
                  </p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-gray-500">
                      Nhà có sẵn
                    </span>
                    <div className={`${styles.statIcon} ${styles.available}`}>
                      <Home size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {mockStats.availableHouses}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">72% tổng số nhà</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-gray-500">
                      Đã cho thuê
                    </span>
                    <div className={`${styles.statIcon} ${styles.rented}`}>
                      <Users size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {mockStats.rentedHouses}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {mockStats.totalTenants} khách thuê
                  </p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-gray-500">
                      Doanh thu tháng
                    </span>
                    <div className={`${styles.statIcon} ${styles.revenue}`}>
                      <DollarSign size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {formatPrice(mockStats.monthlyRevenue)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    +12% từ tháng trước
                  </p>
                </div>
              </div>

              {/* Card Nhà mới nhất */}
              <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-5 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800">
                    Nhà mới nhất
                  </h3>
                  <p className="text-sm text-gray-500">
                    Danh sách các căn nhà được thêm gần đây
                  </p>
                </div>
                <div className="p-5 space-y-4">
                  {houses.slice(0, 3).map((house) => (
                    <div key={house.id} className="flex items-center gap-4">
                      <img
                        src={house.image}
                        alt={house.title}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {house.title}
                        </h4>
                        <p className="text-sm text-gray-500">{house.address}</p>
                        <p className="text-sm font-semibold text-green-600">
                          {formatPrice(house.price)}/tháng
                        </p>
                      </div>
                      <span
                        className={`${styles.badge} ${
                          styles[getStatusBadge(house.status).className]
                        }`}
                      >
                        {getStatusBadge(house.status).label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && <UserManagement />}

          {activeTab === "houses" && (
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="available">Có sẵn</option>
                  <option value="rented">Đã thuê</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Nhà</th>
                      <th className="px-6 py-3">Giá thuê</th>
                      <th className="px-6 py-3">Thông tin</th>
                      <th className="px-6 py-3">Trạng thái</th>
                      <th className="px-6 py-3">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHouses.map((house) => (
                      <tr
                        key={house.id}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              src={house.image}
                              alt={house.title}
                              className="w-12 h-12 rounded-md object-cover"
                            />
                            <div>
                              <div className="font-semibold">{house.title}</div>
                              <div className="text-xs text-gray-500">
                                {house.address}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-green-600">
                          {formatPrice(house.price)}
                        </td>
                        <td className="px-6 py-4 text-xs">
                          {house.bedrooms} PN • {house.bathrooms} WC •{" "}
                          {house.area}m²
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`${styles.badge} ${
                              styles[getStatusBadge(house.status).className]
                            }`}
                          >
                            {getStatusBadge(house.status).label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
                            <MoreHorizontal size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
