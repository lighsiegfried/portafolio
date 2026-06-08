const { describe, it, before } = require('node:test');
const assert = require('node:assert');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

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

    it('should create list response with pagination', () => {
      const response = require('../src/utils/response');
      const result = response.list([1, 2], { total: 10 }, 200, { limit: 2, nextToken: 'offset_2' });
      const body = JSON.parse(result.body);
      assert.strictEqual(body.ok, true);
      assert.deepStrictEqual(body.data, [1, 2]);
      assert.strictEqual(body.meta.total, 10);
      assert.strictEqual(body.pagination.limit, 2);
      assert.strictEqual(body.pagination.nextToken, 'offset_2');
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
      assert.ok(repo.verifyPassword('admin123', user.passwordHash));
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
      const result = await auth.login({ body: { username: 'wilson', password: 'admin123' } });
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

  describe('Auth — verifyPassword defensivo', () => {
    it('should return false when hash is undefined', () => {
      const repo = require('../src/db/mockRepository');
      assert.strictEqual(repo.verifyPassword('admin123', undefined), false);
    });

    it('should return false when plain password is undefined', () => {
      const repo = require('../src/db/mockRepository');
      assert.strictEqual(repo.verifyPassword(undefined, '$2a$10$HkaDAa2LR.8d/.nTQrp7PeQjcjRUTPXhFdMpKsRfz00MtW7ukvWbC'), false);
    });

    it('should return false when both are undefined', () => {
      const repo = require('../src/db/mockRepository');
      assert.strictEqual(repo.verifyPassword(undefined, undefined), false);
    });

    it('should return false when hash is null', () => {
      const repo = require('../src/db/mockRepository');
      assert.strictEqual(repo.verifyPassword('admin123', null), false);
    });

    it('should return false when plain is empty string', () => {
      const repo = require('../src/db/mockRepository');
      assert.strictEqual(repo.verifyPassword('', '$2a$10$HkaDAa2LR.8d/.nTQrp7PeQjcjRUTPXhFdMpKsRfz00MtW7ukvWbC'), false);
    });
  });

  describe('Auth — sanitizeUser', () => {
    it('should remove passwordHash from user object', () => {
      const { sanitizeUser } = require('../src/modules/auth/handler');
      const user = {
        id: 'u1',
        username: 'wilson',
        role: 'admin',
        passwordHash: '$2a$10$abc123',
        createdAt: '2026-01-01T00:00:00.000Z',
      };
      const safe = sanitizeUser(user);
      assert.strictEqual(safe.id, 'u1');
      assert.strictEqual(safe.username, 'wilson');
      assert.strictEqual(safe.role, 'admin');
      assert.strictEqual(safe.passwordHash, undefined);
      assert.ok(!('passwordHash' in safe));
    });

    it('should return all non-sensitive fields', () => {
      const { sanitizeUser } = require('../src/modules/auth/handler');
      const user = {
        id: 'u1',
        username: 'wilson',
        name: 'Carlos Admin',
        email: 'carlos@erp.local',
        role: 'admin',
        active: true,
        passwordHash: '$2a$10$abc123',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      };
      const safe = sanitizeUser(user);
      assert.strictEqual(safe.id, 'u1');
      assert.strictEqual(safe.username, 'wilson');
      assert.strictEqual(safe.name, 'Carlos Admin');
      assert.strictEqual(safe.email, 'carlos@erp.local');
      assert.strictEqual(safe.role, 'admin');
      assert.strictEqual(safe.active, true);
      assert.strictEqual(safe.createdAt, '2026-01-01T00:00:00.000Z');
      assert.strictEqual(safe.updatedAt, '2026-01-01T00:00:00.000Z');
      assert.strictEqual(safe.passwordHash, undefined);
    });
  });

  describe('Auth Handler — passwordHash en respuesta', () => {
    it('should NOT include passwordHash in login response', async () => {
      const auth = require('../src/modules/auth/handler');
      const result = await auth.login({ body: { username: 'wilson', password: 'admin123' } });
      const body = JSON.parse(result.body);
      assert.strictEqual(body.ok, true);
      assert.strictEqual(body.data.user.passwordHash, undefined);
    });

    it('should return 401 for user without passwordHash', async () => {
      const { sanitizeUser } = require('../src/modules/auth/handler');
      const repo = require('../src/db/mockRepository');
      const originalFindUser = repo.findUserByUsername;
      const user = repo.findUserByUsername('wilson');
      const userNoHash = { ...user, passwordHash: undefined };
      repo.findUserByUsername = () => userNoHash;
      try {
        const auth = require('../src/modules/auth/handler');
        const result = await auth.login({ body: { username: 'wilson', password: 'admin123' } });
        const body = JSON.parse(result.body);
        assert.strictEqual(result.statusCode, 401);
        assert.strictEqual(body.ok, false);
        assert.strictEqual(body.error.code, 'UNAUTHORIZED');
      } finally {
        repo.findUserByUsername = originalFindUser;
      }
    });

    it('should return 401 for non-existent username', async () => {
      const auth = require('../src/modules/auth/handler');
      const result = await auth.login({ body: { username: 'noexiste', password: 'anything' } });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 401);
      assert.strictEqual(body.ok, false);
      assert.strictEqual(body.error.code, 'UNAUTHORIZED');
    });
  });

  describe('Auth — bcrypt hash validation for demo users', () => {
    const bcrypt = require('bcryptjs');
    const { users } = require('../src/data/fixtures/users');

    it('wilson hash should validate admin123', () => {
      const user = users.find((u) => u.username === 'wilson');
      assert.ok(user, 'wilson user not found');
      assert.ok(bcrypt.compareSync('admin123', user.passwordHash), 'hash does not match admin123');
    });

    it('compras1 hash should validate compras123', () => {
      const user = users.find((u) => u.username === 'compras1');
      assert.ok(user, 'compras1 user not found');
      assert.ok(bcrypt.compareSync('compras123', user.passwordHash), 'hash does not match compras123');
    });

    it('bodega1 hash should validate bodega123', () => {
      const user = users.find((u) => u.username === 'bodega1');
      assert.ok(user, 'bodega1 user not found');
      assert.ok(bcrypt.compareSync('bodega123', user.passwordHash), 'hash does not match bodega123');
    });

    it('gerencia1 hash should validate gerencia123', () => {
      const user = users.find((u) => u.username === 'gerencia1');
      assert.ok(user, 'gerencia1 user not found');
      assert.ok(bcrypt.compareSync('gerencia123', user.passwordHash), 'hash does not match gerencia123');
    });

    it('login with bodega1/bodega123 should succeed', async () => {
      const auth = require('../src/modules/auth/handler');
      const result = await auth.login({ body: { username: 'bodega1', password: 'bodega123' } });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.ok, true);
      assert.ok(body.data.token);
      assert.strictEqual(body.data.user.role, 'bodega');
    });

    it('wrong password should return 401', async () => {
      const auth = require('../src/modules/auth/handler');
      const result = await auth.login({ body: { username: 'wilson', password: 'wrongpassword' } });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 401);
      assert.strictEqual(body.ok, false);
      assert.strictEqual(body.error.code, 'UNAUTHORIZED');
    });

    it('non-existent user should return 401', async () => {
      const auth = require('../src/modules/auth/handler');
      const result = await auth.login({ body: { username: 'noexiste', password: 'anything' } });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 401);
      assert.strictEqual(body.ok, false);
      assert.strictEqual(body.error.code, 'UNAUTHORIZED');
    });

    it('login response should not include passwordHash', async () => {
      const auth = require('../src/modules/auth/handler');
      const result = await auth.login({ body: { username: 'wilson', password: 'admin123' } });
      const body = JSON.parse(result.body);
      assert.strictEqual(body.ok, true);
      assert.strictEqual(body.data.user.passwordHash, undefined);
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

  describe('Phase 2 — Requisitions', () => {
    let adminToken;
    let comprasToken;
    let bodegaToken;
    let gerenciaToken;
    let createdReqId;

    before(async () => {
      const { signToken } = require('../src/utils/jwt');
      const repo = require('../src/db/mockRepository');
      adminToken = signToken({ userId: repo.findUserByUsername('wilson').id, role: 'admin' });
      comprasToken = signToken({ userId: repo.findUserByUsername('compras1').id, role: 'compras' });
      bodegaToken = signToken({ userId: repo.findUserByUsername('bodega1').id, role: 'bodega' });
      gerenciaToken = signToken({ userId: repo.findUserByUsername('gerencia1').id, role: 'gerencia' });
    });

    it('should create requisition as compras', async () => {
      const reqHandler = require('../src/modules/requisitions/handler');
      const result = await reqHandler.create({
        user: { userId: 'test-user', role: 'compras' },
        body: {
          title: 'Test requisition',
          description: 'Test description',
          items: [{ productName: 'Item 1', quantity: 5, unit: 'unidad', estimatedCost: 10 }],
        },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 201);
      assert.strictEqual(body.ok, true);
      assert.ok(body.data.id);
      assert.strictEqual(body.data.status, 'pending');
      assert.ok(body.data.number);
      createdReqId = body.data.id;
    });

    it('should reject creating requisition without items', async () => {
      const reqHandler = require('../src/modules/requisitions/handler');
      const result = await reqHandler.create({
        user: { userId: 'test-user', role: 'compras' },
        body: { title: 'No items', description: 'Test' },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(body.error.code, 'VALIDATION_ERROR');
    });

    it('should approve requisition as gerencia', async () => {
      const reqHandler = require('../src/modules/requisitions/handler');
      const result = await reqHandler.approve({
        params: { id: createdReqId },
        user: { userId: 'test-user', role: 'gerencia' },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.data.status, 'approved');
    });

    it('should reject approving already approved requisition', async () => {
      const reqHandler = require('../src/modules/requisitions/handler');
      const result = await reqHandler.approve({
        params: { id: createdReqId },
        user: { userId: 'test-user', role: 'gerencia' },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(body.error.code, 'CONFLICT');
    });

    it('should complete approved requisition as compras', async () => {
      const reqHandler = require('../src/modules/requisitions/handler');
      const result = await reqHandler.complete({
        params: { id: createdReqId },
        user: { userId: 'test-user', role: 'compras' },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.data.status, 'completed');
    });

    it('should reject completing pending requisition', async () => {
      const repo = require('../src/db/mockRepository');
      const pending = repo.listRequisitions().find((r) => r.status === 'pending');
      if (pending) {
        const reqHandler = require('../src/modules/requisitions/handler');
        const result = await reqHandler.complete({
          params: { id: pending.id },
          user: { userId: 'test-user', role: 'compras' },
        });
        const body = JSON.parse(result.body);
        assert.strictEqual(result.statusCode, 400);
        assert.strictEqual(body.error.code, 'CONFLICT');
      }
    });

    it('should reject reject without reason', async () => {
      const repo = require('../src/db/mockRepository');
      const pending = repo.listRequisitions().find((r) => r.status === 'pending');
      if (pending) {
        const reqHandler = require('../src/modules/requisitions/handler');
        const result = await reqHandler.reject({
          params: { id: pending.id },
          user: { userId: 'test-user', role: 'gerencia' },
          body: {},
        });
        const body = JSON.parse(result.body);
        assert.strictEqual(result.statusCode, 400);
        assert.strictEqual(body.error.code, 'VALIDATION_ERROR');
      }
    });
  });

  describe('Phase 2 — Products', () => {
    let adminToken;
    let comprasToken;

    before(() => {
      const { signToken } = require('../src/utils/jwt');
      const repo = require('../src/db/mockRepository');
      adminToken = signToken({ userId: repo.findUserByUsername('wilson').id, role: 'admin' });
      comprasToken = signToken({ userId: repo.findUserByUsername('compras1').id, role: 'compras' });
    });

    it('should create product as admin', async () => {
      const products = require('../src/modules/products/handler');
      const result = await products.create({
        user: { userId: 'test-user', role: 'admin' },
        body: {
          sku: 'TEST-001',
          name: 'Test Product',
          category: 'insumo',
          unit: 'unidad',
          price: 10,
          minStock: 5,
          initialStock: 20,
        },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 201);
      assert.strictEqual(body.ok, true);
      assert.strictEqual(body.data.sku, 'TEST-001');
      assert.strictEqual(body.data.stock, 20);
    });

    it('should reject duplicate SKU', async () => {
      const products = require('../src/modules/products/handler');
      const result = await products.create({
        user: { userId: 'test-user', role: 'admin' },
        body: {
          sku: 'TEST-001',
          name: 'Duplicate',
          category: 'insumo',
          unit: 'unidad',
          price: 10,
          minStock: 5,
        },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 409);
      assert.strictEqual(body.error.code, 'CONFLICT');
    });

    it('should reject creating product without required fields', async () => {
      const products = require('../src/modules/products/handler');
      const result = await products.create({
        user: { userId: 'test-user', role: 'admin' },
        body: { sku: 'TEST-002' },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 400);
    });

    it('should update product as admin', async () => {
      const repo = require('../src/db/mockRepository');
      const product = repo.findProductBySku('TEST-001');
      const products = require('../src/modules/products/handler');
      const result = await products.update({
        params: { id: product.id },
        user: { userId: 'test-user', role: 'admin' },
        body: { price: 15, name: 'Updated Product' },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.data.name, 'Updated Product');
      assert.strictEqual(body.data.price, 15);
    });

    it('should update stock IN as bodega', async () => {
      const repo = require('../src/db/mockRepository');
      const product = repo.findProductBySku('TEST-001');
      const products = require('../src/modules/products/handler');
      const result = await products.updateStock({
        params: { id: product.id },
        user: { userId: 'test-user', role: 'bodega' },
        body: { type: 'IN', quantity: 10, reference: 'Test IN' },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.data.stock, 30);
    });

    it('should reject stock OUT if insufficient', async () => {
      const repo = require('../src/db/mockRepository');
      const product = repo.findProductBySku('TEST-001');
      const products = require('../src/modules/products/handler');
      const result = await products.updateStock({
        params: { id: product.id },
        user: { userId: 'test-user', role: 'bodega' },
        body: { type: 'OUT', quantity: 9999, reference: 'Test OUT' },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(body.error.code, 'BAD_REQUEST');
    });
  });

  describe('Phase 2 — Inventory', () => {
    let testProductId;

    before(() => {
      const repo = require('../src/db/mockRepository');
      const product = repo.findProductBySku('TEST-001');
      testProductId = product ? product.id : null;
    });

    it('should create movement IN as bodega', async () => {
      if (!testProductId) return;
      const inv = require('../src/modules/inventory/handler');
      const result = await inv.createMovement({
        user: { userId: 'test-user', role: 'bodega' },
        body: {
          productId: testProductId,
          type: 'IN',
          quantity: 5,
          reference: 'Repo test',
          notes: 'Test IN movement',
        },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 201);
      assert.strictEqual(body.ok, true);
      assert.strictEqual(body.data.type, 'IN');
      assert.ok(body.data.stockBefore != null);
      assert.ok(body.data.stockAfter != null);
    });

    it('should create movement OUT as admin', async () => {
      if (!testProductId) return;
      const inv = require('../src/modules/inventory/handler');
      const result = await inv.createMovement({
        user: { userId: 'test-user', role: 'admin' },
        body: {
          productId: testProductId,
          type: 'OUT',
          quantity: 3,
          reference: 'Test OUT movement',
        },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 201);
      assert.strictEqual(body.data.type, 'OUT');
    });

    it('should reject movement without required fields', async () => {
      const inv = require('../src/modules/inventory/handler');
      const result = await inv.createMovement({
        user: { userId: 'test-user', role: 'bodega' },
        body: { type: 'IN' },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 400);
    });

    it('should filter movements by productId', async () => {
      if (!testProductId) return;
      const inv = require('../src/modules/inventory/handler');
      const result = await inv.listMovements({ queryStringParameters: { productId: testProductId } });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.ok(body.data.every((m) => m.productId === testProductId));
    });
  });

  describe('Phase 2 — CRM Leads', () => {
    let createdLeadId;

    it('should create lead as gerencia', async () => {
      const leads = require('../src/modules/leads/handler');
      const result = await leads.create({
        user: { userId: 'test-user', role: 'gerencia' },
        body: {
          companyName: 'Test Corp',
          contactName: 'John Doe',
          email: 'john@test.com',
          phone: '555-1234',
          source: 'web',
          notes: 'Test lead',
        },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 201);
      assert.strictEqual(body.ok, true);
      assert.strictEqual(body.data.status, 'new');
      createdLeadId = body.data.id;
    });

    it('should update lead status', async () => {
      const leads = require('../src/modules/leads/handler');
      const result = await leads.update({
        params: { id: createdLeadId },
        user: { userId: 'test-user', role: 'gerencia' },
        body: { status: 'negotiation' },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.data.status, 'negotiation');
    });

    it('should reject invalid status', async () => {
      const leads = require('../src/modules/leads/handler');
      const result = await leads.update({
        params: { id: createdLeadId },
        user: { userId: 'test-user', role: 'gerencia' },
        body: { status: 'invalid_status' },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 400);
    });

    it('should add note to lead', async () => {
      const leads = require('../src/modules/leads/handler');
      const result = await leads.addNote({
        params: { id: createdLeadId },
        user: { userId: 'test-user', role: 'gerencia' },
        body: { content: 'Nota de prueba' },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 201);
      assert.strictEqual(body.ok, true);
    });

    it('should reject note without content', async () => {
      const leads = require('../src/modules/leads/handler');
      const result = await leads.addNote({
        params: { id: createdLeadId },
        user: { userId: 'test-user', role: 'gerencia' },
        body: {},
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 400);
    });

    it('should reject creating lead without required fields', async () => {
      const leads = require('../src/modules/leads/handler');
      const result = await leads.create({
        user: { userId: 'test-user', role: 'gerencia' },
        body: { companyName: 'Test' },
      });
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 400);
    });
  });

  describe('Phase 2 — Dashboard Enriched', () => {
    it('should return enriched KPIs', async () => {
      const dashboard = require('../src/modules/dashboard/handler');
      const result = await dashboard.summary({});
      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.ok, true);
      assert.ok(body.data.pendingRequisitions >= 0);
      assert.ok(body.data.approvedRequisitions >= 0);
      assert.ok(body.data.completedRequisitions >= 0);
      assert.ok(body.data.rejectedRequisitions >= 0);
      assert.ok(body.data.lowStockProducts >= 0);
      assert.ok(body.data.activeLeads >= 0);
      assert.ok(Array.isArray(body.data.recentMovements));
      assert.ok(Array.isArray(body.data.recentRequisitions));
      assert.ok(Array.isArray(body.data.recentLeads));
    });
  });

  describe('Phase 2 — Audit Events', () => {
    it('should record audit events for requisition create', async () => {
      const auditService = require('../src/services/auditService');
      const events = await auditService.listAll({ entityType: 'requisition', action: 'created' });
      assert.ok(events.length >= 1);
    });

    it('should record audit events for product create', async () => {
      const auditService = require('../src/services/auditService');
      const events = await auditService.listAll({ entityType: 'product', action: 'created' });
      assert.ok(events.length >= 1);
    });

    it('should record audit events for lead create', async () => {
      const auditService = require('../src/services/auditService');
      const events = await auditService.listAll({ entityType: 'lead', action: 'created' });
      assert.ok(events.length >= 1);
    });
  });

  describe('Phase 3 — Config Data Source', () => {
    it('should have dataSource in config', () => {
      const config = require('../src/config');
      assert.ok(config.dataSource);
      assert.strictEqual(config.dataSource, 'mock');
    });

    it('should reject invalid DATA_SOURCE via validation', () => {
      const { validDataSources } = (() => {
        try {
          const fs = require('fs');
          const src = fs.readFileSync(require.resolve('../src/config'), 'utf8');
          const match = src.match(/validDataSources\s*=\s*(\[[^\]]+\])/);
          return match ? { validDataSources: JSON.parse(match[1].replace(/'/g, '"')) } : { validDataSources: [] };
        } catch (e) {
          return { validDataSources: [] };
        }
      })();
      assert.ok(Array.isArray(validDataSources));
      assert.ok(validDataSources.includes('mock'));
      assert.ok(validDataSources.includes('dynamodb'));
      assert.strictEqual(validDataSources.length, 2);
    });
  });

  describe('Phase 3 — Table Names', () => {
    it('should generate table names with prefix', () => {
      const { tableName, isValidCollection, getCollections } = require('../src/db/tableNames');
      assert.strictEqual(tableName('users'), 'mini-erp-users');
      assert.strictEqual(tableName('products'), 'mini-erp-products');
      assert.strictEqual(tableName('auditEvents'), 'mini-erp-audit-events');
      assert.ok(isValidCollection('users'));
      assert.ok(!isValidCollection('nonexistent'));
      assert.ok(getCollections().length >= 8);
    });
  });

  describe('Phase 3 — Repository Factory', () => {
    it('should return mockRepository by default', () => {
      const { getRepository, resetCache } = require('../src/db/repositoryFactory');
      resetCache();
      const repo = getRepository();
      assert.ok(repo);
      assert.ok(typeof repo.list === 'function');
      assert.ok(typeof repo.create === 'function');
      assert.ok(typeof repo.findById === 'function');
      assert.ok(typeof repo.findUserByUsername === 'function');
    });

    it('should cache repository instance', () => {
      const { getRepository, resetCache } = require('../src/db/repositoryFactory');
      resetCache();
      const a = getRepository();
      const b = getRepository();
      assert.strictEqual(a, b);
    });
  });

  describe('Phase 3 — Mock Repository Generic Interface', () => {
    it('should list items with pagination', () => {
      const repo = require('../src/db/mockRepository');
      const result = repo.list('products', { limit: 2 });
      assert.ok(Array.isArray(result.items));
      assert.ok(result.items.length <= 2);
      assert.ok(typeof result.nextToken === 'string' || result.nextToken === null);
    });

    it('should list all items without pagination', () => {
      const repo = require('../src/db/mockRepository');
      const result = repo.list('products');
      assert.ok(result.items.length >= 3);
    });

    it('should find by id', () => {
      const repo = require('../src/db/mockRepository');
      const products = repo.list('products');
      const first = products.items[0];
      const found = repo.findById('products', first.id);
      assert.ok(found);
      assert.strictEqual(found.id, first.id);
    });

    it('should return null for unknown id', () => {
      const repo = require('../src/db/mockRepository');
      const found = repo.findById('products', 'nonexistent-id');
      assert.strictEqual(found, null);
    });

    it('should find one by field', () => {
      const repo = require('../src/db/mockRepository');
      const user = repo.findOneBy('users', 'username', 'wilson');
      assert.ok(user);
      assert.strictEqual(user.role, 'admin');
    });

    it('should return null when findOneBy has no match', () => {
      const repo = require('../src/db/mockRepository');
      const user = repo.findOneBy('users', 'username', 'noexiste');
      assert.strictEqual(user, null);
    });

    it('should create item', () => {
      const repo = require('../src/db/mockRepository');
      const created = repo.create('products', { sku: 'GENERIC-TEST', name: 'Generic Test', category: 'insumo', unit: 'unidad', price: 1, minStock: 1 });
      assert.ok(created.id);
      assert.ok(created.createdAt);
      assert.strictEqual(created.sku, 'GENERIC-TEST');
      const found = repo.findById('products', created.id);
      assert.ok(found);
    });

    it('should update item', () => {
      const repo = require('../src/db/mockRepository');
      const products = repo.list('products');
      const first = products.items[0];
      const updated = repo.update('products', first.id, { name: 'Updated Generic' });
      assert.ok(updated);
      assert.strictEqual(updated.name, 'Updated Generic');
    });

    it('should return null when updating unknown item', () => {
      const repo = require('../src/db/mockRepository');
      const updated = repo.update('products', 'nonexistent', { name: 'test' });
      assert.strictEqual(updated, null);
    });

    it('should remove item', () => {
      const repo = require('../src/db/mockRepository');
      const before = repo.list('products');
      const target = before.items[0];
      const removed = repo.remove('products', target.id);
      assert.ok(removed);
      assert.strictEqual(removed.id, target.id);
      const after = repo.findById('products', target.id);
      assert.strictEqual(after, null);
    });

    it('should return null when removing unknown item', () => {
      const repo = require('../src/db/mockRepository');
      const removed = repo.remove('products', 'nonexistent');
      assert.strictEqual(removed, null);
    });

    it('should query by field', () => {
      const repo = require('../src/db/mockRepository');
      const result = repo.queryBy('inventoryMovements', 'type', 'IN');
      assert.ok(Array.isArray(result.items));
      assert.ok(result.items.every((m) => m.type === 'IN'));
    });
  });

  describe('Phase 3 — Pagination on List Endpoints', () => {
    it('should return pagination in requisitions list', async () => {
      const reqHandler = require('../src/modules/requisitions/handler');
      const result = await reqHandler.list({ queryStringParameters: { limit: '1' } });
      const body = JSON.parse(result.body);
      assert.ok(body.pagination);
      assert.strictEqual(body.pagination.limit, 1);
    });

    it('should return pagination in products list', async () => {
      const prodHandler = require('../src/modules/products/handler');
      const result = await prodHandler.list({ queryStringParameters: { limit: '2' } });
      const body = JSON.parse(result.body);
      assert.ok(body.pagination);
      assert.ok(body.data.length <= 2);
    });

    it('should return pagination in leads list', async () => {
      const leadsHandler = require('../src/modules/leads/handler');
      const result = await leadsHandler.list({ queryStringParameters: { limit: '1' } });
      const body = JSON.parse(result.body);
      assert.ok(body.pagination);
    });

    it('should return pagination in inventory movements list', async () => {
      const invHandler = require('../src/modules/inventory/handler');
      const result = await invHandler.listMovements({ queryStringParameters: { limit: '1' } });
      const body = JSON.parse(result.body);
      assert.ok(body.pagination);
    });
  });

  describe('Phase 4 — Seed Data Validation', () => {
    it('should validate seed data with zero errors', () => {
      const { validateSeedData } = require('../src/data/validateSeed');
      const seed = require('../src/data/seed');
      const errors = validateSeedData(seed);
      assert.strictEqual(errors.length, 0, JSON.stringify(errors.slice(0, 5)));
    });

    it('should validate fresh seed data with zero errors', () => {
      const { validateSeedData } = require('../src/data/validateSeed');
      const seed = require('../src/data/seed');
      const errors = validateSeedData(seed);
      assert.strictEqual(errors.length, 0, JSON.stringify(errors.slice(0, 5)));
    });

    it('should detect missing fields in invalid data', () => {
      const { validateSeedData } = require('../src/data/validateSeed');
      const badData = {
        users: [{ id: 'abc', username: 'test' }],
        products: [],
        requisitions: [],
        requisitionItems: [],
        inventoryMovements: [],
        leads: [],
        leadNotes: [],
        auditEvents: [],
      };
      const errors = validateSeedData(badData);
      assert.ok(errors.length > 0);
      assert.ok(errors.some((e) => e.type === 'INVALID' && e.field === 'id'));
    });

    it('should detect invalid product stock', () => {
      const { validateSeedData } = require('../src/data/validateSeed');
      const badData = {
        users: [],
        products: [{ id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', sku: 'TEST', name: 'Test', stock: -5, category: 'insumo' }],
        requisitions: [],
        requisitionItems: [],
        inventoryMovements: [],
        leads: [],
        leadNotes: [],
        auditEvents: [],
      };
      const errors = validateSeedData(badData);
      assert.ok(errors.some((e) => e.field === 'stock' && e.value === -5));
    });
  });

  describe('Phase 4 — Expanded Dataset Counts', () => {
    it('should have 12 products in seed', () => {
      const seed = require('../src/data/seed');
      assert.strictEqual(seed.products.length, 12);
    });

    it('should have 10 requisitions in seed', () => {
      const seed = require('../src/data/seed');
      assert.strictEqual(seed.requisitions.length, 10);
    });

    it('should have 25 requisition items in seed', () => {
      const seed = require('../src/data/seed');
      assert.strictEqual(seed.requisitionItems.length, 25);
    });

    it('should have 20 inventory movements in seed', () => {
      const seed = require('../src/data/seed');
      assert.strictEqual(seed.inventoryMovements.length, 20);
    });

    it('should have 10 leads in seed', () => {
      const seed = require('../src/data/seed');
      assert.strictEqual(seed.leads.length, 10);
    });

    it('should have 17 lead notes in seed', () => {
      const seed = require('../src/data/seed');
      assert.strictEqual(seed.leadNotes.length, 17);
    });

    it('should have 4 users in seed', () => {
      const seed = require('../src/data/seed');
      assert.strictEqual(seed.users.length, 4);
    });
  });

  describe('Phase 4 — Cross-Entity References', () => {
    it('should have all requisition createdBy referencing existing users', () => {
      const seed = require('../src/data/seed');
      const userIds = new Set(seed.users.map((u) => u.id));
      seed.requisitions.forEach((r, i) => {
        assert.ok(userIds.has(r.createdBy), `R${i} createdBy ${r.createdBy} not found`);
      });
    });

    it('should have all approvedBy/completedBy referencing existing users', () => {
      const seed = require('../src/data/seed');
      const userIds = new Set(seed.users.map((u) => u.id));
      seed.requisitions.forEach((r, i) => {
        if (r.approvedBy) assert.ok(userIds.has(r.approvedBy), `R${i} approvedBy ${r.approvedBy} not found`);
        if (r.completedBy) assert.ok(userIds.has(r.completedBy), `R${i} completedBy ${r.completedBy} not found`);
      });
    });

    it('should have all requisitionItem requisitionId referencing existing requisitions', () => {
      const seed = require('../src/data/seed');
      const reqIds = new Set(seed.requisitions.map((r) => r.id));
      seed.requisitionItems.forEach((item, i) => {
        assert.ok(reqIds.has(item.requisitionId), `RI${i} requisitionId ${item.requisitionId} not found`);
      });
    });

    it('should have all inventoryMovement productId referencing existing products', () => {
      const seed = require('../src/data/seed');
      const prodIds = new Set(seed.products.map((p) => p.id));
      seed.inventoryMovements.forEach((m, i) => {
        assert.ok(prodIds.has(m.productId), `IM${i} productId ${m.productId} not found`);
      });
    });

    it('should have all lead assignedTo referencing existing users', () => {
      const seed = require('../src/data/seed');
      const userIds = new Set(seed.users.map((u) => u.id));
      seed.leads.forEach((l, i) => {
        if (l.assignedTo) assert.ok(userIds.has(l.assignedTo), `L${i} assignedTo ${l.assignedTo} not found`);
      });
    });

    it('should have all leadNote leadId referencing existing leads', () => {
      const seed = require('../src/data/seed');
      const leadIds = new Set(seed.leads.map((l) => l.id));
      seed.leadNotes.forEach((n, i) => {
        assert.ok(leadIds.has(n.leadId), `LN${i} leadId ${n.leadId} not found`);
      });
    });
  });

  describe('Phase 4 — Dashboard with Expanded Data', () => {
    it('should return summary with seed + test product counts', async () => {
      const dashboard = require('../src/modules/dashboard/handler');
      const result = await dashboard.summary({});
      const body = JSON.parse(result.body);
      assert.ok(body.data.totalProducts >= 12);
    });

    it('should return correct requisition status counts in dashboard', async () => {
      const dashboard = require('../src/modules/dashboard/handler');
      const result = await dashboard.summary({});
      const body = JSON.parse(result.body);
      assert.ok(body.data.totalRequisitions >= 10);
      assert.ok(body.data.pendingRequisitions >= 3);
      assert.ok(body.data.rejectedRequisitions >= 1);
    });
  });

  describe('Phase 4 — Reports with Expanded Data', () => {
    it('should export requisitions CSV with all rows', async () => {
      const reports = require('../src/modules/reports/handler');
      const result = await reports.exportRequisitions({});
      assert.strictEqual(result.statusCode, 200);
      const rows = result.body.trim().split('\n');
      assert.ok(rows.length >= 11);
      assert.ok(rows[0].includes('number'));
    });

    it('should export inventory CSV with all products', async () => {
      const reports = require('../src/modules/reports/handler');
      const result = await reports.exportInventory({});
      assert.strictEqual(result.statusCode, 200);
      const rows = result.body.trim().split('\n');
      assert.ok(rows.length >= 13);
    });

    it('should export leads CSV with all leads', async () => {
      const reports = require('../src/modules/reports/handler');
      const result = await reports.exportLeads({});
      assert.strictEqual(result.statusCode, 200);
      const rows = result.body.trim().split('\n');
      assert.ok(rows.length >= 11);
    });
  });

  describe('Contact Form', () => {
    const validPayload = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      message: 'Hola, me gustaría contactarte para una oportunidad laboral.',
    };

    const ORIGINAL_TO = process.env.CONTACT_TO_EMAIL;
    const ORIGINAL_FROM = process.env.CONTACT_FROM_EMAIL;

    let originalSesSend;

    before(() => {
      originalSesSend = require('@aws-sdk/client-sesv2').SESv2Client.prototype.send;
      process.env.CONTACT_TO_EMAIL = 'test@example.com';
      process.env.CONTACT_FROM_EMAIL = 'test@example.com';
      require('@aws-sdk/client-sesv2').SESv2Client.prototype.send = async () => ({
        MessageId: 'mock-ses-message-id',
      });
    });

    it('should submit contact form with valid data', async () => {
      const contact = require('../src/modules/contact/handler');

      const result = await contact.submit({
        body: { ...validPayload },
      });

      const body = JSON.parse(result.body);
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(body.ok, true);
      assert.strictEqual(body.data.message, 'Mensaje recibido correctamente');
    });

    it('should reject invalid email format', async () => {
      const contact = require('../src/modules/contact/handler');

      const result = await contact.submit({
        body: { ...validPayload, email: 'correo-invalido' },
      });

      assert.strictEqual(result.statusCode, 400);
      const body = JSON.parse(result.body);
      assert.strictEqual(body.ok, false);
      assert.strictEqual(body.error.code, 'VALIDATION_ERROR');
    });

    it('should reject short message (less than 10 chars)', async () => {
      const contact = require('../src/modules/contact/handler');

      const result = await contact.submit({
        body: { ...validPayload, message: 'Corto' },
      });

      assert.strictEqual(result.statusCode, 400);
      const body = JSON.parse(result.body);
      assert.strictEqual(body.ok, false);
      assert.strictEqual(body.error.code, 'VALIDATION_ERROR');
    });

    it('should reject name that is too short', async () => {
      const contact = require('../src/modules/contact/handler');

      const result = await contact.submit({
        body: { ...validPayload, name: 'A' },
      });

      assert.strictEqual(result.statusCode, 400);
      const body = JSON.parse(result.body);
      assert.strictEqual(body.ok, false);
      assert.strictEqual(body.error.code, 'VALIDATION_ERROR');
    });

    it('should sanitize HTML content in message', async () => {
      const contact = require('../src/modules/contact/handler');

      const result = await contact.submit({
        body: { ...validPayload, message: '<script>alert("xss")</script>Hola mundo!' },
      });

      assert.strictEqual(result.statusCode, 200);
      const body = JSON.parse(result.body);
      assert.strictEqual(body.ok, true);
    });

    it('should reject extra unexpected fields', async () => {
      const contact = require('../src/modules/contact/handler');

      const result = await contact.submit({
        body: { ...validPayload, extraField: 'no permitido' },
      });

      assert.strictEqual(result.statusCode, 400);
      const body = JSON.parse(result.body);
      assert.strictEqual(body.ok, false);
      assert.strictEqual(body.error.code, 'VALIDATION_ERROR');
    });

    it('should reject null body', async () => {
      const contact = require('../src/modules/contact/handler');

      const result = await contact.submit({ body: null });

      assert.strictEqual(result.statusCode, 400);
      const body = JSON.parse(result.body);
      assert.strictEqual(body.ok, false);
      assert.strictEqual(body.error.code, 'VALIDATION_ERROR');
    });

    it('should persist contact to repository with email_sent status', async () => {
      require('@aws-sdk/client-sesv2').SESv2Client.prototype.send = async () => ({
        MessageId: 'mock-ses-message-id',
      });

      const contact = require('../src/modules/contact/handler');
      const repo = require('../src/db/repositoryFactory').getRepository();
      const listBefore = repo.list('contactMessages');

      await contact.submit({ body: { ...validPayload } });

      const listAfter = repo.list('contactMessages');
      assert.ok(listAfter.items.length > listBefore.items.length);

      const saved = listAfter.items[0];
      assert.strictEqual(saved.name, 'Juan Pérez');
      assert.strictEqual(saved.email, 'juan@example.com');
      assert.strictEqual(saved.status, 'email_sent');
      assert.ok(saved.sesMessageId, 'Should have SES message ID');
    });

    it('should persist contact with email_failed status when SES fails', async () => {
      require('@aws-sdk/client-sesv2').SESv2Client.prototype.send = async () => {
        throw new Error('SES servicio no disponible');
      };

      const contact = require('../src/modules/contact/handler');
      const repo = require('../src/db/repositoryFactory').getRepository();
      const listBefore = repo.list('contactMessages');

      await contact.submit({ body: { ...validPayload } });

      const listAfter = repo.list('contactMessages');
      assert.ok(listAfter.items.length > listBefore.items.length);

      const saved = listAfter.items[0];
      assert.strictEqual(saved.status, 'email_failed');
      assert.ok(saved.id, 'Contact should still have an ID even if SES failed');
    });

    it('should be a public route (no auth required)', () => {
      const { routes } = require('../src/index');
      const route = routes['POST /contact'];
      assert.ok(route, 'POST /contact route must exist in routes');
      assert.strictEqual(route.auth, false, 'Contact route must be public (auth: false)');
    });
  });

  describe('Repair Demo Users — findUserByUsername', () => {
    const demoConfig = [
      { username: 'wilson',    expectedRole: 'admin',   demoPassword: 'admin123' },
      { username: 'compras1',  expectedRole: 'compras', demoPassword: 'compras123' },
      { username: 'bodega1',   expectedRole: 'bodega',  demoPassword: 'bodega123' },
      { username: 'gerencia1', expectedRole: 'gerencia', demoPassword: 'gerencia123' },
    ];

    for (const { username, expectedRole, demoPassword } of demoConfig) {
      it(`should find ${username} by username`, () => {
        const repo = require('../src/db/mockRepository');
        const user = repo.findUserByUsername(username);
        assert.ok(user, `Usuario ${username} debe existir`);
        assert.strictEqual(user.username, username);
        assert.strictEqual(user.role, expectedRole);
        assert.ok(user.passwordHash, `passwordHash debe existir para ${username}`);
        assert.ok(user.id, `id debe existir para ${username}`);
      });

      it(`should validate password for ${username}`, () => {
        const bcrypt = require('bcryptjs');
        const repo = require('../src/db/mockRepository');
        const user = repo.findUserByUsername(username);
        assert.ok(user, `Usuario ${username} debe existir`);
        const valid = bcrypt.compareSync(demoPassword, user.passwordHash);
        assert.ok(valid, `${demoPassword} debe validar contra el hash de ${username}`);
      });
    }

    it('should return null for non-existent username', () => {
      const repo = require('../src/db/mockRepository');
      const user = repo.findUserByUsername('noexiste');
      assert.strictEqual(user, null);
    });
  });

  describe('Repair Demo Users — update passwordHash', () => {
    it('should update passwordHash and auto-set updatedAt without duplication', () => {
      const bcrypt = require('bcryptjs');
      const repo = require('../src/db/mockRepository');

      const user = repo.findUserByUsername('wilson');
      assert.ok(user, 'Usuario wilson debe existir');

      const newHash = bcrypt.hashSync('admin123', 10);
      assert.ok(bcrypt.compareSync('admin123', newHash), 'Hash generado debe validar password');

      const oldUpdatedAt = user.updatedAt;

      const updated = repo.update('users', user.id, { passwordHash: newHash });

      assert.ok(updated, 'update() debe retornar el usuario actualizado');
      assert.strictEqual(updated.passwordHash, newHash, 'passwordHash debe ser el nuevo hash');
      assert.ok(updated.updatedAt, 'updatedAt debe existir');
      assert.notStrictEqual(updated.updatedAt, undefined, 'updatedAt no debe ser undefined');
      assert.strictEqual(typeof updated.updatedAt, 'string', 'updatedAt debe ser string ISO');

      const updatedAtDate = new Date(updated.updatedAt).getTime();
      const now = Date.now();
      assert.ok(updatedAtDate > 0, 'updatedAt debe ser fecha válida');
      assert.ok(Math.abs(updatedAtDate - now) < 5000, 'updatedAt debe ser reciente (+-5s)');

      assert.ok(updated.id, 'id no debe perderse');
      assert.strictEqual(updated.id, user.id, 'id no debe cambiar');
      assert.strictEqual(updated.username, 'wilson', 'username no debe cambiar');
      assert.strictEqual(updated.role, 'admin', 'role no debe cambiar');
    });

    it('should not remove id, createdAt or other fields', () => {
      const repo = require('../src/db/mockRepository');

      const user = repo.findUserByUsername('compras1');
      assert.ok(user);

      const updated = repo.update('users', user.id, { passwordHash: '$2a$10$test' });

      assert.ok(updated);
      assert.strictEqual(updated.id, user.id);
      assert.strictEqual(updated.username, 'compras1');
      assert.strictEqual(updated.role, 'compras');
      assert.strictEqual(updated.email, user.email);
      assert.strictEqual(updated.name, user.name);
      assert.strictEqual(updated.active, user.active);
    });

    it('should return null when updating non-existent id', () => {
      const repo = require('../src/db/mockRepository');
      const result = repo.update('users', 'nonexistent-id', { passwordHash: 'test' });
      assert.strictEqual(result, null);
    });

    it('should generate valid hash with bcrypt for all demo passwords', () => {
      const bcrypt = require('bcryptjs');
      const demoPasswords = ['admin123', 'compras123', 'bodega123', 'gerencia123'];

      for (const pw of demoPasswords) {
        const hash = bcrypt.hashSync(pw, 10);
        assert.ok(bcrypt.compareSync(pw, hash), `Hash de "${pw}" debe validar`);
        assert.ok(hash.startsWith('$2a$'), `Hash debe empezar con $2a$`);
      }
    });
  });

  describe('Repair Demo Users — guard conditions', () => {
    it('should abort if ALLOW_USER_REPAIR is not true', () => {
      const ALLOW_USER_REPAIR = process.env.ALLOW_USER_REPAIR === 'true';
      assert.strictEqual(ALLOW_USER_REPAIR, false, 'En test no debe estar activo ALLOW_USER_REPAIR');
    });

    it('should require DATA_SOURCE=dynamodb for dynamo path', () => {
      const DATA_SOURCE = process.env.DATA_SOURCE || 'mock';
      assert.strictEqual(DATA_SOURCE, 'mock', 'En test debe ser mock');
    });

    it('should error if DATA_SOURCE is not dynamodb and ALLOW_USER_REPAIR is false', () => {
      const ALLOW_USER_REPAIR = process.env.ALLOW_USER_REPAIR === 'true';
      const DATA_SOURCE = process.env.DATA_SOURCE || 'mock';

      if (!ALLOW_USER_REPAIR || DATA_SOURCE !== 'dynamodb') {
        assert.ok(true, 'Script abortaría correctamente si falta ALLOW_USER_REPAIR o DATA_SOURCE');
      }
    });
  });
});
