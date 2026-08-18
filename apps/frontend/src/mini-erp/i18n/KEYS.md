# Mini ERP i18n — key reference

Dictionary: `src/mini-erp/i18n/erpTranslations.js` (namespaces `es` / `en`, identical key sets — 448 leaf keys each).
Hook: `src/mini-erp/i18n/useErpTranslation.js` → `const { te, language } = useErpTranslation();`

All values are plain strings. `{placeholder}` tokens must be replaced by the consumer
(there is no runtime interpolator); every placeholder is listed below.

## Placeholders

| Key | Placeholders |
| --- | --- |
| `common.showing` | `{count}`, `{total}` |
| `common.results` | `{count}` |
| `common.page` | `{page}`, `{total}` |
| `dashboard.kpi.totalHint` | `{count}` |
| `dashboard.kpi.productsHint` | `{count}` |
| `dashboard.pipeline.totalHint` | `{count}` |
| `requisitions.detail.items` | `{count}` |
| `requisitions.form.estimatedTotal` | `{total}` |
| `products.stock.description` | `{product}`, `{stock}` |
| `inventory.lowStockPanel.title` | `{count}` |
| `inventory.lowStockPanel.min` | `{count}` |
| `inventory.form.productOption` | `{sku}`, `{name}`, `{stock}` |
| `inventory.form.currentStock` | `{stock}` |
| `inventory.form.resultingStock` | `{stock}` |
| `leads.detail.notes` | `{count}` |
| `leads.confirmLost.descriptionBoard` | `{company}` |
| `leads.confirmLost.descriptionDetail` | `{company}` |
| `toast.stockUpdated` | `{type}` |
| `toast.leadMoved` | `{stage}` |
| `toast.reportGenerating` | `{report}` |
| `toast.reportExported` | `{report}` |
| `toast.reportError` | `{report}` |

## Notable per-key wiring

### Config modules (`labelKey` + fallback `label`)

Every `src/mini-erp/config/*.js` entry now carries a `labelKey` (a dotted path into this
dictionary) **and** a static `label` sourced from `erpTranslations.es`. The static field is a
fallback only — anything user-visible must resolve through `te`, either directly
(`te.status.lead[status] || stage.label`) or via the `te`-aware config helpers
(`stageLabel(status, te)`, `localizedReqFilters(te)`, `allowedActions(req, user, te)`,
`timelineSteps(status, te)`, `movementType(type, te)`, `localizedReports(te)`, …).

- `nav.dashboard|requisitions|products|inventory|leads|reports` → `config/navigation.js`
  `NAV_ITEMS[].titleKey` (**not** `.title`). `getPageMeta(pathname)` returns `{ titleKey }`;
  resolve it with `navTitle(te, titleKey)`. Feeds `AppSidebar`, `CommandPalette` and the
  `AppHeader` breadcrumb.
- `nav.fallbackTitle` → `getPageMeta()` fallback when the route matches no nav item.
- `nav.breadcrumbRoot` → the first `AppHeader` breadcrumb crumb.
- `requisitions.filters.*` → `config/requisitions.js` `REQ_FILTERS[].labelKey` (tabs on `RequisitionsPage`).
- `requisitions.actions.{approve,reject,complete}` → `REQ_ACTIONS[*].label`; `*Title` → `confirmTitle`;
  `*Body` → `confirmBody`. `RequisitionActionDialog` and `RequisitionsPage` look these up by
  `action.key`, falling back to the config's own strings.
- `requisitions.timeline.created` → `timelineSteps()` first step of the **rejected** branch only
  (every other step reuses `status.requisition.*`).
- `products.categories.*` → `forms/ProductFormDialog.jsx` `PRODUCT_CATEGORIES[].value`
  (`categoryLabel(value, te)` prefers the dictionary and falls back to the static label).
- `inventory.movementTypes.IN|OUT` → `config/inventory.js` `MOVEMENT_TYPES[*]`, rendered by
  `MovementTypeBadge.jsx` (which also takes its dual-shade `badge` classes from that config —
  there is no local palette override any more).
- `inventory.typeFilters.all|in|out` → `MOVEMENT_TYPE_FILTERS[].labelKey`. **Note the case skew:**
  filter `value`s are `all|IN|OUT` while the keys are lowercase, so `InventoryPage` indexes with
  `String(f.value).toLowerCase()`.
- `leads.sources.*` → `config/leads.js` `LEAD_SOURCES[].value` / `sourceLabel(value, te)`.
- `status.lead.*` → `config/leads.js` `LEAD_STAGES[].status` / `stageLabel()` **and** `components/StatusBadge.jsx`.
- `status.requisition.*` → `config/requisitions.js` `REQ_STATUSES[]` / `statusLabel()`,
  `utils/formatters.js` `statusLabel(status, language)`, `components/StatusBadge.jsx`,
  `RequisitionTimeline.jsx`.
- `status.priority.*` → the priority cell in `RequisitionsTable.jsx` and `RequisitionDetailSheet.jsx`
  (colors come from `config/requisitions.js` `PRIORITY_STYLES`).
- `dashboard.chart.*` → `charts/RequisitionStatusChart.jsx` segment labels, centre total and empty state.
- `dashboard.quickActions.*` → `data-display/QuickActions.jsx` (`labelKey` on the module array).
- `reports.catalog.<key>.title|description` → `config/reports.js` `REPORTS[]`, keyed by `report.key`;
  icon accents come from `REPORT_ACCENTS`.

### Shared UI and shadcn primitives

- `common.close` → `ui/dialog.jsx` and `ui/sheet.jsx` (sr-only label **and** `aria-label` on the X button).
- `common.toggleSidebar` / `common.sidebar` / `common.sidebarDescription` → `ui/sidebar.jsx`
  (`SidebarTrigger`, `SidebarRail`, and the sr-only mobile `SheetHeader`).
- `common.more` and `common.breadcrumb` → `ui/breadcrumb.jsx` (`BreadcrumbEllipsis` sr-only, `nav` `aria-label`).
- `common.actions` → the `aria-label` + sr-only label on every row-actions dropdown trigger
  (`ProductsPage`, `LeadsTable`, `RequisitionsTable`, `data-display/DataTable`).
