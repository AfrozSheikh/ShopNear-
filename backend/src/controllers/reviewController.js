const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { successResponse, errorResponse } = require('../utils/response');

// Helper function to update product rating
const updateProductRating = async (productId) => {
  const { averageRating, totalReviews } = await Review.getAverageRating(productId);
  await Product.findByIdAndUpdate(productId, {
    averageRating: averageRating || 0,
    reviewCount: totalReviews || 0,
  });
};

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment, images, orderId } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return errorResponse(res, 'You have already reviewed this product', 400);
    }

    // Verify purchase if orderId provided
    let verified = false;
    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        customerId: userId,
        'items.productId': productId,
        status: 'completed',
      });
      verified = !!order;
    }

    const review = await Review.create({
      productId,
      userId,
      orderId,
      rating,
      title,
      comment,
      images: images || [],
      verified,
    });

    await review.populate('userId', 'profile.name');

    // Update product rating
    await updateProductRating(productId);

    return successResponse(res, review, 'Review created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const reviews = await Review.find({ productId })
      .populate('userId', 'profile.name')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Review.countDocuments({ productId });
    const averageRating = await Review.getAverageRating(productId);
    const distribution = await Review.getRatingDistribution(productId);

    return successResponse(res, {
      reviews,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
      stats: {
        averageRating: averageRating.averageRating,
        totalReviews: averageRating.totalReviews,
        distribution,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user.id;

    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) {
      return errorResponse(res, 'Review not found or unauthorized', 404);
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    if (images) review.images = images;

    await review.save();
    await review.populate('userId', 'profile.name');

    // Update product rating
    await updateProductRating(review.productId);

    return successResponse(res, review, 'Review updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) {
      return errorResponse(res, 'Review not found or unauthorized', 404);
    }

    const productId = review.productId;
    await review.deleteOne();

    // Update product rating
    await updateProductRating(productId);

    return successResponse(res, null, 'Review deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Mark review as helpful
exports.markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return errorResponse(res, 'Review not found', 404);
    }

    const index = review.helpful.indexOf(userId);
    if (index > -1) {
      // Already marked helpful, remove it
      review.helpful.splice(index, 1);
    } else {
      // Mark as helpful
      review.helpful.push(userId);
    }

    await review.save();

    return successResponse(res, {
      helpfulCount: review.helpful.length,
      isHelpful: index === -1,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ userId })
      .populate('productId', 'name images price')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ userId });

    return successResponse(res, {
      reviews,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
