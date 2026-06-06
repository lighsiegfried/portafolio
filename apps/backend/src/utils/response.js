function success(data, statusCode = 200) {
  return {
    statusCode,
    headers: defaultHeaders(),
    body: JSON.stringify({ ok: true, data }),
  };
}

function error(statusCode, code, message) {
  return {
    statusCode,
    headers: defaultHeaders(),
    body: JSON.stringify({ ok: false, error: { code, message } }),
  };
}

function list(data, meta = null, statusCode = 200) {
  const body = { ok: true, data };
  if (meta) {
    body.meta = meta;
  }
  return {
    statusCode,
    headers: defaultHeaders(),
    body: JSON.stringify(body),
  };
}

function csv(csvContent, filename) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Access-Control-Allow-Origin': '*',
    },
    body: csvContent,
  };
}

function defaultHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };
}

module.exports = { success, error, list, csv };
