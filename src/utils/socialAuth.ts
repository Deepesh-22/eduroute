/**
 * Real GitHub / LinkedIn OAuth (frontend starts authorize; Netlify functions exchange code).
 * Requires:
 * - VITE_GITHUB_CLIENT_ID + GITHUB_CLIENT_SECRET (or VITE_GITHUB_CLIENT_SECRET)
 * - VITE_LINKEDIN_CLIENT_ID + LINKEDIN_CLIENT_SECRET (or VITE_LINKEDIN_CLIENT_SECRET)
 * Redirect URIs in provider apps must match: {origin}/auth/callback/github|linkedin
 */

export type SocialProvider = 'github' | 'linkedin';
export type SocialMode = 'signup' | 'login';

const STATE_KEY = 'eduroute:oauth-state';

export function getGithubClientId(): string {
  return (import.meta.env.VITE_GITHUB_CLIENT_ID || '').trim();
}

export function getLinkedInClientId(): string {
  return (import.meta.env.VITE_LINKEDIN_CLIENT_ID || '').trim();
}

export function oauthRedirectUri(provider: SocialProvider): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/auth/callback/${provider}`;
}

function saveOAuthState(provider: SocialProvider, mode: SocialMode): string {
  const state = `${provider}.${mode}.${Date.now()}.${Math.random().toString(36).slice(2, 10)}`;
  try {
    sessionStorage.setItem(STATE_KEY, JSON.stringify({ state, provider, mode, ts: Date.now() }));
  } catch {
    /* ignore */
  }
  return state;
}

export function readOAuthState(): { state: string; provider: SocialProvider; mode: SocialMode } | null {
  try {
    const raw = sessionStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.state || !parsed?.provider) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearOAuthState(): void {
  try {
    sessionStorage.removeItem(STATE_KEY);
  } catch {
    /* ignore */
  }
}

/** Redirect browser to GitHub authorize. Returns false if client id missing. */
export function startGitHubOAuth(mode: SocialMode): boolean {
  const clientId = getGithubClientId();
  if (!clientId || typeof window === 'undefined') return false;
  const state = saveOAuthState('github', mode);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: oauthRedirectUri('github'),
    scope: 'read:user user:email',
    state,
    allow_signup: 'true',
  });
  window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  return true;
}

/** Redirect browser to LinkedIn authorize. Returns false if client id missing. */
export function startLinkedInOAuth(mode: SocialMode): boolean {
  const clientId = getLinkedInClientId();
  if (!clientId || typeof window === 'undefined') return false;
  const state = saveOAuthState('linkedin', mode);
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: oauthRedirectUri('linkedin'),
    scope: 'openid profile email',
    state,
  });
  window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  return true;
}

/**
 * Click handler for Login + Signup social buttons.
 * Always attempts real OAuth when client id is set; otherwise reports error via onError.
 */
export function handleSocialAuth(
  provider: SocialProvider,
  mode: SocialMode,
  onError: (message: string) => void,
): void {
  if (provider === 'github') {
    if (startGitHubOAuth(mode)) return;
    onError(
      'GitHub sign-in is not configured. Add VITE_GITHUB_CLIENT_ID in Netlify (and GITHUB_CLIENT_SECRET for the API).',
    );
    return;
  }
  if (provider === 'linkedin') {
    if (startLinkedInOAuth(mode)) return;
    onError(
      'LinkedIn sign-in is not configured. Add VITE_LINKEDIN_CLIENT_ID in Netlify (and LINKEDIN_CLIENT_SECRET for the API).',
    );
    return;
  }
  onError('Unknown provider');
}

export type OAuthExchangeResult = {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    verificationStatus?: string;
    provider?: string;
  };
  error?: string;
};

/** Exchange authorization code via Netlify function. */
export async function exchangeOAuthCode(
  provider: SocialProvider,
  code: string,
  mode: SocialMode,
): Promise<OAuthExchangeResult> {
  const redirect_uri = oauthRedirectUri(provider);
  const path =
    provider === 'github' ? '/api/auth/oauth/github' : '/api/auth/oauth/linkedin';
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri, mode }),
    });
    const data = (await res.json().catch(() => ({}))) as OAuthExchangeResult;
    if (!res.ok) {
      return {
        success: false,
        error: data.error || `OAuth failed (${res.status})`,
      };
    }
    return data;
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error during OAuth',
    };
  }
}
