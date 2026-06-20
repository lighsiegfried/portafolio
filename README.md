# Wilson Vásquez — Cloud-Native Portfolio

**React 18 + Vite + Three.js + Mini ERP/CRM Lite (serverless AWS)**

Portafolio profesional que combina una SPA 3D interactiva con un sistema de gestión empresarial serverless como caso de estudio técnico. Valida habilidades en frontend React, backend Node.js serverless, arquitectura cloud AWS y DevOps.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend (portafolio) | React 18 + Vite 4 + Three.js + @react-three/fiber + Tailwind CSS |
| Frontend (Mini ERP UI) | shadcn/ui + Radix + TanStack Table + sonner + lucide-react sobre un design system reutilizable |
| 3D | Three.js (desktop_pc, earth, ball, stars) + ErrorBoundary + NaN fix |
| CDN | CloudFront con OAC |
| Hosting | S3 (privado con OAC) |
| API | API Gateway HTTP API v2 |
| Backend | AWS Lambda (Node.js 20.x) — router propio sin Express |
| DB | DynamoDB (9 tablas PAY_PER_REQUEST) |
| Auth | JWT + bcryptjs + roles (admin, compras, bodega, gerencia) |
| IaC | Terraform HCL (4 módulos reutilizables) |
| CI/CD | GitHub Actions + OIDC (sin claves estáticas) |
| Observabilidad | CloudWatch logs estructurados + alarmas (Lambda errors/throttles, API 5xx) |
| Email | Amazon SES (contact form) |
| Tests | Node `node:test` nativo (238 tests) |

---

## Mini ERP / CRM Lite — Caso de estudio de modernización

Aplicación de negocio (`/mini-erp/*`) usada como caso de estudio técnico. La fase de modernización rediseñó la UI y endureció el backend e infraestructura sin romper contratos de API ni salir del enfoque Free Tier.

**Frontend — UI premium tipo SaaS con un design system reutilizable (shadcn/ui)**
- Layout con sidebar/topbar, paleta de comandos y navegación por rol.
- Dashboard con KPIs y gráficos; tablas con búsqueda/orden/paginación (TanStack Table).
- **CRM (Leads):** pipeline tipo Kanban + tabla, hoja de detalle, timeline de notas.
- **Requisiciones:** flujo `pending → approved → completed` (o `rejected`) con indicador de progreso, filtros por estado y diálogos de confirmación.
- **Inventario:** movimientos de stock, alertas de bajo stock y confirmación obligatoria para salidas.
- **Reportes:** catálogo de exportaciones CSV (generación server-side).
- Estados de carga (skeletons), error con reintento, vacíos y toasts (sonner) en todos los módulos.

**Backend — Lambda serverless robusto**
- Router propio (sin Express), formato `{ ok, data }` / `{ ok, error: { code, message } }`.
- Repositorio abstracto (`mock` ↔ `dynamodb`), validación, **eventos de auditoría** y **logs estructurados** (requestId, ruta, método, userId, statusCode, latencyMs, coldStart, errorCode).
- **Seguridad de stock:** ajuste atómico condicional en DynamoDB — el stock nunca queda negativo.
- **Idempotencia opt-in** (`Idempotency-Key`) en creaciones/transiciones críticas.

**DevOps — IaC y entrega segura**
- Terraform (4 módulos) + GitHub Actions con **OIDC (sin claves AWS estáticas)** y smoke tests contra producción.
- Controles de costo Free Tier: DynamoDB PAY_PER_REQUEST, concurrencia reservada en Lambda, retención de logs, alarmas CloudWatch (y budget opcional, desactivado por defecto).

> **WAF:** actualmente activo de forma temporal a nivel de infraestructura. **No fue modificado** en esta fase de modernización (fuera de alcance, por diseño).

---

## Documentación

| Documento | Descripción |
|-----------|-------------|
| `PROJECT_CONTEXT.md` | Visión general, stack, estructura, decisiones, datos de prod |
| `ARCHITECTURE.md` | Diagramas, componentes, flujos, seguridad, costos |
| `docs/developer-guide.md` | Setup local, estructura de módulos, testing, troubleshooting rápido |
| `docs/deployment-guide.md` | Deploy frontend/backend, CI/CD, referencias AWS |
| `docs/api-reference.md` | Endpoints completos, request/response, códigos de error |
| `docs/troubleshooting.md` | Problemas comunes y soluciones por capa |
| `docs/aws-free-tier-notes.md` | Costos, monitoreo, riesgos de salida del Free Tier |
| `docs/mini-erp-modernization-qa.md` | Revisión de regresión/arquitectura de la modernización |
| `docs/backend-phase-11-reliability-notes.md` | Logs estructurados, idempotencia, auditoría, seguridad de stock |
| `docs/terraform-phase-12-observability-notes.md` | Concurrencia reservada, alarmas y budget opcional |

---

## Comandos principales

```bash
# Frontend
npm run dev              # Dev server → http://localhost:5173
npm run build            # Build producción
npm run dev:frontend     # Dev server (explícito)
npm run build:frontend   # Build producción (explícito)

# Backend
npm run build:backend    # Empaquetar Lambda (apps/backend/dist/lambda.zip)
npm run test:backend     # Tests backend (238 tests)
npm run seed:backend     # Mostrar datos demo (no modifica producción)
npm run seed:validate    # Validar consistencia de datos demo

# Backend (desde apps/backend)
cd apps/backend
npm run dev              # Servidor local con datos mock (puerto 3001)
npm run build            # Lambda zip
npm test                 # Tests
```

---

## Estructura del repositorio

```
apps/
├── frontend/          # React/Vite portfolio + Mini ERP UI
│   └── src/
│       ├── components/canvas/   # Three.js (Computers, Earth, Ball, Stars)
│       ├── mini-erp/            # SPA del Mini ERP (7 páginas)
│       └── services/            # API client (fetch wrapper)
└── backend/           # Node.js serverless
    ├── src/modules/   # auth, requisitions, products, inventory, leads, dashboard, reports, contact
    ├── src/db/        # repositoryFactory → mockRepository | dynamoRepository
    └── tests/         # smoke.test.js, repair-scripts.test.js
infra/
└── terraform/         # Terraform (DynamoDB, Lambda, API GW, IAM, CloudWatch)
docs/                  # Documentación técnica
.github/workflows/     # 2 activos + 4 archivados
scripts/deploy/        # Scripts manuales PowerShell
```

---

## Credenciales demo (desarrollo local)

| Usuario | Rol | Contraseña |
|---------|-----|-----------|
| `wilson` | admin | `admin123` |
| `maria` | compras | `compras123` |
| `pedro` | bodega | `bodega123` |
| `ana` | gerencia | `gerencia123` |

---

## Recursos productivos

| Recurso | Valor |
|---------|-------|
| Frontend | https://dxxrwydm6m8sc.cloudfront.net |
| API | https://2t1wxsttb5.execute-api.us-east-1.amazonaws.com |
| Mini ERP | `/mini-erp/login` en el frontend |

---

## Licencia

MIT — Proyecto educativo y profesional. Sin garantía.
