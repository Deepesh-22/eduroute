import { useCallback, useEffect, useState } from 'react';
import { Loader2, RefreshCw, TrendingUp, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';

type MarketSkill = { skill: string; demandScore: number; trend: string; note?: string };
type MarketSnapshot = {
  updatedAt: string;
  region?: string;
  summary?: string;
  risingSkills?: MarketSkill[];
  decliningSkills?: MarketSkill[];
  topRoles?: { role: string; openingsIndex: number; avgSalaryLpa?: number }[];
  isSeed?: boolean;
};

const SEED: MarketSnapshot = {
  updatedAt: new Date().toISOString(),
  region: 'India / Maharashtra',
  summary: 'Seed labour-market snapshot (refresh when Gemini API is configured on Netlify).',
  isSeed: true,
  risingSkills: [
    { skill: 'React', demandScore: 88, trend: 'rising' },
    { skill: 'Python', demandScore: 90, trend: 'rising' },
    { skill: 'Cloud (AWS)', demandScore: 82, trend: 'rising' },
    { skill: 'TypeScript', demandScore: 78, trend: 'rising' },
    { skill: 'Data analytics', demandScore: 80, trend: 'rising' },
  ],
  decliningSkills: [
    { skill: 'Legacy desktop support', demandScore: 25, trend: 'declining' },
    { skill: 'Manual ledger accounting', demandScore: 18, trend: 'declining' },
  ],
  topRoles: [
    { role: 'Full Stack Developer', openingsIndex: 92, avgSalaryLpa: 8.5 },
    { role: 'Data Analyst', openingsIndex: 85, avgSalaryLpa: 7.2 },
    { role: 'Cloud Associate', openingsIndex: 78, avgSalaryLpa: 9.0 },
  ],
};

const KEY = 'eduroute:market-trends-v1';

function readMarket(): MarketSnapshot {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as MarketSnapshot;
  } catch {
    /* ignore */
  }
  return SEED;
}

function writeMarket(m: MarketSnapshot) {
  localStorage.setItem(KEY, JSON.stringify(m));
  window.dispatchEvent(new Event('eduroute:market-trends-updated'));
}

export function AdminMarketTrends() {
  const [market, setMarket] = useState<MarketSnapshot | null>(() => readMarket());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const reload = useCallback(() => setMarket(readMarket()), []);

  useEffect(() => {
    const onUp = () => reload();
    window.addEventListener('eduroute:market-trends-updated', onUp);
    return () => window.removeEventListener('eduroute:market-trends-updated', onUp);
  }, [reload]);

  const refresh = async () => {
    setBusy(true);
    setErr('');
    setMsg('');
    try {
      const res = await fetch('/.netlify/functions/market-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh_market' }),
      });
      const data = await res.json();
      if (data.ok && data.market) {
        writeMarket(data.market);
        setMarket(data.market);
        setMsg('Market snapshot refreshed via Gemini.');
      } else {
        const next = { ...SEED, updatedAt: new Date().toISOString(), isSeed: true };
        writeMarket(next);
        setMarket(next);
        setMsg(
          data.error ||
            'API unavailable — showing seed snapshot. Set GEMINI_API_KEY on Netlify for live data.',
        );
      }
    } catch {
      const next = { ...SEED, updatedAt: new Date().toISOString(), isSeed: true };
      writeMarket(next);
      setMarket(next);
      setMsg('Offline — seed snapshot updated locally.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 text-[var(--text-primary)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            SIH26134 · Labour market intelligence
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">Market Trends</h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">
            Rising / declining skills and top roles for Maharashtra training planners.
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={refresh}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh market
        </button>
      </div>

      {msg && (
        <p className="flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-secondary)]">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {msg}
        </p>
      )}
      {err && (
        <p className="flex items-center gap-2 text-sm text-rose-500">
          <AlertTriangle className="h-4 w-4" /> {err}
        </p>
      )}

      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <h2 className="font-bold">Summary</h2>
          {market?.isSeed && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
              Seed data
            </span>
          )}
        </div>
        <p className="text-sm text-[var(--text-secondary)]">{market?.summary}</p>
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          {market?.region} · Updated{' '}
          {market?.updatedAt ? new Date(market.updatedAt).toLocaleString() : '—'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
            <TrendingUp className="h-4 w-4 text-emerald-500" /> Rising skills
          </h3>
          <ul className="space-y-2">
            {(market?.risingSkills ?? []).map((s) => (
              <li key={s.skill} className="flex items-center justify-between text-sm">
                <span className="font-semibold">{s.skill}</span>
                <span className="text-[var(--text-muted)]">{s.demandScore}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
          <h3 className="mb-3 text-sm font-bold text-rose-500">Declining skills</h3>
          <ul className="space-y-2">
            {(market?.decliningSkills ?? []).map((s) => (
              <li key={s.skill} className="flex items-center justify-between text-sm">
                <span className="font-semibold">{s.skill}</span>
                <span className="text-[var(--text-muted)]">{s.demandScore}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
        <h3 className="mb-3 text-sm font-bold">Top roles</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(market?.topRoles ?? []).map((r) => (
            <div
              key={r.role}
              className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)]/50 p-3"
            >
              <p className="font-bold">{r.role}</p>
              <p className="text-xs text-[var(--text-muted)]">
                Index {r.openingsIndex}
                {r.avgSalaryLpa != null ? ` · ~${r.avgSalaryLpa} LPA` : ''}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminMarketTrends;
