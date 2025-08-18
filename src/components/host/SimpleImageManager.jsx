import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiPlus, FiX, FiUpload, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useToast } from '../common/Toast';
import houseImageApi from '../../api/houseImageApi';
import fileUploadApi from '../../api/fileUploadApi';

const SimpleImageManager = ({ houseId, onImagesChange }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState([]);
  const { showSuccess, showError } = useToast();

  // Load ảnh hiện tại
  useEffect(() => {
    if (houseId) {
      loadHouseImages();
    }
  }, [houseId]);

  const loadHouseImages = async () => {
    try {
      setIsLoading(true);
      const response = await houseImageApi.getHouseImages(houseId);
      if (response.success) {
        setImages(response.data || []);
      }
    } catch (error) {
      console.error('Error loading house images:', error);
      showError('Lỗi', 'Không thể tải danh sách ảnh');
    } finally {
      setIsLoading(false);
    }
  };

  // Di chuyển ảnh lên
  const moveImageUp = async (index) => {
    if (index === 0) return;
    
    const newImages = [...images];
    [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    
    setImages(newImages);

    try {
      const imageIds = newImages.map(img => img.id);
      await houseImageApi.updateImageOrder(houseId, imageIds);
      showSuccess('Thành công', 'Đã cập nhật thứ tự ảnh');
      if (onImagesChange) {
        onImagesChange(newImages);
      }
    } catch (error) {
      console.error('Error updating image order:', error);
      showError('Lỗi', 'Không thể cập nhật thứ tự ảnh');
      loadHouseImages(); // Rollback
    }
  };

  // Di chuyển ảnh xuống
  const moveImageDown = async (index) => {
    if (index === images.length - 1) return;
    
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    
    setImages(newImages);

    try {
      const imageIds = newImages.map(img => img.id);
      await houseImageApi.updateImageOrder(houseId, imageIds);
      showSuccess('Thành công', 'Đã cập nhật thứ tự ảnh');
      if (onImagesChange) {
        onImagesChange(newImages);
      }
    } catch (error) {
      console.error('Error updating image order:', error);
      showError('Lỗi', 'Không thể cập nhật thứ tự ảnh');
      loadHouseImages(); // Rollback
    }
  };

  // Xử lý thêm ảnh mới
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const newUploadingImages = acceptedFiles.map(file => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      isUploading: true
    }));

    setUploadingImages(prev => [...prev, ...newUploadingImages]);

    for (const item of newUploadingImages) {
      try {
        // Upload file
        const formData = new FormData();
        formData.append('file', item.file);
        
        const uploadResponse = await fileUploadApi.uploadFile(formData);
        if (uploadResponse.success) {
          const imageUrl = uploadResponse.data.url;
          
          // Thêm ảnh vào nhà
          const addResponse = await houseImageApi.addHouseImage(houseId, imageUrl);
          if (addResponse.success) {
            const newImage = addResponse.data;
            setImages(prev => [...prev, newImage]);
            
            if (onImagesChange) {
              onImagesChange([...images, newImage]);
            }
            
            showSuccess('Thành công', 'Đã thêm ảnh mới');
          }
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        showError('Lỗi', `Không thể tải lên ảnh ${item.file.name}`);
      } finally {
        // Xóa khỏi danh sách đang upload
        setUploadingImages(prev => prev.filter(img => img.id !== item.id));
        URL.revokeObjectURL(item.preview);
      }
    }
  }, [houseId, images, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  });

  // Xóa ảnh
  const handleDeleteImage = async (imageId, index) => {
    try {
      await houseImageApi.deleteHouseImage(imageId, houseId);
      
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      
      if (onImagesChange) {
        onImagesChange(newImages);
      }
      
      showSuccess('Thành công', 'Đã xóa ảnh');
    } catch (error) {
      console.error('Error deleting image:', error);
      showError('Lỗi', 'Không thể xóa ảnh');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dropzone để thêm ảnh */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          {isDragActive ? 'Thả ảnh vào đây' : 'Kéo/thả ảnh hoặc click để chọn'}
        </p>
        <p className="text-sm text-gray-500">
          Hỗ trợ: JPEG, PNG, GIF, WebP (tối đa 5MB mỗi ảnh)
        </p>
      </div>

      {/* Danh sách ảnh hiện tại */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Ảnh hiện tại</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={image.id} className="relative bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Ảnh */}
                <img
                  src={image.imageUrl}
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
                      className={`p-2 rounded-full shadow-lg transition-colors ${
                        index === 0 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      title="Di chuyển lên"
                    >
                      <FiArrowUp className={`h-4 w-4 ${
                        index === 0 ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                    </button>
                    
                    {/* Nút di chuyển xuống */}
                    <button
                      onClick={() => moveImageDown(index)}
                      disabled={index === images.length - 1}
                      className={`p-2 rounded-full shadow-lg transition-colors ${
                        index === images.length - 1 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      title="Di chuyển xuống"
                    >
                      <FiArrowDown className={`h-4 w-4 ${
                        index === images.length - 1 ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                    </button>
                    
                    {/* Nút xóa */}
                    <button
                      onClick={() => handleDeleteImage(image.id, index)}
                      className="p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                      title="Xóa ảnh"
                    >
                      <FiX className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
                
                {/* Thứ tự ảnh */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Danh sách ảnh đang upload */}
      {uploadingImages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Đang tải lên...</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadingImages.map((item) => (
              <div key={item.id} className="relative bg-white rounded-lg shadow-sm border overflow-hidden">
                <img
                  src={item.preview}
                  alt="Uploading..."
                  className="w-full h-48 object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  Đang tải...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Thông báo khi không có ảnh */}
      {images.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          <FiPlus className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p>Chưa có ảnh nào. Hãy thêm ảnh đầu tiên!</p>
        </div>
      )}
    </div>
  );
};

export default SimpleImageManager;
