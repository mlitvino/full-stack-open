export default function formatTimestamp(ms: number): string {
  const d = new Date(ms);
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yy}.${mm}.${dd}: ${hh}.${mi}.${ss}`;
}

export function toUtcDayStartMs(date: Date | number): number {
  const d = date instanceof Date ? date : new Date(date);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function seconds(n: number) {
  return n * 1000;
};

export function minutes(n: number) {
  return seconds(n * 60);
}

export function hours(n: number) {
  return minutes(n * 60);
}

export function days(n: number) {
  return hours(n * 24);
}
