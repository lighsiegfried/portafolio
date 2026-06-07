# Mini ERP / CRM Lite — Terraform Infrastructure

This directory contains Terraform configuration for deploying the Mini ERP application on AWS using serverless architecture.

## Architecture

```
S3 (wilsonvasquezcvaws — existente) ── CloudFront (EZKTZCIB8U4LY — existente)

API Gateway ──► Lambda ──► DynamoDB
                          └─► CloudWatch
```

## Prerequisites

- Terraform >= 1.6.0
- AWS CLI configured with OIDC or appropriate credentials (no access keys)
- Lambda deployment zip built at `../../apps/backend/dist/lambda.zip`
- Node.js 20.x+ runtime for Lambda

## Frontend Infrastructure (existing, NOT managed by Terraform)

| Resource | Identifier |
|----------|-----------|
| S3 Bucket | `wilsonvasquezcvaws` |
| CloudFront Distribution ID | `EZKTZCIB8U4LY` |
| CloudFront Domain | `dxxrwydm6m8sc.cloudfront.net` |

Terraform is configured with `create_frontend_bucket = false` and `manage_cloudfront = false`.
It will **not** create or modify these resources. They are used as references for deploy scripts and outputs.

## ⚠️ Remote State (S3 Backend)

**Se recomienda usar estado remoto en S3** para evitar conflictos y pérdida de state local.

Activar el backend remoto (solo después de crear el bucket de state):

```bash
# 1. Crear el bucket S3 para state (ver docs/aws-tfstate-bootstrap.md)
# 2. Copiar el backend de ejemplo
cp backend.tf.example backend.tf

# 3. Inicializar Terraform
terraform init
# Responde "yes" cuando pregunte si migrar el state local al remoto
```

> **⚠️ Advertencia:** No ejecutes `terraform init` con backend remoto hasta que el bucket S3
> `portafolio-production-tfstate-383000882391` exista. Si el bucket no existe, `terraform init` fallará.
>
> El archivo `backend.tf` está en `.gitignore` — no se subirá al repositorio.
> Nunca guardes `terraform.tfstate`, `tfplan` o secretos en Git.

Para desarrollo local sin backend remoto (state local), no copies `backend.tf.example` a `backend.tf`.

## Quick Start (local state)

```bash
# 1. Build the Lambda deployment zip
cd apps/backend
npm ci
npm run build      # produces dist/lambda.zip

# 2. Copy and edit tfvars
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars — set jwt_secret, adjust frontend settings

# 3. Review the plan
terraform init
terraform fmt -recursive
terraform validate
terraform plan -out=tfplan

# 4. Apply (only when ready — requires approval)
# terraform apply tfplan   # NO ejecutar sin aprobación
```

## Comandos seguros (no modifican infraestructura)

| Comando | Descripción |
|---------|-------------|
| `terraform init` | Inicializa Terraform y descarga providers |
| `terraform fmt -recursive` | Formatea código HCL |
| `terraform validate` | Valida la sintaxis y configuración |
| `terraform plan` | Muestra los cambios planeados |

## Scripts seguros

| Script | Qué hace | Requiere |
|--------|----------|----------|
| `scripts/deploy/manual-backend-plan.ps1` | `init → fmt → validate → plan` | Terraform + AWS CLI |
| `scripts/deploy/manual-frontend-deploy.ps1` | `build → s3 sync → invalidation` | Node.js + AWS CLI + S3/CloudFront |

## Before `terraform apply`

1. **Lambda zip must exist** — `apps/backend/dist/lambda.zip`. If not, create it:
   ```bash
   cd apps/backend && npm ci && npm run build
   ```
2. **jwt_secret** — Generate a strong random secret (e.g., `openssl rand -hex 64`). Use GitHub Secret, no tfvars.
3. **AWS permissions** — You need permissions for Lambda, API Gateway, DynamoDB, IAM, CloudWatch.
4. **State backend** — Configurar S3 backend remoto para producción (ver sección Remote State arriba).

