import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Flame,
  Star,
  Trophy,
  Play,
  Clock,
  BarChart2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { COURSES } from '../data/mockData';
import { Course } from '../types';
import { getCurrentUser, getDisplayFirstName } from '../utils/userProfile';
import { getAuthUser } from '../utils/rbacAuth';

export const Dashboard = () => {
  const currentUser = getCurrentUser();
  const firstName = getDisplayFirstName() || 'there';
  const authUser = getAuthUser();
  const verificationStatus = (authUser?.verificationStatus || '').toLowerCase();
  const needsCollegeVerify =
    !verificationStatus ||
    verificationStatus === 'pending' ||
    verificationStatus === 'none' ||
    verificationStatus === 'rejected';
  const enrolledCourses = COURSES.filter((c) => currentUser.enrolledCourses.includes(c.id)).slice(0, 2);
  const recommendedCourses = COURSES.filter((c) => !currentUser.enrolledCourses.includes(c.id)).slice(0, 4);

  const stats = [
    {
      label: 'Completed Courses',
      value: '12',
      delta: '+3 this month',
      deltaPositive: true,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Learning Streak',
      value: '7 days',
      delta: '+2',
      deltaPositive: true,
      icon: Flame,
      iconBg: 'bg-violet-100 dark:bg-violet-500/20',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      label: 'Total Points',
      value: '2,850',
      delta: '+320',
      deltaPositive: true,
      icon: Star,
      iconBg: 'bg-amber-100 dark:bg-amber-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Rank',
      value: '#12',
      delta: 'in your batch',
      deltaPositive: true,
      icon: Trophy,
      iconBg: 'bg-blue-100 dark:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
  ];

  return (
    <div className="er-page space-y-8">
      <section
        className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)]"
        style={{ background: 'var(--bg-banner)' }}
      >
        <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="max-w-xl">
            <p className="mb-1 text-sm font-medium text-[var(--text-secondary)]">
              <span className="mr-1">👋</span> Welcome back,
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-4xl">
              {firstName}! <span className="inline-block">👋</span>
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              You've completed 45% of your current path. Keep it up!
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div className="er-progress flex-1 max-w-xs">
                <div className="er-progress-bar" style={{ width: '45%' }} />
              </div>
              <span className="text-sm font-semibold text-[var(--text-secondary)]">45%</span>
            </div>
          </div>

          {needsCollegeVerify ? (
            <div className="flex shrink-0 items-center gap-4 rounded-[var(--radius-lg)] border border-amber-200 bg-amber-50/90 px-5 py-4 shadow-sm dark:border-amber-800/50 dark:bg-amber-950/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
                <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-300" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-amber-900 dark:text-amber-100">Verify College ID</div>
                <p className="text-xs text-amber-700 dark:text-amber-300/90">Upload ID to unlock discounts & student features</p>
              </div>
              <Link
                to="/verify-college"
                className="er-btn ml-2 shrink-0 !px-4 !py-2 text-xs !bg-amber-600 !text-white hover:!bg-amber-700"
              >
                Verify ID
              </Link>
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-3 rounded-[var(--radius-lg)] border border-emerald-200 bg-emerald-50/90 px-5 py-4 dark:border-emerald-800 dark:bg-emerald-950/40">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">College ID verified</span>
            </div>
          )}
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-40 dark:opacity-30"
          aria-hidden
        >
          <svg className="h-full w-full" viewBox="0 0 400 200" preserveAspectRatio="xMaxYMid slice" fill="none">
            <path
              d="M0 200 L80 120 L140 160 L220 60 L280 110 L340 40 L400 90 L400 200 Z"
              fill="url(#dashMountain)"
              opacity="0.35"
            />
            <defs>
              <linearGradient id="dashMountain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="er-card flex items-center gap-4 p-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.iconBg}`}>
              <s.icon className={`h-5 w-5 ${s.iconColor}`} />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-[var(--text-muted)]">{s.label}</div>
              <div className="text-lg font-bold text-[var(--text-primary)]">{s.value}</div>
              <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">{s.delta}</div>
            </div>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Continue Learning</h2>
          <Link to="/courses" className="text-sm font-semibold text-[var(--accent)] hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {enrolledCourses.map((course) => (
            <ContinueCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Recommended for You</h2>
          <Link to="/browse" className="text-sm font-semibold text-[var(--accent)] hover:underline">
            Explore
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DsaCard />
          {recommendedCourses.map((course, i) => (
            <RecommendCard key={course.id} course={course} badgeIndex={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

function ContinueCard({ course }: { course: Course }) {
  return (
    <Link
      to={course.link || `/course/${course.id}`}
      className="er-card er-card-hover group flex gap-4 overflow-hidden p-3 transition-all"
    >
      <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-xl bg-[var(--bg-secondary)]">
        <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition group-hover:opacity-100">
          <Play className="h-8 w-8 text-white" />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
          {course.category} · 40% done
        </div>
        <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-[var(--text-primary)]">{course.title}</h3>
        <div className="mt-3 h-1.5 w-full rounded-full bg-[var(--bg-secondary)]">
          <div className="h-full w-[40%] rounded-full bg-[var(--accent)]" />
        </div>
      </div>
    </Link>
  );
}

function DsaCard() {
  return (
    <Link to="/dsa-sheet" className="er-card er-card-hover group flex flex-col overflow-hidden transition-all">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-secondary)]">
        <img
          src="https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?q=80&w=1170&auto=format&fit=crop"
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="er-badge absolute left-3 top-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
          FREE
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-[var(--text-primary)]">DSA Beginner Sheet</h3>
        <p className="mt-1 line-clamp-2 text-xs text-[var(--text-secondary)]">
          Start your DSA journey with structured problems and guided practice.
        </p>
        <div className="mt-auto flex items-center justify-between pt-4 text-[11px] text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> 4 hours
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
            Open Sheet <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

const BADGES = [
  { label: 'FREE', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' },
  { label: 'BEGINNER', className: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' },
  { label: 'INTERMEDIATE', className: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300' },
  { label: 'POPULAR', className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' },
];

function RecommendCard({ course, badgeIndex }: { course: Course; badgeIndex: number }) {
  const badge = BADGES[badgeIndex % BADGES.length];
  const weeks = course.duration?.includes('hour')
    ? `${Math.max(4, Math.round(parseInt(course.duration) / 10) || 6)} weeks`
    : course.duration || '6 weeks';

  return (
    <Link
      to={course.link || `/course/${course.id}`}
      className="er-card er-card-hover group flex flex-col overflow-hidden transition-all"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-secondary)]">
        <img
          src={course.thumbnail}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className={`er-badge absolute left-3 top-3 ${badge.className}`}>{badge.label}</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-[var(--text-primary)]">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-[var(--text-secondary)]">{course.description}</p>
        <div className="mt-auto flex items-center justify-between pt-4 text-[11px] text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {weeks}
          </span>
          <span className="inline-flex items-center gap-1">
            <BarChart2 className="h-3.5 w-3.5" /> {course.level}
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] transition group-hover:bg-[var(--accent)] group-hover:text-white">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default Dashboard;
