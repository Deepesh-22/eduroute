import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Check,
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Building2,
  User,
  FileText,
  IdCard,
} from 'lucide-react';
import {
  apiFetchVerificationDocument,
  apiGetPendingStudents,
  apiVerifyStudent,
} from '../../utils/authApi';
import {
  listLocalPendingVerifications,
  updateLocalVerificationStatus,
  getLocalVerificationDocument,
} from '../../utils/pendingVerificationStore';

type PendingStudent = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  course?: string;
  college?: string;
  location?: string;
  dateOfBirth?: string;
  year?: string;
  fileName?: string;
  verificationId?: string;
  appliedAt?: string;
  collegeVerified?: string;
  documentCreatedAt?: string;
  source?: 'api' | 'local' | 'demo';
  documentDataUrl?: string;
  mimeType?: string;
};

/** Constant demo rows — always visible for UI testing */
const DEMO_CONSTANT: PendingStudent[] = [
  {
    id: 'demo-1',
    name: 'Aman Sharma',
    email: 'aman.sharma@gmail.com',
    phone: '+91 98765 43210',
    course: 'B.Tech Computer Science',
    college: 'Government Engineering College, Kota',
    location: 'Kota, Rajasthan',
    dateOfBirth: '12 Jan 2005',
    year: '1st Year',
    fileName: 'id_card_aman.jpg',
    verificationId: 'demo-1',
    appliedAt: '2025-09-16T10:24:00',
    source: 'demo',
  },
  {
    id: 'demo-2',
    name: 'Priya Verma',
    email: 'priya.verma@gmail.com',
    phone: '+91 99887 76655',
    course: 'B.Tech Information Technology',
    college: 'MSU Baroda',
    location: 'Vadodara, Gujarat',
    year: '2nd Year',
    fileName: 'admission_letter.pdf',
    verificationId: 'demo-2',
    appliedAt: '2025-09-15T16:12:00',
    source: 'demo',
  },
];

