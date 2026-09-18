import { motion } from 'framer-motion';
import {
  MapPin,
  Search,
  Filter,
  Clock,
  Building2,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { readOnboarding, type InterestTrack } from '../../utils/onboardingStore';

export const INTERNSHIPS = [
  {
    id: '1',
    role: 'Frontend Developer Intern',
    company: 'TechFlow Systems',
    location: 'Bangalore, India (Remote)',
    stipend: '₹25,000 / mo',
    type: 'Full-time',
    duration: '6 Months',
    posted: '2 days ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TF',
    tags: ['React', 'TypeScript', 'Tailwind'],
    verified: true,
    fastTrack: true,
    employeeCount: '500-1000 Employees',
    companylink: 'https://techflow.ai',
  },
  {
    id: '2',
    role: 'Backend Engineering Intern',
    company: 'DataScale AI',
    location: 'Pune, India',
    stipend: '₹30,000 / mo',
    type: 'Full-time',
    duration: '3 Months',
    posted: '5 hours ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=DS',
    tags: ['Node.js', 'PostgreSQL', 'Docker'],
    verified: true,
    fastTrack: false,
    employeeCount: '200-500 Employees',
    companylink: 'https://datascale.ai',
  },
  {
    id: '3',
    role: 'UI/UX Design Intern',
    company: 'CreativePulse',
    location: 'Mumbai, India',
    stipend: '₹15,000 / mo',
    type: 'Part-time',
    duration: '4 Months',
    posted: '1 week ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CP',
    tags: ['Figma', 'Prototyping', 'User Research'],
    verified: false,
    fastTrack: false,
    employeeCount: '50-200 Employees',
    companylink: 'https://creativepulse.com',
  },
];

/** Soft skill labels from onboarding quiz → internship tag keywords */
const SKILL_TO_TAG_HINTS: Record<string, string[]> = {
  'project building': ['react', 'typescript', 'node.js', 'figma'],
  'programming fundamentals': ['react', 'typescript', 'node.js', 'javascript'],
  'data structures': ['typescript', 'node.js', 'postgresql'],
  'git & github': ['react', 'typescript', 'node.js', 'docker'],
  apis: ['node.js', 'react', 'typescript'],
  'practical experience': ['react', 'typescript', 'node.js', 'docker'],
  'networking basics': ['docker', 'node.js'],
  linux: ['docker', 'node.js'],
  'cryptography basics': ['docker'],
  'hands-on security practice': ['docker', 'node.js'],
  'web vulnerabilities': ['react', 'node.js'],
  'os & network security': ['docker', 'linux'],
  spreadsheets: ['postgresql', 'sql'],
  sql: ['postgresql', 'node.js'],
  'python/r for analysis': ['postgresql', 'node.js'],
  visualization: ['figma', 'prototyping'],
  statistics: ['postgresql'],
  'data cleaning': ['postgresql', 'sql'],
};

/** Interest tracks boost related role / tag families */
const INTEREST_TAG_BOOSTS: Record<InterestTrack, string[]> = {
  software: ['react', 'typescript', 'tailwind', 'node.js', 'postgresql', 'docker'],
  cybersecurity: ['docker', 'node.js', 'linux'],
  data_analyst: ['postgresql', 'sql', 'node.js'],
};

function normalize(s: string) {
  return s.trim().toLowerCase();
}

/** Build student skill tokens from strengths (yes) + interest boosts; missingSkills reduce match. */
function getStudentSkillProfile() {
  const profile = readOnboarding();
  const strengths = (profile.gapAnswers || [])
    .filter((a) => a.answer === 'yes')
    .map((a) => normalize(a.skill));
  const missing = (profile.missingSkills || []).map(normalize);

  const strengthTokens = new Set<string>();
  for (const skill of strengths) {
    strengthTokens.add(skill);
    const hints = SKILL_TO_TAG_HINTS[skill] || [];
    hints.forEach((h) => strengthTokens.add(h));
  }
  for (const interest of profile.interests || []) {
    (INTEREST_TAG_BOOSTS[interest] || []).forEach((h) => strengthTokens.add(h));
  }

  const missingTokens = new Set<string>();
  for (const skill of missing) {
    missingTokens.add(skill);
    const hints = SKILL_TO_TAG_HINTS[skill] || [];
    hints.forEach((h) => missingTokens.add(h));
  }

  return {
    hasProfile: Boolean(profile.completedAt),
    strengths,
    missing,
    strengthTokens,
    missingTokens,
    interests: profile.interests || [],
  };
}

/**
 * Match %: share of internship required tags covered by student strengths/interests,
 * with a small penalty when required tags align with known missing skills.
 */
function computeMatchScore(
  tags: string[],
  profile: ReturnType<typeof getStudentSkillProfile>,
): number {
  if (!tags.length) return profile.hasProfile ? 50 : 0;
  if (!profile.hasProfile) return 0;

  let covered = 0;
  let missingHits = 0;
  for (const tag of tags) {
    const t = normalize(tag);
    const strengthHit =
      profile.strengthTokens.has(t) ||
      [...profile.strengthTokens].some((s) => t.includes(s) || s.includes(t));
    if (strengthHit) covered += 1;
    const missingHit =
      profile.missingTokens.has(t) ||
      [...profile.missingTokens].some((s) => t.includes(s) || s.includes(t));
    if (missingHit && !strengthHit) missingHits += 1;
  }

  let pct = Math.round((covered / tags.length) * 100);
  pct = Math.max(0, pct - missingHits * 10);

  if (pct === 0 && profile.interests.length > 0) {
    const roleBoost = tags.some((tag) => {
      const t = normalize(tag);
      return profile.interests.some((interest) =>
        (INTEREST_TAG_BOOSTS[interest] || []).some((b) => t.includes(b) || b.includes(t)),
      );
    });
    if (roleBoost) pct = 25;
  }

  return Math.min(100, pct);
}

function matchBadgeClasses(score: number) {
  if (score >= 70) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
  }
  if (score >= 40) {
    return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
  }
  return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
}

