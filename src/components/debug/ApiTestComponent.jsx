import React, { useState } from 'react';
import styled from 'styled-components';
import { TestTube, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { publicApiClient } from '../../api/apiClient';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const TestSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f9fafb;
`;

const TestTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const Result = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  font-family: monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
`;

const SuccessResult = styled(Result)`
  background: #d1fae5;
  border: 1px solid #a7f3d0;
  color: #065f46;
`;

const ErrorResult = styled(Result)`
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #991b1b;
`;

const InfoResult = styled(Result)`
  background: #dbeafe;
  border: 1px solid #93c5fd;
  color: #1e40af;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const SuccessBadge = styled(StatusBadge)`
  background: #d1fae5;
  color: #065f46;
`;

const ErrorBadge = styled(StatusBadge)`
  background: #fee2e2;
  color: #991b1b;
`;

const PendingBadge = styled(StatusBadge)`
  background: #fef3c7;
  color: #92400e;
`;

const ApiTestComponent = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const runTest = async (testName, testFunction) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    setResults(prev => ({ ...prev, [testName]: null }));

    try {
      const result = await testFunction();
      setResults(prev => ({ 
        ...prev, 
        [testName]: { type: 'success', data: result } 
      }));
    } catch (error) {
      console.error(`${testName} test error:`, error);
      setResults(prev => ({ 
        ...prev, 
        [testName]: { type: 'error', error } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const testApiConnection = async () => {
    console.log('Testing API connection...');
    const response = await publicApiClient.get('/houses');
    console.log('API connection test response:', response);
    return response.data;
  };

  const testReviewsEndpoint = async () => {
    console.log('Testing reviews endpoint...');
    const response = await publicApiClient.get('/reviews');
    console.log('Reviews endpoint test response:', response);
    return response.data;
  };

  const testCreateReview = async () => {
    console.log('Testing create review...');
    const testData = {
      reviewerId: 1,
      houseId: 14,
      rating: 5,
      comment: 'Test review from API test component'
    };
    
    console.log('Test data:', testData);
    const response = await publicApiClient.post('/reviews', testData);
    console.log('Create review test response:', response);
    return response.data;
  };

  const testAuthStatus = async () => {
    console.log('Testing auth status...');
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    
    if (!token) {
      throw new Error('No token found');
    }
    
    // Test với một endpoint cần auth
    const response = await publicApiClient.get('/users/profile');
    console.log('Auth test response:', response);
    return response.data;
  };

  const renderResult = (testName) => {
    const result = results[testName];
    if (!result) return null;

    if (result.type === 'success') {
      return (
        <SuccessResult>
          <strong>✅ Test thành công!</strong>
          {'\n\n'}
          Response Data:
          {'\n'}
          {JSON.stringify(result.data, null, 2)}
        </SuccessResult>
      );
    }

    if (result.type === 'error') {
      return (
        <ErrorResult>
          <strong>❌ Test thất bại!</strong>
          {'\n\n'}
          Error Details:
          {'\n'}
          Message: {result.error.message}
          {'\n'}
          Status: {result.error.response?.status || 'N/A'}
          {'\n'}
          Response Data: {JSON.stringify(result.error.response?.data, null, 2)}
          {'\n\n'}
          Request Config: {JSON.stringify(result.error.config, null, 2)}
        </ErrorResult>
      );
    }

    return null;
  };

  const getStatusBadge = (testName) => {
    const result = results[testName];
    if (!result) {
      return <PendingBadge>⏳ Chưa test</PendingBadge>;
    }
    
    if (result.type === 'success') {
      return <SuccessBadge>✅ Thành công</SuccessBadge>;
    }
    
    if (result.type === 'error') {
      return <ErrorBadge>❌ Thất bại</ErrorBadge>;
    }
    
    return null;
  };

  return (
    <Container>
      <Title>
        <TestTube size={24} />
        API Test Component
      </Title>

      <TestSection>
        <TestTitle>
          <AlertCircle size={20} />
          Test kết nối API cơ bản
          {getStatusBadge('apiConnection')}
        </TestTitle>
        <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
          Kiểm tra xem API có hoạt động không
        </p>
        <Button 
          onClick={() => runTest('apiConnection', testApiConnection)}
          disabled={loading.apiConnection}
        >
          {loading.apiConnection ? 'Đang test...' : 'Test API Connection'}
        </Button>
        {renderResult('apiConnection')}
      </TestSection>

      <TestSection>
        <TestTitle>
          <AlertCircle size={20} />
          Test Reviews Endpoint
          {getStatusBadge('reviewsEndpoint')}
        </TestTitle>
        <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
          Kiểm tra endpoint /reviews có hoạt động không
        </p>
        <Button 
          onClick={() => runTest('reviewsEndpoint', testReviewsEndpoint)}
          disabled={loading.reviewsEndpoint}
        >
          {loading.reviewsEndpoint ? 'Đang test...' : 'Test Reviews Endpoint'}
        </Button>
        {renderResult('reviewsEndpoint')}
      </TestSection>

      <TestSection>
        <TestTitle>
          <AlertCircle size={20} />
          Test Create Review
          {getStatusBadge('createReview')}
        </TestTitle>
        <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
          Kiểm tra tạo review có hoạt động không
        </p>
        <Button 
          onClick={() => runTest('createReview', testCreateReview)}
          disabled={loading.createReview}
        >
          {loading.createReview ? 'Đang test...' : 'Test Create Review'}
        </Button>
        {renderResult('createReview')}
      </TestSection>

      <TestSection>
        <TestTitle>
          <AlertCircle size={20} />
          Test Authentication Status
          {getStatusBadge('authStatus')}
        </TestTitle>
        <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
          Kiểm tra trạng thái authentication
        </p>
        <Button 
          onClick={() => runTest('authStatus', testAuthStatus)}
          disabled={loading.authStatus}
        >
          {loading.authStatus ? 'Đang test...' : 'Test Auth Status'}
        </Button>
        {renderResult('authStatus')}
      </TestSection>

      <InfoResult style={{ marginTop: '2rem' }}>
        <strong>Debug Info:</strong>
        {'\n'}
        API Base URL: {import.meta.env.VITE_API_URL || 'http://localhost:8080'}
        {'\n'}
        API Prefix: {import.meta.env.VITE_API_PREFIX || '/api'}
        {'\n'}
        Token: {localStorage.getItem('token') ? '✅ Có token' : '❌ Không có token'}
        {'\n'}
        Token Value: {localStorage.getItem('token') ? localStorage.getItem('token').substring(0, 20) + '...' : 'N/A'}
      </InfoResult>
    </Container>
  );
};

export default ApiTestComponent;
