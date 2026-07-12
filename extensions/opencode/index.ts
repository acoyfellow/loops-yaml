/**
 * loops-yaml plugin for OpenCode
 *
 * Session-scoped recurring prompts: the same `/loop` behaviour as the Pi
 * extension, ported to OpenCode's plugin API. A loop is an interval plus a
 * prompt. While OpenCode runs and the session is idle, each due loop is
 * delivered as a follow-up prompt that drives a new agent turn.
 *
 *   /loop every 30s check MR !38955; stop this loop once it merges
 *   /loop list
 *   /loop stop <id>
 *   /loop clear
 *
 * The agent drives the same loops through the `loops_task` tool. Tasks default
 * to a 24h expiry and 100-run cap, never overlap an active turn, and the agent
 * is told to delete a task once its terminal condition is met.
 *
 * Tasks persist to disk under $LOOPS_OPENCODE_STATE_DIR (default
 * ~/.loops-opencode/<project>.json) so they survive a TUI restart, matching
 * the durable-while-the-tool-is-around spirit of the Pi extension.
 *
 * @see https://opencode.ai/docs/plugins/
 */

import { randomBytes } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import type { Plugin } from '@opencode-ai/plugin';
import { tool } from '@opencode-ai/plugin';
import {
  formatInterval,
  isTaskExpired,
  markTaskRun,
  parseInterval,
  parseLoopCommand,
  type RecurringTask,
} from '../../src/recurring';

const DEFAULT_MAX_RUNS = 100;
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1_000;
const CHECK_INTERVAL_MS = 1_000;

interface PersistedState {
  version: 1;
  tasks: RecurringTask[];
}

function stateDir(): string {
  return process.env.LOOPS_OPENCODE_STATE_DIR || join(homedir(), '.loops-opencode');
}

function statePath(project: string): string {
  const safe = project.replace(/[^a-zA-Z0-9_-]/g, '_') || 'default';
  return join(stateDir(), `${safe}.json`);
}

function taskId(): string {
  return randomBytes(4).toString('hex');
}

function loadState(file: string): RecurringTask[] {
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8')) as PersistedState;
    if (parsed?.version === 1 && Array.isArray(parsed.tasks)) return parsed.tasks;
  } catch {
    // missing or corrupt file: start clean (fail-open)
  }
  return [];
}

function saveState(file: string, tasks: RecurringTask[]): void {
  mkdirSync(dirname(file), { recursive: true });
  const state: PersistedState = { version: 1, tasks };
  writeFileSync(file, JSON.stringify(state, null, 2));
}

function taskLine(task: RecurringTask, now = Date.now()): string {
  const dueIn = Math.max(0, Math.ceil((task.nextRunAt - now) / 1_000));
  const prompt = task.prompt.replace(/\s+/g, ' ');
  const trimmed = prompt.length > 70 ? `${prompt.slice(0, 67)}…` : prompt;
  return `${task.id} every ${formatInterval(task.everyMs)} · next ${dueIn}s · ${task.runs}/${task.maxRuns ?? '∞'} · ${trimmed}`;
}

