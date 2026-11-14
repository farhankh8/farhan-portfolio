import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const target = pathToFileURL(path.join(root, 'index.html')).href;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(process.argv[2] || 390), height: 900 } });
await page.goto(target, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

const report = await page.evaluate(() => {
  const limit = document.documentElement.clientWidth;
  const over = el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.right > limit + 0.5;
  };
  const out = [];
  document.querySelectorAll('*').forEach(el => {
    if (!over(el)) return;
    // Keep only the deepest offenders: no child that also overflows.
    const childOver = Array.from(el.children).some(over);
    if (!childOver) {
      const r = el.getBoundingClientRect();
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className || '').slice(0, 60),
        right: Math.round(r.right),
        width: Math.round(r.width),
        text: (el.textContent || '').trim().slice(0, 50),
      });
    }
  });
  return { limit, scrollWidth: document.documentElement.scrollWidth, deepest: out.slice(0, 30) };
});

console.log(JSON.stringify(report, null, 2));
await browser.close();
