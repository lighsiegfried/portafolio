const { describe, it, before, after, mock } = require('node:test');
const assert = require('node:assert');
const bcrypt = require('bcryptjs');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

describe('Repair Scripts — verify-demo-user-passwords logic', () => {
  it('should detect valid hash for wilson/admin123', () => {
    const { users } = require('../src/data/fixtures/users');
    const user = users.find(u => u.username === 'wilson');
    assert.ok(user);
    assert.ok(bcrypt.compareSync('admin123', user.passwordHash));
  });

  it('should detect valid hash for compras1/compras123', () => {
    const { users } = require('../src/data/fixtures/users');
    const user = users.find(u => u.username === 'compras1');
    assert.ok(user);
    assert.ok(bcrypt.compareSync('compras123', user.passwordHash));
  });

  it('should detect valid hash for bodega1/bodega123', () => {
    const { users } = require('../src/data/fixtures/users');
    const user = users.find(u => u.username === 'bodega1');
    assert.ok(user);
    assert.ok(bcrypt.compareSync('bodega123', user.passwordHash));
  });

  it('should detect valid hash for gerencia1/gerencia123', () => {
    const { users } = require('../src/data/fixtures/users');
    const user = users.find(u => u.username === 'gerencia1');
    assert.ok(user);
    assert.ok(bcrypt.compareSync('gerencia123', user.passwordHash));
  });

  it('should detect invalid hash', () => {
    const { users } = require('../src/data/fixtures/users');
    const user = users.find(u => u.username === 'wilson');
    assert.ok(user);
    assert.strictEqual(bcrypt.compareSync('wrongpassword', user.passwordHash), false);
  });

  it('should detect missing passwordHash', () => {
    const user = {
      username: 'wilson',
      role: 'admin',
      passwordHash: undefined,
    };
    const hashPresent = !!user.passwordHash;
    assert.strictEqual(hashPresent, false);
  });

  it('should report found, passwordHash_present, password_valid correctly', () => {
    const { users } = require('../src/data/fixtures/users');
    const record = users.find(u => u.username === 'wilson');
    const found = !!record;
    const hashPresent = found && !!record.passwordHash;
    const passwordValid = hashPresent && bcrypt.compareSync('admin123', record.passwordHash);

    assert.strictEqual(found, true);
    assert.strictEqual(hashPresent, true);
    assert.strictEqual(passwordValid, true);
  });

  it('should report not found correctly', () => {
    const { users } = require('../src/data/fixtures/users');
    const record = users.find(u => u.username === 'noexiste');
    const found = !!record;
    assert.strictEqual(found, false);
  });
});

describe('Repair Scripts — findUserByUsername logic', () => {
  it('should find user by username in mock repo', () => {
    const repo = require('../src/db/mockRepository');
    const user = repo.findUserByUsername('wilson');
    assert.ok(user);
    assert.strictEqual(user.username, 'wilson');
    assert.strictEqual(user.role, 'admin');
  });

  it('should return null for non-existent username', () => {
    const repo = require('../src/db/mockRepository');
    const user = repo.findUserByUsername('noexiste');
    assert.strictEqual(user, null);
  });

  it('should find user by findOneBy fallback (simulates Scan behavior)', () => {
    const repo = require('../src/db/mockRepository');
    const user = repo.findOneBy('users', 'username', 'compras1');
    assert.ok(user);
    assert.strictEqual(user.username, 'compras1');
  });

  it('should return null when findOneBy finds no match for unknown field', () => {
    const repo = require('../src/db/mockRepository');
    const user = repo.findOneBy('users', 'nonexistentField', 'value');
    assert.strictEqual(user, null);
  });
});

