import axios from "axios";
import { privateApiClient } from "./apiClient";

const propertyApi = {
  // Upload ảnh nhà
  uploadHouseImages: async (files) => {
    try {
      const formData = new FormData();
      
      // Thêm các file ảnh vào formData với key 'files'
      files.forEach(file => {
        formData.append('files', file);
      });
      
      console.log('Đang upload ảnh...');
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/files/upload/house-images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          validateStatus: status => status < 500
        }
      );
      
      console.log('Kết quả upload ảnh:', response.data);
      
      if (response.status >= 400) {
        const error = response.data?.message || 'Lỗi khi tải lên ảnh';
        throw new Error(error);
      }
      
      // Trả về danh sách các URL ảnh đã upload
      return response.data.data.map(item => item.fileUrl);
      
    } catch (error) {
      console.error('Lỗi khi upload ảnh:', error);
      throw error;
    }
  },
  
  // Tạo mới bài đăng nhà
  createHouse: async (houseData) => {
    try {
      console.log('Đang tạo bài đăng mới...', houseData);
      
      // Chuẩn bị dữ liệu theo đúng định dạng API yêu cầu
      const requestData = {
        title: houseData.title,
        description: houseData.description,
        address: houseData.address,
        price: parseFloat(houseData.price) || 0,
        area: parseFloat(houseData.area) || 0,
        houseType: houseData.houseType,
        status: houseData.status || 'ACTIVE',
        hostId: houseData.hostId,
        imageUrls: houseData.imageUrls || [],
        latitude: houseData.latitude || 0,
        longitude: houseData.longitude || 0
      };
      
      console.log('Dữ liệu gửi đi (đã xử lý):', JSON.stringify(requestData, null, 2));
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/houses`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          validateStatus: () => true // Luôn resolve promise để xử lý lỗi
        }
      );
      
      console.log('Phản hồi từ API createHouse - Status:', response.status);
      console.log('Dữ liệu phản hồi:', response.data);
      
      if (response.status >= 400) {
        // Nếu có thông báo lỗi từ server
        if (response.data) {
          console.error('Chi tiết lỗi từ server:', response.data);
          
          // Nếu có lỗi validation
          if (response.status === 400 && response.data.errors) {
            const validationErrors = Object.entries(response.data.errors)
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
              .join('\n');
            throw new Error(`Dữ liệu không hợp lệ:\n${validationErrors}`);
          }
          
          // Nếu có thông báo lỗi
          if (response.data.message) {
            throw new Error(response.data.message);
          }
          
          // Nếu có lỗi chung
          if (response.data.error) {
            throw new Error(response.data.error);
          }
        }
        
        throw new Error(`Lỗi ${response.status}: ${response.statusText || 'Yêu cầu không hợp lệ'}`);
      }
      
      return response.data;
      
    } catch (error) {
      console.error('Lỗi khi tạo bài đăng:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      
      // Nếu có thông báo lỗi từ server
      if (error.response?.data) {
        const serverError = error.response.data;
        
        // Kiểm tra các trường hợp lỗi thường gặp
        if (serverError.errors) {
          // Xử lý lỗi validation
          const validationErrors = Object.entries(serverError.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          throw new Error(`Lỗi dữ liệu:\n${validationErrors}`);
        }
        
        // Nếu có message lỗi từ server
        if (serverError.message) {
          throw new Error(serverError.message);
        }
        
        // Nếu có error từ server
        if (serverError.error) {
          throw new Error(serverError.error);
        }
      }
      
      // Nếu không có thông tin lỗi cụ thể
      if (!error.message.includes('Network Error') && !error.request) {
        throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin đã nhập.');
      }
      
      throw error;
    }
  },

  // Upload ảnh nhà
  uploadImages: async (files) => {
    if (!files || files.length === 0) {
      console.warn('Không có file nào được chọn để upload');
      return [];
    }

    const formData = new FormData();
    // Thêm từng file vào formData với key là 'files' để phù hợp với @RequestParam("files")
    files.forEach(file => {
      formData.append('files', file);
    });
    
    console.log('Đang upload files:', files);
    
    try {
      // Gọi API upload với endpoint đầy đủ /api/files/upload/house-images
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/files/upload/house-images`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        }
      );
      
      console.log('Phản hồi từ server:', response);
      
      // Xử lý response theo cấu trúc: { data: { data: [...] } }
      if (response.data && response.data.data) {
        // Trả về mảng các URL ảnh
        // Giả sử mỗi item trong mảng có dạng { url: string, ... }
        return response.data.data.map(item => {
          // Kiểm tra xem item có phải là string (URL) hay object có thuộc tính url
          if (typeof item === 'string') {
            return item;
          }
          return item.url || item.fileUrl || item.path || '';
        }).filter(url => url); // Lọc bỏ các URL rỗng
      }
      
      console.warn('Không có dữ liệu trong response');
      return [];
    } catch (error) {
      console.error('Lỗi khi upload ảnh:', error);
      if (error.response) {
        console.error('Chi tiết lỗi từ server:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // Nếu là lỗi 401 (Unauthorized)
        if (error.response.status === 401) {
          // Xử lý hết hạn token
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } else if (error.request) {
        console.error('Không nhận được phản hồi từ server:', error.request);
      } else {
        console.error('Lỗi khi thiết lập yêu cầu:', error.message);
      }
      
      throw error;
    }
  },

  // Lấy danh sách nhà của host
  getMyHouses: async () => {
    const response = await privateApiClient.get('/api/houses/my-houses');
    return response.data;
  },
  
  // Lấy danh sách bài đăng (cho host) - giữ lại cho tương thích
  getMyProperties: async (params = {}) => {
    try {
      console.log('Fetching properties with params:', params);
      const response = await privateApiClient.get('/api/houses/my-houses', { 
        params,
        paramsSerializer: params => {
          return Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        }
      });
      console.log('Properties fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      throw error;
    }
  },
  
  // Lấy chi tiết bài đăng
  getPropertyById: async (id) => {
    try {
      if (!id) {
        throw new Error('Property ID is required');
      }
      console.log(`Fetching property with ID: ${id}`);
      const response = await privateApiClient.get(`/properties/${id}`);
      console.log('Property details fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },
  
  // Cập nhật bài đăng
  updateProperty: async (id, propertyData) => {
    try {
      const formData = new FormData();
      
      // Thêm các trường thông tin cơ bản
      if (propertyData.title) formData.append('title', propertyData.title);
      if (propertyData.description) formData.append('description', propertyData.description);
      if (propertyData.price) formData.append('price', propertyData.price);
      if (propertyData.area) formData.append('area', propertyData.area);
      if (propertyData.bedrooms) formData.append('bedrooms', propertyData.bedrooms);
      if (propertyData.bathrooms) formData.append('bathrooms', propertyData.bathrooms);
      if (propertyData.floor) formData.append('floor', propertyData.floor);
      if (propertyData.direction) formData.append('direction', propertyData.direction);
      if (propertyData.legalDocuments) formData.append('legalDocuments', propertyData.legalDocuments);
      if (propertyData.furniture) formData.append('furniture', propertyData.furniture);
      
      // Thêm địa chỉ nếu có
      if (propertyData.address) formData.append('address', propertyData.address);
      if (propertyData.city) formData.append('city', propertyData.city);
      if (propertyData.district) formData.append('district', propertyData.district);
      if (propertyData.ward) formData.append('ward', propertyData.ward);
      
      // Thêm thông tin liên hệ nếu có
      if (propertyData.contactName) formData.append('contactName', propertyData.contactName);
      if (propertyData.contactPhone) formData.append('contactPhone', propertyData.contactPhone);
      if (propertyData.contactEmail) formData.append('contactEmail', propertyData.contactEmail);
      
      // Thêm tiện ích nếu có
      if (propertyData.utilities) {
        formData.append('utilities', JSON.stringify(propertyData.utilities));
      }
      
      // Thêm hình ảnh mới nếu có
      if (propertyData.images && propertyData.images.length > 0) {
        propertyData.images.forEach((image) => {
          if (image instanceof File) {
            formData.append('newImages', image);
          }
        });
      }
      
      // Nếu có ảnh bị xóa
      if (propertyData.deletedImageIds && propertyData.deletedImageIds.length > 0) {
        formData.append('deletedImageIds', JSON.stringify(propertyData.deletedImageIds));
      }
      
      const response = await privateApiClient.put(`/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error updating property ${id}:`, error);
      throw error;
    }
  },
  
  // Xóa bài đăng
  deleteProperty: async (id) => {
    try {
      const response = await privateApiClient.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting property ${id}:`, error);
      throw error;
    }
  },
  
  // Cập nhật trạng thái bài đăng (active/inactive)
  updatePropertyStatus: async (id, isActive) => {
    try {
      const response = await privateApiClient.patch(`/properties/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for property ${id}:`, error);
      throw error;
    }
  },
  
  // Lấy danh sách bài đăng công khai (cho người dùng)
  getPublicProperties: async (params = {}) => {
    try {
      const response = await privateApiClient.get('/public/properties', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching public properties:', error);
      throw error;
    }
  }
};

export default propertyApi;
