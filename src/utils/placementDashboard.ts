/**
 * Institution placement metrics — demo + cohort localStorage.
 */

import type { ApplicationStatus, InternshipApplication } from './internshipApplications';
import type { AuthUser } from './rbacAuth';
import { readOnboarding } from './onboardingStore';
import { readIndustryApplicants, readIndustryPostings } from './industryStore';

const GLOBAL_KEY = 'eduroute:internship-applications-v2';
const BY_EMAIL_PREFIX = 'eduroute:internship-applications-v2:';

export type PlacementKpis = {
  applications: number;
  shortlisted: number;
  interviews: number;
  hired: number;
  offers: number;
  applicationsDelta: number;
  shortlistedDelta: number;
  interviewsDelta: number;
  hiredDelta: number;
};

export type SkillGapRow = {
  rank: number;
  name: string;
  percent: number;
  color: string;
};

export type SkillDemandRow = {
  name: string;
  demand: number;
  trend: 'up' | 'steady' | 'down';
};

export type HiringCompany = {
  id: string;
  name: string;
  subtitle: string;
  hires: number;
  tag: string;
  logoSeed: string;
};

export type MonthlyTrendPoint = {
  month: string;
  applied: number;
  shortlisted: number;
  hired: number;
};

export type PlacementDashboardData = {
  institutionName: string;
  periodLabel: string;
  kpis: PlacementKpis;
  skillGaps: SkillGapRow[];
  skillDemand: SkillDemandRow[];
  companies: HiringCompany[];
  trends: MonthlyTrendPoint[];
  readinessScore: number;
  placementRate: number;
  openJobs: number;
  openInternships: number;
  source: 'live' | 'demo-seed';
};

const DEMO_KPIS: PlacementKpis = {
  applications: 482,
  shortlisted: 198,
  interviews: 142,
  hired: 86,
  offers: 102,
  applicationsDelta: 18,
  shortlistedDelta: 24,
  interviewsDelta: 32,
  hiredDelta: 40,
};

const DEMO_SKILL_GAPS: SkillGapRow[] = [
  { rank: 1, name: 'Data Structures & Algorithms', percent: 62, color: '#6366f1' },
  { rank: 2, name: 'React.js', percent: 48, color: '#3b82f6' },
  { rank: 3, name: 'System Design', percent: 41, color: '#14b8a6' },
  { rank: 4, name: 'Java', percent: 35, color: '#f59e0b' },
  { rank: 5, name: 'Communication', percent: 28, color: '#ec4899' },
];

/** Baseline market demand — used when few posts, or merged for genuine variety */
const DEMO_SKILL_DEMAND: SkillDemandRow[] = [
  { name: 'DSA / Problem solving', demand: 94, trend: 'up' },
  { name: 'Full-stack (React + Node)', demand: 87, trend: 'up' },
  { name: 'Cloud (AWS / Azure)', demand: 81, trend: 'up' },
  { name: 'Data analytics / SQL', demand: 73, trend: 'steady' },
  { name: 'Cybersecurity basics', demand: 66, trend: 'up' },
  { name: 'System design', demand: 58, trend: 'steady' },
  { name: 'Communication & soft skills', demand: 52, trend: 'down' },
];

/** Market weight hints so common skills don’t all land on the same % */
const SKILL_WEIGHT: Record<string, number> = {
  dsa: 96,
  'data structures': 94,
  algorithms: 93,
  java: 88,
  'system design': 85,
  react: 90,
  typescript: 82,
  javascript: 80,
  node: 84,
  'node.js': 84,
  python: 86,
  sql: 79,
  postgresql: 72,
  linux: 70,
  networking: 68,
  siem: 61,
  cybersecurity: 74,
  aws: 83,
  azure: 77,
  cloud: 81,
  excel: 55,
  communication: 50,
};

const DEMO_COMPANIES: HiringCompany[] = [
  { id: 'tcs', name: 'TCS', subtitle: 'Tata Consultancy Services', hires: 18, tag: 'Top Recruiter', logoSeed: 'TCS' },
  { id: 'infy', name: 'Infosys', subtitle: 'Infosys', hires: 12, tag: 'IT Services', logoSeed: 'INFY' },
  { id: 'wipro', name: 'Wipro', subtitle: 'Wipro', hires: 9, tag: 'IT Services', logoSeed: 'WIP' },
  { id: 'acc', name: 'Accenture', subtitle: 'Accenture', hires: 7, tag: 'Consulting', logoSeed: 'ACC' },
  { id: 'amz', name: 'Amazon', subtitle: 'Amazon', hires: 6, tag: 'Product', logoSeed: 'AMZ' },
];

