const orderService = require('../services/orderService');
const paymentService = require('../services/paymentService');
const { successResponse, paginatedResponse } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');
const { ValidationError } = require('../utils/errors');

const orderController = {
  /**
   * POST /api/orders
   */
  create: asyncHandler(async (req, res) => {
    const order = await orderService.createOrder(req.user.id, req.body);
    
    // Create Razorpay order if payment required
    let razorpayOrder = null;
    if (order.paymentRequired) {
      razorpayOrder = paymentService.createRazorpayOrder(
        order._id.toString(),
        order.totalAmount
      );
    }
    
    successResponse(res, { order, razorpayOrder }, 'Order created successfully', 201);
  }),
  
  /**
   * GET /api/orders/:id
   */
  getById: asyncHandler(async (req, res) => {
    const order = await orderService.getOrderById(
      req.params.id,
      req.user.id,
      req.user.role
    );
    successResponse(res, order);
  }),
  
  /**
   * GET /api/orders/customer/me
   */
  getMyOrders: asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    
    const result = await orderService.getCustomerOrders(
      req.user.id,
      filters,
      parseInt(page),
      parseInt(limit)
    );
    
    paginatedResponse(res, result.orders, result.page, result.limit, result.total);
  }),
  
  /**
   * GET /api/orders/shop/:shopId
   */
  getShopOrders: asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    
    const result = await orderService.getShopOrders(
      req.params.shopId,
      req.user.id,
      req.user.role,
      filters,
      parseInt(page),
      parseInt(limit)
    );
    
    paginatedResponse(res, result.orders, result.page, result.limit, result.total);
  }),
  
  /**
   * PATCH /api/orders/:id/accept
   */
  /**
   * PATCH /api/orders/:id/accept
   */
  accept: asyncHandler(async (req, res) => {
    const order = await orderService.acceptOrder(req.params.id, req.user.id, req.user.role);
    successResponse(res, order, 'Order accepted successfully');
  }),
  
  /**
   * PATCH /api/orders/:id/reject
   */
  reject: asyncHandler(async (req, res) => {
    const { rejectionReason } = req.body;
    
    if (!rejectionReason) {
      throw new ValidationError('Rejection reason is required');
    }
    
    const order = await orderService.rejectOrder(req.params.id, req.user.id, req.user.role, rejectionReason);
    successResponse(res, order, 'Order rejected successfully');
  }),
  
  /**
   * PATCH /api/orders/:id/complete
   */
  complete: asyncHandler(async (req, res) => {
    const order = await orderService.completeOrder(req.params.id, req.user.id, req.user.role);
    successResponse(res, order, 'Order completed successfully');
  }),
  
  /**
   * PATCH /api/orders/:id/cancel
   */
  cancel: asyncHandler(async (req, res) => {
    const order = await orderService.cancelOrder(req.params.id, req.user.id);
    successResponse(res, order, 'Order cancelled successfully');
  })
};

module.exports = orderController;
