import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  ExternalLink,
  Search,
  Sparkles,
  GraduationCap,
  Building2,
  Clock,
  BadgeCheck,
} from 'lucide-react';

type CertCourse = {
  id: string;
  title: string;
  provider: string;
  category: string;
  level: string;
  duration: string;
  description: string;
  url: string;
  free: boolean;
};

/** Official free / free-tier certification & learning paths from top companies */
const CERT_COURSES: CertCourse[] = [
  {
    id: 'google-it',
    title: 'Google IT Support Professional Certificate',
    provider: 'Google',
    category: 'IT Support',
    level: 'Beginner',
    duration: '~6 months',
    description: 'Foundational IT skills — troubleshooting, customer service, networking, and security.',
    url: 'https://www.coursera.org/professional-certificates/google-it-support',
    free: true,
  },
  {
    id: 'google-data',
    title: 'Google Data Analytics Professional Certificate',
    provider: 'Google',
    category: 'Data',
    level: 'Beginner',
    duration: '~6 months',
    description: 'Data cleaning, analysis, and visualization with spreadsheets, SQL, R, and Tableau.',
    url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
    free: true,
  },
  {
    id: 'google-cloud',
    title: 'Google Cloud Skills Boost — Free labs & badges',
    provider: 'Google Cloud',
    category: 'Cloud',
    level: 'All levels',
    duration: 'Self-paced',
    description: 'Hands-on cloud labs and skill badges. Start free with public courses and free trial credits.',
    url: 'https://www.cloudskillsboost.google/',
    free: true,
  },
  {
    id: 'ms-learn',
    title: 'Microsoft Learn — Free training & certifications prep',
    provider: 'Microsoft',
    category: 'Cloud',
    level: 'All levels',
    duration: 'Self-paced',
    description: 'Free modules for Azure, Power Platform, security, and developer tools. Exam prep paths included.',
    url: 'https://learn.microsoft.com/training/',
    free: true,
  },
  {
    id: 'ms-azure-fundamentals',
    title: 'Azure Fundamentals learning path',
    provider: 'Microsoft',
    category: 'Cloud',
    level: 'Beginner',
    duration: '~10 hours',
    description: 'Core Azure concepts, services, and pricing — free on Microsoft Learn (AZ-900 prep).',
    url: 'https://learn.microsoft.com/training/paths/azure-fundamentals/',
    free: true,
  },
  {
    id: 'aws-skillbuilder',
    title: 'AWS Skill Builder — Free digital courses',
    provider: 'Amazon Web Services',
    category: 'Cloud',
    level: 'All levels',
    duration: 'Self-paced',
    description: 'Free AWS cloud courses and learning plans for cloud practitioner and developer tracks.',
    url: 'https://skillbuilder.aws/',
    free: true,
  },
  {
    id: 'aws-cloud-essentials',
    title: 'AWS Cloud Practitioner Essentials',
    provider: 'Amazon Web Services',
    category: 'Cloud',
    level: 'Beginner',
    duration: '~6 hours',
    description: 'Free foundational AWS course covering core services, security, pricing, and architecture.',
    url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials',
    free: true,
  },
  {
    id: 'meta-frontend',
    title: 'Meta Front-End Developer Professional Certificate',
    provider: 'Meta',
    category: 'Development',
    level: 'Beginner',
    duration: '~7 months',
    description: 'HTML, CSS, JavaScript, React, and UI/UX basics from Meta (Coursera; audit free available).',
    url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    free: true,
  },
  {
    id: 'ibm-skillsbuild',
    title: 'IBM SkillsBuild — Free courses & digital badges',
    provider: 'IBM',
    category: 'Career',
    level: 'All levels',
    duration: 'Self-paced',
    description: 'Free AI, cybersecurity, data, and professional skills courses with digital credentials.',
    url: 'https://skillsbuild.org/',
    free: true,
  },
  {
    id: 'ibm-data',
    title: 'IBM Data Science Professional Certificate',
    provider: 'IBM',
    category: 'Data',
    level: 'Beginner',
    duration: '~4 months',
    description: 'Python, SQL, data analysis, and machine learning foundations (Coursera; audit options).',
    url: 'https://www.coursera.org/professional-certificates/ibm-data-science',
    free: true,
  },
  {
    id: 'freecodecamp',
    title: 'freeCodeCamp — Full certifications',
    provider: 'freeCodeCamp',
    category: 'Development',
    level: 'Beginner',
    duration: 'Self-paced',
    description: 'Free responsive web design, JS algorithms, front-end libraries, data visualization, and more.',
    url: 'https://www.freecodecamp.org/learn/',
    free: true,
  },
  {
    id: 'hubspot',
    title: 'HubSpot Academy — Free inbound & marketing certs',
    provider: 'HubSpot',
    category: 'Business',
    level: 'All levels',
    duration: 'Self-paced',
    description: 'Free certifications in inbound marketing, content, email, and sales.',
    url: 'https://academy.hubspot.com/certification-overview',
    free: true,
  },
];

const CATEGORIES = ['All', 'Cloud', 'Data', 'Development', 'IT Support', 'Business', 'Career'] as const;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 360, damping: 28 },
  },
};

export const Certifications = () => {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CERT_COURSES.filter((c) => {
      const catOk = category === 'All' || c.category === category;
      const searchOk =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.provider.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [category, query]);

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300">
            <Award className="h-6 w-6" />
          </div>
          <span className="text-sm font-black uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
            Free industry certs
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 leading-tight">
          Courses &amp; Certificates
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
          Start free certification and training paths from Google, Microsoft, AWS, Meta, IBM, and more.
          Click <strong className="text-slate-700 dark:text-slate-200">Start free course</strong> to open the
          official page in a new tab.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {['100% free to start', 'Top companies', 'Shareable credentials'].map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300"
            >
              <BadgeCheck className="h-3.5 w-3.5" /> {t}
            </span>
          ))}
        </div>
      </header>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-2xl px-4 py-2.5 text-xs font-black uppercase tracking-wide transition ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-950/40'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search provider or skill…"
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filtered.map((course) => (
          <motion.article
            key={course.id}
            variants={cardAnim}
            whileHover={{ y: -8, scale: 1.015 }}
            whileTap={{ scale: 0.99 }}
            className="flex flex-col rounded-[28px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl dark:hover:shadow-violet-950/30 transition-shadow duration-300"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Free
              </span>
            </div>

            <div className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-1">
              {course.category} · {course.level}
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug mb-2">
              {course.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mb-4">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-5">
              <span className="inline-flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" /> {course.provider}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {course.duration}
              </span>
            </div>

            <a
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Start free course
              <ExternalLink className="h-4 w-4 opacity-90" />
            </a>
          </motion.article>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-16">
          No courses match your filters. Try another category or search.
        </p>
      )}

      <p className="mt-10 text-center text-xs text-slate-400 dark:text-slate-500 max-w-xl mx-auto">
        Links go to official provider sites. Some programs offer a free audit or free tier; paid certificates
        may be optional. EDUROUTE does not host or issue these third-party credentials.
      </p>
    </div>
  );
};

export default Certifications;
