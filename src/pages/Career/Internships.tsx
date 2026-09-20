import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
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

/** Deterministic per-job match baseline so every card has a distinct score */
function stableGeneralMatch(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // Spread across 54–96 so recommendations stay differentiated
  return 54 + (Math.abs(h) % 43);
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

/** Vanta-style animated network backdrop — used only on the top Internships hero */
function NetworkBackdrop({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: Node[] = [];
    const LINK_DIST = 120;
    const NODE_COUNT = 48;

    const isDark = () => document.documentElement.classList.contains('dark');

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Re-seed nodes on resize so density stays good
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: 1.6 + Math.random() * 2.4,
      }));
    };

    const tick = () => {
      const dark = isDark();
      // Soft fill so gradient overlay still works
      ctx.clearRect(0, 0, w, h);

      // Drift + bounce
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));
      }

      // Links
      const lineColor = dark ? '99, 102, 241' : '79, 70, 229'; // indigo
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * (dark ? 0.45 : 0.28);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineColor},${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = dark
          ? `rgba(165, 180, 252, ${0.55 + n.r / 8})`
          : `rgba(99, 102, 241, ${0.4 + n.r / 10})`;
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    // React to theme toggles
    const mo = new MutationObserver(() => {
      /* colors read each frame via isDark() */
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    />
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
      whileHover={{ y: -8, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className="group relative flex flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500/40 dark:hover:shadow-indigo-950/40"
    >
      <div
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 opacity-70 transition-opacity group-hover:opacity-100"
        aria-hidden
      />

      <div className="relative z-10 mb-4 flex items-start justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={job.logo}
              alt=""
              className="h-12 w-12 rounded-2xl bg-slate-100 object-cover ring-2 ring-white shadow-md transition-transform duration-300 group-hover:scale-110 dark:bg-slate-800 dark:ring-slate-800"
            />
            {job.verified && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] text-white ring-2 ring-white dark:ring-slate-900">
                ✓
              </span>
            )}
          </div>
          <div>
            <h3 className="font-black leading-snug text-slate-900 dark:text-white">{job.role}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{job.company}</p>
          </div>
        </div>
        {showScore && matchScore > 0 && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ${
              matchScore >= 80
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30'
                : matchScore >= 65
                  ? 'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-500/30'
                  : 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-500/30'
            }`}
          >
            {matchScore}% MATCH
          </span>
        )}
      </div>
      <p className="relative z-10 mb-4 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {job.description}
      </p>
      <div className="relative z-10 mb-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 dark:bg-slate-800">
          <MapPin className="h-3.5 w-3.5 text-indigo-500" /> {job.location}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 dark:bg-slate-800">
          <IndianRupee className="h-3.5 w-3.5 text-emerald-300" /> {job.stipend}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 dark:bg-slate-800">
          <Clock className="h-3.5 w-3.5 text-amber-500" /> {job.duration}
        </span>
        {job.mode && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
            <Building2 className="h-3.5 w-3.5" /> {job.mode}
          </span>
        )}
      </div>
      <div className="relative z-10 mb-5 flex flex-wrap gap-1.5">
        {job.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
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
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
            : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/25 hover:from-indigo-500 hover:to-violet-500'
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
  const profile = useMemo(() => getStudentSkillProfile(), []);

  const scored = useMemo(() => {
    const industry = industryPostingsAsInternships().map((j) => ({
      ...j,
      generalMatch: j.generalMatch ?? stableGeneralMatch(j.id),
    }));
    const base = INTERNSHIPS.map((j) => ({
      ...j,
      generalMatch: j.generalMatch ?? stableGeneralMatch(j.id),
    }));
    const all = [...industry, ...base];
    return all.map((job) => {
      const profileScore = computeMatchScore(job.tags, profile);
      // Blend profile match with stable generalMatch so cards stay distinct when profile is empty
      const matchScore =
        profile.hasProfile && profileScore > 0
          ? Math.round(profileScore * 0.7 + (job.generalMatch ?? stableGeneralMatch(job.id)) * 0.3)
          : job.generalMatch ?? stableGeneralMatch(job.id);
      return { job, matchScore };
    });
  }, [profile]);

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
        className="relative mb-10 overflow-hidden rounded-[32px] border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 shadow-sm dark:border-indigo-500/30 dark:bg-[#0b1224] dark:from-[#0b1224] dark:via-[#0f1a33] dark:to-[#0b1224] dark:shadow-xl dark:shadow-indigo-950/40 md:p-8"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-100" aria-hidden>
          <NetworkBackdrop />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/85 via-white/55 to-transparent dark:from-[#0b1224] dark:via-[#0b1224]/80 dark:to-transparent" aria-hidden />
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
          <span className="text-sm font-black uppercase tracking-[0.22em] text-indigo-600 dark:text-violet-300">
            Career
          </span>
        </div>
        <motion.h1
          className="relative z-10 mb-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          Internships
        </motion.h1>
        <motion.p
          className="relative z-10 max-w-2xl text-lg text-slate-600 dark:text-slate-300"
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
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Recommended for you</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map(({ job, matchScore }) => (
              <InternshipCard key={job.id} job={job} matchScore={matchScore} showScore />
            ))}
          </div>
        </motion.section>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'software', label: 'Software' },
          { id: 'data', label: 'Data / ML' },
          { id: 'cyber', label: 'Cyber' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
              filter === f.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(({ job, matchScore }) => (
          <InternshipCard key={job.id} job={job} matchScore={matchScore} showScore />
        ))}
      </div>
    </div>
  );
};

export default Internships;
