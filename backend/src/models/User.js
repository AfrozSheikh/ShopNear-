const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  
  role: {
    type: String,
    enum: Object.values(ROLES),
    required: [true, 'Role is required']
  },
  
  profile: {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      validate: {
        validator: function(v) {
          // Accept: 9876543210 or +919876543210 or +91-9876543210
          return /^(\+91[\-\s]?)?[6-9]\d{9}$/.test(v);
        },
        message: 'Please provide a valid Indian phone number (10 digits starting with 6-9)'
      }
    },
    address: {
      street: String,
      landmark: String,
      city: String,
      state: String,
      pincode: {
        type: String,
        validate: {
          validator: function(v) {
            if (!v) return true; // Optional
            return /^\d{6}$/.test(v);
          },
          message: 'Pincode must be 6 digits'
        }
      }
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  },

  // Password reset OTP fields
  resetPasswordOTP: String,
  resetPasswordOTPExpires: Date

}, {
  timestamps: true
});

// Index for faster email lookups
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('passwordHash')) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove sensitive data from JSON response
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.passwordHash;
  return user;
};

module.exports = mongoose.model('User', userSchema);
