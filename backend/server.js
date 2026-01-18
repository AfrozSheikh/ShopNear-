const app = require('./src/app');
const connectDatabase = require('./src/config/database');
const config = require('./src/config/env');
const logger = require('./src/utils/logger');
const { seedAdmin } = require('./src/utils/seedAdmin');

const { initializeSocket } = require('./src/utils/socket');

// Connect to database and seed admin
connectDatabase().then(async () => {
  // Seed admin user
  await seedAdmin();
});

// Start server
const PORT = config.port;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  
  // Initialize Socket.io
  const io = initializeSocket(server);
  console.log(`🔌 Socket.io initialized`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});
