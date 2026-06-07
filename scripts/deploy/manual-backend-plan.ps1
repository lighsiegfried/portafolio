<#
.SYNOPSIS
  Plan Terraform backend infrastructure — manual safe execution.

.DESCRIPTION
  This script runs terraform init, fmt, validate, and plan for the
  Mini ERP backend (DynamoDB, Lambda, API Gateway, IAM, CloudWatch).

  IMPORTANT: This script does NOT run terraform apply.
  Apply requires explicit human approval and additional AWS permissions
  (Lambda, API Gateway, DynamoDB, IAM creation).

.PREREQUISITES
  - Terraform >= 1.6.0 installed
  - AWS CLI configured with valid credentials
  - For plan: read-only permissions (or the full set) are sufficient
  - For apply (manual, not here): requires permissions to create
    Lambda, API Gateway, DynamoDB, IAM roles/policies, CloudWatch Logs

.USAGE
  .\scripts\deploy\manual-backend-plan.ps1

.NOTES
  This script is safe to run with the existing OIDC-limited role
  or with a user that has at least readonly + S3/CloudFront permissions.
  terraform plan will show what WOULD be created but won't create anything.
#>

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Path (Split-Path -Path $PSScriptRoot -Parent) -Parent
$terraformDir = Join-Path -Path $projectRoot -ChildPath "infra\terraform"

Write-Host ""
Write-Host "  Mini ERP — Terraform Plan (Backend only)" -ForegroundColor Cyan
Write-Host "  ───────────────────────────────────────" -ForegroundColor Cyan
Write-Host ""

# Step 1: Change to Terraform directory
Write-Host "  [1/4] cd infra/terraform" -ForegroundColor Yellow
Set-Location -Path $terraformDir

# Step 2: Terraform init
Write-Host "  [2/4] terraform init" -ForegroundColor Yellow
terraform init
if (-not $?) {
    Write-Host "  ❌ terraform init failed" -ForegroundColor Red
    exit 1
}

# Step 3: Format and validate
Write-Host "  [3/4] terraform fmt -recursive && terraform validate" -ForegroundColor Yellow
terraform fmt -recursive
terraform validate
if (-not $?) {
    Write-Host "  ❌ terraform validate failed" -ForegroundColor Red
    exit 1
}

# Step 4: Terraform plan
Write-Host "  [4/4] terraform plan" -ForegroundColor Yellow
terraform plan -out=tfplan
if (-not $?) {
    Write-Host "  ❌ terraform plan failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "  ✅ Plan completado. Revisa el output arriba." -ForegroundColor Green
Write-Host "  ⚠️  NO se ejecutó terraform apply." -ForegroundColor Yellow
Write-Host "  Para aplicar necesitas permisos: Lambda, API Gateway, DynamoDB, IAM." -ForegroundColor Yellow
Write-Host ""

# Return to project root
Set-Location -Path $projectRoot
