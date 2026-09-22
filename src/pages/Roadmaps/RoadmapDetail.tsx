import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  MapPin,
  Play,
  Sparkles,
  Youtube,
} from 'lucide-react';
import { ROADMAP_DATA, type RoadmapTopic } from './roadmapData';

const storageKey = (role: string) => `eduroute-roadmap-topics-${role}`;

export const RoadmapDetail = () => {
  const { role = 'frontend' } = useParams();
  const reduceMotion = useReducedMotion();
  const data = ROADMAP_DATA[role] || ROADMAP_DATA.frontend;

  const initialCompleted = useMemo(() => {
    const map: Record<string, boolean> = {};
    data.topics.forEach((t) => {
      if (t.completed) map[t.id] = true;
    });
    return map;
  }, [data.topics]);

  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return initialCompleted;
    try {
      const raw = localStorage.getItem(storageKey(role));
      if (!raw) return initialCompleted;
      return { ...initialCompleted, ...(JSON.parse(raw) as Record<string, boolean>) };
    } catch {
      return initialCompleted;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(storageKey(role), JSON.stringify(completed));
  }, [role, completed]);

  const doneCount = data.topics.filter((t) => completed[t.id]).length;
  const progress = Math.round((doneCount / Math.max(data.topics.length, 1)) * 100);
  const allDone = doneCount === data.topics.length && data.topics.length > 0;

  const toggleTopic = (id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const markAllComplete = () => {
    const next: Record<string, boolean> = {};
    data.topics.forEach((t) => {
      next[t.id] = true;
    });
    setCompleted(next);
  };

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.045,
        delayChildren: reduceMotion ? 0 : 0.06,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 380, damping: 28 },
    },
  };

  return (
    <div className="relative flex-1 overflow-x-hidden pb-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-600/20" />
        <div className="absolute -right-16 top-40 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/15" />
        <div className="absolute bottom-20 left-1/3 h-64 w-64 rounded-full bg-fuchsia-400/10 blur-3xl dark:bg-fuchsia-600/10" />
        {!reduceMotion && (
          <div className="roadmap-aurora absolute inset-x-0 top-0 h-48 opacity-40 dark:opacity-30" />
        )}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link
            to="/roadmaps"
            className="inline-flex items-center gap-1.5 font-semibold transition hover:text-violet-600 dark:hover:text-violet-300"
          >
            <MapPin className="h-3.5 w-3.5 text-violet-500" />
            Roadmaps
          </Link>
          <span className="text-slate-300 dark:text-slate-600">›</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">{data.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div>
            <motion.header
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {data.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                {data.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  {data.topics.length} topics
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  ★ {data.level}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  ⏱ {data.totalHours}
                </span>
              </div>

              <div className="mt-6">
                <div className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <span>Progress</span>
                  <span className="tabular-nums text-violet-600 dark:text-violet-300">{progress}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  />
                </div>
              </div>
            </motion.header>

            <motion.ul
              className="mt-8 space-y-2"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {data.topics.map((topic, index) => (
                <TopicRow
                  key={topic.id}
                  topic={topic}
                  index={index}
                  done={!!completed[topic.id]}
                  onToggle={() => toggleTopic(topic.id)}
                  variants={rowVariants}
                />
              ))}
            </motion.ul>

            <div className="mt-6">
              <button
                type="button"
                onClick={markAllComplete}
                disabled={allDone}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-violet-300 hover:text-violet-700 disabled:cursor-default disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-violet-500 dark:hover:text-violet-300"
              >
                <CheckCircle2 className="h-4 w-4" />
                {allDone ? 'Roadmap complete' : 'Mark roadmap complete'}
              </button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90"
            >
              <div className="mb-1 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                <h2 className="text-base font-black text-slate-900 dark:text-white">Resources</h2>
              </div>
              <p className="mb-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Handy links and materials for this roadmap.
              </p>

              <div className="space-y-3">
                {data.playlistUrl && (
                  <a
                    href={data.playlistUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 transition hover:border-violet-200 hover:bg-violet-50 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-violet-500/40 dark:hover:bg-violet-950/30"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300">
                      <Play className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-slate-900 dark:text-white">
                        Full playlist
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                        YouTube playlist
                      </span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-violet-500" />
                  </a>
                )}

                {data.notesZipUrl && (
                  <a
                    href={data.notesZipUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 transition hover:border-blue-200 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-blue-500/40 dark:hover:bg-blue-950/30"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
                      ZIP
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-slate-900 dark:text-white">
                        All notes / docs
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                        Official documentation
                      </span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-blue-500" />
                  </a>
                )}

                <Link
                  to="/buddy"
                  className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 transition hover:border-fuchsia-200 hover:bg-fuchsia-50 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-fuchsia-500/40 dark:hover:bg-fuchsia-950/30"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-300">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">
                      Ask Buddy AI
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                      Get help from your AI companion
                    </span>
                  </span>
                </Link>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};

function TopicRow({
  topic,
  index,
  done,
  onToggle,
  variants,
}: {
  topic: RoadmapTopic;
  index: number;
  done: boolean;
  onToggle: () => void;
  variants: {
    hidden: object;
    show: object;
  };
}) {
  return (
    <motion.li
      variants={variants}
      className="group flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-sm transition hover:border-violet-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-violet-500/40 sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-3"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
        aria-label={done ? `Mark ${topic.title} incomplete` : `Mark ${topic.title} complete`}
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black transition ${
            done
              ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/30'
              : 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
          }`}
        >
          {done ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
        </span>
        <span className="min-w-0">
          <span
            className={`block truncate text-sm font-bold sm:text-[15px] ${
              done ? 'text-slate-500 line-through dark:text-slate-400' : 'text-slate-900 dark:text-white'
            }`}
          >
            {topic.title}
          </span>
          <span className="block text-xs text-slate-500 dark:text-slate-400">{topic.duration}</span>
        </span>
      </button>

      <div className="flex shrink-0 items-center gap-2 pl-12 sm:pl-0">
        <a
          href={topic.youtubeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:bg-slate-950 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          <Youtube className="h-3.5 w-3.5" />
          YouTube
        </a>
        <a
          href={topic.documentUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-xs font-bold text-blue-600 transition hover:bg-blue-50 dark:border-blue-500/30 dark:bg-slate-950 dark:text-blue-400 dark:hover:bg-blue-950/40"
        >
          <FileText className="h-3.5 w-3.5" />
          Document
        </a>
      </div>
    </motion.li>
  );
}

export default RoadmapDetail;
