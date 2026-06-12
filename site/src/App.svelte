<script lang="ts">
  const install = 'bun add -g loops-yaml';
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

<main>
  <header>
    <h1>loops<span class="dim">.yaml</span></h1>
    <p class="tag">Run commands on a cron schedule, or on demand. A loop is a schedule plus a command — nothing else.</p>
  </header>

  <section>
    <h2>loops.yaml</h2>
    <pre>{yaml}</pre>
  </section>

  <section>
    <h2>use it</h2>
    <ul class="cmds">
      {#each commands as [cmd, what]}
        <li><code>{cmd}</code><span class="dim">{what}</span></li>
      {/each}
    </ul>
  </section>

  <section>
    <h2>install</h2>
    <pre>{install}</pre>
    <p class="dim">Requires Bun.</p>
  </section>

  <footer>
    <a href="https://github.com/acoyfellow/loops-yaml">github.com/acoyfellow/loops-yaml</a>
    <span class="dim">MIT</span>
  </footer>
</main>

<style>
  :global(body) {
    margin: 0;
    background: #0f1115;
    color: #f1f3f5;
    font: 16px/1.6 ui-sans-serif, system-ui, -apple-system, sans-serif;
  }
  main { max-width: 680px; margin: 0 auto; padding: 4rem 1.5rem; }
  h1 { font-size: 2.4rem; letter-spacing: -0.03em; margin: 0; }
  .dim { color: #8b93a1; }
  h1 .dim { font-weight: 400; }
  .tag { color: #a4abb8; margin: 0.6rem 0 0; }
  section { margin-top: 2.5rem; }
  h2 { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.12em; color: #6b7280; margin: 0 0 0.6rem; }
  pre {
    background: #171a21;
    border: 1px solid #2a2f3a;
    border-radius: 10px;
    padding: 1rem 1.2rem;
    overflow-x: auto;
    font: 13px/1.6 ui-monospace, monospace;
    color: #e6e9ee;
  }
  .cmds { list-style: none; margin: 0; padding: 0; }
  .cmds li { display: flex; gap: 1rem; align-items: baseline; padding: 0.35rem 0; border-bottom: 1px solid #1d212b; }
  .cmds code { color: #f6821f; font: 13px ui-monospace, monospace; min-width: 11rem; }
  footer { margin-top: 3.5rem; display: flex; justify-content: space-between; gap: 1rem; font-size: 0.85rem; }
  a { color: #f6821f; text-decoration: none; }
  a:hover { text-decoration: underline; }
</style>
