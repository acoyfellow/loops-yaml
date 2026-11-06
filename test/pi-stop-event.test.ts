import { afterEach, expect, it, mock } from 'bun:test';

mock.module('@earendil-works/pi-ai', () => ({ StringEnum: (values: readonly string[]) => ({ enum: values }) }));
mock.module('typebox', () => {
  const schema = (value?: unknown) => ({ value });
  return { Type: { Object: schema, Optional: schema, String: schema, Number: schema } };
});

const { default: loopsYamlPi, STOP_EVENT, PAUSE_EVENT, RESUME_EVENT } = await import('../extensions/pi/index');

type Listener = (data: unknown) => void;
type Hook = (event: unknown, ctx: unknown) => Promise<unknown> | unknown;

const shutdowns: Array<() => Promise<void>> = [];

afterEach(async () => {
  for (const shutdown of shutdowns.splice(0)) await shutdown();
});

async function startExtension() {
  const listeners = new Map<string, Listener[]>();
  const hooks = new Map<string, Hook[]>();
  const tools = new Map<string, { execute: (id: string, input: unknown) => Promise<{ content: Array<{ text: string }> }> }>();
  const notes: string[] = [];
  const pi = {
    on: (name: string, hook: Hook) => hooks.set(name, [...(hooks.get(name) ?? []), hook]),
    registerCommand: () => undefined,
    registerTool: (spec: { name: string; execute: never }) => tools.set(spec.name, spec),
    sendMessage: () => undefined,
    appendEntry: () => undefined,
    events: {
      on: (name: string, listener: Listener) => listeners.set(name, [...(listeners.get(name) ?? []), listener]),
      emit: (name: string, data: unknown) => {
        for (const listener of listeners.get(name) ?? []) listener(data);
      },
    },
  };
  const ctx = {
    hasUI: false,
    isIdle: () => false,
    sessionManager: { getBranch: () => [] },
    ui: { notify: (message: string) => notes.push(message), setStatus: () => undefined },
  };
  loopsYamlPi(pi as never);
  for (const hook of hooks.get('session_start') ?? []) await hook({}, ctx);
  shutdowns.push(async () => {
    for (const hook of hooks.get('session_shutdown') ?? []) await hook({}, ctx);
  });
  const loopsTask = tools.get('loops_task');
  if (!loopsTask) throw new Error('loops_task was not registered');
  const call = async (input: unknown) => (await loopsTask.execute('call', input)).content[0]?.text ?? '';
  return { pi, call, notes };
}

it('stops a loop when another extension emits loops:stop with its id', async () => {
  const { pi, call, notes } = await startExtension();
  const created = await call({ action: 'create', interval: '5m', prompt: 'tick' });
  const id = created.match(/Created (\S+) every/)?.[1];
  expect(id).toBeDefined();

  pi.events.emit(STOP_EVENT, { id });

  expect(await call({ action: 'list' })).toBe('No active loops.');
  expect(notes).toContain(`Stopped loop ${id}.`);
});

it('ignores loops:stop for an unknown id or a malformed payload', async () => {
  const { pi, call } = await startExtension();
  await call({ action: 'create', interval: '5m', prompt: 'tick' });

  pi.events.emit(STOP_EVENT, { id: 'nope' });
  pi.events.emit(STOP_EVENT, undefined);
  pi.events.emit(STOP_EVENT, { id: 42 });

  expect(await call({ action: 'list' })).not.toBe('No active loops.');
});

it('a paused loop stays listed and resumes on loops:resume', async () => {
  const { pi, call } = await startExtension();
  const created = await call({ action: 'create', interval: '5m', prompt: 'tick' });
  const id = created.match(/Created (\S+) every/)?.[1];
  pi.events.emit(PAUSE_EVENT, { id });
  expect(await call({ action: 'list' })).toContain(id ?? 'missing');
  pi.events.emit(RESUME_EVENT, { id });
  expect(await call({ action: 'list' })).toContain(id ?? 'missing');
});
