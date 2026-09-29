/**
 * Currency and financial formatters for Indian Stock Market
 */

export function formatINR(val: number | undefined | null, showSign = false): string {
  if (val === undefined || val === null || isNaN(val)) return '₹0.00';
  
  const sign = showSign && val > 0 ? '+' : '';
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  // Indian number formatting: 12,34,567.89
  const formatted = absVal.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${isNegative ? '-' : sign}₹${formatted}`;
}

export function formatPercent(val: number | undefined | null, showSign = true): string {
  if (val === undefined || val === null || isNaN(val)) return '0.00%';
  const sign = showSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(2)}%`;
}

export function formatLakhCr(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  const absVal = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  if (absVal >= 10000000) {
    return `${sign}₹${(absVal / 10000000).toFixed(2)} Cr`;
  }
  if (absVal >= 100000) {
    return `${sign}₹${(absVal / 100000).toFixed(2)} L`;
  }
  return formatINR(val);
}
