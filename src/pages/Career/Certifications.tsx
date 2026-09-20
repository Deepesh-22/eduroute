import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  ExternalLink,
  Search,
  Sparkles,
  GraduationCap,
  Building2,
  Clock,
  Bot,
  Loader2,
  Target,
} from 'lucide-react';
import { readOnboarding } from '../../utils/onboardingStore';

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
  tags: string[];
};

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
    tags: ['it', 'support', 'networking', 'troubleshooting', 'hardware', 'software', 'helpdesk', 'security'],
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
    tags: ['data', 'analytics', 'sql', 'excel', 'tableau', 'spreadsheet', 'r', 'visualization', 'data analyst'],
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
    tags: ['cloud', 'gcp', 'google cloud', 'devops', 'kubernetes', 'containers'],
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
    tags: ['microsoft', 'azure', 'cloud', 'power platform', 'security', 'developer'],
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
    tags: ['azure', 'cloud', 'az-900', 'microsoft', 'fundamentals'],
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
    tags: ['aws', 'amazon', 'cloud', 'devops', 's3', 'ec2', 'lambda'],
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
    tags: ['aws', 'cloud practitioner', 'cloud', 'architecture', 'security'],
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
    tags: ['frontend', 'front-end', 'react', 'javascript', 'html', 'css', 'ui', 'ux', 'web', 'software', 'developer'],
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
    tags: ['ai', 'cybersecurity', 'security', 'career', 'soft skills', 'ibm'],
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
    tags: ['data science', 'python', 'sql', 'machine learning', 'ml', 'pandas', 'data analyst'],
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
    tags: ['javascript', 'html', 'css', 'react', 'algorithms', 'frontend', 'backend', 'web', 'programming', 'coding'],
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
    tags: ['marketing', 'sales', 'inbound', 'content', 'business', 'email'],
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

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function scoreCourse(course: CertCourse, tokens: string[]): number {
  if (!tokens.length) return 0;
  const hay = `${course.title} ${course.description} ${course.category} ${course.provider} ${course.tags.join(' ')}`.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (course.tags.some((tag) => tag === t || tag.includes(t) || t.includes(tag))) score += 4;
    else if (hay.includes(t)) score += 2;
  }
  return score;
}

function buildDefaultPrompt(): string {
  try {
    const profile = readOnboarding();
    const parts: string[] = [];
    if (profile.interests?.length) parts.push(`Target tracks: ${profile.interests.join(', ')}`);
    if (profile.missingSkills?.length) parts.push(`Skill gaps: ${profile.missingSkills.join(', ')}`);
    const noSkills = (profile.gapAnswers || []).filter((a) => a.answer === 'no').map((a) => a.skill).filter(Boolean);
    if (noSkills.length) parts.push(`Need practice: ${noSkills.join(', ')}`);
    if (parts.length) return parts.join('. ') + '.';
  } catch {
    /* ignore */
  }
  return '';
}

type Suggestion = { course: CertCourse; score: number; reason: string };