- `common.results` / `common.page` / `common.previous` / `common.next` → `data-display/DataTable.jsx` pagination footer.
- `common.confirm` / `common.cancel` / `common.processing` → `feedback/ConfirmDialog.jsx` defaults
  (applied with `??`, so an explicitly passed label still wins).
- `common.toggleTheme` / `common.toggleLanguage` / `common.backToPortfolio` → the control cluster in
  `components/layout/AppHeader.jsx` **and** the standalone copy on `pages/LoginPage.jsx` (the login
  screen renders outside `MiniErpLayout`, so it carries its own toggles).
- `common.loading` → `components/LoadingState.jsx` and the `MiniErpLayout` auth spinner.
- `empty.default` → `components/EmptyState.jsx` fallback; `empty.noResults` → `data-display/DataTable.jsx`.
- `errors.generic` → `components/ErrorState.jsx` fallback. `hooks/useApiResource.js` deliberately
  stores only `{ message }` from the API and leaves the localized fallback to the caller.
- `formats.locale` / `formats.currency` → `utils/formatters.js` (`toLocaleDateString`,
  `Intl.NumberFormat`); `formats.emptyValue` is the `'-'` shown for null cells throughout.
  `MiniErpLayout` calls `useFormatterLanguage()` so those helpers follow the toggle without every
  call site passing `language`.

### Language-reactivity rules observed by the wiring

- Fetch `useCallback`s never close over `te`; error state stores a **key** or a raw
  `{ message }` and the localized fallback is resolved at render. Otherwise toggling the language
  would refetch from AWS.
- Any `useMemo`/`useCallback` that *builds* localized output (table columns, chart segments) does
  list `te` in its deps — `te` is memoized on `language`, so this is free between renders.

# Full key list

## `common`

Serves: shared UI (ConfirmDialog, DataTable, EmptyState/ErrorState/LoadingState, ui/dialog, ui/sheet, ui/sidebar, ui/breadcrumb)

- `common.save` — es: "Guardar" | en: "Save"
- `common.saveChanges` — es: "Guardar cambios" | en: "Save changes"
- `common.saving` — es: "Guardando..." | en: "Saving..."
- `common.cancel` — es: "Cancelar" | en: "Cancel"
- `common.close` — es: "Cerrar" | en: "Close"
- `common.delete` — es: "Eliminar" | en: "Delete"
- `common.edit` — es: "Editar" | en: "Edit"
- `common.create` — es: "Crear" | en: "Create"
- `common.creating` — es: "Creando..." | en: "Creating..."
- `common.add` — es: "Agregar" | en: "Add"
- `common.update` — es: "Actualizar" | en: "Update"
- `common.search` — es: "Buscar" | en: "Search"
- `common.filter` — es: "Filtrar" | en: "Filter"
- `common.actions` — es: "Acciones" | en: "Actions"
- `common.loading` — es: "Cargando..." | en: "Loading..."
- `common.processing` — es: "Procesando..." | en: "Processing..."
- `common.retry` — es: "Reintentar" | en: "Retry"
- `common.noResults` — es: "Sin resultados" | en: "No results"
- `common.confirm` — es: "Confirmar" | en: "Confirm"
- `common.yes` — es: "Sí" | en: "Yes"
- `common.no` — es: "No" | en: "No"
- `common.back` — es: "Volver" | en: "Back"
- `common.next` — es: "Siguiente" | en: "Next"
- `common.previous` — es: "Anterior" | en: "Previous"
- `common.of` — es: "de" | en: "of"
- `common.showing` — es: "Mostrando {count} de {total}" | en: "Showing {count} of {total}"
- `common.results` — es: "{count} resultado(s)" | en: "{count} result(s)"
- `common.page` — es: "Página {page} de {total}" | en: "Page {page} of {total}"
- `common.rowsPerPage` — es: "Filas por página" | en: "Rows per page"
- `common.all` — es: "Todos" | en: "All"
- `common.required` — es: "Requerido" | en: "Required"
- `common.optional` — es: "Opcional" | en: "Optional"
- `common.viewDetail` — es: "Ver detalle" | en: "View details"
- `common.moveTo` — es: "Mover a" | en: "Move to"
- `common.backToPortfolio` — es: "Volver al portafolio" | en: "Back to portfolio"
- `common.toggleTheme` — es: "Cambiar tema" | en: "Toggle theme"
- `common.toggleLanguage` — es: "Cambiar idioma" | en: "Toggle language"
- `common.toggleSidebar` — es: "Alternar barra lateral" | en: "Toggle sidebar"
- `common.sidebar` — es: "Barra lateral" | en: "Sidebar"
- `common.sidebarDescription` — es: "Muestra la barra lateral móvil." | en: "Displays the mobile sidebar."
- `common.more` — es: "Más" | en: "More"
- `common.breadcrumb` — es: "Ruta de navegación" | en: "Breadcrumb"

## `auth`

Serves: pages/LoginPage.jsx + components/layout/UserMenu.jsx

- `auth.title` — es: "Mini ERP" | en: "Mini ERP"
- `auth.subtitle` — es: "Sistema de Gestión Empresarial" | en: "Business Management System"
- `auth.tagline` — es: "Demo técnica conectada a backend serverless en AWS" | en: "Technical demo wired to a serverless backend on AWS"
- `auth.username` — es: "Usuario" | en: "Username"
- `auth.usernamePlaceholder` — es: "wilson" | en: "wilson"
- `auth.password` — es: "Contraseña" | en: "Password"
- `auth.passwordPlaceholder` — es: "admin123" | en: "admin123"
- `auth.submit` — es: "Ingresar" | en: "Sign in"
- `auth.submitting` — es: "Ingresando..." | en: "Signing in..."
- `auth.demoCredentials` — es: "Usuarios de prueba" | en: "Demo users"
- `auth.disclaimer` — es: "Datos ficticios de demostración. Conexión a AWS Lambda + DynamoDB." | en: "Fictitious demo data. Connected to AWS Lambda + DynamoDB."
- `auth.userFallback` — es: "Usuario" | en: "User"
- `auth.logout` — es: "Salir" | en: "Sign out"
- `auth.logoutTitle` — es: "Cerrar sesión" | en: "Sign out"
- `auth.logoutDescription` — es: "Se cerrará tu sesión y volverás al portafolio." | en: "You will be signed out and taken back to the portfolio."
- `auth.logoutConfirm` — es: "Cerrar sesión" | en: "Sign out"
- `auth.errors.missingFields` — es: "Ingrese usuario y contraseña" | en: "Enter your username and password"
- `auth.errors.invalidCredentials` — es: "Credenciales inválidas" | en: "Invalid credentials"

