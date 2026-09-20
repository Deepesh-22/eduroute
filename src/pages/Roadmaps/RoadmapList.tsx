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
    trending: false,
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
    level: 'Beginner to Pro',
    modules: 14,
    trending: false,
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
    level: 'Comprehensive',
    modules: 22,
    trending: true,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 380, damping: 28 },
  },
};

export const RoadmapList = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl text-indigo-600 dark:text-indigo-300 shadow-sm">
            <Target className="h-6 w-6" />
          </div>
          <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">
            Career Paths
          </span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
          Your Career Journey, <br />
          Visualized.
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl font-medium leading-relaxed">
          Follow industry-standard paths designed to take you from absolute zero to a professional role.
          Each step is verified by experts.
        </p>
      </header>

      <div className="mb-12 relative max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search career paths..."
          className="w-full pl-16 pr-6 py-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] shadow-xl shadow-slate-200/50 dark:shadow-black/40 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-lg text-slate-900 dark:text-white placeholder:text-slate-400"
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
              className="group cursor-pointer rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-2xl dark:hover:shadow-indigo-950/40 transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${role.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                {role.trending && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    <TrendingUp className="h-3 w-3" /> Trending
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {role.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{role.description}</p>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>{role.level}</span>
                <span>{role.modules} modules</span>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Start path <ChevronRight className="h-4 w-4" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default RoadmapList;
