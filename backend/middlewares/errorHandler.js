const errorHandler = (err, req, res, next) => {
  // Log del error para desarrollo
  console.error(err.stack);

  // Determinar el código de estado
  const statusCode = err.statusCode || 500;

  // Mensaje de error seguro para producción
  const message = statusCode === 500 ? 'Error interno del servidor' : err.message;

  // Respuesta estandarizada
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;