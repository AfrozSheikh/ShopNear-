const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const User = require('../models/User');

// Get shop analytics
exports.getShopAnalytics = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Total revenue
    const revenueData = await Order.aggregate([
      { 
        $match: { 
          shopId: new mongoose.Types.ObjectId(shopId),
          paymentStatus: 'paid',
          ...dateFilter 
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $match: { shopId: new mongoose.Types.ObjectId(shopId), ...dateFilter } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { $match: { shopId: new mongoose.Types.ObjectId(shopId), ...dateFilter } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    ]);

    // Sales over time (daily)
    const salesChart = await Order.aggregate([
      { $match: { shopId: new mongoose.Types.ObjectId(shopId), ...dateFilter } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Total orders count
    const totalOrders = await Order.countDocuments({ shopId: new mongoose.Types.ObjectId(shopId), ...dateFilter });

    res.json({
      success: true,
      data: {
        totalRevenue: revenueData[0]?.total || 0,
        totalOrders,
        ordersByStatus,
        topProducts,
        salesChart,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message,
    });
  }
};

// Get admin platform analytics
exports.getPlatformAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalShops = await Shop.countDocuments({ verificationStatus: 'approved' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingShops = await Shop.countDocuments({ verificationStatus: 'pending' });

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Revenue over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueChart = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Recent activity
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('customerId', 'profile.name email')
      .populate('shopId', 'name');

    // Top shops by revenue
    const topShops = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: '$shopId',
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'shops',
          localField: '_id',
          foreignField: '_id',
          as: 'shop',
        },
      },
      { $unwind: { path: '$shop', preserveNullAndEmptyArrays: true } },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalShops,
        totalProducts,
        totalOrders,
        pendingShops,
        totalRevenue: totalRevenue[0]?.total || 0,
        revenueChart,
        recentActivity: recentOrders,
        topShops,
      },
    });
  } catch (error) {
    console.error('Platform analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platform analytics',
      error: error.message,
    });
  }
};


