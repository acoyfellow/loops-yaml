import { randomBytes } from 'node:crypto';
import { StringEnum } from '@earendil-works/pi-ai';
import type {
  AgentToolResult,
  ExtensionAPI,
  ExtensionContext,
} from '@earendil-works/pi-coding-agent';
import { Type } from 'typebox';
import {
  formatInterval,
  isTaskExpired,
  markTaskRun,
  parseInterval,
  parseLoopCommand,
  type RecurringTask,
  shouldCompactBeforeTick,
  validateCompactThreshold,
} from '../../src/recurring';

const STATE_TYPE = 'loops-yaml-pi-state';
const STATUS_KEY = 'loops-yaml';
const DEFAULT_MAX_RUNS = 100;
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1_000;
const CHECK_INTERVAL_MS = 1_000;

interface PersistedState {
  version: 1;
  tasks: RecurringTask[];
}

interface ToolDetails {
  tasks: RecurringTask[];
  task?: RecurringTask;
}

interface ToolInput {
  action: 'create' | 'list' | 'delete' | 'clear';
  interval?: string;
  prompt?: string;
  id?: string;
  maxRuns?: number;
  expiresIn?: string;
  compactThreshold?: number;
}

function taskId(): string {
  return randomBytes(4).toString('hex');
}

function restoreState(ctx: ExtensionContext): RecurringTask[] {
  const entries = ctx.sessionManager.getBranch();
  for (let index = entries.length - 1; index >= 0; index--) {
    const entry = entries[index];
    if (entry?.type !== 'custom' || entry.customType !== STATE_TYPE) continue;
    const state = entry.data as PersistedState | undefined;
    if (state?.version === 1 && Array.isArray(state.tasks)) return state.tasks;
  }
  return [];
}

function taskLine(task: RecurringTask, now = Date.now()): string {
  const dueIn = Math.max(0, Math.ceil((task.nextRunAt - now) / 1_000));
  const prompt = task.prompt.replace(/\s+/g, ' ');
  return `${task.id} every ${formatInterval(task.everyMs)} · next ${dueIn}s · ${task.runs}/${task.maxRuns ?? '∞'} · ${prompt.length > 70 ? `${prompt.slice(0, 67)}…` : prompt}`;
}

