const response = require('../../utils/response');
const { signToken } = require('../../utils/jwt');
const { getRepository } = require('../../db/repositoryFactory');
const logger = require('../../middleware/logger');
const repo = getRepository();

function sanitizeUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

async function login(event) {
  const { username, password } = event.body || {};

  if (!username || !password) {
    return response.error(400, 'VALIDATION_ERROR', 'Usuario y contraseña requeridos');
  }

  const user = await repo.findUserByUsername(username);

  if (!user) {
    logger.log('WARN', 'auth', 'login', 'Usuario no encontrado', { username, user_found: false });
    return response.error(401, 'UNAUTHORIZED', 'Credenciales inválidas');
  }

  const hashPresent = !!user.passwordHash;
  const isActive = user.active ?? user.isActive ?? true;
  const passwordValid = hashPresent ? repo.verifyPassword(password, user.passwordHash) : false;

  logger.log('INFO', 'auth', 'login', 'Verificando credenciales', {
    username,
    user_found: true,
    passwordHash_present: hashPresent,
    password_valid: passwordValid,
    role: user.role,
    active: isActive,
  });

  if (!hashPresent || !passwordValid) {
    return response.error(401, 'UNAUTHORIZED', 'Credenciales inválidas');
  }

  if (!isActive) {
    logger.log('WARN', 'auth', 'login', 'Cuenta inactiva', { username, active: false });
    return response.error(401, 'UNAUTHORIZED', 'Cuenta desactivada');
  }

  const token = signToken({ userId: user.id, role: user.role });

  return response.success({
    token,
    user: sanitizeUser(user),
  });
}

async function me(event) {
  const user = await repo.findUserById(event.user.userId);
  if (!user) {
    return response.error(404, 'NOT_FOUND', 'Usuario no encontrado');
  }

  return response.success(sanitizeUser(user));
}

module.exports = { login, me, sanitizeUser };
