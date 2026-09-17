/** POST /api/auth/login/student — MySQL bcrypt check (or Go proxy). */
const mysqlAuth = require('./_lib/mysqlAuth');
const { proxyToGo } = require('./_lib/goProxy');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return mysqlAuth.options();
  if (event.httpMethod !== 'POST') {
    return mysqlAuth.json(405, { success: false, error: 'Method not allowed' });
  }

  if (mysqlAuth.hasMysqlConfig() && !mysqlAuth.depsReady()) {
    return mysqlAuth.json(500, {
      success: false,
      error: 'Server missing mysql2/bcryptjs. Check Netlify function dependencies.',
    });
  }

  if (mysqlAuth.hasMysqlConfig() && mysqlAuth.depsReady()) {
    try {
      const body = JSON.parse(event.body || '{}');
      return await mysqlAuth.login({
        email: body.email,
        password: body.password,
        role: 'student',
      });
    } catch (err) {
      console.error('auth-login-student mysql', err);
      return mysqlAuth.json(500, {
        success: false,
        error: err.message || 'Login failed',
      });
    }
  }

  return proxyToGo.forward(event, '/api/auth/login/student');
};
