const paymentService = require('../services/paymentService');
const { successResponse } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');
const { ValidationError } = require('../utils/errors');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentController = {
  /**
   * POST /api/payments/create-order
   * Create a Razorpay order
   */
  createOrder: asyncHandler(async (req, res) => {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      throw new ValidationError('Amount and orderId are required');
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: orderId,
    };

    const order = await razorpay.orders.create(options);

    successResponse(res, {
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    }, 'Razorpay order created successfully');
  }),

  /**
   * POST /api/payments/verify
   */
  verify: asyncHandler(async (req, res) => {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    
    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new ValidationError('All payment details are required');
    }
    
    const order = await paymentService.verifyPayment(
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
    
    successResponse(res, order, 'Payment verified successfully');
  }),
  
  /**
   * POST /api/webhooks/razorpay
   */
  webhook: asyncHandler(async (req, res) => {
    const signature = req.headers['x-razorpay-signature'];
    const event = req.body.event;
    const payload = req.body;
    
    await paymentService.handleWebhook(event, payload, signature);
    
    successResponse(res, { received: true });
  })
};

module.exports = paymentController;
