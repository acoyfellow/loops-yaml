import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import LoopsPlugin from '../extensions/opencode/index';

// Minimal stand-in for the OpenCode plugin client surface the plugin touches.
function makeClient() {
  const prompts: Array<{ id: string; text: string }> = [];
  const toasts: Array<{ message: string; variant: string }> = [];
  return {
    prompts,
    toasts,
    client: {
      session: {
        prompt: async ({ path, body }: any) => {
          prompts.push({ id: path.id, text: body.parts[0].text });
          return {};
        },
      },
      tui: {
        showToast: async ({ body }: any) => {
          toasts.push({ message: body.message, variant: body.variant });
          return {};
        },
      },
    },
  };
}

let dir: string;
beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'loops-oc-'));
  process.env.LOOPS_OPENCODE_STATE_DIR = dir;
});
afterEach(async () => {
  delete process.env.LOOPS_OPENCODE_STATE_DIR;
  await rm(dir, { recursive: true, force: true });
});

async function setup(project = 'proj') {
  const { client, prompts, toasts } = makeClient();
  const hooks = await LoopsPlugin(
    { client, project: { id: project }, directory: '/tmp/proj' } as any,
    undefined,
  );
  const ctx = { sessionID: 'session-1' } as any;
  return { hooks, prompts, toasts, ctx };
}

describe('opencode loops_task tool', () => {
  it('creates, lists, and deletes a loop', async () => {
    const { hooks, ctx } = await setup();
    const t = hooks.tool!.loops_task;

    const created = await t.execute({ action: 'create', interval: '30s', prompt: 'check MR' }, ctx);
    expect(created).toMatch(/^Created [0-9a-f]{8} every 30s/);
    const id = created.split(' ')[1];

    const listed = await t.execute({ action: 'list' }, ctx);
    expect(listed).toContain(id);
    expect(listed).toContain('check MR');

    const deleted = await t.execute({ action: 'delete', id }, ctx);
    expect(deleted).toBe(`Stopped loop ${id}.`);

    expect(await t.execute({ action: 'list' }, ctx)).toBe('No active loops.');
  });

  it('validates create arguments', async () => {
    const { hooks, ctx } = await setup();
    const t = hooks.tool!.loops_task;
    await expect(t.execute({ action: 'create', interval: '30s' }, ctx)).rejects.toThrow(
      'interval and prompt are required',
    );
    await expect(t.execute({ action: 'create', interval: '1s', prompt: 'x' }, ctx)).rejects.toThrow(
      'at least 5s',
    );
    await expect(t.execute({ action: 'delete' }, ctx)).rejects.toThrow('id is required');
  });

  it('clears all loops', async () => {
    const { hooks, ctx } = await setup();
    const t = hooks.tool!.loops_task;
    await t.execute({ action: 'create', interval: '30s', prompt: 'a' }, ctx);
    await t.execute({ action: 'create', interval: '1m', prompt: 'b' }, ctx);
    expect(await t.execute({ action: 'clear' }, ctx)).toBe('Cleared all loops.');
    expect(await t.execute({ action: 'list' }, ctx)).toBe('No active loops.');
  });

  it('persists tasks across plugin instances', async () => {
    const first = await setup('persist');
    await first.hooks.tool!.loops_task.execute(
      { action: 'create', interval: '30s', prompt: 'survive restart' },
      first.ctx,
    );
    // A fresh plugin instance for the same project rehydrates from disk.
    const second = await setup('persist');
    const listed = await second.hooks.tool!.loops_task.execute({ action: 'list' }, second.ctx);
    expect(listed).toContain('survive restart');
  });

  it('writes valid state JSON to the configured dir', async () => {
    const { hooks, ctx } = await setup('jsoncheck');
    await hooks.tool!.loops_task.execute(
      { action: 'create', interval: '30s', prompt: 'disk' },
      ctx,
    );
    const state = JSON.parse(readFileSync(join(dir, 'jsoncheck.json'), 'utf8'));
    expect(state.version).toBe(1);
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].prompt).toBe('disk');
  });
});

describe('opencode event-driven delivery', () => {
  it('delivers a due loop as a prompt once the session is idle', async () => {
    const { client, prompts } = makeClient();
    const hooks = await LoopsPlugin(
      { client, project: { id: 'tick' }, directory: '/tmp/tick' } as any,
      undefined,
    );
    const ctx = { sessionID: 'session-tick' } as any;

    // Mark the session active/idle so the plugin has a delivery target.
    await hooks.event!({
      event: { type: 'session.idle', properties: { sessionID: 'session-tick' } },
    } as any);

    // Create a loop whose nextRunAt is already in the past by using the
    // minimum interval and reaching into persisted state to age it.
    await hooks.tool!.loops_task.execute(
      { action: 'create', interval: '5s', prompt: 'tick now' },
      ctx,
    );
    const file = join(dir, 'tick.json');
    const state = JSON.parse(readFileSync(file, 'utf8'));
    state.tasks[0].nextRunAt = Date.now() - 1000;
    require('node:fs').writeFileSync(file, JSON.stringify(state));

    // Re-create the plugin so it loads the aged task, then idle + wait a tick.
    const hooks2 = await LoopsPlugin(
      { client, project: { id: 'tick' }, directory: '/tmp/tick' } as any,
      undefined,
    );
    await hooks2.event!({
      event: { type: 'session.idle', properties: { sessionID: 'session-tick' } },
    } as any);

    await new Promise((r) => setTimeout(r, 1300));
    expect(prompts.length).toBeGreaterThanOrEqual(1);
    expect(prompts[0].text).toContain('tick now');
    expect(prompts[0].text).toContain('action "delete"');
  });

  it('does not deliver while a turn is in flight', async () => {
    const { client, prompts } = makeClient();
    const hooks = await LoopsPlugin(
      { client, project: { id: 'busy' }, directory: '/tmp/busy' } as any,
      undefined,
    );
    const ctx = { sessionID: 'session-busy' } as any;
    await hooks.tool!.loops_task.execute(
      { action: 'create', interval: '5s', prompt: 'should wait' },
      ctx,
    );
    const file = join(dir, 'busy.json');
    const state = JSON.parse(readFileSync(file, 'utf8'));
    state.tasks[0].nextRunAt = Date.now() - 1000;
    require('node:fs').writeFileSync(file, JSON.stringify(state));

    // Fresh instance loads the aged task; mark the session busy and confirm
    // nothing is delivered while the turn is in flight.
    const hooks2 = await LoopsPlugin(
      { client, project: { id: 'busy' }, directory: '/tmp/busy' } as any,
      undefined,
    );
    await hooks2.event!({
      event: { type: 'session.status', properties: { sessionID: 'session-busy' } },
    } as any);

    await new Promise((r) => setTimeout(r, 1300));
    expect(prompts.length).toBe(0);
  });
});
