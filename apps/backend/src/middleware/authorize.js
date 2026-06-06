const { UnauthorizedError, ForbiddenError, NotFoundError } = require('../utils/errors');
const { getPermittedRoles } = require('../config/permissions');

function middleware(event) {
  const user = event.user;
  if (!user) {
    throw new UnauthorizedError('Usuario no autenticado');
  }

  const permittedRoles = getPermittedRoles(event.httpMethod, event.path);

  if (!permittedRoles) {
    throw new NotFoundError('Ruta no encontrada');
  }

  if (permittedRoles.includes('*')) {
    return;
  }

  if (!permittedRoles.includes(user.role)) {
    throw new ForbiddenError(`Rol '${user.role}' no autorizado para ${event.httpMethod} ${event.path}`);
  }
}

module.exports = { middleware };