## `nav`

Serves: config/navigation.js, layout/AppSidebar.jsx, layout/AppHeader.jsx, layout/CommandPalette.jsx

- `nav.brand` — es: "Mini ERP" | en: "Mini ERP"
- `nav.brandSubtitle` — es: "CRM Lite" | en: "CRM Lite"
- `nav.groupManagement` — es: "Gestión" | en: "Management"
- `nav.dashboard` — es: "Dashboard" | en: "Dashboard"
- `nav.requisitions` — es: "Requisiciones" | en: "Requisitions"
- `nav.products` — es: "Productos" | en: "Products"
- `nav.inventory` — es: "Inventario" | en: "Inventory"
- `nav.leads` — es: "CRM Lite" | en: "CRM Lite"
- `nav.reports` — es: "Reportes" | en: "Reports"
- `nav.fallbackTitle` — es: "Mini ERP" | en: "Mini ERP"
- `nav.breadcrumbRoot` — es: "Mini ERP" | en: "Mini ERP"
- `nav.backToPortfolio` — es: "Volver al portafolio" | en: "Back to portfolio"
- `nav.commandTrigger` — es: "Buscar..." | en: "Search..."
- `nav.commandPlaceholder` — es: "Buscar páginas..." | en: "Search pages..."
- `nav.commandEmpty` — es: "Sin resultados." | en: "No results."
- `nav.commandGroupNavigation` — es: "Navegación" | en: "Navigation"
- `nav.commandShortcut` — es: "⌘K" | en: "⌘K"

## `dashboard`

Serves: pages/DashboardPage.jsx + data-display/{KpiCard,QuickActions,CrmPipeline,LowStockAlerts,RecentActivity} + charts/RequisitionStatusChart.jsx

- `dashboard.title` — es: "Dashboard" | en: "Dashboard"
- `dashboard.subtitle` — es: "Resumen del sistema" | en: "System overview"
- `dashboard.kpi.pendingRequisitions` — es: "Reqs Pendientes" | en: "Pending Reqs"
- `dashboard.kpi.activeLeads` — es: "Leads Activos" | en: "Active Leads"
- `dashboard.kpi.lowStock` — es: "Bajo Stock" | en: "Low Stock"
- `dashboard.kpi.inventoryValue` — es: "Valor Inventario" | en: "Inventory Value"
- `dashboard.kpi.totalHint` — es: "{count} en total" | en: "{count} in total"
- `dashboard.kpi.productsHint` — es: "{count} productos" | en: "{count} products"
- `dashboard.quickActions.newRequisition` — es: "Nueva requisición" | en: "New requisition"
- `dashboard.quickActions.registerMovement` — es: "Registrar movimiento" | en: "Record movement"
- `dashboard.quickActions.newLead` — es: "Nuevo lead" | en: "New lead"
- `dashboard.quickActions.newProduct` — es: "Nuevo producto" | en: "New product"
- `dashboard.chart.title` — es: "Estado de requisiciones" | en: "Requisition status"
- `dashboard.chart.total` — es: "Total" | en: "Total"
- `dashboard.chart.pending` — es: "Pendientes" | en: "Pending"
- `dashboard.chart.approved` — es: "Aprobadas" | en: "Approved"
- `dashboard.chart.completed` — es: "Completadas" | en: "Completed"
- `dashboard.chart.rejected` — es: "Rechazadas" | en: "Rejected"
- `dashboard.chart.empty` — es: "Sin requisiciones registradas" | en: "No requisitions recorded"
- `dashboard.pipeline.title` — es: "Pipeline CRM" | en: "CRM Pipeline"
- `dashboard.pipeline.totalHint` — es: "{count} leads en total" | en: "{count} leads in total"
- `dashboard.pipeline.empty` — es: "Sin leads registrados" | en: "No leads recorded"
- `dashboard.lowStock.title` — es: "Alertas de bajo stock" | en: "Low stock alerts"
- `dashboard.lowStock.viewInventory` — es: "Ver inventario" | en: "View inventory"
- `dashboard.lowStock.empty` — es: "Sin productos en bajo stock" | en: "No products below minimum stock"
- `dashboard.lowStock.badge` — es: "Bajo stock" | en: "Low stock"
- `dashboard.lowStock.columns.sku` — es: "SKU" | en: "SKU"
- `dashboard.lowStock.columns.product` — es: "Producto" | en: "Product"
- `dashboard.lowStock.columns.stock` — es: "Stock" | en: "Stock"
- `dashboard.lowStock.columns.minStock` — es: "Mínimo" | en: "Minimum"
- `dashboard.lowStock.columns.status` — es: "Estado" | en: "Status"
- `dashboard.activity.title` — es: "Actividad reciente" | en: "Recent activity"
- `dashboard.activity.tabs.requisitions` — es: "Requisiciones" | en: "Requisitions"
- `dashboard.activity.tabs.movements` — es: "Movimientos" | en: "Movements"
- `dashboard.activity.tabs.leads` — es: "Leads" | en: "Leads"
- `dashboard.activity.requisitions.columns.number` — es: "Número" | en: "Number"
- `dashboard.activity.requisitions.columns.title` — es: "Título" | en: "Title"
- `dashboard.activity.requisitions.columns.status` — es: "Estado" | en: "Status"
- `dashboard.activity.requisitions.columns.date` — es: "Fecha" | en: "Date"
- `dashboard.activity.requisitions.empty` — es: "Sin requisiciones recientes" | en: "No recent requisitions"
- `dashboard.activity.movements.columns.type` — es: "Tipo" | en: "Type"
- `dashboard.activity.movements.columns.quantity` — es: "Cantidad" | en: "Quantity"
- `dashboard.activity.movements.columns.reason` — es: "Motivo" | en: "Reason"
- `dashboard.activity.movements.columns.date` — es: "Fecha" | en: "Date"
- `dashboard.activity.movements.empty` — es: "Sin movimientos recientes" | en: "No recent movements"
- `dashboard.activity.leads.columns.company` — es: "Empresa" | en: "Company"
- `dashboard.activity.leads.columns.contact` — es: "Contacto" | en: "Contact"
- `dashboard.activity.leads.columns.status` — es: "Estado" | en: "Status"
- `dashboard.activity.leads.columns.date` — es: "Fecha" | en: "Date"
- `dashboard.activity.leads.empty` — es: "Sin leads recientes" | en: "No recent leads"

