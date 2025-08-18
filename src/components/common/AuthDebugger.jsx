import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

const AuthDebugger = () => {
  const { user, isAuthenticated, isHost, isAdmin, isUser, loading } = useAuthContext();

  const handleDebugAuth = () => {
    console.log('=== MANUAL AUTH DEBUG ===');
    
    // Kiểm tra localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('localStorage token:', !!token);
    console.log('localStorage user:', userData);
    
    // Parse user data
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        console.log('Parsed user data:', parsed);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // AuthContext state
    console.log('AuthContext user:', user);
    console.log('AuthContext isAuthenticated:', isAuthenticated);
    console.log('AuthContext isHost:', isHost);
    console.log('AuthContext isAdmin:', isAdmin);
    console.log('AuthContext isUser:', isUser);
    console.log('AuthContext loading:', loading);
    
    console.log('=== END MANUAL AUTH DEBUG ===');
  };

  const handleForceRefresh = () => {
    console.log('Force refreshing authentication...');
    window.location.reload();
  };

  const handleClearAuth = () => {
    console.log('Clearing authentication data...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.reload();
  };

  // Chỉ hiển thị trong development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f0f0f0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Auth Debugger</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Status:</strong>
        <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
        <div>Host: {isHost ? '✅' : '❌'}</div>
        <div>Admin: {isAdmin ? '✅' : '❌'}</div>
        <div>User: {isUser ? '✅' : '❌'}</div>
        <div>Loading: {loading ? '⏳' : '✅'}</div>
      </div>
      
      {user && (
        <div style={{ marginBottom: '10px' }}>
          <strong>User Info:</strong>
          <div>ID: {user.id}</div>
          <div>Email: {user.email}</div>
          <div>Role: {user.roleName}</div>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        <button 
          onClick={handleDebugAuth}
          style={{
            padding: '5px 10px',
            fontSize: '10px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Debug
        </button>
        
        <button 
          onClick={handleForceRefresh}
          style={{
            padding: '5px 10px',
            fontSize: '10px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
        
        <button 
          onClick={handleClearAuth}
          style={{
            padding: '5px 10px',
            fontSize: '10px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Clear Auth
        </button>
      </div>
    </div>
  );
};

export default AuthDebugger; 