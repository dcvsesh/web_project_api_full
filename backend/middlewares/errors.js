class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApiError {
  constructor(message = "Solicitud incorrecta") {
    super(400, message);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = "No autorizado") {
    super(401, message);
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Recurso no encontrado") {
    super(404, message);
  }
}

class ConflictError extends ApiError {
  constructor(message = "Conflicto") {
    super(409, message);
  }
}

class ValidationError extends ApiError {
  constructor(message = "Validación fallida", errors = {}) {
    super(400, message);
    this.errors = errors;
  }
}

class InternalServerError extends ApiError {
  constructor(message = "Error interno del servidor") {
    super(500, message);
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError
};