const response = require('../../utils/response');
const { signToken } = require('../../utils/jwt');
const repo = require('../../db/mockRepository');

async function login(event) {
  const { username, password } = event.body || {};

  if (!username || !password) {
    return response.error(400, 'VALIDATION_ERROR', 'Usuario y contraseña requeridos');
  }

  const user = repo.findUserByUsername(username);
  if (!user || !repo.verifyPassword(password, user.passwordHash)) {
    return response.error(401, 'UNAUTHORIZED', 'Credenciales inválidas');
  }

  const token = signToken({ userId: user.id, role: user.role });

  return response.success({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

async function me(event) {
  const user = repo.findUserById(event.user.userId);
  if (!user) {
    return response.error(404, 'NOT_FOUND', 'Usuario no encontrado');
  }

  return response.success({
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}

module.exports = { login, me };
