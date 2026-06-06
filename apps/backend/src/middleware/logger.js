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

module.exports = { middleware, logResponse, log };
