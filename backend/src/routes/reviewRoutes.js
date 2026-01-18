const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  markHelpful,
  getUserReviews,
} = require('../controllers/reviewController');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.use(authenticate);
router.post('/', createReview);
router.get('/my-reviews', getUserReviews);
router.put('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);
router.post('/:reviewId/helpful', markHelpful);

module.exports = router;
