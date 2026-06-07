# portafolio

Portafolio profesional cloud-native — React 18 + Vite + Three.js + Mini ERP/CRM Lite backend serverless.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 4 + Three.js + Tailwind CSS |
| CDN | CloudFront |
| Hosting | S3 (privado con OAC) |
| API | API Gateway HTTP API |
| Backend | AWS Lambda (Node.js) |
| DB | DynamoDB (on-demand) |
| IaC | Terraform HCL |
| CI/CD | GitHub Actions + OIDC |

## Comandos principales

```bash
# Frontend
npm run dev              # Dev server (http://localhost:5173)
npm run build            # Build producción
npm run build:frontend   # Build producción (explícito)
npm run dev:frontend     # Dev server (explícito)

# Backend
npm run build:backend    # Empaquetar Lambda (apps/backend/dist/lambda.zip)
npm run test:backend     # Tests backend (133 smoke tests)
npm run seed:backend     # Mostrar datos demo
npm run seed:validate    # Validar datos demo

# Backend (desde apps/backend)
cd apps/backend
npm run dev              # Servidor local (puerto 3001)
npm run build            # Lambda zip
npm test                 # Tests
```

## Despliegue manual

### Frontend (S3 + CloudFront)

```powershell
.\scripts\deploy\manual-frontend-deploy.ps1
```

### Backend Terraform plan

```powershell
.\scripts\deploy\manual-backend-plan.ps1
```

## Estructura del repositorio

```
apps/
├── frontend/          # React/Vite portfolio + Mini ERP UI
└── backend/           # Node.js serverless backend (Mini ERP)
infra/
└── terraform/         # Terraform IaC (DynamoDB, Lambda, API Gateway)
docs/                  # Documentación técnica por fases
scripts/
└── deploy/            # Scripts manuales de despliegue
.github/
└── workflows/         # GitHub Actions (OIDC, plan, deploy)
```
