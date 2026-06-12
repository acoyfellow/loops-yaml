#!/usr/bin/env bun
import { findLoopsFile, loadLoops } from './config';
import { readLatest, runLoop, tailLatest } from './runner';
import { watch } from './schedule';
import type { Loop } from './types';

const HELP = `loops — run commands on a cron schedule, or on demand.

Usage:
  loops list                 Show every loop and its last run.
  loops run <name>           Run one loop now.
  loops watch                Run scheduled loops forever (cron).
  loops logs <name> [n]      Print the last n lines (default 40) of a loop's log.

Config: loops.yaml in the current directory or any parent.

  loops:
    review:
      schedule: "*/30 * * * *"   # cron; omit for on-demand only
      run: ./scripts/review.sh
`;

async function loops(): Promise<Loop[]> {
  const path = findLoopsFile();
  if (!path) {
    console.error('no loops.yaml found here or in any parent directory');
    process.exit(1);
  }
  return loadLoops(path);
}

function find(list: Loop[], name: string): Loop {
  const loop = list.find((l) => l.name === name);
  if (!loop) {
    console.error(
      `no loop named "${name}". known: ${list.map((l) => l.name).join(', ') || '(none)'}`,
    );
    process.exit(1);
  }
  return loop;
}

const [cmd, arg, arg2] = process.argv.slice(2);

switch (cmd) {
  case 'list': {
    const list = await loops();
    if (list.length === 0) {
      console.log('no loops defined');
      break;
    }
    for (const l of list) {
      const latest = await readLatest(l.name);
      const sched = l.schedule ? l.schedule : 'on-demand';
      const last = latest
        ? `last ${latest.finishedAt ?? 'running…'}${latest.exitCode != null ? ` exit=${latest.exitCode}` : ''}`
        : 'never run';
      console.log(`${l.name.padEnd(16)} ${sched.padEnd(16)} ${last}`);
    }
    break;
  }
  case 'run': {
    if (!arg) {
      console.error('usage: loops run <name>');
      process.exit(1);
    }
    const loop = find(await loops(), arg);
    const record = await runLoop(loop);
    console.log(`${loop.name} exit=${record.exitCode}  log: ${record.logPath}`);
    process.exit(record.exitCode ?? 0);
    break;
  }
  case 'watch': {
    await watch(await loops());
    break;
  }
  case 'logs': {
    if (!arg) {
      console.error('usage: loops logs <name> [n]');
      process.exit(1);
    }
    const n = arg2 ? Number.parseInt(arg2, 10) : 40;
    console.log(await tailLatest(arg, Number.isFinite(n) ? n : 40));
    break;
  }
  default:
    console.log(HELP);
}
