/**
 * Faculty / Academician opportunities — localStorage demo.
 * FDPs, internships, industrial training, consultancy, research, workshops, mentorship.
 */

export type FacultyOpportunityType =
  | 'FDP'
  | 'Faculty Internship'
  | 'Industrial Training'
  | 'Consultancy'
  | 'Research Collaboration'
  | 'Workshop'
  | 'Mentorship for Teachers';

export type FacultyOpportunity = {
  id: string;
  title: string;
  type: FacultyOpportunityType;
  organizer: string;
  location: string;
  duration: string;
  mode: string;
  domain: string;
  description: string;
  postedAt: string;
  seats?: string;
};

export type FacultyInterestStatus = 'Applied' | 'Shortlisted' | 'Accepted' | 'Completed' | 'Withdrawn';

export const FACULTY_STATUS_FLOW: FacultyInterestStatus[] = [
  'Applied',
  'Shortlisted',
  'Accepted',
  'Completed',
];

export type FacultyInterest = {
  id: string;
  opportunityId: string;
  facultyName: string;
  email: string;
  institution: string;
  department: string;
  status: FacultyInterestStatus;
  appliedAt: string;
};

const OPP_KEY = 'eduroute:faculty-opportunities-v2';
const INTEREST_KEY = 'eduroute:faculty-interests-v2';

export const FACULTY_DEMO_CREDENTIALS = {
  email: 'faculty@gmail.com',
  password: 'faculty',
  user: {
    id: 'faculty-demo-1',
    name: 'Dr. Ananya Sharma',
    email: 'faculty@gmail.com',
    role: 'faculty' as const,
    institutionName: 'All India Institute of Technology',
  },
};

const DEMO_OPPORTUNITIES: FacultyOpportunity[] = [
  {
    id: 'fac-opp-1',
    title: 'FDP on AI-Powered Teaching & Assessment',
    type: 'FDP',
    organizer: 'AICTE · EduRoute Partners',
    location: 'Hybrid · Delhi',
    duration: '5 Days',
    mode: 'Hybrid',
    domain: 'AI / Education Technology',
    description:
      'Hands-on faculty development covering generative AI for curriculum design, assessment, and mentoring. Certificate on completion.',
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    seats: '40',
  },
  {
    id: 'fac-opp-2',
    title: 'Industry Immersion — Full Stack Product Teams',
    type: 'Faculty Internship',
    organizer: 'EduRoute Tech Labs',
    location: 'Bangalore',
    duration: '4 Weeks',
    mode: 'On-site',
    domain: 'Software Engineering',
    description:
      'Faculty work with product engineers on live tickets and agile rituals to bring industry practices into the classroom.',
    postedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    seats: '12',
  },
  {
    id: 'fac-opp-3',
    title: 'Industrial Training: SOC & Cyber Defense',
    type: 'Industrial Training',
    organizer: 'SecureNet India',
    location: 'Remote',
    duration: '2 Weeks',
    mode: 'Online',
    domain: 'Cybersecurity',
    description:
      'SIEM labs, threat intel briefings, and curriculum mapping for faculty teaching cybersecurity.',
    postedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    seats: '25',
  },
  {
    id: 'fac-opp-4',
    title: 'Consultancy: Campus Skill-Gap Audit',
    type: 'Consultancy',
    organizer: 'EduRoute Consulting',
    location: 'Pan-India',
    duration: 'Project-based',
    mode: 'Hybrid',
    domain: 'Skill Mapping',
    description:
      'Faculty consultants run cohort skill audits aligned to industry roles and recommend curriculum updates.',
    postedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 'fac-opp-5',
    title: 'Collaborative Research: Employability Analytics',
    type: 'Research Collaboration',
    organizer: 'EduRoute Research Cell',
    location: 'Remote + workshops',
    duration: '6–12 Months',
    mode: 'Hybrid',
    domain: 'Data / Education Research',
    description:
      'Joint research on skill-gap predictors and placement outcomes. Co-authorship and dataset access.',
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    seats: '8 teams',
  },
  {
    id: 'fac-opp-6',
    title: 'Workshop: Outcome-Based Education & Rubrics',
    type: 'Workshop',
    organizer: 'NBA Capacity Building',
    location: 'Hybrid · Mumbai',
    duration: '3 Days',
    mode: 'Hybrid',
    domain: 'Teaching & Learning',
    description:
      'Practical workshop for teachers on OBE mapping, CO-PO attainment, and assessment rubrics with peer review.',
    postedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    seats: '50',
  },
  {
    id: 'fac-opp-7',
    title: 'Peer Mentorship Circle for Early-Career Faculty',
    type: 'Mentorship for Teachers',
    organizer: 'EduRoute Faculty Guild',
    location: 'Online',
    duration: '1 Semester',
    mode: 'Online',
    domain: 'Faculty Development',
    description:
      'Structured mentorship for new teachers — classroom management, research planning, and student engagement with senior mentors.',
    postedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    seats: '30',
  },
];

