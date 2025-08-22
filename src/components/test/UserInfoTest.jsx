import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px;
  font-family: monospace;
`;

const UserInfoTest = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);
  const [backendInfo, setBackendInfo] = useState(null);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    
    setUserInfo(user);
    setAdminInfo(adminUser);

    // Gọi API để lấy thông tin từ backend
    const fetchBackendInfo = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/houses/test-current-user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setBackendInfo(data);
      } catch (error) {
        console.error('Error fetching backend info:', error);
        setBackendInfo({ error: error.message });
      }
    };

    fetchBackendInfo();
  }, []);

  return (
    <TestContainer>
      <h3>User Information Test</h3>
      
      <h4>User from localStorage:</h4>
      <pre>{JSON.stringify(userInfo, null, 2)}</pre>
      
      <h4>Admin User from localStorage:</h4>
      <pre>{JSON.stringify(adminInfo, null, 2)}</pre>
      
      <h4>Backend User Info:</h4>
      <pre>{JSON.stringify(backendInfo, null, 2)}</pre>
      
      <h4>Role Analysis:</h4>
      <div>
        <p>User roleName: {userInfo?.roleName || 'undefined'}</p>
        <p>User role: {userInfo?.role || 'undefined'}</p>
        <p>Admin role: {adminInfo?.role || 'undefined'}</p>
        <p>Admin roleName: {adminInfo?.roleName || 'undefined'}</p>
        <p>Is Host: {userInfo?.roleName === 'HOST' || userInfo?.role === 'HOST' ? 'YES' : 'NO'}</p>
        <p>Is Admin: {adminInfo?.role === 'ADMIN' || adminInfo?.roleName === 'ADMIN' || userInfo?.role === 'ADMIN' || userInfo?.roleName === 'ADMIN' ? 'YES' : 'NO'}</p>
      </div>
    </TestContainer>
  );
};

export default UserInfoTest;
