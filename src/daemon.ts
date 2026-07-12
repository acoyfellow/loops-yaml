import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { closeSync, openSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const STATE_DIR = process.env.LOOPS_STATE_DIR ?? join(homedir(), '.loops');

type WatcherRecord = { pid: number; configPath: string; startedAt: string; logPath: string };

function watcherPaths(configPath: string) {
  const id = createHash('sha256').update(resolve(configPath)).digest('hex').slice(0, 16);
  const directory = join(STATE_DIR, 'watchers');
  return { directory, record: join(directory, `${id}.json`), log: join(directory, `${id}.log`) };
}

function processAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export async function watcherStatus(
  configPath: string,
): Promise<{ running: boolean; record: WatcherRecord | null }> {
  const paths = watcherPaths(configPath);
  let record: WatcherRecord | null = null;
  try {
    record = JSON.parse(await readFile(paths.record, 'utf8')) as WatcherRecord;
  } catch {
    return { running: false, record: null };
  }
  if (
    !Number.isInteger(record.pid) ||
    record.pid <= 1 ||
    resolve(record.configPath) !== resolve(configPath) ||
    !processAlive(record.pid)
  ) {
    await rm(paths.record, { force: true });
    return { running: false, record: null };
  }
  return { running: true, record };
}

export async function startWatcher(configPath: string): Promise<WatcherRecord> {
  const current = await watcherStatus(configPath);
  if (current.running && current.record) return current.record;
  const paths = watcherPaths(configPath);
  await mkdir(paths.directory, { recursive: true });
  const executable = process.argv[0];
  const cli = resolve(import.meta.dir, 'cli.ts');
  const log = openSync(paths.log, 'a', 0o600);
  const child = spawn(executable, [cli, 'watch'], {
    cwd: dirname(resolve(configPath)),
    env: process.env,
    detached: true,
    stdio: ['ignore', log, log],
  });
  closeSync(log);
  child.unref();
  if (!child.pid) throw new Error('failed to start loops watcher');
  const record = {
    pid: child.pid,
    configPath: resolve(configPath),
    startedAt: new Date().toISOString(),
    logPath: paths.log,
  };
  await writeFile(paths.record, JSON.stringify(record, null, 2), { encoding: 'utf8', mode: 0o600 });
  return record;
}

export async function stopWatcher(configPath: string): Promise<boolean> {
  const status = await watcherStatus(configPath);
  if (!status.running || !status.record) return false;
  try {
    process.kill(-status.record.pid, 'SIGTERM');
  } catch {
    try {
      process.kill(status.record.pid, 'SIGTERM');
    } catch {}
  }
  await rm(watcherPaths(configPath).record, { force: true });
  return true;
}

export async function restartWatcher(configPath: string): Promise<WatcherRecord> {
  await stopWatcher(configPath);
  return startWatcher(configPath);
}
