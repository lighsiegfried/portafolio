const http = require('http');
const config = require('./config');
const { handler, routes } = require('./index');

function createLambdaEvent(req, body) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  return {
    httpMethod: req.method,
    path: url.pathname,
    pathParameters: {},
    queryStringParameters: Object.fromEntries(url.searchParams),
    headers: req.headers || {},
    body: body ? JSON.stringify(body) : null,
    requestContext: { requestId: 'local-' + Date.now() },
  };
}

const server = http.createServer(async (req, res) => {
  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', async () => {
    try {
      const parsedBody = body ? JSON.parse(body) : null;
      const event = createLambdaEvent(req, parsedBody);
      const result = await handler(event);

      res.writeHead(result.statusCode, result.headers || { 'Content-Type': 'application/json' });
      res.end(result.body || '');
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' } }));
    }
  });
});

const port = config.server.port;
server.listen(port, () => {
  console.log(`\n  🚀 Mini ERP Backend — Desarrollo local`);
  console.log(`  ─────────────────────────────────────`);
  console.log(`  URL:     http://localhost:${port}`);
  console.log(`  Entorno: ${config.server.nodeEnv}`);
  console.log(`  Logs:    ${config.server.logLevel}`);
  console.log(`\n  Endpoints disponibles:\n`);

  Object.keys(routes).forEach((key) => {
    const [method, path] = key.split(' ');
    console.log(`    ${method.padEnd(7)} /api${path}`);
  });

  console.log(`\n  Usuarios demo:`);
  console.log(`    wilson   / admin123    (admin)`);
  console.log(`    compras1 / compras123  (compras)`);
  console.log(`    bodega1  / bodega123   (bodega)`);
  console.log(`    gerencia1/ gerencia123 (gerencia)`);
  console.log(`\n  Presiona Ctrl+C para detener.\n`);
});
