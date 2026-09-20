import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LogOut,
  Plus,
  MapPin,
  Clock,
  Users,
  BookOpen,
  Briefcase,
  FlaskConical,
  Building2,
  Sparkles,
  CheckCircle2,
  HandHelping,
  Presentation,
  ExternalLink,
} from 'lucide-react';
import { clearAuthSession, getAuthUser } from '../../utils/rbacAuth';
import {
  addFacultyOpportunity,
  advanceInterestStatus,
  applyToOpportunity,
  FACULTY_STATUS_FLOW,
  FACULTY_TABS,
  FACULTY_TYPES,
  readFacultyInterests,
  readFacultyOpportunities,
  updateInterestStatus,
  type FacultyInterest,
  type FacultyInterestStatus,
  type FacultyOpportunity,
  type FacultyOpportunityType,
  type FacultyTabId,
} from '../../utils/facultyStore';
import { ThemeToggle } from '../../components/ThemeToggle';

const typeIcon = (type: FacultyOpportunityType) => {
  switch (type) {
    case 'FDP':
      return <BookOpen className="h-4 w-4" />;
    case 'Faculty Internship':
      return <Briefcase className="h-4 w-4" />;
    case 'Industrial Training':
      return <Building2 className="h-4 w-4" />;
    case 'Consultancy':
      return <Users className="h-4 w-4" />;
    case 'Research Collaboration':
      return <FlaskConical className="h-4 w-4" />;
    case 'Workshop':
      return <Presentation className="h-4 w-4" />;
    case 'Mentorship for Teachers':
      return <HandHelping className="h-4 w-4" />;
    default:
      return <Sparkles className="h-4 w-4" />;
  }
};

const typeBadge = (type: FacultyOpportunityType) => {
  const map: Record<FacultyOpportunityType, string> = {
    FDP: 'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300',
    'Faculty Internship': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300',
    'Industrial Training': 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
    Consultancy: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    'Research Collaboration': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
    Workshop: 'bg-pink-100 text-pink-800 dark:bg-pink-950/50 dark:text-pink-300',
    'Mentorship for Teachers': 'bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300',
  };
  return map[type];
};

const statusBadge = (status: FacultyInterestStatus) => {
  switch (status) {
    case 'Applied':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/25 dark:text-indigo-200';
    case 'Shortlisted':
      return 'bg-sky-100 text-sky-800 dark:bg-sky-500/25 dark:text-sky-200';
    case 'Accepted':
      return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/25 dark:text-emerald-200';
    case 'Completed':
      return 'bg-teal-100 text-teal-900 dark:bg-teal-500/25 dark:text-teal-200';
    case 'Withdrawn':
      return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200';
  }
};

