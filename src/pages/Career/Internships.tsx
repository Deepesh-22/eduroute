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
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { readOnboarding, type InterestTrack } from '../../utils/onboardingStore';
import {
  applyToInternship,
  getApplication,
  hasApplied,
  readApplications,
  statusBadgeClass,
  type InternshipApplication,
} from '../../utils/internshipApplications';

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
    sector: 'software',
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
    sector: 'software',
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
    sector: 'design',
    verified: false,
    fastTrack: false,
    employeeCount: '50-200 Employees',
    companylink: 'https://creativepulse.com',
  },
  {
    id: '4',
    role: 'Fullstack Developer Intern',
    company: 'Nimbus Labs',
    location: 'Hyderabad, India (Remote)',
    stipend: '₹28,000 / mo',
    type: 'Full-time',
    duration: '6 Months',
    posted: '1 day ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=NL',
    tags: ['React', 'Node.js', 'MongoDB', 'APIs'],
    sector: 'software',
    verified: true,
    fastTrack: true,
    employeeCount: '100-500 Employees',
    companylink: 'https://nimbuslabs.dev',
  },
  {
    id: '5',
    role: 'Mobile App Intern (React Native)',
    company: 'AppNest',
    location: 'Chennai, India',
    stipend: '₹22,000 / mo',
    type: 'Full-time',
    duration: '4 Months',
    posted: '3 days ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AN',
    tags: ['React Native', 'TypeScript', 'Mobile'],
    sector: 'software',
    verified: true,
    fastTrack: false,
    employeeCount: '50-200 Employees',
    companylink: 'https://appnest.io',
  },
  {
    id: '6',
    role: 'Cybersecurity Analyst Intern',
    company: 'ShieldOps',
    location: 'Delhi NCR, India',
    stipend: '₹27,000 / mo',
    type: 'Full-time',
    duration: '6 Months',
    posted: '4 hours ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SO',
    tags: ['Linux', 'Networking', 'SIEM', 'Security'],
    sector: 'cybersecurity',
    verified: true,
    fastTrack: true,
    employeeCount: '200-500 Employees',
    companylink: 'https://shieldops.sec',
  },
  {
    id: '7',
    role: 'SOC / Threat Detection Intern',
    company: 'BlueTeam Grid',
    location: 'Bangalore, India (Remote)',
    stipend: '₹24,000 / mo',
    type: 'Full-time',
    duration: '3 Months',
    posted: '2 days ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=BG',
    tags: ['Linux', 'Networking', 'Web Vulnerabilities', 'Incident Response'],
    sector: 'cybersecurity',
    verified: true,
    fastTrack: false,
    employeeCount: '100-300 Employees',
    companylink: 'https://blueteamgrid.com',
  },
  {
    id: '8',
    role: 'Data Analyst Intern',
    company: 'InsightHive',
    location: 'Gurgaon, India',
    stipend: '₹26,000 / mo',
    type: 'Full-time',
    duration: '5 Months',
    posted: '6 hours ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=IH',
    tags: ['SQL', 'Python', 'Visualization', 'Excel'],
    sector: 'data',
    verified: true,
    fastTrack: true,
    employeeCount: '500-1000 Employees',
    companylink: 'https://insighthive.ai',
  },
  {
    id: '9',
    role: 'Business Intelligence Intern',
    company: 'Metricly',
    location: 'Pune, India (Remote)',
    stipend: '₹20,000 / mo',
    type: 'Part-time',
    duration: '4 Months',
    posted: '5 days ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=MT',
    tags: ['SQL', 'Power BI', 'Statistics', 'Data Cleaning'],
    sector: 'data',
    verified: false,
    fastTrack: false,
    employeeCount: '50-150 Employees',
    companylink: 'https://metricly.co',
  },
  {
    id: '10',
    role: 'Machine Learning Intern',
    company: 'Vector Labs',
    location: 'Bangalore, India',
    stipend: '₹35,000 / mo',
    type: 'Full-time',
    duration: '6 Months',
    posted: '1 day ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=VL',
    tags: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
    sector: 'data',
    verified: true,
    fastTrack: true,
    employeeCount: '200-500 Employees',
    companylink: 'https://vectorlabs.ai',
  },
  {
    id: '11',
    role: 'Cloud / DevOps Intern',
    company: 'CloudTrail India',
    location: 'Hyderabad, India (Remote)',
    stipend: '₹29,000 / mo',
    type: 'Full-time',
    duration: '6 Months',
    posted: '3 days ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CT',
    tags: ['Docker', 'Linux', 'AWS', 'CI/CD'],
    sector: 'software',
    verified: true,
    fastTrack: false,
    employeeCount: '300-800 Employees',
    companylink: 'https://cloudtrail.in',
  },
  {
    id: '12',
    role: 'Product / Growth Intern',
    company: 'Launchpad Co',
    location: 'Mumbai, India (Remote)',
    stipend: '₹18,000 / mo',
    type: 'Part-time',
    duration: '3 Months',
    posted: '1 week ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=LC',
    tags: ['Analytics', 'User Research', 'Spreadsheets', 'Presentation'],
    sector: 'product',
    verified: false,
    fastTrack: false,
    employeeCount: '20-100 Employees',
    companylink: 'https://launchpad.co',
  },
];

