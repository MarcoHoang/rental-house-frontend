import { publicApiClient, hostApiClient } from './apiClient';

const reviewApi = {
  // Lấy tất cả đánh giá của một nhà
  getHouseReviews: async (houseId) => {
    try {
      console.log('reviewApi - getHouseReviews called with houseId:', houseId);
      const response = await publicApiClient.get(`/reviews/house/${houseId}`);
      console.log('reviewApi - getHouseReviews response:', response);
      return response.data;
    } catch (error) {
      console.error('reviewApi - Error fetching house reviews:', error);
      return { data: [] };
    }
  },

  // Lấy tất cả đánh giá của một nhà (bao gồm ẩn) - cho host/admin
  getAllHouseReviews: async (houseId) => {
    try {
      console.log('reviewApi - getAllHouseReviews called with houseId:', houseId);
      const response = await hostApiClient.get(`/reviews/house/${houseId}/all`);
      console.log('reviewApi - getAllHouseReviews response:', response);
      return response.data;
    } catch (error) {
      console.error('reviewApi - Error fetching all house reviews:', error);
      return { data: [] };
    }
  },

  // Lấy tất cả đánh giá
  getAllReviews: async () => {
    try {
      console.log('reviewApi - getAllReviews called');
      const response = await publicApiClient.get('/reviews');
      console.log('reviewApi - getAllReviews response:', response);
      return response.data;
    } catch (error) {
      console.error('reviewApi - Error fetching all reviews:', error);
      return { data: [] };
    }
  },

  // Tạo đánh giá mới
  createReview: async (reviewData) => {
    try {
      console.log('reviewApi - createReview called with data:', reviewData);
      const requestBody = {
        reviewerId: reviewData.reviewerId,
        houseId: reviewData.houseId,
        rating: reviewData.rating,
        comment: reviewData.comment
      };
      
      console.log('reviewApi - createReview request body:', requestBody);
      const response = await publicApiClient.post('/reviews', requestBody);
      console.log('reviewApi - createReview response:', response);
      return response.data;
    } catch (error) {
      console.error('reviewApi - Error creating review:', error);
      throw error;
    }
  },

  // Cập nhật đánh giá
  updateReview: async (reviewId, reviewData) => {
    try {
      console.log('reviewApi - updateReview called with reviewId:', reviewId, 'data:', reviewData);
      const response = await publicApiClient.put(`/reviews/${reviewId}`, {
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      console.log('reviewApi - updateReview response:', response);
      return response.data;
    } catch (error) {
      console.error('reviewApi - Error updating review:', error);
      throw error;
    }
  },

  // Xóa đánh giá
  deleteReview: async (reviewId) => {
    try {
      console.log('reviewApi - deleteReview called with reviewId:', reviewId);
      const response = await publicApiClient.delete(`/reviews/${reviewId}`);
      console.log('reviewApi - deleteReview response:', response);
      return response.data;
    } catch (error) {
      console.error('reviewApi - Error deleting review:', error);
      throw error;
    }
  },

  // Xóa đánh giá (cho host/admin)
  deleteReviewAsHost: async (reviewId) => {
    try {
      console.log('reviewApi - deleteReviewAsHost called with reviewId:', reviewId);
      const response = await hostApiClient.delete(`/reviews/${reviewId}`);
      console.log('reviewApi - deleteReviewAsHost response:', response);
      return response.data;
    } catch (error) {
      console.error('reviewApi - Error deleting review as host:', error);
      throw error;
    }
  },

  // Kiểm tra xem user đã đánh giá nhà này chưa
  checkUserReview: async (houseId, userId) => {
    try {
      console.log('reviewApi - checkUserReview called with houseId:', houseId, 'userId:', userId);
      // Sử dụng API để kiểm tra
      const response = await publicApiClient.get(`/reviews/house/${houseId}`);
      console.log('reviewApi - checkUserReview response:', response);
      const reviews = response.data?.data || [];
      const userReview = reviews.find(review => review.reviewerId === userId);
      console.log('reviewApi - checkUserReview found user review:', userReview);
      return { exists: !!userReview };
    } catch (error) {
      console.error('reviewApi - Error checking user review:', error);
      return { exists: false };
    }
  },

  // Lấy đánh giá của user cho một nhà cụ thể
  getUserReview: async (houseId, userId) => {
    try {
      console.log('reviewApi - getUserReview called with houseId:', houseId, 'userId:', userId);
      const response = await publicApiClient.get(`/reviews/house/${houseId}`);
      console.log('reviewApi - getUserReview response:', response);
      const reviews = response.data?.data || [];
      const userReview = reviews.find(review => review.reviewerId === userId);
      console.log('reviewApi - getUserReview found user review:', userReview);
      return { data: userReview || null };
    } catch (error) {
      console.error('reviewApi - Error fetching user review:', error);
      return { data: null };
    }
  },

  // Toggle review visibility (admin/host only)
  toggleReviewVisibility: async (reviewId) => {
    try {
      console.log('reviewApi - toggleReviewVisibility called with reviewId:', reviewId);
      const response = await hostApiClient.put(`/reviews/${reviewId}/toggle-visibility`);
      console.log('reviewApi - toggleReviewVisibility response:', response);
      return response.data;
    } catch (error) {
      console.error('reviewApi - Error toggling review visibility:', error);
      throw error;
    }
  },

  // Lấy đánh giá theo ID
  getReviewById: async (reviewId) => {
    try {
      console.log('reviewApi - getReviewById called with reviewId:', reviewId);
      const response = await publicApiClient.get(`/reviews/${reviewId}`);
      console.log('reviewApi - getReviewById response:', response);
      return response.data;
    } catch (error) {
      console.error('reviewApi - Error fetching review by ID:', error);
      throw error;
    }
  }
};

export default reviewApi;