type Internship = (typeof INTERNSHIPS)[number];

function InternshipCard({
  job,
  matchScore,
  showScore,
}: {
  job: Internship;
  matchScore: number;
  showScore: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm transition-all hover:shadow-xl dark:hover:shadow-slate-950/50"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="h-16 w-16 md:h-20 md:w-20 rounded-[28px] bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden flex items-center justify-center">
          <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {job.role}
            </h3>
            {showScore && (
              <div
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${matchBadgeClasses(matchScore)}`}
                title="Skill match based on your onboarding profile"
              >
                <Target className="h-3 w-3" />
                {matchScore}% MATCH
              </div>
            )}
            {job.verified && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 rounded-full text-[10px] font-bold border border-blue-100 dark:border-blue-800">
                <ShieldCheck className="h-3 w-3" /> VERIFIED
              </div>
            )}
            {job.fastTrack && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300 rounded-full text-[10px] font-bold border border-amber-100 dark:border-amber-800">
                <Zap className="h-3 w-3" /> FAST TRACK
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
            <Link
              to={`/companies/${job.id}`}
              className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <Building2 className="h-4 w-4" /> {job.company}
            </Link>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {job.location}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> {job.stipend}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> {job.duration}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between items-end gap-6 border-t lg:border-t-0 lg:border-l border-slate-50 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-8">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Posted</div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{job.posted}</div>
          </div>
          <Link
            to={`/companies/${job.id}`}
            className="w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all shadow-lg group-hover:shadow-indigo-100 dark:group-hover:shadow-indigo-900/30"
          >
            Apply Now <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export const Internships = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'frontend' | 'backend' | 'remote'>('all');

  const skillProfile = useMemo(() => getStudentSkillProfile(), []);

  const scoredInternships = useMemo(() => {
    return INTERNSHIPS.map((job) => ({
      job,
      matchScore: computeMatchScore(job.tags, skillProfile),
    }));
  }, [skillProfile]);

  const filteredInternships = useMemo(() => {
    return scoredInternships.filter(({ job }) => {
      const searchable = `${job.role} ${job.company} ${job.location} ${job.tags.join(' ')}`.toLowerCase();
      const matchesQuery = searchable.includes(query.trim().toLowerCase());
      const matchesFilter =
        filter === 'all' ||
        (filter === 'frontend' && job.role.toLowerCase().includes('frontend')) ||
        (filter === 'backend' && job.role.toLowerCase().includes('backend')) ||
        (filter === 'remote' && job.location.toLowerCase().includes('remote'));
      return matchesQuery && matchesFilter;
    });
  }, [filter, query, scoredInternships]);

  const recommended = useMemo(() => {
    if (!skillProfile.hasProfile) return [];
    return [...filteredInternships]
      .filter((item) => item.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [filteredInternships, skillProfile.hasProfile]);

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4 dark:text-white">Career Connect</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
          Exclusive internship opportunities for EDUROUTE learners. Apply to verified companies based
          on your roadmap progress.
        </p>
      </header>

      <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search roles or companies..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
          >
            <Filter className="h-4 w-4" /> Filters
          </button>
          <button
            type="button"
            onClick={() => setFilter('frontend')}
            className={`px-5 py-3 rounded-xl font-bold shrink-0 ${
              filter === 'frontend'
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300'
                : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Frontend
          </button>
          <button
            type="button"
            onClick={() => setFilter('backend')}
            className={`px-5 py-3 rounded-xl font-bold shrink-0 ${
              filter === 'backend'
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300'
                : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Backend
          </button>
          <button
            type="button"
            onClick={() => setFilter('remote')}
            className={`px-5 py-3 rounded-xl font-bold shrink-0 ${
              filter === 'remote'
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300'
                : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Remote Only
          </button>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className="px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold shrink-0"
          >
            All
          </button>
        </div>
      </div>

      {skillProfile.hasProfile && recommended.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Recommended for you</h2>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Based on your skill profile
            </span>
          </div>
          <div className="space-y-6">
            {recommended.map(({ job, matchScore }) => (
              <InternshipCard key={`rec-${job.id}`} job={job} matchScore={matchScore} showScore />
            ))}
          </div>
        </section>
      )}

      {skillProfile.hasProfile && recommended.length === 0 && (
        <div className="mb-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/50 px-6 py-5 text-sm text-slate-500 dark:text-slate-400">
          Complete more skill-gap answers in onboarding to unlock stronger internship matches. Browse
          all openings below.
        </div>
      )}

      {!skillProfile.hasProfile && (
        <div className="mb-10 rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
          Finish the post-signup skill quiz to see a personalized <strong>Recommended for you</strong>{' '}
          list with match scores.
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">All opportunities</h2>
      </div>

      <div className="space-y-6">
        {filteredInternships.map(({ job, matchScore }) => (
          <InternshipCard
            key={job.id}
            job={job}
            matchScore={matchScore}
            showScore={skillProfile.hasProfile}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Showing {filteredInternships.length} opportunities
        </p>
      </div>
    </div>
  );
};
