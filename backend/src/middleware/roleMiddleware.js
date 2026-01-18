const { ForbiddenError } = require('../utils/errors');

/**
 * Role-based access control middleware factory
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ForbiddenError('User not authenticated'));
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to access this resource'));
    }
    
    next();
  };
};

module.exports = authorize;
