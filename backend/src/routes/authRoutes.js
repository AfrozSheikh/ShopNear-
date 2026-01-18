const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes with rate limiting
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);

// Token management
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Session validation
const authenticate = require('../middleware/authMiddleware');
router.get('/validate', authenticate, authController.validate);

// Password reset with OTP
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