function suggestFromCatalog(prompt: string): Suggestion[] {
  const tokens = tokenize(prompt);
  if (!tokens.length) return [];
  const ranked = CERT_COURSES.map((course) => {
    const score = scoreCourse(course, tokens);
    const matchedTags = course.tags.filter((tag) => tokens.some((t) => tag.includes(t) || t.includes(tag)));
    const reason =
      matchedTags.length > 0
        ? `Matches your gaps: ${matchedTags.slice(0, 4).join(', ')}`
        : `Related to ${course.category.toLowerCase()} skills you mentioned`;
    return { course, score, reason };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  return ranked.slice(0, 2);
}

export const Certifications = () => {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [query, setQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestNote, setSuggestNote] = useState('');

  useEffect(() => {
    const defaults = buildDefaultPrompt();
    if (defaults) setAiPrompt(defaults);
  }, []);

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

  const suggestedIds = useMemo(() => new Set((suggestions || []).map((s) => s.course.id)), [suggestions]);

  const runSuggest = () => {
    const text = aiPrompt.trim();
    if (!text) {
      setSuggestNote('Describe your skill gaps or target role (same style as Buddy AI).');
      setSuggestions(null);
      return;
    }
    setSuggesting(true);
    setSuggestNote('');
    window.setTimeout(() => {
      const results = suggestFromCatalog(text);
      setSuggestions(results);
      if (results.length === 0) {
        setSuggestNote('No strong match in our free catalog. Try keywords like React, Python, AWS, data, or cybersecurity.');
      } else {
        setSuggestNote(`Suggested ${results.length} course${results.length > 1 ? 's' : ''} from EDUROUTE’s free industry list (not random).`);
      }
      setSuggesting(false);
    }, 450);
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8">
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
          Start free certification paths from Google, Microsoft, AWS, Meta, IBM, and more. Use{' '}
          <strong className="text-slate-700 dark:text-slate-200">AI Suggest</strong> to get 1–2 courses from this list based on your skill gaps.
        </p>
      </header>

      <section className="mb-10 rounded-[28px] border border-violet-200/80 dark:border-violet-500/30 bg-gradient-to-br from-violet-50/90 via-white to-indigo-50/80 dark:from-violet-950/40 dark:via-slate-900 dark:to-indigo-950/30 p-6 md:p-8 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              AI Suggest course
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/20 px-2 py-0.5 rounded-full">
                Buddy-style
              </span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Paste skill gaps, target role, or interests (like you tell Buddy). We only recommend courses from the free list below — never random outside links.
            </p>
          </div>
        </div>

        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
          Your details / skill gaps
        </label>
        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          rows={3}
          placeholder="e.g. I want frontend developer role. Gaps: React, JavaScript, CSS. Also interested in cloud basics."
          className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/60 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500/30 resize-y min-h-[88px]"
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={runSuggest}
            disabled={suggesting}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60"
          >
            {suggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {suggesting ? 'Finding matches…' : 'Suggest courses'}
          </button>
          {suggestNote && <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{suggestNote}</p>}
        </div>

        {suggestions && suggestions.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map(({ course, reason }) => (
              <div
                key={course.id}
                className="rounded-2xl border border-violet-200 dark:border-violet-500/30 bg-white dark:bg-slate-900 p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-violet-600 dark:text-violet-300 mb-2">
                  <Target className="h-3.5 w-3.5" /> AI pick · {course.provider}
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-base leading-snug">{course.title}</h3>
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{reason}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{course.description}</p>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-violet-500"
                >
                  Start free course <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

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

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => {
          const isAiPick = suggestedIds.has(course.id);
          return (
            <motion.article
              key={course.id}
              variants={cardAnim}
              whileHover={{ y: -8, scale: 1.015 }}
              whileTap={{ scale: 0.99 }}
              className={`flex flex-col rounded-[28px] border p-6 shadow-sm hover:shadow-xl dark:hover:shadow-violet-950/30 transition-shadow duration-300 ${
                isAiPick
                  ? 'border-violet-400 dark:border-violet-500/50 bg-violet-50/50 dark:bg-violet-950/30 ring-2 ring-violet-400/30'
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Free
                  </span>
                  {isAiPick && (
                    <span className="rounded-full bg-violet-100 dark:bg-violet-500/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-violet-700 dark:text-violet-300">
                      AI pick
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-1">
                {course.category} · {course.level}
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug mb-2">{course.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mb-4">{course.description}</p>
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
          );
        })}
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-16">
          No courses match your filters. Try another category or search.
        </p>
      )}

      <p className="mt-10 text-center text-xs text-slate-400 dark:text-slate-500 max-w-xl mx-auto">
        AI Suggest only picks from this EDUROUTE free catalog. Links open official provider sites.
      </p>
    </div>
  );
};

export default Certifications;