## Variables

Key variables (see `variables.tf` for full list):

| Variable | Default | Description |
|----------|---------|-------------|
| `project_name` | `portafolio` | Resource name prefix |
| `environment` | `production` | Deployment stage |
| `aws_region` | `us-east-1` | AWS region |
| `jwt_secret` | (required) | JWT signing secret |
| `allowed_origins` | `http://localhost:5173` | CORS origins |
| `lambda_zip_path` | `../../apps/backend/dist/lambda.zip` | Lambda zip location |
| `create_frontend_bucket` | `false` | Set `false` to use existing bucket |
| `manage_cloudfront` | `false` | Set `false` to use existing CloudFront |
| `existing_frontend_bucket_name` | `null` | Existing bucket name |
| `existing_cloudfront_distribution_id` | `null` | Existing CloudFront ID |
| `existing_cloudfront_domain` | `null` | Existing CloudFront domain |

## Outputs

After apply, Terraform outputs include:

| Output | Description |
|--------|-------------|
| `frontend_bucket_name` | S3 bucket name (existing or new) |
| `cloudfront_distribution_id` | CloudFront distribution ID (existing or new) |
| `cloudfront_domain_name` | CloudFront domain name |
| `api_gateway_url` | API Gateway endpoint URL |
| `lambda_function_name` | Backend Lambda function name |
| `dynamodb_table_names` | Map of entity → table name |

## Module Structure

| Module | Purpose |
|--------|---------|
| `modules/dynamodb_table` | DynamoDB table with GSIs, PAY_PER_REQUEST |
| `modules/lambda_function` | Lambda function + IAM role + log group |
| `modules/api_gateway_http` | HTTP API with Lambda proxy, CORS |

(Note: `modules/s3_frontend` exists but is not used when `create_frontend_bucket = false`)

## Servicios permitidos (Free Tier compatibles)

| Servicio | Uso |
|----------|-----|
| S3 | Frontend hosting, state backend |
| CloudFront existente | CDN (sin costo adicional por usar el existente) |
| API Gateway HTTP API | Endpoints REST serverless |
| Lambda | Backend compute (1M requests/mes gratis) |
| DynamoDB PAY_PER_REQUEST | Base de datos NoSQL (25 GB gratis) |
| CloudWatch Logs | Logging con retención baja (7 días) |
| IAM | Roles y políticas de seguridad |

## 🚫 Servicios prohibidos por costo en esta fase

| Servicio | Motivo |
|----------|--------|
| NAT Gateway | $32+/mes |
| VPC para Lambda | Sin necesidad de aislamiento de red |
| RDS | Costo mínimo ~$15/mes |
| ECS / Fargate | Más caro que Lambda para baja carga |
| EC2 | Requiere aprovisionamiento constante |
| ALB / NLB | $20+/mes el mínimo |
| WAF | $5/mes + $0.60/request |
| Cognito | Sin necesidad aún |
| Route 53 | Sin dominio custom aún |
| ACM | Sin dominio custom aún |
| SQS / SNS / EventBridge | Sin necesidad actual |
| Provisioned Concurrency | Costo adicional innecesario |
| DynamoDB provisioned capacity | PAY_PER_REQUEST es suficiente |
| X-Ray | Sin necesidad de tracing avanzado |
| CloudWatch dashboards pagados | Logs básicos son suficientes |
| Custom domains | Sin certificado ACM ni Route 53 |

## Security

- Lambda: IAM role with **only** DynamoDB read/write + CloudWatch logs
- DynamoDB scoped to `table/${prefix}-*` and `table/${prefix}-*/index/*`
- JWT secret stored as sensitive Terraform variable (in GitHub Secrets, not in files)
- No AdministratorAccess or wildcard IAM policies
- No AWS access keys in code — always use OIDC or `aws configure`
- Terraform state en S3 cifrado (SSE-S3) con versioning activado
