import { cronMatches, parseCron } from './cron';
import { runLoop } from './runner';
import type { Loop } from './types';

/**
 * Run scheduled loops forever. Wakes once a minute, runs every loop whose cron
 * matches the current minute. Loops without a schedule are skipped (on-demand only).
 * One run per loop at a time — a still-running loop is not started again.
 */
export async function watch(loops: Loop[], log = console.log): Promise<never> {
  const scheduled = loops.filter((l) => l.schedule);
  for (const l of scheduled) parseCron(l.schedule!); // validate up front

  if (scheduled.length === 0) {
    log('no scheduled loops (none have a `schedule:`). nothing to watch.');
  } else {
    log(`watching ${scheduled.length} loop(s):`);
    for (const l of scheduled) log(`  ${l.name}  ${l.schedule}`);
  }

  const running = new Set<string>();

  const tick = async () => {
    const now = new Date();
    for (const loop of scheduled) {
      if (running.has(loop.name)) continue;
      if (!cronMatches(parseCron(loop.schedule!), now)) continue;
      running.add(loop.name);
      log(`[${now.toISOString()}] run ${loop.name}`);
      runLoop(loop)
        .then((r) => log(`[${new Date().toISOString()}] ${loop.name} exit=${r.exitCode}`))
        .catch((e) =>
          log(`[${new Date().toISOString()}] ${loop.name} error: ${(e as Error).message}`),
        )
        .finally(() => running.delete(loop.name));
    }
  };

  await tick();
  // Align to the next minute boundary, then tick every minute.
  const msToNextMinute = 60_000 - (Date.now() % 60_000);
  await Bun.sleep(msToNextMinute);
  for (;;) {
    await tick();
    await Bun.sleep(60_000);
  }
}