## `requisitions`

Serves: pages/RequisitionsPage.jsx, config/requisitions.js, data-display/{RequisitionsTable,RequisitionDetailSheet,RequisitionTimeline}, forms/{RequisitionFormDialog,RequisitionActionDialog}

- `requisitions.title` — es: "Requisiciones" | en: "Requisitions"
- `requisitions.subtitlePrefix` — es: "Flujo de aprobación de compras:" | en: "Purchase approval flow:"
- `requisitions.subtitleFlow` — es: "Pendiente → Aprobada → Completada" | en: "Pending → Approved → Completed"
- `requisitions.subtitleSuffix` — es: "· una requisición pendiente también puede ser rechazada." | en: "· a pending requisition can also be rejected."
- `requisitions.newButton` — es: "Nueva requisición" | en: "New requisition"
- `requisitions.searchPlaceholder` — es: "Buscar por número o título..." | en: "Search by number or title..."
- `requisitions.kpi.total` — es: "Total" | en: "Total"
- `requisitions.kpi.pending` — es: "Pendientes" | en: "Pending"
- `requisitions.kpi.completed` — es: "Completadas" | en: "Completed"
- `requisitions.kpi.pipelineValue` — es: "Valor en proceso" | en: "Value in progress"
- `requisitions.filters.all` — es: "Todas" | en: "All"
- `requisitions.filters.pending` — es: "Pendientes" | en: "Pending"
- `requisitions.filters.approved` — es: "Aprobadas" | en: "Approved"
- `requisitions.filters.completed` — es: "Completadas" | en: "Completed"
- `requisitions.filters.rejected` — es: "Rechazadas" | en: "Rejected"
- `requisitions.table.number` — es: "Número" | en: "Number"
- `requisitions.table.title` — es: "Título" | en: "Title"
- `requisitions.table.status` — es: "Estado" | en: "Status"
- `requisitions.table.priority` — es: "Prioridad" | en: "Priority"
- `requisitions.table.estimatedCost` — es: "Costo est." | en: "Est. cost"
- `requisitions.table.date` — es: "Fecha" | en: "Date"
- `requisitions.table.flowGroup` — es: "Flujo" | en: "Workflow"
- `requisitions.table.empty` — es: "No hay requisiciones en este estado" | en: "No requisitions in this status"
- `requisitions.empty.title` — es: "Sin requisiciones" | en: "No requisitions"
- `requisitions.empty.message` — es: "Crea una requisición para iniciar el flujo de aprobación de compras." | en: "Create a requisition to start the purchase approval flow."
- `requisitions.detail.priority` — es: "Prioridad" | en: "Priority"
- `requisitions.detail.department` — es: "Departamento" | en: "Department"
- `requisitions.detail.createdBy` — es: "Creada por" | en: "Created by"
- `requisitions.detail.approvedBy` — es: "Aprobada por" | en: "Approved by"
- `requisitions.detail.completedBy` — es: "Completada por" | en: "Completed by"
- `requisitions.detail.estimatedCost` — es: "Costo estimado" | en: "Estimated cost"
- `requisitions.detail.createdAt` — es: "Creada" | en: "Created"
- `requisitions.detail.notes` — es: "Notas" | en: "Notes"
- `requisitions.detail.rejectionReason` — es: "Motivo de rechazo" | en: "Rejection reason"
- `requisitions.detail.items` — es: "Ítems ({count})" | en: "Items ({count})"
- `requisitions.detail.itemsEmpty` — es: "Sin ítems registrados" | en: "No items recorded"
- `requisitions.timeline.created` — es: "Creada" | en: "Created"
- `requisitions.actions.approve` — es: "Aprobar" | en: "Approve"
- `requisitions.actions.reject` — es: "Rechazar" | en: "Reject"
- `requisitions.actions.complete` — es: "Completar" | en: "Complete"
- `requisitions.actions.approveTitle` — es: "Aprobar requisición" | en: "Approve requisition"
- `requisitions.actions.approveBody` — es: "La requisición pasará a estado \"Aprobada\" y podrá completarse." | en: "The requisition will move to \"Approved\" and can then be completed."
- `requisitions.actions.rejectTitle` — es: "Rechazar requisición" | en: "Reject requisition"
- `requisitions.actions.rejectBody` — es: "La requisición quedará rechazada de forma definitiva. Indica el motivo." | en: "The requisition will be permanently rejected. Please state the reason."
- `requisitions.actions.completeTitle` — es: "Completar requisición" | en: "Complete requisition"
- `requisitions.actions.completeBody` — es: "La requisición se marcará como \"Completada\". Esta acción es definitiva." | en: "The requisition will be marked as \"Completed\". This action is final."
- `requisitions.actions.reasonLabel` — es: "Motivo de rechazo" | en: "Rejection reason"
- `requisitions.actions.reasonPlaceholder` — es: "Explica por qué se rechaza la requisición..." | en: "Explain why the requisition is being rejected..."
- `requisitions.actions.reasonRequired` — es: "El motivo es requerido para rechazar." | en: "A reason is required to reject."
- `requisitions.actions.submitting` — es: "Procesando..." | en: "Processing..."
- `requisitions.form.title` — es: "Nueva requisición" | en: "New requisition"
- `requisitions.form.description` — es: "Registra una solicitud de compra. Iniciará en estado \"Pendiente\"." | en: "Record a purchase request. It will start in \"Pending\" status."
- `requisitions.form.titleLabel` — es: "Título" | en: "Title"
- `requisitions.form.titlePlaceholder` — es: "Ej: Compra de insumos" | en: "e.g. Purchase of supplies"
- `requisitions.form.descriptionLabel` — es: "Descripción" | en: "Description"
- `requisitions.form.descriptionPlaceholder` — es: "Detalle de la solicitud" | en: "Details of the request"
- `requisitions.form.items` — es: "Ítems" | en: "Items"
- `requisitions.form.estimatedTotal` — es: "Total estimado: {total}" | en: "Estimated total: {total}"
- `requisitions.form.columns.product` — es: "Producto" | en: "Product"
- `requisitions.form.columns.quantity` — es: "Cant." | en: "Qty"
- `requisitions.form.columns.unit` — es: "Unidad" | en: "Unit"
- `requisitions.form.columns.cost` — es: "Costo" | en: "Cost"
- `requisitions.form.productPlaceholder` — es: "Producto" | en: "Product"
- `requisitions.form.addItem` — es: "Agregar ítem" | en: "Add item"
- `requisitions.form.removeItem` — es: "Eliminar ítem" | en: "Remove item"
- `requisitions.form.submit` — es: "Crear requisición" | en: "Create requisition"
- `requisitions.form.submitting` — es: "Creando..." | en: "Creating..."
- `requisitions.form.errors.titleRequired` — es: "El título es requerido" | en: "Title is required"
- `requisitions.form.errors.descriptionRequired` — es: "La descripción es requerida" | en: "Description is required"
- `requisitions.form.errors.itemsRequired` — es: "Agregue al menos un ítem con nombre de producto" | en: "Add at least one item with a product name"
- `requisitions.form.errors.quantityPositive` — es: "La cantidad de cada ítem debe ser mayor a 0" | en: "Each item quantity must be greater than 0"
- `requisitions.form.errors.costNonNegative` — es: "El costo estimado no puede ser negativo" | en: "Estimated cost cannot be negative"

