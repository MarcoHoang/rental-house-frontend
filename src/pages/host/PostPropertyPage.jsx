import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { FiPlus } from 'react-icons/fi';
import propertyApi from '../../api/propertyApi';
import { 
  HOUSE_TYPES, 
  HOUSE_STATUS, 
  HOUSE_TYPE_LABELS, 
  VALIDATION_RULES 
} from '../../utils/constants';
import { formatHouseForApi, getApiErrorMessage } from '../../utils/apiHelpers';
import { getUserFromStorage } from '../../utils/localStorage';

const PostPropertyPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    price: '',
    area: '',
    houseType: HOUSE_TYPES.APARTMENT,
    imageFiles: [],
    imagePreviews: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Validate file size
      const validFiles = files.filter(file => {
        if (file.size > VALIDATION_RULES.MAX_IMAGE_SIZE) {
          showError('Lỗi', `File ${file.name} quá lớn. Kích thước tối đa là 5MB.`);
          return false;
        }
        return true;
      });

      const newImagePreviews = validFiles.map(file => URL.createObjectURL(file));

      setFormData(prev => ({
        ...prev,
        imageFiles: [...prev.imageFiles, ...validFiles],
        imagePreviews: [...prev.imagePreviews, ...newImagePreviews]
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const newFiles = [...prev.imageFiles];
      const newPreviews = [...prev.imagePreviews];
      
      // Revoke URL để tránh memory leak
      URL.revokeObjectURL(newPreviews[index]);
      
      newFiles.splice(index, 1);
      newPreviews.splice(index, 1);
      
      return { 
        ...prev, 
        imageFiles: newFiles, 
        imagePreviews: newPreviews 
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
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

    if (formData.imageFiles.length < VALIDATION_RULES.MIN_IMAGES) {
      newErrors.images = `Cần ít nhất ${VALIDATION_RULES.MIN_IMAGES} ảnh`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Upload ảnh lên server trước
      console.log('Đang tải lên ảnh...');
      const imageUrls = await propertyApi.uploadHouseImages(formData.imageFiles);
      console.log('Đã tải lên các ảnh:', imageUrls);

      // Lấy thông tin người dùng từ localStorage
      const user = getUserFromStorage();
      if (!user || !user.id) {
        throw new Error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      }

      // 2. Tạo dữ liệu bài đăng với các URL ảnh
      const houseData = {
        ...formData,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        status: HOUSE_STATUS.AVAILABLE,
        hostId: user.id,
        imageUrls: imageUrls || []
      };

      // Format data theo API structure
      const apiData = formatHouseForApi(houseData);
      console.log('Dữ liệu gửi lên server:', JSON.stringify(apiData, null, 2));

      // 3. Gọi API tạo bài đăng
      const response = await propertyApi.createHouse(apiData);
      console.log('Phản hồi từ server:', response);

      // 4. Thông báo thành công và reset form
      showSuccess('Thành công', 'Đăng bài thành công! Bài viết đã được hiển thị trên trang chủ.');

      // Reset form
      setFormData({
        title: '',
        description: '',
        address: '',
        price: '',
        area: '',
        houseType: HOUSE_TYPES.APARTMENT,
        imageFiles: [],
        imagePreviews: []
      });
      setErrors({});

      // Chuyển hướng về trang dashboard sau 2 giây
      setTimeout(() => {
        navigate('/host');
      }, 2000);

    } catch (error) {
      console.error('Lỗi khi đăng bài:', error);
      
      const errorMessage = getApiErrorMessage(error);
      showError('Lỗi', errorMessage);

      // Xử lý lỗi xác thực
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Đăng tin cho thuê nhà</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tiêu đề */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tiêu đề *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Mô tả *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Địa chỉ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Địa chỉ *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        {/* Giá và diện tích */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
                            <label className="block text-sm font-medium text-gray-700">Giá (VNĐ/ngày) *</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₫</span>
              </div>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm rounded-md p-2 border ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                required
                min="0"
                step="1000"
              />
            </div>
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Diện tích (m²) *</label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className={`focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm rounded-md p-2 border ${
                  errors.area ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                required
                min="0"
                step="0.1"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">m²</span>
              </div>
            </div>
            {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area}</p>}
          </div>
        </div>

        {/* Loại nhà */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Loại nhà *</label>
          <select
            name="houseType"
            value={formData.houseType}
            onChange={(e) => setFormData({ ...formData, houseType: e.target.value })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
          >
            {Object.entries(HOUSE_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Upload ảnh */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hình ảnh * (Tối thiểu {VALIDATION_RULES.MIN_IMAGES} ảnh)
          </label>
          <div className="flex flex-wrap gap-4">
            {formData.imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="h-32 w-32 object-cover rounded-lg shadow-sm border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Xóa ảnh"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {formData.imagePreviews.length < VALIDATION_RULES.MAX_IMAGES && (
              <label className="flex flex-col items-center justify-center h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <FiPlus className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500 mt-1">Thêm ảnh</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Tối đa {VALIDATION_RULES.MAX_IMAGES} ảnh (định dạng: JPG, PNG, tối đa 5MB/ảnh)
          </p>
        </div>

        {/* Nút hủy và đăng bài */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/host')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2.5 rounded-md text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : 'Đăng bài'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostPropertyPage;