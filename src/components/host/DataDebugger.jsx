import React from 'react';

const DataDebugger = ({ house }) => {
  if (!house) return null;

  const analyzeImageUrls = (imageUrls) => {
    if (!imageUrls || !Array.isArray(imageUrls)) {
      return { valid: 0, null: 0, undefined: 0, empty: 0, total: 0 };
    }

    const nullCount = imageUrls.filter(item => item === null).length;
    const undefinedCount = imageUrls.filter(item => item === undefined).length;
    const emptyStringCount = imageUrls.filter(item => item === '').length;
    const validCount = imageUrls.filter(item => 
      item && typeof item === 'string' && item.trim() !== ''
    ).length;

    return {
      valid: validCount,
      null: nullCount,
      undefined: undefinedCount,
      empty: emptyStringCount,
      total: imageUrls.length
    };
  };

  const analysis = analyzeImageUrls(house.imageUrls);

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg max-w-md z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="text-xs space-y-1">
        <div><strong>ID:</strong> {house.id}</div>
        <div><strong>Title:</strong> {house.title}</div>
        <div><strong>imageUrls type:</strong> {typeof house.imageUrls}</div>
        <div><strong>Total elements:</strong> {analysis.total}</div>
        <div><strong>Valid URLs:</strong> {analysis.valid}</div>
        <div><strong>Null elements:</strong> {analysis.null}</div>
        <div><strong>Undefined:</strong> {analysis.undefined}</div>
        <div><strong>Empty strings:</strong> {analysis.empty}</div>
        <div><strong>First 3 URLs:</strong></div>
        {house.imageUrls?.slice(0, 3).map((url, index) => (
          <div key={index} className="ml-2 text-yellow-300">
            {index + 1}: {url ? (url.length > 50 ? url.substring(0, 50) + '...' : url) : 'null/undefined'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataDebugger;
