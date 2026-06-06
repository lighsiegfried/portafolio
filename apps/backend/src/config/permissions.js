const PERMISSIONS = {
  'POST /auth/login': ['*'],
  'GET /auth/me': ['admin', 'compras', 'bodega', 'gerencia'],

  'GET /dashboard/summary': ['admin', 'compras', 'bodega', 'gerencia'],

  'GET /requisitions': ['admin', 'compras', 'bodega', 'gerencia'],
  'POST /requisitions': ['admin', 'compras'],
  'GET /requisitions/{id}': ['admin', 'compras', 'bodega', 'gerencia'],
  'PATCH /requisitions/{id}/approve': ['admin', 'gerencia'],
  'PATCH /requisitions/{id}/reject': ['admin', 'gerencia'],
  'PATCH /requisitions/{id}/complete': ['admin', 'compras'],

  'GET /products': ['admin', 'compras', 'bodega', 'gerencia'],
  'POST /products': ['admin'],
  'PATCH /products/{id}': ['admin'],

  'PATCH /products/{id}/stock': ['admin', 'bodega'],
  'POST /inventory/movements': ['admin', 'bodega'],
  'GET /inventory/movements': ['admin', 'bodega'],
  'GET /inventory/low-stock': ['admin', 'bodega'],

  'GET /leads': ['admin', 'gerencia'],
  'POST /leads': ['admin', 'gerencia'],
  'GET /leads/{id}': ['admin', 'gerencia'],
  'PATCH /leads/{id}': ['admin', 'gerencia'],
  'POST /leads/{id}/notes': ['admin', 'gerencia'],

  'GET /reports/requisitions.csv': ['admin', 'compras', 'gerencia'],
  'GET /reports/inventory.csv': ['admin', 'bodega', 'gerencia'],
  'GET /reports/leads.csv': ['admin', 'gerencia'],

  'GET /audit-events': ['admin'],
};

function getPermittedRoles(method, path) {
  const key = `${method} ${path}`;
  if (PERMISSIONS[key]) {
    return PERMISSIONS[key];
  }

  const wildcardKey = Object.keys(PERMISSIONS).find((k) => {
    const [registeredMethod, ...pathParts] = k.split(' ');
    if (registeredMethod !== method) return false;

    const registeredPath = pathParts.join(' ');
    const pattern = registeredPath.replace(/\{[\w]+\}/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  });

  return wildcardKey ? PERMISSIONS[wildcardKey] : null;
}

module.exports = { PERMISSIONS, getPermittedRoles };
