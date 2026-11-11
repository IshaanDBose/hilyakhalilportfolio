// Regenerates assets/img/og-image.png (the preview shown when the site is
// shared on LinkedIn, Slack, iMessage…) from the top of the home page.
// Usage: python3 tools/serve.py &  then  node tools/og-image.js
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.site-header{display:none} .work,.site-footer{display:none} .hero{padding-top:150px} body{zoom:1.15}' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'assets/img/og-image.png' });
  await browser.close();
  console.log('wrote assets/img/og-image.png');
})();