const DEMO_INTERESTS: FacultyInterest[] = [
  {
    id: 'fac-int-1',
    opportunityId: 'fac-opp-1',
    facultyName: 'Dr. Ananya Sharma',
    email: 'faculty@gmail.com',
    institution: 'All India Institute of Technology',
    department: 'Computer Science',
    status: 'Applied',
    appliedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function readFacultyOpportunities(): FacultyOpportunity[] {
  const list = readJson<FacultyOpportunity[] | null>(OPP_KEY, null);
  if (!list || !list.length) {
    writeJson(OPP_KEY, DEMO_OPPORTUNITIES);
    return [...DEMO_OPPORTUNITIES];
  }
  return list;
}

export function addFacultyOpportunity(
  input: Omit<FacultyOpportunity, 'id' | 'postedAt'>,
): FacultyOpportunity {
  const list = readFacultyOpportunities();
  const item: FacultyOpportunity = {
    ...input,
    id: `fac-opp-${Date.now()}`,
    postedAt: new Date().toISOString(),
  };
  writeJson(OPP_KEY, [item, ...list]);
  return item;
}

export function readFacultyInterests(): FacultyInterest[] {
  const list = readJson<FacultyInterest[] | null>(INTEREST_KEY, null);
  if (!list || !list.length) {
    writeJson(INTEREST_KEY, DEMO_INTERESTS);
    return [...DEMO_INTERESTS];
  }
  return list;
}

/** Apply to an opportunity (idempotent per email + opportunity). */
export function applyToOpportunity(
  opportunityId: string,
  faculty: { name: string; email: string; institution: string; department: string },
): FacultyInterest | null {
  const interests = readFacultyInterests();
  const existing = interests.find(
    (i) => i.opportunityId === opportunityId && i.email === faculty.email,
  );
  if (existing) return existing;
  const row: FacultyInterest = {
    id: `fac-int-${Date.now()}`,
    opportunityId,
    facultyName: faculty.name,
    email: faculty.email,
    institution: faculty.institution,
    department: faculty.department,
    status: 'Applied',
    appliedAt: new Date().toISOString(),
  };
  writeJson(INTEREST_KEY, [row, ...interests]);
  return row;
}

/** @deprecated alias */
export function expressInterest(
  opportunityId: string,
  faculty: { name: string; email: string; institution: string; department: string },
): FacultyInterest | null {
  return applyToOpportunity(opportunityId, faculty);
}

export function updateInterestStatus(
  interestId: string,
  status: FacultyInterestStatus,
): FacultyInterest | null {
  const list = readFacultyInterests();
  const idx = list.findIndex((i) => i.id === interestId);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], status };
  writeJson(INTEREST_KEY, list);
  return list[idx];
}

export function advanceInterestStatus(interestId: string): FacultyInterest | null {
  const list = readFacultyInterests();
  const row = list.find((i) => i.id === interestId);
  if (!row) return null;
  const i = FACULTY_STATUS_FLOW.indexOf(row.status);
  if (i < 0 || i >= FACULTY_STATUS_FLOW.length - 1) return row;
  return updateInterestStatus(interestId, FACULTY_STATUS_FLOW[i + 1]);
}

export const FACULTY_TYPES: FacultyOpportunityType[] = [
  'FDP',
  'Faculty Internship',
  'Industrial Training',
  'Consultancy',
  'Research Collaboration',
  'Workshop',
  'Mentorship for Teachers',
];

/** UI tabs grouping */
export type FacultyTabId = 'all' | 'fdp' | 'internships' | 'research' | 'workshops';

export const FACULTY_TABS: { id: FacultyTabId; label: string; types: FacultyOpportunityType[] | null }[] = [
  { id: 'all', label: 'All', types: null },
  { id: 'fdp', label: 'FDPs', types: ['FDP'] },
  {
    id: 'internships',
    label: 'Internships & Training',
    types: ['Faculty Internship', 'Industrial Training'],
  },
  {
    id: 'research',
    label: 'Research & Consultancy',
    types: ['Research Collaboration', 'Consultancy'],
  },
  {
    id: 'workshops',
    label: 'Workshops & Mentorship',
    types: ['Workshop', 'Mentorship for Teachers'],
  },
];
