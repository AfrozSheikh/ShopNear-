/**
 * Base application error class
 */
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request
 */
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

/**
 * 401 Unauthorized
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized - Please login') {
    super(message, 401);
  }
}

/**
 * 403 Forbidden
 */
class ForbiddenError extends AppError {
  constructor(message = 'Forbidden - You do not have permission') {
    super(message, 403);
  }
}

/**
 * 404 Not Found
 */
class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

/**
 * 409 Conflict
 */
class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

/**
 * 500 Internal Server Error
 */
class InternalError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500, false);
  }
}

module.exports = {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalError
};
