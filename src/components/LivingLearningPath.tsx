/**
 * Living Learning Path — visual progress toward internship / job readiness.
 * Light + dark. Node click + right-click popup. Frontend only.
 */
import { useMemo, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Check,
  Clock,
  Lock,
  Network,
  Play,
  Sparkles,
  X,
} from 'lucide-react';

export type PathNodeStatus = 'completed' | 'current' | 'locked';

export type PathNode = {
  id: string;
  title: string;
  short: string;
  status: PathNodeStatus;
  hours: number;
  skills: string[];
  resources: { label: string; kind: string; mins: number }[];
};

const DEFAULT_NODES: PathNode[] = [
  {
    id: 'python',
    title: 'Python Fundamentals',
    short: 'Python',
    status: 'completed',
    hours: 6,
    skills: ['Python', 'Basics', 'OOP'],
    resources: [
      { label: 'Python Crash Course', kind: 'Video', mins: 45 },
      { label: 'Practice problems', kind: 'Exercise', mins: 60 },
    ],
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    short: 'DSA',
    status: 'completed',
    hours: 20,
    skills: ['Arrays', 'Trees', 'Graphs'],
    resources: [
      { label: 'DSA Sheet', kind: 'Practice', mins: 120 },
      { label: 'Complexity guide', kind: 'Reading', mins: 30 },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend Foundations',
    short: 'Frontend',
    status: 'completed',
    hours: 12,
    skills: ['HTML', 'CSS', 'React'],
    resources: [
      { label: 'React roadmap', kind: 'Video', mins: 40 },
      { label: 'Build a mini app', kind: 'Exercise', mins: 90 },
    ],
  },
  {
    id: 'system',
    title: 'System Design Basics',
    short: 'System Design',
    status: 'current',
    hours: 4,
    skills: ['System Design', 'Load Balancing', 'Caching', 'Databases'],
    resources: [
      { label: 'Introduction to System Design', kind: 'Video', mins: 20 },
      { label: 'Scalability Fundamentals', kind: 'Reading', mins: 30 },
      { label: 'Designing a URL Shortener', kind: 'Exercise', mins: 60 },
      { label: 'Quiz: System Design Basics', kind: 'Quiz', mins: 10 },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced System Design',
    short: 'Advanced SD',
    status: 'locked',
    hours: 8,
    skills: ['Distributed systems', 'CAP'],
    resources: [{ label: 'Unlocks after System Design', kind: 'Info', mins: 0 }],
  },
  {
    id: 'scale',
    title: 'Scalability & Beyond',
    short: 'Scale',
    status: 'locked',
    hours: 10,
    skills: ['Observability', 'Performance'],
    resources: [{ label: 'Unlocks after Advanced SD', kind: 'Info', mins: 0 }],
  },
];

type CtxMenu = { x: number; y: number; node: PathNode } | null;

export function LivingLearningPath({ nodes = DEFAULT_NODES }: { nodes?: PathNode[] }) {
  const [selectedId, setSelectedId] = useState(
    () => nodes.find((n) => n.status === 'current')?.id || nodes[0]?.id,
  );
  const [ctx, setCtx] = useState<CtxMenu>(null);

  const selected = useMemo(
    () => nodes.find((n) => n.id === selectedId) || nodes[0],
    [nodes, selectedId],
  );

  const completed = nodes.filter((n) => n.status === 'completed').length;
  const percent = Math.round((completed / Math.max(nodes.length, 1)) * 100);

  const onContext = (e: MouseEvent, node: PathNode) => {
    e.preventDefault();
    setCtx({ x: e.clientX, y: e.clientY, node });
    setSelectedId(node.id);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)] md:p-6">
      <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-600/10" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-36 w-36 rounded-full bg-indigo-400/15 blur-3xl dark:bg-indigo-500/10" />

      <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
            Your Learning Path
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Master in-demand skills step by step — path to internship & job readiness.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-1 text-xs font-bold text-[var(--text-secondary)]">
            {percent}% Complete
          </span>
          <div className="h-2 w-28 overflow-hidden rounded-full bg-[var(--bg-input)]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:items-start">
        <div className="overflow-x-auto pb-1 self-start">
          <div className="relative mx-auto flex min-w-[560px] items-start justify-between gap-1 px-1 pt-2">
            <div className="absolute left-8 right-8 top-[30px] h-[3px] rounded-full bg-[var(--border-default)]" />
            <motion.div
              className="absolute left-8 top-[30px] h-[3px] rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400"
              initial={{ width: 0 }}
              animate={{
                width: `calc(${(Math.max(completed - 0.5, 0) / Math.max(nodes.length - 1, 1)) * 100}% )`,
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ maxWidth: 'calc(100% - 4rem)' }}
            />

            {nodes.map((node) => {
              const isSel = selectedId === node.id;
              return (
                <div key={node.id} className="relative z-10 flex w-[90px] flex-col items-center">
                  <motion.button
                    type="button"
                    onClick={() => setSelectedId(node.id)}
                    onContextMenu={(e) => onContext(e, node)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-shadow ${
                      node.status === 'completed'
                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : node.status === 'current'
                          ? 'border-violet-400 bg-[var(--bg-card)] text-violet-600 shadow-[0_0_0_6px_rgba(139,92,246,0.25)] dark:text-violet-300'
                          : 'border-slate-300 bg-[var(--bg-elevated)] text-slate-400 dark:border-slate-600'
                    } ${isSel ? 'ring-2 ring-offset-2 ring-violet-400 ring-offset-[var(--bg-card)]' : ''}`}
                    aria-label={`${node.title} (${node.status})`}
                    title="Click to open · Right-click for quick menu"
                  >
                    {node.status === 'completed' && <Check className="h-6 w-6" strokeWidth={2.5} />}
                    {node.status === 'current' && (
                      <span className="relative flex h-5 w-5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
                        <span className="relative inline-flex h-5 w-5 rounded-full bg-violet-500" />
                      </span>
                    )}
                    {node.status === 'locked' && <Lock className="h-5 w-5" />}
                  </motion.button>
                  <p className="mt-2 text-center text-[10px] font-bold leading-tight text-[var(--text-primary)]">
                    {node.short}
                  </p>
                  <p
                    className={`mt-1 text-[10px] font-semibold ${
                      node.status === 'completed'
                        ? 'text-indigo-600 dark:text-indigo-300'
                        : node.status === 'current'
                          ? 'text-violet-600 dark:text-violet-300'
                          : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {node.status === 'completed'
                      ? 'Completed'
                      : node.status === 'current'
                        ? 'In Progress'
                        : 'Locked'}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-center text-[10px] text-[var(--text-muted)]">
            Tip: click a node for details · right-click for quick actions
          </p>
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.aside
              key={selected.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }}
              className="self-start rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                  <Network className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-black text-[var(--text-primary)]">{selected.title}</h3>
                  <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {selected.hours} hours
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        selected.status === 'completed'
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          : selected.status === 'current'
                            ? 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {selected.status === 'completed'
                        ? 'Completed'
                        : selected.status === 'current'
                          ? 'In Progress'
                          : 'Locked'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Key Skills
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selected.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] px-2 py-1 text-[10px] font-semibold text-[var(--text-secondary)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Resources
                </p>
                <ul className="mt-2 space-y-2">
                  {selected.resources.map((r) => (
                    <li
                      key={r.label}
                      className="flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] px-3 py-2 text-xs"
                    >
                      <BookOpen className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                      <span className="min-w-0 flex-1 font-semibold text-[var(--text-primary)]">
                        {r.label}
                        <span className="block text-[10px] font-normal text-[var(--text-muted)]">
                          {r.kind}
                          {r.mins > 0 ? ` · ${r.mins} min` : ''}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {selected.status !== 'locked' ? (
                <Link
                  to="/roadmaps"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500"
                >
                  <Play className="h-4 w-4" />
                  {selected.status === 'current' ? 'Continue learning' : 'Review module'}
                </Link>
              ) : (
                <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border-default)] py-3 text-xs font-semibold text-[var(--text-muted)]">
                  <Lock className="h-3.5 w-3.5" /> Complete previous steps to unlock
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {ctx && (
          <>
            <div
              className="fixed inset-0 z-[100]"
              onClick={() => setCtx(null)}
              onContextMenu={(e) => {
                e.preventDefault();
                setCtx(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                left: Math.min(ctx.x, typeof window !== 'undefined' ? window.innerWidth - 220 : ctx.x),
                top: Math.min(ctx.y, typeof window !== 'undefined' ? window.innerHeight - 180 : ctx.y),
              }}
              className="fixed z-[101] w-52 overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] py-1 shadow-2xl"
              role="menu"
            >
              <div className="border-b border-[var(--border-default)] px-3 py-2">
                <p className="truncate text-xs font-bold text-[var(--text-primary)]">{ctx.node.title}</p>
                <p className="text-[10px] capitalize text-[var(--text-muted)]">{ctx.node.status}</p>
              </div>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--accent-soft)]"
                onClick={() => {
                  setSelectedId(ctx.node.id);
                  setCtx(null);
                }}
              >
                <Sparkles className="h-3.5 w-3.5 text-violet-500" /> Open details
              </button>
              {ctx.node.status !== 'locked' && (
                <Link
                  to="/roadmaps"
                  role="menuitem"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--accent-soft)]"
                  onClick={() => setCtx(null)}
                >
                  <Play className="h-3.5 w-3.5 text-indigo-500" /> Go to module
                </Link>
              )}
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]"
                onClick={() => setCtx(null)}
              >
                <X className="h-3.5 w-3.5" /> Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

export default LivingLearningPath;
