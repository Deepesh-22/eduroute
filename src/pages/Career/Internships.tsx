import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  IndianRupee,
  Building2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  applyToInternship,
  hasApplied,
  readApplications,
  statusBadgeClass,
  type InternshipApplication,
} from '../../utils/internshipApplications';
import { industryPostingsAsInternships } from '../../utils/industryStore';
import { readOnboarding } from '../../utils/onboardingStore';
import { BuildCvCta } from '../../components/BuildCvCta';

export const INTERNSHIPS = [
  {
    id: 'tf-frontend',
    role: 'Frontend Developer Intern',
    company: 'TechFlow Systems',
    location: 'Bangalore, India',
    stipend: '₹25,000 / mo',
    type: 'Internship',
    duration: '3 Months',
    mode: 'Remote',
    posted: '2 days ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TF',
    tags: ['React', 'TypeScript', 'CSS'],
    sector: 'software',
    verified: true,
    fastTrack: true,
    employeeCount: '200-500',
    companylink: '#',
    description: 'Build modern UI features with the product engineering team.',
    generalMatch: 86,
  },
  {
    id: 'ih-data',
    role: 'Data Analyst Intern',
    company: 'InsightHive',
    location: 'Gurgaon, India',
    stipend: '₹26,000 / mo',
    type: 'Internship',
    duration: '4 Months',
    mode: 'Hybrid',
    posted: '1 week ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=IH',
    tags: ['SQL', 'Python', 'Excel'],
    sector: 'data',
    verified: true,
    fastTrack: false,
    employeeCount: '50-200',
    companylink: '#',
    description: 'Support analytics, reporting, and dashboarding for growth teams.',
    generalMatch: 78,
  },
  {
    id: 'so-cyber',
    role: 'Cybersecurity Analyst Intern',
    company: 'ShieldOps',
    location: 'Delhi NCR, India',
    stipend: '₹27,000 / mo',
    type: 'Internship',
    duration: '6 Months',
    mode: 'Onsite',
    posted: '3 days ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SO',
    tags: ['Linux', 'Networking', 'SIEM'],
    sector: 'cyber',
    verified: true,
    fastTrack: true,
    employeeCount: '100-300',
    companylink: '#',
    description: 'Assist the SOC with alert triage and vulnerability scans.',
    generalMatch: 72,
  },
  {
    id: 'np-fullstack',
    role: 'Full Stack Developer Intern',
    company: 'NovaPath Labs',
    location: 'Pune, India',
    stipend: '₹28,000 / mo',
    type: 'Internship',
    duration: '6 Months',
    mode: 'Hybrid',
    posted: '4 days ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=NP',
    tags: ['React', 'Node.js', 'MongoDB'],
    sector: 'software',
    verified: true,
    fastTrack: true,
    employeeCount: '100-250',
    companylink: '#',
    description: 'Ship features across web frontend and Node APIs in an agile squad.',
    generalMatch: 81,
  },
  {
    id: 'ql-ml',
    role: 'ML Engineering Intern',
    company: 'QuantLeaf AI',
    location: 'Hyderabad, India',
    stipend: '₹30,000 / mo',
    type: 'Internship',
    duration: '5 Months',
    mode: 'Remote',
    posted: '5 days ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=QL',
    tags: ['Python', 'ML', 'PyTorch'],
    sector: 'data',
    verified: true,
    fastTrack: false,
    employeeCount: '50-150',
    companylink: '#',
    description: 'Prototype models, evaluate metrics, and support production ML pipelines.',
    generalMatch: 74,
  },
  {
    id: 'cx-cloud',
    role: 'Cloud & DevOps Intern',
    company: 'CloudNest',
    location: 'Mumbai, India',
    stipend: '₹24,000 / mo',
    type: 'Internship',
    duration: '3 Months',
    mode: 'Onsite',
    posted: '6 days ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CN',
    tags: ['AWS', 'Docker', 'Linux'],
    sector: 'software',
    verified: true,
    fastTrack: false,
    employeeCount: '200-400',
    companylink: '#',
    description: 'Help maintain CI/CD pipelines and cloud infrastructure with the platform team.',
    generalMatch: 69,
  },
];

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9+#.]/g, '');
}

function getStudentSkillProfile() {
  try {
    const ob = readOnboarding();
    const strengths: string[] = [];
    const missing = ob.missingSkills || [];
    for (const a of ob.gapAnswers || []) {
      if (a.answer === 'yes' && a.skill) strengths.push(a.skill);
    }
    return {
      hasProfile: strengths.length > 0 || missing.length > 0 || (ob.interests || []).length > 0,
      strengthTokens: new Set(strengths.map(normalize).filter(Boolean)),
      missingTokens: new Set(missing.map(normalize).filter(Boolean)),
      interests: ob.interests || [],
    };
  } catch {
    return {
      hasProfile: false,
      strengthTokens: new Set<string>(),
      missingTokens: new Set<string>(),
      interests: [] as string[],
    };
  }
}

