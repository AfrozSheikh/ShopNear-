const mongoose = require('mongoose');
const User = require('./User'); // Ensure User model is loaded

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    images: [
      {
        type: String,
      },
    ],
    helpful: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Virtual for helpful count
reviewSchema.virtual('helpfulCount').get(function () {
  return this.helpful.length;
});

// Static method to calculate average rating for a product
reviewSchema.statics.getAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { productId: mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  return result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };
};

// Static method to get rating distribution
reviewSchema.statics.getRatingDistribution = async function (productId) {
  const distribution = await this.aggregate([
    { $match: { productId: mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  const result = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  distribution.forEach((item) => {
    result[item._id] = item.count;
  });

  return result;
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
