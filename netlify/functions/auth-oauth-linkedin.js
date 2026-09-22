/**
 * POST /api/auth/oauth/linkedin
 * Body: { code, redirect_uri, mode? }
 * Exchanges LinkedIn OAuth code for profile using server-side client secret.
 * When MySQL is configured, upserts user and returns real JWT (same as email register).
 */
const crypto = require('crypto');
const mysqlAuth = require('./_lib/mysqlAuth');

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function json(status, body) {
  return { statusCode: status, headers: cors, body: JSON.stringify(body) };
}

function clientId() {
  return (
    process.env.LINKEDIN_CLIENT_ID ||
    process.env.VITE_LINKEDIN_CLIENT_ID ||
    ''
  ).trim();
}

function clientSecret() {
  return (
    process.env.LINKEDIN_CLIENT_SECRET ||
    process.env.VITE_LINKEDIN_CLIENT_SECRET ||
    ''
  ).trim();
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return json(405, { success: false, error: 'Method not allowed' });
  }

  const id = clientId();
  const secret = clientSecret();
  if (!id || !secret) {
    return json(503, {
      success: false,
      error:
        'LinkedIn OAuth not configured. Set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET (or VITE_LINKEDIN_CLIENT_ID / VITE_LINKEDIN_CLIENT_SECRET) in Netlify env.',
    });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { success: false, error: 'Invalid JSON body' });
  }

  const code = (body.code || '').trim();
  const redirectUri = (body.redirect_uri || '').trim();
  const mode = body.mode === 'login' ? 'login' : 'signup';

  if (!code || !redirectUri) {
    return json(400, { success: false, error: 'code and redirect_uri are required' });
  }

  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: id,
      client_secret: secret,
    });
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error('linkedin token error', tokenData);
      return json(401, {
        success: false,
        error: tokenData.error_description || tokenData.error || 'LinkedIn token exchange failed',
      });
    }

    const accessToken = tokenData.access_token;
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!profileRes.ok) {
      const text = await profileRes.text();
      console.error('linkedin profile', text);
      return json(401, { success: false, error: 'Failed to load LinkedIn profile' });
    }
    const profile = await profileRes.json();

    const email = profile.email || `${profile.sub || 'user'}@linkedin.local`;
    const name =
      profile.name ||
      [profile.given_name, profile.family_name].filter(Boolean).join(' ') ||
      'LinkedIn User';
    const avatar = profile.picture || '';

    try {
      const dbResult = await mysqlAuth.upsertOAuthUser({
        name,
        email,
        avatar,
        mode,
        provider: 'linkedin',
      });
      if (dbResult && dbResult.success) {
        return json(200, dbResult);
      }
    } catch (dbErr) {
      console.warn('linkedin oauth mysql upsert failed, using session token', dbErr.message);
    }

    const sessionToken = `linkedin.${crypto.randomBytes(24).toString('hex')}`;
    return json(200, {
      success: true,
      token: sessionToken,
      user: {
        id: `linkedin-${profile.sub || email}`,
        name,
        email,
        avatar,
        role: 'student',
        verificationStatus: mode === 'signup' ? 'pending' : 'verified',
        provider: 'linkedin',
      },
    });
  } catch (err) {
    console.error('auth-oauth-linkedin', err);
    return json(500, {
      success: false,
      error: err.message || 'LinkedIn OAuth failed',
    });
  }
};
