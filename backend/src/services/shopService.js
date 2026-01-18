const Shop = require('../models/Shop');
const { SHOP_STATUS, ROLES } = require('../config/constants');
const { NotFoundError, ForbiddenError, ValidationError } = require('../utils/errors');

class ShopService {
  /**
   * Create a new shop
   */
  async createShop(ownerId, shopData) {
    const shop = await Shop.create({
      ownerId,
      ...shopData,
      verificationStatus: SHOP_STATUS.PENDING
    });
    
    return shop;
  }
  
  /**
   * Get shop by ID
   */
  async getShopById(shopId, userId = null, userRole = null) {
    const shop = await Shop.findById(shopId).populate('ownerId', 'email profile');
    
    if (!shop) {
      throw new NotFoundError('Shop');
    }
    
    // Only show approved shops to non-owners/non-admins
    if (userRole !== ROLES.ADMIN && 
        shop.ownerId._id.toString() !== userId && 
        shop.verificationStatus !== SHOP_STATUS.APPROVED) {
      throw new NotFoundError('Shop');
    }
    
    return shop;
  }
  
  /**
   * Get shops owned by a user
   */
  async getShopsByOwner(ownerId) {
    const shops = await Shop.find({ ownerId });
    return shops;
  }
  
  /**
   * Update shop
   */
  async updateShop(shopId, userId, updates) {
    const shop = await Shop.findById(shopId);
    
    if (!shop) {
      throw new NotFoundError('Shop');
    }
    
    // Check ownership
    if (shop.ownerId.toString() !== userId) {
      throw new ForbiddenError('You can only update your own shop');
    }
    
    // Don't allow updating verification-related fields
    delete updates.verificationStatus;
    delete updates.verifiedAt;
    delete updates.verifiedBy;
    delete updates.ownerId;
    
    Object.assign(shop, updates);
    await shop.save();
    
    return shop;
  }
  
  /**
   * Get pending shops for verification (Admin)
   */
  async getPendingShops(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [shops, total] = await Promise.all([
      Shop.find({ verificationStatus: SHOP_STATUS.PENDING })
        .populate('ownerId', 'email profile')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Shop.countDocuments({ verificationStatus: SHOP_STATUS.PENDING })
    ]);
    
    return { shops, total, page, limit };
  }
  
  /**
   * Verify shop (Admin)
   */
  async verifyShop(shopId, adminId, action, rejectionReason = null) {
    const shop = await Shop.findById(shopId);
    
    if (!shop) {
      throw new NotFoundError('Shop');
    }
    
    if (shop.verificationStatus !== SHOP_STATUS.PENDING) {
      throw new ValidationError('Shop is already verified or rejected');
    }
    
    if (action === 'approve') {
      shop.verificationStatus = SHOP_STATUS.APPROVED;
      shop.verifiedAt = new Date();
      shop.verifiedBy = adminId;
    } else if (action === 'reject') {
      if (!rejectionReason) {
        throw new ValidationError('Rejection reason is required');
      }
      shop.verificationStatus = SHOP_STATUS.REJECTED;
      shop.rejectionReason = rejectionReason;
    } else {
      throw new ValidationError('Invalid action. Use "approve" or "reject"');
    }
    
    await shop.save();
    return shop;
  }
  
  /**
   * Disable shop (Admin)
   */
  async disableShop(shopId, reason) {
    const shop = await Shop.findById(shopId);
    
    if (!shop) {
      throw new NotFoundError('Shop');
    }
    
    shop.isActive = false;
    shop.disableReason = reason;
    shop.verificationStatus = SHOP_STATUS.DISABLED;
    await shop.save();
    
    // TODO: Handle pending orders (reject and refund)
    
    return shop;
  }
  
  /**
   * Get all shops with filters (Admin)
   */
  async getAllShops(filters = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const query = {};
    
    if (filters.status) {
      query.verificationStatus = filters.status;
    }
    
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    
    const [shops, total] = await Promise.all([
      Shop.find(query)
        .populate('ownerId', 'email profile')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Shop.countDocuments(query)
    ]);
    
    return { shops, total, page, limit };
  }
}

module.exports = new ShopService();