## `products`

Serves: pages/ProductsPage.jsx, forms/ProductFormDialog.jsx, forms/StockAdjustDialog.jsx

- `products.title` — es: "Productos" | en: "Products"
- `products.subtitle` — es: "Catálogo de productos y materiales" | en: "Catalog of products and materials"
- `products.newButton` — es: "Nuevo producto" | en: "New product"
- `products.searchPlaceholder` — es: "Buscar por SKU o nombre..." | en: "Search by SKU or name..."
- `products.categoryFilterPlaceholder` — es: "Categoría" | en: "Category"
- `products.categoryFilterAll` — es: "Todas las categorías" | en: "All categories"
- `products.kpi.total` — es: "Total productos" | en: "Total products"
- `products.kpi.lowStock` — es: "Bajo stock" | en: "Low stock"
- `products.kpi.categories` — es: "Categorías" | en: "Categories"
- `products.kpi.inventoryValue` — es: "Valor inventario" | en: "Inventory value"
- `products.table.sku` — es: "SKU" | en: "SKU"
- `products.table.name` — es: "Nombre" | en: "Name"
- `products.table.category` — es: "Categoría" | en: "Category"
- `products.table.stock` — es: "Stock" | en: "Stock"
- `products.table.minStock` — es: "Mínimo" | en: "Minimum"
- `products.table.unit` — es: "Unidad" | en: "Unit"
- `products.table.price` — es: "Precio" | en: "Price"
- `products.table.inactive` — es: "Inactivo" | en: "Inactive"
- `products.table.lowBadge` — es: "Bajo" | en: "Low"
- `products.table.empty` — es: "Ningún producto coincide con la búsqueda" | en: "No product matches your search"
- `products.rowActions.edit` — es: "Editar" | en: "Edit"
- `products.rowActions.adjustStock` — es: "Ajustar stock" | en: "Adjust stock"
- `products.empty.title` — es: "Catálogo vacío" | en: "Empty catalog"
- `products.empty.message` — es: "Agrega tu primer producto para empezar a gestionar el inventario." | en: "Add your first product to start managing inventory."
- `products.categories.insumo` — es: "Insumo" | en: "Supply"
- `products.categories.materia_prima` — es: "Materia Prima" | en: "Raw Material"
- `products.categories.equipo` — es: "Equipo" | en: "Equipment"
- `products.categories.servicio` — es: "Servicio" | en: "Service"
- `products.categories.oficina` — es: "Oficina" | en: "Office"
- `products.form.createTitle` — es: "Nuevo producto" | en: "New product"
- `products.form.editTitle` — es: "Editar producto" | en: "Edit product"
- `products.form.createDescription` — es: "Registra un nuevo producto en el catálogo." | en: "Add a new product to the catalog."
- `products.form.editDescription` — es: "Actualiza los datos del producto." | en: "Update the product details."
- `products.form.sku` — es: "SKU" | en: "SKU"
- `products.form.skuPlaceholder` — es: "INS-001" | en: "INS-001"
- `products.form.unit` — es: "Unidad" | en: "Unit"
- `products.form.unitPlaceholder` — es: "unidad" | en: "unit"
- `products.form.name` — es: "Nombre" | en: "Name"
- `products.form.namePlaceholder` — es: "Nombre del producto" | en: "Product name"
- `products.form.category` — es: "Categoría" | en: "Category"
- `products.form.price` — es: "Precio" | en: "Price"
- `products.form.minStock` — es: "Stock mínimo" | en: "Minimum stock"
- `products.form.initialStock` — es: "Stock inicial" | en: "Initial stock"
- `products.form.description` — es: "Descripción" | en: "Description"
- `products.form.descriptionPlaceholder` — es: "Opcional" | en: "Optional"
- `products.form.submitCreate` — es: "Crear producto" | en: "Create product"
- `products.form.submitEdit` — es: "Guardar cambios" | en: "Save changes"
- `products.form.submitting` — es: "Guardando..." | en: "Saving..."
- `products.form.errors.required` — es: "SKU y nombre son requeridos" | en: "SKU and name are required"
- `products.stock.title` — es: "Ajustar stock" | en: "Adjust stock"
- `products.stock.description` — es: "{product} · stock actual: {stock}" | en: "{product} · current stock: {stock}"
- `products.stock.type` — es: "Tipo" | en: "Type"
- `products.stock.typeIn` — es: "Entrada (IN)" | en: "Inbound (IN)"
- `products.stock.typeOut` — es: "Salida (OUT)" | en: "Outbound (OUT)"
- `products.stock.quantity` — es: "Cantidad" | en: "Quantity"
- `products.stock.reference` — es: "Referencia" | en: "Reference"
- `products.stock.referencePlaceholder` — es: "Ej: Compra proveedor" | en: "e.g. Supplier purchase"
- `products.stock.defaultReference` — es: "Ajuste de stock" | en: "Stock adjustment"
- `products.stock.submit` — es: "Registrar ajuste" | en: "Record adjustment"
- `products.stock.submitting` — es: "Guardando..." | en: "Saving..."
- `products.stock.errors.quantityPositive` — es: "La cantidad debe ser mayor a 0" | en: "Quantity must be greater than 0"

