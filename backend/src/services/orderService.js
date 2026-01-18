const Order = require('../models/Order');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const inventoryService = require('./inventoryService');
const { ORDER_STATUS, PAYMENT_STATUS } = require('../config/constants');
const { NotFoundError, ForbiddenError, ValidationError } = require('../utils/errors');
const { generateOrderNumber } = require('../utils/helpers');
const mongoose = require('mongoose');

class OrderService {
  /**
   * Create order with inventory reservation
   */
  async createOrder(customerId, orderData) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const { shopId, items, deliveryRequested, deliveryAddress, paymentRequired, customerNote } = orderData;
      
      // Validate shop
      const shop = await Shop.findById(shopId);
      if (!shop || shop.verificationStatus !== 'approved' || !shop.isActive) {
        throw new ValidationError('Shop is not available');
      }
      
      // Validate products and calculate total
      let totalAmount = 0;
      const orderItems = [];
      
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product || !product.isActive || product.shopId.toString() !== shopId) {
          throw new ValidationError(`Invalid product: ${item.productId}`);
        }
        
        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;
        
        orderItems.push({
          productId: product._id,
          productName: product.name,
          price: product.price,
          quantity: item.quantity,
          subtotal
        });
      }
      
      // Generate order number
      const orderNumber = generateOrderNumber();
      
      // Reserve inventory
      await inventoryService.reserveInventory(
        orderItems.map(item => ({ ...item, orderNumber })),
        session
      );
      
      // Create order
      const order = await Order.create([{
        orderNumber,
        customerId,
        shopId,
        items: orderItems,
        totalAmount,
        status: ORDER_STATUS.REQUESTED,
        deliveryRequested,
        deliveryAddress: deliveryRequested ? deliveryAddress : undefined,
        paymentRequired,
        paymentStatus: paymentRequired ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.PAID,
        customerNote
      }], { session });
      
      await session.commitTransaction();
      
      return order[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  
  /**
   * Get order by ID
   */
  async getOrderById(orderId, userId, userRole) {
    const order = await Order.findById(orderId)
      .populate('customerId', 'email profile')
      .populate('shopId');
    
    if (!order) {
      throw new NotFoundError('Order');
    }
    
    // Check permissions
    if (userRole !== 'admin' &&
        order.customerId._id.toString() !== userId &&
        order.shopId.ownerId.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to view this order');
    }
    
    return order;
  }
  
  /**
   * Get customer orders
   */
  async getCustomerOrders(customerId, filters = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const query = { customerId };
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('shopId', 'name address')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Order.countDocuments(query)
    ]);
    
    return { orders, total, page, limit };
  }
  
  /**
   * Get shop orders
   */
  async getShopOrders(shopId, userId, userRole, filters = {}, page = 1, limit = 20) {
    // Verify ownership
    const shop = await Shop.findById(shopId);
    if (!shop) {
      throw new NotFoundError('Shop');
    }
    
    // Check permissions: Allow if Admin OR Shop Owner
    if (userRole !== 'admin' && shop.ownerId.toString() !== userId) {
      throw new ForbiddenError('You can only view orders for your own shop');
    }
    
    const skip = (page - 1) * limit;
    const query = { shopId };
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('customerId', 'profile phone')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Order.countDocuments(query)
    ]);
    
    return { orders, total, page, limit };
  }
  
  /**
   * Accept order
   */
  async acceptOrder(orderId, userId, userRole) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const order = await Order.findById(orderId).populate('shopId');
      
      if (!order) {
        throw new NotFoundError('Order');
      }
      
      // Check ownership
      if (userRole !== 'admin' && order.shopId.ownerId.toString() !== userId) {
        throw new ForbiddenError('You can only accept orders for your own shop');
      }
      
      if (order.status !== ORDER_STATUS.REQUESTED) {
        throw new ValidationError('Order can only be accepted from requested state');
      }
      
      // Process sale (convert reservation to actual sale)
      await inventoryService.processSale(
        order.items.map(item => ({ ...item, orderNumber: order.orderNumber })),
        session
      );
      
      order.status = ORDER_STATUS.ACCEPTED;
      await order.save({ session });
      
      await session.commitTransaction();
      
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  
  /**
   * Reject order
   */
  async rejectOrder(orderId, userId, userRole, rejectionReason) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const order = await Order.findById(orderId).populate('shopId');
      
      if (!order) {
        throw new NotFoundError('Order');
      }
      
      // Check ownership
      if (userRole !== 'admin' && order.shopId.ownerId.toString() !== userId) {
        throw new ForbiddenError('You can only reject orders for your own shop');
      }
      
      if (order.status !== ORDER_STATUS.REQUESTED) {
        throw new ValidationError('Only requested orders can be rejected');
      }
      
      // Release reserved inventory
      await inventoryService.releaseReservation(
        order.items.map(item => ({ ...item, orderNumber: order.orderNumber })),
        session
      );
      
      order.status = ORDER_STATUS.REJECTED;
      order.rejectionReason = rejectionReason;
      
      // Handle refund if payment was made
      if (order.paymentStatus === PAYMENT_STATUS.PAID) {
        // TODO: Initiate Razorpay refund
        order.paymentStatus = PAYMENT_STATUS.REFUNDED;
      }
      
      await order.save({ session });
      
      await session.commitTransaction();
      
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  
  /**
   * Complete order
   */
  async completeOrder(orderId, userId, userRole) {
    const order = await Order.findById(orderId).populate('shopId');
    
    if (!order) {
      throw new NotFoundError('Order');
    }
    
      // Check ownership
      if (userRole !== 'admin' && order.shopId.ownerId.toString() !== userId) {
        throw new ForbiddenError('You can only complete orders for your own shop');
      }
    
    if (order.status !== ORDER_STATUS.ACCEPTED) {
      throw new ValidationError('Only accepted orders can be completed');
    }
    
    order.status = ORDER_STATUS.COMPLETED;
    await order.save();
    
    return order;
  }
  
  /**
   * Cancel order (by customer)
   */
  async cancelOrder(orderId, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const order = await Order.findById(orderId);
      
      if (!order) {
        throw new NotFoundError('Order');
      }
      
      // Check ownership
      if (order.customerId.toString() !== userId) {
        throw new ForbiddenError('You can only cancel your own orders');
      }
      
      // Can only cancel if not yet accepted
      if (order.status !== ORDER_STATUS.REQUESTED) {
        throw new ValidationError('You can only cancel orders that have not been accepted');
      }
      
      // Release reserved inventory
      await inventoryService.releaseReservation(
        order.items.map(item => ({ ...item, orderNumber: order.orderNumber })),
        session
      );
      
      order.status = ORDER_STATUS.CANCELLED;
      
      // Handle refund if payment was made
      if (order.paymentStatus === PAYMENT_STATUS.PAID) {
        // TODO: Initiate Razorpay refund
        order.paymentStatus = PAYMENT_STATUS.REFUNDED;
      }
      
      await order.save({ session });
      
      await session.commitTransaction();
      
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = new OrderService();
