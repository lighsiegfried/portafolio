<#
.SYNOPSIS
  Deploy frontend to existing S3 + CloudFront — manual safe execution.

.DESCRIPTION
  Builds the React/Vite frontend and syncs to the existing S3 bucket,
  then creates a CloudFront invalidation to clear the CDN cache.

  This only requires S3 and CloudFront permissions — safe with the
  current OIDC role or a user with limited permissions.

.PREREQUISITES
  - Node.js >= 20 installed
  - AWS CLI configured with valid credentials
  - S3/CloudFront permissions (AmazonS3FullAccess, CloudFrontFullAccess)
  - Frontend bucket: wilsonvasquezcvaws
  - CloudFront distribution ID: EZKTZCIB8U4LY

.USAGE
  .\scripts\deploy\manual-frontend-deploy.ps1

.NOTES
  This deploys to PRODUCTION. Ensure the frontend build passes tests first.
  Run: npm run test:backend (if backend changes affect the frontend)
  Then: npm run build:frontend (to verify build succeeds)
#>

$ErrorActionPreference = "Stop"

$FRONTEND_BUCKET = "wilsonvasquezcvaws"
$CLOUDFRONT_DIST_ID = "EZKTZCIB8U4LY"
$projectRoot = Split-Path -Path (Split-Path -Path $PSScriptRoot -Parent) -Parent

Write-Host ""
Write-Host "  Mini ERP — Frontend Deploy" -ForegroundColor Cyan
Write-Host "  ─────────────────────────" -ForegroundColor Cyan
Write-Host "  Bucket:      $FRONTEND_BUCKET"
Write-Host "  CloudFront:  $CLOUDFRONT_DIST_ID"
Write-Host ""

# Step 1: Build frontend
Write-Host "  [1/3] npm run build:frontend" -ForegroundColor Yellow
Set-Location -Path $projectRoot
npm run build:frontend
if (-not $?) {
    Write-Host "  ❌ Frontend build failed" -ForegroundColor Red
    exit 1
}

# Step 2: Sync to S3
Write-Host "  [2/3] aws s3 sync → s3://$FRONTEND_BUCKET" -ForegroundColor Yellow
aws s3 sync "$projectRoot/apps/frontend/dist" "s3://$FRONTEND_BUCKET" --delete
if (-not $?) {
    Write-Host "  ❌ S3 sync failed" -ForegroundColor Red
    exit 1
}

# Step 3: CloudFront invalidation
Write-Host "  [3/3] aws cloudfront create-invalidation" -ForegroundColor Yellow
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths "/*"
if (-not $?) {
    Write-Host "  ⚠️  CloudFront invalidation command failed (check permissions)" -ForegroundColor Yellow
} else {
    Write-Host "  ✅ CloudFront invalidation created" -ForegroundColor Green
}

Write-Host ""
Write-Host "  ✅ Frontend deployed successfully!" -ForegroundColor Green
Write-Host "  URL: https://$CLOUDFRONT_DIST_ID.cloudfront.net" -ForegroundColor Green
Write-Host ""
