<script lang="ts">
  // A 1200x630 share/OG card rendered as a real page so the type stays crisp.
  // Screenshot /share at 1200x630, save as og.jpg.
  import Fiber from './Fiber.svelte';
</script>

<div class="card">
  <Fiber />
  <div class="inner">
    <div class="top">
      <span class="mark" aria-hidden="true"></span>
      <span class="wordmark">loops<span class="ext">.yaml</span></span>
    </div>
    <h1>A loop is a schedule<br />plus a command.</h1>
    <p class="sub">Run anything on a cron schedule, or on demand.</p>
    <code class="cmd">$ bun add -g github:acoyfellow/loops-yaml</code>
  </div>
</div>

<style>
  :global(html, body) { margin: 0; background: #0b1626; }
  .card {
    position: relative; width: 1200px; height: 630px; overflow: hidden;
    background: #0b1626; color: #eef1f5;
    font: 16px ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .inner { position: relative; z-index: 1; padding: 84px 90px; height: 100%; box-sizing: border-box;
    display: flex; flex-direction: column; }
  .top { display: flex; align-items: center; gap: 12px; }
  .mark {
    width: 20px; height: 20px; border-radius: 50%;
    border: 3px solid #f6821f; box-shadow: 0 0 14px -2px #f6821f;
  }
  .wordmark { font-size: 20px; font-weight: 600; letter-spacing: -0.01em; }
  .ext { color: #5d6b80; font-weight: 400; }
  h1 {
    margin: auto 0 0; font-size: 76px; line-height: 1.02; letter-spacing: -0.04em; font-weight: 600;
  }
  .sub { margin: 22px 0 0; font-size: 24px; color: #97a3b6; }
  .cmd {
    margin-top: 30px; align-self: flex-start;
    background: #0f1f33; border: 1px solid #1e2c40; border-radius: 12px;
    padding: 14px 20px; font: 18px ui-monospace, 'Cascadia Code', monospace; color: #eef1f5;
  }
</style>
