const { logRequest, logError } = require('./logger');

const requestLogger = (req, res, next) => {
  logRequest(req);
  next();
};

const errorLogger = (error, req, res, next) => {
  logError(error);
  next(error);
};

module.exports = { requestLogger, errorLogger };
