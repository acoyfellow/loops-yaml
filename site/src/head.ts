// Shared <head> meta for SEO + PWA, injected via svelteRenderer's `head` option.
const SITE = 'https://loops-yaml.coey.dev';
const OG = `${SITE}/og.jpg`;

export function headMeta(opts: {
  path: string;
  title: string;
  description: string;
}): string {
  const url = `${SITE}${opts.path}`;
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const d = esc(opts.description);
  const t = esc(opts.title);
  return [
    `<meta name="description" content="${d}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta name="theme-color" content="#0b1626">`,
    // Open Graph
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="loops.yaml">`,
    `<meta property="og:title" content="${t}">`,
    `<meta property="og:description" content="${d}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${OG}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="loops.yaml — a torn cream and blue color field">`,
    // Twitter
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${t}">`,
    `<meta name="twitter:description" content="${d}">`,
    `<meta name="twitter:image" content="${OG}">`,
    // Icons + PWA
    `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`,
    `<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`,
    `<link rel="manifest" href="/manifest.webmanifest">`,
    // structured data
    `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'loops.yaml',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'macOS, Linux',
      description: opts.description,
      url,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@type': 'Person', name: 'Jordan Coeyman', url: 'https://github.com/acoyfellow' },
    })}</script>`,
  ].join('\n');
}
