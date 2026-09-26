import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  MapPin,
  Target,
  Users,
  Wand2,
} from 'lucide-react';
import { AuroraMeshBackground } from '../../components/AuroraMeshBackground';
import {
  DISTRICTS,
  actionLabel,
  actionTone,
  generateDistrictPlan,
  summarizePlan,
  topSkillsForDistrict,
  type DistrictKey,
  type PlanActionType,
} from './districtTrainingPlanData';

const ACTION_FILTERS: { id: PlanActionType | 'all'; label: string }[] = [
  { id: 'all', label: 'All actions' },
  { id: 'expand', label: 'Expand' },
  { id: 'reduce', label: 'Reduce' },
  { id: 'add_module', label: 'Add module' },
  { id: 'new_course', label: 'New course' },
];

export function DistrictTrainingPlan() {
  const [district, setDistrict] = useState<DistrictKey>('Pune');
  const [actionFilter, setActionFilter] = useState<PlanActionType | 'all'>('all');
  const [tick, setTick] = useState(0);

  const actions = useMemo(() => generateDistrictPlan(district), [district, tick]);
  const summary = useMemo(() => summarizePlan(district, actions), [district, actions]);
  const skills = useMemo(() => topSkillsForDistrict(district), [district]);

  const filtered = useMemo(() => {
    if (actionFilter === 'all') return actions;
    return actions.filter((a) => a.action === actionFilter);
  }, [actions, actionFilter]);

  const selectCls =
    'rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-indigo-500/40';

  return (
    <div className="relative min-h-full overflow-hidden text-[var(--text-primary)]">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40 dark:opacity-70">
        <AuroraMeshBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-[var(--bg-primary)]" />
      </div>

      <div className="relative z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              SIH26134 · District training plans
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">
              District training plan — {district}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">
              Expand, reduce, add modules, or pilot new programmes from local demand signals.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTick((t) => t + 1)}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/25"
          >
            <Wand2 className="h-3.5 w-3.5" /> Generate plan
          </button>
        </motion.div>

        <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)]/90 p-4 shadow-[var(--shadow-card)] backdrop-blur-sm">
          <div className="flex flex-wrap gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase text-[var(--text-muted)]">District</span>
              <select
                className={selectCls}
                value={district}
                onChange={(e) => setDistrict(e.target.value as DistrictKey)}
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Action type</span>
              <select
                className={selectCls}
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value as PlanActionType | 'all')}
              >
                {ACTION_FILTERS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {[
            { label: 'Openings', value: summary.totalOpenings, icon: Briefcase },
            { label: 'Local courses', value: summary.courseCount, icon: BookOpen },
            { label: 'Expand', value: summary.expandCount, icon: ArrowUpRight },
            {
              label: 'Reduce / new',
              value: `${summary.reduceCount} / ${summary.newCourseCount}`,
              icon: Target,
            },
            { label: 'Trainer pressure', value: summary.trainerShortfall, icon: Users },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)]/90 p-4 shadow-[var(--shadow-card)] backdrop-blur-sm"
            >
              <k.icon className="mb-2 h-4 w-4 text-indigo-500" />
              <p className="text-xs font-bold uppercase text-[var(--text-muted)]">{k.label}</p>
              <p className="mt-1 text-2xl font-black">{k.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)]/90 p-5 xl:col-span-2">
            <h2 className="mb-3 text-sm font-bold">Skills in demand · {district}</h2>
            <ul className="space-y-3">
              {skills.map((row) => (
                <li key={row.skill}>
                  <div className="mb-1 flex justify-between text-xs font-bold">
                    <span>{row.skill}</span>
                    <span className="text-[var(--text-muted)]">
                      {row.openings} · {row.trend}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500"
                      style={{ width: `${Math.max(6, row.demand)}%` }}
                    />
                  </div>
                </li>
              ))}
              {skills.length === 0 && (
                <p className="text-sm text-[var(--text-muted)]">No skill signals.</p>
              )}
            </ul>
          </section>

          <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)]/90 p-5 xl:col-span-3">
            <h2 className="mb-3 text-sm font-bold">Action plan ({filtered.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-default)] text-xs uppercase text-[var(--text-muted)]">
                    <th className="py-2 pr-2">Action</th>
                    <th className="py-2 pr-2">Course / role</th>
                    <th className="py-2 pr-2">Why</th>
                    <th className="py-2">Seats</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id} className="border-b border-[var(--border-default)]/60">
                      <td className="py-2 pr-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${actionTone(a.action)}`}
                        >
                          {actionLabel(a.action)}
                        </span>
                      </td>
                      <td className="py-2 pr-2 font-semibold">{a.courseOrRole}</td>
                      <td className="py-2 pr-2 text-[var(--text-secondary)]">{a.why}</td>
                      <td className="py-2 font-mono text-xs">{a.seatDelta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <p className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <MapPin className="h-3.5 w-3.5" /> Maharashtra mock demand · {summary.readinessNote}
        </p>
      </div>
    </div>
  );
}

export default DistrictTrainingPlan;
