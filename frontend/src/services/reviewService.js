import api from './api';

// Review service functions
const reviewService = {
  // Create review
  createReview: async (reviewData) => {
    return await api.post('/reviews', reviewData);
  },

  // Get product reviews
  getProductReviews: async (productId, params = {}) => {
    return await api.get(`/reviews/product/${productId}`, { params });
  },

  // Get my reviews
  getMyReviews: async (params = {}) => {
    return await api.get('/reviews/my-reviews', { params });
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    return await api.put(`/reviews/${reviewId}`, reviewData);
  },

  // Delete review
  deleteReview: async (reviewId) => {
    return await api.delete(`/reviews/${reviewId}`);
  },

  // Mark review as helpful
  markHelpful: async (reviewId) => {
    return await api.post(`/reviews/${reviewId}/helpful`);
  },
};

export default reviewService;
