import { publicApiClient, hostApiClient } from './apiClient';

const reviewApi = {
  // Lấy tất cả đánh giá của một nhà
  getHouseReviews: async (houseId) => {
    try {
      const response = await publicApiClient.get(`/reviews/house/${houseId}`);
      console.log('Getting reviews from API:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching house reviews:', error);
      // Fallback to empty array
      return { data: [] };
    }
  },

  // Tạo đánh giá mới
  createReview: async (reviewData) => {
    try {
      console.log('Creating review:', reviewData);
      console.log('API endpoint: /reviews');
      
      const requestBody = {
        reviewerId: reviewData.userId,
        houseId: reviewData.houseId,
        rating: reviewData.rating,
        comment: reviewData.comment
      };
      
      console.log('Request body:', requestBody);
      console.log('Request body types:', {
        reviewerId: typeof requestBody.reviewerId,
        houseId: typeof requestBody.houseId,
        rating: typeof requestBody.rating,
        comment: typeof requestBody.comment
      });
      console.log('Request body values:', {
        reviewerId: requestBody.reviewerId,
        houseId: requestBody.houseId,
        rating: requestBody.rating,
        comment: requestBody.comment
      });
      
      const response = await publicApiClient.post('/reviews', requestBody);
      
      console.log('Review created successfully:', response);
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },

  // Cập nhật đánh giá
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await publicApiClient.put(`/reviews/${reviewId}`, {
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      
      console.log('Review updated successfully:', response);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  // Xóa đánh giá
  deleteReview: async (reviewId) => {
    try {
      const response = await publicApiClient.delete(`/reviews/${reviewId}`);
      console.log('Review deleted successfully:', response);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  // Kiểm tra xem user đã đánh giá nhà này chưa
  checkUserReview: async (houseId, userId) => {
    try {
      // Sử dụng API để kiểm tra
      const response = await publicApiClient.get(`/reviews/house/${houseId}`);
      const reviews = response.data?.data || [];
      const userReview = reviews.find(review => review.reviewerId === userId);
      return { exists: !!userReview };
    } catch (error) {
      console.error('Error checking user review:', error);
      return { exists: false };
    }
  },

  // Lấy đánh giá của user cho một nhà cụ thể
  getUserReview: async (houseId, userId) => {
    try {
      const response = await publicApiClient.get(`/reviews/house/${houseId}`);
      const reviews = response.data?.data || [];
      const userReview = reviews.find(review => review.reviewerId === userId);
      return { data: userReview || null };
    } catch (error) {
      console.error('Error fetching user review:', error);
      return { data: null };
    }
  }
};

export default reviewApi;
