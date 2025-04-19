// En middlewares/logger.js (actualizar)
const fs = require('fs');
const path = require('path');

const logEntry = (filename, data) => {
  fs.appendFileSync(
    path.join(__dirname, `../${filename}`),
    `${JSON.stringify({ timestamp: new Date(), ...data })}\n`
  );
};

// Logger de solicitudes
exports.requestLogger = (req, res, next) => {
  logEntry('request.log', {
    method: req.method,
    path: req.path,
    body: req.body
  });
  next();
};

// Logger de errores (¡usar en app.js ANTES del errorHandler!)
exports.errorLogger = (err, req, res, next) => {
  logEntry('error.log', {
    error: err.message,
    stack: err.stack,
    request: `${req.method} ${req.path}`
  });
  next(err); // Pasa al siguiente middleware de errores
};