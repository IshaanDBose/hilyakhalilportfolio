// Full-page screenshots of every page at three widths.
// Usage: node tools/screenshot.js <base-url> <out-dir> [--pages home,about] [--widths 1440,390]
//   node tools/screenshot.js https://www.hilya.me reference
//   node tools/screenshot.js http://localhost:8080 tools/out/local
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1].split(',') : null; };
const PAGES = (opt('--pages') || ['home', 'about', 'sales-rules-v2', 'mp-v2', 'srx', 'healthian']).map(p => p === 'home' ? '' : p);
const WIDTHS = (opt('--widths') || ['1440', '1100', '390']).map(Number);

(async () => {
  const [base, out] = args;
  if (!base || !out) { console.error('usage: node tools/screenshot.js <base-url> <out-dir>'); process.exit(1); }
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    for (const p of PAGES) {
      const name = `${p || 'home'}-${width}.png`;
      await page.goto(`${base.replace(/\/$/, '')}/${p}`, { waitUntil: 'load', timeout: 60000 });
      // Scroll through so lazy images/videos load, then return to top.
      await page.evaluate(async () => {
        // The Framer site puts mobile case studies in a fixed-height inner
        // scroll box; expand any such box so the full content is captured.
        for (const el of document.querySelectorAll('body *')) {
          const cs = getComputedStyle(el);
          if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 200) {
            el.style.height = 'auto'; el.style.maxHeight = 'none'; el.style.overflow = 'visible';
          }
        }
        for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
          window.scrollTo(0, y); await new Promise(r => setTimeout(r, 100));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(out, name), fullPage: true });
      console.log('saved', name);
    }
    await ctx.close();
  }
  await browser.close();
})();
