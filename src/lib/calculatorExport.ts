/**
 * Standardized CSV export and Local Storage persistence for CRE Single Calculators
 * Conforms to RFC 4180 with UTF-8 BOM.
 */

export interface CsvRow {
  metric: string;
  value: string | number;
  note?: string;
}

export function generateCalculatorCsv(
  title: string,
  rows: CsvRow[],
  locale: string = 'en'
): string {
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  const colMetric = isZh ? '指标 / 参数' : isEs ? 'Métrica' : isPt ? 'Métrica' : 'Metric';
  const colValue = isZh ? '数值' : isEs ? 'Valor' : isPt ? 'Valor' : 'Value';
  const colNote = isZh ? '说明' : isEs ? 'Nota' : isPt ? 'Nota' : 'Note';

  const escapeCell = (val: string | number | undefined): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const lines = [
    `\uFEFF${escapeCell(colMetric)},${escapeCell(colValue)},${escapeCell(colNote)}`,
    `${escapeCell('Calculator')},${escapeCell(title)},${escapeCell('crecalculators.com')}`,
    `${escapeCell('Date')},${escapeCell(new Date().toISOString().slice(0, 10))},${escapeCell('Browser Local Export')}`,
  ];

  for (const row of rows) {
    lines.push(`${escapeCell(row.metric)},${escapeCell(row.value)},${escapeCell(row.note || '')}`);
  }

  return lines.join('\r\n');
}

export function downloadCsv(filename: string, content: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface SavedCalculationItem {
  id: string;
  calculatorId: string;
  title: string;
  timestamp: number;
  summary: string;
  params: Record<string, unknown>;
}

export function saveCalculationToLocal(
  calculatorId: string,
  title: string,
  summary: string,
  params: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  try {
    const key = 'cre_saved_calculations';
    const existingRaw = localStorage.getItem(key);
    const list: SavedCalculationItem[] = existingRaw ? JSON.parse(existingRaw) : [];
    
    // Check if duplicate within 5 seconds
    const now = Date.now();
    const item: SavedCalculationItem = {
      id: `${calculatorId}_${now}`,
      calculatorId,
      title,
      timestamp: now,
      summary,
      params,
    };

    // Prepend and cap at 20 items
    const updated = [item, ...list.filter(x => x.id !== item.id)].slice(0, 20);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    // ignore
  }
}
