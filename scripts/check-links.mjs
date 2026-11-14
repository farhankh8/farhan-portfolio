import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const browser = await chromium.launch();
let problems = 0;

// Collect every id in every page.
const pages = ['index.html', '404.html', 'privacy.html'];
const ids = {};

for (const name of pages) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(path.join(root, name)).href, { waitUntil: 'networkidle' });
  ids[name] = await page.evaluate(() => [...document.querySelectorAll('[id]')].map(e => e.id));
  await page.close();
}

// Check every local link on every page.
for (const name of pages) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(pathToFileURL(path.join(root, name)).href, { waitUntil: 'networkidle' });

  const links = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'))
  );

  for (const href of [...new Set(links)]) {
    if (/^(https?:|mailto:|data:)/.test(href)) continue;

    const [file, hash] = href.split('#');
    const target = file || name;

    if (file && !['index.html', '404.html', 'privacy.html'].includes(target)) {
      // Any other local file must exist on disk.
      if (!existsSync(path.join(root, target))) {
        console.log(`BROKEN FILE  ${name} -> ${href}`);
        problems++;
      }
      continue;
    }
    if (hash && !ids[target].includes(hash)) {
      console.log(`BROKEN ANCHOR ${name} -> ${href}`);
      problems++;
    }
  }

  if (errors.length) {
    console.log(`JS ERRORS on ${name}: ${errors.join(' | ')}`);
    problems += errors.length;
  }
  await page.close();
}

console.log(problems === 0 ? 'All local links, anchors and scripts resolve cleanly' : `${problems} problems`);
await browser.close();
process.exit(problems ? 1 : 0);
