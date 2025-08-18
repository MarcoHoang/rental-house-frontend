import { publicApiClient } from './apiClient';

const favoriteApi = {
  // Toggle yêu thích (thêm/bỏ yêu thích)
  toggleFavorite: async (houseId) => {
    try {
      const response = await publicApiClient.post(`/favorites/${houseId}/toggle`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Kiểm tra xem nhà có được yêu thích không
  checkFavorite: async (houseId) => {
    try {
      const response = await publicApiClient.get(`/favorites/check/${houseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách ID nhà yêu thích của user
  getMyFavoriteHouseIds: async () => {
    try {
      const response = await publicApiClient.get('/favorites/my-favorites');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy số lượng yêu thích của một nhà
  getFavoriteCount: async (houseId) => {
    try {
      const response = await publicApiClient.get(`/favorites/${houseId}/count`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default favoriteApi;
