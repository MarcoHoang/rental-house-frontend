import React, { useState } from 'react';
import styled from 'styled-components';
import HostRegistrationForm from '../components/host/HostRegistrationForm';
import HostApplicationStatus from '../components/host/HostApplicationStatus';
import hostApi from '../api/hostApi';
import { useToast } from '../components/common/Toast';

const TestContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
`;

const TestSection = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const TestTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
`;

const TestButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 1rem;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: #4338ca;
  }
  
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const InfoBox = styled.div`
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const HostApplicationTestPage = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const { showSuccess, showError } = useToast();

  const handleSubmitApplication = async (formData) => {
    try {
      console.log('TestPage - Submitting application with data:', formData);
      
      const result = await hostApi.submitHostApplication(formData);
      
      console.log('TestPage - Application submitted successfully:', result);
      
      showSuccess('Thành công!', 'Đơn đăng ký đã được gửi thành công');
      
      setTestResults(prev => [...prev, {
        type: 'success',
        message: 'Đơn đăng ký đã được gửi thành công',
        timestamp: new Date().toLocaleString('vi-VN'),
        data: result
      }]);
      
      setShowRegistrationForm(false);
    } catch (error) {
      console.error('TestPage - Error submitting application:', error);
      
      showError('Lỗi!', error.message || 'Có lỗi xảy ra khi gửi đơn đăng ký');
      
      setTestResults(prev => [...prev, {
        type: 'error',
        message: error.message || 'Có lỗi xảy ra khi gửi đơn đăng ký',
        timestamp: new Date().toLocaleString('vi-VN'),
        error: error
      }]);
    }
  };

  const testGetMyApplication = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        showError('Lỗi!', 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập trước.');
        return;
      }
      
      const application = await hostApi.getMyApplication(user.id);
      
      console.log('TestPage - Retrieved application:', application);
      
      showSuccess('Thành công!', 'Đã lấy thông tin đơn đăng ký thành công');
      
      setTestResults(prev => [...prev, {
        type: 'success',
        message: 'Đã lấy thông tin đơn đăng ký thành công',
        timestamp: new Date().toLocaleString('vi-VN'),
        data: application
      }]);
    } catch (error) {
      console.error('TestPage - Error getting application:', error);
      
      showError('Lỗi!', error.message || 'Có lỗi xảy ra khi lấy thông tin đơn đăng ký');
      
      setTestResults(prev => [...prev, {
        type: 'error',
        message: error.message || 'Có lỗi xảy ra khi lấy thông tin đơn đăng ký',
        timestamp: new Date().toLocaleString('vi-VN'),
        error: error
      }]);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  return (
    <TestContainer>
      <TestTitle>Test Page - Đơn đăng ký làm chủ nhà</TestTitle>
      
      <InfoBox>
        <h3>Hướng dẫn sử dụng:</h3>
        <ul>
          <li>Đảm bảo đã đăng nhập với tài khoản user thường</li>
          <li>Click "Gửi đơn đăng ký" để mở form đăng ký</li>
          <li>Điền thông tin và gửi đơn</li>
          <li>Kiểm tra trạng thái đơn đăng ký bên dưới</li>
          <li>Admin có thể duyệt/từ chối đơn trong Admin Panel</li>
        </ul>
      </InfoBox>

      <TestSection>
        <TestTitle>Thao tác</TestTitle>
        <TestButton onClick={() => setShowRegistrationForm(true)}>
          Gửi đơn đăng ký làm chủ nhà
        </TestButton>
        <TestButton onClick={testGetMyApplication}>
          Lấy thông tin đơn đăng ký của tôi
        </TestButton>
        <TestButton onClick={clearTestResults} style={{ backgroundColor: '#6b7280' }}>
          Xóa kết quả test
        </TestButton>
      </TestSection>

      <TestSection>
        <TestTitle>Trạng thái đơn đăng ký</TestTitle>
        <HostApplicationStatus />
      </TestSection>

      <TestSection>
        <TestTitle>Kết quả test</TestTitle>
        {testResults.length === 0 ? (
          <p style={{ color: '#6b7280' }}>Chưa có kết quả test nào</p>
        ) : (
          <div>
            {testResults.map((result, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  borderRadius: '0.375rem',
                  backgroundColor: result.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${result.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                  color: result.type === 'success' ? '#166534' : '#991b1b'
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                  {result.type === 'success' ? '✅ Thành công' : '❌ Lỗi'}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>{result.message}</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  {result.timestamp}
                </div>
                {result.data && (
                  <details style={{ marginTop: '0.5rem' }}>
                    <summary style={{ cursor: 'pointer', fontSize: '0.875rem' }}>
                      Xem chi tiết
                    </summary>
                    <pre style={{ 
                      marginTop: '0.5rem', 
                      fontSize: '0.75rem', 
                      backgroundColor: '#f3f4f6', 
                      padding: '0.5rem', 
                      borderRadius: '0.25rem',
                      overflow: 'auto'
                    }}>
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </TestSection>

      <HostRegistrationForm
        isOpen={showRegistrationForm}
        onClose={() => setShowRegistrationForm(false)}
        onSubmit={handleSubmitApplication}
      />
    </TestContainer>
  );
};

export default HostApplicationTestPage;
