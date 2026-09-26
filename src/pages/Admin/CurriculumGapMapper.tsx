import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, BookOpen, Target, TrendingUp } from 'lucide-react';
import { COURSES, flagLabel, flagTone, type CourseFlag } from './curriculumGapData';

export function CurriculumGapMapper() {
  const [flagFilter, setFlagFilter] = useState<CourseFlag | 'all'>('all');
  const [selectedId, setSelectedId] = useState(COURSES[0]?.id ?? '');

  const filtered = useMemo(() => {
    if (flagFilter === 'all') return COURSES;
    return COURSES.filter((c) => c.flag === flagFilter);
  }, [flagFilter]);

  const selected = filtered.find((c) => c.id === selectedId) ?? filtered[0] ?? COURSES[0];

  return (
    <div className="relative space-y-6 text-[var(--text-primary)]">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          SIH26134 · Curriculum ↔ skill gaps
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">Curriculum Gaps</h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">
          Compare what courses teach vs industry demand. Recommendations: add, remove, or update modules.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'critical_gap', 'healthy', 'oversupplied', 'obsolete', 'low_placement'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFlagFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              flagFilter === f
                ? 'bg-indigo-600 text-white'
                : 'border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
            }`}
          >
            {f === 'all' ? 'All' : flagLabel(f)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <section className="space-y-2 lg:col-span-2">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                selected?.id === c.id
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-[var(--border-default)] bg-[var(--bg-card)]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold">{c.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {c.district} · {c.provider}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${flagTone(c.flag)}`}>
                  {flagLabel(c.flag)}
                </span>
              </div>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                {c.seats} seats · {c.placementRate}% placement
              </p>
            </button>
          ))}
        </section>

        {selected && (
          <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 lg:col-span-3">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20 text-violet-500">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-bold">{selected.name}</h2>
                <p className="text-xs text-[var(--text-muted)]">{selected.sector}</p>
              </div>
            </div>

            <h3 className="mb-2 text-xs font-bold uppercase text-[var(--text-muted)]">Skill gaps</h3>
            <ul className="mb-6 space-y-3">
              {selected.skills.map((s) => (
                <li key={s.skill}>
                  <div className="mb-1 flex justify-between text-xs font-bold">
                    <span>{s.skill}</span>
                    <span className="text-[var(--text-muted)]">
                      taught {s.taughtPct}% · demand {s.demandPct}%
                    </span>
                  </div>
                  <div className="flex h-2 gap-1 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                    <div className="h-full rounded-full bg-indigo-500/80" style={{ width: `${s.taughtPct}%` }} />
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="mb-2 flex items-center gap-1 text-xs font-bold uppercase text-[var(--text-muted)]">
              <AlertTriangle className="h-3.5 w-3.5" /> Recommendations
            </h3>
            <ul className="space-y-2">
              {selected.recommendations.map((r) => (
                <li
                  key={r.id}
                  className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)]/50 p-3"
                >
                  <p className="text-xs font-bold uppercase text-indigo-500">{r.type}</p>
                  <p className="font-semibold">{r.title}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{r.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

export default CurriculumGapMapper;
