import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

import { apiRegisterUser } from '../../utils/authApi';
import { saveAuthSession } from '../../utils/rbacAuth';
import { parseGoogleCredential, saveUserProfile } from '../../utils/userProfile';
import { isAuthDbConfigError, localDemoRegister } from '../../utils/localDemoAuth';
import { ThemeToggle } from '../../components/ThemeToggle';

const GOOGLE_CLIENT_SCRIPT_ID = 'google-identity-services';
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignupForm = {
  name: string;
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof SignupForm, string>>;

const loadGoogleScript = () => {
  if (document.getElementById(GOOGLE_CLIENT_SCRIPT_ID)) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = GOOGLE_CLIENT_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load Google Identity Services script.'));
    document.head.appendChild(script);
  });
};

const validateForm = (formData: SignupForm): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.name.trim()) {
    errors.name = 'Full name is required.';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(formData.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!formData.password) {
    errors.password = 'Password is required.';
  } else if (formData.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return errors;
};

export const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupForm>({ name: '', email: '', password: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoHint, setDemoHint] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const googleClientId = useMemo(
    () =>
      import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ||
      '234757313390-8ihis6sl6h1635ievvaitfcjjndqv1je.apps.googleusercontent.com',
    [],
  );

  const goToCollegeIdUpload = () => {
    navigate('/verify-college', { replace: true });
  };

  useEffect(() => {
    if (!googleClientId) {
      setGoogleError('Google sign up is not configured yet.');
      return;
    }

    let isMounted = true;

    const setupGoogleButton = async () => {
      try {
        await loadGoogleScript();

        if (!isMounted || !window.google?.accounts?.id || !googleButtonRef.current) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: ({ credential }) => {
            if (!credential) {
              setGoogleError('Google sign up was canceled. Please try again.');
              return;
            }

            const googleProfile = parseGoogleCredential(credential);
            if (!googleProfile) {
              setGoogleError('Unable to read your Google profile. Please use email sign up.');
              return;
            }

            saveUserProfile(googleProfile);
            saveAuthSession(credential, {
              id: `google-${googleProfile.email}`,
              name: googleProfile.name,
              email: googleProfile.email,
              avatar: googleProfile.avatar,
              role: 'student',
              verificationStatus: 'pending',
            });
            goToCollegeIdUpload();
          },
        });

        googleButtonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: 'icon',
          size: 'large',
          shape: 'circle',
          theme: 'filled_black',
        });
      } catch (error) {
        console.error('[Signup] Google button setup failed:', error);
        if (isMounted) {
          setGoogleError('Unable to load Google sign up right now. Please use email sign up.');
        }
      }
    };

    setupGoogleButton();

    return () => {
      isMounted = false;
    };
  }, [googleClientId, navigate]);

  const handleInputChange = (field: keyof SignupForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    setApiError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setApiError(null);
    setDemoHint(false);

    const errors = validateForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    try {
      let token: string;
      let user: {
        id: string;
        name?: string;
        email?: string;
        verificationStatus?: string;
      };

      try {
        const registerResponse = await apiRegisterUser(payload);
        if (!registerResponse.token || !registerResponse.user) {
          throw new Error('Registration succeeded but no session was returned.');
        }
        token = registerResponse.token;
        user = registerResponse.user;
      } catch (apiErr) {
        const msg = apiErr instanceof Error ? apiErr.message : '';
        if (isAuthDbConfigError(msg)) {
          const demo = localDemoRegister(payload);
          token = demo.token;
          user = demo.user;
          setDemoHint(true);
        } else {
          throw apiErr;
        }
      }

      saveUserProfile({ name: payload.name, email: payload.email });
      saveAuthSession(token, {
        id: String(user.id),
        name: user.name || payload.name,
        email: user.email || payload.email,
        role: 'student',
        verificationStatus: user.verificationStatus || 'pending',
      });

      goToCollegeIdUpload();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Signup failed. Could not save account to database.';
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startGithub = () => {
    const clientId =
      import.meta.env.VITE_GITHUB_CLIENT_ID?.trim() ||
      import.meta.env.GITHUB_CLIENT_ID?.trim();
    if (!clientId) {
      setApiError('GitHub signup: add VITE_GITHUB_CLIENT_ID in Netlify env, then redeploy.');
      return;
    }
    const redirect = `${window.location.origin}/auth/github/callback`;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirect)}&scope=read:user%20user:email`;
  };

  const startLinkedIn = () => {
    const clientId =
      import.meta.env.VITE_LINKEDIN_CLIENT_ID?.trim() ||
      import.meta.env.LINKEDIN_CLIENT_ID?.trim();
    if (!clientId) {
      setApiError('LinkedIn signup: add VITE_LINKEDIN_CLIENT_ID in Netlify env, then redeploy.');
      return;
    }
    const redirect = `${window.location.origin}/auth/linkedin/callback`;
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirect)}&scope=${encodeURIComponent('openid profile email')}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-slate-950/85 to-violet-950/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent" />

      <div className="relative z-20 flex items-center justify-between px-6 py-5 md:px-10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-black shadow-lg shadow-violet-500/30">
            E
          </div>
          <span className="text-lg font-bold tracking-tight">EDUROUTE</span>
        </Link>
        <ThemeToggle className="!border-white/20" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl flex-col items-center gap-10 px-4 pb-12 pt-4 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-10">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden max-w-lg flex-1 lg:block"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/90">
            Your education · Your path · Your future
          </p>
          <h1 className="text-4xl font-black leading-tight md:text-5xl">
            Join{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              EduRoute
            </span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Create your account, verify your college ID, and start building skills, applying to
            internships, and tracking your career path.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { t: 'Jobs', d: 'Find your next opportunity' },
              { t: 'Internships', d: 'Gain real-world experience' },
              { t: 'Hackathons', d: 'Showcase your skills' },
              { t: 'Skill Development', d: 'Learn & grow with us' },
            ].map((item) => (
              <div
                key={item.t}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <div className="text-sm font-bold text-white">{item.t}</div>
                <div className="mt-1 text-xs text-slate-400">{item.d}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl border border-white/15 bg-slate-900/70 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-8">
            <div className="mb-6 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-black">
                E
              </div>
              <span className="text-lg font-bold">EDUROUTE</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight">Create account</h2>
            <p className="mt-1 text-sm text-slate-400">Start your learning journey today</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Full name</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 outline-none ring-violet-500/40 focus:ring-2"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                {formErrors.name ? (
                  <p className="mt-1 text-xs text-red-300">{formErrors.name}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 outline-none ring-violet-500/40 focus:ring-2"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                {formErrors.email ? (
                  <p className="mt-1 text-xs text-red-300">{formErrors.email}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min 8 characters"
                    className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-3 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 outline-none ring-violet-500/40 focus:ring-2"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formErrors.password ? (
                  <p className="mt-1 text-xs text-red-300">{formErrors.password}</p>
                ) : null}
              </div>

              {apiError ? (
                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{apiError}</p>
              ) : null}
              {demoHint ? (
                <p className="text-xs text-amber-300/90">
                  MySQL not configured — account saved in this browser (demo mode).
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition hover:from-violet-500 hover:to-indigo-400 disabled:opacity-60"
              >
                {isSubmitting ? 'Creating account…' : 'Sign Up'}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-slate-500">OR</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="flex items-center justify-center gap-3">
              <div ref={googleButtonRef} className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl" />
              <button
                type="button"
                title="Continue with GitHub"
                onClick={startGithub}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 transition hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.303-5.467-1.333-5.467-5.93 0-1.31.468-2.382 1.236-3.222-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.807 5.624-5.48 5.92.43.37.814 1.102.814 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.216.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </button>
              <button
                type="button"
                title="Continue with LinkedIn"
                onClick={startLinkedIn}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 text-sm font-bold text-[#0A66C2] transition hover:bg-white/10"
              >
                in
              </button>
              <button
                type="button"
                title="Focus email form"
                onClick={() => document.querySelector<HTMLInputElement>('input[type=email]')?.focus()}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 transition hover:bg-white/10"
              >
                <Mail className="h-4 w-4 text-slate-300" />
              </button>
            </div>
            {googleError ? (
              <p className="mt-3 text-center text-xs text-amber-200">{googleError}</p>
            ) : null}

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
