const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Public search routes
router.get('/products', searchController.searchProducts);
router.get('/shops', searchController.searchShops);
router.get('/categories', searchController.getCategories);

module.exports = router;
