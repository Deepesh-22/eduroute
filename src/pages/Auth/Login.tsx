import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, UserCog, GraduationCap } from 'lucide-react';
import { apiRoleLogin } from '../../utils/authApi';
import { saveAuthSession, type UserRole } from '../../utils/rbacAuth';
import { setAdminSession, validateAdminPassword } from '../../utils/adminSession';

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

export const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (role === 'admin') {
        try {
          // Primary: MySQL staff login via Go API
          const response = await apiRoleLogin({ ...formData, role: 'admin' });
          saveAuthSession(response.token, response.user);
          setAdminSession(true);
          navigate('/admin/pending-approvals', { replace: true });
          return;
        } catch (staffErr) {
          // Fallback only for the known demo admin when API is down
          const ok = await enterLocalAdmin(formData.email, formData.password);
          if (ok) return;
          setError(
            staffErr instanceof Error
              ? staffErr.message
              : 'Staff login failed. Check email and password.',
          );
          return;
        }
      }

      // Student: always verify email + password against MySQL (no offline fake login)
      const response = await apiRoleLogin({ ...formData, role: 'student' });
      saveAuthSession(response.token, response.user);
      navigate('/dashboard', { replace: true });
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            E
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">EDUROUTE</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">Role based login</h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Passwords are verified against your MySQL account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100"
        >
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setRole('student');
                setError('');
              }}
              className={`rounded-lg py-2 text-sm font-bold transition ${
                role === 'student' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500'
              }`}
            >
              <GraduationCap className="h-4 w-4 inline mr-1" /> Student
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setError('');
              }}
              className={`rounded-lg py-2 text-sm font-bold transition ${
                role === 'admin' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500'
              }`}
            >
              <UserCog className="h-4 w-4 inline mr-1" /> Staff/Admin
            </button>
          </div>

          {error && (
            <p
              className="text-sm text-rose-700 mb-3 rounded-lg bg-rose-50 border border-rose-100 px-3 py-2 break-words max-h-24 overflow-y-auto"
              role="alert"
            >
              {error}
            </p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'} <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-500">
            New student?{' '}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-slate-400">
            Or open{' '}
            <Link to="/admin-login" className="text-indigo-600 font-semibold hover:underline">
              Admin password gate
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
