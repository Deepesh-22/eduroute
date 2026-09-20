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

/** Continuous floating dual-side waves — clearly visible, infinite loop */
function UpperWaveBackground({
  scrollYProgress,
}: {
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const driftY = useTransform(scrollYProgress, [0, 0.6], [0, -24]);
  const waveOpacity = useTransform(scrollYProgress, [0, 0.2, 0.55], [1, 0.98, 0.35]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
      style={{ opacity: waveOpacity, y: driftY }}
    >
      <div className="absolute left-[4%] top-4 h-48 w-48 rounded-full bg-indigo-400/15 blur-3xl dark:bg-indigo-500/20" />
      <div className="absolute right-[2%] top-0 h-64 w-64 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-600/22" />
      <div className="absolute left-1/2 top-10 h-40 w-72 -translate-x-1/2 rounded-full bg-fuchsia-400/8 blur-3xl dark:bg-fuchsia-500/12" />

      <svg
        className="absolute inset-x-0 top-[8%] h-[85%] w-full"
        viewBox="0 0 1440 320"
        fill="none"
        preserveAspectRatio="none"
      >
        <g className="rm-wave rm-wave-a">
          <path
            d="M-40 160 C 120 60, 280 260, 440 160 S 720 40, 880 160 S 1160 280, 1320 150 S 1480 80, 1520 160"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="text-indigo-400/70 dark:text-indigo-300/75"
          />
          <path
            d="M-40 190 C 140 90, 300 290, 460 190 S 740 70, 900 190 S 1180 300, 1340 180 S 1500 100, 1520 190"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="text-violet-400/60 dark:text-violet-300/65"
          />
          <path
            d="M-40 130 C 100 40, 260 220, 420 130 S 700 20, 860 130 S 1140 250, 1300 120 S 1460 50, 1520 130"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-slate-400/55 dark:text-slate-300/55"
          />
        </g>

        <g className="rm-wave rm-wave-b">
          <path
            d="M-20 200 C 160 110, 320 300, 480 200 S 760 90, 920 200 S 1200 310, 1360 195 S 1520 120, 1540 200"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            className="text-fuchsia-400/55 dark:text-fuchsia-300/60"
          />
          <path
            d="M-20 100 C 180 20, 340 180, 500 100 S 780 10, 940 100 S 1220 210, 1380 95 S 1520 40, 1540 100"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="text-indigo-300/50 dark:text-indigo-200/55"
          />
          <path
            d="M-20 220 C 150 140, 310 310, 470 220 S 750 120, 910 220 S 1190 320, 1350 215 S 1510 150, 1540 220"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            className="text-violet-300/45 dark:text-violet-200/50"
          />
        </g>

        <g className="rm-wave rm-wave-c">
          <path
            d="M0 150 C 200 70, 360 240, 520 150 S 800 50, 960 150 S 1240 260, 1400 145 S 1520 90, 1560 150"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            className="text-sky-400/50 dark:text-sky-300/55"
          />
          <path
            d="M0 175 C 180 95, 340 265, 500 175 S 780 75, 940 175 S 1220 285, 1380 170 S 1520 110, 1560 175"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="text-indigo-400/40 dark:text-indigo-300/45"
          />
        </g>
      </svg>

      <svg
        className="absolute left-0 top-[10%] h-[70%] w-[42%] max-w-[420px]"
        viewBox="0 0 400 280"
        fill="none"
        preserveAspectRatio="xMinYMid meet"
      >
        <g className="rm-wave rm-wave-a">
          <path d="M-10 140 C 60 70, 120 210, 190 140 S 300 60, 390 135" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-indigo-500/65 dark:text-indigo-300/70" />
          <path d="M-10 165 C 70 95, 130 235, 200 165 S 310 85, 390 160" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-violet-500/55 dark:text-violet-300/60" />
        </g>
        <g className="rm-wave rm-wave-b">
          <path d="M-10 115 C 55 55, 115 185, 185 115 S 295 45, 390 110" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-slate-400/50 dark:text-slate-300/55" />
        </g>
      </svg>

      <svg
        className="absolute right-0 top-[6%] h-[78%] w-[48%] max-w-[520px]"
        viewBox="0 0 520 300"
        fill="none"
        preserveAspectRatio="xMaxYMid meet"
      >
        <g className="rm-wave rm-wave-b">
          <path d="M20 150 C 110 70, 200 240, 300 150 S 420 60, 520 145" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-indigo-400/70 dark:text-indigo-300/75" />
          <path d="M30 175 C 120 95, 210 265, 310 175 S 430 85, 520 170" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-violet-400/60 dark:text-violet-300/65" />
          <path d="M40 125 C 130 55, 220 210, 320 125 S 440 50, 520 120" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-fuchsia-400/50 dark:text-fuchsia-300/55" />
        </g>
        <g className="rm-wave rm-wave-c">
          <path d="M50 200 C 140 130, 230 280, 340 200 S 450 120, 520 195" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-sky-400/45 dark:text-sky-300/50" />
          <path d="M60 100 C 150 40, 240 180, 350 100 S 460 35, 520 95" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" className="text-indigo-300/40 dark:text-indigo-200/48" />
        </g>
      </svg>

      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />

      <style>{`
        @keyframes rm-wave-a {
          0%   { transform: translate3d(0, 0px) rotate(0deg); }
          25%  { transform: translate3d(12px, -42px) rotate(0.4deg); }
          50%  { transform: translate3d(-8px, 38px) rotate(-0.3deg); }
          75%  { transform: translate3d(10px, -36px) rotate(0.25deg); }
          100% { transform: translate3d(0, 0px) rotate(0deg); }
        }
        @keyframes rm-wave-b {
          0%   { transform: translate3d(0, 0px) rotate(0deg); }
          20%  { transform: translate3d(-14px, 44px) rotate(-0.35deg); }
          45%  { transform: translate3d(10px, -48px) rotate(0.4deg); }
          70%  { transform: translate3d(-12px, 32px) rotate(-0.2deg); }
          100% { transform: translate3d(0, 0px) rotate(0deg); }
        }
        @keyframes rm-wave-c {
          0%   { transform: translate3d(0, 0px); }
          33%  { transform: translate3d(16px, -50px); }
          66%  { transform: translate3d(-12px, 46px); }
          100% { transform: translate3d(0, 0px); }
        }
        .rm-wave {
          transform-box: fill-box;
          transform-origin: center center;
          will-change: transform;
        }
        .rm-wave-a {
          animation: rm-wave-a 4.2s ease-in-out infinite;
        }
        .rm-wave-b {
          animation: rm-wave-b 5.1s ease-in-out infinite;
          animation-delay: -1.2s;
        }
        .rm-wave-c {
          animation: rm-wave-c 3.6s ease-in-out infinite;
          animation-delay: -0.6s;
        }
        @media (prefers-reduced-motion: reduce) {
          .rm-wave-a, .rm-wave-b, .rm-wave-c { animation: none; }
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
