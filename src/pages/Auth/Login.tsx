import { useState } from 'react';
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
import { INDUSTRY_DEMO_CREDENTIALS } from '../../utils/industryStore';
import { FACULTY_DEMO_CREDENTIALS } from '../../utils/facultyStore';
import { COLLEGE_DEMO_CREDENTIALS } from '../../utils/placementDashboard';
import { ThemeToggle } from '../../components/ThemeToggle';

const LOCAL_STAFF = {
  email: 'admin@gmail.com',
  password: 'timepass',
  user: {
    id: 'local-admin-1',
    name: 'EduRoute Admin',
    email: 'admin@gmail.com',
    role: 'admin' as const,
    verificationStatus: 'verified',
  },
};

const ROLE_OPTIONS: { id: UserRole; label: string; icon: typeof GraduationCap }[] = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'faculty', label: 'Faculty', icon: BookOpen },
  { id: 'industry', label: 'Industry', icon: Briefcase },
  { id: 'college', label: 'College', icon: Building2 },
  { id: 'admin', label: 'Staff', icon: UserCog },
];

export const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [usedDemoMode, setUsedDemoMode] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const enterLocalAdmin = async (email: string, password: string) => {
    const emailOk = email.trim().toLowerCase() === LOCAL_STAFF.email;
    const passOk =
      password === LOCAL_STAFF.password || (await validateAdminPassword(password));
    if (!emailOk || !passOk) return false;
    saveAuthSession(`local-admin-${Date.now()}`, LOCAL_STAFF.user);
    setAdminSession(true);
    navigate('/admin/pending-approvals', { replace: true });
    return true;
  };

  const enterCollege = (email: string, password: string) => {
    const emailOk = email.trim().toLowerCase() === COLLEGE_DEMO_CREDENTIALS.email;
    const passOk = password === COLLEGE_DEMO_CREDENTIALS.password;
    if (!emailOk || !passOk) return false;
    saveAuthSession(`college-${Date.now()}`, COLLEGE_DEMO_CREDENTIALS.user);
    navigate('/college/placements', { replace: true });
    return true;
  };

  const enterIndustry = (email: string, password: string) => {
    const emailOk = email.trim().toLowerCase() === INDUSTRY_DEMO_CREDENTIALS.email;
    const passOk = password === INDUSTRY_DEMO_CREDENTIALS.password;
    if (!emailOk || !passOk) return false;
    saveAuthSession(`industry-${Date.now()}`, INDUSTRY_DEMO_CREDENTIALS.user);
    navigate('/industry', { replace: true });
    return true;
  };

  const enterFaculty = (email: string, password: string) => {
    const emailOk = email.trim().toLowerCase() === FACULTY_DEMO_CREDENTIALS.email;
    const passOk = password === FACULTY_DEMO_CREDENTIALS.password;
    if (!emailOk || !passOk) return false;
    saveAuthSession(`faculty-${Date.now()}`, FACULTY_DEMO_CREDENTIALS.user);
    navigate('/faculty', { replace: true });
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setUsedDemoMode(false);
    setIsLoading(true);

    try {
      if (role === 'faculty') {
        const ok = enterFaculty(formData.email, formData.password);
        if (ok) {
          setUsedDemoMode(true);
          return;
        }
        setError('Faculty login failed. Use faculty@gmail.com / faculty');
        return;
      }

      if (role === 'industry') {
        const ok = enterIndustry(formData.email, formData.password);
        if (ok) {
          setUsedDemoMode(true);
          return;
        }
        setError('Industry login failed. Use company@gmail.com / hire');
        return;
      }

      if (role === 'college') {
        if (enterCollege(formData.email, formData.password)) {
          setUsedDemoMode(true);
          return;
        }
        setError('College login failed. Use college@gmail.com / student');
        return;
      }

      if (role === 'admin') {
        try {
          const response = await apiRoleLogin({ ...formData, role: 'admin' });
          saveAuthSession(response.token, response.user);
          setAdminSession(true);
          navigate('/admin/pending-approvals', { replace: true });
          return;
        } catch (staffErr) {
          const ok = await enterLocalAdmin(formData.email, formData.password);
          if (ok) return;
          if (staffErr instanceof Error && isAuthDbConfigError(staffErr.message)) {
            try {
              const demo = localDemoLogin({
                email: formData.email,
                password: formData.password,
                role: 'admin',
              });
              saveAuthSession(demo.token, demo.user);
              setAdminSession(true);
              setUsedDemoMode(true);
              navigate('/admin/pending-approvals', { replace: true });
              return;
            } catch {
              /* fall through */
            }
          }
          setError(
            staffErr instanceof Error
              ? staffErr.message
              : 'Staff login failed. Check email and password.',
          );
          return;
        }
      }

      try {
        const response = await apiRoleLogin({ ...formData, role: 'student' });
        saveAuthSession(response.token, response.user);
        navigate('/dashboard', { replace: true });
      } catch (apiError) {
        const msg = apiError instanceof Error ? apiError.message : 'Login failed';
        if (isAuthDbConfigError(msg)) {
          try {
            const demo = localDemoLogin({
              email: formData.email,
              password: formData.password,
              role: 'student',
            });
            saveAuthSession(demo.token, demo.user);
            setUsedDemoMode(true);
            navigate('/dashboard', { replace: true });
            return;
          } catch (demoErr) {
            setError(
              demoErr instanceof Error
                ? `${demoErr.message}. Sign up first (demo mode — no MySQL configured).`
                : 'Invalid credentials. Sign up first if this is a new account.',
            );
            return;
          }
        }
        setError(msg);
      }
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRole = ROLE_OPTIONS.find((r) => r.id === role) || ROLE_OPTIONS[0];
  const SelectedIcon = selectedRole.icon;

  const startGithub = () => {
    const clientId =
      import.meta.env.VITE_GITHUB_CLIENT_ID?.trim() ||
      import.meta.env.GITHUB_CLIENT_ID?.trim();
    if (!clientId) {
      setError('GitHub login: add VITE_GITHUB_CLIENT_ID in Netlify env, then redeploy.');
      return;
    }
    const redirect = `${window.location.origin}/auth/github/callback`;
    const url = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirect)}&scope=read:user%20user:email`;
    window.location.href = url;
  };

  const startLinkedIn = () => {
    const clientId =
      import.meta.env.VITE_LINKEDIN_CLIENT_ID?.trim() ||
      import.meta.env.LINKEDIN_CLIENT_ID?.trim();
    if (!clientId) {
      setError('LinkedIn login: add VITE_LINKEDIN_CLIENT_ID in Netlify env, then redeploy.');
      return;
    }
    const redirect = `${window.location.origin}/auth/linkedin/callback`;
    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirect)}&scope=${encodeURIComponent('openid profile email')}`;
    window.location.href = url;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-slate-950/85 to-violet-950/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent" />

      {/* Top bar */}
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
        {/* Left marketing */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden max-w-lg flex-1 lg:block"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/90">
            Your education · Your path · Your future
          </p>
          <h1 className="text-4xl font-black leading-tight md:text-5xl">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              EduRoute
            </span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Explore opportunities, build skills, connect with your peers and take the next step
            towards your dream career.
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

        {/* Right glass card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl border border-white/15 bg-slate-900/70 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-8">
            <div className="mb-6 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-black">
                E
              </div>
              <span className="text-lg font-bold">EDUROUTE</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="mt-1 text-sm text-slate-400">Sign in to continue your journey</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Role select */}
              <div className="relative">
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Sign in as</label>
                <button
                  type="button"
                  onClick={() => setRoleOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-left text-sm font-medium text-white outline-none ring-violet-500/40 focus:ring-2"
                >
                  <span className="flex items-center gap-2">
                    <SelectedIcon className="h-4 w-4 text-violet-400" />
                    {selectedRole.label}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition ${roleOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {roleOpen && (
                  <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-xl">
                    {ROLE_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const active = role === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setRole(opt.id);
                            setRoleOpen(false);
                            setError('');
                            if (opt.id === 'industry') {
                              setFormData({ email: 'company@gmail.com', password: 'hire' });
                            } else if (opt.id === 'faculty') {
                              setFormData({ email: 'faculty@gmail.com', password: 'faculty' });
                            } else if (opt.id === 'college') {
                              setFormData({ email: 'college@gmail.com', password: 'student' });
                            } else if (opt.id === 'admin') {
                              setFormData({ email: 'admin@gmail.com', password: 'timepass' });
                            }
                          }}
                          className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition ${
                            active
                              ? 'bg-violet-600/30 text-violet-200'
                              : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {opt.label}
                          {active && <span className="ml-auto text-violet-300">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 outline-none ring-violet-500/40 focus:ring-2"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-400">Password</label>
                  <span className="cursor-default text-xs text-violet-400/80">Forgot password?</span>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-3 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 outline-none ring-violet-500/40 focus:ring-2"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>
              )}
              {usedDemoMode && (
                <p className="text-xs text-amber-300/90">Signed in with demo / offline mode.</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition hover:from-violet-500 hover:to-indigo-400 disabled:opacity-60"
              >
                {isLoading ? 'Signing in…' : 'Sign In'}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-slate-500">OR</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                title="Google (use Sign up for Google)"
                onClick={() => navigate('/signup')}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 text-sm font-bold text-white transition hover:bg-white/10"
              >
                G
              </button>
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
                title="Email sign up"
                onClick={() => navigate('/signup')}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 transition hover:bg-white/10"
              >
                <Mail className="h-4 w-4 text-slate-300" />
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-violet-400 hover:text-violet-300">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
