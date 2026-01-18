const crypto = require('crypto');
const config = require('../config/env');
const Order = require('../models/Order');
const { PAYMENT_STATUS } = require('../config/constants');
const { ValidationError, NotFoundError } = require('../utils/errors');

class PaymentService {
  /**
   * Create Razorpay order (called during order creation)
   * Note: This is a placeholder for actual Razorpay integration
   */
  createRazorpayOrder(orderId, amount) {
    if (!config.razorpay.keyId || !config.razorpay.keySecret) {
      // Payment not configured, return null
      return null;
    }
    
    // TODO: Implement actual Razorpay SDK integration
    // const Razorpay = require('razorpay');
    // const razorpay = new Razorpay({
    //   key_id: config.razorpay.keyId,
    //   key_secret: config.razorpay.keySecret
    // });
    //
    // const order = await razorpay.orders.create({
    //   amount: amount * 100, // paise
    //   currency: 'INR',
    //   receipt: orderId
    // });
    //
    // return {
    //   id: order.id,
    //   amount: order.amount,
    //   currency: order.currency
    // };
    
    // Placeholder response
    return {
      id: `order_${Date.now()}`,
      amount: amount * 100,
      currency: 'INR'
    };
  }
  
  /**
   * Verify Razorpay payment signature
   */
  async verifyPayment(orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new NotFoundError('Order');
    }
    
    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(body)
      .digest('hex');
    
    if (expectedSignature !== razorpaySignature) {
      throw new ValidationError('Invalid payment signature');
    }
    
    // Update order
    order.razorpayOrderId = razorpayOrderId;
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.paymentStatus = PAYMENT_STATUS.PAID;
    
    await order.save();
    
    return order;
  }
  
  /**
   * Handle Razorpay webhooks
   */
  async handleWebhook(event, payload, signature) {
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    if (expectedSignature !== signature) {
      throw new ValidationError('Invalid webhook signature');
    }
    
    // Handle different events
    switch (event) {
      case 'payment.captured':
        await this.handlePaymentCaptured(payload);
        break;
      case 'payment.failed':
        await this.handlePaymentFailed(payload);
        break;
      default:
        // Log unknown events
        console.log('Unknown webhook event:', event);
    }
    
    return { received: true };
  }
  
  /**
   * Handle payment captured event
   */
  async handlePaymentCaptured(payload) {
    const razorpayPaymentId = payload.payment.entity.id;
    
    const order = await Order.findOne({ razorpayPaymentId });
    
    if (order && order.paymentStatus !== PAYMENT_STATUS.PAID) {
      order.paymentStatus = PAYMENT_STATUS.PAID;
      await order.save();
    }
  }
  
  /**
   * Handle payment failed event
   */
  async handlePaymentFailed(payload) {
    const razorpayOrderId = payload.payment.entity.order_id;
    
    const order = await Order.findOne({ razorpayOrderId });
    
    if (order && order.paymentStatus === PAYMENT_STATUS.PENDING) {
      order.paymentStatus = PAYMENT_STATUS.FAILED;
      await order.save();
    }
  }
  
  /**
   * Initiate refund
   * Note: Placeholder for actual Razorpay refund integration
   */
  async initiateRefund(orderId) {
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new NotFoundError('Order');
    }
    
    if (order.paymentStatus !== PAYMENT_STATUS.PAID) {
      throw new ValidationError('Order payment is not in paid state');
    }
    
    // TODO: Implement actual Razorpay refund
    // const Razorpay = require('razorpay');
    // const razorpay = new Razorpay({
    //   key_id: config.razorpay.keyId,
    //   key_secret: config.razorpay.keySecret
    // });
    //
    // const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
    //   amount: order.totalAmount * 100,
    //   notes: { orderId: order.orderNumber }
    // });
    //
    // order.refundId = refund.id;
    
    order.paymentStatus = PAYMENT_STATUS.REFUNDED;
    order.refundId = `refund_${Date.now()}`;
    await order.save();
    
    return order;
  }
}

module.exports = new PaymentService();
