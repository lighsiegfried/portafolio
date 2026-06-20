const { AppError } = require('./utils/errors');
const response = require('./utils/response');
const logger = require('./middleware/logger');
const corsMiddleware = require('./middleware/cors');
const authMiddleware = require('./middleware/auth');
const authorizeMiddleware = require('./middleware/authorize');
const auditService = require('./services/auditService');
const { getRepository } = require('./db/repositoryFactory');

auditService.init(getRepository());

const authHandler = require('./modules/auth/handler');
const requisitionsHandler = require('./modules/requisitions/handler');
const productsHandler = require('./modules/products/handler');
const inventoryHandler = require('./modules/inventory/handler');
const leadsHandler = require('./modules/leads/handler');
const dashboardHandler = require('./modules/dashboard/handler');
const reportsHandler = require('./modules/reports/handler');
const contactHandler = require('./modules/contact/handler');

const routes = {
  'GET /health': { handler: () => response.success({ status: 'ok', timestamp: new Date().toISOString() }), auth: false },

  'POST /contact': { handler: contactHandler.submit, auth: false },

  'POST /auth/login': { handler: authHandler.login, auth: false },
  'GET /auth/me': { handler: authHandler.me, auth: true },

  'GET /dashboard/summary': { handler: dashboardHandler.summary, auth: true },

  'GET /requisitions': { handler: requisitionsHandler.list, auth: true },
  'POST /requisitions': { handler: requisitionsHandler.create, auth: true },
  'GET /requisitions/{id}': { handler: requisitionsHandler.getById, auth: true },
  'PATCH /requisitions/{id}/approve': { handler: requisitionsHandler.approve, auth: true },
  'PATCH /requisitions/{id}/reject': { handler: requisitionsHandler.reject, auth: true },
  'PATCH /requisitions/{id}/complete': { handler: requisitionsHandler.complete, auth: true },

  'GET /products': { handler: productsHandler.list, auth: true },
  'POST /products': { handler: productsHandler.create, auth: true },
  'PATCH /products/{id}': { handler: productsHandler.update, auth: true },
  'PATCH /products/{id}/stock': { handler: productsHandler.updateStock, auth: true },

  'POST /inventory/movements': { handler: inventoryHandler.createMovement, auth: true },
  'GET /inventory/movements': { handler: inventoryHandler.listMovements, auth: true },
  'GET /inventory/low-stock': { handler: inventoryHandler.lowStock, auth: true },

  'GET /leads': { handler: leadsHandler.list, auth: true },
  'POST /leads': { handler: leadsHandler.create, auth: true },
  'GET /leads/{id}': { handler: leadsHandler.getById, auth: true },
  'PATCH /leads/{id}': { handler: leadsHandler.update, auth: true },
  'POST /leads/{id}/notes': { handler: leadsHandler.addNote, auth: true },

  'GET /reports/requisitions.csv': { handler: reportsHandler.exportRequisitions, auth: true },
  'GET /reports/inventory.csv': { handler: reportsHandler.exportInventory, auth: true },
  'GET /reports/leads.csv': { handler: reportsHandler.exportLeads, auth: true },
};

function matchRoute(method, path) {
  const cleanPath = path.replace(/^\/api/, '') || '/';

  const exactKey = `${method} ${cleanPath}`;
  if (routes[exactKey]) {
    return { route: routes[exactKey], params: {}, routeKey: exactKey };
  }

  for (const [key, route] of Object.entries(routes)) {
    const [registeredMethod, ...keyPathParts] = key.split(' ');
    if (registeredMethod !== method) continue;

    const registeredPath = keyPathParts.join(' ');
    const paramNames = (registeredPath.match(/\{[\w]+\}/g) || []).map((p) => p.slice(1, -1));
    const pattern = registeredPath.replace(/\{[\w]+\}/g, '([^/]+)');
    const regex = new RegExp(`^${pattern}$`);
    const match = cleanPath.match(regex);

    if (match) {
      const params = {};
      paramNames.forEach((name, index) => {
        params[name] = match[index + 1];
      });
      return { route, params, routeKey: key };
    }
  }

  return null;
}

function normalizeEvent(event) {
  if (event.version === '2.0') {
    event.httpMethod = event.httpMethod || event.requestContext?.http?.method;
    event.path = event.path || event.rawPath || event.requestContext?.http?.path;
  }
  return event;
}

// Flipped to false after the first invocation in a warm container.
let isColdStart = true;

/** Best-effort extraction of an error code from a handler error response body. */
function errorCodeFromResult(result) {
  if (!result || result.statusCode < 400 || typeof result.body !== 'string') return undefined;
  try {
    const parsed = JSON.parse(result.body);
    return parsed && parsed.error ? parsed.error.code : undefined;
  } catch (e) {
    return undefined;
  }
}

async function handler(event) {
  event = normalizeEvent(event);
  const logContext = logger.middleware(event);
  const coldStart = isColdStart;
  isColdStart = false;

  const cleanPath = (event.path || '').replace(/^\/api/, '') || '/';
  let routeKey = `${event.httpMethod} ${cleanPath}`;

  const emit = (result) => {
    logger.logRequest({
      requestId: logContext.requestId,
      route: routeKey,
      method: event.httpMethod,
      userId: event.user && event.user.userId,
      statusCode: result.statusCode || 200,
      latencyMs: Date.now() - logContext.startTime,
      coldStart,
      errorCode: errorCodeFromResult(result),
    });
    return result;
  };

  try {
    const corsResult = corsMiddleware.middleware(event);
    if (corsResult.statusCode === 204) {
      return emit(corsResult);
    }

    const matched = matchRoute(event.httpMethod, cleanPath);

    if (!matched) {
      return emit(response.error(404, 'NOT_FOUND', `Ruta no encontrada: ${event.httpMethod} ${event.path}`));
    }

    const { route, params } = matched;
    routeKey = matched.routeKey;
    event.params = params;
    event.path = cleanPath;

    if (route.auth) {
      authMiddleware.middleware(event);
      authorizeMiddleware.middleware(event);
    }

    let body = null;
    if (event.body) {
      try {
        body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      } catch (e) {
        body = event.body;
      }
    }
    event.body = body;

    const result = await route.handler(event);

    const finalHeaders = {
      ...(result.headers || {}),
      ...(corsResult.headers || {}),
    };

    return emit({ ...result, headers: finalHeaders });
  } catch (err) {
    if (err instanceof AppError) {
      return emit(response.error(err.statusCode, err.code, err.message));
    }

    logger.log('ERROR', 'http', 'unhandled', err.message || 'Error interno del servidor', {
      requestId: logContext.requestId,
      stack: err.stack,
    });

    return emit(response.error(500, 'INTERNAL_ERROR', 'Error interno del servidor'));
  }
}

module.exports = { handler, routes, matchRoute };
