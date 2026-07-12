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
  /** Fraction of the context window that triggers compaction before a tick. */
  compactThreshold?: number;
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

export const DEFAULT_COMPACT_THRESHOLD = 0.8;

export interface ContextUsageLike {
  tokens: number | null;
  contextWindow: number;
  percent: number | null;
}

export function shouldCompactBeforeTick(
  usage: ContextUsageLike | undefined,
  threshold = DEFAULT_COMPACT_THRESHOLD,
): boolean {
  if (!usage || usage.percent === null || usage.tokens === null) return false;
  if (!(usage.contextWindow > 0)) return false;
  return usage.percent >= threshold;
}

export function validateCompactThreshold(value: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value >= 1) {
    throw new Error('compactThreshold must be a number between 0 and 1 (exclusive), e.g. 0.8');
  }
  return value;
}
