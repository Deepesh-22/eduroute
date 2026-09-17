const { proxyToGo } = require('./_lib/goProxy');
const { hasMysqlEnv, login, ensureAdminSeed } = require('./_lib/mysqlAuth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return proxyToGo.options();
  if (event.httpMethod !== 'POST') {
    return proxyToGo.json(405, { success: false, error: 'Method not allowed' });
  }

  if (hasMysqlEnv()) {
    try {
      await ensureAdminSeed();
      const body = JSON.parse(event.body || '{}');
      const result = await login({
        email: body.email,
        password: body.password,
        role: 'admin',
      });
      return proxyToGo.json(result.status, result.body);
    } catch (err) {
      console.error('auth-login-staff mysql', err);
      return proxyToGo.json(500, {
        success: false,
        error: err.message || 'Unable to login',
      });
    }
  }

  return proxyToGo.forward(event, '/api/auth/login/staff');
};
