<script lang="ts">
  import { RECIPES, CATEGORIES, type Recipe, type Category } from './recipes';
  import { fuzzyScore } from './fuzzy';

  let query = '';
  let active: Category | 'all' = 'all';

  // Score the meaningful fields (title, category, tags, blurb) first; the raw
  // command is searched too but discounted, so a stray subsequence buried in a
  // long shell line can't falsely match or outrank a real title hit.
  const scoreRecipe = (q: string, r: Recipe): number => {
    if (!q.trim()) return 0;
    const fields = `${r.title} ${r.category} ${r.needs.join(' ')} ${r.blurb}`;
    const main = fuzzyScore(q, fields);
    if (main !== -1) return main + 100; // real hit on a meaningful field
    const cmd = fuzzyScore(q, r.run);
    return cmd === -1 ? -1 : cmd; // command-only hit ranks below field hits
  };

  $: filtered = RECIPES.map(r => ({ r, s: scoreRecipe(query, r) }))
    .filter(({ r, s }) => (active === 'all' || r.category === active) && s !== -1)
    .sort((a, b) => b.s - a.s)
    .map(({ r }) => r);

  const fmtSchedule = (s: string) => (s ? s : 'on-demand');
</script>

<div class="page">
  <div class="wrap">
    <header class="head">
      <a class="brand" href="/">
        <span class="mark" aria-hidden="true"></span>
        <span class="wordmark">loops<span class="ext">.yaml</span></span>
      </a>
      <nav aria-label="Recipe navigation">
        <a href="/">Overview</a>
        <a class="ghlink" href="https://github.com/acoyfellow/loops-yaml">Source ↗</a>
      </nav>
    </header>

    <section class="intro">
      <p class="kicker">Working examples</p>
      <h1>Start with a command<br />you can inspect.</h1>
      <p class="lede">
        Each recipe is a small, readable starting point. Copy one into <code>loops.yaml</code>,
        review its paths and credentials, run it once on demand, then add a schedule when you
        trust the result.
      </p>
    </section>

    <div class="controls">
      <label class="search-wrap">
        <span class="search-prompt">/</span>
        <input
          class="search"
          type="search"
          placeholder="filter recipes — r2, cert, dns, backup…"
          bind:value={query}
          aria-label="Filter recipes"
        />
      </label>
      <div class="filters" role="tablist" aria-label="Filter by category">
        <button class="filter" class:on={active === 'all'} on:click={() => (active = 'all')}>all</button>
        {#each CATEGORIES as c}
          <button class="filter" class:on={active === c.id} on:click={() => (active = c.id)}>{c.label.toLowerCase()}</button>
        {/each}
      </div>
    </div>

    <p class="count">{filtered.length} / {RECIPES.length} shown</p>

    {#if filtered.length === 0}
      <p class="empty">Nothing matches. Try fewer letters.</p>
    {/if}

    <ol class="index">
      {#each filtered as r, i (r.id)}
        <li class="entry">
          <div class="entry-head">
            <span class="num">{String(i + 1).padStart(2, '0')}</span>
            <h2>{r.title}</h2>
            <span class="meta">
              <span class="cat">{r.category}</span>
              <span class="when">{fmtSchedule(r.schedule)}</span>
            </span>
          </div>
          <p class="blurb">{r.blurb}</p>
          <pre class="cmd">{r.run}</pre>
          <p class="needs">needs: {r.needs.join(' · ')}</p>
        </li>
      {/each}
    </ol>

    <footer class="foot">
      <a href="/">← loops.yaml</a>
      <span>Demo deployed on Cloudflare Workers</span>
      <a href="https://github.com/acoyfellow/loops-yaml">Source ↗</a>
    </footer>
  </div>
</div>

<style>
  :global(:root) {
    --bg: #0b1626; --line: #1e2c40; --ink: #eef1f5;
    --ink-dim: #97a3b6; --ink-faint: #5d6b80; --accent: #f6821f;
    --card: #0f1f33; --cream: #ece7df; --blue: #8ea6c4;
  }
  :global(html, body) { max-width: 100%; overflow-x: hidden; }
  :global(body) {
    margin: 0; background: var(--bg); color: var(--ink);
    font: 16px/1.6 ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  *, *::before, *::after { box-sizing: border-box; }
  .wrap { max-width: 980px; margin: 0 auto; padding: 0 1.5rem 4rem; }

  .head { display: flex; align-items: center; justify-content: space-between; padding: 1.8rem 0; }
  .brand { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; color: var(--ink); }
  .mark {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid var(--accent); box-shadow: inset 0 0 0 2px var(--bg), 0 0 10px -2px var(--accent);
  }
  .wordmark { font-weight: 600; }
  .ext { color: var(--ink-faint); font-weight: 400; }
  .head nav { display: flex; align-items: center; gap: 1.3rem; }
  .head nav a { color: var(--ink-dim); text-decoration: none; font: 600 0.7rem/1 ui-monospace, monospace; }
  .head nav a:hover { color: var(--ink); }
  .ghlink { padding: 0.55rem 0.75rem; border: 1px solid var(--line); border-radius: 7px; }

  .intro { padding: 2rem 0 2.5rem; }
  .kicker {
    margin: 0 0 0.8rem; font: 600 0.72rem/1 ui-monospace, monospace;
    text-transform: uppercase; letter-spacing: 0.22em; color: var(--ink-faint);
  }
  h1 { font-size: clamp(2.2rem, 5vw, 3.4rem); line-height: 1.03; letter-spacing: -0.05em; margin: 0; font-weight: 680; }
  .lede { color: var(--ink-dim); max-width: 64ch; margin: 1rem 0 0; }
  .lede em { color: var(--ink); font-style: normal; }
  .lede code { color: var(--blue); font: 13px ui-monospace, monospace; }

  /* clinical controls: a ruled filter strip, no pills, no filled buttons */
  .controls {
    position: sticky; top: 0; z-index: 5; padding: 0.9rem 0;
    background: var(--bg); border-bottom: 1px solid var(--line);
  }
  .search-wrap {
    display: flex; align-items: baseline; gap: 0.6rem;
    border-bottom: 1px solid var(--line); padding-bottom: 0.6rem;
  }
  .search-prompt { color: var(--accent); font: 14px ui-monospace, monospace; }
  .search {
    flex: 1; padding: 0.2rem 0; border: 0; background: transparent; color: var(--ink);
    font: 14px ui-monospace, 'Cascadia Code', monospace;
  }
  .search::placeholder { color: var(--ink-faint); }
  .search:focus { outline: none; }
  .filters { display: flex; flex-wrap: wrap; gap: 0 1.1rem; margin-top: 0.7rem; }
  .filter {
    border: 0; background: transparent; color: var(--ink-faint); cursor: pointer;
    font: 0.78rem ui-monospace, monospace; padding: 0.15rem 0;
    border-bottom: 1px solid transparent; transition: color 0.1s, border-color 0.1s;
  }
  .filter:hover { color: var(--ink-dim); }
  .filter.on { color: var(--accent); border-bottom-color: var(--accent); }

  .count {
    color: var(--ink-faint); font: 0.74rem ui-monospace, monospace;
    letter-spacing: 0.08em; margin: 1.1rem 0 0;
  }
  .empty { color: var(--ink-dim); padding: 2rem 0; }

  /* ledger: each recipe is a ruled entry, not a card. square, hairline, flat. */
  .index { list-style: none; margin: 0.6rem 0 0; padding: 0; }
  .entry { padding: 1.6rem 0; border-bottom: 1px solid var(--line); }
  .entry-head {
    display: grid; grid-template-columns: 2.2rem 1fr auto;
    align-items: baseline; gap: 0.9rem;
  }
  .num { font: 0.78rem ui-monospace, monospace; color: var(--ink-faint); }
  h2 { font-size: 1.05rem; margin: 0; letter-spacing: -0.01em; font-weight: 600; }
  .meta { display: flex; gap: 1rem; align-items: baseline; white-space: nowrap; }
  .cat {
    font: 0.66rem ui-monospace, monospace; text-transform: uppercase; letter-spacing: 0.14em;
    color: var(--blue);
  }
  .when { font: 0.72rem ui-monospace, monospace; color: var(--accent); }
  .blurb { color: var(--ink-dim); font-size: 0.92rem; margin: 0.6rem 0 0; padding-left: 3.1rem; max-width: 70ch; }
  .cmd {
    margin: 0.8rem 0 0 3.1rem; padding: 0.8rem 1rem; overflow-x: auto;
    background: #0a1525; border-left: 2px solid var(--line);
    font: 12px/1.7 ui-monospace, 'Cascadia Code', monospace; color: #cfd8e6;
    white-space: pre; max-width: calc(100% - 3.1rem);
  }
  .needs {
    margin: 0.7rem 0 0 3.1rem; font: 0.72rem ui-monospace, monospace; color: var(--ink-faint);
  }
  @media (max-width: 600px) {
    .entry-head { grid-template-columns: 1.6rem 1fr; }
    .meta { grid-column: 2; gap: 0.8rem; margin-top: 0.2rem; }
    .blurb, .needs { padding-left: 0; margin-left: 0; max-width: 100%; }
    .cmd { margin-left: 0; max-width: 100%; }
  }

  .foot {
    display: flex; justify-content: space-between; padding: 2.5rem 0 0;
    color: var(--ink-faint); font: 0.8rem ui-monospace, monospace;
  }
  .foot a { color: var(--ink-faint); text-decoration: none; }
  .foot a:hover { color: var(--ink-dim); }
</style>
