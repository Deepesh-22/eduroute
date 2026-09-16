import { Link } from 'react-router-dom';
import {
  Play,
  Clock,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Flame,
  Star,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import { COURSES } from '../data/mockData';
import { Course } from '../types';
import { getCurrentUser, getDisplayFirstName } from '../utils/userProfile';

const PATH_PROGRESS = 45;

function courseProgress(course: Course): number {
  const lessons = course.modules?.flatMap((m) => m.lessons) ?? [];
  if (!lessons.length) return 40;
  const done = lessons.filter((l) => l.completed).length;
  return Math.round((done / lessons.length) * 100) || 40;
}

export const Dashboard = () => {
  const currentUser = getCurrentUser();
  const firstName = getDisplayFirstName();
  const enrolledCourses = COURSES.filter((c) => currentUser.enrolledCourses.includes(c.id));
  const recommendedCourses = COURSES.filter((c) => !currentUser.enrolledCourses.includes(c.id)).slice(0, 4);

  const stats = [
    {
      label: 'Completed Courses',
      value: String(Math.max(0, currentUser.completedLessons.length)),
      delta: '+3 this month',
      icon: BookOpen,
      iconBg: 'var(--success-soft)',
      iconColor: 'var(--success)',
    },
    {
      label: 'Learning Streak',
      value: '7 days',
      delta: '+2',
      icon: Flame,
      iconBg: 'var(--purple-soft)',
      iconColor: 'var(--purple)',
    },
    {
      label: 'Total Points',
      value: currentUser.points.toLocaleString(),
      delta: '+320',
      icon: Star,
      iconBg: 'var(--gold-soft)',
      iconColor: 'var(--gold)',
    },
    {
      label: 'Rank',
      value: `#${currentUser.rank === 'Gold' ? '12' : '24'}`,
      delta: 'in your batch',
      icon: Trophy,
      iconBg: 'var(--info-soft)',
      iconColor: 'var(--info)',
    },
  ];

  const recMeta = [
    { badge: 'FREE', badgeClass: 'bg-[var(--success-soft)] text-[var(--success)]', weeks: '8 weeks', level: 'Intermediate' },
    { badge: 'BEGINNER', badgeClass: 'bg-[var(--info-soft)] text-[var(--info)]', weeks: '6 weeks', level: 'Beginner' },
    { badge: 'INTERMEDIATE', badgeClass: 'bg-[var(--purple-soft)] text-[var(--purple)]', weeks: '5 weeks', level: 'Intermediate' },
    { badge: 'POPULAR', badgeClass: 'bg-[var(--warning-soft)] text-[var(--warning)]', weeks: '6 weeks', level: 'Intermediate' },
  ];

  return (
    <div className="er-page space-y-6 md:space-y-8">
      <section className="er-card relative overflow-hidden p-5 md:p-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              'linear-gradient(105deg, rgba(99,102,241,0.18) 0%, transparent 45%), linear-gradient(to right, transparent 50%, rgba(139,92,246,0.12) 100%)',
          }}
        />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Welcome back,{' '}
              <span className="text-[var(--text-primary)] font-semibold">{firstName}!</span>
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Keep building your path
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-lg">
              You&apos;ve completed {PATH_PROGRESS}% of your current path. Keep it up!
            </p>
            <div className="mt-4 max-w-md">
              <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                <span className="text-[var(--text-muted)]">Path progress</span>
                <span className="text-[var(--accent-text)]">{PATH_PROGRESS}%</span>
              </div>
              <div className="er-progress">
                <span style={{ width: `${PATH_PROGRESS}%` }} />
              </div>
            </div>
          </div>

          <Link
            to="/verify-college"
            className="relative shrink-0 flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-card)] px-4 py-3.5 shadow-[var(--shadow-sm)] hover:border-[var(--border-strong)] transition-colors max-w-sm"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[var(--text-primary)]">Verify College ID</div>
              <p className="text-xs text-[var(--text-secondary)]">Unlock 50% discount on certifications</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="er-card p-4 md:p-5">
            <div className="flex items-start justify-between gap-2">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: s.iconBg, color: s.iconColor }}
              >
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 text-xs font-medium text-[var(--text-muted)]">{s.label}</div>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)]">{s.value}</span>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[var(--success)]">
                <TrendingUp className="h-3 w-3" />
                {s.delta}
              </span>
            </div>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="er-section-title flex items-center gap-2">
            Continue Learning
            <ArrowRight className="h-4 w-4 text-[var(--text-muted)]" />
          </h2>
          <Link to="/courses" className="er-link">View all →</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {enrolledCourses.length === 0 ? (
            <div className="er-card col-span-full p-8 text-center text-sm text-[var(--text-secondary)]">
              No courses in progress yet.{' '}
              <Link to="/browse" className="er-link">Browse courses</Link>
            </div>
          ) : (
            enrolledCourses.map((course) => {
              const pct = courseProgress(course);
              return (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  className="er-card er-card-hover group flex gap-4 p-3 md:p-4 transition-colors"
                >
                  <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface-muted)] sm:h-28 sm:w-36">
                    <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />
                    <span className="er-badge absolute left-2 top-2 bg-[var(--accent)] text-white border-0">In Progress</span>
                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-colors">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                        <Play className="h-4 w-4 fill-current" />
                      </span>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center py-0.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      {course.category} · {pct}% done
                    </div>
                    <h3 className="mt-1 text-sm md:text-base font-semibold text-[var(--text-primary)] line-clamp-1">{course.title}</h3>
                    <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-2">{course.description}</p>
                    <div className="mt-3 er-progress">
                      <span style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-1.5 text-[11px] font-semibold text-[var(--accent-text)]">{pct}%</div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="er-section-title flex items-center gap-2">
            <SparkleIcon />
            Recommended for You
          </h2>
          <Link to="/browse" className="er-link">Explore all →</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(recommendedCourses.length ? recommendedCourses : COURSES.slice(0, 4)).map((course, i) => {
            const meta = recMeta[i % recMeta.length];
            return (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="er-card er-card-hover group overflow-hidden transition-colors"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-muted)]">
                  <img
                    src={course.thumbnail}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <span className={`er-badge absolute left-2.5 top-2.5 ${meta.badgeClass}`}>{meta.badge}</span>
                </div>
                <div className="p-3.5">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-1">{course.title}</h3>
                  <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-2">{course.description}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {meta.weeks}
                    </span>
                    <span className="font-medium">{meta.level}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

function SparkleIcon() {
  return (
    <svg className="h-4 w-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z" />
    </svg>
  );
}

export default Dashboard;
