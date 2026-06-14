<script lang="ts">
  import Fiber from './Fiber.svelte';

  const install = 'bun add -g github:acoyfellow/loops-yaml';
  const yaml = `loops:
  review:
    schedule: "0 8 * * *"   # 8am daily; omit for on-demand
    run: ./scripts/review.sh`;

  const commands: Array<[string, string]> = [
    ['loops list', 'every loop and its last run'],
    ['loops run review', 'run one now'],
    ['loops watch', 'run scheduled loops forever'],
    ['loops logs review', 'tail the last run'],
  ];
</script>

<div class="page">
  <!-- full-bleed hero band so the fiber spans the whole viewport width -->
  <section class="hero">
    <div class="wash" aria-hidden="true"></div>
    <Fiber />
    <div class="wrap hero-wrap">
      <header class="head">
        <div class="brand">
          <span class="mark" aria-hidden="true"></span>
          <span class="wordmark">loops<span class="ext">.yaml</span></span>
        </div>
        <nav class="nav">
          <a class="navlink" href="/recipes">Recipes</a>
          <a class="ghlink" href="https://github.com/acoyfellow/loops-yaml">GitHub ↗</a>
        </nav>
      </header>

      <div class="hero-copy">
        <h1>A loop is a schedule<br />plus a command.</h1>
        <p class="lede">Run commands on a cron schedule, or on demand. Nothing else to learn.</p>
        <div class="cta"><code>{install}</code></div>
      </div>
    </div>
  </section>

  <!-- one continuous painted color field spans BOTH sections; the cream→slate
       transition lives inside the image, so there is no seam or gap. -->
  <section class="canvas" style="background-image:url('/art/field-cream-blue-v2.jpg')">
    <div class="wrap canvas-inner">
      <div class="on-cream">
        <p class="kicker dark">define</p>
        <pre class="code">{yaml}</pre>
      </div>
      <div class="on-slate">
        <p class="kicker slate">run</p>
        <ul class="cmds">
          {#each commands as [cmd, what]}
            <li><code>{cmd}</code><span class="what">{what}</span></li>
          {/each}
        </ul>
      </div>
    </div>
  </section>

  <div class="wrap">
    <section class="scope">
      <p class="kicker">scope</p>
      <p class="prose">
        It runs your command on a timer. That's the whole tool. Whatever the command does —
        hit an API, back up a database, call a model — is up to <em>you</em>. We don't get in the way.
      </p>
    </section>

    <!-- funnel into recipes -->
    <a class="funnel" href="/recipes">
      <div class="funnel-copy">
        <p class="kicker accent">recipes</p>
        <p class="funnel-h">The command is where the leverage is.</p>
        <p class="funnel-sub">
          A VPS, a coding agent, and a Cloudflare token go a long way. Browse small,
          real loops — backups, health checks, dynamic DNS, watchers — and copy one in.
        </p>
      </div>
      <span class="funnel-go">See the recipes →</span>
    </a>

    <footer class="foot">
      <span>MIT</span>
      <a href="https://github.com/acoyfellow/loops-yaml">acoyfellow/loops-yaml</a>
    </footer>
  </div>
</div>

<style>
  :global(:root) {
    --bg: #0b1626;
    --line: #1e2c40;
    --ink: #eef1f5;
    --ink-dim: #97a3b6;
    --ink-faint: #5d6b80;
    --accent: #f6821f;
  }
  :global(html, body) { max-width: 100%; overflow-x: hidden; }
  :global(body) {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font: 16px/1.6 ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  *, *::before, *::after { box-sizing: border-box; }

  .page { width: 100%; overflow-x: clip; }
  .wrap { max-width: 880px; margin: 0 auto; padding: 0 1.5rem; }

  .head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.8rem 0;
  }
  .brand { display: flex; align-items: center; gap: 0.6rem; }
  .mark {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid var(--accent);
    box-shadow: inset 0 0 0 2px var(--bg), 0 0 10px -2px var(--accent);
  }
  .wordmark { font-weight: 600; letter-spacing: -0.01em; }
  .ext { color: var(--ink-faint); font-weight: 400; }
  .nav { display: flex; align-items: center; gap: 1.4rem; }
  .navlink { color: var(--ink-dim); text-decoration: none; font-size: 0.9rem; }
  .navlink:hover { color: var(--ink); }
  .ghlink { color: var(--ink-dim); text-decoration: none; font-size: 0.9rem; }
  .ghlink:hover { color: var(--ink); }

  /* hero — full-bleed band; fiber + wash span the viewport, copy stays in .wrap */
  .hero { position: relative; overflow: hidden; padding-bottom: 1rem; }
  .hero-wrap { position: relative; z-index: 1; padding-top: 0; padding-bottom: 5rem; }
  .wash {
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: min(60%, 720px);
    background: radial-gradient(120% 90% at 80% 40%, #1d3a5c 0%, rgba(29, 58, 92, 0) 70%);
    filter: blur(8px);
    opacity: 0.8;
    pointer-events: none;
  }
  .hero-copy { position: relative; z-index: 1; padding: 4rem 0 1rem; }
  h1 {
    font-size: clamp(2.1rem, 6vw, 3.6rem);
    line-height: 1.04; letter-spacing: -0.04em; margin: 0; font-weight: 600;
  }
  .lede { color: var(--ink-dim); font-size: 1.1rem; margin: 1.2rem 0 2rem; max-width: 32ch; }
  .cta code {
    display: inline-block; background: #0f1f33; border: 1px solid var(--line);
    border-radius: 10px; padding: 0.7rem 1rem;
    font: 13px ui-monospace, 'Cascadia Code', monospace; color: var(--ink);
    max-width: 100%; overflow-x: auto; white-space: nowrap;
  }
  .cta code::before { content: '$ '; color: var(--accent); }

  /* one painted color field behind both sections — no seam, no gap */
  .canvas {
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .canvas-inner { display: grid; }
  /* keep text clear of the torn deckle: cream content ends well above the tear,
     slate content starts well below it */
  .canvas-inner { min-height: 600px; }
  .on-cream { padding: 3.4rem 0 7rem; color: #1a2740; }
  .on-slate { padding: 5.5rem 0 4rem; color: #11203a; }
  .kicker.slate { color: #3a4a63; }

  .kicker {
    margin: 0 0 1rem;
    font: 600 0.72rem/1 ui-monospace, monospace;
    text-transform: uppercase; letter-spacing: 0.22em; color: var(--ink-faint);
  }
  .kicker.dark { color: #6a6256; }
  .code {
    margin: 0; overflow-x: auto;
    font: 13.5px/1.7 ui-monospace, 'Cascadia Code', monospace; color: #243049;
  }
  .cmds { list-style: none; margin: 0; padding: 0; }
  .cmds li {
    display: flex; gap: 1.2rem; align-items: baseline;
    padding: 0.55rem 0; border-bottom: 1px solid rgba(11, 22, 38, 0.16);
  }
  .cmds li:last-child { border-bottom: 0; }
  .cmds code { color: #0b1626; font: 600 13px ui-monospace, monospace; min-width: 11rem; }
  .what { color: #243049; opacity: 0.8; }

  .scope { padding: 3.5rem 0 1rem; }
  .prose { margin: 0; color: var(--ink-dim); max-width: 58ch; font-size: 1.05rem; }
  .prose em { color: var(--ink); font-style: normal; }

  .kicker.accent { color: var(--accent); }
  .funnel {
    display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem;
    margin: 3.5rem 0 1rem; padding: 1.8rem 1.9rem;
    background: #0f1f33; border: 1px solid var(--line); border-radius: 16px;
    text-decoration: none; color: var(--ink); transition: border-color 0.15s, transform 0.15s;
  }
  .funnel:hover { border-color: var(--accent); transform: translateY(-1px); }
  .funnel-h { margin: 0.5rem 0 0; font-size: 1.3rem; font-weight: 600; letter-spacing: -0.02em; }
  .funnel-sub { margin: 0.5rem 0 0; color: var(--ink-dim); font-size: 0.95rem; max-width: 52ch; }
  .funnel-go { color: var(--accent); font-weight: 600; white-space: nowrap; font-size: 0.95rem; }
  @media (max-width: 600px) {
    .funnel { flex-direction: column; align-items: flex-start; gap: 1rem; }
  }

  .foot {
    display: flex; justify-content: space-between;
    padding: 2.5rem 0 4rem; color: var(--ink-faint); font-size: 0.85rem;
  }
  .foot a { color: var(--ink-faint); text-decoration: none; }
  .foot a:hover { color: var(--ink-dim); }

  @media (max-width: 720px) {
    .hero { padding: 3rem 0 3.5rem; }
    .wash { width: 70%; opacity: 0.45; }
    .cmds code { min-width: 9rem; }
  }
</style>