## `inventory`

Serves: pages/InventoryPage.jsx, config/inventory.js, data-display/{MovementsTable,MovementTypeBadge}, forms/MovementFormDialog.jsx

- `inventory.title` — es: "Inventario" | en: "Inventory"
- `inventory.subtitle` — es: "Movimientos de stock y alertas de inventario" | en: "Stock movements and inventory alerts"
- `inventory.newButton` — es: "Registrar movimiento" | en: "Record movement"
- `inventory.recentTitle` — es: "Movimientos recientes" | en: "Recent movements"
- `inventory.searchPlaceholder` — es: "Buscar por referencia o producto..." | en: "Search by reference or product..."
- `inventory.productFilterPlaceholder` — es: "Producto" | en: "Product"
- `inventory.productFilterAll` — es: "Todos los productos" | en: "All products"
- `inventory.kpi.inbound` — es: "Entradas" | en: "Inbound"
- `inventory.kpi.outbound` — es: "Salidas" | en: "Outbound"
- `inventory.kpi.lowStockAlerts` — es: "Alertas bajo stock" | en: "Low stock alerts"
- `inventory.kpi.movements` — es: "Movimientos" | en: "Movements"
- `inventory.lowStockPanel.title` — es: "Productos con bajo stock ({count})" | en: "Products below minimum stock ({count})"
- `inventory.lowStockPanel.min` — es: "mín {count}" | en: "min {count}"
- `inventory.typeFilters.all` — es: "Todos" | en: "All"
- `inventory.typeFilters.in` — es: "Entradas" | en: "Inbound"
- `inventory.typeFilters.out` — es: "Salidas" | en: "Outbound"
- `inventory.movementTypes.IN` — es: "Entrada" | en: "Inbound"
- `inventory.movementTypes.OUT` — es: "Salida" | en: "Outbound"
- `inventory.table.type` — es: "Tipo" | en: "Type"
- `inventory.table.product` — es: "Producto" | en: "Product"
- `inventory.table.quantity` — es: "Cantidad" | en: "Quantity"
- `inventory.table.stockBefore` — es: "Stock antes" | en: "Stock before"
- `inventory.table.stockAfter` — es: "Stock después" | en: "Stock after"
- `inventory.table.reference` — es: "Referencia" | en: "Reference"
- `inventory.table.date` — es: "Fecha" | en: "Date"
- `inventory.table.empty` — es: "No hay movimientos que coincidan con los filtros" | en: "No movements match the current filters"
- `inventory.empty.title` — es: "Sin movimientos" | en: "No movements"
- `inventory.empty.message` — es: "Registra una entrada o salida para empezar a controlar el stock." | en: "Record an inbound or outbound movement to start tracking stock."
- `inventory.form.title` — es: "Registrar movimiento" | en: "Record movement"
- `inventory.form.description` — es: "Entrada o salida de stock para un producto." | en: "Inbound or outbound stock for a product."
- `inventory.form.product` — es: "Producto" | en: "Product"
- `inventory.form.productPlaceholder` — es: "Seleccionar producto..." | en: "Select a product..."
- `inventory.form.productOption` — es: "{sku} · {name} (stock: {stock})" | en: "{sku} · {name} (stock: {stock})"
- `inventory.form.type` — es: "Tipo" | en: "Type"
- `inventory.form.typeIn` — es: "Entrada (IN)" | en: "Inbound (IN)"
- `inventory.form.typeOut` — es: "Salida (OUT)" | en: "Outbound (OUT)"
- `inventory.form.quantity` — es: "Cantidad" | en: "Quantity"
- `inventory.form.currentStock` — es: "Stock actual: {stock}" | en: "Current stock: {stock}"
- `inventory.form.resultingStock` — es: "resultante: {stock}" | en: "resulting: {stock}"
- `inventory.form.insufficientSuffix` — es: "· stock insuficiente" | en: "· insufficient stock"
- `inventory.form.reference` — es: "Referencia" | en: "Reference"
- `inventory.form.referencePlaceholder` — es: "Ej: Compra proveedor, ajuste, venta..." | en: "e.g. Supplier purchase, adjustment, sale..."
- `inventory.form.notes` — es: "Notas (opcional)" | en: "Notes (optional)"
- `inventory.form.continue` — es: "Continuar" | en: "Continue"
- `inventory.form.submitIn` — es: "Registrar entrada" | en: "Record inbound"
- `inventory.form.submitting` — es: "Registrando..." | en: "Recording..."
- `inventory.form.errors.productRequired` — es: "Seleccione un producto" | en: "Select a product"
- `inventory.form.errors.quantityPositive` — es: "La cantidad debe ser mayor a 0" | en: "Quantity must be greater than 0"
- `inventory.form.errors.referenceRequired` — es: "La referencia es requerida" | en: "Reference is required"
- `inventory.form.errors.insufficientStock` — es: "Stock insuficiente para realizar la salida" | en: "Not enough stock for this outbound movement"
- `inventory.confirm.title` — es: "Confirmar salida de stock" | en: "Confirm stock removal"
- `inventory.confirm.description` — es: "Esta acción reducirá el stock disponible y no se puede deshacer." | en: "This action will reduce available stock and cannot be undone."
- `inventory.confirm.product` — es: "Producto" | en: "Product"
- `inventory.confirm.quantity` — es: "Cantidad de salida" | en: "Outbound quantity"
- `inventory.confirm.resultingStock` — es: "Stock resultante" | en: "Resulting stock"
- `inventory.confirm.submit` — es: "Confirmar salida" | en: "Confirm removal"
- `inventory.confirm.submitting` — es: "Registrando..." | en: "Recording..."

## `leads`

Serves: pages/LeadsPage.jsx, config/leads.js, data-display/{LeadsBoard,LeadCard,LeadsTable,LeadDetailSheet}, forms/LeadFormDialog.jsx

