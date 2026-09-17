/**
 * Local queue for student college-ID uploads so they appear in the admin panel
 * when the backend is unreachable. Backend data takes priority when available.
 */

export type LocalPendingVerification = {
  id: string;
  verificationId: string;
  name: string;
  email: string;
  phone?: string;
  course?: string;
  college?: string;
  location?: string;
  dateOfBirth?: string;
  year?: string;
  fileName?: string;
  documentDataUrl?: string;
  mimeType?: string;
  appliedAt: string;
  status: 'pending' | 'verified' | 'rejected';
};

const STORE_KEY = 'eduroute.localPendingVerifications';

const readAll = (): LocalPendingVerification[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeAll = (items: LocalPendingVerification[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota / private mode
  }
};

export const listLocalPendingVerifications = (): LocalPendingVerification[] =>
  readAll().filter((item) => item.status === 'pending');

export const addLocalPendingVerification = (
  payload: Omit<LocalPendingVerification, 'id' | 'verificationId' | 'status' | 'appliedAt'> &
    { appliedAt?: string },
): LocalPendingVerification => {
  const id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const entry: LocalPendingVerification = {
    id,
    verificationId: id,
    status: 'pending',
    appliedAt: payload.appliedAt || new Date().toISOString(),
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    course: payload.course,
    college: payload.college,
    location: payload.location,
    dateOfBirth: payload.dateOfBirth,
    year: payload.year,
    fileName: payload.fileName,
    documentDataUrl: payload.documentDataUrl,
    mimeType: payload.mimeType,
  };
  const next = [entry, ...readAll()];
  writeAll(next);
  return entry;
};

export const updateLocalVerificationStatus = (
  id: string,
  status: 'verified' | 'rejected',
): void => {
  const next = readAll().map((item) =>
    item.id === id || item.verificationId === id ? { ...item, status } : item,
  );
  writeAll(next);
};

export const getLocalVerificationDocument = (id: string): LocalPendingVerification | null => {
  return readAll().find((item) => item.id === id || item.verificationId === id) || null;
};