function computeMatchScore(tags: string[], profile: ReturnType<typeof getStudentSkillProfile>): number {
  if (!tags.length) return profile.hasProfile ? 45 : 0;
  if (!profile.hasProfile) return 0;
  let strengthPoints = 0;
  let missingPenalty = 0;
  let softHits = 0;
  for (const tag of tags) {
    const t = normalize(tag);
    const strengthHit =
      profile.strengthTokens.has(t) ||
      [...profile.strengthTokens].some((s) => s.length >= 3 && (t.includes(s) || s.includes(t)));
    if (strengthHit) {
      strengthPoints += 1;
      continue;
    }
    const missingHit =
      profile.missingTokens.has(t) ||
      [...profile.missingTokens].some((s) => s.length >= 3 && (t.includes(s) || s.includes(t)));
    if (missingHit) missingPenalty += 1;
    else softHits += 0.15;
  }
  const coverage = strengthPoints / tags.length;
  let pct = Math.round(coverage * 85 + softHits * 8 + (profile.hasProfile ? 8 : 0));
  pct = Math.max(0, pct - missingPenalty * 12);
  return Math.min(99, Math.max(12, pct));
}

function matchesSectorFilter(job: { sector?: string; tags: string[] }, filter: string) {
  if (filter === 'all') return true;
  if (job.sector === filter) return true;
  const blob = job.tags.join(' ').toLowerCase();
  if (filter === 'software') return /react|typescript|node|frontend|backend|full.?stack|javascript|docker|aws/.test(blob);
  if (filter === 'data') return /data|sql|python|analytics|ml|pytorch/.test(blob);
  if (filter === 'cyber') return /cyber|security|linux|network|siem/.test(blob);
  return true;
}

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
    <section className="mb-10 rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/90 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/80 dark:from-slate-900 dark:to-slate-950">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">My Applications</h2>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{apps.length} total</span>
      </div>
      <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
        Pipeline: Applied → Shortlisted → Interview → Offer → Hired → Completed
      </p>
      <ul className="space-y-3">
        {apps.map((app) => (
          <li
            key={app.internshipId}
            className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="truncate font-bold text-slate-900 dark:text-white">{app.role}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {app.company}
                  {app.duration ? ` · ${app.duration}` : ''}
                  {app.mode ? ` · ${app.mode}` : ''}
                  {' · '}Applied {new Date(app.appliedAt).toLocaleDateString()}
                </div>
              </div>
              <span
                className={`shrink-0 self-start rounded-full px-3 py-1 text-[11px] font-bold sm:self-center ${statusBadgeClass(app.status)}`}
              >
                {app.status}
              </span>
            </div>
            {app.mentorFeedback && (
              <div className="mt-2 rounded-xl border border-amber-200/60 bg-amber-50/80 px-3 py-2 text-xs dark:border-amber-500/30 dark:bg-amber-950/30">
                <span className="font-bold text-amber-800 dark:text-amber-200">
                  Mentor {app.mentorFeedback.mentorName} · {'★'.repeat(app.mentorFeedback.rating)}
                </span>
                <p className="mt-0.5 text-slate-600 dark:text-slate-300">{app.mentorFeedback.comment}</p>
              </div>
            )}
            {app.status === 'Completed' && (
              <div className="mt-2 text-xs font-semibold text-teal-700 dark:text-teal-300">
                ✓ Completion recorded
                {app.completedAt ? ` · ${new Date(app.completedAt).toLocaleDateString()}` : ''}
                {app.completionNote ? ` — ${app.completionNote}` : ''}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

type JobCard = {
  id: string;
  role: string;
  company: string;
  location: string;
  stipend: string;
  type: string;
  duration: string;
  mode?: string;
  posted: string;
  logo: string;
  tags: string[];
  sector: string;
  verified?: boolean;
  fastTrack?: boolean;
  employeeCount?: string;
  companylink?: string;
  description?: string;
  fromIndustry?: boolean;
  eligibility?: string;
  roleCategory?: string;
  /** Stable demo match % when student profile is empty */
  generalMatch?: number;
};

/** Shared constellation / network backdrop matching the Internships hero look */
function NetworkBackdrop({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <radialGradient id="netGlow" cx="70%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
          <stop offset="55%" stopColor="#312e81" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="400" fill="url(#netGlow)" />
      <g stroke="#60a5fa" strokeOpacity="0.35" strokeWidth="1">
        <line x1="520" y1="40" x2="620" y2="90" />
        <line x1="620" y1="90" x2="720" y2="70" />
        <line x1="620" y1="90" x2="680" y2="160" />
        <line x1="680" y1="160" x2="740" y2="220" />
        <line x1="520" y1="40" x2="560" y2="140" />
        <line x1="560" y1="140" x2="640" y2="200" />
        <line x1="640" y1="200" x2="720" y2="280" />
        <line x1="480" y1="180" x2="560" y2="140" />
        <line x1="480" y1="180" x2="540" y2="260" />
        <line x1="540" y1="260" x2="640" y2="200" />
        <line x1="700" y1="120" x2="760" y2="180" />
        <line x1="700" y1="120" x2="680" y2="160" />
        <line x1="600" y1="300" x2="680" y2="260" />
        <line x1="680" y1="260" x2="740" y2="220" />
      </g>
      <g fill="#93c5fd">
        <circle cx="520" cy="40" r="3.5" opacity="0.9" />
        <circle cx="620" cy="90" r="5" opacity="1" />
        <circle cx="720" cy="70" r="3" opacity="0.8" />
        <circle cx="680" cy="160" r="4" opacity="0.95" />
        <circle cx="740" cy="220" r="3.5" opacity="0.85" />
        <circle cx="560" cy="140" r="3.5" opacity="0.9" />
        <circle cx="640" cy="200" r="4.5" opacity="1" />
        <circle cx="720" cy="280" r="3" opacity="0.75" />
        <circle cx="480" cy="180" r="3" opacity="0.8" />
        <circle cx="540" cy="260" r="3.5" opacity="0.85" />
        <circle cx="700" cy="120" r="3" opacity="0.8" />
        <circle cx="760" cy="180" r="2.5" opacity="0.7" />
        <circle cx="600" cy="300" r="3" opacity="0.75" />
        <circle cx="680" cy="260" r="3.5" opacity="0.85" />
      </g>
      <g fill="#a5b4fc" opacity="0.55">
        <circle cx="500" cy="100" r="2" />
        <circle cx="660" cy="50" r="2" />
        <circle cx="780" cy="140" r="2" />
        <circle cx="580" cy="220" r="2" />
        <circle cx="750" cy="320" r="2" />
      </g>
    </svg>
  );
}

function InternshipCard({
  job,
  matchScore,
  showScore,
}: {
  job: JobCard;
  matchScore: number;
  showScore?: boolean;
}) {
  const [applied, setApplied] = useState(() => hasApplied(job.id));

  const onApply = () => {
    applyToInternship({
      internshipId: job.id,
      role: job.role,
      company: job.company,
      location: job.location,
      stipend: job.stipend,
      logo: job.logo,
      duration: job.duration,
      mode: job.mode,
    });
    setApplied(true);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -40px 0px' }}
      transition={{ type: 'spring' as const, stiffness: 260, damping: 24 }}
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.985 }}
      className="group relative flex flex-col overflow-hidden rounded-[28px] border border-indigo-500/25 bg-[#0b1224] p-6 text-white shadow-lg shadow-indigo-950/40 transition-shadow duration-300 hover:border-indigo-400/50 hover:shadow-2xl hover:shadow-indigo-900/50"
    >
      <NetworkBackdrop />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0b1224]/75 via-[#0f1a33]/55 to-transparent" aria-hidden />

      <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={job.logo}
              alt=""
              className="h-12 w-12 rounded-2xl bg-white/10 object-cover ring-2 ring-white/20 shadow-md transition-transform duration-300 group-hover:scale-110"
            />
            {job.verified && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] text-white ring-2 ring-[#0b1224]">
                ✓
              </span>
            )}
          </div>
          <div>
            <h3 className="font-black leading-snug text-white">{job.role}</h3>
            <p className="text-sm font-medium text-indigo-200/80">{job.company}</p>
          </div>
        </div>
        {showScore && matchScore > 0 && (
          <span className="shrink-0 rounded-full bg-indigo-500/25 px-2.5 py-1 text-[10px] font-black text-indigo-100 ring-1 ring-indigo-400/40">
            {matchScore}% MATCH
          </span>
        )}
      </div>
      <p className="relative z-10 mb-4 line-clamp-2 text-sm leading-relaxed text-slate-300">{job.description}</p>
      <div className="relative z-10 mb-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-300">
        <span className="inline-flex items-center gap-1 rounded-lg bg-white/8 px-2 py-1 ring-1 ring-white/10">
          <MapPin className="h-3.5 w-3.5 text-indigo-300" /> {job.location}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-white/8 px-2 py-1 ring-1 ring-white/10">
          <IndianRupee className="h-3.5 w-3.5 text-emerald-300" /> {job.stipend}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-white/8 px-2 py-1 ring-1 ring-white/10">
          <Clock className="h-3.5 w-3.5 text-amber-300" /> {job.duration}
        </span>
        {job.mode && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/20 px-2 py-1 text-indigo-100 ring-1 ring-indigo-400/30">
            <Building2 className="h-3.5 w-3.5" /> {job.mode}
          </span>
        )}
      </div>
      <div className="relative z-10 mb-5 flex flex-wrap gap-1.5">
        {job.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[10px] font-bold text-indigo-100"
          >
            {t}
          </span>
        ))}
      </div>
      <button
        type="button"
        disabled={applied}
        onClick={onApply}
        className={`relative z-10 mt-auto inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition ${
          applied
            ? 'bg-emerald-500/25 text-emerald-200 ring-1 ring-emerald-400/40'
            : 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-600/40 hover:from-indigo-400 hover:to-violet-500'
        }`}
      >
        {applied ? (
          <>
            <CheckCircle2 className="h-4 w-4" /> Applied
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" /> Apply now
          </>
        )}
      </button>
    </motion.article>
  );
}

