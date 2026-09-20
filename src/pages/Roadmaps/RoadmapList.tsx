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

/** Dual-side animated sine waves — spaced from title, continuous motion */
function UpperWaveBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute left-[6%] top-8 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/15" />
      <div className="absolute right-[5%] top-4 h-48 w-48 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-600/15" />

      {/* LEFT — shorter waves that stop before the title words */}
      <svg
        className="absolute left-0 top-[12%] h-[58%] w-[28%] max-w-[300px] md:w-[30%] lg:max-w-[340px]"
        viewBox="0 0 320 240"
        fill="none"
        preserveAspectRatio="xMinYMid meet"
      >
        <defs>
          <linearGradient id="waveFadeLeft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="waveMaskLeft">
            <rect width="320" height="240" fill="url(#waveFadeLeft)" />
          </mask>
        </defs>
        <g className="wave-motion wave-motion-a" mask="url(#waveMaskLeft)">
          <path
            d="M-8 120 C 50 78, 95 165, 150 120 S 230 70, 300 118"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            className="text-slate-400/50 dark:text-slate-400/42"
          />
          <path
            d="M-8 142 C 55 100, 100 185, 155 140 S 235 88, 300 140"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            className="text-indigo-400/45 dark:text-indigo-300/38"
          />
          <path
            d="M-8 100 C 45 65, 90 145, 145 108 S 225 55, 300 100"
            stroke="currentColor"
            strokeWidth="0.95"
            strokeLinecap="round"
            className="text-violet-400/35 dark:text-violet-300/30"
          />
        </g>
      </svg>

      {/* RIGHT — shorter mixed waves with gap from title */}
      <svg
        className="absolute right-0 top-[8%] h-[62%] w-[30%] max-w-[320px] md:w-[32%] lg:max-w-[360px]"
        viewBox="0 0 340 260"
        fill="none"
        preserveAspectRatio="xMaxYMid meet"
      >
        <defs>
          <linearGradient id="waveFadeRight" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="waveMaskRight">
            <rect width="340" height="260" fill="url(#waveFadeRight)" />
          </mask>
        </defs>
        <g className="wave-motion wave-motion-b" mask="url(#waveMaskRight)">
          <path
            d="M40 90 C 100 50, 150 145, 210 90 S 290 45, 360 88"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            className="text-slate-400/45 dark:text-slate-400/40"
          />
          <path
            d="M40 118 C 105 78, 155 172, 215 118 S 295 72, 360 116"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
            className="text-indigo-400/40 dark:text-indigo-300/35"
          />
          <path
            d="M40 145 C 110 105, 160 200, 220 145 S 300 100, 360 142"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-violet-400/32 dark:text-violet-300/28"
          />
          <path
            d="M50 72 C 100 40, 145 125, 200 78 S 280 38, 360 72"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeLinecap="round"
            className="text-sky-400/28 dark:text-sky-300/24"
          />
          <path
            d="M60 172 C 120 138, 170 215, 230 170 S 310 125, 360 168"
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
          25%  { transform: translate3d(12px, -9px); }
          50%  { transform: translate3d(3px, 5px); }
          75%  { transform: translate3d(-9px, -4px); }
          100% { transform: translate3d(0, 0); }
        }
        @keyframes wave-motion-b {
          0%   { transform: translate3d(0, 0); }
          30%  { transform: translate3d(-14px, 7px); }
          55%  { transform: translate3d(9px, -8px); }
          80%  { transform: translate3d(-5px, 4px); }
          100% { transform: translate3d(0, 0); }
        }
        .wave-motion-a {
          animation: wave-motion-a 7.5s ease-in-out infinite;
          transform-box: fill-box;
        }
        .wave-motion-b {
          animation: wave-motion-b 10s ease-in-out infinite;
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
