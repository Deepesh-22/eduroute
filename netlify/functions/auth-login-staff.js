/** Proxies staff login → Go backend MySQL password check. */
const { proxyToGo } = require('./_lib/goProxy');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return proxyToGo.options();
  }
  if (event.httpMethod !== 'POST') {
    return proxyToGo.json(405, { success: false, error: 'Method not allowed' });
  }
  return proxyToGo.forward(event, '/api/auth/login/staff');
};
