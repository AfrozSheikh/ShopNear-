const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

// Shop owner routes
router.post('/', authenticate, authorize(ROLES.SHOP_OWNER), shopController.create);
router.get('/owner/me', authenticate, authorize(ROLES.SHOP_OWNER), shopController.getMyShops);
router.patch('/:id', authenticate, authorize(ROLES.SHOP_OWNER), shopController.update);

// Public routes
router.get('/:id', shopController.getById);

// Admin routes
router.get('/admin/all', authenticate, authorize(ROLES.ADMIN), shopController.getAll);
router.get('/admin/pending', authenticate, authorize(ROLES.ADMIN), shopController.getPending);
router.post('/admin/:id/verify', authenticate, authorize(ROLES.ADMIN), shopController.verify);
router.patch('/admin/:id/disable', authenticate, authorize(ROLES.ADMIN), shopController.disable);

module.exports = router;
