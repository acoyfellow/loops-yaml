<script lang="ts">
  import Fiber from './Fiber.svelte';

  const shellInstall = 'bun add -g github:acoyfellow/loops-yaml';
  const yaml = `loops:
  review:
    schedule: "0 8 * * *"   # omit for on-demand only
    run: ./scripts/review.sh`;

  const commands: Array<[string, string]> = [
    ['loops list', 'see every loop and its latest run'],
    ['loops run review', 'run one command now'],
    ['loops watch', 'keep scheduled commands running'],
    ['loops logs review', 'read the latest output'],
  ];

  let copied = '';
  const copy = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    copied = label;
    window.setTimeout(() => {
      if (copied === label) copied = '';
    }, 1600);
  };
</script>

<svelte:head>
  <meta name="theme-color" content="#0b1626" />
</svelte:head>

<div class="page">
  <header class="topbar">
    <a class="brand" href="/" aria-label="loops.yaml home">
      <span class="mark" aria-hidden="true"></span>
      <span class="wordmark">loops<span class="ext">.yaml</span></span>
    </a>
    <nav aria-label="Primary navigation">
      <a href="#how">How it works</a>
      <a href="/runtimes">Runtimes</a>
      <a href="/recipes">Recipes</a>
      <a class="source-link" href="https://github.com/acoyfellow/loops-yaml">Source <span aria-hidden="true">↗</span></a>
    </nav>
  </header>

  <main>
    <section class="hero">
      <div class="wash" aria-hidden="true"></div>
      <Fiber />
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="wrap hero-inner">
        <div class="hero-copy">
          <p class="status"><i></i> Live demo deployment</p>
          <h1>Run it now.<br /><em>Run it again later.</em></h1>
          <p class="lede">
            loops.yaml is a small scheduler for shell commands and recurring Pi or OpenCode prompts.
            Define one loop, run it on demand, or leave it watching on a schedule.
          </p>
          <div class="hero-actions">
            <a class="button primary" href="#try">Try it now <span aria-hidden="true">↓</span></a>
            <a class="button secondary" href="https://github.com/acoyfellow/loops-yaml">Get the source <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div class="hero-meta" aria-label="Project details">
          <span><b>Runtime</b>Bun + Pi / OpenCode</span>
          <span><b>License</b>MIT</span>
          <span><b>Hosted on</b>Cloudflare Workers</span>
        </div>
      </div>
    </section>

    <section class="demo-note">
      <div class="wrap note-inner">
        <span class="mono-label">About this deployment</span>
        <p>
          This is the project’s public demo deployment and documentation. The scheduler itself
          runs wherever you install it; the complete implementation is in the source repository.
        </p>
        <a href="https://github.com/acoyfellow/loops-yaml">Browse the repository ↗</a>
      </div>
    </section>

    <section class="chapter wrap" id="how">
      <div class="chapter-head">
        <div>
          <p class="eyebrow">01 / What it is</p>
          <h2>One loop.<br />Two execution modes.</h2>
        </div>
        <p>
          The same idea works for unattended commands and active agent sessions: say what should
          happen, say when, and keep the execution visible.
        </p>
      </div>
      <div class="mode-grid">
        <article>
          <span class="index">01</span>
          <p class="mode-label">Shell scheduler</p>
          <h3>Commands that run again.</h3>
          <p>Use a short YAML file for backups, health checks, deploys, and any command with an exit code.</p>
          <code>loops watch</code>
        </article>
        <article>
          <span class="index">02</span>
          <p class="mode-label">Agent extension</p>
          <h3>Recurring prompts while your agent is open.</h3>
          <p>Set an interval and a stop condition in Pi or OpenCode. The agent waits for idle time before it starts the next check.</p>
          <code>/loop every 30s …</code>
        </article>
        <article>
          <span class="index">03</span>
          <p class="mode-label">Run record</p>
          <h3>Logs and status stay visible.</h3>
          <p>Every shell run writes a timestamped log and latest status. Pi loops remain attached to their session.</p>
          <code>loops logs review</code>
        </article>
      </div>
    </section>

    <section class="canvas" style="background-image:url('/art/field-cream-blue-v2.jpg')">
      <div class="wrap canvas-inner">
        <div class="on-cream">
          <p class="eyebrow dark">02 / Define</p>
          <h2 class="field-title">Define the schedule in one readable file.</h2>
          <pre class="code">{yaml}</pre>
        </div>
        <div class="on-slate">
          <p class="eyebrow slate">03 / Run</p>
          <ul class="cmds">
            {#each commands as [cmd, what]}
              <li><code>{cmd}</code><span>{what}</span></li>
            {/each}
          </ul>
        </div>
      </div>
    </section>

    <section class="chapter try wrap" id="try">
      <div class="chapter-head">
        <div>
          <p class="eyebrow">04 / Try it now</p>
          <h2>Install it and go.</h2>
        </div>
        <p>Install the scheduler from the public repository — no hosted account required. Then run a loop on demand, or leave it watching.</p>
      </div>

      <div class="try-row">
        <div class="try-install">
          <span class="mono-label">Shell scheduler</span>
          <div class="copy-row">
            <code>{shellInstall}</code>
            <button on:click={() => copy('shell', shellInstall)} aria-label="Copy shell install command">{copied === 'shell' ? 'Copied' : 'Copy'}</button>
          </div>
          <a class="text-link" href="https://github.com/acoyfellow/loops-yaml#install">Shell quickstart ↗</a>
        </div>

        <a class="runtimes-teaser" href="/runtimes">
          <span class="mono-label">Prefer a coding agent?</span>
          <p>Run the same loops as recurring prompts inside <b>Pi</b> and <b>OpenCode</b> today — with more agents on the way.</p>
          <span class="teaser-cta">See all runtimes →</span>
        </a>
      </div>
    </section>

    <section class="principles wrap" aria-label="Project principles">
      <article><span>Small surface</span><strong>Four CLI commands.</strong><p>Enough interface to run, watch, list, and inspect.</p></article>
      <article><span>Plain state</span><strong>State stays in files.</strong><p>YAML definitions, timestamped logs, and JSON run state.</p></article>
      <article><span>Visible boundary</span><strong>Process-level access.</strong><p>Each loop uses the permissions of the process that starts it.</p></article>
    </section>

    <section class="source-cta wrap">
      <div>
        <p class="eyebrow orange">Source available</p>
        <h2>The complete project<br />is in the repository.</h2>
        <p>Review the implementation, tests, reference documentation, Pi and OpenCode extensions, and website source.</p>
      </div>
      <div class="source-actions">
        <a class="button primary" href="https://github.com/acoyfellow/loops-yaml">Open the source <span aria-hidden="true">↗</span></a>
        <a class="text-link" href="/recipes">Browse working recipes →</a>
      </div>
    </section>
  </main>

  <footer class="footer wrap">
    <span>loops.yaml · MIT</span>
    <span>Demo deployed on Cloudflare Workers</span>
    <a href="https://github.com/acoyfellow/loops-yaml">GitHub ↗</a>
  </footer>
</div>

<style>
  :global(:root) {
    --bg: #0b1626;
    --bg-deep: #07111e;
    --layer: #0f1f33;
    --layer-2: #132942;
    --line: #24364d;
    --line-strong: #38516e;
    --ink: #f1f4f7;
    --ink-dim: #a6b1c0;
    --ink-faint: #68778d;
    --accent: #f6821f;
    --blue: #9ccfe2;
    --radius: 14px;
  }
  :global(html) { scroll-behavior: smooth; }
  :global(html, body) { max-width: 100%; overflow-x: hidden; }
  :global(body) {
    margin: 0; background: var(--bg); color: var(--ink);
    font: 15px/1.65 Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  :global(*) { box-sizing: border-box; }
  .page { min-height: 100vh; }
  .wrap { width: min(100% - 3rem, 1040px); margin-inline: auto; }

  .topbar {
    position: sticky; top: 0; z-index: 20; height: 60px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 max(1.5rem, calc((100vw - 1040px) / 2));
    border-bottom: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
    background: color-mix(in srgb, var(--bg-deep) 88%, transparent);
    backdrop-filter: blur(18px);
  }
  .brand { display: flex; align-items: center; gap: 0.65rem; color: var(--ink); text-decoration: none; }
  .mark { width: 13px; height: 13px; border: 2px solid var(--accent); border-radius: 50%; box-shadow: 0 0 0 4px rgba(246,130,31,.1); }
  .wordmark { font-weight: 650; letter-spacing: -0.02em; }
  .ext { color: var(--ink-faint); font-weight: 450; }
  .topbar nav { display: flex; align-items: center; gap: 1.5rem; }
  .topbar nav a { color: var(--ink-dim); text-decoration: none; font: 600 0.7rem/1 ui-monospace, monospace; }
  .topbar nav a:hover { color: var(--ink); }
  .source-link { padding: 0.55rem 0.75rem; border: 1px solid var(--line); border-radius: 7px; }

  .hero { position: relative; min-height: 650px; overflow: hidden; isolation: isolate; border-bottom: 1px solid var(--line); }
  .hero :global(svg) { opacity: 0.8; }
  .wash { position: absolute; inset: 0 0 0 42%; z-index: -2; background: radial-gradient(circle at 70% 42%, #214d73, transparent 65%); opacity: .8; }
  .hero-grid { position: absolute; inset: 0; z-index: -1; background-image: linear-gradient(rgba(156,207,226,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(156,207,226,.06) 1px, transparent 1px); background-size: 64px 64px; mask-image: linear-gradient(90deg, #000, transparent 78%); }
  .hero-inner { position: relative; min-height: 650px; display: flex; align-items: flex-end; padding-block: 5rem 3rem; }
  .hero-copy { max-width: 670px; }
  .status { display: inline-flex; align-items: center; gap: .55rem; margin: 0; padding: .45rem .65rem; border: 1px solid var(--line); border-radius: 999px; color: var(--ink-dim); background: rgba(7,17,30,.55); font: 600 .66rem/1 ui-monospace, monospace; text-transform: uppercase; letter-spacing: .06em; }
  .status i { width: 7px; height: 7px; border-radius: 50%; background: #48c78e; box-shadow: 0 0 0 4px rgba(72,199,142,.12); }
  h1 { margin: 1.1rem 0 1rem; font-size: clamp(2.8rem, 7vw, 5.1rem); line-height: .98; letter-spacing: -.06em; font-weight: 720; }
  h1 em { color: var(--blue); font-style: normal; font-weight: 520; }
  .lede { max-width: 55ch; margin: 0; color: var(--ink-dim); font-size: clamp(1rem, 1.8vw, 1.15rem); line-height: 1.7; }
  .hero-actions { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 2rem; }
  .button { display: inline-flex; align-items: center; justify-content: center; gap: .65rem; min-height: 43px; padding: 0 1rem; border: 1px solid var(--line); border-radius: 8px; color: var(--ink); text-decoration: none; font: 650 .78rem/1 ui-monospace, monospace; transition: transform .15s, border-color .15s, background .15s; }
  .button:hover { transform: translateY(-1px); }
  .button.primary { border-color: var(--accent); background: var(--accent); color: #281000; }
  .button.secondary { background: rgba(15,31,51,.72); }
  .button.secondary:hover { border-color: var(--line-strong); }
  .hero-meta { position: absolute; right: 0; bottom: 3.1rem; display: grid; grid-template-columns: repeat(3, auto); gap: 1.5rem; }
  .hero-meta span { display: grid; gap: .25rem; color: var(--ink-dim); font: 500 .64rem/1.35 ui-monospace, monospace; }
  .hero-meta b { color: var(--ink-faint); font-size: .54rem; text-transform: uppercase; letter-spacing: .08em; }

  .demo-note { border-bottom: 1px solid var(--line); background: var(--bg-deep); }
  .note-inner { display: grid; grid-template-columns: 11rem 1fr auto; gap: 2rem; align-items: center; min-height: 92px; }
  .eyebrow, .mode-label { font: 600 .64rem/1.2 ui-monospace, monospace; text-transform: uppercase; letter-spacing: .09em; }
  .mono-label { color: var(--accent); }
  .note-inner p { margin: 0; color: var(--ink-dim); font-size: .82rem; }
  .note-inner a { color: var(--blue); text-decoration: none; font: 600 .7rem/1 ui-monospace, monospace; white-space: nowrap; }

  .chapter { padding-block: clamp(4.5rem, 9vw, 7rem); }
  .chapter-head { display: grid; grid-template-columns: 1.05fr .95fr; gap: 5rem; align-items: end; }
  .eyebrow { margin: 0 0 1rem; color: var(--ink-faint); }
  .eyebrow.orange, .mode-label.orange { color: var(--accent); }
  .chapter h2, .source-cta h2 { margin: 0; font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1.02; letter-spacing: -.05em; }
  .chapter-head > p { margin: 0; color: var(--ink-dim); line-height: 1.75; }
  .mode-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; margin-top: 3.5rem; overflow: hidden; border: 1px solid var(--line); border-radius: var(--radius); background: var(--line); }
  .mode-grid article { display: flex; min-height: 310px; flex-direction: column; padding: 1.6rem; background: var(--layer); }
  .index { color: var(--accent); font: 650 .65rem/1 ui-monospace, monospace; }
  .mode-label { margin: 3.6rem 0 .75rem; color: var(--blue); }
  .mode-grid h3 { margin: 0; font-size: 1.25rem; letter-spacing: -.03em; }
  .mode-grid p { color: var(--ink-dim); font-size: .85rem; }
  .mode-grid code { margin-top: auto; color: var(--ink); font: 12px ui-monospace, monospace; }

  .canvas { background-size: 100% 100%; background-repeat: no-repeat; }
  .canvas-inner { min-height: 690px; }
  .on-cream { padding: 4.5rem 0 8rem; color: #17253b; }
  .on-slate { padding: 5.8rem 0 4.5rem; color: #14233a; }
  .eyebrow.dark { color: #71685b; }
  .eyebrow.slate { color: #45556c; }
  .field-title { max-width: 14ch; margin: 0 0 2rem; font-size: clamp(1.65rem, 3vw, 2.5rem); line-height: 1.08; letter-spacing: -.04em; }
  .code { margin: 0; color: #243049; font: 13.5px/1.75 ui-monospace, monospace; }
  .cmds { margin: 0; padding: 0; list-style: none; }
  .cmds li { display: grid; grid-template-columns: 12rem 1fr; gap: 1.5rem; padding: .75rem 0; border-bottom: 1px solid rgba(11,22,38,.15); }
  .cmds code { color: #0b1626; font: 650 13px ui-monospace, monospace; }
  .cmds span { color: #2f4058; }

  .try { border-bottom: 1px solid var(--line); }
  .try-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 3.5rem; }
  .try-install { display: flex; flex-direction: column; padding: 1.5rem; border: 1px solid var(--line); border-radius: var(--radius); background: var(--layer); }
  .try-install .mono-label { color: var(--blue); }
  .runtimes-teaser { display: flex; flex-direction: column; padding: 1.5rem; border: 1px solid #305174; border-radius: var(--radius); background: linear-gradient(135deg, var(--layer), var(--layer-2)); text-decoration: none; color: var(--ink); transition: transform .15s, border-color .15s; }
  .runtimes-teaser:hover { transform: translateY(-1px); border-color: var(--line-strong); }
  .runtimes-teaser .mono-label { color: var(--accent); }
  .runtimes-teaser p { margin: .75rem 0 0; color: var(--ink-dim); font-size: .88rem; }
  .runtimes-teaser b { color: var(--ink); font-weight: 620; }
  .teaser-cta { margin-top: auto; padding-top: 1rem; color: var(--blue); font: 600 .72rem ui-monospace, monospace; }
  .mono-label { font: 600 .64rem/1.2 ui-monospace, monospace; text-transform: uppercase; letter-spacing: .09em; }
  .copy-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; margin-top: 1rem; overflow: hidden; border: 1px solid var(--line); border-radius: 8px; background: var(--bg-deep); }
  .copy-row code { min-width: 0; overflow-x: auto; padding: .75rem; color: var(--ink); font: 11.5px/1.4 ui-monospace, monospace; white-space: nowrap; }
  .copy-row button { border: 0; border-left: 1px solid var(--line); padding: 0 .8rem; background: transparent; color: var(--ink-dim); cursor: pointer; font: 600 .62rem ui-monospace, monospace; }
  .copy-row button:hover { color: var(--ink); background: var(--layer); }
  .try-install > a { margin-top: 1rem; color: var(--blue); text-decoration: none; font: 600 .7rem ui-monospace, monospace; }

  .principles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; margin-top: 1rem; overflow: hidden; border: 1px solid var(--line); border-radius: var(--radius); background: var(--line); }
  .principles article { padding: 1.4rem; background: var(--bg-deep); }
  .principles span { color: var(--accent); font: 600 .6rem ui-monospace, monospace; text-transform: uppercase; }
  .principles strong { display: block; margin-top: 2.5rem; font-size: 1rem; }
  .principles p { margin: .45rem 0 0; color: var(--ink-dim); font-size: .75rem; }

  .source-cta { display: grid; grid-template-columns: 1fr auto; gap: 3rem; align-items: end; margin-top: 5rem; padding-block: 3rem; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
  .source-cta h2 { font-size: clamp(1.8rem, 3.7vw, 2.8rem); }
  .source-cta p:not(.eyebrow) { max-width: 54ch; margin: 1rem 0 0; color: var(--ink-dim); }
  .source-actions { display: grid; justify-items: start; gap: 1rem; }
  .text-link { color: var(--blue); text-decoration: none; font: 600 .7rem ui-monospace, monospace; }

  .footer { display: flex; justify-content: space-between; gap: 1rem; padding-block: 2rem 4rem; color: var(--ink-faint); font: 500 .62rem ui-monospace, monospace; }
  .footer a { color: var(--ink-dim); text-decoration: none; }

  @media (max-width: 820px) {
    .topbar { padding-inline: 1rem; }
    .topbar nav a:first-child { display: none; }
    .hero { min-height: 610px; }
    .hero-inner { min-height: 610px; padding-bottom: 7rem; }
    .hero-meta { left: 0; right: auto; bottom: 2.2rem; }
    .note-inner { grid-template-columns: 1fr; gap: .5rem; padding-block: 1.2rem; }
    .chapter-head, .try-row, .source-cta { grid-template-columns: 1fr; gap: 1.5rem; }
    .mode-grid, .principles { grid-template-columns: 1fr; }
    .mode-grid article { min-height: 240px; }
    .mode-label { margin-top: 2.5rem; }
    .source-actions { margin-top: .5rem; }
  }

  @media (max-width: 560px) {
    .wrap { width: min(100% - 2rem, 1040px); }
    .topbar nav { gap: .8rem; }
    .topbar nav > a:not(.source-link) { display: none; }
    .hero { min-height: 650px; }
    .hero-inner { min-height: 650px; padding-top: 4rem; }
    h1 { font-size: 3rem; }
    .hero-meta { grid-template-columns: 1fr 1fr; gap: .8rem 1.5rem; }
    .hero-meta span:last-child { display: none; }
    .hero-actions { align-items: stretch; flex-direction: column; }
    .chapter { padding-block: 4rem; }
    .canvas-inner { min-height: 720px; }
    .on-cream { padding-top: 3.5rem; }
    .cmds li { grid-template-columns: 1fr; gap: .2rem; }
    .card-head { align-items: flex-start; flex-direction: column; gap: .5rem; }
    .copy-row { grid-template-columns: minmax(0, 1fr); }
    .copy-row button { min-height: 36px; border-left: 0; border-top: 1px solid var(--line); }
    .footer { flex-direction: column; }
  }
</style>