const SKILL_TO_TAG_HINTS: Record<string, string[]> = {
  'project building': ['react', 'typescript', 'node.js', 'figma', 'react native', 'mongodb', 'apis'],
  'programming fundamentals': ['react', 'typescript', 'node.js', 'javascript', 'python', 'react native'],
  'data structures': ['typescript', 'node.js', 'postgresql', 'python', 'algorithms'],
  'git & github': ['react', 'typescript', 'node.js', 'docker', 'ci/cd'],
  apis: ['node.js', 'react', 'typescript', 'mongodb', 'rest'],
  'practical experience': ['react', 'typescript', 'node.js', 'docker', 'python'],
  'networking basics': ['docker', 'node.js', 'linux', 'networking', 'security', 'siem'],
  linux: ['docker', 'node.js', 'linux', 'aws', 'security'],
  'cryptography basics': ['docker', 'security', 'linux'],
  'hands-on security practice': ['docker', 'node.js', 'linux', 'security', 'siem', 'incident response'],
  'web vulnerabilities': ['react', 'node.js', 'security', 'web vulnerabilities'],
  'os & network security': ['docker', 'linux', 'networking', 'security', 'siem'],
  spreadsheets: ['postgresql', 'sql', 'excel', 'power bi', 'analytics'],
  sql: ['postgresql', 'node.js', 'sql', 'python', 'data cleaning'],
  'python/r for analysis': ['postgresql', 'node.js', 'python', 'machine learning', 'statistics'],
  visualization: ['figma', 'prototyping', 'power bi', 'excel', 'visualization'],
  statistics: ['postgresql', 'sql', 'python', 'statistics', 'machine learning'],
  'data cleaning': ['postgresql', 'sql', 'python', 'excel', 'data cleaning'],
};

