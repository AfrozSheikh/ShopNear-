// Set India Standard Time (IST) as default timezone
process.env.TZ = 'Asia/Kolkata';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/logger');
const { apiLimiter } = require('./middleware/rateLimiter');
const routes = require('./routes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use('/api', apiLimiter);

// API routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'ShopNear API - Indian Local Commerce Platform',
    version: '1.0.0',
    timezone: 'Asia/Kolkata (IST)',
    endpoints: '/api'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
