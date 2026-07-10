<script lang="ts">
  const shellInstall = 'bun add -g github:acoyfellow/loops-yaml';
  const piInstall = 'pi install git:github.com/acoyfellow/loops-yaml';
  const piLoop = '/loop every 30s check MR !38955; stop when it merges';
  const opencodeInstall =
    '{ "plugin": ["/ABSOLUTE/PATH/TO/loops-yaml/extensions/opencode/index.ts"] }';
  const opencodeLoop = 'every 30s check MR !38955; stop when it merges';

  let copied = '';
  const copy = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    copied = label;
    window.setTimeout(() => {
      if (copied === label) copied = '';
    }, 1600);
  };

  // Candidate agents we could add a recurring-prompt extension for. Grouped by
  // the integration surface that would carry the loop. These are candidates,
  // not commitments — the shell scheduler below already works with every one
  // of them today, because it only needs a command and an exit code.
  type Candidate = { name: string; note: string };
  const terminalAgents: Candidate[] = [
    { name: 'Claude Code', note: 'hooks + slash commands + MCP' },
    { name: 'Gemini CLI', note: 'open-source terminal agent, extensions' },
    { name: 'Codex CLI', note: 'open-source terminal agent' },
    { name: 'Goose', note: 'Block’s agent, first-class extensions' },
    { name: 'Crush', note: 'Charm’s terminal agent' },
    { name: 'Aider', note: 'Python pair-programmer, scriptable' },
    { name: 'Amp', note: 'Sourcegraph agentic CLI' },
    { name: 'Warp', note: 'agentic terminal, workflows' },
  ];
  const editorAgents: Candidate[] = [
    { name: 'Cline', note: 'VS Code agent extension' },
    { name: 'Roo Code', note: 'Cline fork, extensible' },
    { name: 'Continue', note: 'open-source IDE assistant' },
    { name: 'Cursor', note: 'rules + background agents' },
    { name: 'Windsurf', note: 'Cascade agent' },
    { name: 'Zed', note: 'editor agent panel' },
    { name: 'Kilo Code', note: 'VS Code agent' },
    { name: 'Copilot', note: 'CLI + coding agent' },
  ];
  const hostedAgents: Candidate[] = [
    { name: 'OpenHands', note: 'open-source autonomous agent' },
    { name: 'Devin', note: 'hosted agent' },
    { name: 'Junie', note: 'JetBrains agent' },
  ];
</script>

