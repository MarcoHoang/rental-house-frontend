import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import RentHouseModal from '../components/house/RentHouseModal';
import { fixAuthData, forceClearAuth, debugLocalStorage, createMockUser } from '../utils/fixAuth';

const TestRentPage = () => {
  const { user, refreshUserData } = useAuthContext();
  const [showRentModal, setShowRentModal] = useState(false);

  const handleRefreshUser = async () => {
    console.log('=== REFRESHING USER DATA ===');
    const result = await refreshUserData();
    console.log('Refresh result:', result);
    if (result.success) {
      alert('✅ User data refreshed successfully!');
      window.location.reload(); // Reload để cập nhật UI
    } else {
      alert('❌ Failed to refresh user data: ' + result.error);
    }
  };

  // Mock house data for testing
  const mockHouse = {
    id: 1,
    title: "Nhà test để thuê",
    address: "123 Đường Test, Quận 1, TP.HCM",
    price: 15000000,
    pricePerDay: 500000,
    area: 100,
    houseType: "APARTMENT",
    status: "AVAILABLE",
    hostId: 2,
    hostName: "Chủ nhà Test",
    imageUrls: ["https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Test+House"]
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 Test Page - Nút Thuê Nhà</h1>
      
      <div style={{ 
        marginBottom: '2rem', 
        padding: '1rem',
        backgroundColor: '#f0f9ff',
        border: '1px solid #0ea5e9',
        borderRadius: '0.5rem'
      }}>
        <h3>🔍 Debug Information:</h3>
        <p><strong>User exists:</strong> {user ? '✅' : '❌'}</p>
        <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
        <p><strong>User Email:</strong> {user?.email || 'N/A'}</p>
        <p><strong>User Role:</strong> {user?.roleName || user?.role || 'N/A'}</p>
        <p><strong>Token exists:</strong> {localStorage.getItem('token') ? '✅' : '❌'}</p>
      </div>

      <div style={{ 
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem'
      }}>
        <h3>🏠 Mock House Data:</h3>
        <p><strong>Title:</strong> {mockHouse.title}</p>
        <p><strong>Address:</strong> {mockHouse.address}</p>
        <p><strong>Price:</strong> {mockHouse.price?.toLocaleString()} VNĐ/tháng</p>
        <p><strong>Price per day:</strong> {mockHouse.pricePerDay?.toLocaleString()} VNĐ/ngày</p>
        <p><strong>Status:</strong> {mockHouse.status}</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>🎯 Test Buttons:</h3>
        
        {user ? (
          <button
            onClick={() => {
              console.log('Test rent button clicked!');
              console.log('User:', user);
              console.log('House:', mockHouse);
              setShowRentModal(true);
            }}
            style={{
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginRight: '1rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🏠 Test Thuê Nhà
          </button>
        ) : (
          <div style={{
            padding: '1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            color: '#dc2626'
          }}>
            ❌ Bạn cần đăng nhập để test nút thuê nhà
          </div>
        )}

        <button
          onClick={() => {
            console.log('=== CLEAR AUTH DATA ===');
            localStorage.clear();
            console.log('Auth data cleared');
            window.location.reload();
          }}
          style={{
            padding: '0.5rem 1rem',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          🗑️ Clear Auth Data
        </button>

        <button
          onClick={handleRefreshUser}
          style={{
            padding: '0.5rem 1rem',
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            marginLeft: '1rem'
          }}
        >
          🔄 Refresh User Data
        </button>

        <button
          onClick={() => {
            const result = fixAuthData();
            alert(result.success ? '✅ Auth data fixed!' : '❌ ' + result.error);
          }}
          style={{
            padding: '0.5rem 1rem',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            marginLeft: '1rem'
          }}
        >
          🔧 Fix Auth Data
        </button>

        <button
          onClick={() => {
            debugLocalStorage();
            alert('Check console for localStorage debug info');
          }}
          style={{
            padding: '0.5rem 1rem',
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            marginLeft: '1rem'
          }}
        >
          🔍 Debug localStorage
        </button>

        <button
          onClick={() => {
            createMockUser();
            alert('Mock user created! Reload page to see changes.');
          }}
          style={{
            padding: '0.5rem 1rem',
            background: '#06b6d4',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            marginLeft: '1rem'
          }}
        >
          🎭 Create Mock User
        </button>
      </div>

      <div style={{ 
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '0.5rem'
      }}>
        <h3>📋 Instructions:</h3>
        <ol style={{ marginLeft: '1.5rem' }}>
          <li>Đăng nhập vào hệ thống</li>
          <li>Quay lại trang này</li>
          <li>Kiểm tra debug information</li>
          <li>Click nút "Test Thuê Nhà"</li>
          <li>Kiểm tra console logs</li>
          <li>Modal thuê nhà sẽ hiện ra</li>
        </ol>
      </div>

      {/* RentHouseModal */}
      <RentHouseModal
        isOpen={showRentModal}
        onClose={() => setShowRentModal(false)}
        house={mockHouse}
        onSuccess={(rentalData) => {
          console.log('✅ Rental created successfully:', rentalData);
          alert('🎉 Đơn thuê nhà đã được tạo thành công!');
          setShowRentModal(false);
        }}
      />
    </div>
  );
};

export default TestRentPage; 