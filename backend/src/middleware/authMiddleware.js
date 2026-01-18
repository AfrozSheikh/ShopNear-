const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');
const config = require('../config/env');
const User = require('../models/User');

/**
 * Authenticate JWT token from Authorization header
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    
    // Get user from token
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }
    
    // Attach user to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      profile: user.profile
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token expired'));
    }
    next(error);
  }
};

module.exports = authenticate;
