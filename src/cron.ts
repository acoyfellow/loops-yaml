// Minimal 5-field cron matcher: "minute hour day month weekday".
// Supports: *, lists (1,2,3), ranges (1-5), steps (*/5, 10-20/2).
// Weekday 0 and 7 both mean Sunday. No seconds, no named months/days.

function parseField(field: string, min: number, max: number): Set<number> {
  const out = new Set<number>();
  for (const part of field.split(',')) {
    const [rangePart, stepPart] = part.split('/');
    const step = stepPart ? Number.parseInt(stepPart, 10) : 1;
    if (!Number.isFinite(step) || step < 1) throw new Error(`bad step in cron field: ${part}`);
    let lo = min;
    let hi = max;
    if (rangePart !== '*') {
      const [a, b] = rangePart.split('-');
      lo = Number.parseInt(a, 10);
      hi = b !== undefined ? Number.parseInt(b, 10) : lo;
      if (!Number.isFinite(lo) || !Number.isFinite(hi)) throw new Error(`bad cron field: ${part}`);
    }
    for (let v = lo; v <= hi; v += step) out.add(v);
  }
  return out;
}

export interface Cron {
  minute: Set<number>;
  hour: Set<number>;
  dayOfMonth: Set<number>;
  month: Set<number>;
  dayOfWeek: Set<number>;
}

export function parseCron(expr: string): Cron {
  const fields = expr.trim().split(/\s+/);
  if (fields.length !== 5)
    throw new Error(`cron must have 5 fields, got ${fields.length}: "${expr}"`);
  const dow = parseField(fields[4]!, 0, 7);
  if (dow.has(7)) dow.add(0);
  return {
    minute: parseField(fields[0]!, 0, 59),
    hour: parseField(fields[1]!, 0, 23),
    dayOfMonth: parseField(fields[2]!, 1, 31),
    month: parseField(fields[3]!, 1, 12),
    dayOfWeek: dow,
  };
}

export function cronMatches(cron: Cron, date: Date): boolean {
  return (
    cron.minute.has(date.getMinutes()) &&
    cron.hour.has(date.getHours()) &&
    cron.dayOfMonth.has(date.getDate()) &&
    cron.month.has(date.getMonth() + 1) &&
    cron.dayOfWeek.has(date.getDay())
  );
}
