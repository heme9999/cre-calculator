import React from 'react';
import Link from 'next/link';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function parseInline(text: string): React.ReactNode[] {
  // Matches:
  // 1. links: [text](url)
  // 2. bold: **text**
  // 3. inline code: `text`
  // 4. italic: *text* (when not part of **)
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined && match[2] !== undefined) {
      const linkText = match[1];
      const href = match[2];
      const isInternal = href.startsWith('/') || href.startsWith('https://crecalculators.com');
      const cleanHref = href.startsWith('https://crecalculators.com')
        ? href.replace('https://crecalculators.com', '')
        : href;

      if (isInternal) {
        nodes.push(
          <Link
            key={match.index}
            href={cleanHref || '/'}
            className="text-emerald-600 hover:text-emerald-700 underline font-semibold transition-colors"
          >
            {parseInline(linkText)}
          </Link>
        );
      } else {
        nodes.push(
          <a
            key={match.index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 underline font-semibold transition-colors"
          >
            {parseInline(linkText)}
          </a>
        );
      }
    } else if (match[3] !== undefined) {
      nodes.push(
        <strong key={match.index} className="font-bold text-slate-900">
          {parseInline(match[3])}
        </strong>
      );
    } else if (match[4] !== undefined) {
      nodes.push(
        <code
          key={match.index}
          className="bg-slate-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-200"
        >
          {match[4]}
        </code>
      );
    } else if (match[5] !== undefined) {
      nodes.push(
        <em key={match.index} className="italic text-slate-800">
          {match[5]}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

interface BlockToken {
  type: 'table' | 'ul' | 'ol' | 'h3' | 'h4' | 'p';
  lines: string[];
}

function chunkMarkdown(text: string): BlockToken[] {
  const lines = text.split('\n');
  const tokens: BlockToken[] = [];
  let currentP: string[] = [];

  const flushP = () => {
    if (currentP.length > 0) {
      tokens.push({ type: 'p', lines: [...currentP] });
      currentP = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (trimmed === '') {
      flushP();
      i++;
      continue;
    }

    // Markdown Table detection: current row starts with | and next row has | and -
    if (
      trimmed.startsWith('|') &&
      i + 1 < lines.length &&
      lines[i + 1].includes('|') &&
      lines[i + 1].includes('-')
    ) {
      flushP();
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      tokens.push({ type: 'table', lines: tableLines });
      continue;
    }

    // Unordered List
    if (/^[-*]\s+/.test(trimmed)) {
      flushP();
      const listLines: string[] = [];
      while (
        i < lines.length &&
        (/^[-*]\s+/.test(lines[i].trim()) || (lines[i].startsWith('  ') && listLines.length > 0))
      ) {
        listLines.push(lines[i].trim());
        i++;
      }
      tokens.push({ type: 'ul', lines: listLines });
      continue;
    }

    // Ordered List
    if (/^\d+\.\s+/.test(trimmed)) {
      flushP();
      const listLines: string[] = [];
      while (
        i < lines.length &&
        (/^\d+\.\s+/.test(lines[i].trim()) || (lines[i].startsWith('  ') && listLines.length > 0))
      ) {
        listLines.push(lines[i].trim());
        i++;
      }
      tokens.push({ type: 'ol', lines: listLines });
      continue;
    }

    // Heading 3
    if (trimmed.startsWith('### ')) {
      flushP();
      tokens.push({ type: 'h3', lines: [trimmed.replace(/^###\s+/, '')] });
      i++;
      continue;
    }

    // Heading 4
    if (trimmed.startsWith('#### ')) {
      flushP();
      tokens.push({ type: 'h4', lines: [trimmed.replace(/^####\s+/, '')] });
      i++;
      continue;
    }

    currentP.push(trimmed);
    i++;
  }
  flushP();
  return tokens;
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  if (!content) return null;
  const blocks = chunkMarkdown(content);

  return (
    <div className={`space-y-4 text-slate-700 leading-relaxed ${className}`}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'h3') {
          return (
            <h3 key={bIdx} className="text-lg font-bold text-slate-900 mt-6 mb-2">
              {parseInline(block.lines[0])}
            </h3>
          );
        }

        if (block.type === 'h4') {
          return (
            <h4 key={bIdx} className="text-base font-bold text-slate-900 mt-4 mb-1">
              {parseInline(block.lines[0])}
            </h4>
          );
        }

        if (block.type === 'ul') {
          return (
            <ul key={bIdx} className="list-disc pl-5 space-y-1.5 my-3 text-sm sm:text-base">
              {block.lines.map((li, lIdx) => {
                const cleanText = li.replace(/^[-*]\s+/, '');
                return <li key={lIdx}>{parseInline(cleanText)}</li>;
              })}
            </ul>
          );
        }

        if (block.type === 'ol') {
          return (
            <ol key={bIdx} className="list-decimal pl-5 space-y-2 my-3 text-sm sm:text-base">
              {block.lines.map((li, lIdx) => {
                const cleanText = li.replace(/^\d+\.\s+/, '');
                return <li key={lIdx}>{parseInline(cleanText)}</li>;
              })}
            </ol>
          );
        }

        if (block.type === 'table') {
          const parseRow = (line: string) => {
            const parts = line.split('|').map((s) => s.trim());
            if (parts.length > 0 && parts[0] === '') parts.shift();
            if (parts.length > 0 && parts[parts.length - 1] === '') parts.pop();
            return parts;
          };

          const headers = block.lines.length > 0 ? parseRow(block.lines[0]) : [];
          const rows = block.lines.slice(2).map(parseRow);

          return (
            <div key={bIdx} className="overflow-x-auto my-5">
              <table className="w-full text-left text-xs sm:text-sm border-collapse bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-900 font-bold">
                    {headers.map((h, hIdx) => (
                      <th key={hIdx} className="py-2.5 px-3.5">
                        {parseInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-2.5 px-3.5 leading-relaxed">
                          {parseInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Paragraph
        return (
          <p key={bIdx} className="text-sm sm:text-base leading-relaxed my-2.5">
            {block.lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && ' '}
                {parseInline(line)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
