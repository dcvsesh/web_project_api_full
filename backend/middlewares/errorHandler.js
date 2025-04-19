const fs = require('fs');
const path = require('path');

module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Definir status code y mensaje
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Error interno del servidor' : err.message;

  // Registrar error en archivo (para el punto 3)
  const errorLog = {
    timestamp: new Date().toISOString(),
    status: statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    request: {
      method: req.method,
      url: req.url,
      body: req.body
    }
  };

  fs.appendFileSync(
    path.join(__dirname, '../../error.log'),
    JSON.stringify(errorLog) + '\n'
  );

  // Responder al cliente
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};