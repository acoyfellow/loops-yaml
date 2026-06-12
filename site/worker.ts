import { Hono } from 'hono';
import { attachSvelteRoutes, svelteRenderer } from 'svelte-hono';
import { bundles } from './bundles.generated.js';
// @ts-expect-error -- esbuild-svelte emits a Svelte component module; types are not first-class here.
import App from './src/App.svelte';

const app = new Hono();
attachSvelteRoutes(app, { bundles });

app.get(
  '/',
  svelteRenderer(App, {
    hydrateAs: 'app',
    title: 'loops.yaml — schedule a command, or run it on demand',
    props: {},
  }),
);

export default app;
