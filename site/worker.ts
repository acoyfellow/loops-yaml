import { Hono } from 'hono';
import { attachSvelteRoutes, svelteRenderer } from 'svelte-hono';
import { bundles } from './bundles.generated.js';
// @ts-expect-error -- esbuild-svelte emits a Svelte component module; types are not first-class here.
import App from './src/App.svelte';
// @ts-expect-error -- esbuild-svelte emits a Svelte component module; types are not first-class here.
import Recipes from './src/Recipes.svelte';
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
    title: 'loops.yaml — schedule a command, or run it on demand',
    head: headMeta({
      path: '/',
      title: 'loops.yaml — schedule a command, or run it on demand',
      description:
        'Run commands on a cron schedule, or on demand. A loop is a schedule plus a command — nothing else.',
    }),
    props: {},
  }),
);

app.get(
  '/recipes',
  svelteRenderer(Recipes, {
    hydrateAs: 'recipes',
    title: 'loops.yaml — recipes: small loops, real leverage',
    head: headMeta({
      path: '/recipes',
      title: 'loops.yaml recipes — small loops, real leverage',
      description:
        'A grounded collection of small, useful loops: backups, health checks, Cloudflare automation, watchers. VPS + agent + Cloudflare = freedom through simplicity.',
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
