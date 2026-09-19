import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Plus, Trash2, Sparkles, Check } from 'lucide-react';
import { getAuthUser } from '../../utils/rbacAuth';
import { getStoredUserProfile } from '../../utils/userProfile';
import { readOnboarding } from '../../utils/onboardingStore';
import {
  CV_TEMPLATES,
  defaultCvData,
  emptyEducation,
  emptyExperience,
  emptyProject,
  readCvData,
  saveCvData,
  type CvData,
} from '../../utils/cvStore';

const STEPS = [
  { id: 1, label: 'General info' },
  { id: 2, label: 'Skills' },
  { id: 3, label: 'Education' },
  { id: 4, label: 'Experience' },
  { id: 5, label: 'Projects' },
  { id: 6, label: 'Template & download' },
] as const;

function parseSkills(raw: string): string[] {
  return raw
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 24);
}

function esc(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function openPrintPreview(data: CvData) {
  const skills = data.skills.join(' \u00b7 ');
  const edu = data.education
    .filter((e) => e.school || e.degree)
    .map(
      (e) =>
        `<div class="item"><strong>${esc(e.degree || 'Degree')}</strong> \u2014 ${esc(e.school)} <span class="muted">${esc(e.year)}</span><div class="muted">${esc(e.details)}</div></div>`,
    )
    .join('');
  const exp = data.experience
    .filter((e) => e.role || e.company)
    .map(
      (e) =>
        `<div class="item"><strong>${esc(e.role)}</strong> @ ${esc(e.company)} <span class="muted">${esc(e.duration)}</span><div>${esc(e.description)}</div></div>`,
    )
    .join('');
  const proj = data.projects
    .filter((p) => p.name)
    .map(
      (p) =>
        `<div class="item"><strong>${esc(p.name)}</strong> <span class="muted">${esc(p.tech)}</span><div>${esc(p.description)}</div>${p.link ? `<div class="muted">${esc(p.link)}</div>` : ''}</div>`,
    )
    .join('');

  const isPro = data.template === 'professional';
  const accent =
    data.template === 'modern'
      ? '#6366f1'
      : data.template === 'minimal'
        ? '#0f172a'
        : data.template === 'professional'
          ? '#4f46e5'
          : '#1e293b';

  const body = isPro
    ? `<div class="layout"><div class="side"><h1>${esc(data.fullName || 'Your Name')}</h1><div class="title">${esc(data.title)}</div><div class="meta">${esc(data.email)} \u00b7 ${esc(data.phone)} \u00b7 ${esc(data.city)}</div><h2>Skills</h2><div class="skills">${esc(skills)}</div></div><div><div class="summary">${esc(data.summary)}</div><h2>Experience</h2>${exp || '<div class="muted">\u2014</div>'}<h2>Education</h2>${edu || '<div class="muted">\u2014</div>'}<h2>Projects</h2>${proj || '<div class="muted">\u2014</div>'}</div></div>`
    : `<h1>${esc(data.fullName || 'Your Name')}</h1><div class="title">${esc(data.title)}</div><div class="meta">${esc(data.email)} \u00b7 ${esc(data.phone)} \u00b7 ${esc(data.city)}</div><div class="summary">${esc(data.summary)}</div><h2>Skills</h2><div class="skills">${esc(skills)}</div><h2>Experience</h2>${exp || '<div class="muted">\u2014</div>'}<h2>Education</h2>${edu || '<div class="muted">\u2014</div>'}<h2>Projects</h2>${proj || '<div class="muted">\u2014</div>'}`;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${esc(data.fullName || 'CV')} \u2014 EDUROUTE</title>
<style>
  @page { margin: 14mm; }
  body { font-family: ${data.template === 'classic' ? 'Georgia, serif' : 'system-ui, sans-serif'}; color: #0f172a; margin: 0; padding: 24px; max-width: 800px; margin-inline: auto; }
  h1 { margin: 0 0 4px; font-size: 28px; color: ${accent}; }
  .title { font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 8px; }
  .meta { font-size: 12px; color: #64748b; margin-bottom: 16px; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 2px solid ${accent}; padding-bottom: 4px; margin: 18px 0 10px; color: ${accent}; }
  .item { margin-bottom: 10px; font-size: 13px; line-height: 1.45; }
  .muted { color: #64748b; font-size: 12px; }
  .summary { font-size: 13px; line-height: 1.5; }
  .skills { font-size: 13px; }
  ${isPro ? '.layout { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; } .side { background: #f1f5f9; padding: 16px; border-radius: 8px; }' : ''}
  @media print { body { padding: 0; } }
</style></head><body>${body}<script>window.onload=function(){window.print();}</script></body></html>`;

  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(html);
  w.document.close();
}

export const CvBuilder = () => {
  const user = getAuthUser();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CvData>(() => readCvData());
  const [skillsText, setSkillsText] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    const stored = readCvData();
    const auth = getAuthUser();
    const profile = getStoredUserProfile();
    const onboarding = readOnboarding();
    const seeded = defaultCvData({
      ...stored,
      fullName: stored.fullName || auth?.name || profile?.name || '',
      email: stored.email || auth?.email || profile?.email || '',
      skills:
        stored.skills?.length > 0
          ? stored.skills
          : (onboarding.gapAnswers || [])
              .filter((g) => g.answer === 'yes')
              .map((g) => g.skill)
              .slice(0, 12),
    });
    setData(seeded);
    setSkillsText(seeded.skills.join(', '));
  }, []);

  const progress = useMemo(() => Math.round((step / STEPS.length) * 100), [step]);

  const persist = useCallback((next: CvData) => {
    setData(next);
    saveCvData(next);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1200);
  }, []);

  const update = (patch: Partial<CvData>) => persist({ ...data, ...patch });
  const applySkills = () => update({ skills: parseSkills(skillsText) });

  const handleDownloadPdf = () => {
    applySkills();
    const latest = { ...data, skills: parseSkills(skillsText) };
    saveCvData(latest);
    openPrintPreview(latest);
  };

  const inputCls =
    'mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white';
  const inputSm =
    'rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        {savedFlash && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
        )}
      </div>

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Free templates \u00b7 PDF download
        </p>
        <h1 className="mt-1 flex items-center gap-2 text-3xl font-black text-slate-900 dark:text-white">
          <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          Build your CV
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Fill sections step by step, pick a free template, then download as PDF (browser print).
          {user?.name ? ` Signed in as ${user.name}.` : ''}
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-1 text-right text-[11px] font-bold text-slate-400">{progress}% complete</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(s.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              step === s.id
                ? 'bg-indigo-600 text-white'
                : 'border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            {s.id}. {s.label}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          {step === 1 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">1. General info</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ['fullName', 'Full name'],
                    ['title', 'Target role / title'],
                    ['email', 'Email'],
                    ['phone', 'Phone'],
                    ['city', 'City'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className={key === 'title' ? 'sm:col-span-2' : ''}>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</label>
                    <input value={data[key]} onChange={(e) => update({ [key]: e.target.value })} className={inputCls} />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Summary</label>
                  <textarea
                    rows={3}
                    value={data.summary}
                    onChange={(e) => update({ summary: e.target.value })}
                    placeholder="2\u20133 lines about your strengths and goals\u2026"
                    className={inputCls}
                  />
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">2. Skills</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Comma-separated. Prefilled from onboarding when available.</p>
              <textarea
                rows={4}
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                onBlur={applySkills}
                placeholder="React, TypeScript, SQL, Communication\u2026"
                className={inputCls}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {parseSkills(skillsText).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">3. Education</h2>
                <button
                  type="button"
                  onClick={() => update({ education: [...data.education, emptyEducation()] })}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              <div className="mt-4 space-y-4">
                {data.education.map((row, idx) => (
                  <div key={row.id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input placeholder="School / College" value={row.school} onChange={(e) => { const education = [...data.education]; education[idx] = { ...row, school: e.target.value }; update({ education }); }} className={inputSm} />
                      <input placeholder="Degree" value={row.degree} onChange={(e) => { const education = [...data.education]; education[idx] = { ...row, degree: e.target.value }; update({ education }); }} className={inputSm} />
                      <input placeholder="Year" value={row.year} onChange={(e) => { const education = [...data.education]; education[idx] = { ...row, year: e.target.value }; update({ education }); }} className={inputSm} />
                      <input placeholder="Details (GPA, focus\u2026)" value={row.details} onChange={(e) => { const education = [...data.education]; education[idx] = { ...row, details: e.target.value }; update({ education }); }} className={inputSm} />
                    </div>
                    {data.education.length > 1 && (
                      <button type="button" onClick={() => update({ education: data.education.filter((e) => e.id !== row.id) })} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">4. Experience</h2>
                <button type="button" onClick={() => update({ experience: [...data.experience, emptyExperience()] })} className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              <div className="mt-4 space-y-4">
                {data.experience.map((row, idx) => (
                  <div key={row.id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input placeholder="Role" value={row.role} onChange={(e) => { const experience = [...data.experience]; experience[idx] = { ...row, role: e.target.value }; update({ experience }); }} className={inputSm} />
                      <input placeholder="Company" value={row.company} onChange={(e) => { const experience = [...data.experience]; experience[idx] = { ...row, company: e.target.value }; update({ experience }); }} className={inputSm} />
                      <input placeholder="Duration" value={row.duration} onChange={(e) => { const experience = [...data.experience]; experience[idx] = { ...row, duration: e.target.value }; update({ experience }); }} className={`sm:col-span-2 ${inputSm}`} />
                      <textarea placeholder="What you did / impact" rows={2} value={row.description} onChange={(e) => { const experience = [...data.experience]; experience[idx] = { ...row, description: e.target.value }; update({ experience }); }} className={`sm:col-span-2 ${inputSm}`} />
                    </div>
                    {data.experience.length > 1 && (
                      <button type="button" onClick={() => update({ experience: data.experience.filter((e) => e.id !== row.id) })} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {step === 5 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">5. Projects</h2>
                <button type="button" onClick={() => update({ projects: [...data.projects, emptyProject()] })} className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              <div className="mt-4 space-y-4">
                {data.projects.map((row, idx) => (
                  <div key={row.id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input placeholder="Project name" value={row.name} onChange={(e) => { const projects = [...data.projects]; projects[idx] = { ...row, name: e.target.value }; update({ projects }); }} className={inputSm} />
                      <input placeholder="Tech stack" value={row.tech} onChange={(e) => { const projects = [...data.projects]; projects[idx] = { ...row, tech: e.target.value }; update({ projects }); }} className={inputSm} />
                      <textarea placeholder="Description" rows={2} value={row.description} onChange={(e) => { const projects = [...data.projects]; projects[idx] = { ...row, description: e.target.value }; update({ projects }); }} className={`sm:col-span-2 ${inputSm}`} />
                      <input placeholder="Link (optional)" value={row.link} onChange={(e) => { const projects = [...data.projects]; projects[idx] = { ...row, link: e.target.value }; update({ projects }); }} className={`sm:col-span-2 ${inputSm}`} />
                    </div>
                    {data.projects.length > 1 && (
                      <button type="button" onClick={() => update({ projects: data.projects.filter((p) => p.id !== row.id) })} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {step === 6 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">6. Template &amp; download</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">4 free templates. PDF uses your browser print dialog (Save as PDF).</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {CV_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => update({ template: t.id })}
                    className={`rounded-2xl border p-4 text-left transition ${
                      data.template === t.id
                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/30 dark:border-indigo-400 dark:bg-indigo-950/40'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800'
                    }`}
                  >
                    <p className="font-black text-slate-900 dark:text-white">{t.name}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.blurb}</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </button>
              </div>
            </section>
          )}

          <div className="flex justify-between">
            <button type="button" disabled={step <= 1} onClick={() => setStep((s) => Math.max(1, s - 1))} className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-40 dark:text-slate-300">
              Back
            </button>
            <button
              type="button"
              disabled={step >= STEPS.length}
              onClick={() => {
                if (step === 2) applySkills();
                setStep((s) => Math.min(STEPS.length, s + 1));
              }}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white disabled:opacity-40 hover:bg-indigo-700"
            >
              Next
            </button>
          </div>
        </div>

        <aside className="lg:col-span-2">
          <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Live preview \u00b7 {data.template}
            </div>
            <div className={`rounded-xl border border-slate-100 p-4 text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 ${data.template === 'classic' ? 'font-serif' : ''}`}>
              <h3 className={`text-xl font-black ${data.template === 'modern' || data.template === 'professional' ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                {data.fullName || 'Your Name'}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{data.title || 'Target role'}</p>
              <p className="mt-1 text-[11px] text-slate-400">
                {[data.email, data.phone, data.city].filter(Boolean).join(' \u00b7 ') || 'email \u00b7 phone \u00b7 city'}
              </p>
              {data.summary && <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{data.summary}</p>}
              {data.skills.length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">Skills</p>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">{data.skills.join(' \u00b7 ')}</p>
                </div>
              )}
              {data.experience.some((e) => e.role) && (
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">Experience</p>
                  {data.experience.filter((e) => e.role).map((e) => (
                    <div key={e.id} className="mt-1 text-[11px]">
                      <span className="font-bold">{e.role}</span>
                      {e.company ? ` @ ${e.company}` : ''}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CvBuilder;
