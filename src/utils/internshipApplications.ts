/**
 * Student internship applications — client-only (localStorage).
 * Status pipeline: Applied → Shortlisted → Interview → Hired
 */

import { getAuthUser } from './rbacAuth';

export type ApplicationStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Hired';

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
};

const GLOBAL_KEY = 'eduroute:internship-applications-v1';
const BY_EMAIL_PREFIX = 'eduroute:internship-applications-v1:';

const STATUS_ORDER: ApplicationStatus[] = ['Applied', 'Shortlisted', 'Interview', 'Hired'];

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

export function readApplications(): InternshipApplication[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(storageKey());
    if (!raw) {
      // migrate global → email if logged in
      const email = currentEmail();
      if (email) {
        const global = localStorage.getItem(GLOBAL_KEY);
        if (global) {
          localStorage.setItem(storageKey(), global);
          return JSON.parse(global) as InternshipApplication[];
        }
      }
      return [];
    }
    const list = JSON.parse(raw) as InternshipApplication[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeApplications(list: InternshipApplication[]) {
  try {
    if (typeof window === 'undefined') return;
    const json = JSON.stringify(list);
    localStorage.setItem(storageKey(), json);
    localStorage.setItem(GLOBAL_KEY, json);
    window.dispatchEvent(new Event('eduroute:applications-updated'));
  } catch {
    /* private mode */
  }
}

export function hasApplied(internshipId: string): boolean {
  return readApplications().some((a) => a.internshipId === internshipId);
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
}): InternshipApplication | null {
  const existing = readApplications();
  if (existing.some((a) => a.internshipId === input.internshipId)) {
    return null; // already applied
  }
  const now = new Date().toISOString();
  const app: InternshipApplication = {
    ...input,
    status: 'Applied',
    appliedAt: now,
    updatedAt: now,
  };
  writeApplications([app, ...existing]);
  return app;
}

/** Advance status one step (demo tracker). No-op if already Hired. */
export function advanceApplicationStatus(internshipId: string): InternshipApplication | null {
  const list = readApplications();
  const idx = list.findIndex((a) => a.internshipId === internshipId);
  if (idx < 0) return null;
  const current = list[idx];
  const i = STATUS_ORDER.indexOf(current.status);
  if (i < 0 || i >= STATUS_ORDER.length - 1) return current;
  const next: InternshipApplication = {
    ...current,
    status: STATUS_ORDER[i + 1],
    updatedAt: new Date().toISOString(),
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
  };
  const updated = [...list];
  updated[idx] = next;
  writeApplications(updated);
  return next;
}

export function statusBadgeClass(status: ApplicationStatus): string {
  switch (status) {
    case 'Applied':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200';
    case 'Shortlisted':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300';
    case 'Interview':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300';
    case 'Hired':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200';
  }
}
