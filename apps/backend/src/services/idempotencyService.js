/**
 * Lightweight, container-scoped idempotency for critical mutations.
 *
 * Opt-in: only engages when the client sends an `Idempotency-Key` header. When
 * the same (user + route + key) repeats within the TTL, the original successful
 * (2xx) response is replayed instead of running the mutation again — protecting
 * against double-submits and client retries.
 *
 * Design notes / limitations (intentional, to stay Free-Tier friendly):
 *  - In-memory only. State lives for the lifetime of a warm Lambda container; it
 *    is NOT shared across concurrent containers. This covers the common case
 *    (a user double-clicking, or a client retrying against a warm container)
 *    without provisioning a new DynamoDB table or any infrastructure.
 *  - Only 2xx responses are cached, so transient errors can be retried.
 *  - Bounded by TTL + a hard entry cap to avoid unbounded memory growth.
 */
const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ENTRIES = 1000;

const store = new Map(); // cacheKey -> { response, expiresAt }

function now() {
  return Date.now();
}

/** Read the Idempotency-Key header case-insensitively; returns null when absent. */
function extractKey(event) {
  const headers = event && event.headers;
  if (!headers || typeof headers !== 'object') return null;
  for (const name of Object.keys(headers)) {
    if (name.toLowerCase() === 'idempotency-key') {
      const value = headers[name];
      return value && String(value).trim() ? String(value).trim() : null;
    }
  }
  return null;
}

function prune() {
  const t = now();
  for (const [key, entry] of store) {
    if (entry.expiresAt <= t) store.delete(key);
  }
  // Hard cap: drop oldest insertions (Map preserves insertion order).
  while (store.size > MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    store.delete(oldest);
  }
}

/**
 * Run `fn` with idempotency semantics. When no Idempotency-Key header is
 * present, `fn` runs normally (no caching). Otherwise a cached 2xx response is
 * replayed; a fresh 2xx response is stored before being returned.
 *
 * `fn` must return a Lambda-style response ({ statusCode, headers, body }).
 */
async function run(event, routeKey, fn, ttlMs = DEFAULT_TTL_MS) {
  const idemKey = extractKey(event);
  if (!idemKey) {
    return fn();
  }

  const userId = (event.user && event.user.userId) || 'anon';
  const cacheKey = `${userId}|${routeKey}|${idemKey}`;

  const cached = store.get(cacheKey);
  if (cached && cached.expiresAt > now()) {
    return {
      ...cached.response,
      headers: { ...(cached.response.headers || {}), 'Idempotent-Replay': 'true' },
    };
  }

  const response = await fn();

  if (response && typeof response.statusCode === 'number' && response.statusCode < 300) {
    prune();
    store.set(cacheKey, { response, expiresAt: now() + ttlMs });
  }

  return response;
}

/** Test helper: clear all stored entries. */
function _reset() {
  store.clear();
}

module.exports = { run, extractKey, _reset };
