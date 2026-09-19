/**
 * Student CV builder data — client-only (localStorage).
 */

export type CvTemplateId = 'classic' | 'modern' | 'minimal' | 'professional';

export type CvEducation = {
  id: string;
  school: string;
  degree: string;
  year: string;
  details: string;
};

export type CvExperience = {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
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
  fullName: string;
  email: string;
  phone: string;
  city: string;
  title: string;
  summary: string;
  skills: string[];
  education: CvEducation[];
  experience: CvExperience[];
  projects: CvProject[];
  updatedAt: string;
};

const KEY = 'eduroute:cv-builder-v1';

export const CV_TEMPLATES: {
  id: CvTemplateId;
  name: string;
  blurb: string;
}[] = [
  { id: 'classic', name: 'Classic', blurb: 'Clean serif headers, ATS-friendly' },
  { id: 'modern', name: 'Modern', blurb: 'Bold accent bar, contemporary' },
  { id: 'minimal', name: 'Minimal', blurb: 'Lots of space, simple type' },
  { id: 'professional', name: 'Professional', blurb: 'Two-column sidebar layout' },
];

export function emptyEducation(): CvEducation {
  return { id: `edu-${Date.now()}`, school: '', degree: '', year: '', details: '' };
}

export function emptyExperience(): CvExperience {
  return { id: `exp-${Date.now()}`, role: '', company: '', duration: '', description: '' };
}

export function emptyProject(): CvProject {
  return { id: `proj-${Date.now()}`, name: '', tech: '', description: '', link: '' };
}

export function defaultCvData(partial?: Partial<CvData>): CvData {
  return {
    template: 'modern',
    fullName: '',
    email: '',
    phone: '',
    city: '',
    title: 'Software Developer',
    summary: '',
    skills: [],
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
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultCvData();
    return { ...defaultCvData(), ...(JSON.parse(raw) as CvData) };
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
