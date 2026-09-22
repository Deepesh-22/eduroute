import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  clearOAuthState,
  exchangeOAuthCode,
  readOAuthState,
  type SocialProvider,
} from '../../utils/socialAuth';
import { saveAuthSession } from '../../utils/rbacAuth';
import { saveUserProfile } from '../../utils/userProfile';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';

export const AuthCallback = () => {
  const { provider: providerParam } = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [status, setStatus] = useState('Completing sign-in…');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const provider = (providerParam === 'linkedin' ? 'linkedin' : 'github') as SocialProvider;
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const oauthError = searchParams.get('error');
      const oauthErrorDesc = searchParams.get('error_description');

      if (oauthError) {
        setError(oauthErrorDesc || oauthError || 'Authorization was denied.');
        setStatus('Sign-in cancelled');
        return;
      }
      if (!code) {
        setError('Missing authorization code. Please try again from Login or Sign up.');
        setStatus('Failed');
        return;
      }

      const stored = readOAuthState();
      const mode =
        stored?.mode === 'login' || (state || '').includes('.login.')
          ? 'login'
          : 'signup';

      setStatus(`Verifying ${provider === 'github' ? 'GitHub' : 'LinkedIn'} account…`);
      const result = await exchangeOAuthCode(provider, code, mode);
      clearOAuthState();

      if (!result.success || !result.token || !result.user) {
        setError(result.error || 'OAuth failed. Check Netlify client id/secret and redirect URIs.');
        setStatus('Failed');
        return;
      }

      saveUserProfile({
        name: result.user.name,
        email: result.user.email,
        avatar: result.user.avatar,
      });
      saveAuthSession(result.token, {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        avatar: result.user.avatar,
        role: 'student',
        verificationStatus:
          result.user.verificationStatus || (mode === 'signup' ? 'pending' : 'verified'),
      });

      setStatus('Success! Redirecting…');
      if (mode === 'signup') {
        navigate('/verify-college', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    };
    void run();
  }, [providerParam, searchParams, navigate]);

  const cardCls = isDark
    ? 'border-white/15 bg-slate-900/95 text-white'
    : 'border-slate-200 bg-white text-slate-900';
  const muted = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div
      className={`relative flex min-h-screen flex-col items-center justify-center px-4 ${
        isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'
      }`}
    >
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <div className={`w-full max-w-md rounded-3xl border p-8 shadow-xl ${cardCls}`}>
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-black text-white">
            E
          </div>
          <span className="text-lg font-bold">EDUROUTE</span>
        </div>
        <h1 className="text-xl font-bold">{status}</h1>
        {error ? (
          <>
            <p className="mt-3 text-sm text-red-400">{error}</p>
            <p className={`mt-2 text-xs ${muted}`}>
              Ensure redirect URIs in GitHub/LinkedIn apps include{' '}
              <code className="rounded bg-black/20 px-1">
                {typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback/github
              </code>{' '}
              and <code className="rounded bg-black/20 px-1">…/linkedin</code>, and secrets are set in
              Netlify (GITHUB_CLIENT_SECRET / LINKEDIN_CLIENT_SECRET).
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/login" className="text-sm font-semibold text-violet-500 hover:underline">
                Back to Login
              </Link>
              <Link to="/signup" className="text-sm font-semibold text-violet-500 hover:underline">
                Sign up
              </Link>
            </div>
          </>
        ) : (
          <p className={`mt-2 text-sm ${muted}`}>Please wait — do not close this window.</p>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
