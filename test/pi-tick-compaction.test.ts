import { afterEach, describe, expect, it } from 'bun:test';

let loopsYamlPi: typeof import('../extensions/pi/index')['default'] | undefined;
try {
  loopsYamlPi = (await import('../extensions/pi/index')).default;
} catch {
  loopsYamlPi = undefined;
}

type CompactOptions = {
  onComplete?: (result?: unknown) => void;
  onError?: (error: Error) => void;
};

const shutdowns: Array<() => Promise<void>> = [];

afterEach(async () => {
  await Promise.all(shutdowns.splice(0).map((shutdown) => shutdown()));
});

function harness(
  usage: { tokens: number | null; contextWindow: number; percent: number | null } | undefined,
) {
  type Handler = (event: unknown, ctx: unknown) => unknown;
  const events: Record<string, Handler[]> = {};
  const sent: any[] = [];
  const entries: any[] = [];
  let compactCalls = 0;
  let pendingCompaction: CompactOptions | undefined;

  const api: any = {
    on: (name: string, fn: Handler) => {
      events[name] = [...(events[name] ?? []), fn];
    },
    appendEntry: (customType: string, data: any) =>
      entries.push({ type: 'custom', customType, data }),
    sendMessage: (message: any) => sent.push(message),
    registerCommand: () => {},
    registerTool: (tool: any) => (api._tool = tool),
  };
  loopsYamlPi!(api);

  const ctx: any = {
    hasUI: false,
    isIdle: () => true,
    getContextUsage: () => usage,
    compact: (options: CompactOptions = {}) => {
      compactCalls += 1;
      pendingCompaction = options;
    },
    sessionManager: { getBranch: () => entries },
    ui: {
      notify: () => {},
      setStatus: () => {},
      theme: { fg: (_: string, text: string) => text },
    },
  };

  const shutdown = async () => {
    for (const fn of events.session_shutdown ?? []) await fn({}, ctx);
  };
  shutdowns.push(shutdown);

  return {
    api,
    ctx,
    events,
    sent,
    entries,
    shutdown,
    completeCompaction() {
      const callback = pendingCompaction?.onComplete;
      pendingCompaction = undefined;
      callback?.();
    },
    failCompaction(error = new Error('compaction failed')) {
      const callback = pendingCompaction?.onError;
      pendingCompaction = undefined;
      callback?.(error);
    },
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
  const state = h.entries.filter((entry: any) => entry.customType === 'loops-yaml-pi-state').at(-1);
  state.data.tasks[0].nextRunAt = Date.now() - 1_000;
  for (const fn of h.events.session_start ?? []) await fn({}, h.ctx);
}

function latestTask(h: ReturnType<typeof harness>) {
  return h.entries.filter((entry: any) => entry.customType === 'loops-yaml-pi-state').at(-1).data
    .tasks[0];
}

describe.if(Boolean(loopsYamlPi))('pi loop tick compaction', () => {
  it('delivers the same due tick immediately after successful compaction', async () => {
    const h = harness({ tokens: 267_798, contextWindow: 272_000, percent: 267_798 / 272_000 });
    await bindWithDueTask(h);

    await Bun.sleep(1_100);
    expect(h.compactCalls).toBe(1);
    expect(h.sent).toHaveLength(0);
    expect(latestTask(h).runs).toBe(0);

    h.completeCompaction();
    expect(h.sent).toHaveLength(1);
    expect(h.sent[0].content).toContain('do work');
    expect(latestTask(h).runs).toBe(1);

    await Bun.sleep(1_100);
    expect(h.compactCalls).toBe(1);
    expect(h.sent).toHaveLength(1);
  });

  it('does not inject or count the tick when compaction fails', async () => {
    const h = harness({ tokens: 220_000, contextWindow: 272_000, percent: 220_000 / 272_000 });
    await bindWithDueTask(h);

    await Bun.sleep(1_100);
    h.failCompaction();
    expect(h.sent).toHaveLength(0);
    expect(latestTask(h).runs).toBe(0);
  });

  it('injects normally when there is headroom or usage is unknown', async () => {
    for (const usage of [
      { tokens: 90_000, contextWindow: 272_000, percent: 90_000 / 272_000 },
      undefined,
    ]) {
      const h = harness(usage);
      await bindWithDueTask(h);
      await Bun.sleep(1_100);
      expect(h.compactCalls).toBe(0);
      expect(h.sent).toHaveLength(1);
      await h.shutdown();
    }
  });

  it('honors a per-task compactThreshold override', async () => {
    const h = harness({ tokens: 163_200, contextWindow: 272_000, percent: 0.6 });
    await bindWithDueTask(h, { compactThreshold: 0.5 });
    await Bun.sleep(1_100);
    expect(h.compactCalls).toBe(1);
    expect(h.sent).toHaveLength(0);
  });
});
