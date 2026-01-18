const mongoose = require('mongoose');
const { SHOP_STATUS } = require('../config/constants');

const shopSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  name: {
    type: String,
    required: [true, 'Shop name is required'],
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
  
  // GeoJSON Point for location-based queries
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 &&
                 coords[0] >= -180 && coords[0] <= 180 &&
                 coords[1] >= -90 && coords[1] <= 90;
        },
        message: 'Invalid coordinates'
      }
    }
  },
  
  address: {
    houseNumber: String,
    street: { type: String, required: true },
    landmark: String,
    area: String,
    city: { type: String, required: true },
    state: { 
      type: String, 
      required: true,
      enum: [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Andaman and Nicobar Islands', 'Chandigarh',
        'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
        'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
      ]
    },
    pincode: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{6}$/.test(v);
        },
        message: 'Pincode must be 6 digits'
      }
    }
  },
  
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return /^(\+91[\-\s]?)?[6-9]\d{9}$/.test(v);
      },
      message: 'Please provide a valid Indian phone number'
    }
  },
  
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  
  verificationStatus: {
    type: String,
    enum: Object.values(SHOP_STATUS),
    default: SHOP_STATUS.PENDING
  },
  
  businessDetails: {
    businessType: {
      type: String,
      enum: ['Individual', 'Sole Proprietorship', 'Partnership', 'Private Limited Company', 'LLP', 'Public Limited Company']
    },
    gstNumber: { 
      type: String, 
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Optional
          return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
        },
        message: 'Invalid GST number format'
      }
    },
    panNumber: { type: String, trim: true },
    fssaiNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Optional
          return /^\d{14}$/.test(v);
        },
        message: 'FSSAI number must be 14 digits'
      }
    },
    licenseNumber: { type: String, trim: true },
    documentUrls: [String]
  },
  
  rejectionReason: String,
  
  verifiedAt: Date,
  
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  deliveryEnabled: {
    type: Boolean,
    default: false
  },
  
  deliveryRadius: {
    type: Number,
    default: 5, // km
    min: 0,
    max: 50
  },
  
  isActive: {
    type: Boolean,
    default: true
  },

  disableReason: String
}, {
  timestamps: true
});

// Indexes
shopSchema.index({ location: '2dsphere' }); // Critical for proximity queries
shopSchema.index({ ownerId: 1 });
shopSchema.index({ verificationStatus: 1, isActive: 1 });
shopSchema.index({ category: 1 });

module.exports = mongoose.model('Shop', shopSchema);
