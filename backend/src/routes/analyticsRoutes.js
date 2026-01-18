const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { getShopAnalytics, getPlatformAnalytics } = require('../controllers/analyticsController');

// Shop analytics (accessible by shop owner)
router.get('/shop/:shopId', authenticate, getShopAnalytics);

// Platform analytics (admin only)
router.get('/platform', authenticate, authorize('admin'), getPlatformAnalytics);

module.exports = router;
