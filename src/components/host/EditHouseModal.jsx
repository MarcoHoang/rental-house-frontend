import React, { useState, useEffect } from 'react';
import { FiX, FiEdit3, FiImage } from 'react-icons/fi';
import { useToast } from '../common/Toast';
import houseApi from '../../api/houseApi';
import SimpleImageManager from './SimpleImageManager';
import { 
  HOUSE_TYPES, 
  HOUSE_STATUS, 
  HOUSE_TYPE_LABELS, 
  VALIDATION_RULES 
} from '../../utils/constants';

const EditHouseModal = ({ isOpen, onClose, house, onHouseUpdated }) => {
  const [activeTab, setActiveTab] = useState('details'); // 'details' hoặc 'images'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    price: '',
    area: '',
    houseType: HOUSE_TYPES.APARTMENT,
    status: HOUSE_STATUS.AVAILABLE,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (house) {
      setFormData({
        title: house.title || '',
        description: house.description || '',
        address: house.address || '',
        price: house.price?.toString() || '',
        area: house.area?.toString() || '',
        houseType: house.houseType || HOUSE_TYPES.APARTMENT,
        status: house.status || HOUSE_STATUS.AVAILABLE,
      });
    }
  }, [house]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }

    if (!formData.address?.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }

    if (!formData.area || parseFloat(formData.area) <= 0) {
      newErrors.price = 'Diện tích phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      
      const response = await houseApi.updateHouse(house.id, formData);
      
      if (response.success) {
        showSuccess('Thành công', 'Đã cập nhật thông tin nhà');
        if (onHouseUpdated) {
          onHouseUpdated(response.data);
        }
        onClose();
      }
    } catch (error) {
      console.error('Error updating house:', error);
      showError('Lỗi', 'Không thể cập nhật thông tin nhà');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagesChange = (newImages) => {
    // Callback khi ảnh thay đổi
    if (onHouseUpdated && house) {
      const updatedHouse = {
        ...house,
        imageUrls: newImages.map(img => img.imageUrl)
      };
      onHouseUpdated(updatedHouse);
    }
  };

  if (!isOpen || !house) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa nhà</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiEdit3 className="inline-block mr-2" />
            Thông tin cơ bản
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'images'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiImage className="inline-block mr-2" />
            Quản lý ảnh
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'details' ? (
            /* Tab thông tin cơ bản */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tiêu đề */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập tiêu đề nhà"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Mô tả */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Mô tả chi tiết về nhà"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Địa chỉ */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập địa chỉ nhà"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                {/* Giá */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá (VNĐ/tháng) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập giá thuê"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>

                {/* Diện tích */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diện tích (m²) *
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.area ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập diện tích"
                  />
                  {errors.area && (
                    <p className="mt-1 text-sm text-red-600">{errors.area}</p>
                  )}
                </div>

                {/* Loại nhà */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại nhà *
                  </label>
                  <select
                    name="houseType"
                    value={formData.houseType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(HOUSE_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(HOUSE_STATUS).map(([key, value]) => (
                      <option key={key} value={value}>
                        {key === 'AVAILABLE' ? 'Có sẵn' : 
                         key === 'RENTED' ? 'Đã thuê' : 'Không hoạt động'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hiển thị ảnh hiện tại của nhà */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Ảnh hiện tại của nhà</h3>
                  {house.imageUrls && house.imageUrls.length > 0 && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {house.imageUrls.length} ảnh
                    </span>
                  )}
                </div>
                
                {house.imageUrls && house.imageUrls.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {house.imageUrls.map((imageUrl, index) => (
                        <div key={index} className="relative bg-white rounded-lg shadow-sm border overflow-hidden group">
                          <img
                            src={imageUrl}
                            alt={`House image ${index + 1}`}
                            className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded font-medium">
                            {index + 1}
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <FiImage className="h-5 w-5 text-blue-600 mt-0.5" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-800">
                            <strong>Để chỉnh sửa ảnh:</strong> Chuyển sang tab "Quản lý ảnh" để thêm, xóa hoặc sắp xếp lại thứ tự ảnh.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <FiImage className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-3">Chưa có ảnh nào cho nhà này</p>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <FiImage className="h-5 w-5 text-yellow-600 mt-0.5" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-800">
                            <strong>Thêm ảnh đầu tiên:</strong> Chuyển sang tab "Quản lý ảnh" để thêm ảnh cho nhà.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          ) : (
            /* Tab quản lý ảnh */
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Quản lý ảnh nhà
                </h3>
                <p className="text-sm text-gray-600">
                  Thêm, xóa và sắp xếp lại thứ tự ảnh của nhà. Bạn có thể kéo/thả để sắp xếp lại thứ tự.
                </p>
              </div>
              
              <SimpleImageManager 
                houseId={house.id} 
                onImagesChange={handleImagesChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditHouseModal;
