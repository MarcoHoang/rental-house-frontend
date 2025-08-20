import React, { useState, useEffect } from 'react';
import { getImageUrl, preloadImage } from '../../utils/imageHelper';

const ImageTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const testImages = [
    'http://localhost:8080/api/files/house-image/d0167d37-4922-446f-a5f9-5625ae69315d.jpg',
    'http://localhost:8080/api/files/house-image/84673483-3095-43fa-a853-02c094794be4.jpg',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ];

  const testImageLoad = async () => {
    setLoading(true);
    const results = [];

    for (const imageUrl of testImages) {
      try {
        console.log('Testing image:', imageUrl);
        const success = await preloadImage(imageUrl);
        results.push({
          url: imageUrl,
          success,
          timestamp: new Date().toISOString()
        });
        console.log('Test result:', success ? 'SUCCESS' : 'FAILED', imageUrl);
      } catch (error) {
        console.error('Test error for:', imageUrl, error);
        results.push({
          url: imageUrl,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    testImageLoad();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Image Load Test</h1>
      
      <button 
        onClick={testImageLoad}
        disabled={loading}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Images'}
      </button>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div 
            key={index}
            className={`p-4 rounded border ${
              result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${
                result.success ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <div className="flex-1">
                <p className="font-mono text-sm break-all">{result.url}</p>
                <p className="text-sm text-gray-600">
                  {result.success ? '✅ Loaded successfully' : '❌ Failed to load'}
                  {result.error && ` - ${result.error}`}
                </p>
                <p className="text-xs text-gray-500">{result.timestamp}</p>
              </div>
            </div>
            
            {result.success && (
              <div className="mt-2">
                <img 
                  src={result.url} 
                  alt="Test" 
                  className="w-32 h-24 object-cover rounded border"
                  onError={(e) => {
                    console.error('Image display error:', result.url);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Summary:</h2>
        <p>Total tested: {testResults.length}</p>
        <p>Successful: {testResults.filter(r => r.success).length}</p>
        <p>Failed: {testResults.filter(r => !r.success).length}</p>
      </div>
    </div>
  );
};

export default ImageTest;
