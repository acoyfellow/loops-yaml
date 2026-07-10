import { describe, expect, it } from 'bun:test';
import { parseYaml } from '../src/config';
import { cronMatches, parseCron } from '../src/cron';
import {
  isTaskExpired,
  markTaskRun,
  parseInterval,
  parseLoopCommand,
  type RecurringTask,
  shouldCompactBeforeTick,
  validateCompactThreshold,
} from '../src/recurring';

const at = (s: string) => new Date(s);

describe('cron', () => {
  it('matches a specific minute/hour', () => {
    const c = parseCron('30 8 * * *');
    expect(cronMatches(c, at('2026-06-12T08:30:00'))).toBe(true);
    expect(cronMatches(c, at('2026-06-12T08:31:00'))).toBe(false);
    expect(cronMatches(c, at('2026-06-12T09:30:00'))).toBe(false);
  });

  it('handles step values', () => {
    const c = parseCron('*/15 * * * *');
    for (const m of [0, 15, 30, 45])
      expect(cronMatches(c, at(`2026-06-12T10:${String(m).padStart(2, '0')}:00`))).toBe(true);
    expect(cronMatches(c, at('2026-06-12T10:07:00'))).toBe(false);
  });

  it('handles ranges and lists', () => {
    const c = parseCron('0 9-17 * * 1,2,3,4,5');
    expect(cronMatches(c, at('2026-06-12T09:00:00'))).toBe(true); // Friday
    expect(cronMatches(c, at('2026-06-13T09:00:00'))).toBe(false); // Saturday
    expect(cronMatches(c, at('2026-06-12T18:00:00'))).toBe(false); // after 17
  });

  it('treats weekday 7 as Sunday', () => {
    const c = parseCron('0 0 * * 7');
    expect(cronMatches(c, at('2026-06-14T00:00:00'))).toBe(true); // Sunday
  });

  it('rejects malformed expressions', () => {
    expect(() => parseCron('* * *')).toThrow();
  });
});

describe('recurring intervals', () => {
  it('parses second, minute, and hour intervals', () => {
    expect(parseInterval('every 30s')).toEqual({ everyMs: 30_000, label: 'every 30s' });
    expect(parseInterval('5 minutes').everyMs).toBe(300_000);
    expect(parseInterval('2h').everyMs).toBe(7_200_000);
  });

  it('rejects malformed and excessively frequent intervals', () => {
    expect(() => parseInterval('whenever')).toThrow('invalid interval');
    expect(() => parseInterval('1s')).toThrow('at least 5s');
  });

  it('parses the /loop command shape', () => {
    expect(parseLoopCommand('every 30s check the pipeline until merged')).toEqual({
      schedule: { everyMs: 30_000, label: 'every 30s' },
      prompt: 'check the pipeline until merged',
    });
  });

  it('advances and expires tasks deterministically', () => {
    const task: RecurringTask = {
      id: 'task',
      prompt: 'check',
      everyMs: 30_000,
      createdAt: 1_000,
      nextRunAt: 31_000,
      runs: 0,
      maxRuns: 1,
      expiresAt: 100_000,
    };
    const advanced = markTaskRun(task, 31_000);
    expect(advanced).toMatchObject({ runs: 1, nextRunAt: 61_000 });
    expect(isTaskExpired(advanced, 31_000)).toBe(true);
    expect(isTaskExpired({ ...task, maxRuns: 2 }, 100_000)).toBe(true);
  });
});

describe('loops.yaml parser', () => {
  it('reads loops with run, schedule, cwd', () => {
    const parsed = parseYaml(`loops:
  review:
    schedule: "0 8 * * *"
    run: ./scripts/review.sh
    cwd: ../lab
  build:
    run: 'bun run build'  # inline comment ignored
`) as { loops: Record<string, Record<string, string>> };
    expect(parsed.loops.review).toEqual({
      schedule: '0 8 * * *',
      run: './scripts/review.sh',
      cwd: '../lab',
    });
    expect(parsed.loops.build.run).toBe('bun run build');
    expect(parsed.loops.build.schedule).toBeUndefined();
  });

  it('ignores comments and blank lines', () => {
    const parsed = parseYaml(`# top comment
loops:
  # a loop
  x:
    run: echo hi
`) as { loops: Record<string, Record<string, string>> };
    expect(parsed.loops.x.run).toBe('echo hi');
  });
});

describe('shouldCompactBeforeTick', () => {
  it('compacts at or above the default 80% threshold', () => {
    expect(
      shouldCompactBeforeTick({ tokens: 220_000, contextWindow: 272_000, percent: 0.81 }),
    ).toBe(true);
    expect(shouldCompactBeforeTick({ tokens: 217_600, contextWindow: 272_000, percent: 0.8 })).toBe(
      true,
    );
  });

  it('does not compact below the threshold', () => {
    expect(
      shouldCompactBeforeTick({ tokens: 100_000, contextWindow: 272_000, percent: 0.37 }),
    ).toBe(false);
  });

  it('never compacts on unknown usage (defensive)', () => {
    expect(shouldCompactBeforeTick(undefined)).toBe(false);
    // percent null happens right after a compaction, before the next LLM response
    expect(shouldCompactBeforeTick({ tokens: null, contextWindow: 272_000, percent: null })).toBe(
      false,
    );
    expect(shouldCompactBeforeTick({ tokens: 200_000, contextWindow: 0, percent: 0.9 })).toBe(
      false,
    );
  });

  it('honors a custom threshold', () => {
    const usage = { tokens: 190_400, contextWindow: 272_000, percent: 0.7 };
    expect(shouldCompactBeforeTick(usage, 0.7)).toBe(true);
    expect(shouldCompactBeforeTick(usage, 0.75)).toBe(false);
  });

  it('reproduces the gpt-5.5 ceiling case: 268k/272k triggers compaction', () => {
    // The observed crash: totalTokens rode 220k->268k until max_output_tokens underflowed to 1.
    const nearCeiling = { tokens: 267_798, contextWindow: 272_000, percent: 267_798 / 272_000 };
    expect(shouldCompactBeforeTick(nearCeiling)).toBe(true);
  });
});

describe('validateCompactThreshold', () => {
  it('accepts values strictly between 0 and 1', () => {
    expect(validateCompactThreshold(0.8)).toBe(0.8);
    expect(validateCompactThreshold(0.5)).toBe(0.5);
    expect(validateCompactThreshold(0.99)).toBe(0.99);
  });

  it('rejects out-of-range and non-finite values', () => {
    for (const bad of [0, 1, -0.1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() => validateCompactThreshold(bad)).toThrow();
    }
  });
});
