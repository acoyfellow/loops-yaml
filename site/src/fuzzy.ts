// Dependency-free fuzzy match for short content fields. Returns a score
// (higher = better) or -1 for no match.
//
// A pure subsequence match is too loose for searching long text (every query
// matches almost everything via scattered letters). So:
//   - substring match scores highest;
//   - otherwise a subsequence is only accepted if it is reasonably tight —
//     each matched char must be close to the previous one (bounded gap),
//     which keeps "dns" from matching "...d...n...s..." across a whole command.
const MAX_GAP = 12; // max chars between consecutive matched letters

export function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  if (!q) return 0;

  const idx = t.indexOf(q);
  if (idx !== -1) return 1000 - idx; // substring: best, earlier = better

  let qi = 0;
  let score = 0;
  let run = 0;
  let prev = -1;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] !== q[qi]) {
      run = 0;
      continue;
    }
    if (prev !== -1 && ti - prev > MAX_GAP) return -1; // gap too wide → not a real match
    run += 1;
    score += run * 3;
    if (ti === prev + 1) score += 5; // contiguous
    if (ti === 0 || /[\s\-_./]/.test(t[ti - 1])) score += 8; // word start
    prev = ti;
    qi += 1;
  }
  return qi === q.length ? score : -1;
}