<div class="page">
  <header class="topbar">
    <a class="brand" href="/" aria-label="loops.yaml home">
      <span class="mark" aria-hidden="true"></span>
      <span class="wordmark">loops<span class="ext">.yaml</span></span>
    </a>
    <nav aria-label="Primary navigation">
      <a href="/">Overview</a>
      <a href="/recipes">Recipes</a>
      <a class="source-link" href="https://github.com/acoyfellow/loops-yaml">Source <span aria-hidden="true">↗</span></a>
    </nav>
  </header>

  <main class="wrap">
    <section class="intro">
      <p class="kicker">Where loops run</p>
      <h1>One idea.<br /><em>Every runtime.</em></h1>
      <p class="lede">
        A loop is an interval and a thing to do. That works the same whether the “thing” is a
        shell command on a schedule or a prompt to a coding agent while you work. Below are the
        runtimes that ship today, and the ones we want next.
      </p>
    </section>

    <section class="tier">
      <div class="tier-head">
        <h2>Available now</h2>
        <p>Installed from the public repository. Nothing hosted, no account required.</p>
      </div>

      <div class="install-grid">
        <article class="install-card">
          <div class="card-head"><span class="mode-label">Shell commands</span><span class="availability on">Stable</span></div>
          <h3>Schedule a command.</h3>
          <p>Install the CLI, add a <code>loops.yaml</code>, then run it once or keep the watcher open. Works with any command that has an exit code.</p>
          <div class="copy-row">
            <code>{shellInstall}</code>
            <button on:click={() => copy('shell', shellInstall)} aria-label="Copy shell install command">{copied === 'shell' ? 'Copied' : 'Copy'}</button>
          </div>
          <a href="https://github.com/acoyfellow/loops-yaml#install">Shell quickstart ↗</a>
        </article>

        <article class="install-card agent-card">
          <div class="card-head"><span class="mode-label orange">Pi</span><span class="availability on">Stable</span></div>
          <h3>Recurring prompts in Pi.</h3>
          <p>Install the Pi package, reload the session, then describe the interval and the condition that ends the loop.</p>
          <div class="copy-row">
            <code>{piInstall}</code>
            <button on:click={() => copy('pi-install', piInstall)} aria-label="Copy Pi install command">{copied === 'pi-install' ? 'Copied' : 'Copy'}</button>
          </div>
          <div class="copy-row subdued">
            <code>{piLoop}</code>
            <button on:click={() => copy('pi-loop', piLoop)} aria-label="Copy Pi loop example">{copied === 'pi-loop' ? 'Copied' : 'Copy'}</button>
          </div>
          <p class="fine-print">5-second minimum · idle-only execution · 24-hour expiry · 100-run safety cap</p>
        </article>

        <article class="install-card agent-card">
          <div class="card-head"><span class="mode-label">OpenCode</span><span class="availability on">Stable</span></div>
          <h3>Same loops, in OpenCode.</h3>
          <p>Point OpenCode at the plugin in <code>opencode.json</code>, restart, then describe the interval and the condition that ends the loop.</p>
          <div class="copy-row">
            <code>{opencodeInstall}</code>
            <button on:click={() => copy('oc-install', opencodeInstall)} aria-label="Copy OpenCode plugin config">{copied === 'oc-install' ? 'Copied' : 'Copy'}</button>
          </div>
          <div class="copy-row subdued">
            <code>{opencodeLoop}</code>
            <button on:click={() => copy('oc-loop', opencodeLoop)} aria-label="Copy OpenCode loop example">{copied === 'oc-loop' ? 'Copied' : 'Copy'}</button>
          </div>
          <a href="https://github.com/acoyfellow/loops-yaml/blob/main/docs/opencode.md">OpenCode setup ↗</a>
        </article>
      </div>
    </section>

    <section class="tier">
      <div class="tier-head">
        <h2>Candidates</h2>
        <p>
          Agents we’d like a native recurring-prompt extension for. Each one exposes a plugin or
          hook surface a loop could plug into. Want one sooner? <a href="https://github.com/acoyfellow/loops-yaml/issues">Open an issue.</a>
        </p>
      </div>

      <div class="cand-group">
        <p class="group-label">Terminal agents</p>
        <ul class="cand-list">
          {#each terminalAgents as a}
            <li><span class="cand-name">{a.name}</span><span class="cand-note">{a.note}</span></li>
          {/each}
        </ul>
      </div>

      <div class="cand-group">
        <p class="group-label">Editor agents</p>
        <ul class="cand-list">
          {#each editorAgents as a}
            <li><span class="cand-name">{a.name}</span><span class="cand-note">{a.note}</span></li>
          {/each}
        </ul>
      </div>

      <div class="cand-group">
        <p class="group-label">Hosted &amp; IDE agents</p>
        <ul class="cand-list">
          {#each hostedAgents as a}
            <li><span class="cand-name">{a.name}</span><span class="cand-note">{a.note}</span></li>
          {/each}
        </ul>
      </div>
    </section>

    <section class="works-now">
      <p class="mono-label">Already works with all of them</p>
      <p>
        You don’t have to wait for a native extension. The shell scheduler runs any command, so
        it already drives every agent above through its own CLI — a native extension just makes
        the loop <em>session-aware</em> (idle-only, stop conditions) instead of a blunt cron tick.
      </p>
      <a class="text-link" href="/#how">See how the two modes differ →</a>
    </section>
  </main>

  <footer class="footer wrap">
    <span>loops.yaml · MIT</span>
    <a href="/">Overview ↗</a>
    <a href="https://github.com/acoyfellow/loops-yaml">GitHub ↗</a>
  </footer>
</div>

<style>
  :global(:root) {
    --bg: #0b1626; --bg-deep: #07111e; --layer: #0f1f33; --layer-2: #132942;
    --line: #24364d; --line-strong: #38516e; --ink: #f1f4f7; --ink-dim: #a6b1c0;
    --ink-faint: #68778d; --accent: #f6821f; --blue: #9ccfe2; --radius: 14px;
  }
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

  .intro { padding-block: clamp(3.5rem, 8vw, 6rem) 2rem; }
  .kicker { margin: 0 0 1rem; color: var(--accent); font: 600 .64rem/1.2 ui-monospace, monospace; text-transform: uppercase; letter-spacing: .09em; }
  h1 { margin: 0 0 1.4rem; font-size: clamp(2.6rem, 6vw, 4.4rem); line-height: .98; letter-spacing: -.06em; font-weight: 720; }
  h1 em { color: var(--blue); font-style: normal; font-weight: 520; }
  .lede { max-width: 62ch; margin: 0; color: var(--ink-dim); font-size: clamp(1rem, 1.8vw, 1.12rem); line-height: 1.7; }

  .tier { padding-block: 2.5rem; border-top: 1px solid var(--line); }
  .tier-head { margin-bottom: 2rem; }
  .tier-head h2 { margin: 0 0 .5rem; font-size: clamp(1.4rem, 3vw, 2rem); letter-spacing: -.04em; }
  .tier-head p { margin: 0; max-width: 60ch; color: var(--ink-dim); font-size: .9rem; }
  .tier-head a { color: var(--blue); text-decoration: none; }

  .mono-label, .mode-label, .availability { font: 600 .64rem/1.2 ui-monospace, monospace; text-transform: uppercase; letter-spacing: .09em; }
  .install-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .install-card { padding: 1.5rem; border: 1px solid var(--line); border-radius: var(--radius); background: var(--layer); }
  .agent-card { background: linear-gradient(135deg, var(--layer), var(--layer-2)); border-color: #305174; }
  .card-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 2.2rem; }
  .mode-label { margin: 0; color: var(--blue); }
  .mode-label.orange { color: var(--accent); }
  .availability { color: var(--ink-faint); font-size: .55rem; }
  .availability.on { color: #48c78e; }
  .install-card h3 { margin: 0; font-size: 1.2rem; letter-spacing: -.03em; }
  .install-card > p { min-height: 4.4rem; margin: .5rem 0 0; color: var(--ink-dim); font-size: .85rem; }
  .install-card code { color: var(--ink); }
  .copy-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; margin-top: 1rem; overflow: hidden; border: 1px solid var(--line); border-radius: 8px; background: var(--bg-deep); }
  .copy-row.subdued { margin-top: .55rem; }
  .copy-row code { min-width: 0; overflow-x: auto; padding: .75rem; color: var(--ink); font: 11.5px/1.4 ui-monospace, monospace; white-space: nowrap; }
  .copy-row button { border: 0; border-left: 1px solid var(--line); padding: 0 .8rem; background: transparent; color: var(--ink-dim); cursor: pointer; font: 600 .62rem ui-monospace, monospace; }
  .copy-row button:hover { color: var(--ink); background: var(--layer); }
  .install-card > a { display: inline-block; margin-top: 1rem; color: var(--blue); text-decoration: none; font: 600 .7rem ui-monospace, monospace; }
  .fine-print { min-height: 0 !important; margin: 1rem 0 0; color: var(--ink-faint) !important; font: .65rem ui-monospace, monospace; }

  .cand-group { margin-bottom: 1.8rem; }
  .group-label { margin: 0 0 .8rem; color: var(--ink-faint); font: 600 .62rem/1.2 ui-monospace, monospace; text-transform: uppercase; letter-spacing: .09em; }
  .cand-list { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; margin: 0; padding: 0; list-style: none; overflow: hidden; border: 1px solid var(--line); border-radius: var(--radius); background: var(--line); }
  .cand-list li { display: flex; flex-direction: column; gap: .35rem; padding: 1rem 1.1rem; background: var(--layer); }
  .cand-name { font-weight: 620; letter-spacing: -.01em; }
  .cand-note { color: var(--ink-faint); font: .68rem/1.4 ui-monospace, monospace; }

  .works-now { margin-top: 1rem; padding: 1.8rem; border: 1px solid var(--line); border-radius: var(--radius); background: var(--bg-deep); }
  .works-now .mono-label { color: var(--accent); }
  .works-now p:not(.mono-label) { max-width: 70ch; margin: .8rem 0 0; color: var(--ink-dim); font-size: .9rem; }
  .works-now em { color: var(--blue); font-style: normal; }
  .text-link { display: inline-block; margin-top: 1rem; color: var(--blue); text-decoration: none; font: 600 .7rem ui-monospace, monospace; }

  .footer { display: flex; justify-content: space-between; gap: 1rem; padding-block: 3rem 4rem; margin-top: 3rem; border-top: 1px solid var(--line); color: var(--ink-faint); font: 500 .62rem ui-monospace, monospace; }
  .footer a { color: var(--ink-dim); text-decoration: none; }

  @media (max-width: 820px) {
    .topbar { padding-inline: 1rem; }
    .install-grid { grid-template-columns: 1fr; }
    .cand-list { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .wrap { width: min(100% - 2rem, 1040px); }
    .cand-list { grid-template-columns: 1fr; }
    .footer { flex-direction: column; }
  }
</style>
