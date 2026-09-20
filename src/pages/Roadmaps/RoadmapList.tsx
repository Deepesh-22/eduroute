import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Terminal,
  LineChart,
  ShieldAlert,
  Palette,
  Database,
  TrendingUp,
  ChevronRight,
  Target,
  Search,
} from 'lucide-react';
import { motion } from 'framer-motion';

const ROLES = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    icon: Code2,
    color: 'bg-blue-500',
    description: 'Master HTML, CSS, React, and modern frontend architecture.',
    level: 'Beginner to Advanced',
    modules: 12,
    trending: true,
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    icon: Terminal,
    color: 'bg-emerald-500',
    description: 'Learn Node.js, SQL/NoSQL, and system design patterns.',
    level: 'Beginner to Advanced',
    modules: 15,
    trending: true,
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    icon: LineChart,
    color: 'bg-purple-500',
    description: 'Master Python, SQL, and data visualization tools.',
    level: 'Beginner to Pro',
    modules: 10,
    trending: true,
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    icon: ShieldAlert,
    color: 'bg-red-500',
    description: 'Learn ethical hacking, network security, and defense.',
    level: 'Beginner to Advanced',
    modules: 12,
    trending: true,
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Designer',
    icon: Palette,
    color: 'bg-pink-500',
    description: 'Learn Figma, user research, and interactive design.',
    level: 'Creative focused',
    modules: 8,
    trending: true,
  },
  {
    id: 'fullstack',
    title: 'Fullstack Engineer',
    icon: Database,
    color: 'bg-indigo-500',
    description: 'The complete path from frontend to infrastructure.',
    level: 'Beginner to Pro',
    modules: 10,
    trending: true,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 340, damping: 26 },
  },
};

/** Dual-side animated sine waves — upper hero only, continuous motion (no arrow) */
function UpperWaveBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute left-[8%] top-6 h-44 w-44 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/15" />
      <div className="absolute right-[6%] top-2 h-52 w-52 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-600/15" />

      {/* LEFT — thin flowing waves */}
      <svg
        className="absolute left-0 top-[10%] h-[65%] w-[36%] max-w-[400px]"
        viewBox="0 0 400 260"
        fill="none"
      >
        <g className="wave-motion wave-motion-a">
          <path
            d="M-10 130 C 55 85, 110 180, 175 130 S 300 70, 420 125"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            className="text-slate-400/50 dark:text-slate-400/42"
          />
          <path
            d="M-10 155 C 65 110, 120 200, 185 150 S 310 90, 420 150"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            className="text-indigo-400/45 dark:text-indigo-300/38"
          />
          <path
            d="M-10 108 C 50 70, 105 155, 170 115 S 290 55, 420 105"
            stroke="currentColor"
            strokeWidth="0.95"
            strokeLinecap="round"
            className="text-violet-400/35 dark:text-violet-300/30"
          />
        </g>
      </svg>

      {/* RIGHT — mixed multi-wave cluster */}
      <svg
        className="absolute right-0 top-[6%] h-[72%] w-[40%] max-w-[460px]"
        viewBox="0 0 460 290"
        fill="none"
      >
        <g className="wave-motion wave-motion-b">
          <path
            d="M-20 95 C 75 50, 140 155, 225 95 S 360 40, 480 90"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            className="text-slate-400/45 dark:text-slate-400/40"
          />
          <path
            d="M-20 125 C 85 80, 150 185, 235 125 S 370 70, 480 120"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
            className="text-indigo-400/40 dark:text-indigo-300/35"
          />
          <path
            d="M-20 155 C 95 110, 160 215, 245 155 S 380 100, 480 150"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-violet-400/32 dark:text-violet-300/28"
          />
          <path
            d="M-20 75 C 65 40, 130 135, 215 80 S 350 30, 480 75"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeLinecap="round"
            className="text-sky-400/28 dark:text-sky-300/24"
          />
          <path
            d="M30 185 C 120 145, 185 230, 270 180 S 400 125, 480 175"
            stroke="currentColor"
            strokeWidth="0.85"
            strokeLinecap="round"
            className="text-fuchsia-400/22 dark:text-fuchsia-300/20"
          />
        </g>
      </svg>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />

      <style>{`
        @keyframes wave-motion-a {
          0%   { transform: translate3d(0, 0); }
          25%  { transform: translate3d(14px, -10px); }
          50%  { transform: translate3d(4px, 6px); }
          75%  { transform: translate3d(-10px, -5px); }
          100% { transform: translate3d(0, 0); }
        }
        @keyframes wave-motion-b {
          0%   { transform: translate3d(0, 0); }
          30%  { transform: translate3d(-16px, 8px); }
          55%  { transform: translate3d(10px, -9px); }
          80%  { transform: translate3d(-6px, 4px); }
          100% { transform: translate3d(0, 0); }
        }
        .wave-motion-a {
          animation: wave-motion-a 8s ease-in-out infinite;
          transform-box: fill-box;
        }
        .wave-motion-b {
          animation: wave-motion-b 11s ease-in-out infinite;
          transform-box: fill-box;
        }
        @media (prefers-reduced-motion: reduce) {
          .wave-motion-a,
          .wave-motion-b { animation: none; }
        }
      `}</style>
    </div>
  );
}

export const RoadmapList = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex-1 bg-[var(--bg-primary)]">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 max-h-[420px] md:max-h-[460px]">
          <UpperWaveBackground />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-6 pt-4 md:px-8 md:pt-8">
          <motion.header
            className="mb-10 md:mb-12"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-300">
                <Target className="h-6 w-6" />
              </div>
              <span className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                Career Paths
              </span>
            </div>
            <h1 className="mb-5 text-4xl font-black leading-tight text-slate-900 dark:text-white md:text-5xl">
              Your Career Journey,{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent dark:from-indigo-300 dark:via-violet-300 dark:to-fuchsia-300">
                Visualized.
              </span>
            </h1>
            <p className="max-w-2xl text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400 md:text-xl">
              Follow industry-standard paths designed to take you from absolute zero
              to a professional role. Each step is verified by experts.
            </p>
          </motion.header>

          <motion.div
            className="relative mb-4 max-w-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search career paths..."
              className="w-full rounded-[28px] border border-slate-100 bg-white/90 py-5 pl-16 pr-6 text-lg font-medium text-slate-900 shadow-xl shadow-slate-200/50 outline-none backdrop-blur-sm transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:text-white dark:shadow-black/40"
            />
          </motion.div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-6 md:px-8 md:pb-12">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
        >
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.id}
                variants={item}
                whileHover={{ y: -8, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/roadmaps/${role.id}`)}
                className="group cursor-pointer rounded-[32px] border border-slate-100 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-indigo-950/40 md:p-8"
              >
                <div className="mb-6 flex items-start justify-between">
                  <motion.div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${role.color} text-white shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: -3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    <Icon className="h-7 w-7" />
                  </motion.div>
                  {role.trending && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                      <TrendingUp className="h-3 w-3" /> Trending
                    </span>
                  )}
                </div>
                <h3 className="mb-2 text-xl font-black text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                  {role.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {role.description}
                </p>
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>{role.level}</span>
                  <span>{role.modules} modules</span>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-indigo-400">
                  Start path <ChevronRight className="h-4 w-4" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <button
            type="button"
            onClick={() => navigate('/roadmaps')}
            className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 hover:shadow-indigo-500/40 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            Explore All Paths
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default RoadmapList;
