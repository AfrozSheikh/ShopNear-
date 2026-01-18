const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

// Shop owner routes
router.post('/', authenticate, authorize(ROLES.SHOP_OWNER), productController.create);
router.patch('/:id', authenticate, authorize(ROLES.SHOP_OWNER), productController.update);
router.delete('/:id', authenticate, authorize(ROLES.SHOP_OWNER), productController.delete);

// Public routes
router.get('/:id', productController.getById);
router.get('/shop/:shopId', productController.getByShop);

module.exports = router;
