/**
 * POST /api/auth/oauth/github
 * Body: { code, redirect_uri, mode? }
 * Exchanges GitHub OAuth code for profile using server-side client secret.
 */
const crypto = require('crypto');

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
    process.env.GITHUB_CLIENT_ID ||
    process.env.VITE_GITHUB_CLIENT_ID ||
    ''
  ).trim();
}

function clientSecret() {
  return (
    process.env.GITHUB_CLIENT_SECRET ||
    process.env.VITE_GITHUB_CLIENT_SECRET ||
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
        'GitHub OAuth not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET (or VITE_GITHUB_CLIENT_ID / VITE_GITHUB_CLIENT_SECRET) in Netlify env.',
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
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: id,
        client_secret: secret,
        code,
        redirect_uri: redirectUri,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error('github token error', tokenData);
      return json(401, {
        success: false,
        error: tokenData.error_description || tokenData.error || 'GitHub token exchange failed',
      });
    }

    const accessToken = tokenData.access_token;
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'EduRoute-App',
      },
    });
    if (!userRes.ok) {
      return json(401, { success: false, error: 'Failed to load GitHub profile' });
    }
    const ghUser = await userRes.json();

    let email = ghUser.email || '';
    if (!email) {
      const emailsRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'EduRoute-App',
        },
      });
      if (emailsRes.ok) {
        const emails = await emailsRes.json();
        const primary = Array.isArray(emails)
          ? emails.find((e) => e.primary && e.verified) || emails.find((e) => e.verified) || emails[0]
          : null;
        email = primary?.email || '';
      }
    }
    if (!email) {
      email = `${ghUser.login || ghUser.id}@users.noreply.github.com`;
    }

    const name = ghUser.name || ghUser.login || 'GitHub User';
    const avatar = ghUser.avatar_url || '';
    const sessionToken = `github.${crypto.randomBytes(24).toString('hex')}`;

    return json(200, {
      success: true,
      token: sessionToken,
      user: {
        id: `github-${ghUser.id}`,
        name,
        email,
        avatar,
        role: 'student',
        verificationStatus: mode === 'signup' ? 'pending' : 'verified',
        provider: 'github',
      },
    });
  } catch (err) {
    console.error('auth-oauth-github', err);
    return json(500, {
      success: false,
      error: err.message || 'GitHub OAuth failed',
    });
  }
};
