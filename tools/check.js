// Site health check. Run before publishing:
//   python3 tools/serve.py &   then   node tools/check.js
// Loads every page at desktop and phone width and reports: console errors,
// broken links/assets, sideways scrolling, heading/alt/title problems.
const { chromium } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:8080';
const PAGES = ['/', '/about', '/sales-rules-v2', '/mp-v2', '/srx', '/healthian', '/404'];
const WIDTHS = [1440, 390];

(async () => {
  const browser = await chromium.launch();
  const problems = [];
  const titles = new Map();
  const links = new Set();

  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    for (const path of PAGES) {
      const page = await ctx.newPage();
      const where = `${path} @${width}`;
      page.on('pageerror', e => problems.push(`${where}: JS error: ${e.message}`));
      page.on('console', m => { if (m.type() === 'error') problems.push(`${where}: console: ${m.text()}`); });
      page.on('response', r => {
        if (r.status() >= 400 && r.url().startsWith(BASE) && !r.url().endsWith('/404')) problems.push(`${where}: ${r.status()} ${r.url()}`);
      });
      await page.goto(BASE + path, { waitUntil: 'load' });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); }
      });
      await page.waitForLoadState('networkidle').catch(() => {});

      const r = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        h1: document.querySelectorAll('h1').length,
        title: document.title,
        noAlt: [...document.querySelectorAll('img:not([alt])')].map(i => i.src),
        noSize: [...document.querySelectorAll('main img:not([width]):not(.shape), main video:not([width]):not([poster])')].map(i => i.src || i.currentSrc),
        broken: [...document.images].filter(i => i.getAttribute('src') && i.complete && i.naturalWidth === 0).map(i => i.src),
        links: [...document.querySelectorAll('a[href]')].map(a => a.href),
      }));
      if (r.overflow > 0) problems.push(`${where}: page scrolls sideways by ${r.overflow}px`);
      if (r.h1 !== 1) problems.push(`${where}: ${r.h1} <h1> elements (want 1)`);
      r.noAlt.forEach(s => problems.push(`${where}: image without alt: ${s}`));
      r.noSize.forEach(s => problems.push(`${where}: media without width/height: ${s}`));
      r.broken.forEach(s => problems.push(`${where}: image failed to load: ${s}`));
      if (width === WIDTHS[0]) {
        if (titles.has(r.title)) problems.push(`${path}: same <title> as ${titles.get(r.title)}`);
        titles.set(r.title, path);
      }
      r.links.forEach(l => links.add(l));
      await page.close();
    }
    await ctx.close();
  }

  // Internal links must resolve (external ones are only listed).
  const external = [];
  for (const link of links) {
    const url = new URL(link);
    if (url.origin === new URL(BASE).origin) {
      const res = await fetch(url.origin + url.pathname);
      if (res.status >= 400) problems.push(`broken internal link: ${url.pathname}`);
    } else if (url.protocol.startsWith('http')) external.push(link);
  }

  await browser.close();
  console.log(`External links (not checked): ${[...new Set(external)].join(', ')}`);
  if (problems.length) {
    console.log(`\n${problems.length} problem(s):\n- ` + [...new Set(problems)].join('\n- '));
    process.exit(1);
  }
  console.log('\nAll checks passed.');
})();
