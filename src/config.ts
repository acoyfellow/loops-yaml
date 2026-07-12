import { existsSync } from 'node:fs';
import { rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { Loop, LoopsFile } from './types';

/** Find loops.yaml by walking up from a starting directory. */
export function findLoopsFile(start = process.cwd()): string | null {
  let dir = resolve(start);
  for (;;) {
    const candidate = resolve(dir, 'loops.yaml');
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export async function loadLoops(path: string): Promise<Loop[]> {
  const file = Bun.file(path);
  const text = await file.text();
  const parsed = parseYaml(text) as LoopsFile;
  if (!parsed || typeof parsed !== 'object' || !parsed.loops) {
    throw new Error(`loops.yaml has no "loops:" map`);
  }
  const base = dirname(path);
  return Object.entries(parsed.loops).map(([name, def]) => {
    if (!def || typeof def.run !== 'string' || def.run.trim() === '') {
      throw new Error(`loop "${name}" is missing a "run:" command`);
    }
    return {
      name,
      run: def.run,
      schedule: def.schedule,
      cwd: def.cwd ? resolve(base, def.cwd) : base,
    } satisfies Loop;
  });
}

/** Replace loops.yaml atomically using the deliberately small supported shape. */
export async function saveLoops(path: string, loops: Loop[]): Promise<void> {
  const names = new Set<string>();
  for (const loop of loops) {
    validateLoopName(loop.name);
    if (names.has(loop.name)) throw new Error(`duplicate loop name: ${loop.name}`);
    names.add(loop.name);
    if (!loop.run.trim()) throw new Error(`loop "${loop.name}" is missing a run command`);
  }
  const text = [
    'loops:',
    ...loops.flatMap((loop) => [
      `  ${loop.name}:`,
      ...(loop.schedule ? [`    schedule: ${quoteYaml(loop.schedule)}`] : []),
      `    run: ${quoteYaml(loop.run)}`,
      ...(loop.cwd ? [`    cwd: ${quoteYaml(loop.cwd)}`] : []),
    ]),
    '',
  ].join('\n');
  const temporary = `${path}.tmp-${process.pid}-${Date.now()}`;
  await writeFile(temporary, text, { encoding: 'utf8', mode: 0o600 });
  await rename(temporary, path);
}

export function validateLoopName(name: string): void {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/.test(name)) {
    throw new Error('loop name must be 1-64 letters, numbers, dots, underscores, or hyphens');
  }
}

function quoteYaml(value: string): string {
  return JSON.stringify(value);
}

/**
 * Tiny YAML reader for the shape loops.yaml uses: a top-level `loops:` map of
 * names to `{ run, schedule?, cwd? }`. Not a general YAML parser — keeps the
 * tool dependency-free. Supports comments, quoted/unquoted scalars, 2-space nesting.
 */
export function parseYaml(text: string): unknown {
  const loops: Record<string, Record<string, string>> = {};
  let current: string | null = null;
  let inLoops = false;

  for (const raw of text.split('\n')) {
    const line = raw.replace(/\t/g, '  ');
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const indent = line.length - line.trimStart().length;
    const content = stripComment(line.trim());
    if (!content) continue;

    if (indent === 0) {
      inLoops = content === 'loops:' || content.startsWith('loops:');
      current = null;
      continue;
    }
    if (!inLoops) continue;

    if (indent === 2 && content.endsWith(':')) {
      current = content.slice(0, -1).trim();
      loops[current] = {};
      continue;
    }
    if (indent >= 4 && current) {
      const idx = content.indexOf(':');
      if (idx === -1) continue;
      const key = content.slice(0, idx).trim();
      const value = unquote(content.slice(idx + 1).trim());
      loops[current][key] = value;
    }
  }
  return { loops };
}

function stripComment(s: string): string {
  // Drop a trailing # comment that is not inside quotes. Double-quoted values
  // use JSON escapes, so an escaped quote must not close the string.
  let inS = false;
  let inD = false;
  let escaped = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (c === '\\' && inD) {
      escaped = true;
      continue;
    }
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (c === '#' && !inS && !inD && (i === 0 || s[i - 1] === ' '))
      return s.slice(0, i).trim();
  }
  return s;
}

function unquote(s: string): string {
  if (s.startsWith('"') && s.endsWith('"')) {
    try {
      return JSON.parse(s) as string;
    } catch {
      return s.slice(1, -1);
    }
  }
  if (s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1);
  return s;
}
