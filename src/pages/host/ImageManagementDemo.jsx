import React, { useState } from 'react';
import SimpleImageManager from '../../components/host/SimpleImageManager';

const ImageManagementDemo = () => {
  const [houseId] = useState(1); // Demo house ID

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demo Quản lý Ảnh Nhà
          </h1>
          <p className="text-gray-600 mb-8">
            Trang demo để test chức năng quản lý ảnh nhà với các tính năng:
            thêm ảnh mới, xóa ảnh, sắp xếp lại thứ tự ảnh.
          </p>
          
          <div className="border-t pt-8">
            <SimpleImageManager 
              houseId={houseId}
              onImagesChange={(newImages) => {
                console.log('Images changed:', newImages);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageManagementDemo;
