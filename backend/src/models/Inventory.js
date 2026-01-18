const mongoose = require('mongoose');
const { INVENTORY_ACTIONS } = require('../config/constants');

const inventoryHistorySchema = new mongoose.Schema({
  action: {
    type: String,
    enum: Object.values(INVENTORY_ACTIONS),
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  previousStock: Number,
  newStock: Number,
  reason: String,
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const inventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true
  },
  
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  
  stockQuantity: {
    type: Number,
    required: true,
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  
  reservedQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Reserved quantity cannot be negative']
  },
  
  availableQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Available quantity cannot be negative']
  },
  
  isAvailable: {
    type: Boolean,
    default: true
  },
  
  lastRestockedAt: Date,
  lastSoldAt: Date,
  
  history: [inventoryHistorySchema]
}, {
  timestamps: true
});

// Indexes
inventorySchema.index({ productId: 1 }, { unique: true });
inventorySchema.index({ shopId: 1, isAvailable: 1 });
inventorySchema.index({ availableQuantity: 1 });

// Virtual to auto-calculate available quantity
// Virtual to auto-calculate available quantity
inventorySchema.pre('save', async function() {
  this.availableQuantity = this.stockQuantity - this.reservedQuantity;
});

module.exports = mongoose.model('Inventory', inventorySchema);
