import { Fragment, type ReactNode } from 'react';

/** Lightweight markdown renderer for Buddy AI replies (no extra deps). */

function inlineFormat(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // bold **...**, italic *...*, inline code `...`
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(
        <strong key={key++} className="font-bold text-slate-900 dark:text-slate-50">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(
        <code key={key++} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[12px] text-indigo-700 dark:bg-slate-800 dark:text-indigo-300">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      nodes.push(
        <em key={key++} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      nodes.push(token);
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function isTableSeparator(line: string) {
  return /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(line.trim());
}

function parseTableRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map((c) => c.trim());
}

function renderTable(rows: string[][], keyBase: number) {
  if (!rows.length) return null;
  const header = rows[0];
  const body = rows.slice(1);
  return (
    <div key={`tbl-${keyBase}`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/80">
          <tr>
            {header.map((cell, i) => (
              <th key={i} className="border-b border-slate-200 px-3 py-2 font-bold text-slate-800 dark:border-slate-700 dark:text-slate-100">
                {inlineFormat(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white dark:bg-slate-900/40' : 'bg-slate-50/60 dark:bg-slate-800/40'}>
              {row.map((cell, ci) => (
                <td key={ci} className="border-b border-slate-100 px-3 py-2 align-top text-slate-700 dark:border-slate-800 dark:text-slate-300">
                  {inlineFormat(cell.replace(/<br\s*\/?>/gi, ' · '))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BuddyMarkdown({ text }: { text: string }) {
  // Normalize HTML line breaks Groq sometimes emits
  const normalized = text.replace(/<br\s*\/?>/gi, '\n').replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    // Fenced code block
    if (trimmed.startsWith('```')) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1; // skip closing ```
      blocks.push(
        <pre
          key={key++}
          className="my-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-[12px] leading-5 text-slate-100"
        >
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // Markdown table
    if (trimmed.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const tableRows: string[][] = [parseTableRow(trimmed)];
      i += 2; // skip header + separator
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        tableRows.push(parseTableRow(lines[i]));
        i += 1;
      }
      blocks.push(renderTable(tableRows, key++));
      continue;
    }

    // Headings
    const heading = /^(#{1,4})\s+(.+)$/.exec(trimmed);
    if (heading) {
      const level = heading[1].length;
      const content = inlineFormat(heading[2]);
      const cls =
        level === 1
          ? 'mt-3 mb-2 text-lg font-black text-slate-950 dark:text-white'
          : level === 2
            ? 'mt-3 mb-2 text-base font-black text-slate-950 dark:text-white'
            : 'mt-2 mb-1 text-sm font-bold text-slate-900 dark:text-slate-100';
      blocks.push(
        <div key={key++} className={cls}>
          {content}
        </div>
      );
      i += 1;
      continue;
    }

    // Unordered list
    if (/^[-*•]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*•]\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ul key={key++} className="my-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-700 dark:text-slate-300">
          {items.map((item, idx) => (
            <li key={idx}>{inlineFormat(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ol key={key++} className="my-2 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-slate-700 dark:text-slate-300">
          {items.map((item, idx) => (
            <li key={idx}>{inlineFormat(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph (merge consecutive non-empty non-special lines)
    const para: string[] = [trimmed];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !/^[-*•]\s+/.test(lines[i].trim()) &&
      !/^\d+[.)]\s+/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('```') &&
      !(lines[i].includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1]))
    ) {
      para.push(lines[i].trim());
      i += 1;
    }
    blocks.push(
      <p key={key++} className="my-1.5 text-sm leading-7 text-slate-700 dark:text-slate-300">
        {para.map((p, idx) => (
          <Fragment key={idx}>
            {idx > 0 && <br />}
            {inlineFormat(p)}
          </Fragment>
        ))}
      </p>
    );
  }

  return <div className="buddy-md space-y-0.5">{blocks}</div>;
}
