const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error('Error: ' + err.message, { stack: err.stack });

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};