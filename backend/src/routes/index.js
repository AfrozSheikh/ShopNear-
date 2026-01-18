const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./authRoutes');
const shopRoutes = require('./shopRoutes');
const productRoutes = require('./productRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const orderRoutes = require('./orderRoutes');
const searchRoutes = require('./searchRoutes');
const paymentRoutes = require('./paymentRoutes');
const reviewRoutes = require('./reviewRoutes');
const analyticsRoutes = require('./analyticsRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/shops', shopRoutes);
router.use('/products', productRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/orders', orderRoutes);
router.use('/search', searchRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/analytics', analyticsRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
