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
  /** Official external listing (AICTE ATAL, Internship portal, NPTEL, etc.) */
  link?: string;
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

const OPP_KEY = 'eduroute:faculty-opportunities-v3';
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
    title: 'AICTE ATAL Academy — Faculty Development Programmes (FDP)',
    type: 'FDP',
    organizer: 'AICTE ATAL Academy',
    location: 'Pan-India · Hybrid / Online',
    duration: '5 Days (typical)',
    mode: 'Hybrid / Online',
    domain: 'AI · Emerging Tech · Pedagogy',
    description:
      'Official AICTE ATAL FDPs for faculty. Browse live programmes, register with your AICTE login, and earn certificates recognised across engineering colleges. Judges can open the real ATAL portal from the card.',
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    seats: 'Open cohort',
    link: 'https://atalacademy.aicte-india.org/',
  },
  {
    id: 'fac-opp-2',
    title: 'AICTE Internship Portal — Faculty & Industry Immersion',
    type: 'Faculty Internship',
    organizer: 'AICTE Internship',
    location: 'Pan-India · Industry partners',
    duration: '4–8 Weeks',
    mode: 'On-site / Hybrid',
    domain: 'Industry Exposure',
    description:
      'National internship portal run by AICTE. Faculty and students discover industry internships; faculty can map immersion experiences back into curriculum. Opens the official AICTE internship site.',
    postedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    seats: 'Rolling',
    link: 'https://internship.aicte-india.org/',
  },
  {
    id: 'fac-opp-3',
    title: 'NPTEL Faculty Development & Certification Courses',
    type: 'Industrial Training',
    organizer: 'NPTEL · IIT System',
    location: 'Online · All India',
    duration: '4–12 Weeks',
    mode: 'Online',
    domain: 'Engineering · CS · Management',
    description:
      'NPTEL (Swayam) courses used widely for faculty upskilling and FDP credit. Browse domains, enroll, and use certificates for career advancement and accreditation evidence.',
    postedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    seats: 'Open',
    link: 'https://nptel.ac.in/',
  },
  {
    id: 'fac-opp-4',
    title: 'SWAYAM — National Online Education Platform',
    type: 'Workshop',
    organizer: 'Ministry of Education · SWAYAM',
    location: 'Online · Free / paid cert',
    duration: 'Self-paced & scheduled',
    mode: 'Online',
    domain: 'Teaching & Learning',
    description:
      'Government of India SWAYAM portal for MOOCs and capacity-building programmes. Faculty use it for continuous professional development and workshop-style learning.',
    postedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    seats: 'Open',
    link: 'https://swayam.gov.in/',
  },
  {
    id: 'fac-opp-5',
    title: 'SERB Research Grants & Collaborative Projects',
    type: 'Research Collaboration',
    organizer: 'SERB · DST',
    location: 'National · Institution-based',
    duration: 'Project cycle',
    mode: 'Hybrid',
    domain: 'Research Funding',
    description:
      'Science and Engineering Research Board (SERB) online portal for competitive research grants. Faculty can explore schemes, apply for funding, and build multi-institution collaborations.',
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    seats: 'Scheme-based',
    link: 'https://www.serbonline.in/',
  },
  {
    id: 'fac-opp-6',
    title: 'NITTTR Faculty Training & Capacity Building',
    type: 'FDP',
    organizer: 'NITTTR Chandigarh',
    location: 'Chandigarh · Hybrid',
    duration: '1–2 Weeks',
    mode: 'Hybrid',
    domain: 'Technical Teacher Training',
    description:
      'National Institute of Technical Teachers Training & Research programmes for polytechnic and engineering faculty — pedagogy, labs, and outcome-based education.',
    postedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    seats: 'Batch-wise',
    link: 'https://www.nitttrchd.ac.in/',
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
      'Structured mentorship for new teachers — classroom management, research planning, and student engagement with senior mentors. (In-platform programme; no external portal.)',
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
  // Ensure demo cards keep official portal links (judges / live demo)
  const byId = new Map(DEMO_OPPORTUNITIES.map((d) => [d.id, d]));
  let changed = false;
  const merged = list.map((item) => {
    const demo = byId.get(item.id);
    if (demo?.link && item.link !== demo.link) {
      changed = true;
      return {
        ...item,
        link: demo.link,
        title: demo.title,
        organizer: demo.organizer,
        description: demo.description,
      };
    }
    return item;
  });
  if (changed) writeJson(OPP_KEY, merged);
  return merged;
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
