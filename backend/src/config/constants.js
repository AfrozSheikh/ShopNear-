module.exports = {
  // User Roles
  ROLES: {
    ADMIN: 'admin',
    SHOP_OWNER: 'shop_owner',
    CUSTOMER: 'customer'
  },

  // Shop Verification Status
  SHOP_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    DISABLED: 'disabled'
  },

  // Order Status
  ORDER_STATUS: {
    REQUESTED: 'requested',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },

  // Payment Status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  },

  // Inventory Actions
  INVENTORY_ACTIONS: {
    RESTOCK: 'restock',
    SALE: 'sale',
    ADJUSTMENT: 'adjustment',
    RESERVE: 'reserve',
    RELEASE: 'release'
  },

  // Search
  DEFAULT_SEARCH_RADIUS: 10, // km
  MAX_SEARCH_RADIUS: 50, // km

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Order Timeouts
  AUTO_REJECT_ORDER_HOURS: 24,
  SHOP_DISABLE_COMPLETE_ORDER_HOURS: 24
};
