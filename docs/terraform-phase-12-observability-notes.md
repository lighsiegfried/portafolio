# Terraform Phase 12 — Observability & Cost Protection

> Scope: `infra/terraform` only. **No `terraform apply` was run. No AWS CLI used.
> WAF untouched.** All access remains via the GitHub Actions OIDC role.

## What changed (all Free-Tier friendly)

| # | Improvement | How |
|---|-------------|-----|
| 1 | **Lambda reserved concurrency** | New `lambda_reserved_concurrency` (default **10**) wired through the `lambda_function` module → caps concurrent executions so a traffic/abuse spike can't run up cost. `-1` disables the cap. |
| 2 | **API Gateway throttling** | Already present (burst 100 / rate 50); now parameterized via `api_throttling_burst_limit` / `api_throttling_rate_limit` (same defaults → no behavior change). |
| 3 | **CloudWatch log retention** | Already configured (`cloudwatch_log_retention_days`, default 7). No change needed — documented for completeness. |
| 4 | **CloudWatch alarms** | `monitoring.tf`: Lambda **Errors**, Lambda **Throttles**, API Gateway **5xx**. Thresholds are variables. First 10 alarms are free. |
| 5 | **AWS Budget (optional)** | `aws_budgets_budget`, **disabled by default** (`enable_budget=false`). Creates a monthly USD budget with 80% actual / 100% forecast email alerts only when explicitly enabled with an email. One budget is free. |
| 6 | **Ops outputs** | `lambda_reserved_concurrency`, `api_throttling`, `cloudwatch_alarm_names`, `alarm_sns_topic_arn`, `budget_name`. |

### Notification wiring
- **Alarms** attach an SNS action only when `alarm_email` is set (creates an SNS topic + email subscription you must confirm once). When `alarm_email` is empty (default), alarms still evaluate and are visible in the console with **no** action — zero cost, no email confirmation required.
- **Budget** emails go to `budget_notification_email` and require `enable_budget=true`.

## Why this is safe / low-risk
- **Backward compatible:** every new variable has a default, so the existing
  `deploy-production.yml` plan/apply commands work **unchanged** (no workflow edit needed).
- **Default plan is tight & reviewable:** modifies the Lambda (adds reserved
  concurrency = 10) and **creates 3 alarms**. SNS topic and Budget are
  `count = 0` by default, so nothing account-level is created unless opted in.
- **No IAM weakening:** the OIDC deploy role lives outside this stack and was not
  touched. Nothing here broadens permissions.
- **Reserved concurrency math:** reserving 10 leaves the account's unreserved
  pool well above the AWS-required minimum of 100 (default account limit ~1000).

## How to run / review the plan (OIDC, no local AWS)

The plan runs **only** through GitHub Actions OIDC — do not run apply locally.

1. Push this branch / open the PR.
2. Actions → **🚀 Deploy Production** → **Run workflow** with **both toggles `false`**
   (`deploy_backend=false`, `deploy_frontend=false`). The `terraform-plan` job runs
   on every dispatch and is read-only; the `terraform-apply` job is gated by
   `deploy_backend=true`, so leaving it false produces a plan **without** applying.
3. Review the job's **Terraform Plan Summary** (and `terraform plan` step log). Expect:
   - `~ aws_lambda_function.this` — `reserved_concurrent_executions: 10`
   - `+ aws_cloudwatch_metric_alarm.lambda_errors`
   - `+ aws_cloudwatch_metric_alarm.lambda_throttles`
   - `+ aws_cloudwatch_metric_alarm.api_5xx`
   - No SNS/Budget resources (disabled by default).
4. To apply later, re-run the workflow with `deploy_backend=true` (existing apply job).

### Enabling the optional pieces (when you want them)
Add these as GitHub **Variables** and pass them as extra `-var` flags in the plan/apply
steps (or set them in a tfvars consumed by CI):
- Email alarms: `-var="alarm_email=you@example.com"` (confirm the SNS email once).
- Budget: `-var="enable_budget=true" -var="budget_notification_email=you@example.com" -var="budget_limit_usd=5"`.

## Apply-time IAM the OIDC role needs (for the human to verify on the elevated role)
`plan` needs only read/describe and works today. **Apply** of these resources needs:
- `cloudwatch:PutMetricAlarm`, `cloudwatch:DescribeAlarms`, `cloudwatch:DeleteAlarms`,
  `cloudwatch:TagResource` / `ListTagsForResource`
- `lambda:PutFunctionConcurrency`, `lambda:DeleteFunctionConcurrency`,
  `lambda:GetFunctionConcurrency`
- If `alarm_email` set: `sns:CreateTopic`, `sns:Subscribe`, `sns:GetTopicAttributes`,
  `sns:SetTopicAttributes`, `sns:ListTagsForResource`, `sns:TagResource`, `sns:DeleteTopic`
- If `enable_budget=true`: `budgets:CreateBudget`, `budgets:ViewBudget`,
  `budgets:ModifyBudget`, `budgets:DeleteBudget`

If the elevated role already grants these (or a broad equivalent), no change is
required. Do **not** broaden the role beyond the least-privilege set above.

## Validation performed locally (no AWS calls)
- `terraform fmt -check -recursive` → clean
- `terraform init -backend=false` → providers resolved
- `terraform validate` → **Success! The configuration is valid.**
