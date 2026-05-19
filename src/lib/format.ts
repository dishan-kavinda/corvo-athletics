export function fmtMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency }).format(amount);
}

export function fmtDate(
  d: string | Date,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' },
): string {
  return new Intl.DateTimeFormat('en-NZ', options).format(new Date(d as string));
}
