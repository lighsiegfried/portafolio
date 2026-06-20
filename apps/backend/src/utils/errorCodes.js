/**
 * Canonical error-code taxonomy for the Mini ERP backend.
 *
 * Values intentionally match the strings already returned by the handlers, so
 * adopting these constants is a no-op on the public contract
 * ({ ok:false, error:{ code, message } }) while giving new code a single,
 * consistent source of truth.
 */
const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  BAD_REQUEST: 'BAD_REQUEST',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

module.exports = { ERROR_CODES };
