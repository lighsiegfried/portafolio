# Mini ERP / CRM Lite — Modernization QA & Regression Review

> Principal-engineer final review covering the Phase 7–12 modernization
> (CRM/Leads, Requisitions, Inventory, Reports UI redesigns; backend reliability
> hardening; Terraform observability & cost protection).
> **Date:** 2026-06-20 · **Reviewer:** automated regression + architecture pass.

---

## 1. What was checked

| Area | Checked |
|------|---------|
| Frontend Mini ERP routes & components | `MiniErpApp` routing (7 routes), redesigned pages (Leads, Requisitions, Inventory, Reports, Products, Dashboard), new `config/`, `components/{data-display,forms,feedback,ui,layout,charts}`, removal of `MiniErpHeader`/`MiniErpSidebar`. |
| Backend changes | Atomic stock (`adjustProductStock`, mock+dynamo), inventory/products stock paths, structured request logging, idempotency service + wiring, audit consistency, error-code constants. |
| Terraform | Lambda reserved concurrency, API GW throttling parameterization, CloudWatch alarms, optional SNS/Budget, outputs. |
| GitHub Actions | Whether workflows were modified; OIDC usage; static-credential check. |
| Documentation | Phase notes + this QA deliverable; git-tracking status. |
| Safety gates | WAF untouched, no hardcoded secrets, OIDC-only AWS access, no `terraform apply`, Free-Tier preserved. |

---

## 2. Passing validations

| Command | Result |
|---------|--------|
| `npm run build` (root → frontend) | ✅ Pass (same artifact as below) |
| `npm run build:frontend` | ✅ Pass — only the pre-existing chunk-size warning |
| `npm run test:backend` | ✅ **238 passed / 0 failed** (verified deterministic across repeated runs) |
| `npm run build:backend` | ✅ `lambda.zip` built (~3.79 MB) |
| `terraform fmt -check -recursive` | ✅ Clean |
| `terraform validate` | ✅ `Success! The configuration is valid.` |

---

## 3. Failing validations

**None.** All six validation commands pass.

---

## 4. Safety & assumption verification

| Gate | Status | Evidence |
|------|--------|----------|
| WAF not modified | ✅ | No `wafv2`/`web_acl` resources anywhere in `infra/terraform`; only an "intentionally untouched" comment in `monitoring.tf` and a cost note in `README.md`. WAF is managed outside this stack. |
| No hardcoded secrets | ✅ | `jwt_secret` is `sensitive` and sourced from a CI secret; no `AKIA*`, private keys, or inline credentials in changed files. Account ID / bucket names in the workflow are pre-existing identifiers, not secrets. |
| AWS access via OIDC, not local CLI | ✅ | Workflows use `aws-actions/configure-aws-credentials` with `role-to-assume` (OIDC) + `id-token: write`; no static keys. **Workflows were not modified this phase.** |
| `terraform apply` not executed | ✅ | Only `fmt`, `validate`, and `init -backend=false` were run locally (no AWS calls, no state mutation). No `tfstate`/`backend.tf` committed or present. |
| Free Tier / low-cost preserved | ✅ | DynamoDB `PAY_PER_REQUEST`; Lambda `nodejs20.x` @128 MB; reserved concurrency **caps** cost; ≤10 CloudWatch alarms (free tier); SNS & Budget are opt-in/disabled by default; CloudFront/S3 remain existing-unmanaged. Frontend deps are client-side only (no Lambda/runtime cost). |

### Architecture preservation
CloudFront + private S3 (OAC) referenced safely via `existing_*` vars (`manage_cloudfront=false`, `create_frontend_bucket=false`) · API Gateway HTTP API v2 · Lambda Node.js router (no Express) · `repositoryFactory` mock/dynamo via `DATA_SOURCE` · response envelope `{ ok, data }` / `{ ok, error:{ code,message } }` · all 8 backend modules intact. **No regressions.**

---

## 5. Bugs / findings

