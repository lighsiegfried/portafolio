# Backend Phase 11 — Reliability & Professional Quality Notes

> Scope: `apps/backend` only. No AWS infrastructure, WAF, or data-model changes.
> Preserves the Lambda router architecture (no Express), the response envelope
> (`{ ok, data }` / `{ ok, error: { code, message } }`), `repositoryFactory`
> (mock/dynamo via `DATA_SOURCE`), and all existing modules.

## 1. Structured request logging

Every request now emits a single structured JSON log line on completion (success
**and** error paths), built by the pure, unit-tested `logger.buildRequestLog()`:

| field | source |
|-------|--------|
| `requestId` | API Gateway request id (or a local fallback) |
| `route` | matched route **template**, e.g. `PATCH /requisitions/{id}/approve` (low cardinality — never the raw path with ids) |
| `method` | HTTP method |
| `userId` | `event.user.userId` when authenticated (omitted otherwise) |
| `statusCode` | final response status |
| `latencyMs` | wall-clock handler latency |
| `coldStart` | `true` only on the first invocation of a warm container |
| `errorCode` | parsed from the error body for 4xx/5xx (omitted on success) |

Severity tracks the status code (5xx → ERROR, 4xx → WARN, else INFO).
`matchRoute()` now also returns `routeKey` so the router can log the template.

## 2. Idempotency for critical mutations (opt-in)

New `services/idempotencyService.js`. **Opt-in**: only engages when the client
sends an `Idempotency-Key` request header. When the same `(userId + route + key)`
repeats within the TTL, the original **2xx** response is replayed (with an
`Idempotent-Replay: true` response header) instead of re-running the mutation.

Wired into the critical actions:
- `POST /requisitions` (create)
- `PATCH /requisitions/{id}/approve|reject|complete`
- `POST /inventory/movements` (create) — wraps the stock side effect so a retry
  does not apply the stock change twice
- `POST /leads` (create)

**Design / limitations (intentional, Free-Tier friendly):**
- In-memory, **container-scoped** (not shared across concurrent Lambda
  containers); covers the common double-click / client-retry-against-warm-container
  case without provisioning a new DynamoDB table or any infrastructure.
- Only 2xx responses are cached, so transient errors remain retryable.
- Bounded by a 10-minute TTL and a hard entry cap (no unbounded memory growth).
- **No behavior change when the header is absent** — fully backward compatible.

## 3. Consistent error codes

New `utils/errorCodes.js` centralizes the code taxonomy. Values are identical to
the strings already returned, so the public contract is unchanged; new code uses
the constants as a single source of truth.

## 4. Audit consistency

`POST /inventory/movements` previously recorded **no** audit event (the only
mutating action that didn't). It now records
`auditService.record('inventory_movement', <id>, 'created', ...)`, consistent
with requisitions / products / leads. No sensitive data is logged (audit stores
business state only; user credentials are never audited).

## 5. DynamoDB safety (already enforced — confirmed + tested)

- **Stock cannot go negative**: atomic conditional `adjustProductStock` (Phase 9)
  used by both inventory movements and product stock updates.
- **Invalid state transitions rejected**: requisition `approve/reject/complete`
  guards return `409`-style `CONFLICT`.
- **SKU uniqueness**: `products.create` rejects duplicates (`409 CONFLICT`).

## 6. Validation

Kept handler-level (lightweight, no heavy framework, modules not rewritten),
consistent with the existing codebase. The shared `middleware/validate.js`
remains available for schema-based validation where desired.

## Tests

Added a focused `Phase 11` block in `tests/smoke.test.js`: route-key resolution,
`buildRequestLog` shape, idempotent replay for requisition create and inventory
movement (and distinct creates without a key), and inventory-movement audit.
Also made three pre-existing contact tests deterministic (they relied on
`items[0]` ordering with millisecond-tie `createdAt`; now they locate the
just-created record by id diff).

`npm run test:backend` → 238 passing (verified deterministic across repeated
runs). `npm run build:backend` → `lambda.zip` builds (~3.79 MB, unchanged).
