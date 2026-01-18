const logger = require('../utils/logger');
const config = require('../config/env');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.user?.id
  });
  
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.statusCode = 404;
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    error.message = errors.join(', ');
    error.statusCode = 400;
  }
  
  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error.message = `${field} already exists`;
    error.statusCode = 409;
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }
  
  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }
  
  // Send response
  res.status(error.statusCode).json({
    success: false,
    message: error.message || 'Server Error',
    ...(config.nodeEnv === 'development' && { 
      stack: err.stack,
      error: err 
    })
  });
};

module.exports = errorHandler;
