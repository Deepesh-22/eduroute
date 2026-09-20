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
import { useRef } from 'react';

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
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 36, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 320, damping: 26 },
  },
};

/** Soft flowing wave lines — works in light & dark */
function WaveBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {/* Ambient glow blobs */}
      <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-indigo-400/10 dark:bg-indigo-500/15 blur-3xl" />
      <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-violet-400/10 dark:bg-violet-600/15 blur-3xl" />
      <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-cyan-400/5 dark:bg-cyan-500/10 blur-3xl" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Wave group 1 — left side, slow drift */}
        <g className="career-wave career-wave-1">
          <path
            d="M-40 220 C 180 140, 320 300, 520 240 S 820 120, 1020 200 S 1280 320, 1520 240"
            stroke="currentColor"
            strokeWidth="1.25"
            className="text-indigo-400/25 dark:text-indigo-400/35"
          />
          <path
            d="M-40 260 C 200 180, 340 340, 540 280 S 840 160, 1040 240 S 1300 360, 1520 280"
            stroke="currentColor"
            strokeWidth="1"
            className="text-violet-400/20 dark:text-violet-400/28"
          />
        </g>

        {/* Wave group 2 — mid, opposite phase */}
        <g className="career-wave career-wave-2">
          <path
            d="M-60 480 C 160 400, 300 560, 500 500 S 800 380, 1000 460 S 1260 580, 1500 500"
            stroke="currentColor"
            strokeWidth="1.15"
            className="text-indigo-300/20 dark:text-indigo-300/30"
          />
          <path
            d="M-60 520 C 180 440, 320 600, 520 540 S 820 420, 1020 500 S 1280 620, 1500 540"
            stroke="currentColor"
            strokeWidth="0.9"
            className="text-fuchsia-400/15 dark:text-fuchsia-400/22"
          />
        </g>

        {/* Wave group 3 — upper right accent */}
        <g className="career-wave career-wave-3">
          <path
            d="M600 80 C 780 20, 900 160, 1080 100 S 1320 40, 1500 120"
            stroke="currentColor"
            strokeWidth="1.1"
            className="text-sky-400/20 dark:text-sky-400/30"
          />
          <path
            d="M640 120 C 820 60, 940 200, 1120 140 S 1360 80, 1540 160"
            stroke="currentColor"
            strokeWidth="0.85"
            className="text-indigo-300/15 dark:text-indigo-300/25"
          />
        </g>

        {/* Soft filled under-wave for depth */}
        <path
          d="M0 720 C 240 640, 480 780, 720 700 S 1200 620, 1440 700 L 1440 900 L 0 900 Z"
          className="fill-indigo-500/[0.03] dark:fill-indigo-400/[0.06]"
        />
      </svg>

      <style>{`
        @keyframes career-wave-drift {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(18px) translateY(-10px); }
        }
        @keyframes career-wave-drift-alt {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-22px) translateY(8px); }
        }
        @keyframes career-wave-drift-slow {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(12px) translateY(-6px); }
        }
        .career-wave-1 {
          animation: career-wave-drift 14s ease-in-out infinite;
          transform-origin: center;
        }
        .career-wave-2 {
          animation: career-wave-drift-alt 18s ease-in-out infinite;
          transform-origin: center;
        }
        .career-wave-3 {
          animation: career-wave-drift-slow 20s ease-in-out infinite;
          transform-origin: center;
        }
        @media (prefers-reduced-motion: reduce) {
          .career-wave-1,
          .career-wave-2,
          .career-wave-3 {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export const RoadmapList = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ['start start', 'end start'],
  });
  const waveY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const waveOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.45]);

  return (
    <div
      ref={pageRef}
      className="relative flex-1 overflow-hidden bg-[var(--bg-primary)]"
    >
      {/* Parallax wave layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ y: waveY, opacity: waveOpacity }}
      >
        <WaveBackground />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl p-4 md:p-8">
        {/* Header — scroll reveal */}
        <motion.header
          className="mb-14 md:mb-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-300">
              <Target className="h-6 w-6" />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              Career Paths
            </span>
          </div>
          <h1 className="mb-6 text-4xl font-black leading-tight text-slate-900 dark:text-white md:text-5xl">
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

        {/* Search */}
        <motion.div
          className="relative mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search career paths..."
            className="w-full rounded-[28px] border border-slate-100 bg-white/90 py-5 pl-16 pr-6 text-lg font-medium text-slate-900 shadow-xl shadow-slate-200/50 outline-none backdrop-blur-sm transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:text-white dark:shadow-black/40"
          />
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
        >
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.id}
                variants={item}
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/roadmaps/${role.id}`)}
                className="group cursor-pointer rounded-[32px] border border-slate-100/80 bg-white/90 p-7 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:shadow-indigo-950/40 md:p-8"
              >
                <div className="mb-6 flex items-start justify-between">
                  <motion.div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${role.color} text-white shadow-lg`}
                    whileHover={{ scale: 1.12, rotate: -4 }}
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

        {/* Bottom CTA */}
        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
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
