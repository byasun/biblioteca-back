const logger = require('../utils/loggers');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
  
    logger.error('Erro capturado:', {
      message: err.message,
      stack: err.stack,
      method: req.method,
      path: req.originalUrl,
    });
  
    res.status(statusCode).json({
      error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno no servidor.',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  };
  
  module.exports = errorHandler;