const DEMO_TRENDS: MonthlyTrendPoint[] = [
  { month: 'Jul', applied: 38, shortlisted: 18, hired: 8 },
  { month: 'Aug', applied: 48, shortlisted: 28, hired: 14 },
  { month: 'Sep', applied: 58, shortlisted: 38, hired: 24 },
  { month: 'Oct', applied: 68, shortlisted: 48, hired: 34 },
  { month: 'Nov', applied: 78, shortlisted: 58, hired: 42 },
  { month: 'Dec', applied: 92, shortlisted: 72, hired: 54 },
];

function parseList(raw: string | null): InternshipApplication[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as InternshipApplication[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readCohortApplications(): InternshipApplication[] {
  if (typeof window === 'undefined') return [];
  const byId = new Map<string, InternshipApplication>();
  const push = (list: InternshipApplication[]) => {
    for (const app of list) {
      if (!app?.internshipId) continue;
      const key = `${app.internshipId}::${app.appliedAt || ''}`;
      if (!byId.has(key)) byId.set(key, app);
    }
  };
  push(parseList(localStorage.getItem(GLOBAL_KEY)));
  push(parseList(localStorage.getItem('eduroute:internship-applications-v1')));
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith(BY_EMAIL_PREFIX) || k.startsWith('eduroute:internship-applications-v1:')) {
        push(parseList(localStorage.getItem(k)));
      }
    }
  } catch {
    /* private mode */
  }
  return Array.from(byId.values());
}

function countByStatus(apps: InternshipApplication[], status: ApplicationStatus): number {
  return apps.filter((a) => a.status === status).length;
}

function funnelCounts(apps: InternshipApplication[]): PlacementKpis {
  const total = apps.length;
  const shortlisted =
    countByStatus(apps, 'Shortlisted') +
    countByStatus(apps, 'Interview') +
    countByStatus(apps, 'Offer') +
    countByStatus(apps, 'Hired') +
    countByStatus(apps, 'Completed');
  const interviews =
    countByStatus(apps, 'Interview') +
    countByStatus(apps, 'Offer') +
    countByStatus(apps, 'Hired') +
    countByStatus(apps, 'Completed');
  const offers =
    countByStatus(apps, 'Offer') +
    countByStatus(apps, 'Hired') +
    countByStatus(apps, 'Completed');
  const hired = countByStatus(apps, 'Hired') + countByStatus(apps, 'Completed');
  return {
    applications: total,
    shortlisted,
    interviews,
    hired,
    offers,
    applicationsDelta: 12,
    shortlistedDelta: 18,
    interviewsDelta: 22,
    hiredDelta: 28,
  };
}

function companyHires(apps: InternshipApplication[]): HiringCompany[] {
  const hired = apps.filter((a) => a.status === 'Hired' || a.status === 'Completed');
  const map = new Map<string, number>();
  for (const a of hired) map.set(a.company, (map.get(a.company) || 0) + 1);
  const rows = Array.from(map.entries())
    .map(([name, hires], i) => ({
      id: `c-${i}`,
      name,
      subtitle: name,
      hires,
      tag: hires >= 3 ? 'Top Recruiter' : 'Partner',
      logoSeed: name.slice(0, 3).toUpperCase(),
    }))
    .sort((a, b) => b.hires - a.hires)
    .slice(0, 5);
  return rows.length ? rows : DEMO_COMPANIES;
}

function skillGapsFromOnboarding(): SkillGapRow[] {
  try {
    const onboarding = readOnboarding();
    const gaps = onboarding.missingSkills || [];
    if (!gaps.length) return DEMO_SKILL_GAPS;
    const colors = ['#6366f1', '#3b82f6', '#14b8a6', '#f59e0b', '#ec4899'];
    return gaps.slice(0, 5).map((name, i) => ({
      rank: i + 1,
      name,
      percent: Math.max(18, 70 - i * 10),
      color: colors[i % colors.length],
    }));
  } catch {
    return DEMO_SKILL_GAPS;
  }
}

function hashSpread(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h % 17; // 0–16 spread so bars never all match
}

function baseWeightForSkill(skill: string): number {
  const key = skill.toLowerCase().trim();
  if (SKILL_WEIGHT[key] != null) return SKILL_WEIGHT[key];
  for (const [k, w] of Object.entries(SKILL_WEIGHT)) {
    if (key.includes(k) || k.includes(key)) return w;
  }
  // Unknown skill: stable but varied base 48–76
  return 48 + hashSpread(key) * 1.6;
}

