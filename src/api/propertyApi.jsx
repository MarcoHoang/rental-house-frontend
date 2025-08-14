import axios from "axios";
import { privateApiClient, hostApiClient, publicApiClient } from "./apiClient";

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
      const response = await hostApiClient.get('/houses/my-houses', { 
        params,
        paramsSerializer: params => {
          return Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        }
      });
      console.log('Properties fetched successfully:', response.data);
      
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
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      throw error;
    }
  },

  // Lấy danh sách nhà theo hostId cụ thể
  getPropertiesByHostId: async (hostId, params = {}) => {
    try {
      console.log('Fetching properties for hostId:', hostId, 'with params:', params);
      
      // Gọi API để lấy tất cả nhà
      const allHousesResponse = await hostApiClient.get('/houses', { params });
      const allHouses = allHousesResponse.data.data || allHousesResponse.data.content || allHousesResponse.data || [];
      
      console.log('All houses fetched:', allHouses);
      
      // Filter theo hostId
      const filteredHouses = allHouses.filter(house => house.hostId == hostId);
      
      console.log('Filtered houses for hostId:', hostId, filteredHouses);
      
      return {
        content: filteredHouses,
        totalElements: filteredHouses.length,
        totalPages: 1,
        size: filteredHouses.length,
        number: 0
      };
    } catch (error) {
      console.error('Error fetching properties for hostId:', hostId, error);
      
      // Trả về mock data nếu API thất bại
      console.warn('Using mock data as fallback');
      return getMockPropertiesForHost(hostId);
    }
  },
  
  // Lấy chi tiết bài đăng
  getPropertyById: async (id) => {
    try {
      if (!id) {
        throw new Error('Property ID is required');
      }
      console.log(`Fetching property with ID: ${id}`);
      const response = await hostApiClient.get(`/houses/${id}`);
      console.log('Property details fetched successfully:', response.data);
      
      // Backend trả về ApiResponse format, cần extract data
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
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
      
      const response = await hostApiClient.put(`/houses/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
  
  // Xóa bài đăng
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
  
  // Cập nhật trạng thái bài đăng (active/inactive)
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

  // Tìm kiếm nhà theo từ khóa
  searchHouses: async (keyword) => {
    try {
      console.log('Searching houses with keyword:', keyword);
      const response = await publicApiClient.get('/houses/search', {
        params: { keyword }
      });
      
      console.log('Search results:', response.data);
      
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

  // Lấy nhà nổi bật
  getTopHouses: async () => {
    try {
      console.log('Fetching top houses');
      const response = await publicApiClient.get('/houses/top');
      
      console.log('Top houses:', response.data);
      
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

  // Lấy hình ảnh của nhà
  getHouseImages: async (id) => {
    try {
      console.log(`Fetching images for house ${id}`);
      const response = await publicApiClient.get(`/houses/${id}/images`);
      
      console.log('House images:', response.data);
      
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
  
  // Lấy danh sách bài đăng công khai (cho người dùng)
  getPublicProperties: async (params = {}) => {
    try {
      console.log('🔍 Fetching public properties with params:', params);
      console.log('🔍 Using base URL:', publicApiClient.defaults.baseURL);
      
      // Thử nhiều endpoint khác nhau để lấy dữ liệu
      let response = null;
      let endpoint = null;
      
      // Thử endpoint chính trước
      try {
        endpoint = '/houses';
        console.log('🔍 Trying endpoint:', endpoint);
        response = await publicApiClient.get(endpoint, { 
          params,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Success with endpoint:', endpoint);
      } catch (error) {
        console.log('❌ Failed with endpoint:', endpoint, error.message);
        
        // Thử endpoint khác
        try {
          endpoint = '/houses/public';
          console.log('🔍 Trying endpoint:', endpoint);
          response = await publicApiClient.get(endpoint, { 
            params,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log('✅ Success with endpoint:', endpoint);
        } catch (error2) {
          console.log('❌ Failed with endpoint:', endpoint, error2.message);
          
          // Thử endpoint cuối cùng
          try {
            endpoint = '/houses/all';
            console.log('🔍 Trying endpoint:', endpoint);
            response = await publicApiClient.get(endpoint, { 
              params,
              headers: {
                'Content-Type': 'application/json'
              }
            });
            console.log('✅ Success with endpoint:', endpoint);
          } catch (error3) {
            console.log('❌ Failed with endpoint:', endpoint, error3.message);
            
            // Thử với hostApiClient như một fallback
            try {
              endpoint = '/houses (via hostApiClient)';
              console.log('🔍 Trying with hostApiClient as fallback');
              response = await hostApiClient.get('/houses', { 
                params,
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              console.log('✅ Success with hostApiClient fallback');
            } catch (error4) {
              console.log('❌ All endpoints failed, using mock data');
              throw new Error('All API endpoints failed');
            }
          }
        }
      }
      
      if (!response) {
        throw new Error('No response received from any endpoint');
      }
      
      console.log('✅ Public properties fetched successfully:', response.data);
      console.log('✅ Response structure:', {
        hasData: !!response.data,
        hasDataData: !!response.data?.data,
        hasContent: !!response.data?.content,
        dataType: typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : 'no data'
      });
      
      // Backend trả về ApiResponse format, cần extract data
      if (response.data && response.data.data) {
        console.log('✅ Extracting data from response.data.data');
        return {
          content: response.data.data,
          totalElements: response.data.data.length,
          totalPages: 1,
          size: response.data.data.length,
          number: 0
        };
      }
      
      // Nếu không có response.data.data, kiểm tra response.data trực tiếp
      if (response.data && Array.isArray(response.data)) {
        console.log('✅ Response.data is array, using directly');
        return {
          content: response.data,
          totalElements: response.data.length,
          totalPages: 1,
          size: response.data.length,
          number: 0
        };
      }
      
      // Nếu có response.data.content
      if (response.data && response.data.content) {
        console.log('✅ Extracting data from response.data.content');
        return {
          content: response.data.content,
          totalElements: response.data.content.length,
          totalPages: response.data.totalPages || 1,
          size: response.data.size || response.data.content.length,
          number: response.data.number || 0
        };
      }
      
      console.log('⚠️ No valid data structure found, returning response.data as is');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching public properties:', error);
      
      // Log chi tiết lỗi
      if (error.response) {
        console.error('❌ Response status:', error.response.status);
        console.error('❌ Response data:', error.response.data);
        console.error('❌ Response headers:', error.response.headers);
        console.error('❌ Response config:', error.response.config);
      } else if (error.request) {
        console.error('❌ Request was made but no response received:', error.request);
        console.error('❌ Request config:', error.config);
      } else {
        console.error('❌ Error setting up request:', error.message);
        console.error('❌ Error stack:', error.stack);
      }
      
      // Nếu API thất bại, trả về mock data
      console.warn('⚠️ Using mock data as fallback');
      return getMockProperties();
    }
  },

  // Lấy tất cả nhà (sử dụng hostApiClient - có thể cần đăng nhập)
  getAllProperties: async (params = {}) => {
    try {
      console.log('🔍 Fetching all properties with hostApiClient');
      const response = await hostApiClient.get('/houses', { params });
      console.log('✅ All properties fetched successfully:', response.data);
      
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
  }
};

// Hàm trả về mock data khi API chưa sẵn sàng
const getMockProperties = () => {
  return {
    content: [
      {
        id: 1,
        title: "Căn hộ cao cấp 2 phòng ngủ tại Quận 1",
        description: "Căn hộ cao cấp, view đẹp, tiện nghi đầy đủ, gần trung tâm thành phố",
        address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
        price: 15000000,
        area: 65,
        houseType: "APARTMENT",
        status: "ACTIVE",
        imageUrls: ["https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Can+ho+cao+cap"],
        hostId: 1
      },
      {
        id: 2,
        title: "Nhà phố 3 tầng tại Quận 7",
        description: "Nhà phố mới xây, 4 phòng ngủ, sân vườn rộng, phù hợp gia đình",
        address: "456 Lê Văn Việt, Quận 7, TP.HCM",
        price: 25000000,
        area: 120,
        houseType: "HOUSE",
        status: "ACTIVE",
        imageUrls: ["https://via.placeholder.com/300x200/10B981/FFFFFF?text=Nha+pho+3tang"],
        hostId: 2
      },
      {
        id: 3,
        title: "Studio 1 phòng tại Quận 3",
        description: "Studio hiện đại, phù hợp cho sinh viên hoặc người độc thân",
        address: "789 Võ Văn Tần, Quận 3, TP.HCM",
        price: 8000000,
        area: 35,
        houseType: "STUDIO",
        status: "ACTIVE",
        imageUrls: ["https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Studio+1PN"],
        hostId: 3
      },
      {
        id: 4,
        title: "Biệt thự 4 phòng ngủ tại Quận 2",
        description: "Biệt thự sang trọng, hồ bơi riêng, sân vườn rộng, view sông",
        address: "321 Mai Chí Thọ, Quận 2, TP.HCM",
        price: 45000000,
        area: 200,
        houseType: "VILLA",
        status: "ACTIVE",
        imageUrls: ["https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Biet+thu+4PN"],
        hostId: 4
      },
      {
        id: 5,
        title: "Căn hộ 3 phòng ngủ tại Quận 4",
        description: "Căn hộ view sông, gần chợ, trường học, bệnh viện",
        address: "654 Võ Văn Tần, Quận 4, TP.HCM",
        price: 18000000,
        area: 85,
        houseType: "APARTMENT",
        status: "ACTIVE",
        imageUrls: ["https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Can+ho+3PN"],
        hostId: 5
      },
      {
        id: 6,
        title: "Nhà trọ cao cấp tại Quận 8",
        description: "Nhà trọ cao cấp, có điều hòa, nóng lạnh, wifi, an ninh 24/7",
        address: "987 Hưng Phú, Quận 8, TP.HCM",
        price: 5000000,
        area: 25,
        houseType: "STUDIO",
        status: "ACTIVE",
        imageUrls: ["https://via.placeholder.com/300x200/06B6D4/FFFFFF?text=Nha+tro+cao+cap"],
        hostId: 6
      }
    ],
    totalElements: 6,
    totalPages: 1,
    size: 6,
    number: 0
  };
};

// Hàm trả về mock data cho host cụ thể
const getMockPropertiesForHost = (hostId) => {
  const mockHouses = [
    {
      id: 1,
      title: "Căn hộ 2 phòng ngủ tại Quận 1",
      description: "Căn hộ cao cấp, view đẹp, tiện nghi đầy đủ",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      price: 15000000,
      area: 65,
      houseType: "APARTMENT",
      status: "ACTIVE",
      imageUrls: ["https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Can+ho+2PN"],
      hostId: hostId
    },
    {
      id: 2,
      title: "Nhà phố 3 tầng tại Quận 7",
      description: "Nhà phố mới xây, 4 phòng ngủ, sân thượng rộng",
      address: "456 Lê Văn Việt, Quận 7, TP.HCM",
      price: 25000000,
      area: 120,
      houseType: "HOUSE",
      status: "ACTIVE",
      imageUrls: ["https://via.placeholder.com/300x200/10B981/FFFFFF?text=Nha+pho+3tang"],
      hostId: hostId
    },
    {
      id: 3,
      title: "Studio 1 phòng tại Quận 3",
      description: "Studio hiện đại, phù hợp cho sinh viên hoặc người độc thân",
      address: "789 Võ Văn Tần, Quận 3, TP.HCM",
      price: 8000000,
      area: 35,
      houseType: "STUDIO",
      status: "RENTED",
      imageUrls: ["https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Studio+1PN"],
      hostId: hostId
    }
  ];

  return {
    content: mockHouses,
    totalElements: mockHouses.length,
    totalPages: 1,
    size: mockHouses.length,
    number: 0
  };
};

export default propertyApi;
