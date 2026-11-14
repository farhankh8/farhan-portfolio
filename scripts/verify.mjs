/**
 * Verification screenshots.
 *
 * Scrolls the page so that every reveal has fired, then captures the full
 * page at the requested widths.
 *
 * Usage:
 *   node scripts/verify.mjs <outDir> [width...]
 */
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = process.argv[2] || 'screenshots';
const widths = process.argv.slice(3).map(Number);
const sizes = widths.length ? widths : [1440, 1024, 390];

mkdirSync(outDir, { recursive: true });

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const target = pathToFileURL(path.join(root, 'index.html')).href;

const browser = await chromium.launch();

for (const width of sizes) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(target, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // Walk the page so IntersectionObserver reveals fire, then return to the top.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 400));
  });

  await page.waitForTimeout(900);

  const file = path.join(outDir, `page-${width}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log('wrote', file);

  await page.close();
}

await browser.close();
