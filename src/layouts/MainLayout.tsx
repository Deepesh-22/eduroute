import { Outlet, Link, useLocation } from 'react-router-dom';
import { getAuthUser, clearAuthSession } from '../utils/rbacAuth';
import { getStoredUserProfile } from '../utils/userProfile';
import {
  LayoutDashboard,
  Map,
  ClipboardCheck,
  Sparkles,
  Trophy,
  Gift,
  Briefcase,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  GraduationCap,
  Shield,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { ThemeToggle } from '../components/ThemeToggle';

const NAVIGATION = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Roadmaps', path: '/roadmaps', icon: Map },
  { name: 'Assessments', path: '/assessments', icon: ClipboardCheck },
  { name: 'AI Buddy', path: '/buddy', icon: Sparkles },
  { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { name: 'Rewards', path: '/rewards', icon: Gift },
  { name: 'Internships', path: '/internships', icon: Briefcase },
  { name: 'Growth', path: '/events', icon: TrendingUp },
];

export const MainLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    clearAuthSession();
    setIsMobileMenuOpen(false);
    window.location.href = '/login';
  };

  const profileIdentity = useMemo(() => {
    const authUser = getAuthUser();
    const storedProfile = getStoredUserProfile();
    const name = authUser?.name || storedProfile?.name || 'Learner';
    const photo = storedProfile?.avatar || '';
    return {
      name,
      photo,
      initial: name.trim().charAt(0).toUpperCase() || 'L',
      role: authUser?.role === 'admin' ? 'Admin' : 'Learner',
    };
  }, []);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <aside
        className="hidden lg:flex flex-col border-r border-[var(--border-default)] bg-[var(--surface-sidebar)]"
        style={{ width: 'var(--sidebar-width)', minWidth: 'var(--sidebar-width)' }}
      >
        <div className="flex h-16 items-center gap-2.5 px-5 border-b border-[var(--border-default)]">
          <Link to="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-[var(--text-primary)] truncate">EDUROUTE</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAVIGATION.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path} className={`er-nav-item ${active ? 'active' : ''}`}>
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--border-default)] p-3 space-y-1">
          <Link to="/profile" className="flex items-center gap-3 rounded-[var(--radius-md)] px-2.5 py-2 hover:bg-[var(--surface-muted)] transition-colors">
            <div className="h-9 w-9 overflow-hidden rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-sm font-bold shrink-0">
              {profileIdentity.photo ? (
                <img src={profileIdentity.photo} alt="" className="h-full w-full object-cover" />
              ) : (
                profileIdentity.initial
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[var(--text-primary)] truncate">{profileIdentity.name}</div>
              <div className="text-[11px] text-[var(--text-muted)]">{profileIdentity.role}</div>
            </div>
          </Link>
          <Link to="/admin-login" className="er-nav-item text-xs">
            <Shield className="h-4 w-4" />
            Admin Panel
          </Link>
          <button type="button" onClick={handleLogout} className="er-nav-item w-full text-left">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header
          className="flex shrink-0 items-center gap-3 border-b border-[var(--border-default)] bg-[var(--surface-nav)] px-4 md:px-6"
          style={{ height: 'var(--topbar-height)' }}
        >
          <button
            type="button"
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative flex-1 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, topics, or skills..."
              className="er-input h-9 pl-9 pr-12 text-sm"
              aria-label="Search"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--border-default)] bg-[var(--surface-muted)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)] sm:inline">
              ⌘K
            </kbd>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--danger)]" />
            </button>
            <ThemeToggle className="h-9 w-[68px]" />
            <Link
              to="/profile"
              className="hidden sm:flex h-9 w-9 overflow-hidden rounded-full bg-[var(--accent)] text-white items-center justify-center text-sm font-bold border border-[var(--border-default)]"
              aria-label="Profile"
            >
              {profileIdentity.photo ? (
                <img src={profileIdentity.photo} alt="" className="h-full w-full object-cover" />
              ) : (
                profileIdentity.initial
              )}
            </Link>
            <div className="hidden md:block min-w-0">
              <div className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-[120px]">{profileIdentity.name}</div>
            </div>
          </div>
        </header>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} aria-hidden />
            <div className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col bg-[var(--surface-sidebar)] shadow-xl">
              <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--border-default)]">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <span className="font-bold">EDUROUTE</span>
                </div>
                <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)]" aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
                {NAVIGATION.map((item) => (
                  <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`er-nav-item ${isActive(item.path) ? 'active' : ''}`}>
                    <item.icon className="h-[18px] w-[18px]" />
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-[var(--border-default)] p-3 space-y-1">
                <Link to="/admin-login" onClick={() => setIsMobileMenuOpen(false)} className="er-nav-item">
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Link>
                <button type="button" onClick={handleLogout} className="er-nav-item w-full text-left">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
