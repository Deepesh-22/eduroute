/** SIH26134 — Curriculum ↔ skill gap mock data (Maharashtra training focus) */

export type CourseFlag = 'obsolete' | 'oversupplied' | 'low_placement' | 'healthy' | 'critical_gap';

export type SkillGapRow = {
  skill: string;
  taughtPct: number;
  demandPct: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
};

export type CurriculumRecommendation = {
  id: string;
  type: 'add' | 'remove' | 'update';
  title: string;
  detail: string;
  priority: 'high' | 'medium' | 'low';
  courseId: string;
};

export type CourseCurriculum = {
  id: string;
  name: string;
  provider: string;
  sector: string;
  district: string;
  seats: number;
  placementRate: number;
  flag: CourseFlag;
  skills: SkillGapRow[];
  recommendations: CurriculumRecommendation[];
};

export const COURSES: CourseCurriculum[] = [
  {
    id: 'c-fullstack-pune',
    name: 'Full Stack Web Development',
    provider: 'Govt ITI / Poly Pune',
    sector: 'Software',
    district: 'Pune',
    seats: 120,
    placementRate: 62,
    flag: 'critical_gap',
    skills: [
      { skill: 'React', taughtPct: 45, demandPct: 88, level: 'Intermediate' },
      { skill: 'Node.js', taughtPct: 40, demandPct: 82, level: 'Intermediate' },
      { skill: 'TypeScript', taughtPct: 15, demandPct: 75, level: 'Beginner' },
      { skill: 'SQL', taughtPct: 70, demandPct: 70, level: 'Intermediate' },
      { skill: 'System Design', taughtPct: 10, demandPct: 65, level: 'Beginner' },
    ],
    recommendations: [
      {
        id: 'r1',
        type: 'add',
        title: 'Add TypeScript module',
        detail: 'Demand 75% vs taught 15% — employers flag missing TS in junior hires.',
        priority: 'high',
        courseId: 'c-fullstack-pune',
      },
      {
        id: 'r2',
        type: 'update',
        title: 'Deepen React project hours',
        detail: 'Increase project weeks from 2 to 4; map to real product tickets.',
        priority: 'high',
        courseId: 'c-fullstack-pune',
      },
    ],
  },
  {
    id: 'c-data-mumbai',
    name: 'Data Analytics Foundation',
    provider: 'Mumbai Skill Hub',
    sector: 'Analytics',
    district: 'Mumbai',
    seats: 80,
    placementRate: 55,
    flag: 'critical_gap',
    skills: [
      { skill: 'Python', taughtPct: 60, demandPct: 90, level: 'Intermediate' },
      { skill: 'SQL', taughtPct: 75, demandPct: 85, level: 'Intermediate' },
      { skill: 'Power BI', taughtPct: 50, demandPct: 70, level: 'Beginner' },
      { skill: 'Machine Learning basics', taughtPct: 20, demandPct: 60, level: 'Beginner' },
    ],
    recommendations: [
      {
        id: 'r3',
        type: 'add',
        title: 'Intro ML lab',
        detail: 'Cover scikit-learn pipelines and evaluation metrics for analyst roles.',
        priority: 'medium',
        courseId: 'c-data-mumbai',
      },
    ],
  },
  {
    id: 'c-cloud-nagpur',
    name: 'Cloud & DevOps Associate',
    provider: 'Nagpur Polytechnic',
    sector: 'Cloud',
    district: 'Nagpur',
    seats: 60,
    placementRate: 48,
    flag: 'healthy',
    skills: [
      { skill: 'Linux', taughtPct: 70, demandPct: 75, level: 'Intermediate' },
      { skill: 'AWS fundamentals', taughtPct: 55, demandPct: 80, level: 'Beginner' },
      { skill: 'Docker', taughtPct: 40, demandPct: 70, level: 'Beginner' },
      { skill: 'CI/CD', taughtPct: 30, demandPct: 65, level: 'Beginner' },
    ],
    recommendations: [
      {
        id: 'r4',
        type: 'update',
        title: 'Expand Docker + K8s labs',
        detail: 'Add container networking and simple Helm charts.',
        priority: 'medium',
        courseId: 'c-cloud-nagpur',
      },
    ],
  },
  {
    id: 'c-office-thane',
    name: 'Office Automation',
    provider: 'Thane Training Centre',
    sector: 'Admin',
    district: 'Thane',
    seats: 150,
    placementRate: 35,
    flag: 'oversupplied',
    skills: [
      { skill: 'MS Office', taughtPct: 95, demandPct: 40, level: 'Beginner' },
      { skill: 'Typing', taughtPct: 90, demandPct: 25, level: 'Beginner' },
      { skill: 'Basic accounting', taughtPct: 50, demandPct: 45, level: 'Beginner' },
    ],
    recommendations: [
      {
        id: 'r5',
        type: 'remove',
        title: 'Reduce pure typing hours',
        detail: 'Market demand far below seat capacity; reallocate to digital skills.',
        priority: 'high',
        courseId: 'c-office-thane',
      },
      {
        id: 'r6',
        type: 'add',
        title: 'Add Google Workspace + data entry tools',
        detail: 'Pivot toward modern workplace tooling employers list.',
        priority: 'medium',
        courseId: 'c-office-thane',
      },
    ],
  },
  {
    id: 'c-banking-kolhapur',
    name: 'Banking Operations',
    provider: 'Kolhapur Vocational',
    sector: 'BFSI',
    district: 'Kolhapur',
    seats: 90,
    placementRate: 28,
    flag: 'obsolete',
    skills: [
      { skill: 'Ledger books', taughtPct: 85, demandPct: 15, level: 'Beginner' },
      { skill: 'Core banking software', taughtPct: 25, demandPct: 70, level: 'Beginner' },
      { skill: 'Customer service', taughtPct: 60, demandPct: 55, level: 'Beginner' },
    ],
    recommendations: [
      {
        id: 'r7',
        type: 'remove',
        title: 'Retire paper-ledger modules',
        detail: 'Banks no longer hire for manual ledger skills at scale.',
        priority: 'high',
        courseId: 'c-banking-kolhapur',
      },
      {
        id: 'r8',
        type: 'add',
        title: 'Core banking + digital payments',
        detail: 'Align with fintech and bank branch digital roles.',
        priority: 'high',
        courseId: 'c-banking-kolhapur',
      },
    ],
  },
  {
    id: 'c-cyber-nashik',
    name: 'Cybersecurity Basics',
    provider: 'Nashik IT Centre',
    sector: 'Security',
    district: 'Nashik',
    seats: 40,
    placementRate: 58,
    flag: 'healthy',
    skills: [
      { skill: 'Networking', taughtPct: 65, demandPct: 70, level: 'Intermediate' },
      { skill: 'Security fundamentals', taughtPct: 55, demandPct: 75, level: 'Beginner' },
      { skill: 'SIEM awareness', taughtPct: 20, demandPct: 55, level: 'Beginner' },
    ],
    recommendations: [
      {
        id: 'r9',
        type: 'add',
        title: 'SIEM lab intro',
        detail: 'Basic Splunk/ELK exposure for SOC analyst pathway.',
        priority: 'medium',
        courseId: 'c-cyber-nashik',
      },
    ],
  },
];

export function flagLabel(flag: CourseFlag): string {
  const map: Record<CourseFlag, string> = {
    obsolete: 'Obsolete',
    oversupplied: 'Oversupplied',
    low_placement: 'Low placement',
    healthy: 'Healthy',
    critical_gap: 'Critical gap',
  };
  return map[flag];
}

export function flagTone(flag: CourseFlag): string {
  const map: Record<CourseFlag, string> = {
    obsolete: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
    oversupplied: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    low_placement: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
    healthy: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    critical_gap: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
  };
  return map[flag];
}
