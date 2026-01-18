const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

// Shop owner routes
router.patch('/:productId', authenticate, authorize(ROLES.SHOP_OWNER), inventoryController.updateStock);
router.patch('/:productId/availability', authenticate, authorize(ROLES.SHOP_OWNER), inventoryController.toggleAvailability);

// Public routes
router.get('/:productId', inventoryController.getByProduct);

module.exports = router;