- `leads.title` — es: "CRM Lite" | en: "CRM Lite"
- `leads.subtitle` — es: "Pipeline de leads y clientes potenciales" | en: "Pipeline of leads and prospects"
- `leads.newButton` — es: "Nuevo lead" | en: "New lead"
- `leads.searchPlaceholder` — es: "Buscar empresa, contacto o email..." | en: "Search company, contact or email..."
- `leads.sourceFilterPlaceholder` — es: "Fuente" | en: "Source"
- `leads.sourceFilterAll` — es: "Todas las fuentes" | en: "All sources"
- `leads.kpi.total` — es: "Total leads" | en: "Total leads"
- `leads.kpi.active` — es: "Activos" | en: "Active"
- `leads.kpi.won` — es: "Ganados" | en: "Won"
- `leads.kpi.pipelineValue` — es: "Valor en pipeline" | en: "Pipeline value"
- `leads.view.pipeline` — es: "Pipeline" | en: "Pipeline"
- `leads.view.table` — es: "Tabla" | en: "Table"
- `leads.board.emptyStage` — es: "Sin leads en esta etapa" | en: "No leads in this stage"
- `leads.card.moveTo` — es: "Mover a" | en: "Move to"
- `leads.card.moveLead` — es: "Mover lead" | en: "Move lead"
- `leads.table.company` — es: "Empresa" | en: "Company"
- `leads.table.contact` — es: "Contacto" | en: "Contact"
- `leads.table.email` — es: "Email" | en: "Email"
- `leads.table.status` — es: "Estado" | en: "Status"
- `leads.table.source` — es: "Fuente" | en: "Source"
- `leads.table.value` — es: "Valor" | en: "Value"
- `leads.table.followUp` — es: "Seguimiento" | en: "Follow-up"
- `leads.table.viewDetail` — es: "Ver detalle" | en: "View details"
- `leads.table.empty` — es: "Ningún lead coincide con la búsqueda" | en: "No lead matches your search"
- `leads.empty.title` — es: "Sin leads todavía" | en: "No leads yet"
- `leads.empty.message` — es: "Registra tu primer lead para empezar a construir el pipeline." | en: "Add your first lead to start building the pipeline."
- `leads.sources.web` — es: "Web" | en: "Web"
- `leads.sources.referencia` — es: "Referencia" | en: "Referral"
- `leads.sources.llamada` — es: "Llamada" | en: "Phone call"
- `leads.sources.otro` — es: "Otro" | en: "Other"
- `leads.detail.edit` — es: "Editar" | en: "Edit"
- `leads.detail.contact` — es: "Contacto" | en: "Contact"
- `leads.detail.email` — es: "Email" | en: "Email"
- `leads.detail.phone` — es: "Teléfono" | en: "Phone"
- `leads.detail.estimatedValue` — es: "Valor estimado" | en: "Estimated value"
- `leads.detail.nextFollowUp` — es: "Próximo seguimiento" | en: "Next follow-up"
- `leads.detail.changeStatus` — es: "Cambiar estado" | en: "Change status"
- `leads.detail.update` — es: "Actualizar" | en: "Update"
- `leads.detail.notes` — es: "Notas ({count})" | en: "Notes ({count})"
- `leads.detail.notePlaceholder` — es: "Agregar nota..." | en: "Add a note..."
- `leads.detail.addNote` — es: "Agregar" | en: "Add"
- `leads.detail.notesEmpty` — es: "Sin notas todavía" | en: "No notes yet"
- `leads.confirmLost.title` — es: "Marcar lead como perdido" | en: "Mark lead as lost"
- `leads.confirmLost.descriptionBoard` — es: "\"{company}\" se moverá a \"Perdido\". Podrás reactivarlo cambiando su estado más adelante." | en: "\"{company}\" will move to \"Lost\". You can reactivate it later by changing its status."
- `leads.confirmLost.descriptionDetail` — es: "\"{company}\" se marcará como \"Perdido\"." | en: "\"{company}\" will be marked as \"Lost\"."
- `leads.confirmLost.confirm` — es: "Marcar como perdido" | en: "Mark as lost"
- `leads.form.createTitle` — es: "Nuevo lead" | en: "New lead"
- `leads.form.editTitle` — es: "Editar lead" | en: "Edit lead"
- `leads.form.createDescription` — es: "Registra un nuevo lead en el pipeline." | en: "Add a new lead to the pipeline."
- `leads.form.editDescription` — es: "Actualiza los datos del lead." | en: "Update the lead details."
- `leads.form.company` — es: "Empresa" | en: "Company"
- `leads.form.companyPlaceholder` — es: "Nombre de la empresa" | en: "Company name"
- `leads.form.contact` — es: "Contacto" | en: "Contact"
- `leads.form.phone` — es: "Teléfono" | en: "Phone"
- `leads.form.email` — es: "Email" | en: "Email"
- `leads.form.source` — es: "Fuente" | en: "Source"
- `leads.form.nextFollowUp` — es: "Próximo seguimiento" | en: "Next follow-up"
- `leads.form.note` — es: "Nota inicial" | en: "Initial note"
- `leads.form.notePlaceholder` — es: "Opcional" | en: "Optional"
- `leads.form.submitCreate` — es: "Crear lead" | en: "Create lead"
- `leads.form.submitEdit` — es: "Guardar cambios" | en: "Save changes"
- `leads.form.submitting` — es: "Guardando..." | en: "Saving..."
- `leads.form.errors.required` — es: "Empresa, contacto, email, teléfono y fuente son requeridos" | en: "Company, contact, email, phone and source are required"

## `reports`

Serves: pages/ReportsPage.jsx, config/reports.js, data-display/ReportCard.jsx

