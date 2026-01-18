const inventoryService = require('../services/inventoryService');
const { successResponse } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');
const { ValidationError } = require('../utils/errors');

const inventoryController = {
  /**
   * GET /api/inventory/:productId
   */
  getByProduct: asyncHandler(async (req, res) => {
    const inventory = await inventoryService.getInventory(req.params.productId);
    successResponse(res, inventory);
  }),
  
  /**
   * PATCH /api/inventory/:productId
   */
  updateStock: asyncHandler(async (req, res) => {
    const { action, quantity, reason } = req.body;
    
    if (!action || quantity === undefined || !reason) {
      throw new ValidationError('Action, quantity, and reason are required');
    }
    
    const inventory = await inventoryService.updateStock(
      req.params.productId,
      req.user.id,
      action,
      parseInt(quantity),
      reason
    );
    
    successResponse(res, inventory, 'Inventory updated successfully');
  }),
  
  /**
   * PATCH /api/inventory/:productId/availability
   */
  toggleAvailability: asyncHandler(async (req, res) => {
    const { isAvailable } = req.body;
    
    if (isAvailable === undefined) {
      throw new ValidationError('isAvailable is required');
    }
    
    const inventory = await inventoryService.toggleAvailability(
      req.params.productId,
      req.user.id,
      isAvailable
    );
    
    successResponse(res, inventory, 'Availability updated successfully');
  })
};

module.exports = inventoryController;
