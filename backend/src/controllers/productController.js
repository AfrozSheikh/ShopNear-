const productService = require('../services/productService');
const { successResponse } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');

const productController = {
  /**
   * POST /api/products
   */
  create: asyncHandler(async (req, res) => {
    const result = await productService.createProduct(req.user.id, req.body);
    successResponse(res, result, 'Product created successfully', 201);
  }),
  
  /**
   * GET /api/products/:id
   */
  getById: asyncHandler(async (req, res) => {
    const result = await productService.getProductById(req.params.id);
    successResponse(res, result);
  }),
  
  /**
   * GET /api/shops/:shopId/products
   */
  getByShop: asyncHandler(async (req, res) => {
    const { category } = req.query;
    const filters = {};
    if (category) filters.category = category;
    
    const products = await productService.getProductsByShop(req.params.shopId, filters);
    successResponse(res, products);
  }),
  
  /**
   * PATCH /api/products/:id
   */
  update: asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.user.id, req.body);
    successResponse(res, product, 'Product updated successfully');
  }),
  
  /**
   * DELETE /api/products/:id
   */
  delete: asyncHandler(async (req, res) => {
    const result = await productService.deleteProduct(req.params.id, req.user.id);
    successResponse(res, result);
  })
};

module.exports = productController;
