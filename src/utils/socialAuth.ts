/**
 * Social auth helpers for GitHub / LinkedIn.
 * - If VITE_GITHUB_CLIENT_ID / VITE_LINKEDIN_CLIENT_ID are set, starts real OAuth redirect.
 * - Otherwise creates a local demo session so the buttons still work for SIH/demo.
 */

import { saveAuthSession, type AuthUser } from './rbacAuth';
import { saveUserProfile } from './userProfile';

export type SocialProvider = 'github' | 'linkedin';

const PROVIDER_LABEL: Record<SocialProvider, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
};

function redirectUri(provider: SocialProvider): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/auth/callback/${provider}`;
}

/** Start GitHub OAuth if client id is configured. Returns true if redirected. */
export function tryStartGitHubOAuth(): boolean {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID?.trim();
  if (!clientId || typeof window === 'undefined') return false;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri('github'),
    scope: 'read:user user:email',
    state: `gh-${Date.now()}`,
  });
  window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  return true;
}

/** Start LinkedIn OAuth if client id is configured. Returns true if redirected. */
export function tryStartLinkedInOAuth(): boolean {
  const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID?.trim();
  if (!clientId || typeof window === 'undefined') return false;
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri('linkedin'),
    scope: 'openid profile email',
    state: `li-${Date.now()}`,
  });
  window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  return true;
}

/**
 * Demo / offline social session (no backend OAuth secrets required).
 * Saves a stable student session so signup → verify-college and login → dashboard work.
 */
export function completeSocialDemo(
  provider: SocialProvider,
  mode: 'signup' | 'login',
): { user: AuthUser; message: string } {
  const label = PROVIDER_LABEL[provider];
  const email = `${provider}.user@eduroute.local`;
  const name = mode === 'signup' ? `${label} Learner` : `${label} User`;
  const user: AuthUser = {
    id: `${provider}-demo-user`,
    name,
    email,
    role: 'student',
    verificationStatus: mode === 'signup' ? 'pending' : 'verified',
  };
  const token = `${provider}-demo-${Date.now()}`;
  saveUserProfile({ name, email });
  saveAuthSession(token, user);
  return {
    user,
    message: `${label} ${mode === 'signup' ? 'sign-up' : 'sign-in'} (demo mode). Add VITE_${provider.toUpperCase()}_CLIENT_ID for real OAuth.`,
  };
}

/** Click handler used by Login + Signup social buttons. */
export function handleSocialAuth(
  provider: SocialProvider,
  mode: 'signup' | 'login',
  onDemo: (message: string) => void,
): void {
  if (provider === 'github' && tryStartGitHubOAuth()) return;
  if (provider === 'linkedin' && tryStartLinkedInOAuth()) return;
  const { message } = completeSocialDemo(provider, mode);
  onDemo(message);
}
