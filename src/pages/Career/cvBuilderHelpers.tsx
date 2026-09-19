import { Check } from 'lucide-react';
import {
  ACCENT_COLORS,
  type CvAccentId,
  type CvData,
  type CvTemplateId,
} from '../../utils/cvStore';

export function parseSkills(raw: string): string[] {
  return raw
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 28);
}

export function esc(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function accentHex(id: CvAccentId) {
  return ACCENT_COLORS[id]?.hex || '#4f46e5';
}

/** Browser print → Save as PDF (no watermark) */
export function openPrintPreview(data: CvData) {
  const accent = accentHex(data.accent);
  const skills = data.skills.join(' · ');
  const edu = data.education
    .filter((e) => e.school || e.degree)
    .map(
      (e) =>
        `<div class="item"><strong>${esc(e.degree || 'Degree')}</strong> — ${esc(e.school)} <span class="muted">${esc(e.year)}</span><div class="muted">${esc(e.details)}</div></div>`,
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
  const isClassic = data.template === 'classic';
  const isMinimal = data.template === 'minimal';
  const font = isClassic ? 'Georgia, "Times New Roman", serif' : 'Inter, system-ui, -apple-system, sans-serif';

  const headerBar =
    data.template === 'modern'
      ? `<div style="height:6px;background:${accent};margin:-32px -32px 20px -32px;"></div>`
      : '';

  const body = isPro
    ? `<div class="layout">
        <div class="side">
          <h1>${esc(data.fullName || 'Your Name')}</h1>
          <div class="title">${esc(data.title)}</div>
          <div class="meta">${esc(data.email)}<br/>${esc(data.phone)}<br/>${esc(data.city)}</div>
          <h2>Skills</h2>
          <div class="skills">${esc(skills) || '—'}</div>
        </div>
        <div>
          ${data.summary ? `<div class="summary">${esc(data.summary)}</div>` : ''}
          <h2>Experience</h2>${exp || '<div class="muted">—</div>'}
          <h2>Education</h2>${edu || '<div class="muted">—</div>'}
          <h2>Projects</h2>${proj || '<div class="muted">—</div>'}
        </div>
      </div>`
    : `${headerBar}
      <h1>${esc(data.fullName || 'Your Name')}</h1>
      <div class="title">${esc(data.title)}</div>
      <div class="meta">${[data.email, data.phone, data.city].filter(Boolean).map(esc).join(' · ')}</div>
      ${data.summary ? `<div class="summary">${esc(data.summary)}</div>` : ''}
      <h2>Skills</h2><div class="skills">${esc(skills) || '—'}</div>
      <h2>Experience</h2>${exp || '<div class="muted">—</div>'}
      <h2>Education</h2>${edu || '<div class="muted">—</div>'}
      <h2>Projects</h2>${proj || '<div class="muted">—</div>'}`;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${esc(data.fullName || 'CV')} — EDUROUTE</title>
<style>
  @page { margin: 12mm; size: A4; }
  * { box-sizing: border-box; }
  body {
    font-family: ${font};
    color: #0f172a;
    margin: 0;
    padding: 32px;
    max-width: 800px;
    margin-inline: auto;
    font-size: ${isMinimal ? '13.5px' : '13px'};
    line-height: 1.45;
  }
  h1 { margin: 0 0 4px; font-size: ${isMinimal ? '26px' : '28px'}; color: ${accent}; font-weight: 800; letter-spacing: -0.02em; }
  .title { font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 6px; }
  .meta { font-size: 12px; color: #64748b; margin-bottom: 14px; }
  h2 {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-bottom: 2px solid ${accent};
    padding-bottom: 4px;
    margin: ${isMinimal ? '22px' : '16px'} 0 10px;
    color: ${accent};
    font-weight: 700;
  }
  .item { margin-bottom: 10px; }
  .muted { color: #64748b; font-size: 12px; }
  .summary { font-size: 13px; line-height: 1.55; color: #334155; }
  .skills { font-size: 13px; }
  .layout { display: grid; grid-template-columns: 1fr 2fr; gap: 24px; }
  .side { background: #f1f5f9; padding: 18px; border-radius: 10px; }
  .side h1 { font-size: 22px; }
  @media print { body { padding: 0; } .side { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body>${body}<script>window.onload=function(){window.print();}</script></body></html>`;

  const w = window.open('', '_blank');
  if (!w) {
    alert('Please allow pop-ups to download your PDF.');
    return;
  }
  w.document.write(html);
  w.document.close();
}
