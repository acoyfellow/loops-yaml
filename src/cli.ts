#!/usr/bin/env bun
import { findLoopsFile, loadLoops, saveLoops, validateLoopName } from './config';
import { restartWatcher, startWatcher, stopWatcher, watcherStatus } from './daemon';
import { listStateNames, readLatest, runLoop, statusOf, tailLatest } from './runner';
import { watch } from './schedule';
import type { Loop } from './types';

const HELP = `loops — run commands on a cron schedule, or on demand.

Usage:
  loops list [--json]              Show every loop and its last run.
  loops list --all [--json]        Also show state dirs with no loops.yaml entry (orphans).
  loops inspect                    Print JSON for local control surfaces.
  loops set <name> --run <command> [--schedule <cron>] [--cwd <path>]
  loops delete <name>              Delete a loop definition.
  loops run <name>                 Run one loop now.
  loops logs <name> [n]            Print recent output.
  loops watch                      Run scheduled loops in the foreground.
  loops watcher <status|start|stop|restart>

Config: loops.yaml in the current directory or any parent.
`;

function configPath(): string {
  const path = findLoopsFile();
  if (!path) throw new Error('no loops.yaml found here or in any parent directory');
  return path;
}
async function loops(): Promise<Loop[]> {
  return loadLoops(configPath());
}
function find(list: Loop[], name: string): Loop {
  const loop = list.find((candidate) => candidate.name === name);
  if (!loop)
    throw new Error(
      `no loop named "${name}". known: ${list.map((item) => item.name).join(', ') || '(none)'}`,
    );
  return loop;
}
function option(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}
function output(value: unknown) {
  console.log(JSON.stringify(value, null, 2));
}

const [cmd, arg, arg2] = process.argv.slice(2);

try {
  switch (cmd) {
    case 'list': {
      const list = await loops();
      const json = process.argv.includes('--json');
      const all = process.argv.includes('--all');
      const declared = new Set(list.map((loop) => loop.name));
      const rows = await Promise.all(
        list.map(async (loop) => {
          const latest = await readLatest(loop.name);
          return {
            name: loop.name,
            schedule: loop.schedule ?? 'on-demand',
            declared: true,
            status: statusOf(latest),
            latest,
          };
        }),
      );
      if (all) {
        const orphanNames = (await listStateNames()).filter((name) => !declared.has(name));
        for (const name of orphanNames) {
          const latest = await readLatest(name);
          rows.push({
            name,
            schedule: '(undeclared)',
            declared: false,
            status: statusOf(latest),
            latest,
          });
        }
      }
      if (json) {
        output(rows);
        break;
      }
      if (!rows.length) console.log('no loops defined');
      for (const row of rows) {
        const last = row.latest
          ? `last ${row.latest.finishedAt ?? `started ${row.latest.startedAt}`}${row.latest.exitCode != null ? ` exit=${row.latest.exitCode}` : ''}`
          : 'never run';
        const flag = row.declared ? '' : ' (orphan: no loops.yaml entry)';
        console.log(
          `${row.name.padEnd(16)} ${row.schedule.padEnd(16)} ${row.status.padEnd(10)} ${last}${flag}`,
        );
      }
      break;
    }
    case 'inspect': {
      const path = configPath();
      const list = await loadLoops(path);
      const declared = new Set(list.map((loop) => loop.name));
      const loopRows = await Promise.all(
        list.map(async (loop) => {
          const latest = await readLatest(loop.name);
          return { ...loop, latest, status: statusOf(latest) };
        }),
      );
      const orphans = (await listStateNames()).filter((name) => !declared.has(name));
      const orphanRows = await Promise.all(
        orphans.map(async (name) => {
          const latest = await readLatest(name);
          return { name, latest, status: statusOf(latest) };
        }),
      );
      output({
        configPath: path,
        watcher: await watcherStatus(path),
        loops: loopRows,
        orphans: orphanRows,
      });
      break;
    }
    case 'set': {
      if (!arg)
        throw new Error(
          'usage: loops set <name> --run <command> [--schedule <cron>] [--cwd <path>]',
        );
      validateLoopName(arg);
      const path = configPath();
      const list = await loadLoops(path);
      const existing = list.find((loop) => loop.name === arg);
      const run = option('--run') ?? existing?.run;
      if (!run?.trim()) throw new Error('--run is required for a new loop');
      const schedule = option('--schedule');
      const cwd = option('--cwd');
      const next: Loop = {
        name: arg,
        run,
        schedule: schedule === undefined ? existing?.schedule : schedule || undefined,
        cwd: cwd === undefined ? existing?.cwd : cwd || undefined,
      };
      await saveLoops(path, [...list.filter((loop) => loop.name !== arg), next]);
      const watcher = await watcherStatus(path);
      if (watcher.running) await restartWatcher(path);
      output({ saved: next, watcherRestarted: watcher.running });
      break;
    }
    case 'delete': {
      if (!arg) throw new Error('usage: loops delete <name>');
      const path = configPath();
      const list = await loadLoops(path);
      find(list, arg);
      await saveLoops(
        path,
        list.filter((loop) => loop.name !== arg),
      );
      const watcher = await watcherStatus(path);
      if (watcher.running) await restartWatcher(path);
      output({ deleted: arg, watcherRestarted: watcher.running });
      break;
    }
    case 'run': {
      if (!arg) throw new Error('usage: loops run <name>');
      const loop = find(await loops(), arg);
      const record = await runLoop(loop);
      output(record);
      process.exitCode = record.exitCode ?? 0;
      break;
    }
    case 'watch':
      await watch(await loops());
      break;
    case 'watcher': {
      const path = configPath();
      if (arg === 'status') output(await watcherStatus(path));
      else if (arg === 'start') output({ running: true, record: await startWatcher(path) });
      else if (arg === 'stop') output({ running: false, stopped: await stopWatcher(path) });
      else if (arg === 'restart') output({ running: true, record: await restartWatcher(path) });
      else throw new Error('usage: loops watcher <status|start|stop|restart>');
      break;
    }
    case 'logs': {
      if (!arg) throw new Error('usage: loops logs <name> [n]');
      const lines = arg2 ? Number.parseInt(arg2, 10) : 40;
      console.log(
        await tailLatest(arg, Number.isFinite(lines) ? Math.max(1, Math.min(lines, 500)) : 40),
      );
      break;
    }
    default:
      console.log(HELP);
  }
} catch (error) {
  console.error((error as Error).message);
  process.exitCode = 1;
}
