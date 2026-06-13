// Dependency-free fuzzy match. Returns a score (higher = better) or -1 for no
// match. Subsequence match with bonuses for contiguous runs and word-start hits.
export function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  if (!q) return 0;
  if (t.includes(q)) return 1000 - (t.indexOf(q) + (t.length - q.length)); // strong substring

  let qi = 0;
  let score = 0;
  let run = 0;
  let prev = -2;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      run += 1;
      score += run * 2;
      if (ti === prev + 1) score += 4; // contiguous
      if (ti === 0 || /[\s\-_./]/.test(t[ti - 1])) score += 6; // word start
      prev = ti;
      qi += 1;
    } else {
      run = 0;
    }
  }
  return qi === q.length ? score : -1;
}