const INTEREST_TAG_BOOSTS: Record<InterestTrack, string[]> = {
  software: ['react', 'typescript', 'tailwind', 'node.js', 'postgresql', 'docker', 'mongodb', 'apis', 'react native', 'aws', 'ci/cd', 'mobile'],
  cybersecurity: ['docker', 'node.js', 'linux', 'networking', 'security', 'siem', 'web vulnerabilities', 'incident response'],
  data_analyst: ['postgresql', 'sql', 'node.js', 'python', 'visualization', 'excel', 'power bi', 'statistics', 'data cleaning', 'machine learning', 'analytics'],
};

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function getStudentSkillProfile() {
  const profile = readOnboarding();
  const strengths = (profile.gapAnswers || []).filter((a) => a.answer === 'yes').map((a) => normalize(a.skill));
  const missing = (profile.missingSkills || []).map(normalize);
  const strengthTokens = new Set<string>();
  for (const skill of strengths) {
    strengthTokens.add(skill);
    (SKILL_TO_TAG_HINTS[skill] || []).forEach((h) => strengthTokens.add(h));
  }
  for (const interest of profile.interests || []) {
    (INTEREST_TAG_BOOSTS[interest] || []).forEach((h) => strengthTokens.add(h));
  }
  const missingTokens = new Set<string>();
  for (const skill of missing) {
    missingTokens.add(skill);
    (SKILL_TO_TAG_HINTS[skill] || []).forEach((h) => missingTokens.add(h));
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

function computeMatchScore(tags: string[], profile: ReturnType<typeof getStudentSkillProfile>): number {
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
type FilterKey = 'all' | 'frontend' | 'backend' | 'remote' | 'cyber' | 'data' | 'design';

function MyApplicationsPanel() {
  const [apps, setApps] = useState<InternshipApplication[]>(() => readApplications());
  useEffect(() => {
    const refresh = () => setApps(readApplications());
    window.addEventListener('eduroute:applications-updated', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('eduroute:applications-updated', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  if (apps.length === 0) return null;
  return (
    <section className="mb-10 rounded-[28px] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">My Applications</h2>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{apps.length} total</span>
      </div>
      <ul className="space-y-3">
        {apps.map((app) => (
          <li
            key={app.internshipId}
            className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-800/40"
          >
            <div className="min-w-0">
              <div className="truncate font-bold text-slate-900 dark:text-white">{app.role}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {app.company} · Applied {new Date(app.appliedAt).toLocaleDateString()}
              </div>
            </div>
            <span className={`shrink-0 self-start rounded-full px-3 py-1 text-[11px] font-bold sm:self-center ${statusBadgeClass(app.status)}`}>
              {app.status}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
        Status: Applied → Shortlisted → Interview → Hired (saved with your login on this device).
      </p>
    </section>
  );
}

function InternshipCard({
  job,
  matchScore,
  showScore,
}: {
  job: Internship;
  matchScore: number;
  showScore: boolean;
}) {
  const [application, setApplication] = useState<InternshipApplication | null>(() => getApplication(job.id) || null);
  useEffect(() => {
    const refresh = () => setApplication(getApplication(job.id) || null);
    window.addEventListener('eduroute:applications-updated', refresh);
    return () => window.removeEventListener('eduroute:applications-updated', refresh);
  }, [job.id]);
  const applied = Boolean(application) || hasApplied(job.id);
  const handleApply = () => {
    if (applied) return;
    const app = applyToInternship({
      internshipId: job.id,
      role: job.role,
      company: job.company,
      location: job.location,
      stipend: job.stipend,
      logo: job.logo,
    });
    if (app) setApplication(app);
  };
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-slate-950/50"
    >
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[28px] bg-slate-100 dark:bg-slate-800 md:h-20 md:w-20">
          <img src={job.logo} alt={job.company} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
              {job.role}
            </h3>
            {showScore && (
              <div
                className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${matchBadgeClasses(matchScore)}`}
                title="Skill match based on your onboarding profile"
              >
                <Target className="h-3 w-3" />
                {matchScore}% MATCH
              </div>
            )}
            {job.verified && (
              <div className="flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                <ShieldCheck className="h-3 w-3" /> VERIFIED
              </div>
            )}
            {job.fastTrack && (
              <div className="flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                <Zap className="h-3 w-3" /> FAST TRACK
              </div>
            )}
          </div>
          <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link to={`/companies/${job.id}`} className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400">
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
                className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between gap-6 border-t border-slate-50 pt-6 dark:border-slate-800 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div className="text-right">
            <div className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Posted</div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{job.posted}</div>
          </div>
          <div className="flex w-full flex-col items-stretch gap-2 lg:w-auto lg:items-end">
            <button
              type="button"
              onClick={handleApply}
              disabled={applied}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 font-bold shadow-lg transition-all lg:w-auto ${
                applied
                  ? 'cursor-not-allowed bg-emerald-600 text-white opacity-95'
                  : 'bg-slate-900 text-white hover:bg-indigo-600 group-hover:shadow-indigo-100 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:group-hover:shadow-indigo-900/30'
              }`}
            >
              {applied ? (
                <>
                  <Check className="h-4 w-4" /> Applied
                </>
              ) : (
                <>
                  Apply Now <ArrowUpRight className="h-4 w-4" />
                </>
              )}
            </button>
            {application && (
              <span className={`inline-flex justify-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${statusBadgeClass(application.status)}`}>
                {application.status}
              </span>
            )}
            <Link
              to={`/companies/${job.id}`}
              className="text-center text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              View company
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function matchesSectorFilter(job: Internship, filter: FilterKey): boolean {
  if (filter === 'all') return true;
  const role = job.role.toLowerCase();
  if (filter === 'frontend') return role.includes('frontend') || role.includes('ui/ux') || role.includes('mobile');
  if (filter === 'backend') return role.includes('backend') || role.includes('devops') || role.includes('cloud') || role.includes('fullstack');
  if (filter === 'remote') return job.location.toLowerCase().includes('remote');
  if (filter === 'cyber') return job.sector === 'cybersecurity' || role.includes('security') || role.includes('soc');
  if (filter === 'data') return job.sector === 'data' || role.includes('data') || role.includes('machine learning') || role.includes('intelligence');
  if (filter === 'design') return job.sector === 'design' || role.includes('ui/ux') || role.includes('product');
  return true;
}

export const Internships = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const skillProfile = useMemo(() => getStudentSkillProfile(), []);
  const scoredInternships = useMemo(() => {
    return INTERNSHIPS.map((job) => ({
      job,
      matchScore: computeMatchScore(job.tags, skillProfile),
    }));
  }, [skillProfile]);
  const filteredInternships = useMemo(() => {
    return scoredInternships.filter(({ job }) => {
      const searchable = `${job.role} ${job.company} ${job.location} ${job.tags.join(' ')} ${job.sector}`.toLowerCase();
      return searchable.includes(query.trim().toLowerCase()) && matchesSectorFilter(job, filter);
    });
  }, [filter, query, scoredInternships]);
  const recommended = useMemo(() => {
    if (!skillProfile.hasProfile) return [];
    return [...filteredInternships].filter((item) => item.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);
  }, [filteredInternships, skillProfile.hasProfile]);
  const filterBtn = (key: FilterKey, label: string) => (
    <button
      type="button"
      key={key}
      onClick={() => setFilter(key)}
      className={`shrink-0 rounded-xl px-5 py-3 font-bold ${
        filter === key
          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300'
          : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="mx-auto max-w-7xl flex-1 p-4 md:p-8">
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-black text-slate-900 dark:text-white">Career Connect</h1>
        <p className="max-w-2xl text-lg text-slate-500 dark:text-slate-400">
          Exclusive internship opportunities across software, cybersecurity, data, design, and more. Matched to your
          skill profile when available.
        </p>
      </header>
      <MyApplicationsPanel />
      <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search roles, companies, or skills..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>
        <div className="flex w-full gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
          <button
            type="button"
            className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Filter className="h-4 w-4" /> Filters
          </button>
          {filterBtn('all', 'All')}
          {filterBtn('frontend', 'Frontend')}
          {filterBtn('backend', 'Backend / Cloud')}
          {filterBtn('cyber', 'Cybersecurity')}
          {filterBtn('data', 'Data / ML')}
          {filterBtn('design', 'Design / Product')}
          {filterBtn('remote', 'Remote Only')}
        </div>
      </div>
      {skillProfile.hasProfile && recommended.length > 0 && (
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Recommended for you</h2>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
        <div className="mb-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
          Complete more skill-gap answers in onboarding to unlock stronger internship matches. Browse all openings below.
        </div>
      )}
      {!skillProfile.hasProfile && (
        <div className="mb-10 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 px-6 py-5 text-sm text-slate-600 dark:border-indigo-900 dark:bg-indigo-950/20 dark:text-slate-300">
          Finish the post-signup skill quiz to see a personalized <strong>Recommended for you</strong> list with match
          scores.
        </div>
      )}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">All opportunities</h2>
      </div>
      <div className="space-y-6">
        {filteredInternships.map(({ job, matchScore }) => (
          <InternshipCard key={job.id} job={job} matchScore={matchScore} showScore={skillProfile.hasProfile} />
        ))}
      </div>
      <div className="mt-12 text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Showing {filteredInternships.length} of {INTERNSHIPS.length} opportunities
        </p>
      </div>
    </div>
  );
};

export default Internships;
