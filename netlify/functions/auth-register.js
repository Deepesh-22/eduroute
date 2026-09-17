const { proxyToGo } = require('./_lib/goProxy');
const { hasMysqlEnv, register } = require('./_lib/mysqlAuth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return proxyToGo.options();
  if (event.httpMethod !== 'POST') {
    return proxyToGo.json(405, { success: false, error: 'Method not allowed' });
  }

  // Preferred: direct MySQL on Netlify (no separate Go server needed)
  if (hasMysqlEnv()) {
    try {
      const body = JSON.parse(event.body || '{}');
      const result = await register({
        name: body.name,
        email: body.email,
        password: body.password,
      });
      return proxyToGo.json(result.status, result.body);
    } catch (err) {
      console.error('auth-register mysql', err);
      return proxyToGo.json(500, {
        success: false,
        error: err.message || 'Unable to register user in MySQL',
      });
    }
  }

  // Fallback: proxy to Go API if GO_API_URL is set
  return proxyToGo.forward(event, '/api/auth/register');
};
