# Mini ERP / CRM Lite — Backend

Backend serverless del Mini ERP / CRM Lite, construido con Node.js para AWS Lambda + API Gateway + DynamoDB.

Parte del portafolio profesional de Wilson Vásquez para validar habilidades cloud, full-stack y ERP.

## Lambda packaging

```bash
npm run build
```

Genera `dist/lambda.zip` (~3.2 MB) listo para desplegar en AWS Lambda.

| Atributo | Valor |
|----------|-------|
| **Zip path** | `apps/backend/dist/lambda.zip` |
| **Handler** | `index.handler` |
| **Runtime** | `nodejs20.x` (Lambda), `24.16.0` (local dev) |
| **Contenido** | `src/` → raíz del zip, `node_modules` (producción) |
| **Excluido** | `.env`, `local-server.js`, tests, docs, `.gitkeep` |

> **⚠️ No incluir secretos en el zip.** El script `build-lambda.js` excluye `.env` automáticamente.
> El zip contiene solo dependencias de producción (`npm ci --omit=dev`).

## Stack

| Capa | Tecnología |
|------|-----------|
| **Runtime** | Node.js 24 (JavaScript CommonJS) |
| **API** | AWS Lambda + API Gateway HTTP API |
| **DB** | Amazon DynamoDB (on-demand, en fase posterior) |
| **Auth** | JWT HS256 + middleware interno |
| **Logs** | CloudWatch Logs (JSON estructurado) |
| **CSV** | json2csv |
| **UUID** | crypto.randomUUID() (nativo) |

## Estado actual — Fase 4 completada

El backend cuenta con una **capa de abstracción de persistencia** que permite alternar entre mock en memoria (desarrollo) y DynamoDB (cloud) mediante la variable `DATA_SOURCE`.

Actualmente funciona en modo `mock` por defecto. El modo `dynamodb` está implementado pero requiere tablas reales desplegadas vía Terraform.

### Conjunto de datos demo

| Entidad | Registros | Detalle |
|---------|-----------|---------|
| Usuarios | 4 | admin, compras, bodega, gerencia |
| Productos | 12 | 5 categorías: insumo, materia_prima, equipo, servicio, oficina |
| Requisiciones | 10 | 4 estados: pending (3), approved (3), rejected (1), completed (3) |
| Items de Requisición | 25 | Distribuidos en las 10 requisiciones |
| Movimientos de Inventario | 20 | IN inicial (12) + consumo OUT (8) |
| Leads | 10 | 5 estados: new (2), in_contact (2), negotiation (2), won (2), lost (2) |
| Notas de Leads | 17 | Asociadas a los 10 leads |
| Eventos de Auditoría | 0 | Poblados en tiempo de ejecución por auditService |

**Total: 98+ registros semilla.**

Bajo stock (`stock <= minStock`): P2 (azúcar: 5 ≤ 15), P6 (cobre: 2 ≤ 25), P9 (servicio: 1 ≤ 0), P11 (papel: 7 ≤ 10), P12 (tóner: 4 ≤ 5).

## Estructura

