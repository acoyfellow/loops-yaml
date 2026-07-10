import { describe, expect, it } from 'bun:test';

// The pi extension imports peer deps (@earendil-works/pi-ai, typebox) that are
// provided by the host pi install, not this repo. Load it dynamically so the
// suite skips cleanly when those deps are absent (e.g. a fresh clone) instead
// of hard-failing at module load.
let loopsYamlPi: typeof import('../extensions/pi/index')['default'] | undefined;
try {
  loopsYamlPi = (await import('../extensions/pi/index')).default;
} catch {
  loopsYamlPi = undefined;
}

// Minimal fake of the pi ExtensionAPI + ExtensionContext surface tick() touches.
function harness(
  usage: { tokens: number | null; contextWindow: number; percent: number | null } | undefined,
) {
  type Handler = (event: unknown, ctx: unknown) => unknown;
  const events: Record<string, Handler[]> = {};
  const sent: any[] = [];
  const entries: any[] = [];
  let compactCalls = 0;

  const api: any = {
    on: (name: string, fn: Handler) => {
      const list = events[name] ?? [];
      list.push(fn);
      events[name] = list;
    },
    appendEntry: (customType: string, data: any) =>
      entries.push({ type: 'custom', customType, data }),
    sendMessage: (msg: any) => sent.push(msg),
    registerCommand: () => {},
    registerTool: (t: any) => (api._tool = t),
  };
  loopsYamlPi(api);

  const ctx: any = {
    hasUI: false,
    isIdle: () => true,
    getContextUsage: () => usage,
    compact: () => {
      compactCalls++;
    },
    sessionManager: { getBranch: () => entries },
    ui: {
      notify: () => {},
      setStatus: () => {},
      theme: { fg: (_: string, s: string) => s },
    },
  };

  return {
    api,
    ctx,
    events,
    sent,
    entries,
    get compactCalls() {
      return compactCalls;
    },
  };
}

async function bindWithDueTask(
  h: ReturnType<typeof harness>,
  create: Record<string, unknown> = {},
) {
  for (const fn of h.events.session_start ?? []) await fn({}, h.ctx);
  await h.api._tool.execute('c1', {
    action: 'create',
    interval: '5s',
    prompt: 'do work',
    ...create,
  });
  const state = h.entries.filter((e: any) => e.customType === 'loops-yaml-pi-state').at(-1);
  state.data.tasks[0].nextRunAt = Date.now() - 1000; // force due
  for (const fn of h.events.session_start ?? []) await fn({}, h.ctx); // reload as due
}

describe.if(Boolean(loopsYamlPi))('pi loop tick compaction (e2e)', () => {
  it('compacts and does NOT inject when near the context ceiling', async () => {
    const h = harness({ tokens: 267_798, contextWindow: 272_000, percent: 267_798 / 272_000 });
    await bindWithDueTask(h);
    await Bun.sleep(1200); // let the 1s check timer fire
    expect(h.compactCalls).toBeGreaterThanOrEqual(1);
    expect(h.sent.length).toBe(0); // never inject on top of a full window
    // re-entrancy guard: after compacting, task was rescheduled ~5s out, so a
    // second timer fire within the window must NOT compact again immediately.
    await Bun.sleep(1200);
    expect(h.compactCalls).toBe(1);
  });

  it('injects the prompt normally when there is headroom', async () => {
    const h = harness({ tokens: 90_000, contextWindow: 272_000, percent: 90_000 / 272_000 });
    await bindWithDueTask(h);
    await Bun.sleep(1200);
    expect(h.compactCalls).toBe(0);
    expect(h.sent.length).toBeGreaterThanOrEqual(1);
    expect(h.sent[0].content).toContain('do work');
  });

  it('injects normally when usage is unknown (defensive: no blind compaction)', async () => {
    const h = harness(undefined);
    await bindWithDueTask(h);
    await Bun.sleep(1200);
    expect(h.compactCalls).toBe(0);
    expect(h.sent.length).toBeGreaterThanOrEqual(1);
  });

  it('honors a per-task compactThreshold override', async () => {
    // 60% usage is below the 0.8 default but above a custom 0.5 threshold.
    const h = harness({ tokens: 163_200, contextWindow: 272_000, percent: 0.6 });
    await bindWithDueTask(h, { compactThreshold: 0.5 });
    await Bun.sleep(1200);
    expect(h.compactCalls).toBeGreaterThanOrEqual(1);
    expect(h.sent.length).toBe(0);
  });
});
