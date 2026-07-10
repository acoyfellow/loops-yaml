import { Hono } from 'hono';
import { attachSvelteRoutes, svelteRenderer } from 'svelte-hono';
import { bundles } from './bundles.generated.js';
// @ts-expect-error -- esbuild-svelte emits a Svelte component module; types are not first-class here.
import App from './src/App.svelte';
// @ts-expect-error -- esbuild-svelte emits a Svelte component module; types are not first-class here.
import Recipes from './src/Recipes.svelte';
// @ts-expect-error -- esbuild-svelte emits a Svelte component module; types are not first-class here.
import Runtimes from './src/Runtimes.svelte';
// @ts-expect-error -- esbuild-svelte emits a Svelte component module; types are not first-class here.
import Share from './src/Share.svelte';
import { headMeta } from './src/head';

type Env = { ASSETS: { fetch: (req: Request) => Promise<Response> } };

const app = new Hono<{ Bindings: Env }>();
attachSvelteRoutes(app, { bundles });

app.get(
  '/',
  svelteRenderer(App, {
    hydrateAs: 'app',
    title: 'loops.yaml — a small scheduler for commands and Pi prompts',
    head: headMeta({
      path: '/',
      title: 'loops.yaml — a small scheduler for commands and Pi prompts',
      description:
        'Try the live demo, install the shell scheduler or Pi recurring-prompt extension, and read the complete source on GitHub.',
    }),
    props: {},
  }),
);

app.get(
  '/runtimes',
  svelteRenderer(Runtimes, {
    hydrateAs: 'runtimes',
    title: 'loops.yaml runtimes — every place a loop can run',
    head: headMeta({
      path: '/runtimes',
      title: 'loops.yaml runtimes — every place a loop can run',
      description:
        'Run loops as a shell scheduler or as recurring prompts inside Pi and OpenCode today, with more coding agents on the roadmap.',
    }),
    props: {},
  }),
);

app.get(
  '/recipes',
  svelteRenderer(Recipes, {
    hydrateAs: 'recipes',
    title: 'loops.yaml recipes — working commands you can inspect',
    head: headMeta({
      path: '/recipes',
      title: 'loops.yaml recipes — working commands you can inspect',
      description:
        'Copy a readable loop for backups, health checks, Cloudflare automation, or watchers. Run it on demand before adding a schedule.',
    }),
    props: {},
  }),
);

app.get(
  '/share',
  svelteRenderer(Share, {
    hydrateAs: 'share',
    title: 'loops.yaml',
    props: {},
  }),
);

// Static assets (the painted color field, etc.) served from ./public via the
// ASSETS binding. Any route the Svelte renderer didn't claim falls through here.
app.get('*', (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
