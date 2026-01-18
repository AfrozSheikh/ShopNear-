const mongoose = require('mongoose');
const { ORDER_STATUS, PAYMENT_STATUS } = require('../config/constants');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  subtotal: {
    type: Number,
    required: true
  }
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  
  items: [orderItemSchema],
  
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.REQUESTED
  },
  
  statusHistory: [statusHistorySchema],
  
  deliveryRequested: {
    type: Boolean,
    default: false
  },
  
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  
  paymentRequired: {
    type: Boolean,
    default: false
  },
  
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING
  },
  
  paymentId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  refundId: String,
  
  customerNote: String,
  rejectionReason: String,
  
  mustCompleteBy: Date
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ shopId: 1, status: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

// Add status to history before saving
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
