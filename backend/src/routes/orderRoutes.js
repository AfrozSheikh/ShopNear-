const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

// Customer routes
router.post('/', authenticate, authorize(ROLES.CUSTOMER), orderController.create);
router.get('/customer/me', authenticate, authorize(ROLES.CUSTOMER), orderController.getMyOrders);
router.patch('/:id/cancel', authenticate, authorize(ROLES.CUSTOMER), orderController.cancel);

// Shop owner routes
router.get('/shop/:shopId', authenticate, authorize(ROLES.SHOP_OWNER), orderController.getShopOrders);
router.patch('/:id/accept', authenticate, authorize(ROLES.SHOP_OWNER), orderController.accept);
router.patch('/:id/reject', authenticate, authorize(ROLES.SHOP_OWNER), orderController.reject);
router.patch('/:id/complete', authenticate, authorize(ROLES.SHOP_OWNER), orderController.complete);

// Common routes
router.get('/:id', authenticate, orderController.getById);

module.exports = router;
