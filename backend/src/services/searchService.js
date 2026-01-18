const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const { DEFAULT_SEARCH_RADIUS, MAX_SEARCH_RADIUS, SHOP_STATUS } = require('../config/constants');
const { ValidationError } = require('../utils/errors');
const { calculateDistance } = require('../utils/helpers');

class SearchService {
  /**
   * Search products by name with location-based shop filtering
   */
  async searchProducts(query, lat, lng, radius = DEFAULT_SEARCH_RADIUS) {
    // Validate coordinates
    if (!lat || !lng) {
      throw new ValidationError('Location coordinates are required');
    }
    
    if (radius > MAX_SEARCH_RADIUS) {
      radius = MAX_SEARCH_RADIUS;
    }
    
    const radiusInMeters = radius * 1000;
    
    // Find nearby shops
    const nearbyShops = await Shop.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat] // [longitude, latitude]
          },
          $maxDistance: radiusInMeters
        }
      },
      verificationStatus: SHOP_STATUS.APPROVED,
      isActive: true
    }).select('_id name location address');
    
    if (nearbyShops.length === 0) {
      return [];
    }
    
    const shopIds = nearbyShops.map(shop => shop._id);
    
    // Search products in nearby shops
    const products = await Product.find({
      shopId: { $in: shopIds },
      isActive: true,
      $text: { $search: query }
    }).populate('shopId');
    
    // Get inventory for products
    const productIds = products.map(p => p._id);
    const inventories = await Inventory.find({
      productId: { $in: productIds },
      isAvailable: true,
      availableQuantity: { $gt: 0 }
    });
    
    const inventoryMap = {};
    inventories.forEach(inv => {
      inventoryMap[inv.productId.toString()] = inv;
    });
    
    // Build results with distance calculation
    const results = [];
    
    for (const product of products) {
      const inventory = inventoryMap[product._id.toString()];
      if (!inventory) continue; // Skip if no stock
      
      const shop = product.shopId;
      const [shopLng, shopLat] = shop.location.coordinates;
      const distance = calculateDistance(lat, lng, shopLat, shopLng);
      
      results.push({
        product: product.toJSON(),
        inventory: {
          availableQuantity: inventory.availableQuantity,
          isAvailable: inventory.isAvailable
        },
        shop: {
          _id: shop._id,
          name: shop.name,
          address: shop.address,
          location: shop.location
        },
        distance
      });
    }
    
    // Sort by distance
    results.sort((a, b) => a.distance - b.distance);
    
    return results;
  }
  
  /**
   * Search nearby shops with optional category filter
   */
  async searchShops(lat, lng, radius = DEFAULT_SEARCH_RADIUS, category = null) {
    // Validate coordinates
    if (!lat || !lng) {
      throw new ValidationError('Location coordinates are required');
    }
    
    if (radius > MAX_SEARCH_RADIUS) {
      radius = MAX_SEARCH_RADIUS;
    }
    
    const radiusInMeters = radius * 1000;
    
    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radiusInMeters
        }
      },
      verificationStatus: SHOP_STATUS.APPROVED,
      isActive: true
    };
    
    if (category) {
      query.category = category;
    }
    
    const shops = await Shop.find(query);
    
    // Get product counts for each shop
    const shopIds = shops.map(shop => shop._id);
    const productCounts = await Product.aggregate([
      {
        $match: {
          shopId: { $in: shopIds },
          isActive: true
        }
      },
      {
        $group: {
          _id: '$shopId',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const productCountMap = {};
    productCounts.forEach(pc => {
      productCountMap[pc._id.toString()] = pc.count;
    });
    
    // Build results with distance
    const results = shops.map(shop => {
      const [shopLng, shopLat] = shop.location.coordinates;
      const distance = calculateDistance(lat, lng, shopLat, shopLng);
      
      return {
        shop: shop.toJSON(),
        distance,
        productsCount: productCountMap[shop._id.toString()] || 0
      };
    });
    
    // Already sorted by distance due to $near
    
    return results;
  }
  
  /**
   * Get categories available in nearby shops
   */
  async getNearbyCategories(lat, lng, radius = DEFAULT_SEARCH_RADIUS) {
    const radiusInMeters = radius * 1000;
    
    const shops = await Shop.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radiusInMeters
        }
      },
      verificationStatus: SHOP_STATUS.APPROVED,
      isActive: true
    }).distinct('category');
    
    return shops;
  }
}

module.exports = new SearchService();
