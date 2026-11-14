import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const browser = await chromium.launch();

for (const name of ['404', 'privacy']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(pathToFileURL(path.join(root, name + '.html')).href, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const out = path.join(root, 'screenshots', name + '-1280.png');
  await page.screenshot({ path: out, fullPage: true });
  console.log('wrote', out, errors.length ? 'ERRORS: ' + errors.join(' | ') : 'no errors');
  await page.close();
}

await browser.close();
