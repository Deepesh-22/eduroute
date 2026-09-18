/**
 * Industry / recruiter postings + applicants — client-only (localStorage).
 * Posted openings are also shown on the student Internships page.
 */

export type IndustryPosting = {
  id: string;
  title: string;
  skills: string[];
  stipend: string;
  location: string;
  description: string;
  company: string;
  type: string;
  duration: string;
  postedAt: string;
  logo?: string;
};

export type ApplicantStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Rejected';

export type IndustryApplicant = {
  id: string;
  postingId: string;
  studentName: string;
  email: string;
  college: string;
  skills: string[];
  matchPercent: number;
  status: ApplicantStatus;
  appliedAt: string;
};

const POSTINGS_KEY = 'eduroute:industry-postings-v1';
const APPLICANTS_KEY = 'eduroute:industry-applicants-v1';

const DEMO_POSTINGS: IndustryPosting[] = [
  {
    id: 'ind-post-1',
    title: 'SDE Intern — Full Stack',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    stipend: '₹30,000 / mo',
    location: 'Bangalore, India (Hybrid)',
    description:
      'Build features on our learning platform. Work with mentors on real product tickets. Strong fundamentals in JS and APIs preferred.',
    company: 'EduRoute Partners',
    type: 'Full-time',
    duration: '6 Months',
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=EP',
  },
  {
    id: 'ind-post-2',
    title: 'Cybersecurity Intern',
    skills: ['Linux', 'Networking', 'SIEM', 'Python'],
    stipend: '₹28,000 / mo',
    location: 'Delhi NCR, India',
    description:
      'Assist the SOC team with alert triage, vulnerability scans, and basic incident documentation. Training provided.',
    company: 'EduRoute Partners',
    type: 'Full-time',
    duration: '4 Months',
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
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
    status: 'Applied',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'app-stu-2',
    postingId: 'ind-post-1',
    studentName: 'Priya Patel',
    email: 'priya.patel@college.edu',
    college: 'IIIT Hyderabad',
    skills: ['React', 'PostgreSQL', 'DSA'],
    matchPercent: 76,
    status: 'Shortlisted',
    appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'app-stu-3',
    postingId: 'ind-post-2',
    studentName: 'Rohan Mehta',
    email: 'rohan.mehta@college.edu',
    college: 'VIT Vellore',
    skills: ['Linux', 'Networking', 'Python'],
    matchPercent: 82,
    status: 'Applied',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function readJson<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('eduroute:industry-updated'));
  } catch {
    /* private mode */
  }
}

function ensureSeed() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(POSTINGS_KEY)) {
    writeJson(POSTINGS_KEY, DEMO_POSTINGS);
  }
  if (!localStorage.getItem(APPLICANTS_KEY)) {
    writeJson(APPLICANTS_KEY, DEMO_APPLICANTS);
  }
}

export function readIndustryPostings(): IndustryPosting[] {
  ensureSeed();
  const list = readJson<IndustryPosting[]>(POSTINGS_KEY, DEMO_POSTINGS);
  return Array.isArray(list) ? list : DEMO_POSTINGS;
}

export function addIndustryPosting(
  input: Omit<IndustryPosting, 'id' | 'postedAt' | 'company' | 'logo' | 'type' | 'duration'> & {
    type?: string;
    duration?: string;
  },
): IndustryPosting {
  const postings = readIndustryPostings();
  const posting: IndustryPosting = {
    id: `ind-post-${Date.now()}`,
    title: input.title.trim(),
    skills: input.skills,
    stipend: input.stipend.trim(),
    location: input.location.trim(),
    description: input.description.trim(),
    company: 'EduRoute Partners',
    type: input.type || 'Full-time',
    duration: input.duration || '3–6 Months',
    postedAt: new Date().toISOString(),
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=EP',
  };
  writeJson(POSTINGS_KEY, [posting, ...postings]);
  return posting;
}

export function readIndustryApplicants(postingId?: string): IndustryApplicant[] {
  ensureSeed();
  const list = readJson<IndustryApplicant[]>(APPLICANTS_KEY, DEMO_APPLICANTS);
  const all = Array.isArray(list) ? list : DEMO_APPLICANTS;
  if (!postingId) return all;
  return all.filter((a) => a.postingId === postingId);
}

export function shortlistApplicant(applicantId: string): IndustryApplicant | null {
  const list = readIndustryApplicants();
  const idx = list.findIndex((a) => a.id === applicantId);
  if (idx < 0) return null;
  const next: IndustryApplicant = { ...list[idx], status: 'Shortlisted' };
  const updated = [...list];
  updated[idx] = next;
  writeJson(APPLICANTS_KEY, updated);
  return next;
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
  writeJson(APPLICANTS_KEY, updated);
  return next;
}

/** Map industry postings into the shape used by student Internships cards. */
export function industryPostingsAsInternships() {
  return readIndustryPostings().map((p) => ({
    id: p.id,
    role: p.title,
    company: p.company,
    location: p.location,
    stipend: p.stipend,
    type: p.type,
    duration: p.duration,
    posted: formatRelative(p.postedAt),
    logo: p.logo || 'https://api.dicebear.com/7.x/initials/svg?seed=EP',
    tags: p.skills,
    sector: 'software' as const,
    verified: true,
    fastTrack: false,
    employeeCount: 'Industry partner',
    companylink: '#',
    description: p.description,
    fromIndustry: true as const,
  }));
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} week(s) ago`;
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
