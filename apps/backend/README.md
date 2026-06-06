# Mini ERP / CRM Lite — Backend

Backend serverless del Mini ERP / CRM Lite, construido con Node.js para AWS Lambda + API Gateway + DynamoDB.

Parte del portafolio profesional de Wilson Vásquez para validar habilidades cloud, full-stack y ERP.

## Stack

| Capa | Tecnología |
|------|-----------|
| **Runtime** | Node.js 24 (JavaScript CommonJS) |
| **API** | AWS Lambda + API Gateway HTTP API |
| **DB** | Amazon DynamoDB (on-demand, 8 tablas) |
| **Auth** | JWT HS256 + middleware interno |
| **Logs** | CloudWatch Logs (JSON estructurado) |
| **CSV** | json2csv |
| **UUID** | crypto.randomUUID() (nativo) |

## Estructura

```
src/
├── config/              # Variables de entorno + matriz de permisos
├── db/                  # mockRepository + cliente DynamoDB SDK v3
├── middleware/          # auth, authorize, validate, logger, cors
├── modules/             # auth, requisitions, products, inventory, leads, dashboard, reports
├── services/            # auditService (transversal)
├── utils/               # response, errors, jwt, idGenerator, csvHelper
└── data/                # seed.js + mock-db.js (datos demo en memoria)
```

## Cómo empezar

```bash
# 1. Ir al directorio del backend
cd apps/backend

# 2. Instalar dependencias
npm install

# 3. Copiar y configurar variables de entorno
cp .env.example .env
# Editar JWT_SECRET con un valor seguro

# 4. Iniciar servidor local
npm run dev
```

## Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `JWT_SECRET` | `dev-secret...` | Secreto para firmar JWT (cambiar en producción) |
| `JWT_EXPIRES_IN` | `24h` | Expiración del token JWT |
| `DYNAMODB_TABLE_PREFIX` | `mini-erp` | Prefijo para nombres de tablas DynamoDB |
| `DYNAMODB_REGION` | `us-east-1` | Región AWS |
| `NODE_ENV` | `development` | Entorno de ejecución |
| `LOG_LEVEL` | `INFO` | Nivel de log (ERROR, WARN, INFO, DEBUG) |
| `PORT` | `3001` | Puerto del servidor local |
| `DEFAULT_LOW_STOCK_THRESHOLD` | `5` | Umbral global de bajo stock |

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor local con recarga automática (puerto 3001) |
| `npm start` | Inicia servidor local |
| `npm test` | Ejecuta tests smoke |
| `npm run seed` | Muestra los datos demo cargados |

## API — Formato de respuesta

Todas las respuestas siguen el formato:

```json
// Éxito
{ "ok": true, "data": { ... } }

// Lista
{ "ok": true, "data": [...], "meta": { "total": 10 } }

// Error
{ "ok": false, "error": { "code": "NOT_FOUND", "message": "Recurso no encontrado" } }
```

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /health | No | Health check |
| POST | /auth/login | No | Inicio de sesión |
| GET | /auth/me | Sí | Perfil del usuario autenticado |
| GET | /dashboard/summary | Sí | KPIs del dashboard |
| GET | /requisitions | Sí | Lista de requisiciones |
| POST | /requisitions | Sí | Crear requisición |
| GET | /requisitions/{id} | Sí | Detalle de requisición |
| PATCH | /requisitions/{id}/approve | Sí | Aprobar requisición |
| PATCH | /requisitions/{id}/reject | Sí | Rechazar requisición |
| PATCH | /requisitions/{id}/complete | Sí | Completar requisición |
| GET | /products | Sí | Lista de productos |
| POST | /products | Sí | Crear producto (Fase 2) |
| PATCH | /products/{id} | Sí | Actualizar producto (Fase 2) |
| PATCH | /products/{id}/stock | Sí | Ajustar stock (Fase 2) |
| POST | /inventory/movements | Sí | Crear movimiento (Fase 2) |
| GET | /inventory/movements | Sí | Lista de movimientos |
| GET | /inventory/low-stock | Sí | Productos con stock bajo |
| GET | /leads | Sí | Lista de leads |
| POST | /leads | Sí | Crear lead (Fase 2) |
| GET | /leads/{id} | Sí | Detalle de lead |
| PATCH | /leads/{id} | Sí | Actualizar lead (Fase 2) |
| POST | /leads/{id}/notes | Sí | Agregar nota (Fase 2) |
| GET | /reports/requisitions.csv | Sí | Exportar requisiciones CSV |
| GET | /reports/inventory.csv | Sí | Exportar inventario CSV |
| GET | /reports/leads.csv | Sí | Exportar leads CSV |

## Usuarios demo

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `wilson` | `admin1234` | Administrador |
| `compras1` | `compras1234` | Compras |
| `bodega1` | `bodega1234` | Bodega |
| `gerencia1` | `gerencia1234` | Gerencia |

> **Advertencia:** Este es un sistema demo con autenticación JWT simple.
> No usar en producción. No incluye Cognito, OAuth2, ni MFA.
