const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const { NotFoundError, ForbiddenError, ValidationError } = require('../utils/errors');
const { INVENTORY_ACTIONS } = require('../config/constants');
const mongoose = require('mongoose');

class InventoryService {
  /**
   * Get inventory for a product
   */
  async getInventory(productId) {
    const inventory = await Inventory.findOne({ productId }).populate('productId');
    
    if (!inventory) {
      throw new NotFoundError('Inventory');
    }
    
    return inventory;
  }
  
  /**
   * Update stock quantity (restock or adjustment)
   */
  async updateStock(productId, userId, action, quantity, reason) {
    const inventory = await Inventory.findOne({ productId }).populate({
      path: 'productId',
      populate: { path: 'shopId' }
    });
    
    if (!inventory) {
      throw new NotFoundError('Inventory');
    }
    
    // Check ownership
    const shop = inventory.productId.shopId;
    if (shop.ownerId.toString() !== userId) {
      throw new ForbiddenError('You can only update inventory for your own products');
    }
    
    const previousStock = inventory.stockQuantity;
    let newStock = previousStock;
    
    if (action === INVENTORY_ACTIONS.RESTOCK) {
      newStock = previousStock + quantity;
    } else if (action === INVENTORY_ACTIONS.ADJUSTMENT) {
      newStock = quantity; // Set absolute value
    } else {
      throw new ValidationError('Invalid action. Use "restock" or "adjustment"');
    }
    
    if (newStock < 0) {
      throw new ValidationError('Stock quantity cannot be negative');
    }
    
    inventory.stockQuantity = newStock;
    inventory.availableQuantity = newStock - inventory.reservedQuantity;
    
    if (action === INVENTORY_ACTIONS.RESTOCK) {
      inventory.lastRestockedAt = new Date();
    }
    
    // Add to history
    inventory.history.push({
      action,
      quantity: action === INVENTORY_ACTIONS.RESTOCK ? quantity : (newStock - previousStock),
      previousStock,
      newStock,
      reason,
      performedBy: userId,
      timestamp: new Date()
    });
    
    await inventory.save();
    
    return inventory;
  }
  
  /**
   * Toggle availability
   */
  async toggleAvailability(productId, userId, isAvailable) {
    const inventory = await Inventory.findOne({ productId }).populate({
      path: 'productId',
      populate: { path: 'shopId' }
    });
    
    if (!inventory) {
      throw new NotFoundError('Inventory');
    }
    
    // Check ownership
    const shop = inventory.productId.shopId;
    if (shop.ownerId.toString() !== userId) {
      throw new ForbiddenError('You can only update inventory for your own products');
    }
    
    inventory.isAvailable = isAvailable;
    await inventory.save();
    
    return inventory;
  }
  
  /**
   * Reserve inventory (used during order creation)
   * Uses transaction to prevent race conditions
   */
  async reserveInventory(items, session) {
    for (const item of items) {
      const result = await Inventory.findOneAndUpdate(
        {
          productId: item.productId,
          availableQuantity: { $gte: item.quantity }
        },
        {
          $inc: {
            reservedQuantity: item.quantity,
            availableQuantity: -item.quantity
          },
          $push: {
            history: {
              action: INVENTORY_ACTIONS.RESERVE,
              quantity: item.quantity,
              reason: `Order: ${item.orderNumber}`,
              timestamp: new Date()
            }
          }
        },
        { session, new: true }
      );
      
      if (!result) {
        throw new ValidationError(`Insufficient stock for ${item.productName}`);
      }
    }
  }
  
  /**
   * Convert reservation to sale (when order is accepted)
   */
  async processSale(items, session) {
    for (const item of items) {
      await Inventory.findOneAndUpdate(
        { productId: item.productId },
        {
          $inc: {
            stockQuantity: -item.quantity,
            reservedQuantity: -item.quantity
          },
          $push: {
            history: {
              action: INVENTORY_ACTIONS.SALE,
              quantity: -item.quantity,
              reason: `Order: ${item.orderNumber}`,
              timestamp: new Date()
            }
          },
          lastSoldAt: new Date()
        },
        { session }
      );
    }
  }
  
  /**
   * Release reserved inventory (when order is rejected/cancelled)
   */
  async releaseReservation(items, session = null) {
    const options = session ? { session } : {};
    
    for (const item of items) {
      await Inventory.findOneAndUpdate(
        { productId: item.productId },
        {
          $inc: {
            reservedQuantity: -item.quantity,
            availableQuantity: item.quantity
          },
          $push: {
            history: {
              action: INVENTORY_ACTIONS.RELEASE,
              quantity: item.quantity,
              reason: `Order cancelled/rejected: ${item.orderNumber}`,
              timestamp: new Date()
            }
          }
        },
        options
      );
    }
  }
}

module.exports = new InventoryService();
