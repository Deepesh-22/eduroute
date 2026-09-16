import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, UserCog, GraduationCap } from 'lucide-react';
import { apiRoleLogin } from '../../utils/authApi';
import { saveAuthSession, type UserRole } from '../../utils/rbacAuth';

export const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiRoleLogin({ ...formData, role });
      saveAuthSession(response.token, response.user);
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2.5">
          <div className="h-11 w-11 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">EDUROUTE</span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
          Choose your role and continue learning
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="er-card py-8 px-5 sm:px-8"
        >
          <div className="grid grid-cols-2 gap-1 rounded-[var(--radius-md)] bg-[var(--surface-muted)] p-1 mb-5">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                role === 'student'
                  ? 'bg-[var(--surface-card)] text-[var(--accent-text)] shadow-sm'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <GraduationCap className="h-4 w-4 inline mr-1" /> Student
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                role === 'admin'
                  ? 'bg-[var(--surface-card)] text-[var(--accent-text)] shadow-sm'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <UserCog className="h-4 w-4 inline mr-1" /> Staff/Admin
            </button>
          </div>

          {role === 'admin' && (
            <p className="text-xs text-[var(--text-muted)] mb-3">Use staff credentials provided by admin setup.</p>
          )}
          {error && (
            <p className="text-sm mb-3 rounded-lg px-3 py-2" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>
              {error}
            </p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  required
                  className="er-input pl-10"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type="password"
                  required
                  className="er-input pl-10"
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                />
              </div>
            </div>

            <button disabled={isLoading} type="submit" className="er-btn er-btn-primary w-full h-11">
              {isLoading ? 'Signing in...' : 'Sign in'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <Link to="/signup" className="er-link">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
