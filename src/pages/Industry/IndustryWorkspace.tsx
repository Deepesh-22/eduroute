import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  LogOut,
  Plus,
  MapPin,
  IndianRupee,
  Users,
  Briefcase,
  Sparkles,
  Clock,
  Star,
} from 'lucide-react';
import { clearAuthSession, getAuthUser } from '../../utils/rbacAuth';
import {
  addApplicantMentorFeedback,
  addIndustryPosting,
  advanceApplicantStatus,
  APPLICANT_STATUS_FLOW,
  readIndustryApplicants,
  readIndustryPostings,
  setApplicantStatus,
  type ApplicantStatus,
  type IndustryApplicant,
  type IndustryPosting,
  type WorkMode,
} from '../../utils/industryStore';
import { ThemeToggle } from '../../components/ThemeToggle';

function applicantBadge(status: ApplicantStatus): string {
  switch (status) {
    case 'Applied':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/25 dark:text-indigo-200';
    case 'Shortlisted':
      return 'bg-sky-100 text-sky-800 dark:bg-sky-500/25 dark:text-sky-200';
    case 'Interview':
      return 'bg-amber-100 text-amber-900 dark:bg-amber-500/25 dark:text-amber-200';
    case 'Offer':
      return 'bg-violet-100 text-violet-900 dark:bg-violet-500/25 dark:text-violet-200';
    case 'Hired':
      return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/25 dark:text-emerald-200';
    case 'Completed':
      return 'bg-teal-100 text-teal-900 dark:bg-teal-500/25 dark:text-teal-200';
    case 'Rejected':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-500/25 dark:text-rose-200';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200';
  }
}

