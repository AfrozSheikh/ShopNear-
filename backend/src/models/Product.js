const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  
  description: {
    type: String,
    trim: true
  },
  
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  
  unit: {
    type: String,
    default: 'piece',
    trim: true
  },
  
  imageUrls: [String],
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ shopId: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' }); // Text search
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);