export const Internships = () => {
  const [filter, setFilter] = useState('all');
  const skillProfile = useMemo(() => getStudentSkillProfile(), []);

  const allJobs: JobCard[] = useMemo(() => {
    const industry = industryPostingsAsInternships().map((j) => ({
      ...j,
      sector: j.sector || 'software',
    }));
    const staticIds = new Set(INTERNSHIPS.map((j) => j.id));
    const extra = industry.filter((j) => !staticIds.has(j.id));
    return [...INTERNSHIPS, ...extra];
  }, []);

  const scored = useMemo(
    () =>
      allJobs.map((job) => {
        const profileScore = computeMatchScore(job.tags, skillProfile);
        const general =
          typeof (job as JobCard & { generalMatch?: number }).generalMatch === 'number'
            ? (job as JobCard & { generalMatch?: number }).generalMatch!
            : 65;
        const matchScore = skillProfile.hasProfile && profileScore > 0 ? profileScore : general;
        return { job, matchScore };
      }),
    [allJobs, skillProfile],
  );

  const filtered = useMemo(
    () =>
      scored
        .filter(({ job }) => matchesSectorFilter(job, filter))
        .sort((a, b) => b.matchScore - a.matchScore),
    [scored, filter],
  );

  const recommended = useMemo(
    () => [...scored].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3),
    [scored],
  );

  return (
    <div className="relative mx-auto max-w-7xl flex-1 overflow-hidden p-4 md:p-8">
      <div
        className="pointer-events-none absolute -left-32 -top-10 h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl dark:bg-indigo-500/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-24 h-96 w-96 rounded-full bg-violet-400/12 blur-3xl dark:bg-violet-600/18"
        aria-hidden
      />

      <motion.header
        className="relative mb-10 overflow-hidden rounded-[32px] border border-indigo-500/30 bg-[#0b1224] p-6 shadow-xl shadow-indigo-950/40 md:p-8"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <NetworkBackdrop />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0b1224] via-[#0b1224]/85 to-transparent" aria-hidden />
        <div className="relative z-10 mb-4 flex items-center gap-3">
          <motion.div
            className="rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-3 text-white shadow-lg shadow-violet-600/40"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
          >
            <Briefcase className="h-6 w-6" />
          </motion.div>
          <span className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">Career</span>
        </div>
        <motion.h1
          className="relative z-10 mb-2 text-4xl font-black tracking-tight text-white md:text-5xl"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          Internships
        </motion.h1>
        <motion.p
          className="relative z-10 max-w-2xl text-lg text-slate-300"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          Browse openings matched to your skill profile when available. Includes openings posted by industry
          partners.
        </motion.p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
      >
        <BuildCvCta
          title="Build your CV before you apply"
          subtitle="Create a resume with free templates and download PDF before you apply."
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <MyApplicationsPanel />
      </motion.div>

      {recommended.some((r) => r.matchScore > 0) && (
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Recommended for you</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map(({ job, matchScore }) => (
              <InternshipCard key={`rec-${job.id}`} job={job} matchScore={matchScore} showScore />
            ))}
          </div>
        </motion.section>
      )}

      <motion.div
        className="mb-6 flex flex-wrap gap-2"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
      >
        {[
          { id: 'all', label: 'All' },
          { id: 'software', label: 'Software' },
          { id: 'data', label: 'Data' },
          { id: 'cyber', label: 'Cyber' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-2xl px-4 py-2.5 text-xs font-black uppercase tracking-wide transition ${
              filter === f.id
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                : 'border border-slate-200 bg-white/90 text-slate-600 backdrop-blur hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/40'
            }`}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      <div key={filter} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(({ job, matchScore }) => (
          <InternshipCard key={job.id} job={job} matchScore={matchScore} showScore />
        ))}
      </div>
      {filtered.length === 0 && (
        <motion.p
          className="py-16 text-center text-sm text-slate-500 dark:text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No internships match your filters.
        </motion.p>
      )}
    </div>
  );
};

export default Internships;
