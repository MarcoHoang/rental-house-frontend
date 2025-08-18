import { hostApiClient } from './apiClient';

const houseImageApi = {
  // Lấy danh sách ảnh của một nhà
  getHouseImages: async (houseId) => {
    try {
      const response = await hostApiClient.get(`/house-images/house/${houseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Thêm ảnh mới cho nhà
  addHouseImage: async (houseId, imageUrl) => {
    try {
      const response = await hostApiClient.post(`/house-images/house/${houseId}`, null, {
        params: { imageUrl }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa ảnh theo ID
  deleteHouseImage: async (imageId, houseId) => {
    try {
      const response = await hostApiClient.delete(`/house-images/${imageId}/house/${houseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thứ tự sắp xếp của các ảnh
  updateImageOrder: async (houseId, imageIds) => {
    try {
      const response = await hostApiClient.put(`/house-images/house/${houseId}/order`, {
        imageIds
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa tất cả ảnh của một nhà
  deleteAllHouseImages: async (houseId) => {
    try {
      const response = await hostApiClient.delete(`/house-images/house/${houseId}/all`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Debug endpoint - chỉ dùng trong development
  debugHouseImages: async (houseId) => {
    try {
      const response = await hostApiClient.get(`/house-images/debug/house/${houseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default houseImageApi;