export default function loopsYamlPi(pi: ExtensionAPI) {
  let tasks = new Map<string, RecurringTask>();
  let timer: ReturnType<typeof setInterval> | undefined;
  let ctxRef: ExtensionContext | undefined;
  let busy = false;

  const persist = () => {
    pi.appendEntry(STATE_TYPE, { version: 1, tasks: [...tasks.values()] } satisfies PersistedState);
  };

  const updateStatus = () => {
    if (!ctxRef?.hasUI) return;
    ctxRef.ui.setStatus(
      STATUS_KEY,
      tasks.size === 0 ? undefined : ctxRef.ui.theme.fg('success', `loops:${tasks.size}`),
    );
  };

  const prune = (now: number) => {
    let changed = false;
    for (const [id, task] of tasks) {
      if (!isTaskExpired(task, now)) continue;
      tasks.delete(id);
      changed = true;
      ctxRef?.ui.notify(`Loop ${id} stopped after reaching its limit.`, 'info');
    }
    if (changed) {
      persist();
      updateStatus();
    }
  };

  const tick = () => {
    const ctx = ctxRef;
    if (!ctx || busy || !ctx.isIdle()) return;
    const now = Date.now();
    prune(now);
    const due = [...tasks.values()].find((task) => now >= task.nextRunAt);
    if (!due) return;

    // Guard against monotonic context growth: a long-lived loop injects a fresh
    // prompt every interval into the SAME session, so context climbs until the
    // model's output-token budget underflows and the gateway rejects the
    // request. If we're near the window, compact now and let the task fire again
    // next interval against a compacted context instead of injecting on top of a
    // nearly-full window. markTaskRun already advanced nextRunAt, so skipping
    // here costs one interval, not the task.
    if (shouldCompactBeforeTick(ctx.getContextUsage(), due.compactThreshold)) {
      // Reschedule (do NOT count as a run) before compacting, so the 1s check
      // timer doesn't re-enter compact() every second while it runs.
      tasks.set(due.id, { ...due, nextRunAt: now + due.everyMs });
      persist();
      ctx.compact();
      ctxRef?.ui.notify('Loop compacted context before next tick (near context window).', 'info');
      return;
    }

    const updated = markTaskRun(due, now);
    tasks.set(updated.id, updated);
    persist();
    updateStatus();
    pi.sendMessage(
      {
        customType: 'loops-yaml',
        content: `[loop ${updated.id} · run ${updated.runs} · every ${formatInterval(updated.everyMs)}]\n\n${updated.prompt}\n\nWhen the terminal condition is satisfied, call loops_task with action "delete" and id "${updated.id}".`,
        display: true,
        details: { id: updated.id, run: updated.runs },
      },
      { triggerTurn: true, deliverAs: 'followUp' },
    );
  };

  const createTask = (input: {
    interval: string;
    prompt: string;
    maxRuns?: number;
    expiresIn?: string;
    compactThreshold?: number;
  }): RecurringTask => {
    const schedule = parseInterval(input.interval);
    const now = Date.now();
    const expiresAfter = input.expiresIn ? parseInterval(input.expiresIn).everyMs : DEFAULT_TTL_MS;
    const task: RecurringTask = {
      id: taskId(),
      prompt: input.prompt.trim(),
      everyMs: schedule.everyMs,
      createdAt: now,
      nextRunAt: now + schedule.everyMs,
      runs: 0,
      maxRuns: input.maxRuns ?? DEFAULT_MAX_RUNS,
      expiresAt: now + expiresAfter,
      compactThreshold:
        input.compactThreshold === undefined
          ? undefined
          : validateCompactThreshold(input.compactThreshold),
    };
    if (!task.prompt) throw new Error('prompt is required');
    if (!Number.isInteger(task.maxRuns) || task.maxRuns! < 1 || task.maxRuns! > 10_000) {
      throw new Error('maxRuns must be an integer between 1 and 10000');
    }
    tasks.set(task.id, task);
    persist();
    updateStatus();
    return task;
  };

  pi.on('session_start', async (_event, ctx) => {
    ctxRef = ctx;
    tasks = new Map(
      restoreState(ctx)
        .filter((task) => !isTaskExpired(task))
        .map((task) => [task.id, task]),
    );
    updateStatus();
    timer ??= setInterval(tick, CHECK_INTERVAL_MS);
  });

  pi.on('agent_start', async () => {
    busy = true;
  });
  pi.on('agent_end', async (_event, ctx) => {
    busy = false;
    ctxRef = ctx;
  });
  pi.on('session_shutdown', async () => {
    if (timer) clearInterval(timer);
    timer = undefined;
    ctxRef?.ui.setStatus(STATUS_KEY, undefined);
    ctxRef = undefined;
    tasks.clear();
  });

  pi.registerCommand('loop', {
    description: 'Run a recurring prompt: /loop every 30s <prompt> | list | stop <id> | clear',
    handler: async (args, ctx) => {
      const input = args.trim();
      if (input === 'list' || input === '') {
        ctx.ui.notify(
          tasks.size
            ? [...tasks.values()].map((task) => taskLine(task)).join('\n')
            : 'No active loops.',
          'info',
        );
        return;
      }
      if (input === 'clear') {
        tasks.clear();
        persist();
        updateStatus();
        ctx.ui.notify('Cleared all loops.', 'info');
        return;
      }
      const stop = input.match(/^(?:stop|delete|rm)\s+(\S+)$/);
      if (stop) {
        const removed = tasks.delete(stop[1]!);
        if (removed) persist();
        updateStatus();
        ctx.ui.notify(
          removed ? `Stopped loop ${stop[1]}.` : `No loop ${stop[1]}.`,
          removed ? 'info' : 'warning',
        );
        return;
      }
      try {
        const parsed = parseLoopCommand(input);
        const task = createTask({
          interval: formatInterval(parsed.schedule.everyMs),
          prompt: parsed.prompt,
        });
        ctx.ui.notify(`Created ${taskLine(task)}.`, 'info');
      } catch (error) {
        ctx.ui.notify(error instanceof Error ? error.message : String(error), 'error');
      }
    },
  });

  pi.registerTool({
    name: 'loops_task',
    label: 'Loops Task',
    description:
      'Create, list, delete, or clear session-scoped recurring Pi prompts. Intervals support 30s, 5m, 2h, and 1d. Tasks run only while this Pi session is open and idle.',
    promptSnippet: 'Manage session-scoped recurring prompts and stop conditions',
    promptGuidelines: [
      'Use loops_task when the user asks to check or repeat work on an interval.',
      'Delete a loops_task as soon as its terminal condition is satisfied.',
      'Loops auto-compact the session before a tick at 80% context usage; set compactThreshold (0-1) to tune long-running loops.',
    ],
    parameters: Type.Object({
      action: StringEnum(['create', 'list', 'delete', 'clear'] as const),
      interval: Type.Optional(
        Type.String({ description: 'For create: interval such as 30s, 5m, 2h, or 1d' }),
      ),
      prompt: Type.Optional(
        Type.String({
          description:
            'For create: complete prompt to execute each interval, including its stop condition',
        }),
      ),
      id: Type.Optional(Type.String({ description: 'For delete: task id' })),
      maxRuns: Type.Optional(
        Type.Number({ description: 'For create: safety cap; defaults to 100' }),
      ),
      expiresIn: Type.Optional(
        Type.String({ description: 'For create: expiry duration; defaults to 1d' }),
      ),
      compactThreshold: Type.Optional(
        Type.Number({
          description:
            'For create: compact the session before a tick once context usage reaches this fraction of the window (0-1 exclusive); defaults to 0.8',
        }),
      ),
    }),
    async execute(_toolCallId, rawInput): Promise<AgentToolResult<ToolDetails>> {
      const input = rawInput as ToolInput;
      if (input.action === 'list') {
        const text = tasks.size
          ? [...tasks.values()].map((task) => taskLine(task)).join('\n')
          : 'No active loops.';
        return { content: [{ type: 'text', text }], details: { tasks: [...tasks.values()] } };
      }
      if (input.action === 'clear') {
        tasks.clear();
        persist();
        updateStatus();
        return { content: [{ type: 'text', text: 'Cleared all loops.' }], details: { tasks: [] } };
      }
      if (input.action === 'delete') {
        if (!input.id) throw new Error('id is required for delete');
        const removed = tasks.delete(input.id);
        if (removed) persist();
        updateStatus();
        return {
          content: [
            { type: 'text', text: removed ? `Stopped loop ${input.id}.` : `No loop ${input.id}.` },
          ],
          details: { tasks: [...tasks.values()] },
        };
      }
      if (!input.interval || !input.prompt)
        throw new Error('interval and prompt are required for create');
      const task = createTask(
        input as Required<Pick<ToolInput, 'interval' | 'prompt'>> &
          Pick<ToolInput, 'maxRuns' | 'expiresIn' | 'compactThreshold'>,
      );
      return {
        content: [{ type: 'text', text: `Created ${taskLine(task)}.` }],
        details: { task, tasks: [...tasks.values()] },
      };
    },
  });
}