```
src/
├── config/              # Variables de entorno + matriz de permisos
├── db/                  # mockRepository + cliente DynamoDB SDK v3
├── middleware/          # auth, authorize, validate, logger, cors
├── modules/             # auth, requisitions, products, inventory, leads, dashboard, reports, contact
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
| `DATA_SOURCE` | `mock` | Fuente de datos: `mock` (en memoria) o `dynamodb` |
| `JWT_SECRET` | `dev-secret...` | Secreto para firmar JWT (cambiar en producción) |
| `JWT_EXPIRES_IN` | `24h` | Expiración del token JWT |
| `DYNAMODB_TABLE_PREFIX` | `mini-erp` | Prefijo para nombres de tablas DynamoDB |
| `DYNAMODB_REGION` | `us-east-1` | Región AWS |
| `NODE_ENV` | `development` | Entorno de ejecución |
| `LOG_LEVEL` | `INFO` | Nivel de log (ERROR, WARN, INFO, DEBUG) |
| `PORT` | `3001` | Puerto del servidor local |
| `DEFAULT_LOW_STOCK_THRESHOLD` | `5` | Umbral global de bajo stock |
| `CONTACT_TO_EMAIL` | — | Correo destino para notificaciones del formulario de contacto |
| `CONTACT_FROM_EMAIL` | — | Correo verificado en SES usado como remitente |
| `CONTACT_REPLY_TO_ENABLED` | `true` | Usar email del visitante como Reply-To |
| `SEND_CONTACT_CONFIRMATION` | `false` | Enviar confirmación al visitante (desactivado — SES en sandbox) |
| `SES_REGION` | `us-east-1` | Región AWS de SES |

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor local con recarga automática (puerto 3001) |
| `npm start` | Inicia servidor local |
| `npm test` | Ejecuta tests smoke (133 tests) |
| `npm run seed` | Muestra los datos demo cargados (con validación) |
| `npm run seed:validate` | Valida consistencia de datos seed (referencias, duplicados, fechas) |

## API — Formato de respuesta

Todas las respuestas siguen el formato:

```json
// Éxito
{ "ok": true, "data": { ... } }

// Lista
{ "ok": true, "data": [...], "meta": { "total": 10 } }

// Lista paginada
{ "ok": true, "data": [...], "meta": { "total": 50 }, "pagination": { "limit": 10, "nextToken": "offset_10" } }

