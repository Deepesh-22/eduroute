import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock,
  Mail,
  ArrowRight,
  GraduationCap,
  Building2,
  BookOpen,
  UserCog,
  Briefcase,
  Eye,
  EyeOff,
  ChevronDown,
} from 'lucide-react';

import { apiRoleLogin } from '../../utils/authApi';
import { saveAuthSession, type UserRole } from '../../utils/rbacAuth';
import { setAdminSession, validateAdminPassword } from '../../utils/adminSession';
import { isAuthDbConfigError, localDemoLogin } from '../../utils/localDemoAuth';
import { handleSocialAuth } from '../../utils/socialAuth';
import { INDUSTRY_DEMO_CREDENTIALS } from '../../utils/industryStore';
import { FACULTY_DEMO_CREDENTIALS } from '../../utils/facultyStore';
import { COLLEGE_DEMO_CREDENTIALS } from '../../utils/placementDashboard';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';

type LoginRole = UserRole;

const ROLE_OPTIONS: { value: LoginRole; label: string; Icon: typeof GraduationCap }[] = [
  { value: 'student', label: 'Student', Icon: GraduationCap },
  { value: 'faculty', label: 'Faculty', Icon: BookOpen },
  { value: 'industry', label: 'Industry', Icon: Briefcase },
  { value: 'college', label: 'College', Icon: Building2 },
  { value: 'admin', label: 'Admin', Icon: UserCog },
];

