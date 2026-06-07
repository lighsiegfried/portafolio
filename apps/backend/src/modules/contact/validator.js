const { ValidationError } = require('../../utils/errors');

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 180;
const MAX_MESSAGE_LENGTH = 2000;
const MIN_NAME_LENGTH = 2;
const MIN_MESSAGE_LENGTH = 10;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

function validate(body) {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Se requiere un cuerpo JSON válido');
  }

  const allowedKeys = ['name', 'email', 'message'];
  const extraKeys = Object.keys(body).filter((k) => !allowedKeys.includes(k));
  if (extraKeys.length > 0) {
    throw new ValidationError(`Campos no permitidos: ${extraKeys.join(', ')}`);
  }

  const trimmedName = body.name.trim();
  if (trimmedName.length < MIN_NAME_LENGTH || trimmedName.length > MAX_NAME_LENGTH) {
    throw new ValidationError(`El nombre debe tener entre ${MIN_NAME_LENGTH} y ${MAX_NAME_LENGTH} caracteres`);
  }

  const trimmedEmail = body.email.trim();
  if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail) || trimmedEmail.length > MAX_EMAIL_LENGTH) {
    throw new ValidationError('El email no tiene un formato válido');
  }

  if (!body.message || typeof body.message !== 'string') {
    throw new ValidationError('El mensaje es requerido');
  }

  const trimmedMessage = body.message.trim();
  if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
    throw new ValidationError(`El mensaje debe tener al menos ${MIN_MESSAGE_LENGTH} caracteres`);
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    throw new ValidationError(`El mensaje no puede exceder ${MAX_MESSAGE_LENGTH} caracteres`);
  }

  return {
    name: sanitize(trimmedName),
    email: trimmedEmail.toLowerCase(),
    message: sanitize(trimmedMessage),
  };
}

module.exports = { validate, sanitize };
