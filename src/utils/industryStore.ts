/**
 * Industry postings (internship + full-time placement) + applicants — localStorage.
 */

export type WorkMode = 'Remote' | 'Hybrid' | 'Onsite';
export type RoleCategory = 'internship' | 'full-time';

export type IndustryPosting = {
  id: string;
  title: string;
  skills: string[];
  stipend: string;
  location: string;
  description: string;
  company: string;
  /** Display type e.g. Internship / Full-time */
  type: string;
  roleCategory: RoleCategory;
  duration: string;
  mode: WorkMode;
  /** e.g. CGPA 7+, final year, no backlogs */
  eligibility: string;
  postedAt: string;
  logo?: string;
};

export type ApplicantStatus =
  | 'Applied'
  | 'Shortlisted'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Completed'
  | 'Rejected';

export const APPLICANT_STATUS_FLOW: ApplicantStatus[] = [
  'Applied',
  'Shortlisted',
  'Interview',
  'Offer',
  'Hired',
  'Completed',
];

export type IndustryApplicant = {
  id: string;
  postingId: string;
  studentName: string;
  email: string;
  college: string;
  skills: string[];
  matchPercent: number;
  /** Meets eligibility criteria (demo flag) */
  eligible: boolean;
  status: ApplicantStatus;
  appliedAt: string;
  mentorName?: string;
  mentorRating?: number;
  mentorComment?: string;
  mentorAt?: string;
};

export type StudentInternshipCard = {
  id: string;
  role: string;
  company: string;
  location: string;
  stipend: string;
  type: string;
  duration: string;
  mode?: string;
  eligibility?: string;
  roleCategory?: RoleCategory;
  posted: string;
  logo: string;
  tags: string[];
  sector: string;
  verified: boolean;
  fastTrack: boolean;
  employeeCount: string;
  companylink: string;
  description?: string;
  fromIndustry: true;
};

const POSTINGS_KEY = 'eduroute:industry-postings-v3';
const APPLICANTS_KEY = 'eduroute:industry-applicants-v3';
const STUDENT_FEED_KEY = 'eduroute:industry-student-feed-v3';

const DEMO_POSTINGS: IndustryPosting[] = [
  {
    id: 'ind-post-1',
    title: 'SDE Intern — Full Stack',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    stipend: '₹30,000 / mo',
    location: 'Bangalore, India',
    description: 'Build features on our learning platform. Strong JS and APIs preferred.',
    company: 'EduRoute Partners',
    type: 'Internship',
    roleCategory: 'internship',
    duration: '6 Months',
    mode: 'Hybrid',
    eligibility: 'CGPA ≥ 7.0 · Pre-final / final year',
    postedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=EP',
  },
  {
    id: 'ind-job-1',
    title: 'Graduate Software Engineer',
    skills: ['DSA', 'Java', 'System Design', 'SQL'],
    stipend: '₹8–12 LPA',
    location: 'Hyderabad, India',
    description: 'Full-time campus hire. Work on product backend and APIs with a mentor.',
    company: 'EduRoute Partners',
    type: 'Full-time',
    roleCategory: 'full-time',
    duration: 'Permanent',
    mode: 'Hybrid',
    eligibility: 'CGPA ≥ 7.5 · Final year · No active backlogs',
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=EP',
  },
  {
    id: 'ind-post-2',
    title: 'Cybersecurity Intern',
    skills: ['Linux', 'Networking', 'SIEM', 'Python'],
    stipend: '₹28,000 / mo',
    location: 'Delhi NCR, India',
    description: 'SOC triage and vulnerability documentation. Training provided.',
    company: 'EduRoute Partners',
    type: 'Internship',
    roleCategory: 'internship',
    duration: '4 Months',
    mode: 'Onsite',
    eligibility: 'CGPA ≥ 6.5 · Any year with networking basics',
    postedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=EP',
  },
];

