// src/components/admin/EditHouseModal.jsx
import React, { useState, useEffect } from "react";
import { FiX, FiEdit3, FiImage, FiUpload, FiArrowUp, FiArrowDown, FiTrash2 } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { HOUSE_TYPE_LABELS, HOUSE_STATUS_LABELS } from "../../utils/constants";
import { useToast } from "../common/Toast";
import houseImageApi from "../../api/houseImageApi";
import fileUploadService from "../../api/fileUploadApi";

const EditHouseModal = ({ isOpen, onClose, house, onSave, onHouseUpdate }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState([]);
  const [errors, setErrors] = useState({});

  const { showSuccess, showError } = useToast();

  // Khi prop `house` thay đổi, cập nhật lại state của form
  useEffect(() => {
    if (house) {
      console.log('=== HOUSE PROP CHANGED ===');
      console.log('House ID:', house.id);
      
      // Nếu đây là lần đầu load hoặc house ID thay đổi, reset toàn bộ form
      if (!formData || formData.id !== house.id) {
        setFormData({ ...house });
      } else {
        // Nếu chỉ có imageUrls thay đổi, chỉ cập nhật imageUrls và giữ nguyên form data
        setFormData(prev => ({ 
          ...prev, 
          imageUrls: house.imageUrls 
        }));
      }
    }
  }, [house?.id, house?.imageUrls]);

  // Lấy ảnh trực tiếp từ house prop và deduplicate
  const images = [...new Set(house?.imageUrls || [])];

  // Validation form
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
      newErrors.area = 'Diện tích phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý chung cho việc thay đổi giá trị trong các input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      await onSave(formData);
      showSuccess('Thành công', 'Đã cập nhật thông tin nhà');
    } catch (error) {
      console.error('Error updating house:', error);
      showError('Lỗi', 'Không thể cập nhật thông tin nhà');
    } finally {
      setIsSaving(false);
    }
  };

  // Xử lý upload ảnh - ĐƠN GIẢN NHẤT
  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0 || !house?.id) return;

    for (const file of acceptedFiles) {
      try {
        console.log('Uploading:', file.name);
        
        // Upload file
        const uploadResponse = await fileUploadService.uploadHouseImages([file]);
        const imageUrl = uploadResponse[0];
        
        // Thêm ảnh vào nhà
        await houseImageApi.addHouseImage(house.id, imageUrl);
        showSuccess('Thành công', 'Đã thêm ảnh mới');
        
        // Refresh dữ liệu
        if (onHouseUpdate) {
          await onHouseUpdate();
        }
      } catch (error) {
        console.error('Error:', error);
        showError('Lỗi', `Không thể tải lên ảnh ${file.name}`);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  });

  // Di chuyển ảnh lên - VIẾT LẠI ĐƠN GIẢN
  const moveImageUp = async (index) => {
    if (index === 0) return;
    
    try {
      const imageIds = images.map((_, i) => {
        if (i === index) return images[index - 1];
        if (i === index - 1) return images[index];
        return images[i];
      });
      
      await houseImageApi.updateImageOrder(house.id, { imageIds });
      showSuccess('Thành công', 'Đã cập nhật thứ tự ảnh');
      
      // Refresh dữ liệu
      if (onHouseUpdate) {
        await onHouseUpdate();
      }
    } catch (error) {
      console.error('Error updating image order:', error);
      showError('Lỗi', 'Không thể cập nhật thứ tự ảnh');
    }
  };

  // Di chuyển ảnh xuống - VIẾT LẠI ĐƠN GIẢN
  const moveImageDown = async (index) => {
    if (index === images.length - 1) return;
    
    try {
      const imageIds = images.map((_, i) => {
        if (i === index) return images[index + 1];
        if (i === index + 1) return images[index];
        return images[i];
      });
      
      await houseImageApi.updateImageOrder(house.id, { imageIds });
      showSuccess('Thành công', 'Đã cập nhật thứ tự ảnh');
      
      // Refresh dữ liệu
      if (onHouseUpdate) {
        await onHouseUpdate();
      }
    } catch (error) {
      console.error('Error updating image order:', error);
      showError('Lỗi', 'Không thể cập nhật thứ tự ảnh');
    }
  };

  // Xóa ảnh - VIẾT LẠI ĐƠN GIẢN
  const handleDeleteImage = async (imageUrl, index) => {
    try {
      const imageId = `temp-${index}`;
      await houseImageApi.deleteHouseImage(imageId, house.id);
      
      showSuccess('Thành công', 'Đã xóa ảnh');
      
      // Refresh dữ liệu
      if (onHouseUpdate) {
        await onHouseUpdate();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      showError('Lỗi', 'Không thể xóa ảnh');
    }
  };

  // Nếu modal không mở hoặc không có dữ liệu nhà, không render gì cả
  if (!isOpen || !formData) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa thông tin nhà</h2>
            <p className="text-sm text-gray-600 mt-1">ID: {formData.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-8 py-4 font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FiEdit3 className="h-5 w-5" />
            Thông tin cơ bản
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-8 py-4 font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'images'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FiImage className="h-5 w-5" />
            Quản lý ảnh
            {images.length > 0 && (
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                {images.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
          {activeTab === 'details' ? (
            /* Tab thông tin cơ bản */
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cột 1 */}
                <div className="space-y-6">
                  {/* Tiêu đề */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tiêu đề *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Nhập tiêu đề nhà"
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <FiX className="h-4 w-4" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Địa chỉ */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Địa chỉ *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Nhập địa chỉ nhà"
                    />
                    {errors.address && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <FiX className="h-4 w-4" />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Mô tả */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mô tả *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                        errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Mô tả chi tiết về nhà"
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <FiX className="h-4 w-4" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Cột 2 */}
                <div className="space-y-6">
                  {/* Giá */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Giá (VNĐ/tháng) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Nhập giá thuê"
                    />
                    {errors.price && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <FiX className="h-4 w-4" />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* Diện tích */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Diện tích (m²) *
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.area ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Nhập diện tích"
                    />
                    {errors.area && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <FiX className="h-4 w-4" />
                        {errors.area}
                      </p>
                    )}
                  </div>

                  {/* Loại nhà */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Loại nhà *
                    </label>
                    <select
                      name="houseType"
                      value={formData.houseType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                    >
                      {Object.entries(HOUSE_TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Trạng thái */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Trạng thái *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                    >
                      {Object.entries(HOUSE_STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Preview ảnh hiện tại */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Ảnh hiện tại của nhà</h3>
                      {images.length > 0 && (
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {images.length} ảnh
                        </span>
                      )}
                    </div>
                    
                    {images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.slice(0, 6).map((imageUrl, index) => (
                          <div key={`${imageUrl}-${index}`} className="relative bg-white rounded-lg shadow-sm border overflow-hidden group">
                            <img
                              src={imageUrl}
                              alt={`House image ${index + 1}`}
                              className="w-full h-24 object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded font-medium">
                              {index + 1}
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
                          </div>
                        ))}
                        
                        {/* Hiển thị số ảnh còn lại */}
                        {images.length > 6 && (
                          <div className="flex items-center justify-center bg-gray-100 rounded-lg h-24">
                            <span className="text-sm text-gray-500">
                              +{images.length - 6} ảnh khác
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <FiImage className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 mb-3">Chưa có ảnh nào cho nhà này</p>
                        <p className="text-sm text-gray-400">Chuyển sang tab "Quản lý ảnh" để thêm ảnh</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang cập nhật...
                    </>
                  ) : (
                    'Cập nhật thông tin'
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Tab quản lý ảnh */
            <div className="p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Quản lý ảnh nhà
                    </h3>
                    <p className="text-gray-600">
                      Thêm, xóa và sắp xếp lại thứ tự ảnh của nhà. Bạn có thể kéo/thả để sắp xếp lại thứ tự.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dropzone để thêm ảnh */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 mb-8 ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <FiUpload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-xl font-medium text-gray-700 mb-2">
                  {isDragActive ? 'Thả ảnh vào đây' : 'Kéo/thả ảnh hoặc click để chọn'}
                </p>
                <p className="text-gray-500">
                  Hỗ trợ: JPEG, PNG, GIF, WebP (tối đa 5MB mỗi ảnh)
                </p>
              </div>

              {/* Danh sách ảnh hiện tại */}
              {images.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ảnh hiện tại ({images.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((imageUrl, index) => (
                      <div key={`${imageUrl}-${index}`} className="relative bg-white rounded-xl shadow-sm border overflow-hidden group">
                        {/* Ảnh */}
                        <img
                          src={imageUrl}
                          alt={`House image ${index + 1}`}
                          className="w-full h-48 object-cover"
                        />
                        
                        {/* Overlay với các nút */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                            {/* Nút di chuyển lên */}
                            <button
                              onClick={() => moveImageUp(index)}
                              disabled={index === 0}
                              className={`p-3 rounded-full shadow-lg transition-colors ${
                                index === 0 
                                  ? 'bg-gray-300 cursor-not-allowed' 
                                  : 'bg-white hover:bg-gray-50'
                              }`}
                              title="Di chuyển lên"
                            >
                              <FiArrowUp className={`h-5 w-5 ${
                                index === 0 ? 'text-gray-400' : 'text-gray-600'
                              }`} />
                            </button>
                            
                            {/* Nút di chuyển xuống */}
                            <button
                              onClick={() => moveImageDown(index)}
                              disabled={index === images.length - 1}
                              className={`p-3 rounded-full shadow-lg transition-colors ${
                                index === images.length - 1 
                                  ? 'bg-gray-300 cursor-not-allowed' 
                                  : 'bg-white hover:bg-gray-50'
                              }`}
                              title="Di chuyển xuống"
                            >
                              <FiArrowDown className={`h-5 w-5 ${
                                index === images.length - 1 ? 'text-gray-400' : 'text-gray-600'
                              }`} />
                            </button>
                            
                            {/* Nút xóa */}
                            <button
                              onClick={() => handleDeleteImage(imageUrl, index)}
                              className="p-3 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                              title="Xóa ảnh"
                            >
                              <FiTrash2 className="h-5 w-5 text-white" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Thứ tự ảnh */}
                        <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full font-medium">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FiImage className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-lg mb-2">Chưa có ảnh nào</p>
                  <p>Hãy thêm ảnh đầu tiên bằng cách kéo/thả hoặc click vào vùng bên trên!</p>
                </div>
              )}

              {/* Danh sách ảnh đang upload */}
              {uploadingImages.length > 0 && (
                <div className="space-y-6 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900">Đang tải lên... ({uploadingImages.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uploadingImages.map((item) => (
                      <div key={item.id} className="relative bg-white rounded-xl shadow-sm border overflow-hidden">
                        <img
                          src={item.preview}
                          alt="Uploading..."
                          className="w-full h-48 object-cover opacity-75"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                        <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full">
                          Đang tải...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditHouseModal;
