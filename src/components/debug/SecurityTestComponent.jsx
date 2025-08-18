import React, { useState } from 'react';
import axios from 'axios';

const SecurityTestComponent = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:8080/api';

  const testEndpoint = async (name, url, options = {}) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const config = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers
        }
      };

      const response = await axios(url, config);
      setResults(prev => ({
        ...prev,
        [name]: {
          success: true,
          status: response.status,
          data: response.data
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: {
          success: false,
          status: error.response?.status,
          error: error.response?.data || error.message
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setResults({});
    
    // Test public endpoints (no auth required)
    await testEndpoint('Public Test Endpoint', `${API_BASE}/test/public`);
    await testEndpoint('Public House List', `${API_BASE}/houses`);
    await testEndpoint('Public House Detail', `${API_BASE}/houses/public/1`);
    
    // Test authenticated endpoints
    await testEndpoint('Auth Status', `${API_BASE}/test/auth-status`);
    await testEndpoint('Authenticated Test', `${API_BASE}/test/authenticated`);
    await testEndpoint('Authenticated House Detail', `${API_BASE}/houses/1`);
    
    // Test host-specific endpoints
    await testEndpoint('My Houses (Host)', `${API_BASE}/houses/my-houses`);
  };

  const ResultItem = ({ name, result }) => (
    <div style={{ 
      margin: '10px 0', 
      padding: '10px', 
      border: '1px solid #ddd', 
      borderRadius: '4px',
      backgroundColor: result?.success ? '#f0f9ff' : '#fef2f2'
    }}>
      <h4>{name}</h4>
      {result ? (
        <div>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Success:</strong> {result.success ? '✅' : '❌'}</p>
          {result.success ? (
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(result.data, null, 2)}
            </pre>
          ) : (
            <pre style={{ fontSize: '12px', color: 'red', overflow: 'auto' }}>
              {JSON.stringify(result.error, null, 2)}
            </pre>
          )}
        </div>
      ) : (
        <p>Not tested yet</p>
      )}
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Security Test Component</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runAllTests}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Run All Tests'}
        </button>
        
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          <p><strong>Token:</strong> {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}</p>
          <p><strong>User:</strong> {localStorage.getItem('user') ? '✅ Logged in' : '❌ Not logged in'}</p>
        </div>
      </div>

      <div>
        <h3>Test Results:</h3>
        <ResultItem name="Public Test Endpoint" result={results['Public Test Endpoint']} />
        <ResultItem name="Public House List" result={results['Public House List']} />
        <ResultItem name="Public House Detail" result={results['Public House Detail']} />
        <ResultItem name="Auth Status" result={results['Auth Status']} />
        <ResultItem name="Authenticated Test" result={results['Authenticated Test']} />
        <ResultItem name="Authenticated House Detail" result={results['Authenticated House Detail']} />
        <ResultItem name="My Houses (Host)" result={results['My Houses (Host)']} />
      </div>
    </div>
  );
};

export default SecurityTestComponent;
