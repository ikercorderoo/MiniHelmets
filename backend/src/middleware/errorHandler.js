const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  const log = req.log || logger;
  log.error({
    requestId: req.requestId,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  }, 'Unhandled error');

  res.status(err.statusCode || 500).json({
    ok: false,
    status: 'error',
    message: err.message || 'Error intern del servidor',
    mensaje: err.message || 'Error intern del servidor',
    requestId: req.requestId
  });
};

module.exports = errorHandler;