export const Login = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [role, setRole] = useState<LoginRole>('student');
  const [roleOpen, setRoleOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socialMsg, setSocialMsg] = useState<string | null>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const selected = ROLE_OPTIONS.find((r) => r.value === role) || ROLE_OPTIONS[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const goHome = (userRole: LoginRole) => {
    if (userRole === 'admin') navigate('/admin', { replace: true });
    else if (userRole === 'industry') navigate('/industry', { replace: true });
    else if (userRole === 'college') navigate('/college/placements', { replace: true });
    else if (userRole === 'faculty') navigate('/faculty', { replace: true });
    else navigate('/dashboard', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (role === 'industry') {
        const ok =
          formData.email.trim().toLowerCase() === INDUSTRY_DEMO_CREDENTIALS.email.toLowerCase() &&
          formData.password === INDUSTRY_DEMO_CREDENTIALS.password;
        if (!ok) {
          setError('Use industry demo credentials.');
          return;
        }
        saveAuthSession(`demo-industry-${Date.now()}`, {
          id: 'industry-demo',
          name: 'Industry Partner',
          email: formData.email.trim(),
          role: 'industry',
          verificationStatus: 'verified',
        });
        goHome('industry');
        return;
      }
      if (role === 'faculty') {
        const ok =
          formData.email.trim().toLowerCase() === FACULTY_DEMO_CREDENTIALS.email.toLowerCase() &&
          formData.password === FACULTY_DEMO_CREDENTIALS.password;
        if (!ok) {
          setError('Use faculty demo credentials.');
          return;
        }
        saveAuthSession(`demo-faculty-${Date.now()}`, {
          id: 'faculty-demo',
          name: 'Faculty Member',
          email: formData.email.trim(),
          role: 'faculty',
          verificationStatus: 'verified',
        });
        goHome('faculty');
        return;
      }
      if (role === 'college') {
        const ok =
          formData.email.trim().toLowerCase() === COLLEGE_DEMO_CREDENTIALS.email.toLowerCase() &&
          formData.password === COLLEGE_DEMO_CREDENTIALS.password;
        if (!ok) {
          setError('Use college demo credentials.');
          return;
        }
        saveAuthSession(`demo-college-${Date.now()}`, {
          id: 'college-demo',
          name: 'College Admin',
          email: formData.email.trim(),
          role: 'college',
          verificationStatus: 'verified',
          institutionName: 'Modi Institute of Technology',
        });
        goHome('college');
        return;
      }

      if (role === 'admin') {
        if ((await validateAdminPassword(formData.password)) && formData.email.includes('admin')) {
          setAdminSession(true);
          try {
            const demo = localDemoLogin({
              email: formData.email,
              password: formData.password,
              role: 'admin',
            });
            saveAuthSession(demo.token, demo.user);
          } catch {
            saveAuthSession(`admin-local-${Date.now()}`, {
              id: 'admin-1',
              name: 'EduRoute Admin',
              email: formData.email,
              role: 'admin',
              verificationStatus: 'verified',
            });
          }
          goHome('admin');
          return;
        }
      }

      try {
        const result = await apiRoleLogin({
          email: formData.email.trim(),
          password: formData.password,
          role: role === 'admin' ? 'admin' : 'student',
        });
        if (result.success && result.token && result.user) {
          saveAuthSession(result.token, {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            avatar: result.user.avatar,
            role: (result.user.role as UserRole) || role,
            verificationStatus: result.user.verificationStatus || 'verified',
          });
          goHome((result.user.role as UserRole) || role);
          return;
        }
        if (isAuthDbConfigError(result.error)) {
          try {
            const demo = localDemoLogin({
              email: formData.email,
              password: formData.password,
              role: role === 'admin' ? 'admin' : 'student',
            });
            saveAuthSession(demo.token, demo.user);
            goHome(demo.user.role as UserRole);
            return;
          } catch (demoErr) {
            setError(demoErr instanceof Error ? demoErr.message : 'Login failed');
            return;
          }
        }
        setError(result.error || 'Login failed');
      } catch (err) {
        if (isAuthDbConfigError(err instanceof Error ? err.message : '')) {
          try {
            const demo = localDemoLogin({
              email: formData.email,
              password: formData.password,
              role: role === 'admin' ? 'admin' : 'student',
            });
            saveAuthSession(demo.token, demo.user);
            goHome(demo.user.role as UserRole);
            return;
          } catch (demoErr) {
            setError(demoErr instanceof Error ? demoErr.message : 'Login failed');
            return;
          }
        }
        setError(err instanceof Error ? err.message : 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const cardCls = isDark
    ? 'border-white/15 bg-slate-900/95 text-white shadow-2xl shadow-violet-950/40'
    : 'border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-200/80';
  const inputCls = isDark
    ? 'border-white/10 bg-slate-800/80 text-white placeholder:text-slate-500 focus:border-violet-500'
    : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-violet-500';
  const muted = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div
      className={`relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 ${
        isDark
          ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white'
          : 'bg-gradient-to-br from-slate-100 via-violet-50 to-indigo-100 text-slate-900'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle className={isDark ? '!border-white/20' : '!border-slate-300'} />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl items-center justify-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden max-w-lg flex-1 lg:block"
        >
          <h1 className="text-4xl font-black tracking-tight">Welcome back</h1>
          <p className={`mt-3 text-base ${muted}`}>
            Sign in to continue your skill journey, internships, and placement path on EDUROUTE.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-md rounded-3xl border p-6 sm:p-8 ${cardCls}`}
        >
          <div className="mb-6 flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-black text-white">
              E
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight">EDUROUTE</div>
              <div className={`text-xs ${muted}`}>Sign in to continue</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div ref={roleRef} className="relative">
              <label className={`mb-1.5 block text-xs font-semibold ${muted}`}>I am a</label>
              <button
                type="button"
                onClick={() => setRoleOpen((v) => !v)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30 ${inputCls}`}
              >
                <span className="flex items-center gap-2">
                  <selected.Icon className="h-4 w-4 text-violet-500" />
                  <span className="font-semibold">{selected.label}</span>
                </span>
                <ChevronDown className={`h-4 w-4 transition ${roleOpen ? 'rotate-180' : ''} ${muted}`} />
              </button>
              {roleOpen && (
                <div
                  className={`absolute z-30 mt-1 w-full overflow-hidden rounded-xl border shadow-xl ${
                    isDark ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'
                  }`}
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setRole(opt.value);
                        setRoleOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-violet-500/10 ${
                        role === opt.value ? 'bg-violet-500/15' : ''
                      }`}
                    >
                      <opt.Icon className="h-4 w-4 text-violet-500" />
                      <span className="font-semibold">{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className={`mb-1.5 block text-xs font-semibold ${muted}`}>Email</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${muted}`} />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@college.edu"
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30 ${inputCls}`}
                />
              </div>
            </div>

            <div>
              <label className={`mb-1.5 block text-xs font-semibold ${muted}`}>Password</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${muted}`} />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30 ${inputCls}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${muted}`}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="relative my-6">
            <div className={`absolute inset-0 flex items-center`}>
              <div className={`w-full border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className={`px-3 ${isDark ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'}`}>
                or continue with
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold transition hover:scale-105 ${isDark ? 'border-white/10 bg-slate-800/80 text-white' : 'border-slate-200 bg-white text-slate-800'}`}
              title="Google sign-in via Sign up page"
              aria-label="Google"
            >
              G
            </button>
            <button
              type="button"
              onClick={() =>
                handleSocialAuth('github', 'login', (msg) => {
                  setSocialMsg(msg);
                })
              }
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition hover:scale-105 ${isDark ? 'border-white/10 bg-slate-800/80 text-white' : 'border-slate-200 bg-white text-slate-900'}`}
              title="Sign in with GitHub"
              aria-label="Sign in with GitHub"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.303-5.467-1.333-5.467-5.93 0-1.31.468-2.382 1.236-3.222-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.807 5.624-5.48 5.92.43.37.814 1.102.814 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.216.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() =>
                handleSocialAuth('linkedin', 'login', (msg) => {
                  setSocialMsg(msg);
                })
              }
              className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold text-[#0A66C2] transition hover:scale-105 ${isDark ? 'border-white/10 bg-slate-800/80' : 'border-slate-200 bg-white'}`}
              title="Sign in with LinkedIn"
              aria-label="Sign in with LinkedIn"
            >
              in
            </button>
            <button
              type="button"
              onClick={() => document.querySelector<HTMLInputElement>('input[type="email"]')?.focus()}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition hover:scale-105 ${isDark ? 'border-white/10 bg-slate-800/80' : 'border-slate-200 bg-white'}`}
              title="Sign in with email"
              aria-label="Sign in with email"
            >
              <Mail className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          {socialMsg && <p className="mt-3 text-center text-xs text-amber-500">{socialMsg}</p>}

          <p className={`mt-6 text-center text-sm ${muted}`}>
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-semibold text-violet-500 hover:text-violet-400">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