// Error
{ "ok": false, "error": { "code": "NOT_FOUND", "message": "Recurso no encontrado" } }
```

## Endpoints

### Contacto
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /contact | No | Enviar mensaje desde formulario de contacto (público) |

### Salud
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /health | No | Health check del servicio |

### Autenticación
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /auth/login | No | Inicio de sesión (devuelve JWT) |
| GET | /auth/me | Sí | Perfil del usuario autenticado |

### Dashboard
| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | /dashboard/summary | admin, compras, bodega, gerencia | KPIs: pending/approved/completed/rejected requisitions, low stock, active leads, recent items |

### Requisiciones
| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | /requisitions | admin, compras, bodega, gerencia | Lista requisiciones (soporta `?limit=&nextToken=`) |
| POST | /requisitions | **admin, compras** | Crear requisición (requiere title, description, items) |
| GET | /requisitions/{id} | admin, compras, bodega, gerencia | Detalle de requisición con items |
| PATCH | /requisitions/{id}/approve | **admin, gerencia** | Aprobar requisición (solo si está pending) |
| PATCH | /requisitions/{id}/reject | **admin, gerencia** | Rechazar requisición (requiere reason) |
| PATCH | /requisitions/{id}/complete | **admin, compras** | Completar requisición (solo si está approved) |

### Productos
| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | /products | admin, compras, bodega, gerencia | Lista productos (soporta `?limit=&nextToken=`) |
| POST | /products | **admin** | Crear producto (sku único, price≥0, minStock≥0) |
| PATCH | /products/{id} | **admin** | Actualizar producto (no permite id/createdAt) |
| PATCH | /products/{id}/stock | **admin, bodega** | Ajustar stock (type IN/OUT, valida stock negativo) |

### Inventario
| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| POST | /inventory/movements | **admin, bodega** | Registrar movimiento (productId, type, quantity, reference) |
| GET | /inventory/movements | admin, bodega | Lista movimientos (soporta `?productId=&limit=&nextToken=`) |
| GET | /inventory/low-stock | admin, bodega | Productos con stock <= minStock |

### CRM — Leads
| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | /leads | **admin, gerencia** | Lista leads (soporta `?limit=&nextToken=`) |
| POST | /leads | **admin, gerencia** | Crear lead (companyName, contactName, email, phone, source) |
| GET | /leads/{id} | **admin, gerencia** | Detalle de lead con notas |
| PATCH | /leads/{id} | **admin, gerencia** | Actualizar lead (status válido: new, in_contact, negotiation, won, lost) |
| POST | /leads/{id}/notes | **admin, gerencia** | Agregar nota a lead (requiere content) |

### Reportes CSV
| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | /reports/requisitions.csv | admin, compras, gerencia | Exportar requisiciones a CSV |
| GET | /reports/inventory.csv | admin, bodega, gerencia | Exportar productos a CSV |
| GET | /reports/leads.csv | admin, gerencia | Exportar leads a CSV |

## Matriz de roles

| Recurso | admin | compras | bodega | gerencia |
|---------|-------|---------|--------|----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Listar requisiciones | ✅ | ✅ | ✅ | ✅ |
| Crear requisiciones | ✅ | ✅ | ❌ | ❌ |
| Aprobar/rechazar | ✅ | ❌ | ❌ | ✅ |
| Completar requisiciones | ✅ | ✅ | ❌ | ❌ |
| Ver productos | ✅ | ✅ | ✅ | ✅ |
| Crear/editar productos | ✅ | ❌ | ❌ | ❌ |
| Ajustar stock | ✅ | ❌ | ✅ | ❌ |
| Movimientos inventario | ✅ | ❌ | ✅ | ❌ |
| CRM Leads | ✅ | ❌ | ❌ | ✅ |
| Exportar CSV requisiciones | ✅ | ✅ | ❌ | ✅ |
| Exportar CSV inventario | ✅ | ❌ | ✅ | ✅ |
| Exportar CSV leads | ✅ | ❌ | ❌ | ✅ |

## Usuarios demo

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `wilson` | `admin1234` | Administrador |
| `compras1` | `compras1234` | Compras |
| `bodega1` | `bodega1234` | Bodega |
| `gerencia1` | `gerencia1234` | Gerencia |

## Validación de datos seed

Los datos demo incluyen un validador de consistencia que verifica:

- **Referencias**: todo `createdBy`, `approvedBy`, `completedBy` → usuario existente; `productId` → producto existente; `requisitionId` → requisición existente; `leadId` → lead existente
- **Duplicados**: SKU de productos, username de usuarios, número de requisición
- **Valores válidos**: estados (pending/approved/rejected/completed, new/in_contact/negotiation/won/lost), roles (admin/compras/bodega/gerencia), tipos de movimiento (IN/OUT)
- **Stock**: stock y movimientos sin valores negativos
- **Fechas**: formato ISO válido donde se requiera

Ejecutar: `npm run seed:validate`

## Seguridad del seed

El script `seed-demo.js` previene escritura accidental en DynamoDB: requiere `DATA_SOURCE=dynamodb` Y `ALLOW_DYNAMODB_SEED=true`. En modo mock solo muestra los datos sin afectar almacenamiento persistente.

## Ejemplos curl

```bash
# Login
curl -s http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"wilson","password":"admin1234"}'

# Crear requisición
curl -s http://localhost:3001/api/requisitions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Nueva req","description":"Test","items":[{"productName":"Papel","quantity":10,"unit":"unidad","estimatedCost":5.50}]}'

# Aprobar requisición
curl -s -X PATCH http://localhost:3001/api/requisitions/<ID>/approve \
  -H "Authorization: Bearer <TOKEN>"

# Crear producto
curl -s -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"sku":"NEW-001","name":"Nuevo Producto","category":"insumo","unit":"unidad","price":25,"minStock":5}'

# Registrar movimiento inventario
curl -s -X POST http://localhost:3001/api/inventory/movements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"productId":"<PRODUCT_ID>","type":"IN","quantity":10,"reference":"Compra proveedor"}'

# Contacto (público, no requiere token)
curl -s -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez","email":"juan@example.com","message":"Hola, quiero contactarte para una oferta laboral."}'

