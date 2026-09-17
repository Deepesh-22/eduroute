/** POST /api/auth/login/staff — MySQL bcrypt check (or Go proxy). */
const mysqlAuth = require('./_lib/mysqlAuth');
const { proxyToGo } = require('./_lib/goProxy');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return mysqlAuth.options();
  if (event.httpMethod !== 'POST') {
    return mysqlAuth.json(405, { success: false, error: 'Method not allowed' });
  }

  if (mysqlAuth.hasMysqlConfig() && mysqlAuth.depsReady()) {
    try {
      await mysqlAuth.ensureDefaultAdmin();
      const body = JSON.parse(event.body || '{}');
      return await mysqlAuth.login({
        email: body.email,
        password: body.password,
        role: 'admin',
      });
    } catch (err) {
      console.error('auth-login-staff mysql', err);
      return mysqlAuth.json(500, {
        success: false,
        error: err.message || 'Staff login failed',
      });
    }
  }

  return proxyToGo.forward(event, '/api/auth/login/staff');
};
