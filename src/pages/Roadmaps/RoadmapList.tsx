import { useEffect, useRef, useState } from 'react';
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

/** Elegant dual-side sine waves — matches Career Paths hero design */
const SIDEBAR_KEY = 'eduroute-sidebar-collapsed';

function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const read = () => {
      try {
        setCollapsed(localStorage.getItem(SIDEBAR_KEY) === '1');
      } catch {
        setCollapsed(false);
      }
    };
    read();
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<{ collapsed?: boolean }>).detail;
      if (typeof detail?.collapsed === 'boolean') setCollapsed(detail.collapsed);
      else read();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === SIDEBAR_KEY) read();
    };
    window.addEventListener('eduroute:sidebar-collapsed', onCustom);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('eduroute:sidebar-collapsed', onCustom);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  return collapsed;
}

function UpperWaveBackground({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const sidebarCollapsed = useSidebarCollapsed();
  const shiftX = sidebarCollapsed ? -20 : 8;

  const leftY = useTransform(scrollYProgress, [0, 0.4], [0, -36]);
  const rightY = useTransform(scrollYProgress, [0, 0.4], [0, 28]);
  const leftX = useTransform(scrollYProgress, [0, 0.4], [0, -24]);
  const rightX = useTransform(scrollYProgress, [0, 0.4], [0, 32]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.35]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
      style={{ opacity }}
      animate={{ x: shiftX }}
      transition={{ type: 'spring', stiffness: 180, damping: 24 }}
    >
      <div className="absolute left-[8%] top-8 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/15" />
      <div className="absolute right-[5%] top-4 h-56 w-56 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-600/15" />

      <motion.svg
        className="absolute left-0 top-[8%] h-[70%] w-[38%] max-w-[420px]"
        viewBox="0 0 420 280"
        fill="none"
        style={{ x: leftX, y: leftY }}
      >
        <g className="wave-drift wave-drift-a">
          <path
            d="M-10 140 C 60 90, 120 190, 190 140 S 320 70, 430 130"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            className="text-slate-400/45 dark:text-slate-400/40"
          />
          <path
            d="M-10 165 C 70 115, 130 210, 200 160 S 330 95, 430 155"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            className="text-indigo-400/40 dark:text-indigo-300/35"
          />
          <path
            d="M-10 115 C 55 70, 115 160, 185 120 S 310 55, 430 110"
            stroke="currentColor"
            strokeWidth="0.95"
            strokeLinecap="round"
            className="text-violet-400/30 dark:text-violet-300/28"
          />
        </g>
        <path
          d="M360 148 L 390 148"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="text-slate-400/50 dark:text-slate-500/45"
        />
        <path
          d="M382 140 L 396 148 L 382 156"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="text-slate-400/50 dark:text-slate-500/45"
        />
      </motion.svg>

      <motion.svg
        className="absolute right-0 top-[5%] h-[75%] w-[42%] max-w-[480px]"
        viewBox="0 0 480 300"
        fill="none"
        style={{ x: rightX, y: rightY }}
      >
        <g className="wave-drift wave-drift-b">
          <path
            d="M-20 100 C 80 50, 150 160, 240 100 S 380 40, 500 95"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            className="text-slate-400/40 dark:text-slate-400/38"
          />
          <path
            d="M-20 130 C 90 80, 160 190, 250 130 S 390 70, 500 125"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
            className="text-indigo-400/35 dark:text-indigo-300/32"
          />
          <path
            d="M-20 160 C 100 110, 170 220, 260 160 S 400 100, 500 155"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-violet-400/30 dark:text-violet-300/28"
          />
          <path
            d="M-20 80 C 70 40, 140 140, 230 85 S 370 30, 500 80"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeLinecap="round"
            className="text-sky-400/25 dark:text-sky-300/22"
          />
          <path
            d="M40 190 C 130 150, 200 240, 290 185 S 420 130, 500 180"
            stroke="currentColor"
            strokeWidth="0.85"
            strokeLinecap="round"
            className="text-fuchsia-400/20 dark:text-fuchsia-300/20"
          />
        </g>
      </motion.svg>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />

      <style>{`
        @keyframes wave-drift-a {
          0%, 100% { transform: translate3d(0, 0); }
          33% { transform: translate3d(10px, -8px); }
          66% { transform: translate3d(-6px, 5px); }
        }
        @keyframes wave-drift-b {
          0%, 100% { transform: translate3d(0, 0); }
          40% { transform: translate3d(-12px, 7px); }
          70% { transform: translate3d(8px, -6px); }
        }
        .wave-drift-a { animation: wave-drift-a 10s ease-in-out infinite; }
        .wave-drift-b { animation: wave-drift-b 13s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .wave-drift-a,
          .wave-drift-b { animation: none; }
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
