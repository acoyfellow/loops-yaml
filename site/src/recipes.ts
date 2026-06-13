// A grounded collection of smol loops. The point: a loop is just a schedule +
// a command — the leverage is in the command. VPS + agent + Cloudflare = a lot
// of capability from very few moving parts. Every recipe here is real and runs
// today with common tools (curl, git, wrangler, rsync, sqlite3, ffmpeg, jq).

export interface Recipe {
  id: string;
  title: string;
  blurb: string;
  category: Category;
  needs: string[]; // tools the command leans on
  schedule: string; // cron, or '' for on-demand
  run: string; // the command
}

export type Category =
  | 'backup'
  | 'watch'
  | 'cloudflare'
  | 'health'
  | 'notify'
  | 'chores'
  | 'data';

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'backup', label: 'Backup' },
  { id: 'watch', label: 'Watch' },
  { id: 'cloudflare', label: 'Cloudflare' },
  { id: 'health', label: 'Health' },
  { id: 'notify', label: 'Notify' },
  { id: 'chores', label: 'Chores' },
  { id: 'data', label: 'Data' },
];

export const RECIPES: Recipe[] = [
  {
    id: 'sqlite-backup-r2',
    title: 'Nightly SQLite → R2',
    blurb: 'Snapshot a SQLite DB and push it to an R2 bucket. Offsite backup in two lines.',
    category: 'backup',
    needs: ['sqlite3', 'wrangler'],
    schedule: '0 3 * * *',
    run: `sqlite3 app.db ".backup /tmp/app-$(date +%F).db" && \\
  wrangler r2 object put backups/app-$(date +%F).db --file /tmp/app-$(date +%F).db`,
  },
  {
    id: 'dir-to-r2',
    title: 'Mirror a folder to R2',
    blurb: 'Rsync-style upload of a working directory to R2 so a wiped VPS costs you nothing.',
    category: 'backup',
    needs: ['tar', 'wrangler'],
    schedule: '0 */6 * * *',
    run: `tar czf /tmp/site.tgz ./site && \\
  wrangler r2 object put backups/site-$(date +%FT%H).tgz --file /tmp/site.tgz`,
  },
  {
    id: 'pg-dump-r2',
    title: 'Postgres dump to R2',
    blurb: 'Compressed pg_dump straight into object storage. Keep the last 7 by date in the key.',
    category: 'backup',
    needs: ['pg_dump', 'gzip', 'wrangler'],
    schedule: '30 2 * * *',
    run: `pg_dump "$DATABASE_URL" | gzip | \\
  wrangler r2 object put db/pg-$(date +%F).sql.gz --pipe`,
  },
  {
    id: 'cert-expiry',
    title: 'TLS cert expiry check',
    blurb: 'Alert before a certificate expires. Catches the outage everyone forgets about.',
    category: 'health',
    needs: ['openssl', 'curl'],
    schedule: '0 9 * * *',
    run: `END=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null \\
  | openssl x509 -noout -enddate | cut -d= -f2); \\
  echo "cert for $DOMAIN expires $END"`,
  },
  {
    id: 'http-uptime',
    title: 'Endpoint heartbeat',
    blurb: 'Hit a URL, fail loud on non-200. The whole monitoring stack you need on day one.',
    category: 'health',
    needs: ['curl'],
    schedule: '*/5 * * * *',
    run: `curl -fsS -o /dev/null -w "%{http_code}" https://example.com/health \\
  || echo "DOWN at $(date)"`,
  },
  {
    id: 'disk-watch',
    title: 'Disk space guard',
    blurb: 'Warn when the VPS disk crosses 85%. Cheap insurance against a full-disk 500.',
    category: 'health',
    needs: ['df', 'awk'],
    schedule: '*/30 * * * *',
    run: `df -P / | awk 'NR==2 && $5+0 > 85 {print "disk " $5 " on " $6}'`,
  },
  {
    id: 'purge-cache',
    title: 'Purge Cloudflare cache',
    blurb: 'Bust the cache on deploy or schedule. One API call, no dashboard clicking.',
    category: 'cloudflare',
    needs: ['curl'],
    schedule: '',
    run: `curl -fsS -X POST \\
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \\
  -H "Authorization: Bearer $CF_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{"purge_everything":true}'`,
  },
  {
    id: 'dynamic-dns',
    title: 'Dynamic DNS updater',
    blurb: 'Point a Cloudflare DNS record at your current IP. Self-hosted from a dynamic address.',
    category: 'cloudflare',
    needs: ['curl', 'jq'],
    schedule: '*/15 * * * *',
    run: `IP=$(curl -fsS https://api.ipify.org); \\
  curl -fsS -X PATCH \\
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \\
  -H "Authorization: Bearer $CF_API_TOKEN" \\
  --data "$(jq -n --arg ip "$IP" '{type:"A",content:$ip}')"`,
  },
  {
    id: 'deploy-worker',
    title: 'Scheduled Worker deploy',
    blurb: 'Pull latest, deploy a Worker. A one-box CD pipeline with no CI service.',
    category: 'cloudflare',
    needs: ['git', 'wrangler'],
    schedule: '',
    run: `git -C ./app pull --ff-only && \\
  cd ./app && wrangler deploy`,
  },
  {
    id: 'workers-ai-summary',
    title: 'Summarize a log with Workers AI',
    blurb: 'Pipe the day’s log through a model and get a plain-English summary. Your agent in cron.',
    category: 'cloudflare',
    needs: ['curl', 'jq'],
    schedule: '0 18 * * *',
    run: `TAIL=$(tail -c 6000 app.log | jq -Rs .); \\
  curl -fsS "https://api.cloudflare.com/client/v4/accounts/$ACCT/ai/run/@cf/meta/llama-3.1-8b-instruct" \\
  -H "Authorization: Bearer $CF_API_TOKEN" \\
  --data "{\\"prompt\\":\\"Summarize today's errors: \\"$TAIL}"`,
  },
  {
    id: 'rss-to-chat',
    title: 'RSS → webhook digest',
    blurb: 'Fetch a feed, post new items to a chat webhook. Stay current without opening a tab.',
    category: 'notify',
    needs: ['curl', 'jq'],
    schedule: '0 8 * * 1-5',
    run: `curl -fsS https://example.com/feed.json \\
  | jq -r '.items[0:5][] | "• \\(.title) — \\(.url)"' \\
  | curl -fsS "$CHAT_WEBHOOK" --data-binary @-`,
  },
  {
    id: 'price-watch',
    title: 'Watch a page for change',
    blurb: 'Hash a page, ping you when it changes. Price drops, stock, job posts — anything.',
    category: 'watch',
    needs: ['curl', 'sha1sum'],
    schedule: '0 */2 * * *',
    run: `NEW=$(curl -fsS https://example.com/item | sha1sum | cut -c1-12); \\
  OLD=$(cat .item-hash 2>/dev/null); \\
  [ "$NEW" != "$OLD" ] && echo "changed" && echo "$NEW" > .item-hash`,
  },
  {
    id: 'gh-releases',
    title: 'Watch a repo for releases',
    blurb: 'Poll a GitHub repo’s latest release; notify on a new tag. No webhooks to host.',
    category: 'watch',
    needs: ['curl', 'jq'],
    schedule: '0 * * * *',
    run: `TAG=$(curl -fsS https://api.github.com/repos/$REPO/releases/latest | jq -r .tag_name); \\
  [ "$TAG" != "$(cat .last-tag 2>/dev/null)" ] && \\
  echo "new release $TAG" && echo "$TAG" > .last-tag`,
  },
  {
    id: 'log-rotate',
    title: 'Trim runaway logs',
    blurb: 'Keep the last 5k lines of a log file. The unglamorous chore that prevents a 3am page.',
    category: 'chores',
    needs: ['tail', 'mv'],
    schedule: '0 4 * * *',
    run: `tail -n 5000 app.log > app.log.tmp && mv app.log.tmp app.log`,
  },
  {
    id: 'prune-tmp',
    title: 'Sweep old temp files',
    blurb: 'Delete files older than 7 days from a scratch dir. Boring, essential, two seconds.',
    category: 'chores',
    needs: ['find'],
    schedule: '0 5 * * *',
    run: `find /tmp/scratch -type f -mtime +7 -delete`,
  },
  {
    id: 'csv-to-d1',
    title: 'Load a CSV into D1',
    blurb: 'Pull a CSV and import it into a D1 table. A nightly ETL in one command.',
    category: 'data',
    needs: ['curl', 'wrangler'],
    schedule: '0 1 * * *',
    run: `curl -fsS https://example.com/export.csv -o /tmp/in.csv && \\
  wrangler d1 execute mydb --command \\
  ".import /tmp/in.csv records"`,
  },
  {
    id: 'json-snapshot',
    title: 'Snapshot an API to JSON',
    blurb: 'Save a daily copy of an API response. Cheap history you can diff later.',
    category: 'data',
    needs: ['curl', 'jq'],
    schedule: '0 0 * * *',
    run: `curl -fsS https://api.example.com/stats \\
  | jq . > snapshots/stats-$(date +%F).json`,
  },
  {
    id: 'thumbnails',
    title: 'Batch-make thumbnails',
    blurb: 'Resize every new image in a folder. ffmpeg/ImageMagick + cron beats a SaaS.',
    category: 'chores',
    needs: ['ImageMagick'],
    schedule: '*/10 * * * *',
    run: `for f in inbox/*.jpg; do \\
  [ -f "thumbs/$(basename "$f")" ] || convert "$f" -resize 400x "thumbs/$(basename "$f")"; \\
  done`,
  },
];