const formatApplied = (iso?: string) => {
  if (!iso) return 'Recently';
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

export const PendingApprovals = () => {
  const [students, setStudents] = useState<PendingStudent[]>(DEMO_CONSTANT);
  const [selectedId, setSelectedId] = useState<string | null>(DEMO_CONSTANT[0]?.id || null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [docPreviewUrl, setDocPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'id' | 'docs'>('profile');
  const [backendConnected, setBackendConnected] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage('');

    let apiRows: PendingStudent[] = [];
    let connected = false;

    try {
      const response = await apiGetPendingStudents();
      connected = true;
      apiRows = (response.data || []).map((row: any) => ({
        id: String(row.id),
        name: row.name || 'Student',
        email: row.email || '',
        phone: row.phone,
        course: row.course,
        college: row.college,
        location: row.location,
        fileName: row.fileName,
        verificationId: row.verificationId ? String(row.verificationId) : undefined,
        appliedAt: row.documentCreatedAt || row.createdAt,
        collegeVerified: row.collegeVerified,
        source: 'api' as const,
      }));
    } catch {
      connected = false;
    }

    setBackendConnected(connected);

    const localRows: PendingStudent[] = listLocalPendingVerifications().map((item) => ({
      ...item,
      source: 'local' as const,
    }));

    // Demos always stay; then API real data; then local uploads not already in API
    const apiEmails = new Set(apiRows.map((r) => r.email.toLowerCase()));
    const localOnly = localRows.filter((l) => !apiEmails.has(l.email.toLowerCase()));
    const merged = [...DEMO_CONSTANT, ...apiRows, ...localOnly];

    setStudents(merged);
    setSelectedId((prev) => {
      if (prev && merged.some((s) => s.id === prev)) return prev;
      return merged[0]?.id || null;
    });

    if (connected) {
      setMessage(
        apiRows.length
          ? `Loaded ${apiRows.length} real pending request(s) from backend (+ 2 demo rows).`
          : 'Backend connected. No pending API requests yet — demo rows still shown.',
      );
    } else {
      setMessage('Backend offline — showing demo rows and any local uploads.');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  const selected = useMemo(
    () => students.find((s) => s.id === selectedId) || null,
    [students, selectedId],
  );

  useEffect(() => {
    let revoke: string | null = null;
    const loadDoc = async () => {
      setDocPreviewUrl(null);
      if (!selected?.verificationId) return;

      if (selected.source === 'local' || selected.source === 'demo' || selected.documentDataUrl) {
        const local = getLocalVerificationDocument(selected.verificationId);
        if (local?.documentDataUrl) {
          setDocPreviewUrl(local.documentDataUrl);
          return;
        }
        if (selected.documentDataUrl) {
          setDocPreviewUrl(selected.documentDataUrl);
          return;
        }
        return;
      }

      try {
        const blob = await apiFetchVerificationDocument(selected.verificationId);
        const url = URL.createObjectURL(blob);
        revoke = url;
        setDocPreviewUrl(url);
      } catch {
        // no document available from API
      }
    };
    loadDoc().catch(() => undefined);
    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [selected]);

  const handleDecision = async (action: 'approve' | 'reject') => {
    if (!selected) return;
    if (selected.source === 'demo') {
      setMessage('Demo rows stay constant and cannot be removed.');
      return;
    }

    setActionLoading(true);
    setMessage('');
    try {
      if (selected.source === 'api') {
        await apiVerifyStudent(selected.id, action);
      } else {
        updateLocalVerificationStatus(selected.id, action === 'approve' ? 'verified' : 'rejected');
      }
      setStudents((prev) => prev.filter((s) => s.id !== selected.id || s.source === 'demo'));
      setSelectedId((prev) => {
        const remaining = students.filter((s) => s.id !== selected.id || s.source === 'demo');
        return remaining.find((s) => s.id !== selected.id)?.id || remaining[0]?.id || null;
      });
      setMessage(`Student ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
      // Refresh real data after action
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">Student Approval Requests</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Review student details, verify ID card and profile, then approve or reject their application.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              backendConnected
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            {backendConnected ? 'Backend connected' : 'Backend offline'}
          </span>
          <button
            type="button"
            onClick={() => load()}
            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface-input)]"
          >
            Refresh
          </button>
        </div>
      </div>

      {message && (
        <p className="text-sm rounded-xl px-3 py-2 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
          {message}
        </p>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <section className="xl:col-span-2 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[var(--border-default)] flex items-center justify-between">
            <h2 className="font-bold text-[var(--text-primary)]">
              Pending Approvals ({students.length})
            </h2>
            <select className="text-xs font-semibold rounded-lg border border-[var(--border-default)] bg-[var(--surface-input)] px-2 py-1.5 text-[var(--text-secondary)]">
              <option>All</option>
              <option>New</option>
            </select>
          </div>

          <div className="divide-y divide-[var(--border-default)] max-h-[70vh] overflow-y-auto">
            {loading && (
              <div className="p-8 text-center text-sm text-[var(--text-secondary)]">Loading…</div>
            )}
            {!loading && students.length === 0 && (
              <div className="p-8 text-center text-sm text-[var(--text-secondary)]">No pending requests.</div>
            )}
            {students.map((student) => {
              const active = student.id === selectedId;
              return (
                <div
                  key={`${student.source}-${student.id}`}
                  className={`p-4 flex flex-col gap-3 transition-colors cursor-pointer ${
                    active
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-l-indigo-500'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                  }`}
                  onClick={() => {
                    setSelectedId(student.id);
                    setActiveTab('profile');
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200 flex items-center justify-center font-black shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[var(--text-primary)]">{student.name}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                          {student.source === 'demo' ? 'Demo' : student.source === 'api' ? 'Live' : 'Local'}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">
                        {student.course || 'Course not set'}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Applied on {formatApplied(student.appliedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-bold rounded-lg border border-[var(--border-default)] bg-[var(--surface-input)] text-[var(--text-secondary)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(student.id);
                        setActiveTab('profile');
                      }}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(student.id);
                        void handleDecision('approve');
                      }}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-bold rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950/40"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(student.id);
                        void handleDecision('reject');
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="xl:col-span-3 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] shadow-sm overflow-hidden flex flex-col min-h-[520px]">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-sm text-[var(--text-secondary)] p-8">
              Select a student to review their profile and ID.
            </div>
          ) : (
            <>
              <div className="border-b border-[var(--border-default)] px-4 flex gap-1">
                {(
                  [
                    { id: 'profile' as const, label: 'Profile', icon: User },
                    { id: 'id' as const, label: 'ID Card', icon: IdCard },
                    { id: 'docs' as const, label: 'Documents', icon: FileText },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5 md:p-6 flex-1 space-y-6 overflow-y-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="h-24 w-24 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 overflow-hidden flex items-center justify-center text-3xl font-black text-indigo-700 dark:text-indigo-200 shrink-0">
                    {selected.name.charAt(0)}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-black text-[var(--text-primary)]">{selected.name}</h3>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Pending Approval
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <Mail className="h-3.5 w-3.5" /> {selected.email}
                    </div>
                    {selected.phone && (
                      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <Phone className="h-3.5 w-3.5" /> {selected.phone}
                      </div>
                    )}
                    {selected.location && (
                      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <MapPin className="h-3.5 w-3.5" /> {selected.location}
                      </div>
                    )}
                    {selected.course && (
                      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <GraduationCap className="h-3.5 w-3.5" /> {selected.course}
                      </div>
                    )}
                    {selected.college && (
                      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <Building2 className="h-3.5 w-3.5" /> {selected.college}
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border-default)] p-4 bg-[var(--surface-input)]">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                      <IdCard className="h-4 w-4 text-indigo-500" />
                      Student ID Card {selected.fileName || docPreviewUrl ? '(Uploaded)' : '(Not uploaded)'}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-dashed border-[var(--border-default)] bg-white dark:bg-slate-900/50 min-h-[140px] flex items-center justify-center overflow-hidden p-2">
                      {docPreviewUrl ? (
                        selected.mimeType?.includes('pdf') || selected.fileName?.endsWith('.pdf') ? (
                          <a
                            href={docPreviewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-indigo-600 underline"
                          >
                            Open PDF document
                          </a>
                        ) : (
                          <img src={docPreviewUrl} alt="ID document" className="max-h-48 object-contain" />
                        )
                      ) : (
                        <span className="text-xs text-[var(--text-secondary)] px-4 text-center">
                          {selected.fileName
                            ? `Document: ${selected.fileName}${selected.source === 'api' ? ' — open via backend when available' : ''}`
                            : 'No document attached'}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-2 text-sm">
                      {['Name matches', 'Roll number matches', 'College name verified', 'Valid session'].map((label) => (
                        <li key={label} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                          <Check className="h-4 w-4" /> {label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-3 text-[var(--text-primary)]">Profile Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">Full Name</div>
                      <div className="font-semibold text-[var(--text-primary)]">{selected.name}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">Course</div>
                      <div className="font-semibold text-[var(--text-primary)]">{selected.course || '—'}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">Email</div>
                      <div className="font-semibold text-[var(--text-primary)]">{selected.email}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">College</div>
                      <div className="font-semibold text-[var(--text-primary)]">{selected.college || '—'}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">Phone</div>
                      <div className="font-semibold text-[var(--text-primary)]">{selected.phone || '—'}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">Location</div>
                      <div className="font-semibold text-[var(--text-primary)]">{selected.location || '—'}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">Date of Birth</div>
                      <div className="font-semibold text-[var(--text-primary)]">{selected.dateOfBirth || '—'}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">Year</div>
                      <div className="font-semibold text-[var(--text-primary)]">{selected.year || '—'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border-default)] p-4 flex flex-wrap gap-3 justify-end bg-[var(--surface-input)]/50">
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-default)] font-semibold text-sm text-[var(--text-secondary)]"
                  onClick={() => setSelectedId(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading || selected.source === 'demo'}
                  onClick={() => handleDecision('approve')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm inline-flex items-center gap-2 disabled:opacity-60"
                >
                  <Check className="h-4 w-4" /> Approve Student
                </button>
                <button
                  type="button"
                  disabled={actionLoading || selected.source === 'demo'}
                  onClick={() => handleDecision('reject')}
                  className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm inline-flex items-center gap-2 disabled:opacity-60"
                >
                  <X className="h-4 w-4" /> Reject Student
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default PendingApprovals;
