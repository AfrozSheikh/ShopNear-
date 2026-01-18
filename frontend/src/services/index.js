import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const authService = {
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    return response.data;
  },

  logout: async (refreshToken) => {
    const response = await api.post(API_ENDPOINTS.LOGOUT, { refreshToken });
    return response.data;
  },
};

export const shopService = {
  createShop: async (shopData) => {
    const response = await api.post(API_ENDPOINTS.SHOPS, shopData);
    return response.data;
  },

  getMyShops: async () => {
    const response = await api.get(API_ENDPOINTS.MY_SHOPS);
    return response.data;
  },

  updateShop: async (shopId, updates) => {
    const response = await api.patch(`${API_ENDPOINTS.SHOPS}/${shopId}`, updates);
    return response.data;
  },

  getPendingShops: async (page = 1) => {
    const response = await api.get(`${API_ENDPOINTS.PENDING_SHOPS}?page=${page}`);
    return response.data;
  },

  getAllShops: async (params = {}) => {
    const response = await api.get(`${API_ENDPOINTS.SHOPS}/admin/all`, { params });
    return response.data;
  },

  verifyShop: async (shopId, action, rejectionReason = '') => {
    const response = await api.post(`${API_ENDPOINTS.SHOPS}/admin/${shopId}/verify`, {
      action,
      rejectionReason,
    });
    return response.data;
  },

  getShopById: async (shopId) => {
    const response = await api.get(`${API_ENDPOINTS.SHOPS}/${shopId}`);
    return response.data;
  },
};

export const productService = {
  createProduct: async (productData) => {
    const response = await api.post(API_ENDPOINTS.PRODUCTS, productData);
    return response.data;
  },

  getShopProducts: async (shopId) => {
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/shop/${shopId}`);
    return response.data;
  },

  getProductById: async (productId) => {
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
    return response.data;
  },

  updateProduct: async (productId, updates) => {
    const response = await api.patch(`${API_ENDPOINTS.PRODUCTS}/${productId}`, updates);
    return response.data;
  },

  deleteProduct: async (productId) => {
    const response = await api.delete(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
    return response.data;
  },
};

export const inventoryService = {
  updateStock: async (productId, action, quantity, reason) => {
    const response = await api.patch(`${API_ENDPOINTS.INVENTORY}/${productId}`, {
      action,
      quantity,
      reason,
    });
    return response.data;
  },

  toggleAvailability: async (productId, isAvailable) => {
    const response = await api.patch(`${API_ENDPOINTS.INVENTORY}/${productId}/availability`, {
      isAvailable,
    });
    return response.data;
  },
};

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post(API_ENDPOINTS.ORDERS, orderData);
    return response.data;
  },

  getMyOrders: async (page = 1, status = '') => {
    const url = status 
      ? `${API_ENDPOINTS.MY_ORDERS}?page=${page}&status=${status}`
      : `${API_ENDPOINTS.MY_ORDERS}?page=${page}`;
    const response = await api.get(url);
    return response.data;
  },

  getShopOrders: async (shopId, page = 1, status = '') => {
    const url = status
      ? `${API_ENDPOINTS.ORDERS}/shop/${shopId}?page=${page}&status=${status}`
      : `${API_ENDPOINTS.ORDERS}/shop/${shopId}?page=${page}`;
    const response = await api.get(url);
    return response.data;
  },

  acceptOrder: async (orderId) => {
    const response = await api.patch(`${API_ENDPOINTS.ORDERS}/${orderId}/accept`);
    return response.data;
  },

  rejectOrder: async (orderId, reason) => {
    const response = await api.patch(`${API_ENDPOINTS.ORDERS}/${orderId}/reject`, {
      rejectionReason: reason,
    });
    return response.data;
  },

  completeOrder: async (orderId) => {
    const response = await api.patch(`${API_ENDPOINTS.ORDERS}/${orderId}/complete`);
    return response.data;
  },

  cancelOrder: async (orderId) => {
    const response = await api.patch(`${API_ENDPOINTS.ORDERS}/${orderId}/cancel`);
    return response.data;
  },
};

export const searchService = {
  searchProducts: async (query, lat, lng, radius = 10) => {
    const response = await api.get(
      `${API_ENDPOINTS.SEARCH_PRODUCTS}?q=${query}&lat=${lat}&lng=${lng}&radius=${radius}`
    );
    return response.data;
  },

  searchShops: async (lat, lng, radius = 10, category = '') => {
    const url = category
      ? `${API_ENDPOINTS.SEARCH_SHOPS}?lat=${lat}&lng=${lng}&radius=${radius}&category=${category}`
      : `${API_ENDPOINTS.SEARCH_SHOPS}?lat=${lat}&lng=${lng}&radius=${radius}`;
    const response = await api.get(url);
    return response.data;
  },
};

export const reviewService = {
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  getProductReviews: async (productId, params = {}) => {
    const response = await api.get(`/reviews/product/${productId}`, { params });
    return response.data;
  },

  getMyReviews: async (params = {}) => {
    const response = await api.get('/reviews/my-reviews', { params });
    return response.data;
  },

  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  markHelpful: async (reviewId) => {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  },
};
