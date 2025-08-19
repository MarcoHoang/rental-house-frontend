import { publicApiClient } from './apiClient';
import { getHouseById } from './houseApi';

const favoriteApi = {
  // Toggle yêu thích (thêm/bỏ yêu thích)
  toggleFavorite: async (houseId) => {
    try {
      const response = await publicApiClient.post(`/favorites/${houseId}/toggle`);
      console.log('Toggle favorite API response:', response);
      return response.data;
    } catch (error) {
      console.error('Toggle favorite API error:', error);
      throw error;
    }
  },

  // Kiểm tra xem nhà có được yêu thích không
  checkFavorite: async (houseId) => {
    try {
      const response = await publicApiClient.get(`/favorites/check/${houseId}`);
      console.log('Check favorite API response:', response);
      return response.data;
    } catch (error) {
      console.error('Check favorite API error:', error);
      throw error;
    }
  },

  // Lấy danh sách ID nhà yêu thích của user
  getMyFavoriteHouseIds: async () => {
    try {
      const response = await publicApiClient.get('/favorites/my-favorites');
      console.log('Get favorite house IDs API response:', response);
      return response.data;
    } catch (error) {
      console.error('Get favorite house IDs API error:', error);
      throw error;
    }
  },

  // Lấy danh sách nhà yêu thích với thông tin chi tiết
  getMyFavoriteHouses: async () => {
    try {
      // Lấy danh sách ID nhà yêu thích
      const favoriteIdsResponse = await publicApiClient.get('/favorites/my-favorites');
      console.log('Favorite IDs response:', favoriteIdsResponse);
      
      const favoriteIds = favoriteIdsResponse.data?.data || [];
      console.log('Favorite IDs:', favoriteIds);
      
      if (favoriteIds.length === 0) {
        return { data: [] };
      }

      // Lấy thông tin chi tiết của từng nhà
      const housesPromises = favoriteIds.map(async (houseId) => {
        try {
          const houseResponse = await getHouseById(houseId);
          console.log(`House ${houseId} response:`, houseResponse);
          
          if (houseResponse && houseResponse.data) {
            return {
              ...houseResponse.data,
              isFavorite: true
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching house ${houseId}:`, error);
          return null;
        }
      });

      const houses = await Promise.all(housesPromises);
      const validHouses = houses.filter(house => house !== null);
      console.log('Valid houses:', validHouses);

      return { data: validHouses };
    } catch (error) {
      console.error('Error in getMyFavoriteHouses:', error);
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
