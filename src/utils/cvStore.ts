/**
 * Student CV builder — client-only (localStorage).
 * Templates modeled on professional single-column (Emily) + sidebar (Brian) layouts.
 */

export type CvTemplateId = 'classic' | 'modern' | 'minimal' | 'professional';

export type CvAccentId = 'indigo' | 'slate' | 'emerald' | 'rose' | 'amber';

export type CvEducation = {
  id: string;
  school: string;
  degree: string;
  year: string;
  location: string;
  details: string;
};

export type CvExperience = {
  id: string;
  role: string;
  company: string;
  duration: string;
  location: string;
  description: string; // bullets separated by newlines
};

export type CvProject = {
  id: string;
  name: string;
  tech: string;
  description: string;
  link: string;
};

export type CvData = {
  template: CvTemplateId;
  accent: CvAccentId;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  linkedin: string;
  title: string;
  summary: string;
  skills: string[];
  certificates: string[];
  languages: string[];
  education: CvEducation[];
  experience: CvExperience[];
  projects: CvProject[];
  updatedAt: string;
};

const KEY = 'eduroute:cv-builder-v3';

export const ACCENT_COLORS: Record<CvAccentId, { hex: string; label: string }> = {
  indigo: { hex: '#4f46e5', label: 'Indigo' },
  slate: { hex: '#1e293b', label: 'Slate' },
  emerald: { hex: '#059669', label: 'Emerald' },
  rose: { hex: '#e11d48', label: 'Rose' },
  amber: { hex: '#d97706', label: 'Amber' },
};

export const CV_TEMPLATES: {
  id: CvTemplateId;
  name: string;
  blurb: string;
  tags: string[];
  layout: 'single' | 'sidebar';
}[] = [
  {
    id: 'classic',
    name: 'Classic',
    blurb: 'Centered name · timeline dates · ATS-friendly (Emily style)',
    tags: ['ATS', 'Traditional'],
    layout: 'single',
  },
  {
    id: 'modern',
    name: 'Modern',
    blurb: 'Accent header bar · clean single column',
    tags: ['Popular', 'Bold'],
    layout: 'single',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    blurb: 'Airy spacing · simple type · recruiter-friendly',
    tags: ['Clean', 'ATS'],
    layout: 'single',
  },
  {
    id: 'professional',
    name: 'Professional',
    blurb: 'Dark sidebar · photo-ready layout (Brian style)',
    tags: ['Sidebar', 'Executive'],
    layout: 'sidebar',
  },
];

export function emptyEducation(): CvEducation {
  return {
    id: `edu-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    school: '',
    degree: '',
    year: '',
    location: '',
    details: '',
  };
}

export function emptyExperience(): CvExperience {
  return {
    id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    role: '',
    company: '',
    duration: '',
    location: '',
    description: '',
  };
}

export function emptyProject(): CvProject {
  return {
    id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: '',
    tech: '',
    description: '',
    link: '',
  };
}

export function defaultCvData(partial?: Partial<CvData>): CvData {
  return {
    template: 'classic',
    accent: 'slate',
    fullName: '',
    email: '',
    phone: '',
    city: '',
    linkedin: '',
    title: 'Software Developer',
    summary: '',
    skills: [],
    certificates: [],
    languages: [],
    education: [emptyEducation()],
    experience: [emptyExperience()],
    projects: [emptyProject()],
    updatedAt: new Date().toISOString(),
    ...partial,
  };
}

export function readCvData(): CvData {
  if (typeof window === 'undefined') return defaultCvData();
  try {
    const raw =
      window.localStorage.getItem(KEY) ||
      window.localStorage.getItem('eduroute:cv-builder-v2') ||
      window.localStorage.getItem('eduroute:cv-builder-v1');
    if (!raw) return defaultCvData();
    const parsed = JSON.parse(raw) as Partial<CvData>;
    return {
      ...defaultCvData(),
      ...parsed,
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      certificates: Array.isArray(parsed.certificates) ? parsed.certificates : [],
      languages: Array.isArray(parsed.languages) ? parsed.languages : [],
      education: Array.isArray(parsed.education) && parsed.education.length ? parsed.education : [emptyEducation()],
      experience: Array.isArray(parsed.experience) && parsed.experience.length ? parsed.experience : [emptyExperience()],
      projects: Array.isArray(parsed.projects) && parsed.projects.length ? parsed.projects : [emptyProject()],
    };
  } catch {
    return defaultCvData();
  }
}

export function saveCvData(data: CvData): void {
  if (typeof window === 'undefined') return;
  try {
    const next = { ...data, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export const SAMPLE_SUMMARIES = [
  'Project Manager with six years of experience coordinating cross-functional initiatives in technology and business operations. Skilled in stakeholder communication, project planning, risk tracking, and delivery governance across complex environments. Known for building practical workflows, improving team alignment, and keeping priorities moving under tight deadlines.',
  'Detail-oriented engineering student seeking internship opportunities. Strong foundation in data structures, algorithms, and modern web technologies with hands-on project experience.',
  'Results-driven learner with project experience in React, Node.js, and cloud tools. Eager to contribute to real-world products and grow with a collaborative team.',
];

export const SUGGESTED_SKILLS = [
  'Project Planning',
  'Risk Management',
  'Budget Tracking',
  'Jira',
  'Stakeholder Management',
  'Agile Delivery',
  'Process Improvement',
  'Microsoft Project',
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Python',
  'SQL',
  'Git',
  'Communication',
  'Problem Solving',
  'Teamwork',
];

export const SUGGESTED_CERTIFICATES = [
  'Project Management Professional (PMP)',
  'Certified ScrumMaster (CSM)',
  'Google Project Management Certificate',
  'AWS Cloud Practitioner',
  'Google Data Analytics',
  'Meta Front-End Developer',
];

export const SUGGESTED_LANGUAGES = ['English', 'French', 'Hindi', 'Spanish', 'Mandarin'];
