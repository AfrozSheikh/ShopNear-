const morgan = require('morgan');
const logger = require('../utils/logger');

/**
 * HTTP request logger middleware
 */
const requestLogger = morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
});

module.exports = requestLogger;
