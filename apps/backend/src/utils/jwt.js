const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../middleware/logger');

function signToken(payload) {
  if (!config.jwt.secret || config.jwt.secret === 'dev-secret-change-in-production') {
    logger.log('ERROR', 'jwt', 'sign', 'JWT_SECRET is not configured');
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

function verifyToken(token) {
  if (!config.jwt.secret || config.jwt.secret === 'dev-secret-change-in-production') {
    logger.log('ERROR', 'jwt', 'verify', 'JWT_SECRET is not configured');
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.verify(token, config.jwt.secret);
}

module.exports = { signToken, verifyToken };
