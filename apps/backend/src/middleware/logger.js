const config = require('../config');

const LOG_LEVELS = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 };
const currentLevel = LOG_LEVELS[config.server.logLevel] ?? LOG_LEVELS.INFO;

function log(level, module, action, message, extra = {}) {
  if (LOG_LEVELS[level] > currentLevel) return;

  const entry = {
    level,
    timestamp: new Date().toISOString(),
    module,
    action,
    message,
    ...extra,
  };

  if (level === 'ERROR') {
    console.error(JSON.stringify(entry));
  } else if (level === 'WARN') {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

function middleware(event) {
  const start = Date.now();
  const requestId = event.requestContext?.requestId || event.awsRequestId || 'local-' + Date.now();

  log('INFO', 'http', 'incoming', `${event.httpMethod} ${event.path}`, {
    requestId,
    method: event.httpMethod,
    path: event.path,
  });

  return {
    requestId,
    startTime: start,
  };
}

function logResponse(requestId, module, action, statusCode, duration, extra = {}) {
  log('INFO', module, action, `${action} completed`, {
    requestId,
    statusCode,
    duration,
    ...extra,
  });
}

/**
 * Build the structured per-request log entry. Pure (no I/O) so it can be unit
 * tested. Fields are omitted when not applicable (e.g. userId, errorCode).
 */
function buildRequestLog({ requestId, route, method, userId, statusCode, latencyMs, coldStart, errorCode }) {
  const entry = {
    action: 'request',
    requestId,
    route,
    method,
    statusCode,
    latencyMs,
    coldStart: !!coldStart,
  };
  if (userId) entry.userId = userId;
  if (errorCode) entry.errorCode = errorCode;
  return entry;
}

/**
 * Emit a single structured log line summarizing a completed request.
 * Severity follows the status code (5xx -> ERROR, 4xx -> WARN, else INFO).
 */
function logRequest(fields) {
  const entry = buildRequestLog(fields);
  const level = entry.statusCode >= 500 ? 'ERROR' : entry.statusCode >= 400 ? 'WARN' : 'INFO';
  log(level, 'http', 'request', `${entry.route} -> ${entry.statusCode}`, entry);
}

module.exports = { middleware, logResponse, log, logRequest, buildRequestLog };