# Crear lead
curl -s -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"companyName":"Empresa ABC","contactName":"Juan Pérez","email":"juan@abc.com","phone":"555-0000","source":"web"}'

# Descargar CSV
curl -s http://localhost:3001/api/reports/requisitions.csv \
  -H "Authorization: Bearer <TOKEN>"
```

## Auditoría

El sistema registra eventos de auditoría en memoria para las siguientes acciones:

- **Requisiciones**: created, approved, rejected, completed
- **Productos**: created, updated, stock_updated
- **Leads**: created, updated, note_added

Los eventos incluyen: entityType, entityId, action, userId, previousState, newState, createdAt.

## Capa de persistencia (Phase 3)

El backend usa una **abstracción de repositorio** para desacoplar la lógica de negocio del almacenamiento:

```
Handler → repositoryFactory.getRepository() → mockRepository | dynamoRepository
```

### Interfaz estándar

Todos los repositorios implementan:

| Método | Descripción |
|--------|-------------|
| `list(collection, options)` | Lista con paginación (`{ limit, offset }`), devuelve `{ items, nextToken }` |
| `findById(collection, id)` | Busca por ID, devuelve item o `null` |
| `findOneBy(collection, field, value)` | Busca primer match por campo |
| `create(collection, payload)` | Crea un nuevo item con id/createdAt/updatedAt |
| `update(collection, id, payload)` | Actualiza campos (protege id/createdAt), devuelve item o `null` |
| `remove(collection, id)` | Elimina item, devuelve item eliminado o `null` |
| `queryBy(collection, field, value, options)` | Filtra por campo con paginación, devuelve `{ items, nextToken }` |

### Colecciones soportadas

`users`, `products`, `requisitions`, `requisitionItems`, `inventoryMovements`, `leads`, `leadNotes`, `auditEvents`, `contactMessages`

### Paginación

Los endpoints de listado aceptan `?limit=10&nextToken=offset_10`.
La respuesta incluye `pagination: { limit, nextToken }`.

## Contact Form — Amazon SES

El módulo de contacto (`POST /contact`) guarda el mensaje en DynamoDB y envía una notificación por correo via SES.

### ⚠️ SES Sandbox

Actualmente SES está en **sandbox** (modo por defecto para cuentas nuevas). Esto significa:
- Solo puede enviar correos a direcciones verificadas en SES
- `wil.vasquez3@gmail.com` ya está verificado y recibirá las notificaciones
- La confirmación al visitante (`SEND_CONTACT_CONFIRMATION`) está desactivada porque SES no puede enviar a direcciones arbitrarias

Cuando SES salga de sandbox, cambiar `SEND_CONTACT_CONFIRMATION=true` para activar la confirmación automática al visitante.

### Estados del mensaje

| Estado | Significado |
|--------|-------------|
| `received` | Guardado en DynamoDB |
| `email_sent` | Notificación interna enviada correctamente |
| `email_failed` | Notificación falló (el mensaje NO se pierde) |

## Limitaciones actuales

- **Modo mock por defecto**: `DATA_SOURCE=mock` es la configuración por defecto y la única probada en tests.
- **Datos en memoria**: Al reiniciar el servidor se pierden los cambios. Los datos semilla se recargan desde `seed.js`.
- **DynamoDB**: La implementación está lista en `src/db/dynamoRepository.js` pero requiere tablas reales desplegadas vía Terraform. No está probada en tests actuales.
- **Dashboard no disponible en DynamoDB**: La función `getDashboardSummary()` lanza un error claro cuando `DATA_SOURCE=dynamodb` porque requiere agregaciones que exceden una implementación simple.
- **Sin tests unitarios**: Los tests actuales son smoke tests de integración. Tests unitarios por módulo vendrán en fases siguientes.

> **Advertencia:** Este es un sistema demo con autenticación JWT simple.
> No usar en producción. No incluye Cognito, OAuth2, ni MFA.
