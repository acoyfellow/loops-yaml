import { existsSync } from 'node:fs';
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
  // Drop a trailing # comment that is not inside quotes.
  let inS = false;
  let inD = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (c === '#' && !inS && !inD && (i === 0 || s[i - 1] === ' '))
      return s.slice(0, i).trim();
  }
  return s;
}

function unquote(s: string): string {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}