- `reports.title` — es: "Reportes" | en: "Reports"
- `reports.subtitle` — es: "Exporta los datos del ERP a CSV para análisis en Excel, Google Sheets o cualquier herramienta de BI." | en: "Export ERP data to CSV for analysis in Excel, Google Sheets or any BI tool."
- `reports.noPermission` — es: "No tienes permisos para exportar reportes. Contacta a un administrador." | en: "You do not have permission to export reports. Contact an administrator."
- `reports.footnote` — es: "Los reportes se generan en el servidor con los datos actuales del sistema. Cada archivo CSV incluye únicamente las columnas indicadas y puede abrirse directamente en cualquier hoja de cálculo." | en: "Reports are generated on the server from the current system data. Each CSV file contains only the listed columns and opens directly in any spreadsheet."
- `reports.catalog.requisitions.title` — es: "Requisiciones" | en: "Requisitions"
- `reports.catalog.requisitions.description` — es: "Historial completo de solicitudes de compra con su estado y fechas." | en: "Full history of purchase requests with their status and dates."
- `reports.catalog.inventory.title` — es: "Inventario" | en: "Inventory"
- `reports.catalog.inventory.description` — es: "Catálogo de productos con stock actual, mínimo y precio." | en: "Product catalog with current stock, minimum stock and price."
- `reports.catalog.leads.title` — es: "Leads" | en: "Leads"
- `reports.catalog.leads.description` — es: "Clientes potenciales con datos de contacto, estado y fuente." | en: "Prospects with contact details, status and source."
- `reports.card.badge` — es: "CSV" | en: "CSV"
- `reports.card.columns` — es: "Columnas exportadas" | en: "Exported columns"
- `reports.card.download` — es: "Descargar CSV" | en: "Download CSV"
- `reports.card.downloading` — es: "Descargando..." | en: "Downloading..."
- `reports.card.noPermission` — es: "Sin permiso para este reporte" | en: "No permission for this report"

## `status`

Serves: components/StatusBadge.jsx, utils/formatters.js statusLabel(), config/requisitions.js, config/leads.js

- `status.requisition.pending` — es: "Pendiente" | en: "Pending"
- `status.requisition.approved` — es: "Aprobada" | en: "Approved"
- `status.requisition.completed` — es: "Completada" | en: "Completed"
- `status.requisition.rejected` — es: "Rechazada" | en: "Rejected"
- `status.lead.new` — es: "Nuevo" | en: "New"
- `status.lead.in_contact` — es: "En contacto" | en: "In contact"
- `status.lead.negotiation` — es: "Negociación" | en: "Negotiation"
- `status.lead.won` — es: "Ganado" | en: "Won"
- `status.lead.lost` — es: "Perdido" | en: "Lost"
- `status.priority.urgente` — es: "Urgente" | en: "Urgent"
- `status.priority.alta` — es: "Alta" | en: "High"
- `status.priority.media` — es: "Media" | en: "Medium"
- `status.priority.baja` — es: "Baja" | en: "Low"

## `errors`

Serves: components/ErrorState.jsx messages + catch fallbacks across pages/ and forms/ (resolved at render, never inside a fetch callback)

- `errors.generic` — es: "Error al cargar datos" | en: "Error loading data"
- `errors.loadDashboard` — es: "Error al cargar el dashboard" | en: "Error loading the dashboard"
- `errors.loadRequisitions` — es: "Error al cargar requisiciones" | en: "Error loading requisitions"
- `errors.loadProducts` — es: "Error al cargar productos" | en: "Error loading products"
- `errors.loadInventory` — es: "Error al cargar el inventario" | en: "Error loading inventory"
- `errors.loadLeads` — es: "Error al cargar leads" | en: "Error loading leads"
- `errors.loadLowStock` — es: "Error al cargar bajo stock" | en: "Error loading low stock"
- `errors.saveProduct` — es: "Error al guardar el producto" | en: "Error saving the product"
- `errors.saveLead` — es: "Error al guardar el lead" | en: "Error saving the lead"
- `errors.createRequisition` — es: "Error al crear la requisición" | en: "Error creating the requisition"
- `errors.createMovement` — es: "Error al registrar el movimiento" | en: "Error recording the movement"
- `errors.adjustStock` — es: "Error al ajustar stock" | en: "Error adjusting stock"
- `errors.updateStatus` — es: "Error al actualizar estado" | en: "Error updating status"
- `errors.moveLead` — es: "Error al mover el lead" | en: "Error moving the lead"
- `errors.addNote` — es: "Error al agregar nota" | en: "Error adding the note"
- `errors.requisitionAction` — es: "Error al ejecutar la acción" | en: "Error running the action"

## `empty`

Serves: components/EmptyState.jsx + components/DataTable.jsx defaults

- `empty.default` — es: "Sin datos" | en: "No data"
- `empty.noResults` — es: "Sin resultados" | en: "No results"
- `empty.noPermission` — es: "Sin permiso" | en: "No permission"

## `toast`

Serves: sonner toasts fired from pages/ and forms/

- `toast.requisitionCreated` — es: "Requisición creada" | en: "Requisition created"
- `toast.requisitionApproved` — es: "Requisición aprobada" | en: "Requisition approved"
- `toast.requisitionRejected` — es: "Requisición rechazada" | en: "Requisition rejected"
- `toast.requisitionCompleted` — es: "Requisición completada" | en: "Requisition completed"
- `toast.productCreated` — es: "Producto creado" | en: "Product created"
- `toast.productUpdated` — es: "Producto actualizado" | en: "Product updated"
- `toast.stockUpdated` — es: "Stock actualizado ({type})" | en: "Stock updated ({type})"
- `toast.movementInCreated` — es: "Entrada registrada" | en: "Inbound movement recorded"
- `toast.movementOutCreated` — es: "Salida registrada" | en: "Outbound movement recorded"
- `toast.leadCreated` — es: "Lead creado" | en: "Lead created"
- `toast.leadUpdated` — es: "Lead actualizado" | en: "Lead updated"
- `toast.leadMoved` — es: "Lead movido a \"{stage}\"" | en: "Lead moved to \"{stage}\""
- `toast.leadStatusUpdated` — es: "Estado actualizado" | en: "Status updated"
- `toast.noteAdded` — es: "Nota agregada" | en: "Note added"
- `toast.reportGenerating` — es: "Generando {report}..." | en: "Generating {report}..."
- `toast.reportExported` — es: "{report} exportado" | en: "{report} exported"
- `toast.reportError` — es: "Error al exportar {report}" | en: "Error exporting {report}"
- `toast.reportErrorDescription` — es: "Intenta nuevamente." | en: "Please try again."

## `formats`

Serves: utils/formatters.js (Intl locale + currency, empty-value dash)

- `formats.locale` — es: "es-MX" | en: "en-US"
- `formats.currency` — es: "MXN" | en: "MXN"
- `formats.emptyValue` — es: "-" | en: "-"
