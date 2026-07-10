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
  /**
   * Fraction of the context window (0..1) at or above which this loop compacts
   * before injecting its next prompt. Defaults to DEFAULT_COMPACT_THRESHOLD.
   */
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

/**
 * Fraction of the context window at or above which a loop tick should compact
 * BEFORE injecting its next prompt. Long-lived loops otherwise grow one session
 * monotonically until the model's output-token budget underflows (observed:
 * gpt-5.5 at 272k ctx -> gateway rejects `max_output_tokens: 1`). Compacting at
 * 80% leaves headroom for the injected prompt + a full response.
 */
export const DEFAULT_COMPACT_THRESHOLD = 0.8;

/** Minimal shape of pi's ContextUsage that the compaction decision needs. */
export interface ContextUsageLike {
  /** Estimated context tokens, or null if unknown (e.g. just after compaction). */
  tokens: number | null;
  contextWindow: number;
  /** Usage as a fraction of the window (0..1), or null if tokens is unknown. */
  percent: number | null;
}

/**
 * Decide whether a loop tick should compact before injecting its next prompt.
 *
 * Pure and defensive: unknown usage (`undefined`), unknown token count
 * (`percent === null`, e.g. immediately after a compaction), or a non-positive
 * window never triggers compaction, so we never compact blindly or in a loop.
 */
export function shouldCompactBeforeTick(
  usage: ContextUsageLike | undefined,
  threshold = DEFAULT_COMPACT_THRESHOLD,
): boolean {
  if (!usage) return false;
  if (usage.percent === null || usage.tokens === null) return false;
  if (!(usage.contextWindow > 0)) return false;
  return usage.percent >= threshold;
}

/**
 * Validate a user-supplied compaction threshold. Must be a number strictly
 * between 0 and 1 (exclusive): 0 would compact forever, 1 would never fire
 * before the ceiling it exists to avoid. Returns the value, or throws.
 */
export function validateCompactThreshold(value: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value >= 1) {
    throw new Error('compactThreshold must be a number between 0 and 1 (exclusive), e.g. 0.8');
  }
  return value;
}
