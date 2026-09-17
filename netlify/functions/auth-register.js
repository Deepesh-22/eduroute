/**
 * POST /api/auth/register
 * Prefer direct MySQL (Railway). Fallback: proxy to GO_API_URL if set.
 */
const mysqlAuth = require('./_lib/mysqlAuth');
const { proxyToGo } = require('./_lib/goProxy');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return mysqlAuth.options();
  if (event.httpMethod !== 'POST') {
    return mysqlAuth.json(405, { success: false, error: 'Method not allowed' });
  }

  const hasMysql = mysqlAuth.hasMysqlConfig();
  const depsOk = mysqlAuth.depsReady();

  if (hasMysql && !depsOk) {
    return mysqlAuth.json(500, {
      success: false,
      error: 'Server missing mysql2/bcryptjs. Check Netlify function dependencies.',
    });
  }

  if (hasMysql && depsOk) {
    try {
      const body = JSON.parse(event.body || '{}');
      return await mysqlAuth.register({
        name: body.name,
        email: body.email,
        password: body.password,
      });
    } catch (err) {
      console.error('auth-register mysql', err);
      return mysqlAuth.json(500, {
        success: false,
        error: err.message || 'Unable to register user',
      });
    }
  }

  return proxyToGo.forward(event, '/api/auth/register');
};
