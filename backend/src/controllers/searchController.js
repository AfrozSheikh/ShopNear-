const searchService = require('../services/searchService');
const { successResponse } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');
const { ValidationError } = require('../utils/errors');

const searchController = {
  /**
   * GET /api/search/products
   */
  searchProducts: asyncHandler(async (req, res) => {
    const { q, lat, lng, radius } = req.query;
    
    if (!q) {
      throw new ValidationError('Search query is required');
    }
    
    if (!lat || !lng) {
      throw new ValidationError('Location coordinates are required');
    }
    
    const results = await searchService.searchProducts(
      q,
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : undefined
    );
    
    successResponse(res, results);
  }),
  
  /**
   * GET /api/search/shops
   */
  searchShops: asyncHandler(async (req, res) => {
    const { lat, lng, radius, category } = req.query;
    
    if (!lat || !lng) {
      throw new ValidationError('Location coordinates are required');
    }
    
    const results = await searchService.searchShops(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : undefined,
      category
    );
    
    successResponse(res, results);
  }),
  
  /**
   * GET /api/search/categories
   */
  getCategories: asyncHandler(async (req, res) => {
    const { lat, lng, radius } = req.query;
    
    if (!lat || !lng) {
      throw new ValidationError('Location coordinates are required');
    }
    
    const categories = await searchService.getNearbyCategories(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : undefined
    );
    
    successResponse(res, categories);
  })
};

module.exports = searchController;