export const IndustryWorkspace = () => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const [postings, setPostings] = useState<IndustryPosting[]>(() => readIndustryPostings());
  const [applicants, setApplicants] = useState<IndustryApplicant[]>(() => readIndustryApplicants());
  const [selectedPostingId, setSelectedPostingId] = useState(
    () => readIndustryPostings()[0]?.id || '',
  );
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [postingBusy, setPostingBusy] = useState(false);
  const [form, setForm] = useState({
    title: '',
    skills: '',
    stipend: '',
    location: '',
    description: '',
    duration: '3 Months',
    mode: 'Hybrid' as WorkMode,
  });
  const [mentorDraft, setMentorDraft] = useState<Record<string, { name: string; rating: number; comment: string }>>({});

  const refresh = useCallback(() => {
    const p = readIndustryPostings();
    setPostings(p);
    setApplicants(readIndustryApplicants());
    setSelectedPostingId((prev) => prev || p[0]?.id || '');
  }, []);

  useEffect(() => {
    refresh();
    const onUp = () => refresh();
    window.addEventListener('eduroute:industry-updated', onUp);
    return () => window.removeEventListener('eduroute:industry-updated', onUp);
  }, [refresh]);

  const filteredApplicants = useMemo(
    () => applicants.filter((a) => a.postingId === selectedPostingId),
    [applicants, selectedPostingId],
  );

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const title = form.title.trim();
    const stipend = form.stipend.trim();
    const location = form.location.trim();
    if (!title || !stipend || !location) {
      setFormError('Title, stipend, and location are required.');
      return;
    }
    const skills = form.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setPostingBusy(true);
    try {
      const created = addIndustryPosting({
        title,
        skills: skills.length ? skills : ['General'],
        stipend,
        location,
        description: form.description.trim(),
        duration: form.duration,
        mode: form.mode,
      });
      setForm({
        title: '',
        skills: '',
        stipend: '',
        location: '',
        description: '',
        duration: '3 Months',
        mode: 'Hybrid',
      });
      setShowForm(false);
      setSelectedPostingId(created.id);
      refresh();
    } finally {
      setPostingBusy(false);
    }
  };

  const nextLabel = (status: ApplicantStatus) => {
    const i = APPLICANT_STATUS_FLOW.indexOf(status as (typeof APPLICANT_STATUS_FLOW)[number]);
    if (i < 0 || i >= APPLICANT_STATUS_FLOW.length - 1) return null;
    return APPLICANT_STATUS_FLOW[i + 1];
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-black">Industry workspace</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {user?.name || 'Company'} · post & track interns
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/"
              className="hidden rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 sm:inline"
            >
              Home
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Internship postings</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Full form: skills, stipend, duration, mode · track Applied → Completed · mentor feedback
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-950/40"
          >
            <Plus className="h-4 w-4" /> {showForm ? 'Hide form' : 'Post internship'}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handlePost}
            className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-2"
          >
            {formError && (
              <p
                className="sm:col-span-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                role="alert"
              >
                {formError}
              </p>
            )}
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Role title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Frontend Intern"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Skills required (comma-separated) *
              </label>
              <input
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="React, TypeScript, CSS"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Stipend *</label>
              <input
                required
                value={form.stipend}
                onChange={(e) => setForm({ ...form, stipend: e.target.value })}
                placeholder="25000 or ₹25,000 / mo"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Location *</label>
              <input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Bangalore / Remote"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Duration</label>
              <select
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {['1 Month', '2 Months', '3 Months', '4 Months', '6 Months', '6–12 Months'].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Mode</label>
              <select
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value as WorkMode })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {(['Remote', 'Hybrid', 'Onsite'] as WorkMode[]).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="What the intern will work on…"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={postingBusy}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4" />
                {postingBusy ? 'Posting…' : 'Publish opening'}
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wide text-slate-400">Openings</h2>
            {postings.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPostingId(p.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  selectedPostingId === p.id
                    ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-500/50 dark:bg-indigo-950/40'
                    : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-sm font-bold">{p.title}</div>
                <div className="mt-1 flex flex-wrap gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-0.5">
                    <Clock className="h-3 w-3" /> {p.duration}
                  </span>
                  <span>{p.mode}</span>
                  <span className="inline-flex items-center gap-0.5">
                    <IndianRupee className="h-3 w-3" /> {p.stipend}
                  </span>
                </div>
              </button>
            ))}
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-black">Applicants</h2>
              <span className="text-xs font-bold text-slate-400">{filteredApplicants.length}</span>
            </div>

            {filteredApplicants.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">No applicants for this posting yet.</p>
            )}

            <ul className="space-y-4">
              {filteredApplicants.map((a) => {
                const nxt = nextLabel(a.status);
                const draft = mentorDraft[a.id] || { name: '', rating: 5, comment: '' };
                return (
                  <li
                    key={a.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="font-bold">{a.studentName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {a.college} · {a.email}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {a.skills.map((s) => (
                            <span
                              key={s}
                              className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${applicantBadge(a.status)}`}>
                          {a.status}
                        </span>
                        <div className="mt-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {a.matchPercent}% match
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {nxt && (
                        <button
                          type="button"
                          onClick={() => {
                            advanceApplicantStatus(a.id);
                            refresh();
                          }}
                          className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white"
                        >
                          Advance → {nxt}
                        </button>
                      )}
                      {APPLICANT_STATUS_FLOW.map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            setApplicantStatus(a.id, st);
                            refresh();
                          }}
                          className={`rounded-xl border px-2 py-1 text-[10px] font-bold ${
                            a.status === st
                              ? 'border-indigo-400 text-indigo-700 dark:text-indigo-300'
                              : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setApplicantStatus(a.id, 'Rejected');
                          refresh();
                        }}
                        className="rounded-xl border border-rose-200 px-2 py-1 text-[10px] font-bold text-rose-600 dark:border-rose-900 dark:text-rose-400"
                      >
                        Reject
                      </button>
                    </div>

                    {/* Mentor feedback */}
                    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                      <div className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        <Star className="h-3.5 w-3.5 text-amber-500" /> Mentor feedback
                      </div>
                      {a.mentorComment ? (
                        <div className="text-sm">
                          <div className="font-semibold">
                            {a.mentorName} · {'★'.repeat(a.mentorRating || 0)}
                            {'☆'.repeat(5 - (a.mentorRating || 0))}
                          </div>
                          <p className="mt-1 text-slate-600 dark:text-slate-300">{a.mentorComment}</p>
                        </div>
                      ) : (
                        <div className="grid gap-2 sm:grid-cols-2">
                          <input
                            placeholder="Mentor name"
                            value={draft.name}
                            onChange={(e) =>
                              setMentorDraft({
                                ...mentorDraft,
                                [a.id]: { ...draft, name: e.target.value },
                              })
                            }
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                          />
                          <select
                            value={draft.rating}
                            onChange={(e) =>
                              setMentorDraft({
                                ...mentorDraft,
                                [a.id]: { ...draft, rating: Number(e.target.value) },
                              })
                            }
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                          >
                            {[5, 4, 3, 2, 1].map((r) => (
                              <option key={r} value={r}>
                                {r} star{r > 1 ? 's' : ''}
                              </option>
                            ))}
                          </select>
                          <textarea
                            placeholder="Comment after internship…"
                            value={draft.comment}
                            onChange={(e) =>
                              setMentorDraft({
                                ...mentorDraft,
                                [a.id]: { ...draft, comment: e.target.value },
                              })
                            }
                            rows={2}
                            className="sm:col-span-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!draft.comment.trim()) return;
                              addApplicantMentorFeedback(a.id, {
                                mentorName: draft.name,
                                rating: draft.rating,
                                comment: draft.comment,
                              });
                              refresh();
                            }}
                            className="sm:col-span-2 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white"
                          >
                            Save mentor feedback
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          <Briefcase className="mr-1 inline h-3 w-3" />
          Demo data in localStorage · student Internships page shows these postings
        </p>
      </main>
    </div>
  );
};

export default IndustryWorkspace;
