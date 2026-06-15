export const MIN_INTERVAL_MS = 5_000;

const UNIT_MS: Record<string, number> = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

export interface IntervalSchedule {
  everyMs: number;
  label: string;
}

export interface RecurringTask {
  id: string;
  prompt: string;
  everyMs: number;
  createdAt: number;
  nextRunAt: number;
  runs: number;
  maxRuns?: number;
  expiresAt?: number;
}

export function formatInterval(ms: number): string {
  if (ms % UNIT_MS.d === 0) return `${ms / UNIT_MS.d}d`;
  if (ms % UNIT_MS.h === 0) return `${ms / UNIT_MS.h}h`;
  if (ms % UNIT_MS.m === 0) return `${ms / UNIT_MS.m}m`;
  return `${ms / UNIT_MS.s}s`;
}

export function parseInterval(value: string): IntervalSchedule {
  const match = value
    .trim()
    .match(/^(?:every\s+)?(\d+)\s*(s|sec|seconds?|m|min|minutes?|h|hr|hours?|d|days?)$/i);
  if (!match) throw new Error(`invalid interval "${value}"; use 30s, 5m, 2h, or 1d`);

  const amount = Number.parseInt(match[1]!, 10);
  const rawUnit = match[2]!.toLowerCase();
  const unit = rawUnit.startsWith('s')
    ? 's'
    : rawUnit.startsWith('m')
      ? 'm'
      : rawUnit.startsWith('h')
        ? 'h'
        : 'd';
  const everyMs = amount * UNIT_MS[unit]!;
  if (!Number.isSafeInteger(everyMs) || everyMs < MIN_INTERVAL_MS) {
    throw new Error(`interval must be at least ${formatInterval(MIN_INTERVAL_MS)}`);
  }
  return { everyMs, label: `every ${formatInterval(everyMs)}` };
}

export function parseLoopCommand(input: string): { schedule: IntervalSchedule; prompt: string } {
  const match = input
    .trim()
    .match(
      /^(?:every\s+)?(\d+\s*(?:s|sec|seconds?|m|min|minutes?|h|hr|hours?|d|days?))\s+([\s\S]+)$/i,
    );
  if (!match?.[2]?.trim()) throw new Error('usage: /loop every 30s <prompt>');
  return { schedule: parseInterval(match[1]!), prompt: match[2].trim() };
}

export function isTaskExpired(task: RecurringTask, now = Date.now()): boolean {
  return (
    (task.expiresAt !== undefined && now >= task.expiresAt) ||
    (task.maxRuns !== undefined && task.runs >= task.maxRuns)
  );
}

export function markTaskRun(task: RecurringTask, now = Date.now()): RecurringTask {
  return {
    ...task,
    runs: task.runs + 1,
    nextRunAt: now + task.everyMs,
  };
}