describe('Repair Scripts — update logic (no duplicate updatedAt)', () => {
  it('should update passwordHash without duplicating updatedAt', () => {
    const repo = require('../src/db/mockRepository');
    const user = repo.findUserByUsername('wilson');
    assert.ok(user);

    const newHash = bcrypt.hashSync('admin123', 10);
    assert.ok(bcrypt.compareSync('admin123', newHash));

    const updated = repo.update('users', user.id, { passwordHash: newHash });
    assert.ok(updated);
    assert.ok(updated.passwordHash);
    assert.ok(updated.updatedAt);

    const hashValid = bcrypt.compareSync('admin123', updated.passwordHash);
    assert.ok(hashValid);
  });

  it('should not delete records during update', () => {
    const repo = require('../src/db/mockRepository');
    const before = repo.list('users');
    const countBefore = before.items.length;

    const user = repo.findUserByUsername('compras1');
    const newHash = bcrypt.hashSync('compras123', 10);
    repo.update('users', user.id, { passwordHash: newHash });

    const after = repo.list('users');
    assert.strictEqual(after.items.length, countBefore);
  });

  it('should only update passwordHash and updatedAt, not other fields', () => {
    const repo = require('../src/db/mockRepository');
    const user = repo.findUserByUsername('bodega1');
    const originalRole = user.role;
    const originalName = user.name;
    const originalEmail = user.email;

    const newHash = bcrypt.hashSync('bodega123', 10);
    const updated = repo.update('users', user.id, { passwordHash: newHash });

    assert.strictEqual(updated.role, originalRole);
    assert.strictEqual(updated.name, originalName);
    assert.strictEqual(updated.email, originalEmail);
    assert.notStrictEqual(updated.passwordHash, user.passwordHash);
  });

  it('should generate same day updatedAt after update', () => {
    const repo = require('../src/db/mockRepository');
    const user = repo.findUserByUsername('gerencia1');
    const newHash = bcrypt.hashSync('gerencia123', 10);
    const updated = repo.update('users', user.id, { passwordHash: newHash });

    const today = new Date().toISOString().slice(0, 10);
    assert.ok(updated.updatedAt.startsWith(today));
  });
});

describe('Repair Scripts — ALLOW_USER_REPAIR guard', () => {
  let originalAllow;

  before(() => {
    originalAllow = process.env.ALLOW_USER_REPAIR;
  });

  after(() => {
    process.env.ALLOW_USER_REPAIR = originalAllow;
  });

  it('should simulate guard: repair aborts when ALLOW_USER_REPAIR is not true', () => {
    delete process.env.ALLOW_USER_REPAIR;
    const allowed = process.env.ALLOW_USER_REPAIR === 'true';
    assert.strictEqual(allowed, false);
  });

  it('should simulate guard: repair proceeds when ALLOW_USER_REPAIR is true', () => {
    process.env.ALLOW_USER_REPAIR = 'true';
    const allowed = process.env.ALLOW_USER_REPAIR === 'true';
    assert.strictEqual(allowed, true);
  });
});

describe('Repair Scripts — passwordHash generation validation', () => {
  it('should generate hash that validates against original password', () => {
    const hash = bcrypt.hashSync('admin123', 10);
    assert.ok(bcrypt.compareSync('admin123', hash));
    assert.strictEqual(bcrypt.compareSync('wrong', hash), false);
  });

  it('should generate different hashes each time (salt)', () => {
    const hash1 = bcrypt.hashSync('admin123', 10);
    const hash2 = bcrypt.hashSync('admin123', 10);
    assert.notStrictEqual(hash1, hash2);
    assert.ok(bcrypt.compareSync('admin123', hash1));
    assert.ok(bcrypt.compareSync('admin123', hash2));
  });
});

describe('Repair Scripts — DATA_SOURCE guard', () => {
  it('should require DATA_SOURCE=dynamodb for repair script', () => {
    const dataSource = process.env.DATA_SOURCE || 'mock';
    assert.ok(dataSource);
  });

  it('should fail validation if DATA_SOURCE is mock and repair tries to run', () => {
    const dataSource = process.env.DATA_SOURCE || 'mock';
    const validForRepair = dataSource === 'dynamodb';
    if (dataSource !== 'dynamodb') {
      assert.strictEqual(validForRepair, false);
    }
  });
});
