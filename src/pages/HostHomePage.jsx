import React from 'react';
import { Link } from 'react-router-dom';

const HostHomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Trang chủ dành cho chủ nhà</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Các card chức năng dành cho chủ nhà */}
        <Link 
          to="/post"
          className="p-6 border rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Đăng tin mới</h2>
          <p className="text-gray-600">Đăng bài cho thuê mới lên hệ thống</p>
        </Link>
        
        <Link 
          to="/host/properties"
          className="p-6 border rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Quản lý tin đăng</h2>
          <p className="text-gray-600">Xem và quản lý các tin đăng của bạn</p>
        </Link>
        
        <Link 
          to="/host/bookings"
          className="p-6 border rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Đơn đặt phòng</h2>
          <p className="text-gray-600">Xem và quản lý các đơn đặt phòng</p>
        </Link>
      </div>
    </div>
  );
};

export default HostHomePage;
