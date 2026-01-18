const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

// Customer routes
router.post('/verify', authenticate, authorize(ROLES.CUSTOMER), paymentController.verify);

// Webhook route (no authentication)
router.post('/webhooks/razorpay', paymentController.webhook);

module.exports = router;
