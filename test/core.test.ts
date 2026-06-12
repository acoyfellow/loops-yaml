import { describe, expect, it } from 'bun:test';
import { parseYaml } from '../src/config';
import { cronMatches, parseCron } from '../src/cron';

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
