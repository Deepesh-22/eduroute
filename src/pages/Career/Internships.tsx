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
    description: 'Build UI features with the product team.',
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
    description: 'Support analytics and dashboarding for growth teams.',
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
    description: 'Assist SOC with triage and vulnerability scans.',
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

function matchBadgeClasses(score: number) {
  if (score >= 75) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300';
  if (score >= 50) return 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200';
  return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
}

function matchesSectorFilter(job: { sector?: string; tags: string[] }, filter: string) {
  if (filter === 'all') return true;
  if (job.sector === filter) return true;
  const blob = job.tags.join(' ').toLowerCase();
  if (filter === 'software') return /react|typescript|node|frontend|backend|full.?stack|javascript/.test(blob);
  if (filter === 'data') return /data|sql|python|analytics/.test(blob);
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
    <section className="mb-10 rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
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
};

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
      variants={{
        hidden: { opacity: 0, y: 28, scale: 0.97 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: 'spring' as const, stiffness: 320, damping: 26 },
        },
      }}
      whileHover={{ y: -8, scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      className="group flex flex-col rounded-[28px] border border-slate-100/90 bg-white/95 p-6 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-indigo-100/40 dark:border-slate-800 dark:bg-slate-900/95 dark:hover:shadow-indigo-950/30"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={job.logo}
            alt=""
            className="h-12 w-12 rounded-2xl bg-slate-100 object-cover transition-transform duration-300 group-hover:scale-105 dark:bg-slate-800"
          />
          <div>
            <h3 className="font-black text-slate-900 dark:text-white">{job.role}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{job.company}</p>
          </div>
        </div>
        {showScore && matchScore > 0 && (
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${matchBadgeClasses(matchScore)}`}>
            {matchScore}% MATCH
          </span>
        )}
      </div>
      <p className="mb-4 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{job.description}</p>
      <div className="mb-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {job.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <IndianRupee className="h-3.5 w-3.5" /> {job.stipend}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {job.duration}
        </span>
        {job.mode && (
          <span className="inline-flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5" /> {job.mode}
          </span>
        )}
      </div>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {job.tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {t}
          </span>
        ))}
      </div>
      <button
        type="button"
        disabled={applied}
        onClick={onApply}
        className={`mt-auto inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold ${
          applied
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
            : 'bg-indigo-600 text-white hover:bg-indigo-500'
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
      allJobs.map((job) => ({
        job,
        matchScore: computeMatchScore(job.tags, skillProfile),
      })),
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

  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.06 },
    },
  };

  return (
    <div className="relative mx-auto max-w-7xl flex-1 overflow-hidden p-4 md:p-8">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-32 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-600/15"
        aria-hidden
      />

      <motion.header
        className="relative mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-300">
            <Briefcase className="h-6 w-6" />
          </div>
          <span className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            Career
          </span>
        </div>
        <h1 className="mb-2 text-4xl font-black text-slate-900 dark:text-white md:text-5xl">Internships</h1>
        <p className="max-w-2xl text-lg text-slate-500 dark:text-slate-400">
          Browse openings matched to your skill profile when available. Includes openings posted by industry
          partners.
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.04 }}
      >
        <BuildCvCta
          title="Build your CV before you apply"
          subtitle="Create a resume with free templates and download PDF before you apply."
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.06 }}
      >
        <MyApplicationsPanel />
      </motion.div>

      {skillProfile.hasProfile && recommended.some((r) => r.matchScore > 0) && (
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="mb-4 text-lg font-black text-slate-900 dark:text-white">Recommended for you</h2>
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {recommended.map(({ job, matchScore }) => (
              <InternshipCard key={`rec-${job.id}`} job={job} matchScore={matchScore} showScore />
            ))}
          </motion.div>
        </motion.section>
      )}

      <motion.div
        className="mb-6 flex flex-wrap gap-2"
        initial={{ opacity: 0, y: 10 }}
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
            className={`rounded-2xl px-4 py-2 text-xs font-black uppercase transition ${
              filter === f.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      <motion.div
        key={filter}
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.08 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map(({ job, matchScore }) => (
          <InternshipCard
            key={job.id}
            job={job}
            matchScore={matchScore}
            showScore={skillProfile.hasProfile}
          />
        ))}
      </motion.div>
      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          No internships match your filters.
        </p>
      )}
    </div>
  );
};

export default Internships;