| # | Finding | Severity | Notes |
|---|---------|----------|-------|
| F1 | ✅ **RESOLVED** — `docs/` was git-ignored via a bare `docs` entry, so the QA deliverable and Phase 11/12 notes were untrackable. | Medium (governance, not code) | Fixed in `.gitignore`: changed `docs` → `docs/*` with explicit `!` negations for the three modernization deliverables (`mini-erp-modernization-qa.md`, `backend-phase-11-reliability-notes.md`, `terraform-phase-12-observability-notes.md`). All other docs remain local-only. Verified with `git check-ignore`. |
| F2 | **Inventory movement is not transactional**: stock is adjusted atomically *before* the movement row is written; if the movement insert fails, stock changes without an audit/movement record. | Low | No DB transactions available on this stack; acceptable for demo/Free-Tier. The critical guarantee (no negative stock / no oversell) is preserved. Documented in Phase 9/11 notes. |
| F3 | **Idempotency is in-memory & container-scoped**, and replays on key match without comparing the request body. | Low (by design) | Opt-in via `Idempotency-Key`; protects double-click/warm-container retries without provisioning a table. Not a cross-container guarantee. Documented. |
| F4 | **Frontend ships one ~1.59 MB JS chunk** (gzip ~472 KB); Vite chunk-size warning. | Low | Served via CloudFront/S3 (cached, no per-request cost). Cosmetic/perf, not correctness. |
| F5 | **Possibly unused dependencies** added with the shadcn stack (`@tanstack/react-query`, `react-hook-form`, `zod`, `date-fns`, `cmdk`, `recharts`) and an unusual `lucide-react@^1.21.0` range. | Low | Build resolves and passes; worth a `depcheck` + version sanity check to trim bundle. |
| F6 | **Apply-time IAM** for Phase 12: new CloudWatch alarms + `reserved_concurrent_executions` need `cloudwatch:PutMetricAlarm` and `lambda:PutFunctionConcurrency` on the OIDC role (and `sns:*`/`budgets:*` only if those opt-ins are enabled). `plan` is unaffected. | Medium (pre-deploy) | Must confirm on the elevated role before `deploy_backend=true`, or apply fails. Least-privilege set listed in `terraform-phase-12-observability-notes.md`. |

No correctness bugs, broken imports, or dangling references found. Deleted `MiniErpHeader`/`MiniErpSidebar` have **no remaining importers**; all 7 routes resolve; backend idempotency/audit wiring is consistent across all 6 critical actions.

---

## 6. Risk level

**LOW.** Application code (frontend + backend) is regression-clean with all tests/builds green. The only non-trivial items are operational (F1 docs tracking, F6 apply-time IAM) rather than defects in the shipped code. Infra changes are additive, default-safe (opt-ins disabled), and cost-protective.

---

## 7. Required fixes before deploy

1. **(F6) Verify OIDC role permissions** for the new resources — `cloudwatch:PutMetricAlarm`/`DescribeAlarms`/`DeleteAlarms`/`TagResource` and `lambda:PutFunctionConcurrency`/`DeleteFunctionConcurrency`/`GetFunctionConcurrency`. If `alarm_email`/`enable_budget` are turned on, also `sns:*`/`budgets:*` (minimal set). Otherwise `terraform apply` will fail mid-run.
   - **Status: OPERATIONAL — not code-fixable.** The `github-actions-deploy-role` is **external to this Terraform stack** (not defined under `infra/`), and the modernization rules forbid broadening IAM. This remains a human verification on the elevated role before `deploy_backend=true`. The exact least-privilege set is listed in `terraform-phase-12-observability-notes.md`.
2. **Run the OIDC `terraform-plan`** (Deploy Production workflow, `deploy_backend=false`) and review the diff. Expected: `~ aws_lambda_function` (reserved concurrency = 10) + 3 new alarms; no SNS/Budget. Confirm no unintended deletes.
   - **Status: OPERATIONAL — human action.** Must run in CI via OIDC (no local AWS / no apply). Not a code change.
3. **(F1) Docs tracking** — ✅ **RESOLVED.** `.gitignore` now un-ignores the three modernization deliverables (QA report + Phase 11/12 notes) while keeping all other docs local-only. They can be committed with a normal `git add` (no `-f` needed).

---

## 8. Optional improvements after deploy

- **(F4)** Frontend code-splitting (`build.rollupOptions.output.manualChunks` and/or lazy-loaded routes) to cut the main chunk and speed first paint.
- **(F5)** Run `depcheck`; remove unused deps and pin/verify `lucide-react`.
- **(F2/F3)** If stronger guarantees are ever needed: a DynamoDB-backed idempotency table (TTL) for cross-container dedup, and/or a body-hash guard on idempotency keys; compensating logic for the inventory stock/movement pair.
- Wire `alarm_email` (confirm SNS subscription once) and enable the AWS Budget when ready for proactive cost/error alerting.

---

## 9. Final recommendation

**READY to deploy** via the GitHub Actions OIDC workflow — **conditional on item 7.1** (confirm the elevated OIDC role can create CloudWatch alarms and set Lambda reserved concurrency) and running the read-only plan first (7.2).

- Frontend & backend: all validations pass, no regressions, safe to ship.
- Terraform: valid, formatted, additive, Free-Tier-preserving; gate the apply on the IAM check and plan review.
- The only "fix" with code impact is optional (bundle/deps); the blocking items are operational verification, not code defects.

> Note: this file lives under the git-ignored `docs/` directory (see F1). Use
> `git add -f` if it should be committed.
