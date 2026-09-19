import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Download, FileText, Plus, Trash2, Sparkles, Check, LayoutTemplate,
  User, GraduationCap, Briefcase, FolderKanban, Wrench, Palette, Wand2, Award, Languages,
} from 'lucide-react';
import { getAuthUser } from '../../utils/rbacAuth';
import { getStoredUserProfile } from '../../utils/userProfile';
import {
  ACCENT_COLORS, CV_TEMPLATES, SAMPLE_SUMMARIES, SUGGESTED_SKILLS,
  SUGGESTED_CERTIFICATES, SUGGESTED_LANGUAGES,
  emptyEducation, emptyExperience, emptyProject,
  readCvData, saveCvData,
  type CvAccentId, type CvData, type CvTemplateId,
} from '../../utils/cvStore';

type Phase = 'templates' | 'editor';
type SectionId = 'contact' | 'summary' | 'skills' | 'certificates' | 'languages' | 'education' | 'experience' | 'projects' | 'design';

const SECTIONS: { id: SectionId; label: string; icon: typeof User }[] = [
  { id: 'contact', label: 'Contact', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'design', label: 'Design', icon: Palette },
];

function parseList(raw: string) {
  return raw.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean).slice(0, 28);
}
function esc(s: string) {
  return String(s || '')
    .replace(/&/g, '&' + 'amp;')
    .replace(/</g, '&' + 'lt;')
    .replace(/>/g, '&' + 'gt;')
    .replace(/"/g, '&' + 'quot;');
}
function accentHex(id: CvAccentId) {
  return ACCENT_COLORS[id]?.hex || '#4f46e5';
}
function bulletsHtml(text: string) {
  const lines = String(text || '')
    .split(/\n/)
    .map((l) => l.replace(/^[\s•\-\*]+/, '').trim())
    .filter(Boolean);
  if (!lines.length) return '';
  return `<ul>${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`;
}
function twoColList(items: string[]) {
  if (!items.length) return '';
  const mid = Math.ceil(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);
  return `<div class="two-col"><ul>${left.map((i) => `<li>${esc(i)}</li>`).join('')}</ul><ul>${right.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`;
}

function buildClassicHtml(data: CvData) {
  const contactParts: string[] = [];
  if (data.city) contactParts.push(`<span class="ci">📍 ${esc(data.city)}</span>`);
  if (data.email) contactParts.push(`<span class="ci">✉ ${esc(data.email)}</span>`);
  if (data.phone) contactParts.push(`<span class="ci">📞 ${esc(data.phone)}</span>`);
  if (data.linkedin) contactParts.push(`<span class="ci">🔗 ${esc(data.linkedin)}</span>`);
  const exp = data.experience.filter((e) => e.role || e.company).map((e) => `<div class="exp-item"><div class="exp-head"><div><div class="role">${esc(e.role)}</div><div class="company">${esc(e.company)}</div></div><div class="exp-meta"><div>${esc(e.duration)}</div>${e.location ? `<div class="loc">${esc(e.location)}</div>` : ''}</div></div>${bulletsHtml(e.description)}</div>`).join('');
  const edu = data.education.filter((e) => e.school || e.degree).map((e) => `<div class="exp-item"><div class="exp-head"><div><div class="role">${esc(e.degree || 'Degree')}</div><div class="company">${esc(e.school)}</div></div><div class="exp-meta"><div>${esc(e.year)}</div>${e.location ? `<div class="loc">${esc(e.location)}</div>` : ''}</div></div></div>`).join('');
  const proj = data.projects.filter((p) => p.name).map((p) => `<div class="exp-item"><div class="role">${esc(p.name)}${p.tech ? ` <span class="muted">· ${esc(p.tech)}</span>` : ''}</div>${bulletsHtml(p.description)}</div>`).join('');
  return `<div class="classic"><header class="hdr"><h1>${esc(data.fullName || 'Your Name')}</h1>${data.title ? `<div class="subtitle">${esc(data.title)}</div>` : ''}${contactParts.length ? `<div class="contact-row">${contactParts.join('')}</div>` : ''}</header>${data.summary ? `<section><h2>SUMMARY</h2><p class="sum">${esc(data.summary)}</p></section>` : ''}${exp ? `<section><h2>PROFESSIONAL EXPERIENCE</h2>${exp}</section>` : ''}${edu ? `<section><h2>EDUCATION</h2>${edu}</section>` : ''}${data.skills.length ? `<section><h2>SKILLS</h2>${twoColList(data.skills)}</section>` : ''}${data.certificates.length ? `<section><h2>CERTIFICATES</h2>${twoColList(data.certificates)}</section>` : ''}${data.languages.length ? `<section><h2>LANGUAGES</h2>${twoColList(data.languages)}</section>` : ''}${proj ? `<section><h2>PROJECTS</h2>${proj}</section>` : ''}</div>`;
}

function buildSidebarHtml(data: CvData) {
  const sideContact: string[] = [];
  if (data.phone) sideContact.push(`<div class="sc">📞 ${esc(data.phone)}</div>`);
  if (data.email) sideContact.push(`<div class="sc">✉ ${esc(data.email)}</div>`);
  if (data.city) sideContact.push(`<div class="sc">📍 ${esc(data.city)}</div>`);
  if (data.linkedin) sideContact.push(`<div class="sc">🔗 ${esc(data.linkedin)}</div>`);
  const langDots = data.languages.map((l) => `<div class="lang-row"><span>${esc(l)}</span><span class="dots">●●●●●</span></div>`).join('');
  const exp = data.experience.filter((e) => e.role || e.company).map((e) => `<div class="item"><div class="item-title">${esc(e.company || e.role)}</div><div class="item-sub">${esc(e.role)}${e.duration ? ` · ${esc(e.duration)}` : ''}${e.location ? ` | ${esc(e.location)}` : ''}</div>${bulletsHtml(e.description)}</div>`).join('');
  const edu = data.education.filter((e) => e.school || e.degree).map((e) => `<div class="item"><div class="item-title">${esc(e.degree || 'Degree')}</div><div class="item-sub">${esc(e.school)}${e.year ? ` · ${esc(e.year)}` : ''}${e.location ? ` | ${esc(e.location)}` : ''}</div></div>`).join('');
  const skillsList = data.skills.length ? `<ul class="skill-list">${data.skills.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : '';
  const certs = data.certificates.length ? data.certificates.map((c) => `<div class="award">${esc(c)}</div>`).join('') : '';
  const projs = data.projects.filter((p) => p.name).map((p) => `<div class="item"><div class="item-title">${esc(p.name)}</div><div class="item-sub">${esc(p.tech)}</div>${bulletsHtml(p.description)}</div>`).join('');
  return `<div class="sidebar-layout"><aside class="side"><div class="photo-placeholder">👤</div><h1>${esc(data.fullName || 'Your Name')}</h1><div class="side-title">${esc(data.title || 'Professional')}</div><div class="side-contact">${sideContact.join('')}</div>${data.summary ? `<div class="side-block"><div class="side-h">PROFILE</div><p>${esc(data.summary)}</p></div>` : ''}${langDots ? `<div class="side-block"><div class="side-h">LANGUAGES</div>${langDots}</div>` : ''}${certs ? `<div class="side-block"><div class="side-h">AWARDS</div>${certs}</div>` : ''}</aside><main class="main">${exp ? `<section><div class="mh">💼 WORK EXPERIENCE</div>${exp}</section>` : ''}${edu ? `<section><div class="mh">🎓 EDUCATION</div>${edu}</section>` : ''}${skillsList ? `<section><div class="mh">💡 SKILLS</div>${skillsList}</section>` : ''}${projs ? `<section><div class="mh">📁 PROJECTS</div>${projs}</section>` : ''}</main></div>`;
}

function buildSimpleHtml(data: CvData, a: string) {
  const skills = data.skills.join(' · ');
  const edu = data.education.filter((e) => e.school || e.degree).map((e) => `<div class="item"><strong>${esc(e.degree || 'Degree')}</strong> — ${esc(e.school)} <span class="muted">${esc(e.year)}${e.location ? ` · ${esc(e.location)}` : ''}</span></div>`).join('');
  const exp = data.experience.filter((e) => e.role || e.company).map((e) => `<div class="item"><strong>${esc(e.role)}</strong> @ ${esc(e.company)} <span class="muted">${esc(e.duration)}${e.location ? ` · ${esc(e.location)}` : ''}</span>${bulletsHtml(e.description)}</div>`).join('');
  const proj = data.projects.filter((p) => p.name).map((p) => `<div class="item"><strong>${esc(p.name)}</strong> <span class="muted">${esc(p.tech)}</span>${bulletsHtml(p.description)}</div>`).join('');
  const bar = data.template === 'modern' ? `<div style="height:6px;background:${a};margin:-28px -28px 18px"></div>` : '';
  return `${bar}<h1 style="color:${a}">${esc(data.fullName || 'Your Name')}</h1><div class="title">${esc(data.title)}</div><div class="meta">${[data.email, data.phone, data.city, data.linkedin].filter(Boolean).map(esc).join(' · ')}</div>${data.summary ? `<div class="summary">${esc(data.summary)}</div>` : ''}${data.skills.length ? `<h2 style="border-color:${a};color:${a}">Skills</h2><div>${esc(skills)}</div>` : ''}${exp ? `<h2 style="border-color:${a};color:${a}">Experience</h2>${exp}` : ''}${edu ? `<h2 style="border-color:${a};color:${a}">Education</h2>${edu}` : ''}${data.certificates.length ? `<h2 style="border-color:${a};color:${a}">Certificates</h2><div>${data.certificates.map(esc).join(' · ')}</div>` : ''}${data.languages.length ? `<h2 style="border-color:${a};color:${a}">Languages</h2><div>${data.languages.map(esc).join(' · ')}</div>` : ''}${proj ? `<h2 style="border-color:${a};color:${a}">Projects</h2>${proj}` : ''}`;
}

function openPrintPreview(data: CvData) {
  const a = accentHex(data.accent);
  let body = '';
  let extraCss = '';
  if (data.template === 'classic') {
    body = buildClassicHtml(data);
    extraCss = `.classic{max-width:720px;margin:0 auto;font-family:Georgia,'Times New Roman',serif;color:#111;font-size:12.5px;line-height:1.45}.hdr{text-align:center;margin-bottom:18px}.hdr h1{margin:0;font-size:28px;font-weight:700}.subtitle{font-style:italic;font-size:14px;color:#444;margin-top:4px}.contact-row{display:flex;flex-wrap:wrap;justify-content:center;gap:12px 18px;margin-top:10px;font-size:11.5px;color:#333;font-family:system-ui,sans-serif}.ci{white-space:nowrap}h2{font-family:system-ui,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;border-bottom:1.5px solid #111;margin:16px 0 8px;padding-bottom:3px}.sum{margin:0;text-align:justify}.exp-item{margin-bottom:10px}.exp-head{display:flex;justify-content:space-between;gap:12px}.role{font-weight:700;font-size:13px}.company{font-style:italic;color:#333}.exp-meta{text-align:right;font-size:11.5px;white-space:nowrap;color:#222}.loc{color:#555}ul{margin:4px 0 0 18px;padding:0}li{margin-bottom:2px}.two-col{display:grid;grid-template-columns:1fr 1fr;gap:4px 24px}.two-col ul{margin-left:16px}.muted{color:#666;font-weight:400}`;
  } else if (data.template === 'professional') {
    body = buildSidebarHtml(data);
    extraCss = `.sidebar-layout{display:grid;grid-template-columns:240px 1fr;min-height:100vh;font-family:system-ui,sans-serif;font-size:12px}.side{background:#1e3a4c;color:#e8eef2;padding:28px 20px}.photo-placeholder{width:88px;height:88px;border-radius:50%;background:#2d4f63;display:flex;align-items:center;justify-content:center;font-size:36px;margin:0 auto 14px}.side h1{margin:0;font-size:20px;text-align:center;font-weight:700;color:#fff}.side-title{text-align:center;font-size:12px;color:#a8c0ce;margin:4px 0 16px}.side-contact{font-size:11px;margin-bottom:18px;line-height:1.7}.side-block{margin-top:16px}.side-h{font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;background:#2d4f63;padding:5px 8px;margin-bottom:8px;border-radius:3px}.side-block p{margin:0;font-size:11px;line-height:1.5;color:#d0dde6}.lang-row{display:flex;justify-content:space-between;margin-bottom:4px;font-size:11px}.dots{letter-spacing:2px;color:#7eb8d4;font-size:9px}.award{font-size:11px;margin-bottom:6px;line-height:1.4}.main{padding:24px 28px;color:#1a1a1a}.mh{font-size:11px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;background:#e8eef2;padding:6px 10px;margin:0 0 12px;border-radius:3px;color:#1e3a4c}.item{margin-bottom:12px}.item-title{font-weight:700;font-size:13px}.item-sub{font-size:11px;color:#555;margin-bottom:4px}.main ul{margin:4px 0 0 16px;padding:0}.main li{margin-bottom:2px}@page{margin:0}body{margin:0;padding:0}`;
  } else {
    body = buildSimpleHtml(data, a);
    extraCss = `body{font-family:system-ui,sans-serif;color:#0f172a;padding:28px;max-width:800px;margin:0 auto;font-size:13px}h1{margin:0;font-size:26px}h2{font-size:11px;text-transform:uppercase;border-bottom:2px solid;margin:14px 0 6px;padding-bottom:2px}.title{font-size:14px;color:#475569}.meta{font-size:12px;color:#64748b;margin-top:2px}.summary{margin:10px 0}.item{margin-bottom:8px}.muted{color:#64748b}ul{margin:4px 0 0 16px;padding:0}`;
  }
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${esc(data.fullName || 'CV')}</title><style>@page{margin:12mm;size:A4}*{box-sizing:border-box}body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}${extraCss}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>${body}<script>window.onload=function(){setTimeout(function(){window.print()},280)}</script></body></html>`;
  const w = window.open('', '_blank', 'noopener,noreferrer');
  if (!w) { alert('Please allow pop-ups to download / print your CV.'); return; }
  w.document.open(); w.document.write(html); w.document.close();
}

const inputCls = 'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100';

export const CvBuilder = () => {
  const [phase, setPhase] = useState<Phase>('templates');
  const [section, setSection] = useState<SectionId>('contact');
  const [data, setData] = useState<CvData>(() => readCvData());
  const [skillsText, setSkillsText] = useState('');
  const [certsText, setCertsText] = useState('');
  const [langsText, setLangsText] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    const auth = getAuthUser();
    const profile = getStoredUserProfile();
    setData((prev) => {
      const next = { ...prev };
      if (!next.fullName && (profile?.name || auth?.name)) next.fullName = profile?.name || auth?.name || '';
      if (!next.email && (profile?.email || auth?.email)) next.email = profile?.email || auth?.email || '';
      return next;
    });
  }, []);

  useEffect(() => {
    setSkillsText((data.skills || []).join(', '));
    setCertsText((data.certificates || []).join(', '));
    setLangsText((data.languages || []).join(', '));
  }, [data.skills, data.certificates, data.languages]);

  const update = useCallback((patch: Partial<CvData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch };
      saveCvData(next);
      return next;
    });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1200);
  }, []);

  const applySkills = () => update({ skills: parseList(skillsText) });
  const applyCerts = () => update({ certificates: parseList(certsText) });
  const applyLangs = () => update({ languages: parseList(langsText) });

  const handleDownloadPdf = () => {
    applySkills(); applyCerts(); applyLangs();
    openPrintPreview({ ...data, skills: parseList(skillsText), certificates: parseList(certsText), languages: parseList(langsText) });
  };

  const selectTemplate = (id: CvTemplateId) => {
    update({ template: id });
    setPhase('editor');
    setSection('contact');
  };

  const liveSkills = parseList(skillsText).length ? parseList(skillsText) : (data.skills || []);
  const liveCerts = parseList(certsText).length ? parseList(certsText) : (data.certificates || []);
  const liveLangs = parseList(langsText).length ? parseList(langsText) : (data.languages || []);

  if (phase === 'templates') {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6"><Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600"><ArrowLeft className="h-4 w-4" /> Dashboard</Link></div>
        <div className="mb-8 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"><LayoutTemplate className="h-3.5 w-3.5" /> FlowCV-style builder</div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Choose a template</h1>
          <p className="mt-2 text-sm text-slate-500">Classic = Emily Carter · Professional = Brian T. Wayne</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {CV_TEMPLATES.map((t) => (
            <button key={t.id} type="button" onClick={() => selectTemplate(t.id)} className={`group relative overflow-hidden rounded-2xl border-2 p-5 text-left transition hover:shadow-lg ${data.template === t.id ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
              <div className="mb-3 flex h-28 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                {t.layout === 'sidebar' ? (
                  <div className="flex h-20 w-28 overflow-hidden rounded border border-slate-300 dark:border-slate-600"><div className="w-2/5 bg-slate-700" /><div className="flex-1 space-y-1.5 bg-white p-2 dark:bg-slate-900"><div className="h-1.5 w-full rounded bg-slate-200" /><div className="h-1.5 w-4/5 rounded bg-slate-200" /><div className="h-1.5 w-3/5 rounded bg-slate-200" /></div></div>
                ) : (
                  <div className="w-28 space-y-1.5 rounded border border-slate-300 bg-white p-2 dark:border-slate-600 dark:bg-slate-900"><div className="mx-auto h-2 w-16 rounded bg-slate-800" /><div className="mx-auto h-1 w-12 rounded bg-slate-300" /><div className="h-1 w-full rounded bg-slate-200" /><div className="h-1 w-full rounded bg-slate-200" /></div>
                )}
              </div>
              <div className="flex items-start justify-between gap-2"><div><h3 className="font-bold text-slate-900 dark:text-white">{t.name}</h3><p className="mt-0.5 text-xs text-slate-500">{t.blurb}</p></div>{data.template === t.id && <Check className="h-5 w-5 shrink-0 text-indigo-600" />}</div>
              <div className="mt-2 flex flex-wrap gap-1">{t.tags.map((tag) => (<span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{tag}</span>))}</div>
            </button>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button type="button" onClick={() => setPhase('editor')} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500">Continue with {CV_TEMPLATES.find((t) => t.id === data.template)?.name || 'Classic'} <Sparkles className="h-4 w-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setPhase('templates')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600"><ArrowLeft className="h-4 w-4" /> Templates</button>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{CV_TEMPLATES.find((t) => t.id === data.template)?.name} CV</span>
          {savedFlash && <span className="text-xs font-semibold text-emerald-600">Saved</span>}
        </div>
        <button type="button" onClick={handleDownloadPdf} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-500"><Download className="h-4 w-4" /> Download PDF</button>
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <nav className="lg:col-span-2"><ul className="sticky top-20 space-y-1">{SECTIONS.map((s) => { const Icon = s.icon; return (<li key={s.id}><button type="button" onClick={() => setSection(s.id)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold ${section === s.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}><Icon className="h-3.5 w-3.5" />{s.label}</button></li>); })}</ul></nav>
        <div className="space-y-4 lg:col-span-5">
          {section === 'contact' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Contact & role</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">{([['fullName', 'Full name'], ['title', 'Target role / title'], ['email', 'Email'], ['phone', 'Phone'], ['city', 'City / location'], ['linkedin', 'LinkedIn URL or handle']] as const).map(([k, l]) => (<div key={k} className={k === 'title' || k === 'linkedin' ? 'sm:col-span-2' : ''}><label className="text-xs font-bold text-slate-500">{l}</label><input value={data[k]} onChange={(e) => update({ [k]: e.target.value })} className={inputCls} placeholder={l} /></div>))}</div>
            </section>
          )}
          {section === 'summary' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex justify-between"><h2 className="text-lg font-black text-slate-900 dark:text-white">Summary</h2>
                <button type="button" onClick={() => update({ summary: SAMPLE_SUMMARIES[Math.floor(Math.random() * SAMPLE_SUMMARIES.length)] })} className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[11px] font-bold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"><Wand2 className="h-3.5 w-3.5" /> Sample</button></div>
              <textarea rows={6} value={data.summary} onChange={(e) => update({ summary: e.target.value })} className={`${inputCls} mt-3`} placeholder="2–5 lines about your experience…" />
            </section>
          )}
          {section === 'skills' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Skills</h2>
              <textarea rows={3} value={skillsText} onChange={(e) => setSkillsText(e.target.value)} onBlur={applySkills} className={`${inputCls} mt-3`} placeholder="Project Planning, Risk Management…" />
              <div className="mt-3 flex flex-wrap gap-2">{liveSkills.map((s) => (<span key={s} className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">{s}</span>))}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">{SUGGESTED_SKILLS.filter((s) => !liveSkills.includes(s)).slice(0, 10).map((s) => (<button key={s} type="button" onClick={() => { const set = new Set(liveSkills); set.add(s); const n = [...set]; setSkillsText(n.join(', ')); update({ skills: n }); }} className="rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:border-indigo-400 dark:border-slate-600">+ {s}</button>))}</div>
            </section>
          )}
          {section === 'certificates' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Certificates</h2>
              <textarea rows={3} value={certsText} onChange={(e) => setCertsText(e.target.value)} onBlur={applyCerts} className={`${inputCls} mt-3`} placeholder="PMP, CSM…" />
              <div className="mt-3 flex flex-wrap gap-2">{liveCerts.map((s) => (<span key={s} className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{s}</span>))}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">{SUGGESTED_CERTIFICATES.filter((s) => !liveCerts.includes(s)).map((s) => (<button key={s} type="button" onClick={() => { const set = new Set(liveCerts); set.add(s); const n = [...set]; setCertsText(n.join(', ')); update({ certificates: n }); }} className="rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:border-indigo-400 dark:border-slate-600">+ {s}</button>))}</div>
            </section>
          )}
          {section === 'languages' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Languages</h2>
              <textarea rows={2} value={langsText} onChange={(e) => setLangsText(e.target.value)} onBlur={applyLangs} className={`${inputCls} mt-3`} placeholder="English, French…" />
              <div className="mt-3 flex flex-wrap gap-2">{liveLangs.map((s) => (<span key={s} className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">{s}</span>))}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">{SUGGESTED_LANGUAGES.filter((s) => !liveLangs.includes(s)).map((s) => (<button key={s} type="button" onClick={() => { const set = new Set(liveLangs); set.add(s); const n = [...set]; setLangsText(n.join(', ')); update({ languages: n }); }} className="rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:border-indigo-400 dark:border-slate-600">+ {s}</button>))}</div>
            </section>
          )}
          {section === 'education' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex justify-between"><h2 className="text-lg font-black text-slate-900 dark:text-white">Education</h2>
                <button type="button" onClick={() => update({ education: [...data.education, emptyEducation()] })} className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600"><Plus className="h-3.5 w-3.5" /> Add</button></div>
              <div className="mt-4 space-y-4">{data.education.map((edu, idx) => (<div key={edu.id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800"><div className="mb-2 flex justify-end">{data.education.length > 1 && (<button type="button" onClick={() => update({ education: data.education.filter((_, i) => i !== idx) })} className="text-slate-400 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /></button>)}</div><div className="grid gap-2 sm:grid-cols-2"><div><label className="text-[10px] font-bold text-slate-400">Degree</label><input value={edu.degree} onChange={(e) => { const next = [...data.education]; next[idx] = { ...edu, degree: e.target.value }; update({ education: next }); }} className={inputCls} placeholder="Bachelor of Commerce…" /></div><div><label className="text-[10px] font-bold text-slate-400">School</label><input value={edu.school} onChange={(e) => { const next = [...data.education]; next[idx] = { ...edu, school: e.target.value }; update({ education: next }); }} className={inputCls} placeholder="University name" /></div><div><label className="text-[10px] font-bold text-slate-400">Year</label><input value={edu.year} onChange={(e) => { const next = [...data.education]; next[idx] = { ...edu, year: e.target.value }; update({ education: next }); }} className={inputCls} placeholder="2013 – 2017" /></div><div><label className="text-[10px] font-bold text-slate-400">Location</label><input value={edu.location} onChange={(e) => { const next = [...data.education]; next[idx] = { ...edu, location: e.target.value }; update({ education: next }); }} className={inputCls} placeholder="Toronto, Canada" /></div></div></div>))}</div>
            </section>
          )}
          {section === 'experience' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex justify-between"><h2 className="text-lg font-black text-slate-900 dark:text-white">Experience</h2>
                <button type="button" onClick={() => update({ experience: [...data.experience, emptyExperience()] })} className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600"><Plus className="h-3.5 w-3.5" /> Add</button></div>
              <div className="mt-4 space-y-4">{data.experience.map((exp, idx) => (<div key={exp.id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800"><div className="mb-2 flex justify-end">{data.experience.length > 1 && (<button type="button" onClick={() => update({ experience: data.experience.filter((_, i) => i !== idx) })} className="text-slate-400 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /></button>)}</div><div className="grid gap-2 sm:grid-cols-2"><div><label className="text-[10px] font-bold text-slate-400">Role</label><input value={exp.role} onChange={(e) => { const next = [...data.experience]; next[idx] = { ...exp, role: e.target.value }; update({ experience: next }); }} className={inputCls} placeholder="Project Manager" /></div><div><label className="text-[10px] font-bold text-slate-400">Company</label><input value={exp.company} onChange={(e) => { const next = [...data.experience]; next[idx] = { ...exp, company: e.target.value }; update({ experience: next }); }} className={inputCls} placeholder="Northbridge Digital" /></div><div><label className="text-[10px] font-bold text-slate-400">Duration</label><input value={exp.duration} onChange={(e) => { const next = [...data.experience]; next[idx] = { ...exp, duration: e.target.value }; update({ experience: next }); }} className={inputCls} placeholder="2022/03 – Present" /></div><div><label className="text-[10px] font-bold text-slate-400">Location</label><input value={exp.location} onChange={(e) => { const next = [...data.experience]; next[idx] = { ...exp, location: e.target.value }; update({ experience: next }); }} className={inputCls} placeholder="Toronto, Canada" /></div><div className="sm:col-span-2"><label className="text-[10px] font-bold text-slate-400">Bullets (one per line)</label><textarea rows={3} value={exp.description} onChange={(e) => { const next = [...data.experience]; next[idx] = { ...exp, description: e.target.value }; update({ experience: next }); }} className={inputCls} placeholder={'Managed release plans…\nCoordinated stakeholder updates…'} /></div></div></div>))}</div>
            </section>
          )}
          {section === 'projects' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex justify-between"><h2 className="text-lg font-black text-slate-900 dark:text-white">Projects</h2>
                <button type="button" onClick={() => update({ projects: [...data.projects, emptyProject()] })} className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600"><Plus className="h-3.5 w-3.5" /> Add</button></div>
              <div className="mt-4 space-y-4">{data.projects.map((p, idx) => (<div key={p.id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800"><div className="mb-2 flex justify-end">{data.projects.length > 1 && (<button type="button" onClick={() => update({ projects: data.projects.filter((_, i) => i !== idx) })} className="text-slate-400 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /></button>)}</div><div className="grid gap-2 sm:grid-cols-2"><div><label className="text-[10px] font-bold text-slate-400">Name</label><input value={p.name} onChange={(e) => { const next = [...data.projects]; next[idx] = { ...p, name: e.target.value }; update({ projects: next }); }} className={inputCls} /></div><div><label className="text-[10px] font-bold text-slate-400">Tech</label><input value={p.tech} onChange={(e) => { const next = [...data.projects]; next[idx] = { ...p, tech: e.target.value }; update({ projects: next }); }} className={inputCls} /></div><div className="sm:col-span-2"><label className="text-[10px] font-bold text-slate-400">Description</label><textarea rows={2} value={p.description} onChange={(e) => { const next = [...data.projects]; next[idx] = { ...p, description: e.target.value }; update({ projects: next }); }} className={inputCls} /></div></div></div>))}</div>
            </section>
          )}
          {section === 'design' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Design</h2>
              <p className="mt-1 text-xs text-slate-500">Accent colour (Modern / Minimal)</p>
              <div className="mt-4 flex flex-wrap gap-2">{(Object.keys(ACCENT_COLORS) as CvAccentId[]).map((id) => (<button key={id} type="button" onClick={() => update({ accent: id })} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold ${data.accent === id ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-200 dark:border-slate-700'}`}><span className="h-4 w-4 rounded-full" style={{ background: ACCENT_COLORS[id].hex }} />{ACCENT_COLORS[id].label}</button>))}</div>
              <button type="button" onClick={() => setPhase('templates')} className="mt-5 text-sm font-bold text-indigo-600 hover:underline">Change template</button>
            </section>
          )}
        </div>
        <aside className="lg:col-span-5">
          <div className="sticky top-20">
            <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400"><Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Live preview · {data.template}</span>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-950">
              <div className="border-b border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900"><div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div></div>
              <div className="max-h-[min(75vh,640px)] overflow-y-auto p-5 text-slate-900 dark:text-slate-100">
                {data.template === 'modern' && <div className="-mx-5 -mt-5 mb-4 h-1.5" style={{ background: accentHex(data.accent) }} />}
                <h3 className="text-xl font-black" style={{ color: data.template === 'classic' ? undefined : accentHex(data.accent) }}>{data.fullName || 'Your Name'}</h3>
                <p className="text-xs font-semibold text-slate-500">{data.title || 'Target role'}</p>
                <p className="mt-0.5 text-[10px] text-slate-400">{[data.city, data.email, data.phone, data.linkedin].filter(Boolean).join(' · ') || 'city · email · phone'}</p>
                {data.summary && <p className="mt-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{data.summary}</p>}
                {liveSkills.length > 0 && (<div className="mt-3"><p className="text-[9px] font-bold uppercase" style={{ color: accentHex(data.accent) }}>Skills</p><p className="mt-1 text-[10px] text-slate-600 dark:text-slate-300">{liveSkills.join(' · ')}</p></div>)}
                {data.experience.some((e) => e.role) && (<div className="mt-3"><p className="border-b pb-0.5 text-[9px] font-bold uppercase" style={{ color: accentHex(data.accent), borderColor: accentHex(data.accent) }}>Experience</p>{data.experience.filter((e) => e.role).map((e) => (<div key={e.id} className="mt-1.5 text-[10px]"><span className="font-bold">{e.role}</span>{e.company ? ` @ ${e.company}` : ''}</div>))}</div>)}
                {data.education.some((e) => e.degree || e.school) && (<div className="mt-3"><p className="border-b pb-0.5 text-[9px] font-bold uppercase" style={{ color: accentHex(data.accent), borderColor: accentHex(data.accent) }}>Education</p>{data.education.filter((e) => e.degree || e.school).map((e) => (<div key={e.id} className="mt-1.5 text-[10px]"><span className="font-bold">{e.degree}</span>{e.school ? ` — ${e.school}` : ''}</div>))}</div>)}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CvBuilder;
