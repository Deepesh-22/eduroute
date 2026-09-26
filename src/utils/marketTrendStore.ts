/**
 * Client cache for Gemini market trends + student trend analysis.
 * Admin refresh anytime; student personal analysis refresh every 7 days.
 * Placeholder seed is shown until admin clicks Refresh (then real Gemini data).
 */

export type MarketSkill = {
  skill: string;
  demandScore: number;
  trend: string;
  note?: string;
};

export type MarketSnapshot = {
  updatedAt: string;
  region?: string;
  summary?: string;
  risingSkills?: MarketSkill[];
  stableSkills?: MarketSkill[];
  decliningSkills?: MarketSkill[];
  topRoles?: { role: string; openingsIndex: number; avgSalaryLpa?: number }[];
  sectors?: { name: string; demandScore: number }[];
  emergingTech?: string[];
  sourcesNote?: string;
  provider?: string;
  isSeed?: boolean;
};

export type StudentAnalysis = {
  generatedAt: string;
  summary?: string;
  matchScore?: number;
  marketSkills?: {
    skill: string;
    marketDemand: number;
    studentLevel: number;
    status: string;
  }[];
  skillGaps?: { skill: string; priority: string; why: string; action: string }[];
  strengths?: string[];
  recommendations?: string[];
  comparisonBars?: { skill: string; market: number; student: number }[];
  provider?: string;
};

const MARKET_KEY = 'eduroute:market-trends-v1';
const ANALYSIS_KEY = 'eduroute:student-trend-analysis-v1';
const STUDENT_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

/** Placeholder until admin refreshes with Gemini on Netlify. */
export const SEED_MARKET: MarketSnapshot = {
  updatedAt: new Date().toISOString(),
  region: 'India / Maharashtra',
  summary:
    'Seed labour-market snapshot for planning. Click Refresh to load live Gemini analysis (requires GEMINI_API_KEY on Netlify).',
  isSeed: true,
  provider: 'seed',
  risingSkills: [
    { skill: 'React', demandScore: 88, trend: 'rising', note: 'Frontend hiring steady in Pune/Mumbai' },
    { skill: 'Python', demandScore: 90, trend: 'rising', note: 'Analytics + automation' },
    { skill: 'Cloud (AWS)', demandScore: 82, trend: 'rising' },
    { skill: 'TypeScript', demandScore: 78, trend: 'rising' },
    { skill: 'Data analytics', demandScore: 80, trend: 'rising' },
    { skill: 'DevOps / Docker', demandScore: 74, trend: 'rising' },
    { skill: 'SQL', demandScore: 85, trend: 'stable' },
    { skill: 'Cybersecurity basics', demandScore: 72, trend: 'rising' },
  ],
  stableSkills: [
    { skill: 'Java', demandScore: 70, trend: 'stable' },
    { skill: 'Communication', demandScore: 68, trend: 'stable' },
  ],
  decliningSkills: [
    { skill: 'Legacy desktop support', demandScore: 25, trend: 'declining' },
    { skill: 'Manual ledger accounting', demandScore: 18, trend: 'declining' },
    { skill: 'Pure typing / data entry only', demandScore: 22, trend: 'declining' },
  ],
  topRoles: [
    { role: 'Full Stack Developer', openingsIndex: 92, avgSalaryLpa: 8.5 },
    { role: 'Data Analyst', openingsIndex: 85, avgSalaryLpa: 7.2 },
    { role: 'Cloud Associate', openingsIndex: 78, avgSalaryLpa: 9.0 },
    { role: 'QA Engineer', openingsIndex: 70, avgSalaryLpa: 6.0 },
    { role: 'Support Engineer', openingsIndex: 65, avgSalaryLpa: 5.5 },
  ],
  sectors: [
    { name: 'IT / Software', demandScore: 90 },
    { name: 'BFSI digital', demandScore: 72 },
    { name: 'Manufacturing IoT', demandScore: 60 },
    { name: 'EdTech', demandScore: 55 },
  ],
  emergingTech: ['GenAI copilots', 'MLOps', 'Kubernetes'],
  sourcesNote: 'Seed data — replace via Admin → Market Trends → Refresh.',
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readMarketSnapshot(): MarketSnapshot {
  if (typeof localStorage === 'undefined') return { ...SEED_MARKET };
  const parsed = safeParse<MarketSnapshot>(localStorage.getItem(MARKET_KEY));
  if (parsed && parsed.updatedAt) return parsed;
  return { ...SEED_MARKET };
}

export function writeMarketSnapshot(market: MarketSnapshot) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(MARKET_KEY, JSON.stringify(market));
  window.dispatchEvent(new CustomEvent('eduroute:market-trends-updated'));
}

export function readStudentAnalysis(): StudentAnalysis | null {
  if (typeof localStorage === 'undefined') return null;
  return safeParse<StudentAnalysis>(localStorage.getItem(ANALYSIS_KEY));
}

export function writeStudentAnalysis(analysis: StudentAnalysis) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(ANALYSIS_KEY, JSON.stringify(analysis));
  window.dispatchEvent(new CustomEvent('eduroute:student-trend-updated'));
}

export function studentAnalysisFresh(generatedAt?: string): boolean {
  if (!generatedAt) return false;
  const t = new Date(generatedAt).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < STUDENT_COOLDOWN_MS;
}

export function studentCooldownRemainingMs(generatedAt?: string): number {
  if (!generatedAt) return 0;
  const t = new Date(generatedAt).getTime();
  if (Number.isNaN(t)) return 0;
  return Math.max(0, STUDENT_COOLDOWN_MS - (Date.now() - t));
}

/** True if last refresh was in a previous calendar month (or never / seed). */
export function monthDueForRefresh(updatedAt?: string): boolean {
  if (!updatedAt) return true;
  const d = new Date(updatedAt);
  if (Number.isNaN(d.getTime())) return true;
  const now = new Date();
  return d.getFullYear() !== now.getFullYear() || d.getMonth() !== now.getMonth();
}

export async function apiRefreshMarket(): Promise<
  { ok: true; market: MarketSnapshot } | { ok: false; error: string }
> {
  try {
    const res = await fetch('/.netlify/functions/market-trends', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'refresh_market' }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok || !data.market) {
      return { ok: false, error: data.error || `HTTP ${res.status}` };
    }
    const market = { ...data.market, isSeed: false } as MarketSnapshot;
    writeMarketSnapshot(market);
    return { ok: true, market };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Network error' };
  }
}

export async function apiAnalyzeStudent(payload: {
  skills?: string[];
  strengths?: string[];
  gaps?: string[];
  field?: string;
  interests?: string[];
}): Promise<{ ok: true; analysis: StudentAnalysis } | { ok: false; error: string }> {
  try {
    const res = await fetch('/.netlify/functions/market-trends', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'analyze_student', ...payload }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok || !data.analysis) {
      return { ok: false, error: data.error || `HTTP ${res.status}` };
    }
    writeStudentAnalysis(data.analysis as StudentAnalysis);
    return { ok: true, analysis: data.analysis as StudentAnalysis };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Network error' };
  }
}
