const shopService = require('../services/shopService');
const { successResponse, paginatedResponse } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');
const { ValidationError } = require('../utils/errors');

const shopController = {
  /**
   * POST /api/shops
   */
  create: asyncHandler(async (req, res) => {
    const shop = await shopService.createShop(req.user.id, req.body);
    successResponse(res, shop, 'Shop created successfully. Pending verification', 201);
  }),
  
  /**
   * GET /api/shops/:id
   */
  getById: asyncHandler(async (req, res) => {
    const shop = await shopService.getShopById(
      req.params.id,
      req.user?.id,
      req.user?.role
    );
    successResponse(res, shop);
  }),
  
  /**
   * GET /api/shops/owner/me
   */
  getMyShops: asyncHandler(async (req, res) => {
    const shops = await shopService.getShopsByOwner(req.user.id);
    successResponse(res, shops);
  }),
  
  /**
   * PATCH /api/shops/:id
   */
  update: asyncHandler(async (req, res) => {
    const shop = await shopService.updateShop(req.params.id, req.user.id, req.body);
    successResponse(res, shop, 'Shop updated successfully');
  }),
  
  /**
   * GET /api/admin/shops
   */
  getAll: asyncHandler(async (req, res) => {
    const { status, isActive, page = 1, limit = 20 } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    
    const result = await shopService.getAllShops(filters, parseInt(page), parseInt(limit));
    
    paginatedResponse(res, result.shops, result.page, result.limit, result.total);
  }),
  
  /**
   * GET /api/admin/shops/pending
   */
  getPending: asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    
    const result = await shopService.getPendingShops(parseInt(page), parseInt(limit));
    
    paginatedResponse(res, result.shops, result.page, result.limit, result.total);
  }),
  
  /**
   * POST /api/admin/shops/:id/verify
   */
  verify: asyncHandler(async (req, res) => {
    const { action, rejectionReason } = req.body;
    
    const shop = await shopService.verifyShop(
      req.params.id,
      req.user.id,
      action,
      rejectionReason
    );
    
    successResponse(res, shop, `Shop ${action}ed successfully`);
  }),
  
  /**
   * PATCH /api/admin/shops/:id/disable
   */
  disable: asyncHandler(async (req, res) => {
    const { reason } = req.body;
    
    if (!reason) {
      throw new ValidationError('Reason is required');
    }
    
    const shop = await shopService.disableShop(req.params.id, reason);
    
    successResponse(res, shop, 'Shop disabled successfully');
  })
};

module.exports = shopController;