const DEMO_APPLICANTS: IndustryApplicant[] = [
  {
    id: 'app-stu-1',
    postingId: 'ind-post-1',
    studentName: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    college: 'NIT Karnataka',
    skills: ['React', 'TypeScript', 'Node.js'],
    matchPercent: 88,
    eligible: true,
    status: 'Applied',
    appliedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'app-stu-2',
    postingId: 'ind-post-1',
    studentName: 'Priya Patel',
    email: 'priya.patel@college.edu',
    college: 'IIIT Hyderabad',
    skills: ['React', 'PostgreSQL', 'DSA'],
    matchPercent: 76,
    eligible: true,
    status: 'Shortlisted',
    appliedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'app-stu-3',
    postingId: 'ind-post-2',
    studentName: 'Rohan Mehta',
    email: 'rohan.mehta@college.edu',
    college: 'VIT Vellore',
    skills: ['Linux', 'Networking', 'Python'],
    matchPercent: 82,
    eligible: true,
    status: 'Applied',
    appliedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'app-stu-4',
    postingId: 'ind-job-1',
    studentName: 'Sneha Iyer',
    email: 'sneha.iyer@college.edu',
    college: 'NIT Trichy',
    skills: ['Java', 'DSA', 'SQL'],
    matchPercent: 91,
    eligible: true,
    status: 'Interview',
    appliedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'app-stu-5',
    postingId: 'ind-job-1',
    studentName: 'Vikram Das',
    email: 'vikram.d@college.edu',
    college: 'Jadavpur University',
    skills: ['Python', 'SQL'],
    matchPercent: 54,
    eligible: false,
    status: 'Applied',
    appliedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

const DEMO_STUDENT_NAMES = [
  { name: 'Neha Verma', email: 'neha.v@college.edu', college: 'DTU Delhi' },
  { name: 'Kabir Singh', email: 'kabir.s@college.edu', college: 'BITS Pilani' },
  { name: 'Ishita Rao', email: 'ishita.r@college.edu', college: 'SRM Chennai' },
];

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJsonSilent(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function notifyUpdated() {
  try {
    window.dispatchEvent(new Event('eduroute:industry-updated'));
  } catch {
    /* ignore */
  }
}

function normalizeStipend(s: string, roleCategory: RoleCategory): string {
  if (!s) return roleCategory === 'full-time' ? 'As per policy' : 'Negotiable';
  if (/₹|rs\.?|inr|lpa|ctc/i.test(s) || /mo|month/i.test(s)) return s;
  return roleCategory === 'full-time' ? `₹${s} LPA` : `₹${s} / mo`;
}

function formatRelative(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} week(s) ago`;
  } catch {
    return 'Recently';
  }
}

function postingToStudentCard(p: IndustryPosting): StudentInternshipCard {
  const loc = p.mode ? `${p.location} (${p.mode})` : p.location;
  return {
    id: p.id,
    role: p.title,
    company: p.company,
    location: loc,
    stipend: p.stipend,
    type: p.type,
    duration: p.duration,
    mode: p.mode,
    eligibility: p.eligibility,
    roleCategory: p.roleCategory,
    posted: formatRelative(p.postedAt),
    logo: p.logo || 'https://api.dicebear.com/7.x/initials/svg?seed=EP',
    tags: p.skills,
    sector: 'software',
    verified: true,
    fastTrack: p.roleCategory === 'full-time',
    employeeCount: 'Industry partner',
    companylink: '#',
    description: p.description,
    fromIndustry: true,
  };
}

function syncStudentFeedSilent(postings: IndustryPosting[]) {
  writeJsonSilent(STUDENT_FEED_KEY, postings.map(postingToStudentCard));
}

function ensureSeed() {
  if (typeof window === 'undefined') return;
  try {
    if (!localStorage.getItem(POSTINGS_KEY)) {
      writeJsonSilent(POSTINGS_KEY, DEMO_POSTINGS);
      syncStudentFeedSilent(DEMO_POSTINGS);
    }
    if (!localStorage.getItem(APPLICANTS_KEY)) {
      writeJsonSilent(APPLICANTS_KEY, DEMO_APPLICANTS);
    }
    if (!localStorage.getItem(STUDENT_FEED_KEY)) {
      const list = readJson<IndustryPosting[]>(POSTINGS_KEY, DEMO_POSTINGS);
      syncStudentFeedSilent(Array.isArray(list) ? list : DEMO_POSTINGS);
    }
  } catch {
    /* ignore */
  }
}

export function readIndustryPostings(): IndustryPosting[] {
  ensureSeed();
  const list = readJson<IndustryPosting[]>(POSTINGS_KEY, DEMO_POSTINGS);
  return Array.isArray(list) ? list : [...DEMO_POSTINGS];
}

export function findIndustryPosting(id: string): IndustryPosting | undefined {
  return readIndustryPostings().find((p) => p.id === id);
}

export function addIndustryPosting(input: {
  title: string;
  skills: string[];
  stipend: string;
  location: string;
  description?: string;
  roleCategory?: RoleCategory;
  duration?: string;
  mode?: WorkMode;
  eligibility?: string;
}): IndustryPosting {
  const roleCategory: RoleCategory = input.roleCategory || 'internship';
  const postings = readIndustryPostings();
  const posting: IndustryPosting = {
    id: `ind-post-${Date.now()}`,
    title: (input.title || '').trim() || (roleCategory === 'full-time' ? 'Untitled role' : 'Untitled internship'),
    skills: input.skills?.length ? input.skills : ['General'],
    stipend: normalizeStipend((input.stipend || '').trim(), roleCategory),
    location: (input.location || '').trim() || 'Remote',
    description:
      (input.description || '').trim() ||
      (roleCategory === 'full-time'
        ? 'Full-time opportunity posted by industry partner.'
        : 'Internship opportunity posted by industry partner.'),
    company: 'EduRoute Partners',
    type: roleCategory === 'full-time' ? 'Full-time' : 'Internship',
    roleCategory,
    duration: input.duration || (roleCategory === 'full-time' ? 'Permanent' : '3 Months'),
    mode: input.mode || 'Hybrid',
    eligibility: (input.eligibility || '').trim() || 'As per company policy',
    postedAt: new Date().toISOString(),
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=EP',
  };
  const next = [posting, ...postings];
  writeJsonSilent(POSTINGS_KEY, next);
  syncStudentFeedSilent(next);

  const existingApps = readIndustryApplicants();
  const now = Date.now();
  const extras: IndustryApplicant[] = DEMO_STUDENT_NAMES.slice(0, 2).map((s, i) => ({
    id: `app-gen-${posting.id}-${i}`,
    postingId: posting.id,
    studentName: s.name,
    email: s.email,
    college: s.college,
    skills: posting.skills.slice(0, 2 + (i % 2)),
    matchPercent: 70 + ((i * 7) % 25),
    eligible: i === 0,
    status: 'Applied' as const,
    appliedAt: new Date(now - i * 3600_000).toISOString(),
  }));
  writeJsonSilent(APPLICANTS_KEY, [...extras, ...existingApps]);
  notifyUpdated();
  return posting;
}

export function readIndustryApplicants(postingId?: string): IndustryApplicant[] {
  ensureSeed();
  const list = readJson<IndustryApplicant[]>(APPLICANTS_KEY, DEMO_APPLICANTS);
  const all = Array.isArray(list)
    ? list.map((a) => ({ ...a, eligible: a.eligible !== false }))
    : [...DEMO_APPLICANTS];
  if (!postingId) return all;
  return all.filter((a) => a.postingId === postingId);
}

export function shortlistApplicant(applicantId: string): IndustryApplicant | null {
  return setApplicantStatus(applicantId, 'Shortlisted');
}

export function setApplicantStatus(
  applicantId: string,
  status: ApplicantStatus,
): IndustryApplicant | null {
  const list = readIndustryApplicants();
  const idx = list.findIndex((a) => a.id === applicantId);
  if (idx < 0) return null;
  const next: IndustryApplicant = { ...list[idx], status };
  const updated = [...list];
  updated[idx] = next;
  writeJsonSilent(APPLICANTS_KEY, updated);
  notifyUpdated();
  return next;
}

export function advanceApplicantStatus(applicantId: string): IndustryApplicant | null {
  const list = readIndustryApplicants();
  const idx = list.findIndex((a) => a.id === applicantId);
  if (idx < 0) return null;
  const current = list[idx];
  const i = APPLICANT_STATUS_FLOW.indexOf(current.status as (typeof APPLICANT_STATUS_FLOW)[number]);
  if (i < 0 || i >= APPLICANT_STATUS_FLOW.length - 1) return current;
  return setApplicantStatus(applicantId, APPLICANT_STATUS_FLOW[i + 1]);
}

export function addApplicantMentorFeedback(
  applicantId: string,
  input: { mentorName: string; rating: number; comment: string },
): IndustryApplicant | null {
  const list = readIndustryApplicants();
  const idx = list.findIndex((a) => a.id === applicantId);
  if (idx < 0) return null;
  const next: IndustryApplicant = {
    ...list[idx],
    mentorName: input.mentorName.trim() || 'Industry Mentor',
    mentorRating: Math.min(5, Math.max(1, Math.round(input.rating))),
    mentorComment: input.comment.trim(),
    mentorAt: new Date().toISOString(),
  };
  const updated = [...list];
  updated[idx] = next;
  writeJsonSilent(APPLICANTS_KEY, updated);
  notifyUpdated();
  return next;
}

export function industryPostingsAsInternships(): StudentInternshipCard[] {
  ensureSeed();
  const fromFeed = readJson<StudentInternshipCard[] | null>(STUDENT_FEED_KEY, null);
  if (Array.isArray(fromFeed) && fromFeed.length > 0) {
    return fromFeed.map((c) => ({ ...c, fromIndustry: true as const }));
  }
  return readIndustryPostings().map(postingToStudentCard);
}

export const INDUSTRY_DEMO_CREDENTIALS = {
  email: 'company@gmail.com',
  password: 'hire',
  user: {
    id: 'industry-demo-1',
    name: 'EduRoute Partners',
    email: 'company@gmail.com',
    role: 'industry' as const,
    verificationStatus: 'verified',
  },
};
