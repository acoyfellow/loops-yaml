import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import type { Loop, RunRecord } from './types';

const STATE_DIR = process.env.LOOPS_STATE_DIR ?? join(homedir(), '.loops');

function runDir(name: string): string {
  return join(STATE_DIR, name);
}

/** Run one loop once. Streams output to a per-run log and records the result. */
export async function runLoop(loop: Loop): Promise<RunRecord> {
  const dir = runDir(loop.name);
  await mkdir(dir, { recursive: true });
  const startedAt = new Date();
  const stamp = startedAt.toISOString().replace(/[:.]/g, '-');
  const logPath = join(dir, `${stamp}.log`);
  const log = Bun.file(logPath).writer();
  log.write(`# loop: ${loop.name}\n# run: ${loop.run}\n# started: ${startedAt.toISOString()}\n\n`);

  const proc = Bun.spawn(['bash', '-lc', loop.run], {
    cwd: loop.cwd ?? process.cwd(),
    env: { ...process.env, LOOP_NAME: loop.name },
    stdout: 'pipe',
    stderr: 'pipe',
  });

  const record: RunRecord = {
    name: loop.name,
    startedAt: startedAt.toISOString(),
    logPath,
    pid: proc.pid,
  };
  await writeLatest(loop.name, record);

  const pump = async (stream: ReadableStream<Uint8Array>) => {
    for await (const chunk of stream) log.write(chunk);
  };
  await Promise.all([pump(proc.stdout), pump(proc.stderr)]);
  const exitCode = await proc.exited;

  record.finishedAt = new Date().toISOString();
  record.exitCode = exitCode;
  log.write(`\n# exit: ${exitCode}\n`);
  await log.end();
  await writeLatest(loop.name, record);
  return record;
}

async function writeLatest(name: string, record: RunRecord): Promise<void> {
  await mkdir(runDir(name), { recursive: true });
  await writeFile(join(runDir(name), 'latest.json'), JSON.stringify(record, null, 2), 'utf8');
}

export async function readLatest(name: string): Promise<RunRecord | null> {
  try {
    return JSON.parse(await readFile(join(runDir(name), 'latest.json'), 'utf8')) as RunRecord;
  } catch {
    return null;
  }
}

/** Loop directory names with any state on disk, regardless of loops.yaml. */
export async function listStateNames(): Promise<string[]> {
  const entries = await readdir(STATE_DIR, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isDirectory() && entry.name !== 'watchers')
    .map((entry) => entry.name);
}

function isAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export type RunStatus = 'never-run' | 'running' | 'stalled' | 'done' | 'failed';

/**
 * Classify a run record without trusting exitCode alone: a record with no
 * finishedAt and a dead pid is a stalled/orphaned run, not "still running".
 */
export function statusOf(record: RunRecord | null): RunStatus {
  if (!record) return 'never-run';
  if (record.finishedAt) return record.exitCode === 0 ? 'done' : 'failed';
  if (record.pid != null && isAlive(record.pid)) return 'running';
  return 'stalled';
}

/** Tail the most recent log for a loop. */
export async function tailLatest(name: string, lines = 40): Promise<string> {
  const latest = await readLatest(name);
  let logPath = latest?.logPath;
  if (!logPath) {
    const dir = runDir(name);
    const files = await readdir(dir).catch(() => [] as string[]);
    const logs = files.filter((f) => f.endsWith('.log')).sort();
    if (logs.length === 0) return `no runs yet for "${name}"`;
    logPath = join(dir, logs[logs.length - 1]!);
  }
  const text = await readFile(resolve(logPath), 'utf8').catch(() => '');
  return text.split('\n').slice(-lines).join('\n');
}
