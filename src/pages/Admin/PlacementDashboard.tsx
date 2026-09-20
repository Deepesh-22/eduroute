import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  Briefcase,
  Calendar,
  ChevronDown,
  GraduationCap,
  TrendingUp,
  Users,
  Target,
  Sparkles,
} from 'lucide-react';
import { getPlacementDashboardData } from '../../utils/placementDashboard';
import { ThemeToggle } from '../../components/ThemeToggle';
import { clearAuthSession, getAuthUser } from '../../utils/rbacAuth';
import { Link, useNavigate } from 'react-router-dom';

function funnelPct(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function TrendChart({ data }: { data: { month: string; applied: number; shortlisted: number; hired: number }[] }) {
  const maxY = Math.max(...data.flatMap((d) => [d.applied, d.shortlisted, d.hired]), 100);
  const w = 320;
  const h = 120;
  const pad = 8;
  const toPoints = (key: 'applied' | 'shortlisted' | 'hired') =>
    data
      .map((d, i) => {
        const x = pad + (i * (w - pad * 2)) / Math.max(1, data.length - 1);
        const y = h - pad - (d[key] / maxY) * (h - pad * 2);
        return `${x},${y}`;
      })
      .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-28 w-full">
      <polyline fill="none" stroke="#818cf8" strokeWidth={2.5} points={toPoints('applied')} />
      <polyline fill="none" stroke="#60a5fa" strokeWidth={2.5} points={toPoints('shortlisted')} />
      <polyline fill="none" stroke="#34d399" strokeWidth={2.5} points={toPoints('hired')} />
    </svg>
  );
}

export const PlacementDashboard = () => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const data = useMemo(
    () =>
      getPlacementDashboardData(
        (user as { institutionName?: string } | null)?.institutionName || 'Modi Institute of Technology',
      ),
    [user],
  );
  const [periodOpen, setPeriodOpen] = useState(false);
  const total = data.kpis.applications || 1;

  const kpiCards = [
    { label: 'Applications', value: data.kpis.applications, delta: data.kpis.applicationsDelta, icon: Users, tone: 'bg-indigo-500/20 text-indigo-300' },
    { label: 'Shortlisted', value: data.kpis.shortlisted, delta: data.kpis.shortlistedDelta, icon: BadgeCheck, tone: 'bg-teal-500/20 text-teal-300' },
    { label: 'Interviews', value: data.kpis.interviews, delta: data.kpis.interviewsDelta, icon: Calendar, tone: 'bg-sky-500/20 text-sky-300' },
    { label: 'Hired', value: data.kpis.hired, delta: data.kpis.hiredDelta, icon: Briefcase, tone: 'bg-amber-500/20 text-amber-300' },
  ];

  const funnel = [
    { label: 'Applied', value: data.kpis.applications, pct: 100 },
    { label: 'Shortlisted', value: data.kpis.shortlisted, pct: funnelPct(data.kpis.shortlisted, total) },
    { label: 'Interview', value: data.kpis.interviews, pct: funnelPct(data.kpis.interviews, total) },
    { label: 'Offers', value: data.kpis.offers, pct: funnelPct(data.kpis.offers, total) },
    { label: 'Hired', value: data.kpis.hired, pct: funnelPct(data.kpis.hired, total) },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-20 border-b border-[var(--border-default)] bg-[var(--bg-sidebar)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-black">College placement</div>
              <div className="text-xs text-[var(--text-muted)]">{data.institutionName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => {
                clearAuthSession();
                navigate('/login', { replace: true });
              }}
              className="rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Institution analytics</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">Placement overview</h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Track placements, readiness, skill demand and hiring outcomes ({data.source === 'live' ? 'live cohort' : 'demo seed'}).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPeriodOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] px-4 py-2 text-xs font-bold"
          >
            {data.periodLabel} <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpiCards.map((k) => (
            <div key={k.label} className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)]">
              <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${k.tone}`}>
                <k.icon className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold uppercase text-[var(--text-muted)]">{k.label}</p>
              <p className="mt-1 text-2xl font-black">{k.value}</p>
              <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">+{k.delta}% vs prior</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
            <p className="text-xs font-bold uppercase text-[var(--text-muted)]">Placement readiness</p>
            <p className="mt-1 text-3xl font-black">
              {data.readinessScore}
              <span className="text-lg text-[var(--text-muted)]">/100</span>
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Vs skill gaps & outcomes</p>
          </div>
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
            <p className="text-xs font-bold uppercase text-[var(--text-muted)]">Placement rate</p>
            <p className="mt-1 text-3xl font-black text-emerald-600 dark:text-emerald-400">{data.placementRate}%</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Hired / applications</p>
          </div>
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
            <p className="text-xs font-bold uppercase text-[var(--text-muted)]">Open full-time jobs</p>
            <p className="mt-1 text-3xl font-black text-indigo-600 dark:text-indigo-400">{data.openJobs}</p>
          </div>
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
            <p className="text-xs font-bold uppercase text-[var(--text-muted)]">Open internships</p>
            <p className="mt-1 text-3xl font-black text-violet-600 dark:text-violet-400">{data.openInternships}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)] xl:col-span-3">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Placement funnel</h2>
                <p className="text-xs text-[var(--text-muted)]">Applied → Shortlist → Interview → Offer → Hire</p>
              </div>
            </div>
            <div className="space-y-3">
              {funnel.map((f) => (
                <div key={f.label}>
                  <div className="mb-1 flex justify-between text-xs font-bold">
                    <span>{f.label}</span>
                    <span className="text-[var(--text-muted)]">
                      {f.value} · {f.pct}%
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${Math.max(4, f.pct)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <p className="mb-2 text-xs font-bold text-[var(--text-muted)]">Monthly trend</p>
              <TrendChart data={data.trends} />
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)] xl:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-300">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Top skill gaps (cohort)</h2>
                <p className="text-xs text-[var(--text-muted)]">Where students need support</p>
              </div>
            </div>
            <ul className="space-y-3">
              {data.skillGaps.map((g) => (
                <li key={g.name}>
                  <div className="mb-1 flex justify-between text-xs font-bold">
                    <span>
                      #{g.rank} {g.name}
                    </span>
                    <span className="text-[var(--text-muted)]">{g.percent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                    <div className="h-full rounded-full" style={{ width: `${g.percent}%`, background: g.color }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Skill demand (from industry posts)</h2>
              <p className="text-xs text-[var(--text-muted)]">What recruiters are asking for</p>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(data.skillDemand || []).map((row) => (
              <li key={row.name} className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-3">
                <div className="flex justify-between text-xs font-bold">
                  <span>{row.name}</span>
                  <span className="text-[var(--text-muted)]">
                    {row.demand}% · {row.trend}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--bg-card)]">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ width: `${row.demand}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Top hiring companies</h2>
              <p className="text-xs text-[var(--text-muted)]">Based on successful placements</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.companies.map((c) => (
              <article key={c.id} className="flex items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-3">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.logoSeed}`} alt="" className="h-10 w-10 rounded-xl bg-white" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{c.name}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{c.tag}</p>
                </div>
                <p className="text-sm font-bold">{c.hires} hires</p>
              </article>
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-[var(--text-muted)]">
          <Link to="/" className="font-semibold text-indigo-600 dark:text-indigo-400">
            EDUROUTE
          </Link>{' '}
          · College demo · localStorage metrics
        </p>
      </main>
    </div>
  );
};

export default PlacementDashboard;
