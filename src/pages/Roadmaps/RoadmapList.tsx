import { useRef } from 'react';
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
import { motion, useScroll, useTransform } from 'framer-motion';

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

/** Dual-side waves — slow water-like continuous flow + soft scroll drift */
function UpperWaveBackground({
  scrollYProgress,
}: {
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const leftFlowX = useTransform(scrollYProgress, [0, 0.7], [0, -48]);
  const rightFlowX = useTransform(scrollYProgress, [0, 0.7], [0, 56]);
  const leftFlowY = useTransform(scrollYProgress, [0, 0.7], [0, -16]);
  const rightFlowY = useTransform(scrollYProgress, [0, 0.7], [0, 20]);
  const waveOpacity = useTransform(scrollYProgress, [0, 0.15, 0.45], [1, 0.95, 0.25]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
      style={{ opacity: waveOpacity }}
    >
      <div className="absolute left-[6%] top-8 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/15" />
      <div className="absolute right-[4%] top-2 h-56 w-56 rounded-full bg-violet-400/12 blur-3xl dark:bg-violet-600/18" />

      <motion.svg
        className="absolute left-0 top-[12%] h-[58%] w-[28%] max-w-[300px] md:w-[30%] lg:max-w-[340px]"
        viewBox="0 0 320 240"
        fill="none"
        preserveAspectRatio="xMinYMid meet"
        style={{ x: leftFlowX, y: leftFlowY }}
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
            strokeWidth="1.4"
            strokeLinecap="round"
            className="text-slate-400/55 dark:text-slate-400/48"
          />
          <path
            d="M-8 142 C 55 100, 100 185, 155 140 S 235 88, 300 140"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
            className="text-indigo-400/50 dark:text-indigo-300/42"
          />
          <path
            d="M-8 100 C 45 65, 90 145, 145 108 S 225 55, 300 100"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-violet-400/40 dark:text-violet-300/35"
          />
        </g>
      </motion.svg>

      <motion.svg
        className="absolute right-0 top-[4%] h-[78%] w-[42%] max-w-[520px] md:w-[44%] lg:max-w-[560px]"
        viewBox="0 0 520 300"
        fill="none"
        preserveAspectRatio="xMaxYMid meet"
        style={{ x: rightFlowX, y: rightFlowY }}
      >
        <defs>
          <linearGradient id="waveFadeRight" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="55%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="waveMaskRight">
            <rect width="520" height="300" fill="url(#waveFadeRight)" />
          </mask>
        </defs>
        <g className="wave-motion wave-motion-b" mask="url(#waveMaskRight)">
          <path
            d="M20 95 C 110 40, 190 160, 290 95 S 420 35, 540 90"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-slate-400/50 dark:text-slate-400/48"
          />
          <path
            d="M20 125 C 120 70, 200 190, 300 125 S 430 65, 540 120"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            className="text-indigo-400/45 dark:text-indigo-300/42"
          />
          <path
            d="M20 155 C 125 100, 210 220, 310 155 S 440 95, 540 150"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            className="text-violet-400/38 dark:text-violet-300/35"
          />
          <path
            d="M30 72 C 115 30, 195 145, 285 78 S 410 28, 540 70"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-sky-400/35 dark:text-sky-300/32"
          />
          <path
            d="M40 185 C 135 140, 220 245, 320 180 S 450 120, 540 175"
            stroke="currentColor"
            strokeWidth="0.95"
            strokeLinecap="round"
            className="text-fuchsia-400/30 dark:text-fuchsia-300/28"
          />
          <path
            d="M50 210 C 145 170, 230 265, 330 210 S 460 150, 540 205"
            stroke="currentColor"
            strokeWidth="0.85"
            strokeLinecap="round"
            className="text-indigo-300/25 dark:text-indigo-200/22"
          />
        </g>
      </motion.svg>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />

      <style>{`
        /* Slow water-like flow */
        @keyframes wave-motion-a {
          0%   { transform: translate3d(0, 0) scaleY(1); }
          25%  { transform: translate3d(18px, -10px) scaleY(1.04); }
          50%  { transform: translate3d(-8px, 8px) scaleY(0.97); }
          75%  { transform: translate3d(12px, -6px) scaleY(1.03); }
          100% { transform: translate3d(0, 0) scaleY(1); }
        }
        @keyframes wave-motion-b {
          0%   { transform: translate3d(0, 0) scaleY(1); }
          25%  { transform: translate3d(-20px, 10px) scaleY(1.05); }
          50%  { transform: translate3d(12px, -12px) scaleY(0.96); }
          75%  { transform: translate3d(-14px, 7px) scaleY(1.03); }
          100% { transform: translate3d(0, 0) scaleY(1); }
        }
        .wave-motion-a {
          animation: wave-motion-a 14s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center center;
        }
        .wave-motion-b {
          animation: wave-motion-b 18s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center center;
        }
        @media (prefers-reduced-motion: reduce) {
          .wave-motion-a,
          .wave-motion-b { animation: none; }
        }
      `}</style>
    </motion.div>
  );
}

export const RoadmapList = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ['start start', 'end start'],
  });

  return (
    <div ref={pageRef} className="relative flex-1 bg-[var(--bg-primary)]">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 max-h-[420px] md:max-h-[460px]">
          <UpperWaveBackground scrollYProgress={scrollYProgress} />
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