export const LoopsPlugin: Plugin = async ({ client, project, directory }) => {
  const file = statePath(project?.id || directory || 'default');
  const tasks = new Map<string, RecurringTask>(
    loadState(file)
      .filter((task) => !isTaskExpired(task))
      .map((task) => [task.id, task]),
  );

  // Track which sessions are busy so loops never overlap an active turn.
  const busy = new Set<string>();
  // The session we deliver loop prompts to: the most recently active one.
  let activeSession: string | undefined;
  let ticking = false;

  const persist = () => saveState(file, [...tasks.values()]);

  const toast = (message: string, variant: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    void client.tui.showToast({ body: { message, variant } }).catch(() => {});
  };

  const editTask = (input: {
    id: string;
    interval?: string;
    prompt?: string;
    maxRuns?: number;
    expiresIn?: string;
  }): RecurringTask => {
    const existing = tasks.get(input.id);
    if (!existing) throw new Error(`No loop ${input.id}.`);
    if (
      input.interval === undefined &&
      input.prompt === undefined &&
      input.maxRuns === undefined &&
      input.expiresIn === undefined
    ) {
      throw new Error(
        'at least one of interval, prompt, maxRuns, or expiresIn is required for edit',
      );
    }
    const now = Date.now();
    const everyMs = input.interval ? parseInterval(input.interval).everyMs : existing.everyMs;
    const prompt = input.prompt === undefined ? existing.prompt : input.prompt.trim();
    const maxRuns = input.maxRuns ?? existing.maxRuns;
    if (!prompt) throw new Error('prompt is required');
    if (maxRuns !== undefined && (!Number.isInteger(maxRuns) || maxRuns < 1 || maxRuns > 10_000)) {
      throw new Error('maxRuns must be an integer between 1 and 10000');
    }
    const task: RecurringTask = {
      ...existing,
      prompt,
      everyMs,
      nextRunAt: input.interval ? now + everyMs : existing.nextRunAt,
      maxRuns,
      expiresAt: input.expiresIn
        ? now + parseInterval(input.expiresIn).everyMs
        : existing.expiresAt,
    };
    tasks.set(task.id, task);
    persist();
    return task;
  };

  const createTask = (input: {
    interval: string;
    prompt: string;
    maxRuns?: number;
    expiresIn?: string;
  }): RecurringTask => {
    const schedule = parseInterval(input.interval);
    const now = Date.now();
    const expiresAfter = input.expiresIn ? parseInterval(input.expiresIn).everyMs : DEFAULT_TTL_MS;
    const prompt = input.prompt.trim();
    if (!prompt) throw new Error('prompt is required');
    const maxRuns = input.maxRuns ?? DEFAULT_MAX_RUNS;
    if (!Number.isInteger(maxRuns) || maxRuns < 1 || maxRuns > 10_000) {
      throw new Error('maxRuns must be an integer between 1 and 10000');
    }
    const task: RecurringTask = {
      id: taskId(),
      prompt,
      everyMs: schedule.everyMs,
      createdAt: now,
      nextRunAt: now + schedule.everyMs,
      runs: 0,
      maxRuns,
      expiresAt: now + expiresAfter,
    };
    tasks.set(task.id, task);
    persist();
    return task;
  };

  const prune = (now: number) => {
    let changed = false;
    for (const [id, task] of tasks) {
      if (!isTaskExpired(task, now)) continue;
      tasks.delete(id);
      changed = true;
      toast(`Loop ${id} stopped after reaching its limit.`, 'info');
    }
    if (changed) persist();
  };

  const tick = async () => {
    if (ticking) return;
    ticking = true;
    try {
      const now = Date.now();
      prune(now);
      const session = activeSession;
      if (!session || busy.has(session)) return;

      const due = [...tasks.values()].find((task) => now >= task.nextRunAt);
      if (!due) return;

      const updated = markTaskRun(due, now);
      tasks.set(updated.id, updated);
      persist();

      busy.add(session);
      const message =
        `[loop ${updated.id} · run ${updated.runs} · every ${formatInterval(updated.everyMs)}]\n\n` +
        `${updated.prompt}\n\n` +
        `When the terminal condition is satisfied, call loops_task with action "delete" and id "${updated.id}".`;
      try {
        await client.session.prompt({
          path: { id: session },
          body: { parts: [{ type: 'text', text: message }] },
        });
      } catch {
        // session gone or busy: release and retry on a later tick
      } finally {
        busy.delete(session);
      }
    } finally {
      ticking = false;
    }
  };

  const timer = setInterval(() => {
    void tick();
  }, CHECK_INTERVAL_MS);
  // Don't keep the process alive solely for the loop timer.
  if (typeof timer.unref === 'function') timer.unref();

  return {
    event: async ({ event }) => {
      const props = (event as { properties?: { sessionID?: string } }).properties;
      const sessionID = props?.sessionID;
      switch (event.type) {
        case 'session.created':
        case 'session.updated':
          if (sessionID) activeSession = sessionID;
          break;
        case 'session.status':
          // A status event means a turn is in flight for this session.
          if (sessionID) {
            activeSession = sessionID;
            busy.add(sessionID);
          }
          break;
        case 'session.idle':
          if (sessionID) {
            activeSession = sessionID;
            busy.delete(sessionID);
          }
          break;
        case 'session.deleted':
          if (sessionID) {
            busy.delete(sessionID);
            if (activeSession === sessionID) activeSession = undefined;
          }
          break;
        default:
          break;
      }
    },

    tool: {
      loops_task: tool({
        description:
          'Create, edit, list, delete, or clear session-scoped recurring OpenCode prompts. Editing updates a running loop in place without stopping it. Intervals support 30s, 5m, 2h, and 1d. Tasks run only while OpenCode is open and the session is idle. Use this when the user asks to check or repeat work on an interval, and delete a task as soon as its terminal condition is satisfied.',
        args: {
          action: tool.schema
            .enum(['create', 'edit', 'list', 'delete', 'clear'])
            .describe('create, edit, list, delete, or clear loops'),
          interval: tool.schema
            .string()
            .optional()
            .describe('For create: interval such as 30s, 5m, 2h, or 1d'),
          prompt: tool.schema
            .string()
            .optional()
            .describe(
              'For create: complete prompt to execute each interval, including its stop condition',
            ),
          id: tool.schema.string().optional().describe('For edit or delete: task id'),
          maxRuns: tool.schema
            .number()
            .optional()
            .describe('For create: safety cap; defaults to 100'),
          expiresIn: tool.schema
            .string()
            .optional()
            .describe('For create: expiry duration; defaults to 1d'),
        },
        async execute(args, ctx) {
          if (ctx?.sessionID) activeSession = ctx.sessionID;

          if (args.action === 'list') {
            return tasks.size
              ? [...tasks.values()].map((task) => taskLine(task)).join('\n')
              : 'No active loops.';
          }

          if (args.action === 'clear') {
            tasks.clear();
            persist();
            return 'Cleared all loops.';
          }

          if (args.action === 'edit') {
            if (!args.id) throw new Error('id is required for edit');
            const task = editTask({
              id: args.id,
              interval: args.interval,
              prompt: args.prompt,
              maxRuns: args.maxRuns,
              expiresIn: args.expiresIn,
            });
            return `Updated ${taskLine(task)}.`;
          }

          if (args.action === 'delete') {
            if (!args.id) throw new Error('id is required for delete');
            const removed = tasks.delete(args.id);
            if (removed) persist();
            return removed ? `Stopped loop ${args.id}.` : `No loop ${args.id}.`;
          }

          // create
          if (!args.interval || !args.prompt) {
            throw new Error('interval and prompt are required for create');
          }
          const task = createTask({
            interval: args.interval,
            prompt: args.prompt,
            maxRuns: args.maxRuns,
            expiresIn: args.expiresIn,
          });
          return `Created ${taskLine(task)}.`;
        },
      }),
    },
  };
};

export default LoopsPlugin;

// Re-exported so a thin `/loop` command shim can reuse the same parser.
export { formatInterval, parseLoopCommand };
