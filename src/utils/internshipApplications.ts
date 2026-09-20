/**
 * Student internship applications — client-only (localStorage).
 * Pipeline: Applied → Shortlisted → Interview → Offer → Hired → Completed
 */

import { getAuthUser } from './rbacAuth';

export type ApplicationStatus =
  | 'Applied'
  | 'Shortlisted'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Completed';

export type MentorFeedback = {
  mentorName: string;
  rating: number; // 1–5
  comment: string;
  at: string;
};

export type InternshipApplication = {
  internshipId: string;
  role: string;
  company: string;
  location: string;
  stipend: string;
  logo?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  duration?: string;
  mode?: string;
  mentorFeedback?: MentorFeedback;
  completionNote?: string;
  completedAt?: string;
  isDemo?: boolean;
};

const GLOBAL_KEY = 'eduroute:internship-applications-v2';
const BY_EMAIL_PREFIX = 'eduroute:internship-applications-v2:';

export const STATUS_ORDER: ApplicationStatus[] = [
  'Applied',
  'Shortlisted',
  'Interview',
  'Offer',
  'Hired',
  'Completed',
];

const DEMO_APPLICATIONS: InternshipApplication[] = [
  {
    internshipId: 'demo-applied-1',
    role: 'Frontend Developer Intern',
    company: 'TechFlow Systems',
    location: 'Bangalore, India',
    stipend: '₹25,000 / mo',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TF',
    status: 'Applied',
    duration: '3 Months',
    mode: 'Remote',
    appliedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    isDemo: true,
  },
  {
    internshipId: 'demo-shortlisted-2',
    role: 'Data Analyst Intern',
    company: 'InsightHive',
    location: 'Gurgaon, India',
    stipend: '₹26,000 / mo',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=IH',
    status: 'Shortlisted',
    duration: '4 Months',
    mode: 'Hybrid',
    appliedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    isDemo: true,
  },
  {
    internshipId: 'demo-interview-3',
    role: 'Cybersecurity Analyst Intern',
    company: 'ShieldOps',
    location: 'Delhi NCR, India',
    stipend: '₹27,000 / mo',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SO',
    status: 'Interview',
    duration: '6 Months',
    mode: 'Onsite',
    appliedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    isDemo: true,
  },
  {
    internshipId: 'demo-completed-4',
    role: 'Backend Intern',
    company: 'CloudNest',
    location: 'Pune, India',
    stipend: '₹28,000 / mo',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CN',
    status: 'Completed',
    duration: '3 Months',
    mode: 'Hybrid',
    appliedAt: new Date(Date.now() - 120 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    completionNote: 'Internship completed successfully.',
    mentorFeedback: {
      mentorName: 'Ananya Rao',
      rating: 5,
      comment: 'Strong ownership and clean API design. Ready for full-time consideration.',
      at: new Date(Date.now() - 9 * 86400000).toISOString(),
    },
    isDemo: true,
  },
];

function currentEmail(): string | null {
  try {
    return getAuthUser()?.email?.trim().toLowerCase() || null;
  } catch {
    return null;
  }
}

function storageKey(): string {
  const email = currentEmail();
  return email ? `${BY_EMAIL_PREFIX}${email}` : GLOBAL_KEY;
}

function notify() {
  try {
    window.dispatchEvent(new Event('eduroute:applications-updated'));
  } catch {
    /* ignore */
  }
}

function writeApplications(list: InternshipApplication[]) {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(list));
  } catch {
    /* ignore */
  }
  notify();
}

export function readApplications(): InternshipApplication[] {
  if (typeof window === 'undefined') return [...DEMO_APPLICATIONS];
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return [...DEMO_APPLICATIONS];
    const parsed = JSON.parse(raw) as InternshipApplication[];
    if (!Array.isArray(parsed)) return [...DEMO_APPLICATIONS];
    const user = parsed.filter((a) => !a.isDemo);
    const demos = DEMO_APPLICATIONS.filter((d) => !user.some((u) => u.internshipId === d.internshipId));
    return [...user, ...demos];
  } catch {
    return [...DEMO_APPLICATIONS];
  }
}

export function hasApplied(internshipId: string): boolean {
  return readApplications().some((a) => a.internshipId === internshipId && !a.isDemo);
}

export function getApplication(internshipId: string): InternshipApplication | undefined {
  return readApplications().find((a) => a.internshipId === internshipId);
}

