const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

function getToken() {
  try {
    const stored = localStorage.getItem('mini-erp-auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.token || null;
    }
  } catch {}
  return null;
}

async function handleResponse(res) {
  if (res.headers.get('Content-Type')?.includes('text/csv')) {
    const text = await res.text();
    return { ok: true, data: text, _raw: true };
  }
  const json = await res.json();
  if (!json.ok) {
    const err = new Error(json.error?.message || 'Error del servidor');
    err.code = json.error?.code || 'UNKNOWN_ERROR';
    err.statusCode = res.status;
    throw err;
  }
  return json;
}

function buildUrl(path, params) {
  const url = new URL(`${BASE_URL}/api${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    });
  }
  return url.toString();
}

function buildHeaders(extra) {
  const headers = { 'Content-Type': 'application/json', ...extra };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function get(path, params) {
  const res = await fetch(buildUrl(path, params), {
    method: 'GET',
    headers: buildHeaders(),
  });
  return handleResponse(res);
}

export async function post(path, body) {
  const res = await fetch(buildUrl(path), {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function patch(path, body) {
  const res = await fetch(buildUrl(path), {
    method: 'PATCH',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function downloadCsv(path) {
  const res = await fetch(buildUrl(path), {
    method: 'GET',
    headers: buildHeaders(),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    const err = new Error(json.error?.message || 'Error al descargar CSV');
    err.statusCode = res.status;
    throw err;
  }
  return res.blob();
}

export { BASE_URL, getToken };