export const FacultyWorkspace = () => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const [opps, setOpps] = useState<FacultyOpportunity[]>(() => readFacultyOpportunities());
  const [interests, setInterests] = useState<FacultyInterest[]>(() => readFacultyInterests());
  const [tab, setTab] = useState<FacultyTabId>('all');
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'FDP' as FacultyOpportunityType,
    organizer: '',
    location: '',
    duration: '',
    mode: 'Hybrid',
    domain: '',
    description: '',
    seats: '',
    link: '',
  });

  const refresh = useCallback(() => {
    setOpps(readFacultyOpportunities());
    setInterests(readFacultyInterests());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const myEmail = user?.email || 'faculty@gmail.com';

  const filtered = useMemo(() => {
    const tabDef = FACULTY_TABS.find((t) => t.id === tab);
    if (!tabDef || !tabDef.types) return opps;
    return opps.filter((o) => tabDef.types!.includes(o.type));
  }, [opps, tab]);

  const myApplications = useMemo(
    () => interests.filter((i) => i.email === myEmail),
    [interests, myEmail],
  );

  const interestByOpp = useMemo(() => {
    const m = new Map<string, FacultyInterest>();
    for (const i of myApplications) m.set(i.opportunityId, i);
    return m;
  }, [myApplications]);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  const handleApply = (oppId: string) => {
    applyToOpportunity(oppId, {
      name: user?.name || 'Faculty Member',
      email: myEmail,
      institution: (user as { institutionName?: string } | null)?.institutionName || 'Your Institution',
      department: 'General',
    });
    refresh();
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.title.trim() || !form.organizer.trim()) {
      setFormError('Title and organizer are required.');
      return;
    }
    setBusy(true);
    try {
      addFacultyOpportunity({
        title: form.title.trim(),
        type: form.type,
        organizer: form.organizer.trim(),
        location: form.location.trim() || 'TBA',
        duration: form.duration.trim() || 'Flexible',
        mode: form.mode,
        domain: form.domain.trim() || 'General',
        description: form.description.trim() || 'Faculty opportunity posted via EduRoute.',
        seats: form.seats.trim() || undefined,
        link: form.link.trim() || undefined,
      });
      setForm({
        title: '',
        type: 'FDP',
        organizer: '',
        location: '',
        duration: '',
        mode: 'Hybrid',
        domain: '',
        description: '',
        seats: '',
        link: '',
      });
      setShowForm(false);
      refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-black">Faculty workspace</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {user?.name || 'Academician'} · FDPs, training, research & workshops
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

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Academician hub</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Apply to FDPs, faculty internships, research, workshops & mentorship programs. Open official portals from each card.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg"
          >
            <Plus className="h-4 w-4" /> {showForm ? 'Hide form' : 'Post opportunity'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {FACULTY_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-wide transition ${
                tab === t.id
                  ? 'bg-violet-600 text-white shadow'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {showForm && (
          <form
            onSubmit={handlePost}
            className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-2"
          >
            {formError && (
              <p className="sm:col-span-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300" role="alert">
                {formError}
              </p>
            )}
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as FacultyOpportunityType })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                {FACULTY_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Organizer *</label>
              <input required value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Duration</label>
              <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Mode</label>
              <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                {['Online', 'Hybrid', 'On-site'].map((m) => (<option key={m} value={m}>{m}</option>))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Domain</label>
              <input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Official portal URL (optional)</label>
              <input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://atalacademy.aicte-india.org/" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={busy} className="rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{busy ? 'Posting…' : 'Publish opportunity'}</button>
            </div>
          </form>
        )}

        {myApplications.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-violet-600" /> My applications
            </h2>
            <ul className="space-y-3">
              {myApplications.map((app) => {
                const opp = opps.find((o) => o.id === app.opportunityId);
                const idx = FACULTY_STATUS_FLOW.indexOf(app.status);
                const next = idx >= 0 && idx < FACULTY_STATUS_FLOW.length - 1 ? FACULTY_STATUS_FLOW[idx + 1] : null;
                return (
                  <li key={app.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/40">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold">{opp?.title || app.opportunityId}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{opp?.type} · Applied {new Date(app.appliedAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${statusBadge(app.status)}`}>{app.status}</span>
                      {next && (
                        <button type="button" onClick={() => { advanceInterestStatus(app.id); refresh(); }} className="rounded-xl bg-violet-600 px-2.5 py-1 text-[10px] font-bold text-white">Advance → {next}</button>
                      )}
                      {app.status !== 'Withdrawn' && app.status !== 'Completed' && (
                        <button type="button" onClick={() => { updateInterestStatus(app.id, 'Withdrawn'); refresh(); }} className="rounded-xl border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:border-slate-700">Withdraw</button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((opp) => {
            const mine = interestByOpp.get(opp.id);
            return (
              <article key={opp.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${typeBadge(opp.type)}`}>
                    {typeIcon(opp.type)} {opp.type}
                  </span>
                  {opp.seats && <span className="text-[10px] font-bold text-slate-400">{opp.seats} seats</span>}
                </div>
                <h3 className="text-base font-black leading-snug">{opp.title}</h3>
                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{opp.organizer}</p>
                <p className="mt-3 flex-1 text-sm text-slate-600 dark:text-slate-300">{opp.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {opp.location}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {opp.duration}</span>
                  <span>{opp.mode}</span>
                  <span className="text-violet-600 dark:text-violet-400">{opp.domain}</span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {opp.link && (
                    <a href={opp.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-bold text-violet-700 hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-950/60">
                      <ExternalLink className="h-4 w-4" /> Official portal
                    </a>
                  )}
                  {mine ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1.5 text-xs font-black uppercase ${statusBadge(mine.status)}`}>{mine.status}</span>
                      <span className="text-[10px] text-slate-400">Tracked in EduRoute</span>
                    </div>
                  ) : (
                    <button type="button" onClick={() => handleApply(opp.id)} className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-500">
                      <CheckCircle2 className="h-4 w-4" /> Track interest
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">No opportunities in this tab yet.</p>
        )}

        <p className="text-center text-xs text-slate-400">Demo · Login: faculty@gmail.com / faculty · Portals: ATAL, AICTE Internship, NPTEL, SWAYAM, SERB, NITTTR</p>
      </main>
    </div>
  );
};

export default FacultyWorkspace;
