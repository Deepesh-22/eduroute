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
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"');
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
          <p className="text-sm text-slate-500">Loading CV builder sections...</p>
        </div>
      </div>
    </div>
  );
};

export default CvBuilder;
