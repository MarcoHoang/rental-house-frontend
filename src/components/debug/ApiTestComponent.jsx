import React, { useState, useEffect } from 'react';
import { testApiConnection, testBackendHealth } from '../../utils/apiTest';

const ApiTestComponent = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    try {
      console.log('🧪 Starting API tests...');
      
      // Test 1: Backend health check
      const healthCheck = await testBackendHealth();
      console.log('🏥 Backend health check:', healthCheck);
      
      // Test 2: API connection
      const apiTest = await testApiConnection();
      console.log('🔌 API connection test:', apiTest);
      
      setTestResults({
        healthCheck,
        apiTest,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Test error:', error);
      setTestResults({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  if (loading) {
    return <div>🧪 Running API tests...</div>;
  }

  if (!testResults) {
    return <div>⏳ Waiting for test results...</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>🔧 API Test Results</h3>
      <p><strong>Timestamp:</strong> {testResults.timestamp}</p>
      
      {testResults.error ? (
        <div style={{ color: 'red' }}>
          <h4>❌ Test Error:</h4>
          <p>{testResults.error}</p>
        </div>
      ) : (
        <>
          <div>
            <h4>🏥 Backend Health Check:</h4>
            <p style={{ color: testResults.healthCheck ? 'green' : 'red' }}>
              {testResults.healthCheck ? '✅ Backend is running' : '❌ Backend is not accessible'}
            </p>
          </div>
          
          <div>
            <h4>🔌 API Connection Test:</h4>
            <p style={{ color: testResults.apiTest?.success ? 'green' : 'red' }}>
              {testResults.apiTest?.success ? '✅ API connection successful' : '❌ API connection failed'}
            </p>
            {testResults.apiTest?.status && (
              <p><strong>Status:</strong> {testResults.apiTest.status}</p>
            )}
            {testResults.apiTest?.data && (
              <div>
                <strong>Data:</strong>
                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                  {JSON.stringify(testResults.apiTest.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </>
      )}
      
      <button onClick={runTests} style={{ marginTop: '10px' }}>
        🔄 Run Tests Again
      </button>
    </div>
  );
};

export default ApiTestComponent;
