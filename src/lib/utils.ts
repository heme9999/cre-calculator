export function formatCurrency(val: number): string {
  if (isNaN(val) || !isFinite(val)) return '$0';
  const rounded = Math.round(val);
  const formatted = Math.abs(rounded).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return rounded < 0 ? `-$${formatted}` : `$${formatted}`;
}

export function formatPercent(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0.00%';
  return `${val.toFixed(decimals)}%`;
}

export function formatNumberWithCommas(val: number): string {
  if (!val || isNaN(val) || !isFinite(val)) return '';
  return Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function parseNumberInput(val: string): number {
  const cleaned = val.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
