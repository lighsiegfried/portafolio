const { UnauthorizedError } = require('../utils/errors');
const { verifyToken } = require('../utils/jwt');

function middleware(event) {
  const authHeader = event.headers?.Authorization || event.headers?.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('Token de autenticación requerido');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new UnauthorizedError('Formato de token inválido. Use: Bearer <token>');
  }

  const token = parts[1];

  try {
    const decoded = verifyToken(token);
    event.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token expirado');
    }
    throw new UnauthorizedError('Token inválido');
  }
}

module.exports = { middleware };
