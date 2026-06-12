/**
 * Deploy the loops-yaml demo site to loops-yaml.coey.dev.
 *
 * The svelte-hono build emits ./build/worker.js (SSR + hydration in one Worker).
 * alchemy wraps it and attaches the custom domain on the prod stage. zoneId is
 * inferred from the hostname against the authenticated account.
 *
 * Required env: CLOUDFLARE_API_TOKEN (Workers Scripts:Edit + Zone:Edit for coey.dev),
 *               CLOUDFLARE_ACCOUNT_ID
 * Optional env: STAGE (default "prod"), SITE_HOSTNAME
 */
import alchemy from 'alchemy';
import { CustomDomain, Worker } from 'alchemy/cloudflare';

const STAGE = process.env.STAGE ?? 'prod';
const HOSTNAME = process.env.SITE_HOSTNAME ?? 'loops-yaml.coey.dev';

const app = await alchemy('loops-yaml-site', { stage: STAGE });

const worker = await Worker(`loops-yaml-site-${STAGE}`, {
  entrypoint: './build/worker.bundled.mjs',
  compatibilityDate: '2026-04-23',
  compatibility: 'node',
  // No public workers.dev URL; reachable only via the custom domain on prod.
  url: false,
  adopt: true,
});

if (STAGE === 'prod') {
  await CustomDomain('loops-yaml-domain', {
    name: HOSTNAME,
    workerName: worker.name,
    adopt: true,
  });
}

console.log(worker.url);
if (STAGE === 'prod') console.log(`https://${HOSTNAME}`);

await app.finalize();
