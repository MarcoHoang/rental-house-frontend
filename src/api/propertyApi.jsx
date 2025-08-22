import axios from "axios";
import { privateApiClient, hostApiClient, publicApiClient } from "./apiClient";
import { HOUSE_TYPES, HOUSE_STATUS } from "../utils/constants";

const propertyApi = {
  // Upload ảnh nhà (cần ROLE_HOST)
  uploadHouseImages: async (files) => {
    try {
      const formData = new FormData();

      // Thêm các file ảnh vào formData với key 'files'
      files.forEach(file => {
        formData.append('files', file);
      });



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

  // Tạo mới bài đăng nhà (cần ROLE_HOST)
  createHouse: async (houseData) => {
    try {


      // Chuẩn bị dữ liệu theo đúng định dạng API yêu cầu
      const requestData = {
        title: houseData.title,
        description: houseData.description,
        address: houseData.address,
        price: parseFloat(houseData.price) || 0,
        area: parseFloat(houseData.area) || 0,
        houseType: houseData.houseType,
        status: houseData.status || 'AVAILABLE',
        hostId: houseData.hostId,
        imageUrls: houseData.imageUrls || [],
        latitude: houseData.latitude || 0,
        longitude: houseData.longitude || 0
      };

      console.log('propertyApi.createHouse - Request data:', JSON.stringify(requestData, null, 2));



      console.log('propertyApi.createHouse - Sending request to:', '/houses');
      console.log('propertyApi.createHouse - Request headers:', {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (localStorage.getItem('token') ? '***' : 'null')
      });

      const response = await hostApiClient.post('/houses', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: () => true // Luôn resolve promise để xử lý lỗi
      });



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

      // Backend trả về ApiResponse format, cần extract data
      if (response.data && response.data.data) {
        return response.data.data;
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

  // Upload ảnh nhà (cần ROLE_HOST)
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

    

    try {
      // Gọi API upload với endpoint đầy đủ /api/files/upload/house-images
      const response = await hostApiClient.post('/files/upload/house-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });



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

  // Lấy danh sách nhà của chủ nhà hiện tại
  getMyHouses: async () => {
    try {
      console.log('propertyApi - getMyHouses called');
      const response = await hostApiClient.get('/houses/my-houses');
      console.log('propertyApi - getMyHouses response:', response);
      
      // Backend trả về ApiResponse format, cần extract data
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('propertyApi - Error fetching my houses:', error);
      throw error;
    }
  },

  // Lấy danh sách bài đăng (cho host) - cần ROLE_HOST
  getMyProperties: async (params = {}) => {
    try {
      const response = await hostApiClient.get('/houses/my-houses', {
        params,
        paramsSerializer: params => {
          return Object.keys(params)
              .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
              .join('&');
        }
      });

      // Backend trả về ApiResponse format, cần extract data
      if (response.data && response.data.data) {
        return {
          content: response.data.data,
          totalElements: response.data.data.length,
          totalPages: 1,
          size: response.data.data.length,
          number: 0
        };
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  // Lấy danh sách nhà theo hostId cụ thể (công khai - không cần authentication)
  getPropertiesByHostId: async (hostId, params = {}) => {
    try {


      // Gọi API để lấy tất cả nhà (công khai)
      const allHousesResponse = await publicApiClient.get('/houses', { params });
      const allHouses = allHousesResponse.data.data || allHousesResponse.data.content || allHousesResponse.data || [];



      // Filter theo hostId
      const filteredHouses = allHouses.filter(house => house.hostId == hostId);



      return {
        content: filteredHouses,
        totalElements: filteredHouses.length,
        totalPages: 1,
        size: filteredHouses.length,
        number: 0
      };
    } catch (error) {
      console.error('Error fetching properties for hostId:', hostId, error);
      throw error;
    }
  },

  // Cập nhật bài đăng (cần ROLE_HOST)
  updateProperty: async (id, propertyData) => {
    try {

      
      const response = await hostApiClient.put(`/houses/${id}`, propertyData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });



      // Backend trả về ApiResponse format, cần extract data
      if (response.data && response.data.data) {
        return response.data.data;
      }

      return response.data;
    } catch (error) {
      console.error(`Error updating property ${id}:`, error);
      throw error;
    }
  },

  // Xóa bài đăng (cần ROLE_HOST)
  deleteProperty: async (id) => {
    try {

      const response = await hostApiClient.delete(`/houses/${id}`);



      // Backend trả về ApiResponse format
      if (response.data && response.data.data) {
        return response.data.data;
      }

      return response.data;
    } catch (error) {
      console.error(`Error deleting property ${id}:`, error);
      throw error;
    }
  },

  // Cập nhật trạng thái bài đăng (cần ROLE_HOST)
  updatePropertyStatus: async (id, status) => {
    try {

      const response = await hostApiClient.put(`/houses/${id}/status?status=${status}`);



      // Backend trả về ApiResponse format, cần extract data
      if (response.data && response.data.data) {
        return response.data.data;
      }

      return response.data;
    } catch (error) {
      console.error(`Error updating status for property ${id}:`, error);
      throw error;
    }
  },

  // Tìm kiếm nhà theo từ khóa (công khai - không cần authentication)
  searchHouses: async (keyword) => {
    try {

      const response = await publicApiClient.get('/houses/search', {
        params: { keyword }
      });



      // Backend trả về ApiResponse format, cần extract data
      if (response.data && response.data.data) {
        return {
          content: response.data.data,
          totalElements: response.data.data.length,
          totalPages: 1,
          size: response.data.data.length,
          number: 0
        };
      }

      return response.data;
    } catch (error) {
      console.error('Error searching houses:', error);
      throw error;
    }
  },

  // Lấy nhà nổi bật (công khai - không cần authentication)
  getTopHouses: async () => {
    try {

      const response = await publicApiClient.get('/houses/top');



      // Backend trả về ApiResponse format, cần extract data
      if (response.data && response.data.data) {
        return {
          content: response.data.data,
          totalElements: response.data.data.length,
          totalPages: 1,
          size: response.data.data.length,
          number: 0
        };
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching top houses:', error);
      throw error;
    }
  },

  // Lấy nhà nổi bật theo số lượng yêu thích (công khai - không cần authentication)
  getTopHousesByFavorites: async (limit = 5) => {
    try {
      const response = await publicApiClient.get('/houses/top-favorites', {
        params: { limit }
      });

      // Backend trả về ApiResponse format: { code: "04", message: "...", data: [...] }
      if (response.data && response.data.code && response.data.data) {
        return response.data; // Trả về nguyên response.data để extractHousesFromResponse xử lý
      }

      // Fallback
      if (response.data && Array.isArray(response.data)) {
        return {
          code: '00',
          message: 'Success',
          data: response.data
        };
      }

      return {
        code: '00',
        message: 'No data',
        data: []
      };
    } catch (error) {
      console.error('Error fetching top houses by favorites:', error);
      throw error;
    }
  },

  // Lấy hình ảnh của nhà (công khai - không cần authentication)
  getHouseImages: async (id) => {
    try {

      const response = await publicApiClient.get(`/houses/${id}/images`);



      // Backend trả về ApiResponse format, cần extract data
      if (response.data && response.data.data) {
        return response.data.data;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching images for house ${id}:`, error);
      throw error;
    }
  },

  // Lấy danh sách bài đăng công khai (cho người dùng) - công khai - không cần authentication
  getPublicProperties: async (params = {}) => {
    try {
      // Sử dụng publicApiClient vì GET /houses là công khai
      const response = await publicApiClient.get('/houses', { params });

      // Backend trả về ApiResponse format: { code: "04", message: "...", data: [...] }
      if (response.data && response.data.code && response.data.data) {
        return response.data; // Trả về nguyên response.data để extractHousesFromResponse xử lý
      }

      // Nếu không có response.data.data, kiểm tra response.data trực tiếp
      if (response.data && Array.isArray(response.data)) {
        return {
          code: '00',
          message: 'Success',
          data: response.data
        };
      }

      // Nếu có response.data.content
      if (response.data && response.data.content) {
        return {
          code: '00',
          message: 'Success',
          data: response.data.content
        };
      }

      return {
        code: '00',
        message: 'No data',
        data: []
      };
    } catch (error) {
      console.error('Error fetching public properties:', error);

      // Log chi tiết lỗi
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('Error message:', error.message);
      }

      throw error;
    }
  },

  // Lấy tất cả nhà (công khai - không cần authentication)
  getAllProperties: async (params = {}) => {
    try {

      const response = await publicApiClient.get('/houses', { params });
      

      // Backend trả về ApiResponse format, cần extract data
      if (response.data && response.data.data) {
        return {
          content: response.data.data,
          totalElements: response.data.data.length,
          totalPages: 1,
          size: response.data.data.length,
          number: 0
        };
      }

      return response.data;
    } catch (error) {
      console.error('❌ Error fetching all properties:', error);
      throw error;
    }
  },

  // Lấy chi tiết nhà theo ID (công khai - không cần authentication)
  getHouseById: async (id) => {
    try {
      const response = await publicApiClient.get(`/houses/${id}`);

      // Backend trả về ApiResponse format: { code: "00", message: "...", data: {...} }
      if (response.data && response.data.code && response.data.data) {
        return response.data; // Trả về nguyên response.data để extractHouseFromResponse xử lý
      }

      // Fallback
      if (response.data && response.data.id) {
        return {
          code: '00',
          message: 'Success',
          data: response.data
        };
      }

      return {
        code: '00',
        message: 'No data',
        data: null
      };
    } catch (error) {
      console.error(`Error fetching house ${id}:`, error);
      
      // Log chi tiết lỗi
      if (error.response) {
        console.error(`Response status:`, error.response.status);
        console.error(`Response data:`, error.response.data);
        console.error(`Response headers:`, error.response.headers);
      } else if (error.request) {
        console.error(`Request error:`, error.request);
      } else {
        console.error(`Error message:`, error.message);
      }
      
      throw error;
    }
  },

  // Cập nhật nhà (cần ROLE_HOST)
  updateHouse: async (id, houseData) => {
    try {

      
      const response = await hostApiClient.put(`/houses/${id}/edit`, houseData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });



      // Backend trả về ApiResponse format, cần extract data
      if (response.data && response.data.data) {
        return response.data.data;
      }

      return response.data;
    } catch (error) {
      console.error(`Error updating house ${id}:`, error);
      throw error;
    }
  },

  // Xóa nhà (cần ROLE_HOST hoặc ROLE_ADMIN)
  deleteHouse: async (id) => {
    try {
      // Kiểm tra role của user hiện tại
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      console.log('propertyApi.deleteHouse - Starting delete for house ID:', id);
      console.log('propertyApi.deleteHouse - User data:', user);
      console.log('propertyApi.deleteHouse - Admin user data:', adminUser);
      console.log('propertyApi.deleteHouse - User roleName:', user.roleName);
      console.log('propertyApi.deleteHouse - User role:', user.role);
      console.log('propertyApi.deleteHouse - Admin user role:', adminUser.role);
      console.log('propertyApi.deleteHouse - Admin user roleName:', adminUser.roleName);
      
      // Test endpoint để kiểm tra thông tin user từ backend
      try {
        const testResponse = await hostApiClient.get('/houses/test-current-user');
        console.log('propertyApi.deleteHouse - Backend user info:', testResponse.data);
      } catch (testError) {
        console.log('propertyApi.deleteHouse - Could not get backend user info:', testError.message);
      }
      
      // Test để lấy thông tin nhà trước khi xóa
      try {
        const houseResponse = await hostApiClient.get(`/houses/${id}`);
        console.log('propertyApi.deleteHouse - House info before delete:', houseResponse.data);
        console.log('propertyApi.deleteHouse - House host ID:', houseResponse.data?.data?.hostId);
        console.log('propertyApi.deleteHouse - Current user ID:', user.id);
        console.log('propertyApi.deleteHouse - Host ownership match:', houseResponse.data?.data?.hostId === user.id);
      } catch (houseError) {
        console.log('propertyApi.deleteHouse - Could not get house info:', houseError.message);
      }
      
      let response;
      
      // Kiểm tra admin trước (có thể có cả user và adminUser)
      const isAdmin = adminUser.role === 'ADMIN' || 
                     adminUser.roleName === 'ADMIN' || 
                     user.role === 'ADMIN' || 
                     user.roleName === 'ADMIN';
      
      // Kiểm tra host
      const isHost = user.roleName === 'HOST' || user.role === 'HOST';
      
      console.log('propertyApi.deleteHouse - Is Admin:', isAdmin);
      console.log('propertyApi.deleteHouse - Is Host:', isHost);
      
      // Nếu là admin, gọi endpoint admin
      if (isAdmin) {
        console.log('propertyApi.deleteHouse - Using admin endpoint for house:', id);
        response = await privateApiClient.delete(`/houses/${id}`);
      } 
      // Nếu là host, gọi endpoint host
      else if (isHost) {
        console.log('propertyApi.deleteHouse - Using host endpoint for house:', id);
        response = await hostApiClient.delete(`/houses/${id}`);
      } 
      // Nếu không phải admin cũng không phải host, throw error
      else {
        console.error('propertyApi.deleteHouse - User has no permission to delete house');
        console.error('propertyApi.deleteHouse - User roles found:', {
          userRole: user.role,
          userRoleName: user.roleName,
          adminRole: adminUser.role,
          adminRoleName: adminUser.roleName
        });
        throw new Error('Bạn không có quyền xóa nhà này');
      }

      console.log('propertyApi.deleteHouse - Response received:', response);
      console.log('propertyApi.deleteHouse - Response data:', response.data);

      // Backend trả về ApiResponse format
      if (response.data && response.data.data) {
        return response.data.data;
      }

      return response.data;
    } catch (error) {
      console.error('propertyApi.deleteHouse - Error details:', error);
      
      // Kiểm tra các trường hợp lỗi cụ thể
      if (error.response?.data?.message) {
        const message = error.response.data.message;
        if (message.includes('đang được thuê') || 
            message.includes('đang có người đặt') || 
            message.includes('RENTED') ||
            message.includes('đã có người đặt thuê trước')) {
          throw new Error('Không thể xóa nhà do đã có người đặt thuê trước');
        }
      }
      
      // Kiểm tra status code
      if (error.response?.status === 403) {
        throw new Error('Bạn không có quyền xóa nhà này');
      }
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy nhà cần xóa');
      }
      if (error.response?.status === 400 || error.response?.status === 409) {
        throw new Error('Không thể xóa nhà do đã có người đặt thuê trước');
      }
      
      // Nếu không có thông báo cụ thể, sử dụng thông báo mặc định
      throw new Error('Bạn không có quyền xóa nhà này');
    }
  }
};

export default propertyApi;