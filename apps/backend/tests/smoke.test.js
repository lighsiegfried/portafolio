const { describe, it, before } = require('node:test');
const assert = require('node:assert');

describe('Mini ERP Backend — Smoke Tests', () => {
  describe('Config', () => {
    it('should load config with default values', () => {
      const config = require('../src/config');
      assert.ok(config.jwt);
      assert.ok(config.jwt.secret);
      assert.ok(config.jwt.expiresIn);
      assert.ok(config.dynamodb);
      assert.ok(config.server);
      assert.strictEqual(config.server.port, 3001);
      assert.strictEqual(config.dynamodb.tablePrefix, 'mini-erp');
    });
  });

  describe('Utils — Errors', () => {
    it('should create AppError with statusCode, code, message', () => {
      const { AppError } = require('../src/utils/errors');
      const err = new AppError(400, 'VALIDATION_ERROR', 'Campo requerido');
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.code, 'VALIDATION_ERROR');
      assert.strictEqual(err.message, 'Campo requerido');
      assert.ok(err instanceof Error);
    });

    it('should create ValidationError with 400 status', () => {
      const { ValidationError } = require('../src/utils/errors');
      const err = new ValidationError('Test');
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.code, 'VALIDATION_ERROR');
    });

    it('should create UnauthorizedError with 401 status', () => {
      const { UnauthorizedError } = require('../src/utils/errors');
      const err = new UnauthorizedError('Test');
      assert.strictEqual(err.statusCode, 401);
      assert.strictEqual(err.code, 'UNAUTHORIZED');
    });

    it('should create ForbiddenError with 403 status', () => {
      const { ForbiddenError } = require('../src/utils/errors');
      const err = new ForbiddenError('Test');
      assert.strictEqual(err.statusCode, 403);
      assert.strictEqual(err.code, 'FORBIDDEN');
    });

    it('should create NotFoundError with 404 status', () => {
      const { NotFoundError } = require('../src/utils/errors');
      const err = new NotFoundError('Test');
      assert.strictEqual(err.statusCode, 404);
      assert.strictEqual(err.code, 'NOT_FOUND');
    });
  });

  describe('Utils — Response', () => {
    it('should create success response with ok:true', () => {
      const response = require('../src/utils/response');
      const result = response.success({ id: 1, name: 'test' });
      assert.strictEqual(result.statusCode, 200);
      const body = JSON.parse(result.body);
      assert.strictEqual(body.ok, true);
      assert.strictEqual(body.data.name, 'test');
    });

    it('should create error response with ok:false and error object', () => {
      const response = require('../src/utils/response');
      const result = response.error(400, 'VALIDATION_ERROR', 'Error');
      assert.strictEqual(result.statusCode, 400);
      const body = JSON.parse(result.body);
      assert.strictEqual(body.ok, false);
      assert.strictEqual(body.error.code, 'VALIDATION_ERROR');
      assert.strictEqual(body.error.message, 'Error');
    });

    it('should create list response with meta', () => {
      const response = require('../src/utils/response');
      const result = response.list([1, 2], { total: 2 });
      const body = JSON.parse(result.body);
      assert.strictEqual(body.ok, true);
      assert.deepStrictEqual(body.data, [1, 2]);
      assert.strictEqual(body.meta.total, 2);
    });

    it('should create CSV response', () => {
      const response = require('../src/utils/response');
      const result = response.csv('a,b,c\n1,2,3', 'test.csv');
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(result.headers['Content-Type'], 'text/csv');
      assert.ok(result.headers['Content-Disposition'].includes('test.csv'));
    });
  });

  describe('Utils — JWT', () => {
    it('should signToken and verifyToken', () => {
      const { signToken, verifyToken } = require('../src/utils/jwt');
      const payload = { userId: '123', role: 'admin' };
      const token = signToken(payload);
      assert.ok(typeof token === 'string');
      assert.ok(token.split('.').length === 3);

      const decoded = verifyToken(token);
      assert.strictEqual(decoded.userId, '123');
      assert.strictEqual(decoded.role, 'admin');
    });

    it('should reject invalid tokens', () => {
      const { verifyToken } = require('../src/utils/jwt');
      assert.throws(() => verifyToken('invalid-token'), /jwt malformed|invalid token/);
    });
  });

  describe('Utils — ID Generator', () => {
    it('should generate valid UUIDs with generateId', () => {
      const { generateId, generateRequisitionNumber, resetCounter } = require('../src/utils/idGenerator');
      const id = generateId();
      assert.ok(typeof id === 'string');
      assert.strictEqual(id.split('-').length, 5);
    });

    it('should generate sequential REQ numbers with generateRequisitionNumber', () => {
      const { generateRequisitionNumber, resetCounter } = require('../src/utils/idGenerator');
      resetCounter();
      assert.strictEqual(generateRequisitionNumber(), 'REQ-0001');
      assert.strictEqual(generateRequisitionNumber(), 'REQ-0002');
      assert.strictEqual(generateRequisitionNumber(), 'REQ-0003');
    });
  });

  describe('Utils — CSV Helper', () => {
    it('should generate CSV from data', () => {
      const { toCSV } = require('../src/utils/csvHelper');
      const data = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }];
      const csv = toCSV(data, ['name', 'age']);
      assert.ok(csv.includes('name,age'));
      assert.ok(csv.includes('Alice,30'));
      assert.ok(csv.includes('Bob,25'));
    });

    it('should handle empty data', () => {
      const { toCSV } = require('../src/utils/csvHelper');
      const csv = toCSV([], ['col1', 'col2']);
      assert.strictEqual(csv, 'col1,col2\n');
    });

    it('should escape fields with commas', () => {
      const { escapeField } = require('../src/utils/csvHelper');
      assert.strictEqual(escapeField('hello, world'), '"hello, world"');
      assert.strictEqual(escapeField('simple'), 'simple');
    });
  });

  describe('Middleware — Auth', () => {
    it('should reject missing Authorization header', () => {
      const auth = require('../src/middleware/auth');
      assert.throws(
        () => auth.middleware({ headers: {} }),
        /Token de autenticación requerido/
      );
    });

    it('should reject invalid token format', () => {
      const auth = require('../src/middleware/auth');
      assert.throws(
        () => auth.middleware({ headers: { Authorization: 'InvalidFormat' } }),
        /Formato de token inválido/
      );
    });

    it('should decode valid token and set event.user', () => {
      const { signToken } = require('../src/utils/jwt');
      const auth = require('../src/middleware/auth');
      const token = signToken({ userId: 'abc', role: 'admin' });

      const event = { headers: { Authorization: `Bearer ${token}` } };
      auth.middleware(event);
      assert.strictEqual(event.user.userId, 'abc');
      assert.strictEqual(event.user.role, 'admin');
    });
  });

  describe('Middleware — Authorize', () => {
    it('should allow access when role is permitted', () => {
      const authorize = require('../src/middleware/authorize');
      const event = {
        httpMethod: 'GET',
        path: '/requisitions',
        user: { userId: '1', role: 'admin' },
      };
      authorize.middleware(event);
    });

    it('should deny access when role is not permitted', () => {
      const authorize = require('../src/middleware/authorize');
      const event = {
        httpMethod: 'POST',
        path: '/requisitions',
        user: { userId: '1', role: 'bodega' },
      };
      assert.throws(() => authorize.middleware(event), /no autorizado/);
    });

    it('should allow public routes', () => {
      const authorize = require('../src/middleware/authorize');
      const event = {
        httpMethod: 'POST',
        path: '/auth/login',
        user: { userId: '1', role: 'admin' },
      };
      authorize.middleware(event);
    });
  });

  describe('Middleware — Validate', () => {
    it('should pass validation for valid data', () => {
      const validate = require('../src/middleware/validate');
      const schema = { title: { required: true, type: 'string', maxLength: 100 } };
      const event = { body: { title: 'Test' } };
      validate.middleware(schema)(event);
      assert.deepStrictEqual(event.validatedBody, { title: 'Test' });
    });

    it('should fail validation for missing required field', () => {
      const validate = require('../src/middleware/validate');
      const schema = { title: { required: true, type: 'string' } };
      assert.throws(
        () => validate.middleware(schema)({ body: {} }),
        /Error de validación/
      );
    });
  });

  describe('Middleware — CORS', () => {
    it('should handle OPTIONS preflight', () => {
      const cors = require('../src/middleware/cors');
      const result = cors.middleware({ httpMethod: 'OPTIONS', headers: {} });
      assert.strictEqual(result.statusCode, 204);
    });

    it('should return headers for regular requests', () => {
      const cors = require('../src/middleware/cors');
      const result = cors.middleware({ httpMethod: 'GET', headers: {} });
      assert.ok(result.headers['Access-Control-Allow-Origin']);
    });
  });

  describe('Router — Route Matching', () => {
    it('should match exact routes', () => {
      const { matchRoute } = require('../src/index');
      const result = matchRoute('GET', '/requisitions');
      assert.ok(result);
      assert.ok(result.route);
    });

    it('should match health route', () => {
      const { matchRoute } = require('../src/index');
      const result = matchRoute('GET', '/health');
      assert.ok(result);
      assert.strictEqual(result.route.auth, false);
    });

    it('should match parameterized routes', () => {
      const { matchRoute } = require('../src/index');
      const result = matchRoute('GET', '/requisitions/abc-123');
      assert.ok(result);
      assert.strictEqual(result.params.id, 'abc-123');
    });

    it('should strip /api prefix when matching', () => {
      const { matchRoute } = require('../src/index');
      const result = matchRoute('GET', '/api/requisitions');
      assert.ok(result);
      assert.ok(result.route);
    });

    it('should return null for unmatched routes', () => {
      const { matchRoute } = require('../src/index');
      const result = matchRoute('GET', '/nonexistent');
      assert.strictEqual(result, null);
    });
  });

  describe('Permissions — Config', () => {
    it('should return roles for known routes', () => {
      const { getPermittedRoles } = require('../src/config/permissions');
      const roles = getPermittedRoles('GET', '/requisitions');
      assert.ok(Array.isArray(roles));
      assert.ok(roles.includes('admin'));
    });

    it('should match parameterized route permissions', () => {
      const { getPermittedRoles } = require('../src/config/permissions');
      const roles = getPermittedRoles('PATCH', '/requisitions/123/approve');
      assert.ok(roles.includes('admin'));
      assert.ok(roles.includes('gerencia'));
    });

    it('should return null for unknown routes', () => {
      const { getPermittedRoles } = require('../src/config/permissions');
      const roles = getPermittedRoles('DELETE', '/unknown');
      assert.strictEqual(roles, null);
    });
  });

  describe('Seed Data', () => {
    it('should have demo users in seed', () => {
      const seed = require('../src/data/seed');
      assert.ok(seed.users.length >= 4);
      const admin = seed.users.find((u) => u.role === 'admin');
      assert.ok(admin);
      assert.ok(admin.passwordHash.startsWith('$2a$'));
    });

    it('should have demo products', () => {
      const seed = require('../src/data/seed');
      assert.ok(seed.products.length >= 3);
    });

    it('should have demo leads', () => {
      const seed = require('../src/data/seed');
      assert.ok(seed.leads.length >= 2);
    });

    it('should have demo requisitions', () => {
      const seed = require('../src/data/seed');
      assert.ok(seed.requisitions.length >= 1);
    });
  });

  describe('Mock Repository', () => {
    it('should find user by username', () => {
      const repo = require('../src/db/mockRepository');
      const user = repo.findUserByUsername('wilson');
      assert.ok(user);
      assert.strictEqual(user.role, 'admin');
    });

    it('should return null for unknown username', () => {
      const repo = require('../src/db/mockRepository');
      const user = repo.findUserByUsername('noexiste');
      assert.strictEqual(user, null);
    });

    it('should verify password', () => {
      const repo = require('../src/db/mockRepository');
      const user = repo.findUserByUsername('wilson');
      assert.ok(repo.verifyPassword('admin1234', user.passwordHash));
      assert.ok(!repo.verifyPassword('wrong', user.passwordHash));
    });

    it('should list requisitions', () => {
      const repo = require('../src/db/mockRepository');
      const list = repo.listRequisitions();
      assert.ok(list.length >= 1);
    });

    it('should list products', () => {
      const repo = require('../src/db/mockRepository');
      const list = repo.listProducts();
      assert.ok(list.length >= 3);
    });

    it('should get dashboard summary', () => {
      const repo = require('../src/db/mockRepository');
      const summary = repo.getDashboardSummary();
      assert.ok(summary.totalProducts >= 3);
      assert.ok(typeof summary.totalInventoryValue === 'number');
    });
  });

  describe('Auth Handler', () => {
    it('should login with valid credentials', async () => {
      const auth = require('../src/modules/auth/handler');
      const result = await auth.login({ body: { username: 'wilson', password: 'admin1234' } });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.ok, true);
      assert.ok(body.data.token);
      assert.strictEqual(body.data.user.role, 'admin');
    });

    it('should reject invalid credentials', async () => {
      const auth = require('../src/modules/auth/handler');
      const result = await auth.login({ body: { username: 'wilson', password: 'wrong' } });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 401);
      assert.strictEqual(body.ok, false);
      assert.strictEqual(body.error.code, 'UNAUTHORIZED');
    });

    it('should return user from /me', async () => {
      const { signToken } = require('../src/utils/jwt');
      const repo = require('../src/db/mockRepository');
      const user = repo.findUserByUsername('wilson');
      const auth = require('../src/modules/auth/handler');
      const result = await auth.me({ user: { userId: user.id, role: user.role } });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.ok, true);
      assert.strictEqual(body.data.username, 'wilson');
    });
  });

  describe('Dashboard Handler', () => {
    it('should return summary', async () => {
      const dashboard = require('../src/modules/dashboard/handler');
      const result = await dashboard.summary({});
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.ok, true);
      assert.ok(body.data.totalProducts >= 3);
      assert.ok(body.data.totalRequisitions >= 1);
    });
  });

  describe('Requisitions Handler', () => {
    it('should list requisitions', async () => {
      const reqHandler = require('../src/modules/requisitions/handler');
      const result = await reqHandler.list({});
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.ok, true);
      assert.ok(Array.isArray(body.data));
    });

    it('should get requisition by id', async () => {
      const repo = require('../src/db/mockRepository');
      const req = repo.listRequisitions()[0];
      const reqHandler = require('../src/modules/requisitions/handler');
      const result = await reqHandler.getById({ params: { id: req.id } });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.ok, true);
      assert.strictEqual(body.data.id, req.id);
    });

    it('should return 404 for unknown requisition', async () => {
      const reqHandler = require('../src/modules/requisitions/handler');
      const result = await reqHandler.getById({ params: { id: 'nonexistent' } });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 404);
      assert.strictEqual(body.ok, false);
    });
  });

  describe('Products Handler', () => {
    it('should list products', async () => {
      const products = require('../src/modules/products/handler');
      const result = await products.list({});
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.ok, true);
      assert.ok(Array.isArray(body.data));
      assert.ok(body.data.length >= 3);
    });
  });

  describe('Inventory Handler', () => {
    it('should list movements', async () => {
      const inv = require('../src/modules/inventory/handler');
      const result = await inv.listMovements({});
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.ok, true);
      assert.ok(Array.isArray(body.data));
    });

    it('should list low stock products', async () => {
      const inv = require('../src/modules/inventory/handler');
      const result = await inv.lowStock({});
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.ok, true);
      assert.ok(Array.isArray(body.data));
    });
  });

  describe('Leads Handler', () => {
    it('should list leads', async () => {
      const leads = require('../src/modules/leads/handler');
      const result = await leads.list({});
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.ok, true);
      assert.ok(Array.isArray(body.data));
    });

    it('should get lead by id', async () => {
      const repo = require('../src/db/mockRepository');
      const lead = repo.listLeads()[0];
      const leads = require('../src/modules/leads/handler');
      const result = await leads.getById({ params: { id: lead.id } });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.ok, true);
      assert.strictEqual(body.data.id, lead.id);
    });

    it('should return 404 for unknown lead', async () => {
      const leads = require('../src/modules/leads/handler');
      const result = await leads.getById({ params: { id: 'nonexistent' } });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 404);
      assert.strictEqual(body.ok, false);
    });
  });

  describe('Reports Handler', () => {
    it('should export requisitions CSV', async () => {
      const reports = require('../src/modules/reports/handler');
      const result = await reports.exportRequisitions({});
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(result.headers['Content-Type'], 'text/csv');
      assert.ok(result.body.includes('number,title,status'));
    });

    it('should export inventory CSV', async () => {
      const reports = require('../src/modules/reports/handler');
      const result = await reports.exportInventory({});
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(result.headers['Content-Type'], 'text/csv');
    });

    it('should export leads CSV', async () => {
      const reports = require('../src/modules/reports/handler');
      const result = await reports.exportLeads({});
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(result.headers['Content-Type'], 'text/csv');
    });
  });

  describe('Lambda Handler — Health', () => {
    it('should return ok from health endpoint', async () => {
      const { handler } = require('../src/index');
      const result = await handler({
        httpMethod: 'GET',
        path: '/health',
        headers: {},
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.ok, true);
      assert.strictEqual(body.data.status, 'ok');
    });
  });
});
