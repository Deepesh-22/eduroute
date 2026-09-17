import { Outlet, Link, useLocation } from 'react-router-dom';
import { getAuthUser, clearAuthSession } from '../utils/rbacAuth';
import { getStoredUserProfile } from '../utils/userProfile';
import {
  LayoutDashboard,
  Map,
  ClipboardCheck,
  MessageSquare,
  Trophy,
  Gift,
  Briefcase,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Bell,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { ThemeToggle } from '../components/ThemeToggle';
import { FloatingBuddyWidget } from '../components/FloatingBuddyWidget';
import { GlobalSearch } from '../components/GlobalSearch';

const NAVIGATION = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Roadmaps', path: '/roadmaps', icon: Map },
  { name: 'Assessments', path: '/assessments', icon: ClipboardCheck },
  { name: 'AI Buddy', path: '/buddy', icon: MessageSquare },
  { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { name: 'Rewards', path: '/rewards', icon: Gift },
  { name: 'Internships', path: '/internships', icon: Briefcase },
  { name: 'Growth', path: '/events', icon: TrendingUp },
];

export const MainLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuthSession();
    setIsMobileMenuOpen(false);
    window.location.href = '/login';
  };

  const profileIdentity = useMemo(() => {
    const authUser = getAuthUser();
    const storedProfile = getStoredUserProfile();
    const name = authUser?.name || storedProfile?.name || 'Learner';
    const photo = storedProfile?.avatar || authUser?.avatar || '';
    return {
      name,
      photo,
      initial: name.trim().charAt(0).toUpperCase() || 'L',
      role: 'Learner',
    };
  }, []);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* ========== DESKTOP SIDEBAR ========== */}
      <aside className="er-sidebar hidden lg:flex shrink-0">
        <div className="flex items-center gap-3 px-5 py-5">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
              EDU<span className="text-[var(--accent)]">ROUTE</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {NAVIGATION.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`er-nav-item ${active ? 'active' : ''}`}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={active ? 2.25 : 1.75} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[var(--border-default)] p-3 space-y-1">
          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-[var(--accent-soft)] transition-colors"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--accent)] text-sm font-bold text-white">
              {profileIdentity.photo ? (
                <img src={profileIdentity.photo} alt="" className="h-full w-full object-cover" />
              ) : (
                profileIdentity.initial
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-[var(--text-primary)]">
                {profileIdentity.name}
              </div>
              <div className="text-xs text-[var(--text-muted)]">{profileIdentity.role}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
          </Link>

          <Link to="/admin-login" className="er-nav-item">
            <Shield className="h-[18px] w-[18px]" strokeWidth={1.75} />
            Admin Panel
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="er-nav-item w-full text-left hover:!bg-red-500/10 hover:!text-red-500"
          >
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
            Logout
          </button>
        </div>
      </aside>

      {/* ========== MAIN COLUMN ========== */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <header className="er-header shrink-0">
          <button
            type="button"
            className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-[var(--accent-soft)]"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Live global search — all authenticated pages via MainLayout */}
          <GlobalSearch variant="header" />

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--accent-soft)] text-[var(--text-secondary)]"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[var(--bg-sidebar)]" />
            </button>

            <ThemeToggle />

            <Link
              to="/profile"
              className="hidden sm:flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-card)] py-1 pl-1 pr-3 hover:border-[var(--accent)] transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[var(--accent)] text-xs font-bold text-white">
                {profileIdentity.photo ? (
                  <img src={profileIdentity.photo} alt="" className="h-full w-full object-cover" />
                ) : (
                  profileIdentity.initial
                )}
              </div>
              <span className="text-sm font-medium text-[var(--text-primary)] max-w-[100px] truncate">
                {profileIdentity.name.split(' ')[0]}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-[280px] bg-[var(--bg-sidebar)] shadow-2xl lg:hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-4">
              <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="font-bold">EDUROUTE</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-[var(--accent-soft)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-3 pb-2">
              <GlobalSearch variant="full" />
            </div>
            <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
              {NAVIGATION.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`er-nav-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="border-t border-[var(--border-default)] p-3 space-y-1">
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="er-nav-item">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
                  {profileIdentity.initial}
                </div>
                {profileIdentity.name}
              </Link>
              <Link to="/admin-login" onClick={() => setIsMobileMenuOpen(false)} className="er-nav-item">
                <Shield className="h-[18px] w-[18px]" />
                Admin Panel
              </Link>
              <button type="button" onClick={handleLogout} className="er-nav-item w-full text-left hover:!text-red-500">
                <LogOut className="h-[18px] w-[18px]" />
                Logout
              </button>
            </div>
          </aside>
        </>
      )}

      <FloatingBuddyWidget />
    </div>
  );
};

export default MainLayout;
