const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  REFRESH: `${API_BASE_URL}/auth/refresh`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Shops
  SHOPS: `${API_BASE_URL}/shops`,
  MY_SHOPS: `${API_BASE_URL}/shops/owner/me`,
  ADMIN_SHOPS: `${API_BASE_URL}/shops/admin/all`,
  PENDING_SHOPS: `${API_BASE_URL}/shops/admin/pending`,
  
  // Products
  PRODUCTS: `${API_BASE_URL}/products`,
  
  // Inventory
  INVENTORY: `${API_BASE_URL}/inventory`,
  
  // Orders
  ORDERS: `${API_BASE_URL}/orders`,
  MY_ORDERS: `${API_BASE_URL}/orders/customer/me`,
  
  // Search
  SEARCH_PRODUCTS: `${API_BASE_URL}/search/products`,
  SEARCH_SHOPS: `${API_BASE_URL}/search/shops`,
  
  // Payments
  VERIFY_PAYMENT: `${API_BASE_URL}/payments/verify`,
};

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  SHOP_OWNER: 'shop_owner',
  CUSTOMER: 'customer',
};

// Order Status
export const ORDER_STATUS = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Shop Status
export const SHOP_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DISABLED: 'disabled',
};

export default {
  API_ENDPOINTS,
  ROLES,
  ORDER_STATUS,
  SHOP_STATUS,
};