export function applyToInternship(input: {
  internshipId: string;
  role: string;
  company: string;
  location: string;
  stipend: string;
  logo?: string;
  duration?: string;
  mode?: string;
}): InternshipApplication {
  const list = readApplications().filter((a) => a.internshipId !== input.internshipId || a.isDemo);
  const now = new Date().toISOString();
  const app: InternshipApplication = {
    internshipId: input.internshipId,
    role: input.role,
    company: input.company,
    location: input.location,
    stipend: input.stipend,
    logo: input.logo,
    duration: input.duration,
    mode: input.mode,
    status: 'Applied',
    appliedAt: now,
    updatedAt: now,
  };
  writeApplications([app, ...list.filter((a) => a.internshipId !== input.internshipId)]);
  return app;
}

export function advanceApplicationStatus(internshipId: string): InternshipApplication | null {
  const list = readApplications();
  const idx = list.findIndex((a) => a.internshipId === internshipId);
  if (idx < 0) return null;
  const current = list[idx];
  const i = STATUS_ORDER.indexOf(current.status);
  if (i < 0 || i >= STATUS_ORDER.length - 1) return current;
  const nextStatus = STATUS_ORDER[i + 1];
  const next: InternshipApplication = {
    ...current,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
    ...(nextStatus === 'Completed'
      ? { completedAt: new Date().toISOString(), completionNote: current.completionNote || 'Internship completed.' }
      : {}),
  };
  const updated = [...list];
  updated[idx] = next;
  writeApplications(updated);
  return next;
}

export function setApplicationStatus(
  internshipId: string,
  status: ApplicationStatus,
): InternshipApplication | null {
  const list = readApplications();
  const idx = list.findIndex((a) => a.internshipId === internshipId);
  if (idx < 0) return null;
  const next: InternshipApplication = {
    ...list[idx],
    status,
    updatedAt: new Date().toISOString(),
    ...(status === 'Completed'
      ? {
          completedAt: new Date().toISOString(),
          completionNote: list[idx].completionNote || 'Internship completed.',
        }
      : {}),
  };
  const updated = [...list];
  updated[idx] = next;
  writeApplications(updated);
  return next;
}

export function addMentorFeedback(
  internshipId: string,
  feedback: Omit<MentorFeedback, 'at'>,
): InternshipApplication | null {
  const list = readApplications();
  const idx = list.findIndex((a) => a.internshipId === internshipId);
  if (idx < 0) return null;
  const next: InternshipApplication = {
    ...list[idx],
    mentorFeedback: {
      mentorName: feedback.mentorName.trim() || 'Industry Mentor',
      rating: Math.min(5, Math.max(1, Math.round(feedback.rating))),
      comment: feedback.comment.trim(),
      at: new Date().toISOString(),
    },
    updatedAt: new Date().toISOString(),
  };
  const updated = [...list];
  updated[idx] = next;
  writeApplications(updated);
  return next;
}

/** Completions with optional mentor feedback — for student profile */
export function readCompletions(): InternshipApplication[] {
  return readApplications().filter((a) => a.status === 'Completed');
}

export function statusBadgeClass(status: ApplicationStatus): string {
  switch (status) {
    case 'Applied':
      return 'bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-500/25 dark:text-indigo-200 dark:border-indigo-500/40';
    case 'Shortlisted':
      return 'bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-500/25 dark:text-sky-200 dark:border-sky-500/40';
    case 'Interview':
      return 'bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-500/25 dark:text-amber-200 dark:border-amber-500/40';
    case 'Offer':
      return 'bg-violet-100 text-violet-900 border border-violet-200 dark:bg-violet-500/25 dark:text-violet-200 dark:border-violet-500/40';
    case 'Hired':
      return 'bg-emerald-100 text-emerald-900 border border-emerald-200 dark:bg-emerald-500/25 dark:text-emerald-200 dark:border-emerald-500/40';
    case 'Completed':
      return 'bg-teal-100 text-teal-900 border border-teal-200 dark:bg-teal-500/25 dark:text-teal-200 dark:border-teal-500/40';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600';
  }
}

export function statusButtonClass(status: ApplicationStatus): string {
  switch (status) {
    case 'Applied':
      return 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400';
    case 'Shortlisted':
      return 'bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400';
    case 'Interview':
      return 'bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-400';
    case 'Offer':
      return 'bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400';
    case 'Hired':
      return 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400';
    case 'Completed':
      return 'bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400';
    default:
      return 'bg-slate-700 text-white dark:bg-slate-600';
  }
}
