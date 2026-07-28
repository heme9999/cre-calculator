export function formatCurrency(val: number): string {
  if (isNaN(val) || !isFinite(val)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatPercent(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0.00%';
  return `${val.toFixed(decimals)}%`;
}

export function parseNumberInput(val: string): number {
  const cleaned = val.replace(/,/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
