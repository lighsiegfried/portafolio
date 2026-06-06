class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Error de validación') {
    super(400, 'VALIDATION_ERROR', message);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(401, 'UNAUTHORIZED', message);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Acceso denegado') {
    super(403, 'FORBIDDEN', message);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(404, 'NOT_FOUND', message);
  }
}

module.exports = { AppError, ValidationError, UnauthorizedError, ForbiddenError, NotFoundError };