function skillDemandFromPostings(): SkillDemandRow[] {
  try {
    const postings = readIndustryPostings();
    if (!postings.length) return DEMO_SKILL_DEMAND.slice(0, 5);

    type Agg = { display: string; weight: number; fullTimeHits: number; internHits: number };
    const agg = new Map<string, Agg>();

    for (const p of postings) {
      const isFt = p.roleCategory === 'full-time';
      for (const s of p.skills) {
        const raw = s.trim();
        if (!raw) continue;
        const key = raw.toLowerCase();
        const prev = agg.get(key) || { display: raw, weight: 0, fullTimeHits: 0, internHits: 0 };
        // Full-time roles count more toward placement demand
        prev.weight += isFt ? 2.4 : 1;
        if (isFt) prev.fullTimeHits += 1;
        else prev.internHits += 1;
        if (raw.length > prev.display.length) prev.display = raw;
        agg.set(key, prev);
      }
    }

    if (agg.size === 0) return DEMO_SKILL_DEMAND.slice(0, 5);

    const maxW = Math.max(...Array.from(agg.values()).map((a) => a.weight), 1);

    const rows: SkillDemandRow[] = Array.from(agg.values()).map((a) => {
      const market = baseWeightForSkill(a.display);
      const freqBoost = (a.weight / maxW) * 22; // 0–22 from how often it appears
      const ftBoost = a.fullTimeHits > 0 ? 6 : 0;
      const spread = hashSpread(a.display) - 8; // -8..+8 so neighbors differ
      let demand = Math.round(market * 0.55 + freqBoost + ftBoost + spread);
      demand = Math.max(38, Math.min(97, demand));

      let trend: 'up' | 'steady' | 'down' = 'steady';
      if (a.fullTimeHits >= 1 || a.weight >= maxW * 0.7) trend = 'up';
      else if (a.weight <= 1 && market < 60) trend = 'down';

      return { name: a.display, demand, trend };
    });

    rows.sort((a, b) => b.demand - a.demand);

    // Ensure visual variety: if two consecutive equal, nudge second down
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].demand >= rows[i - 1].demand) {
        rows[i].demand = Math.max(35, rows[i - 1].demand - (3 + (i % 4)));
      }
    }

    // Top 5 from posts; if fewer than 4, pad with demo market skills not already listed
    const top = rows.slice(0, 5);
    if (top.length < 4) {
      const have = new Set(top.map((r) => r.name.toLowerCase()));
      for (const d of DEMO_SKILL_DEMAND) {
        if (have.has(d.name.toLowerCase())) continue;
        top.push(d);
        if (top.length >= 5) break;
      }
    }

    return top.slice(0, 5);
  } catch {
    return DEMO_SKILL_DEMAND.slice(0, 5);
  }
}

export function getPlacementDashboardData(
  institutionName = 'Modi Institute of Technology',
): PlacementDashboardData {
  const apps = readCohortApplications().filter((a) => !a.isDemo);
  const industryApps = readIndustryApplicants();
  const useLive = apps.length >= 8 || industryApps.length >= 5;
  const kpis = useLive && apps.length >= 8 ? funnelCounts(apps) : DEMO_KPIS;

  const placementRate =
    kpis.applications > 0 ? Math.round((kpis.hired / kpis.applications) * 100) : 18;

  const gaps = skillGapsFromOnboarding();
  const avgGap = gaps.reduce((s, g) => s + g.percent, 0) / Math.max(1, gaps.length);
  const readinessScore = Math.max(
    35,
    Math.min(95, Math.round(100 - avgGap * 0.55 + placementRate * 0.25)),
  );

  let openJobs = 0;
  let openInternships = 0;
  try {
    for (const p of readIndustryPostings()) {
      if (p.roleCategory === 'full-time') openJobs += 1;
      else openInternships += 1;
    }
  } catch {
    openJobs = 1;
    openInternships = 2;
  }

  return {
    institutionName,
    periodLabel: 'Aug 2025 – Dec 2025',
    kpis,
    skillGaps: gaps,
    skillDemand: skillDemandFromPostings(),
    companies: useLive && apps.length >= 8 ? companyHires(apps) : DEMO_COMPANIES,
    trends: DEMO_TRENDS,
    readinessScore,
    placementRate,
    openJobs,
    openInternships,
    source: useLive ? 'live' : 'demo-seed',
  };
}

export const COLLEGE_DEMO_CREDENTIALS = {
  email: 'college@gmail.com',
  password: 'student',
  user: {
    id: 'local-college-1',
    name: 'Placement Cell',
    email: 'college@gmail.com',
    role: 'college' as const,
    verificationStatus: 'verified',
    institutionName: 'Modi Institute of Technology',
  } satisfies AuthUser,
};
