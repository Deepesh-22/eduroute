/**
 * Proxies POST /api/auth/register → Go backend (MySQL bcrypt insert).
 * Set GO_API_URL in Netlify env, e.g. https://your-go-api.example.com
 */
const { proxyToGo } = require('./_lib/goProxy');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return proxyToGo.options();
  }
  if (event.httpMethod !== 'POST') {
    return proxyToGo.json(405, { success: false, error: 'Method not allowed' });
  }
  return proxyToGo.forward(event, '/api/auth/register');
};
