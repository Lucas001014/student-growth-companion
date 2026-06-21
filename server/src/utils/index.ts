import crypto from 'crypto';

export function randomString(len: number = 16): string {
  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
}

export function generateCode(prefix: string = '', len: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix ? `${prefix}${result}` : result;
}

export function formatDate(date: Date | string | number | null | undefined, fmt: string = 'YYYY-MM-DD HH:mm:ss'): string {
  if (date === null || date === undefined || date === '') return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  const map: Record<string, string> = {
    YYYY: String(d.getFullYear()),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  };
  return fmt.replace(/YYYY|MM|DD|HH|mm|ss/g, (m) => map[m] || m);
}

export function toCsv(rows: any[], headers: string[]): string {
  const esc = (v: any): string => {
    if (v === null || v === undefined) return '';
    const s = String(v).replace(/"/g, '""');
    return /[",\n\r]/.test(s) ? `"${s}"` : s;
  };
  const lines: string[] = [];
  lines.push(headers.map((h) => esc(h)).join(','));
  for (const row of rows) {
    const obj = row && row.toJSON ? row.toJSON() : row;
    lines.push(headers.map((h) => esc(obj ? obj[h] : '')).join(','));
  }
  return lines.join('\n');
}

export function safeNumber(v: any, defaultValue: number = 0): number {
  if (v === null || v === undefined || v === '') return defaultValue;
  const n = Number(v);
  return isNaN(n) ? defaultValue : n;
}

export default {
  randomString,
  generateCode,
  formatDate,
  toCsv,
  safeNumber,
};
