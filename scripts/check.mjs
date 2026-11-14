import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const target = pathToFileURL(path.join(root, 'index.html')).href;

const browser = await chromium.launch();
const results = [];
const check = (name, pass, detail = '') => results.push({ name, pass, detail });

/* Desktop ---------------------------------------------------------------- */
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
await page.goto(target, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

check('no page errors', errors.length === 0, errors.join(' | '));

check('hero visible', await page.locator('.hero-title').isVisible());
check('nav links visible on desktop', await page.locator('.nav-links .nav-link').first().isVisible());
check('nav has 5 links', (await page.locator('.nav-links .nav-link').count()) === 5);
check('nav has one button', (await page.locator('.nav-actions .btn').count()) === 1);
check('tagline words built', (await page.locator('.tagline-word').count()) > 10);

// Walk the page so every reveal fires, then come back.
await page.evaluate(async () => {
  const step = Math.round(window.innerHeight * 0.6);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 90));
  }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 300));
});
await page.waitForTimeout(500);
check('all reveals fired', (await page.locator('.reveal.is-visible').count()) === (await page.locator('.reveal').count()));

await page.evaluate(() => document.querySelector('#credentials').scrollIntoView());
await page.waitForTimeout(1200);
const current = await page.locator('.nav-link[aria-current="true"]').getAttribute('href');
check('active nav follows scroll', current === '#credentials', String(current));

await page.locator('.faq-item summary').first().click();
await page.waitForTimeout(300);
check('faq opens', await page.locator('.faq-item').first().getAttribute('open') !== null);
check('faq answer visible', await page.locator('.faq-answer').first().isVisible());

await page.locator('#contactBtn').click();
await page.waitForTimeout(400);
check('empty form blocks submit', (await page.locator('.field.has-error').count()) === 3);
check('form shows an error status', await page.locator('.form-status--error').isVisible());

await page.locator('#contactName').fill('Sarah Chen');
await page.locator('#contactEmail').fill('not-an-email');
await page.locator('#contactMessage').fill('Hello there, I have a role for you.');
await page.locator('#contactBtn').click();
await page.waitForTimeout(400);
check('bad email is rejected', (await page.locator('#contactName').evaluate(el => el.closest('[data-field]').classList.contains('has-error'))) === false);
check('bad email flagged', (await page.locator('#contactEmail').evaluate(el => el.closest('[data-field]').classList.contains('has-error'))) === true);

await page.locator('#contactEmail').fill('sarah@company.com');
await page.waitForTimeout(200);
check('valid email clears the error', (await page.locator('#contactEmail').evaluate(el => el.closest('[data-field]').classList.contains('has-error'))) === false);

await page.locator('[data-copy]').click();
await page.waitForTimeout(400);
check('copy button shows a toast', await page.locator('#toast.is-visible').isVisible());

await page.locator('#backToTop').evaluate(el => el.scrollIntoView());
await page.evaluate(() => window.scrollTo(0, 2000));
await page.waitForTimeout(500);
check('back to top appears', await page.locator('#backToTop.is-visible').isVisible());

await page.close();

/* Mobile ----------------------------------------------------------------- */
const mobile = await browser.newPage({ viewport: { width: 390, height: 780 } });
const mobileErrors = [];
mobile.on('pageerror', e => mobileErrors.push(String(e)));
await mobile.goto(target, { waitUntil: 'networkidle' });
await mobile.waitForTimeout(1000);

check('mobile: no errors', mobileErrors.length === 0, mobileErrors.join(' | '));
check('mobile: menu button visible', await mobile.locator('#menuToggle').isVisible());
check('mobile: nav links hidden', !(await mobile.locator('.nav-links').isVisible()));
check('mobile: header CTA hidden', !(await mobile.locator('.nav-actions .btn').isVisible()));

await mobile.locator('#menuToggle').click();
await mobile.waitForTimeout(600);
check('mobile: panel opens', await mobile.locator('#mobilePanel.is-open').isVisible());
check('mobile: panel links visible', await mobile.locator('.mobile-link').first().isVisible());
check('mobile: body scroll locked', (await mobile.evaluate(() => document.body.style.overflow)) === 'hidden');

await mobile.locator('.mobile-link[href="#work"]').click();
await mobile.waitForTimeout(700);
check('mobile: panel closes on link', !(await mobile.locator('#mobilePanel.is-open').isVisible()));
check('mobile: body scroll restored', (await mobile.evaluate(() => document.body.style.overflow)) === '');

await mobile.close();
await browser.close();

let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? '  -> ' + r.detail : ''}`);
}
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
