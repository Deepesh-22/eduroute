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
import { useTheme } from '../../contexts/ThemeContext';

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
  const { isDark } = useTheme();
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
        if (enterFaculty(formData.email, formData.password)) {
          setUsedDemoMode(true);
          return;
        }
        setError('Faculty login failed. Use faculty@gmail.com / faculty');
        return;
      }
      if (role === 'industry') {
        if (enterIndustry(formData.email, formData.password)) {
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
          if (await enterLocalAdmin(formData.email, formData.password)) return;
          if (staffErr instanceof Error && isAuthDbConfigError(staffErr.message)) {
            try {
              const demo = localDemoLogin({ email: formData.email, password: formData.password, role: 'admin' });
              saveAuthSession(demo.token, demo.user);
              setAdminSession(true);
              setUsedDemoMode(true);
              navigate('/admin/pending-approvals', { replace: true });
              return;
            } catch { /* fall */ }
          }
          setError(staffErr instanceof Error ? staffErr.message : 'Staff login failed.');
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
            const demo = localDemoLogin({ email: formData.email, password: formData.password, role: 'student' });
            saveAuthSession(demo.token, demo.user);
            setUsedDemoMode(true);
            navigate('/dashboard', { replace: true });
            return;
          } catch (demoErr) {
            setError(demoErr instanceof Error ? demoErr.message : 'Invalid credentials.');
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

  const fieldCls = isDark
    ? 'border-white/10 bg-slate-800/80 text-white'
    : 'border-slate-200 bg-white text-slate-900';
  const cardCls = isDark
    ? 'border-white/15 bg-slate-900/70 shadow-black/40'
    : 'border-slate-200 bg-white/95 shadow-slate-300/40';
  const muted = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`relative min-h-screen overflow-hidden ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'}`}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80')" }}
      />
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-indigo-950/90 via-slate-950/85 to-violet-950/80' : 'bg-gradient-to-br from-violet-100/92 via-white/90 to-indigo-100/85'}`} />

      <div className="relative z-20 flex items-center justify-between px-6 py-5 md:px-10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-black text-white shadow-lg shadow-violet-500/30">E</div>
          <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>EDUROUTE</span>
        </Link>
        <ThemeToggle className={isDark ? '!border-white/20' : '!border-slate-300'} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl flex-col items-center gap-10 px-4 pb-12 pt-4 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-10">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="hidden max-w-lg flex-1 lg:block">
          <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-violet-300/90' : 'text-violet-600'}`}>Your education · Your path · Your future</p>
          <h1 className={`text-4xl font-black leading-tight md:text-5xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Welcome to <span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">EduRoute</span>
          </h1>
          <p className={`mt-4 text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Explore opportunities, build skills, connect with your peers and take the next step towards your dream career.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[ { t: 'Jobs', d: 'Find your next opportunity' }, { t: 'Internships', d: 'Gain real-world experience' }, { t: 'Hackathons', d: 'Showcase your skills' }, { t: 'Skill Development', d: 'Learn & grow with us' } ].map((item) => (
              <div key={item.t} className={`rounded-2xl border p-4 backdrop-blur-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200/80 bg-white/70 shadow-sm'}`}>
                <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.t}</div>
                <div className={`mt-1 text-xs ${muted}`}>{item.d}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className={`rounded-3xl border p-7 shadow-2xl backdrop-blur-xl md:p-8 ${cardCls}`}>
            <div className="mb-6 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-black text-white">E</div>
              <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>EDUROUTE</span>
            </div>
            <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Welcome back!</h2>
            <p className={`mt-1 text-sm ${muted}`}>Sign in to continue your journey</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="relative">
                <label className={`mb-1.5 block text-xs font-medium ${muted}`}>Sign in as</label>
                <button type="button" onClick={() => setRoleOpen((o) => !o)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium outline-none ring-violet-500/40 focus:ring-2 ${fieldCls}`}>
                  <span className="flex items-center gap-2"><SelectedIcon className="h-4 w-4 text-violet-500" />{selectedRole.label}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition ${roleOpen ? 'rotate-180' : ''}`} />
                </button>
                {roleOpen && (
                  <div className={`absolute z-30 mt-1 w-full overflow-hidden rounded-xl border shadow-xl ${isDark ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                    {ROLE_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const active = role === opt.id;
                      return (
                        <button key={opt.id} type="button" onClick={() => {
                          setRole(opt.id); setRoleOpen(false); setError('');
                          if (opt.id === 'industry') setFormData({ email: 'company@gmail.com', password: 'hire' });
                          else if (opt.id === 'faculty') setFormData({ email: 'faculty@gmail.com', password: 'faculty' });
                          else if (opt.id === 'college') setFormData({ email: 'college@gmail.com', password: 'student' });
                          else if (opt.id === 'admin') setFormData({ email: 'admin@gmail.com', password: 'timepass' });
                        }} className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition ${active ? (isDark ? 'bg-violet-600/30 text-violet-200' : 'bg-violet-100 text-violet-800') : (isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50')}`}>
                          <Icon className="h-4 w-4" />{opt.label}{active && <span className="ml-auto">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className={`mb-1.5 block text-xs font-medium ${muted}`}>Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input type="email" required autoComplete="email" placeholder="you@example.com" className={`w-full rounded-xl border py-3 pl-10 pr-3 text-sm outline-none ring-violet-500/40 focus:ring-2 placeholder:text-slate-500 ${fieldCls}`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className={`block text-xs font-medium ${muted}`}>Password</label>
                  <span className="text-xs text-violet-500/80">Forgot password?</span>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input type={showPass ? 'text' : 'password'} required autoComplete="current-password" placeholder="••••••••" className={`w-full rounded-xl border py-3 pl-10 pr-10 text-sm outline-none ring-violet-500/40 focus:ring-2 placeholder:text-slate-500 ${fieldCls}`} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-label="Toggle password">{showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>

              {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>}
              {usedDemoMode && <p className="text-xs text-amber-500">Signed in with demo / offline mode.</p>}

              <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition hover:from-violet-500 hover:to-indigo-400 disabled:opacity-60">
                {isLoading ? 'Signing in…' : 'Sign In'}{!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className={`h-px flex-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
              <span className={`text-xs ${muted}`}>OR</span>
              <div className={`h-px flex-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
            </div>

            <div className="flex items-center justify-center gap-3">
              <button type="button" onClick={() => navigate('/signup')} className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold ${isDark ? 'border-white/10 bg-slate-800/80 text-white' : 'border-slate-200 bg-white text-slate-800'}`}>G</button>
              <button type="button" className={`flex h-11 w-11 items-center justify-center rounded-xl border ${isDark ? 'border-white/10 bg-slate-800/80' : 'border-slate-200 bg-white'}`} title="GitHub">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.303-5.467-1.333-5.467-5.93 0-1.31.468-2.382 1.236-3.222-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.807 5.624-5.48 5.92.43.37.814 1.102.814 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.216.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" /></svg>
              </button>
              <button type="button" className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold text-[#0A66C2] ${isDark ? 'border-white/10 bg-slate-800/80' : 'border-slate-200 bg-white'}`}>in</button>
              <button type="button" onClick={() => navigate('/signup')} className={`flex h-11 w-11 items-center justify-center rounded-xl border ${isDark ? 'border-white/10 bg-slate-800/80' : 'border-slate-200 bg-white'}`}><Mail className="h-4 w-4 text-slate-500" /></button>
            </div>

            <p className={`mt-6 text-center text-sm ${muted}`}>
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-violet-500 hover:text-violet-400">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
