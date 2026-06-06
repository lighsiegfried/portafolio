const ALLOWED_ORIGINS = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['*'];

function middleware(event) {
  const origin = event.headers?.origin || event.headers?.Origin || '*';

  const allowedOrigin = ALLOWED_ORIGINS.includes('*')
    ? '*'
    : ALLOWED_ORIGINS.includes(origin)
      ? origin
      : ALLOWED_ORIGINS[0] || '*';

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Max-Age': '86400',
      },
      body: '',
    };
  }

  return {
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
    },
  };
}

module.exports = { middleware };
