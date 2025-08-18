import React, { useState } from 'react';
import EditHouseModal from '../../components/host/EditHouseModal';

const EditHouseDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock data cho nhà có ảnh
  const mockHouse = {
    id: 1,
    title: 'Nhà cho thuê đẹp tại quận 1',
    description: 'Nhà cho thuê với đầy đủ tiện nghi, gần trung tâm thành phố, thuận tiện di chuyển.',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    price: 15000000,
    area: 80,
    houseType: 'APARTMENT',
    status: 'AVAILABLE',
    imageUrls: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560448204-6031743b9d0b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560448204-5c9a0c9a0c9a?w=500&h=300&fit=crop'
    ]
  };

  // Mock data cho nhà không có ảnh
  const mockHouseNoImages = {
    id: 2,
    title: 'Nhà cho thuê mới tại quận 7',
    description: 'Nhà cho thuê mới xây, thiết kế hiện đại, phù hợp cho gia đình.',
    address: '456 Nguyễn Thị Thập, Quận 7, TP.HCM',
    price: 12000000,
    area: 100,
    houseType: 'VILLA',
    status: 'AVAILABLE',
    imageUrls: []
  };

  const [selectedHouse, setSelectedHouse] = useState(mockHouse);

  const handleHouseUpdated = (updatedHouse) => {
    console.log('House updated:', updatedHouse);
    setSelectedHouse(updatedHouse);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demo EditHouseModal
          </h1>
          <p className="text-gray-600 mb-8">
            Trang demo để test EditHouseModal với các trường hợp khác nhau về ảnh.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Nhà có ảnh */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Nhà có ảnh</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Tiêu đề:</strong> {mockHouse.title}</p>
                <p><strong>Địa chỉ:</strong> {mockHouse.address}</p>
                <p><strong>Số ảnh:</strong> {mockHouse.imageUrls.length}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedHouse(mockHouse);
                  setIsModalOpen(true);
                }}
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Chỉnh sửa nhà có ảnh
              </button>
            </div>

            {/* Nhà không có ảnh */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Nhà không có ảnh</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Tiêu đề:</strong> {mockHouseNoImages.title}</p>
                <p><strong>Địa chỉ:</strong> {mockHouseNoImages.address}</p>
                <p><strong>Số ảnh:</strong> {mockHouseNoImages.imageUrls.length}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedHouse(mockHouseNoImages);
                  setIsModalOpen(true);
                }}
                className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Chỉnh sửa nhà không có ảnh
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Hướng dẫn sử dụng</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Click vào một trong hai nút trên để mở modal chỉnh sửa nhà</li>
                <li>Trong tab "Thông tin cơ bản", bạn sẽ thấy ảnh hiện tại của nhà (nếu có)</li>
                <li>Chuyển sang tab "Quản lý ảnh" để thêm, xóa hoặc sắp xếp lại ảnh</li>
                <li>Mọi thay đổi sẽ được cập nhật real-time</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* EditHouseModal */}
      <EditHouseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        house={selectedHouse}
        onHouseUpdated={handleHouseUpdated}
      />
    </div>
  );
};

export default EditHouseDemo;
