const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Shop = require('../models/Shop');
const { NotFoundError, ForbiddenError, ValidationError } = require('../utils/errors');
const { SHOP_STATUS, INVENTORY_ACTIONS } = require('../config/constants');

class ProductService {
  /**
   * Create product with initial inventory
   */
  async createProduct(userId, productData) {
    const { shopId, stockQuantity, ...productInfo } = productData;
    
    // Verify shop ownership
    const shop = await Shop.findById(shopId);
    if (!shop) {
      throw new NotFoundError('Shop');
    }
    
    if (shop.ownerId.toString() !== userId) {
      throw new ForbiddenError('You can only add products to your own shop');
    }
    
    if (shop.verificationStatus !== SHOP_STATUS.APPROVED) {
      throw new ValidationError('Shop must be approved before adding products');
    }
    
    // Create product
    const product = await Product.create({
      shopId,
      ...productInfo
    });
    
    // Create inventory
    const inventory = await Inventory.create({
      productId: product._id,
      shopId,
      stockQuantity: stockQuantity || 0,
      reservedQuantity: 0,
      availableQuantity: stockQuantity || 0,
      history: [{
        action: INVENTORY_ACTIONS.RESTOCK,
        quantity: stockQuantity || 0,
        previousStock: 0,
        newStock: stockQuantity || 0,
        reason: 'Initial stock',
        performedBy: userId,
        timestamp: new Date()
      }]
    });
    
    return { product, inventory };
  }
  
  /**
   * Get product by ID with inventory
   */
  async getProductById(productId) {
    const product = await Product.findById(productId).populate('shopId');
    
    if (!product || !product.isActive) {
      throw new NotFoundError('Product');
    }
    
    const inventory = await Inventory.findOne({ productId });
    
    return { product, inventory };
  }
  
  /**
   * Get products by shop
   */
  async getProductsByShop(shopId, filters = {}) {
    const query = { shopId, isActive: true };
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    const products = await Product.find(query);
    
    // Get inventory for all products
    const productIds = products.map(p => p._id);
    const inventories = await Inventory.find({ productId: { $in: productIds } });
    
    const inventoryMap = {};
    inventories.forEach(inv => {
      inventoryMap[inv.productId.toString()] = inv;
    });
    
    const productsWithInventory = products.map(product => {
      const productObj = product.toObject();
      return {
        ...productObj,
        inventory: inventoryMap[product._id.toString()]
      };
    });
    
    return productsWithInventory;
  }
  
  /**
   * Update product
   */
  async updateProduct(productId, userId, updates) {
    const product = await Product.findById(productId).populate('shopId');
    
    if (!product) {
      throw new NotFoundError('Product');
    }
    
    // Check ownership
    if (product.shopId.ownerId.toString() !== userId) {
      throw new ForbiddenError('You can only update your own products');
    }
    
    // Don't allow changing shopId
    delete updates.shopId;
    
    Object.assign(product, updates);
    await product.save();
    
    return product;
  }
  
  /**
   * Delete product (soft delete)
   */
  async deleteProduct(productId, userId) {
    const product = await Product.findById(productId).populate('shopId');
    
    if (!product) {
      throw new NotFoundError('Product');
    }
    
    // Check ownership
    if (product.shopId.ownerId.toString() !== userId) {
      throw new ForbiddenError('You can only delete your own products');
    }
    
    product.isActive = false;
    await product.save();
    
    // Also mark inventory as unavailable
    await Inventory.updateOne(
      { productId },
      { isAvailable: false }
    );
    
    return { message: 'Product deleted successfully' };
  }
}

module.exports = new ProductService();
