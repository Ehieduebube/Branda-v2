// End-to-end journey covering the assessment's 23 validation steps, plus
// console/hydration, overflow and keyboard checks, against a running build.
//
//   npm run build && npm start            (in one terminal)
//   npm run e2e -- http://localhost:3000  (in another)
//
// Uses the locally installed Chrome; set CHROME_PATH if it isn't found.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer-core';
const BASE = process.argv[2] || 'http://localhost:3000';
const CHROME = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => fs.existsSync(p));
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'e2e-artifacts');
fs.mkdirSync(OUT, { recursive: true });

const results = [];
const consoleIssues = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', (m) => { if (['error', 'warn'].includes(m.type())) consoleIssues.push(`[${m.type()}] ${page.url()} :: ${m.text().slice(0, 300)}`); });
  page.on('pageerror', (e) => consoleIssues.push(`[pageerror] ${page.url()} :: ${e.message.slice(0, 300)}`));
  await page.setViewport({ width: 1366, height: 900 });

  const text = (sel) => page.$$eval(sel, (els) => els.find((e) => e.checkVisibility())?.textContent.trim() ?? null).catch(() => null);
  const waitUrl = async (pred, ms = 8000) => { const t = Date.now(); while (Date.now() - t < ms) { if (pred(page.url())) return true; await sleep(100); } return false; };
  const settle = async () => { await ready(); await page.waitForNetworkIdle({ idleTime: 300, timeout: 5000 }).catch(() => {}); await page.waitForFunction(() => !document.querySelector('[aria-busy="true"]'), { timeout: 8000 }).catch(() => {}); };
  const overflow = (vpWidth) => page.evaluate((w) => {
    // Elements poking past the viewport edge, ignoring intentional horizontal scrollers.
    const inScroller = (el) => { for (let p = el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden') return true; } return false; };
    const bad = [...document.body.querySelectorAll('*')].filter((el) => el.checkVisibility() && el.getBoundingClientRect().right > w + 1 && !inScroller(el));
    return bad.length ? bad.slice(0, 3).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} right=${Math.round(el.getBoundingClientRect().right)}`).join('; ') : 0;
  }, vpWidth);
  const cardNames = () => page.$$eval('main article h3 a, main article h2 a', (as) => as.filter((a) => a.checkVisibility()).map((a) => a.textContent.trim()));
  const cardPrices = () => page.$$eval('main article', (arts) => arts.filter((a) => a.checkVisibility()).map((a) => a.querySelector('span.inline-flex > span.font-semibold')?.textContent.trim()));

  const ready = () => page.waitForFunction(() => document.readyState === 'complete' && ![...document.querySelectorAll('[role="status"][aria-label^="Loading"], [aria-busy="true"]')].some((e) => e.checkVisibility()), { timeout: 15000 }).catch(() => {});
  const go = async (path) => { const r = await page.goto(BASE + path, { waitUntil: 'load', timeout: 45000 }); await ready(); await sleep(150); return r; };
  const clickVisible = async (sel) => { const els = await page.$$(sel); for (const el of els) { if (await el.evaluate((e) => e.checkVisibility())) { await el.click(); return; } } throw new Error('No visible element for ' + sel); };
  const selectVisible = async (sel, value) => { const els = await page.$$(sel); for (const el of els) { if (await el.evaluate((e) => e.checkVisibility())) { await el.select(value); return; } } throw new Error('No visible select ' + sel); };
  const num = (s) => Number(String(s).replace(/[^0-9.]/g, ''));

  // 1. Homepage
  await go('/');
  check('1. "/" redirects to a market homepage', page.url().endsWith('/ng'), page.url());
  const ngHero = await text('h1');
  check('1. Homepage renders market hero', !!ngHero, ngHero);
  const ngPrice = await text('main article span.inline-flex > span.font-semibold');
  check('1. NG prices in Naira', /₦/.test(ngPrice || ''), ngPrice);
  await page.screenshot({ path: `${OUT}/01-home-ng-desktop.png` });

  // 2. Switch market
  await selectVisible('header select', 'us');
  await waitUrl((u) => u.endsWith('/us')); await settle();
  const usHero = await text('h1');
  const usPrice = await text('main article span.inline-flex > span.font-semibold');
  check('2. Market switch navigates to /us', page.url().endsWith('/us'), page.url());
  check('2. Hero copy changes per market', !!usHero && usHero !== ngHero, usHero);
  check('2. Currency switches to USD', /^\$/.test(usPrice || ''), usPrice);
  const cookie = (await page.cookies()).find((c) => c.name === 'branda-market');
  check('2. Market preference cookie saved', cookie?.value === 'us');

  // 3. Browse services
  await clickVisible('nav[aria-label="Main"] a[href="/us/services"]');
  await waitUrl((u) => u.endsWith('/us/services')); await settle();
  const allCount = await text('main [role="status"]');
  check('3. Listing shows all services', /25 services/.test(allCount || ''), allCount);
  check('3. 9 cards on page 1', (await cardNames()).length === 9);

  // 4. Smart search (with a typo)
  await page.click('#service-search'); await page.type('#service-search', 'buisness card', { delay: 30 });
  await waitUrl((u) => u.includes('q=buisness+card')); await settle(); await sleep(400);
  const searchNames = await cardNames();
  check('4. Search URL updates (debounced)', page.url().includes('q=buisness+card'), page.url());
  check('4. Typo-tolerant search ranks Business Cards first', searchNames[0] === 'Business Cards', searchNames.join(', '));
  await clickVisible('button[aria-label="Clear search"]'); await waitUrl((u) => !u.includes('q=')); await settle();
  check('4. Clearing search restores all results', /25 services/.test((await text('main [role="status"]')) || ''));

  await go('/us/services?q=gifts+for+clients');
  const giftNames = await cardNames();
  check('4. Search matches category/use-case vocabulary', giftNames.length > 0 && giftNames.every((n) => /Gift|Mug|Notebook|Bottle|Tote|T-Shirt/.test(n)), giftNames.join(', '));
  await go('/us/services?q=real+estate+flyers');
  check('4. Search matches industry vocabulary', (await cardNames())[0] === 'Flyers', (await cardNames()).join(', '));

  // 5. Category filter
  await go('/us/services');
  await clickVisible('nav[aria-label="Filter by category"] a[href*="category=prints"]');
  await waitUrl((u) => u.includes('category=prints')); await settle();
  const printsCount = await text('main [role="status"]');
  check('5. Category filter in URL', page.url().includes('category=prints'), page.url());
  check('5. Prints shows 6 services', /6 services/.test(printsCount || ''), printsCount);

  // 6. Additional filters
  await selectVisible('aside select[name="industry"]', 'real-estate');
  await waitUrl((u) => u.includes('industry=real-estate')); await settle();
  await selectVisible('aside select[name="urgency"]', 'express');
  await waitUrl((u) => u.includes('urgency=express')); await settle();
  const filtered = await cardNames();
  check('6. Industry + urgency filters in URL', page.url().includes('industry=real-estate') && page.url().includes('urgency=express'), page.url());
  check('6. Filtered results are correct', filtered.length > 0 && filtered.every((n) => ['Business Cards', 'Flyers', 'Roll-Up Banners'].includes(n)), filtered.join(', '));
  check('6. Active filter chips rendered', (await page.$$('main a:has(svg) span.sr-only')).length >= 3);

  // 7. Sort
  await go('/us/services?category=prints');
  await selectVisible('#sort', 'price-low'); await waitUrl((u) => u.includes('sort=price-low')); await settle();
  const asc = (await cardPrices()).map(num);
  check('7. Sort by price low→high', page.url().includes('sort=price-low') && asc.every((p, i) => i === 0 || p >= asc[i - 1]), asc.join(' ≤ '));
  await selectVisible('#sort', 'price-high'); await waitUrl((u) => u.includes('sort=price-high')); await settle();
  const desc = (await cardPrices()).map(num);
  check('7. Sort by price high→low', desc.every((p, i) => i === 0 || p <= desc[i - 1]), desc.join(' ≥ '));
  await selectVisible('#sort', 'popular'); await waitUrl((u) => !u.includes('sort=')); await settle();
  check('7. Sort by popularity (default, omitted from URL)', (await cardNames())[0] === 'Business Cards', (await cardNames()).slice(0, 3).join(', '));

  // 8. Pagination
  await go('/us/services');
  const page1 = await cardNames();
  await clickVisible('nav[aria-label="Pagination"] a[aria-label="Page 2"]');
  await waitUrl((u) => u.includes('page=2')); await settle();
  const page2 = await cardNames();
  check('8. Pagination to page 2 via URL', page.url().includes('page=2') && page2.length === 9 && !page2.includes(page1[0]), page.url());
  await go('/us/services?page=3');
  check('8. Last page has the remainder (7)', (await cardNames()).length === 7);
  await go('/us/services?page=9');
  check('8. Out-of-range page explains and links back', /Page 9 doesn.t exist/.test(await page.content()));

  // 9. Service detail
  await go('/ng/services');
  await clickVisible('main article a[href="/ng/services/business-cards"]');
  await waitUrl((u) => u.endsWith('/business-cards')); await settle();
  check('9. Detail page opens', (await text('h1')) === 'Business Cards');
  const html9 = await page.content();
  check('9. Gallery, description, included, turnaround present', (await page.$$('ul[aria-label="Business Cards images"] button')).length === 3 && /About this service/.test(html9) && /What.s included/.test(html9) && /Turnaround: 2–3 business days/.test(html9));
  const related = await page.$$eval('section[aria-labelledby="related-heading"] article h3', (h) => h.map((x) => x.textContent));
  const comp = await page.$$eval('section[aria-labelledby="complementary-heading"] article h3', (h) => h.map((x) => x.textContent));
  check('9. Related & complementary make sense', related.includes('Flyers') && comp.includes('Brand Identity') && comp.includes('Logo Design'), `related=[${related}] complementary=[${comp}]`);
  await clickVisible('ul[aria-label="Business Cards images"] li:nth-child(2) button'); await sleep(150);
  check('9. Gallery thumbnail switches main image', await page.$eval('ul[aria-label="Business Cards images"] li:nth-child(2) button', (b) => b.getAttribute('aria-pressed') === 'true'));
  await page.screenshot({ path: `${OUT}/09-detail-desktop.png` });

  const totalText = () => page.$eval('[aria-live="polite"][aria-atomic="true"] .text-2xl', (el) => el.textContent.trim());
  const t0 = await totalText();
  // 10. Change option
  await page.click('input[name="pack"][value="500"]'); await sleep(100);
  const t1 = await totalText();
  check('10. Changing option updates price', t1 !== t0, `${t0} → ${t1}`);
  await page.click('input[name="finish"][value="spot-uv"]'); await sleep(100);
  const t2 = await totalText();
  check('10. Add-on option updates price', num(t2) > num(t1), `${t1} → ${t2}`);
  // 11. Quantity
  await clickVisible('form button[aria-label="Increase by 1"]'); await sleep(100);
  const t3 = await totalText();
  check('11. Quantity 2 doubles the total', num(t3) === 2 * num(t2), `${t2} → ${t3}`);

  // 12. Add to cart
  await clickVisible('main form button[type="submit"]'); await sleep(300);
  check('12. Add to cart confirmation shown', /Added to your cart/.test(await page.content()));
  const badge = await page.$eval('header a[href="/ng/cart"]', (a) => a.getAttribute('aria-label'));
  check('12. Header cart badge updates', badge === 'Cart, 1 item', badge);

  await go('/ng/services/branded-mugs');
  check('12. Minimum quantity respected (mugs start at 12)', (await page.$eval('main input[aria-label="Quantity"]', (i) => i.value)) === '12');
  await clickVisible('main form button[type="submit"]'); await sleep(300);

  // 13. Modify cart
  await go('/ng/cart');
  const html13 = await page.content();
  check('13. Cart shows 2 lines with selected options', (await page.$$('section[aria-labelledby="cart-items-heading"] > ul > li')).length === 2 && /Spot UV/.test(html13) && /500 cards/.test(html13) && /Ceramic 11oz/.test(html13));
  const dd = () => page.$$eval('main aside dl dd', (d) => d.map((x) => x.textContent));
  const before = await dd();
  await clickVisible('div[aria-label="Quantity for Business Cards"] button[aria-label="Increase by 1"]'); await sleep(200);
  const after = await dd();
  check('13. Increasing quantity updates subtotal/tax/total', after[0] !== before[0] && after[2] !== before[2], `${before.join(' | ')} → ${after.join(' | ')}`);
  const [sub, tax, tot] = after.map(num);
  check('13. Tax = 7.5% VAT and total = subtotal + tax', Math.abs(tax - Math.round(sub * 0.075)) <= 1 && tot === sub + tax, `${sub} + ${tax} = ${tot}`);
  await clickVisible('div[aria-label="Quantity for Business Cards"] button[aria-label="Decrease by 1"]'); await sleep(200);
  check('13. Decreasing quantity works', (await page.$eval('div[aria-label="Quantity for Business Cards"] input', (i) => i.value)) === '2');
  const mugDec = await page.$eval('div[aria-label="Quantity for Branded Mugs"] button[aria-label^="Decrease"]', (b) => b.disabled);
  check('13. Cannot decrease below minimum (button disabled at 12)', mugDec === true);
  await page.screenshot({ path: `${OUT}/13-cart-desktop.png` });

  // 14. Remove item
  await clickVisible('section[aria-labelledby="cart-items-heading"] li:nth-child(2) button.text-red-700'); await sleep(300);
  check('14. Remove item', (await page.$$('section[aria-labelledby="cart-items-heading"] > ul > li')).length === 1);

  // 18a. Cart persists across refresh
  await page.reload({ waitUntil: 'load', timeout: 45000 }); await ready();
  check('18. Cart persists after refresh (localStorage)', (await page.$$('section[aria-labelledby="cart-items-heading"] > ul > li')).length === 1);
  // Cart is per market
  await go('/us/cart');
  check('18. Carts are per market (US cart empty)', /Your cart is empty/.test(await page.content()));

  // 15. Checkout
  await go('/ng/cart');
  await clickVisible('main a[href="/ng/checkout"]');
  await waitUrl((u) => u.endsWith('/ng/checkout')); await settle();
  const html15 = await page.content();
  check('15. Checkout summary: items, options, quantity, totals', /Order summary/.test(html15) && /Spot UV/.test(html15) && /2 designs/.test(html15) && /VAT \(7.5%\)/.test(html15));
  // 16. Validation then confirm
  await clickVisible('main form button[type="submit"]'); await sleep(300);
  const alert = await text('[role="alert"]');
  check('16. Empty submit shows validation errors', /correct the highlighted/.test(alert || '') && (await page.$$('[aria-invalid="true"]')).length === 2, alert);
  check('16. Focus moves to first invalid field', await page.evaluate(() => document.activeElement?.id === 'checkout-name'));
  await page.type('#checkout-name', 'Ada Okafor'); await page.type('#checkout-email', 'ada@example');
  await clickVisible('main form button[type="submit"]'); await sleep(300);
  check('16. Invalid email rejected', /valid email/.test(await page.content()));
  await page.type('#checkout-email', '.com'); await page.type('#checkout-company', 'Okafor Realty');
  await page.screenshot({ path: `${OUT}/16-checkout-desktop.png` });
  await clickVisible('main form button[type="submit"]');
  await waitUrl((u) => u.includes('/checkout/confirmation'), 10000); await settle();
  // 17. Confirmation
  const h1 = await text('h1');
  check('17. Confirmation screen (not an alert)', page.url().endsWith('/ng/checkout/confirmation') && /order is confirmed/.test(h1 || ''), h1);
  const orderId = await text('dd.font-mono');
  check('17. Order number shown', /^BR-NG-[A-Z0-9]{8}$/.test(orderId || ''), orderId);
  check('17. Cart cleared after order', (await page.$eval('header a[href="/ng/cart"]', (a) => a.getAttribute('aria-label'))) === 'Cart');
  await page.screenshot({ path: `${OUT}/17-confirmation-desktop.png` });
  await page.reload({ waitUntil: 'load', timeout: 45000 }); await ready();
  check('18. Confirmation survives refresh', (await text('dd.font-mono')) === orderId);

  // 19. URL filters
  await go('/ng/services?category=prints&industry=real-estate&sort=popular&page=1');
  await page.reload({ waitUntil: 'load', timeout: 45000 }); await ready();
  const sel = await page.evaluate(() => ({ industry: document.querySelector('aside select[name="industry"]').value, sort: document.querySelector('#sort').value, chip: document.querySelector('nav[aria-label="Filter by category"] a[aria-current="page"]')?.textContent }));
  check('19. Direct URL restores filters (after refresh)', sel.industry === 'real-estate' && sel.sort === 'popular' && /Prints/.test(sel.chip || ''), JSON.stringify(sel));
  await go('/ng/services?q=business+cards&category=prints&sort=price-low&page=1');
  check('19. Search URL restores query and sort', (await page.$eval('#service-search', (i) => i.value)) === 'business cards' && (await page.$eval('#sort', (s) => s.value)) === 'price-low');
  await go('/ng/services?category=bogus&sort=nonsense&page=-4');
  check('19. Malformed params ignored gracefully', /25 services/.test((await text('main [role="status"]')) || ''));
  // Back/forward restores state
  await go('/ng/services');
  await clickVisible('nav[aria-label="Filter by category"] a[href*="category=gifts"]'); await waitUrl((u) => u.includes('gifts')); await settle();
  await page.goBack(); await waitUrl((u) => !u.includes('gifts')); await settle();
  check('19. Browser back restores previous filter state', /25 services/.test((await text('main [role="status"]')) || ''));

  // 20. Invalid service
  const resp = await go('/ng/services/not-a-real-service');
  check('20. Invalid service → HTTP 404 + recovery UI', resp.status() === 404 && /isn.t available/.test((await text('h1')) || ''), `${resp.status()} ${await text('h1')}`);
  check('20. 404 offers search for the attempted slug', /not a real service/.test(await page.content()));
  const resp2 = await go('/zz/services');
  check('20. Unknown market → HTTP 404 listing markets', resp2.status() === 404 && /Nigeria/.test(await page.content()), String(resp2.status()));

  // 21. Empty search
  await go('/ng/services?q=xylophone');
  check('21. Empty search state with actions', /No services match your search/.test(await page.content()) && !!(await page.$('main a[href="/ng/services"]')));

  // 22. Empty cart
  await go('/ng/cart');
  check('22. Empty cart state', /Your cart is empty/.test(await page.content()));
  await go('/ng/checkout');
  check('22. Empty checkout state', /nothing to check out/.test(await page.content()));

  // Market switch keeps equivalent page
  await go('/ng/services/logo-design');
  await selectVisible('header select', 'uk'); await waitUrl((u) => u.includes('/uk/')); await settle();
  check('2. Market switch keeps equivalent page + GBP', page.url().endsWith('/uk/services/logo-design') && /£/.test(await text('main [aria-live="polite"][aria-atomic="true"]')), page.url());
  await selectVisible('header select', 'ca'); await waitUrl((u) => u.includes('/ca/')); await settle();
  check('2. Canada shows CA$', /CA\$/.test(await text('main [aria-live="polite"][aria-atomic="true"]')));
  await go('/ng/services?category=prints&sort=price-low');
  await selectVisible('header select', 'us'); await waitUrl((u) => u.includes('/us/')); await settle();
  check('2. Market switch keeps listing filters', page.url().endsWith('/us/services?category=prints&sort=price-low'), page.url());

  // 23. Responsive
  await go('/ng/services/branded-t-shirts');
  await clickVisible('main form button[type="submit"]'); await sleep(200);
  const viewports = [
    { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
    { name: 'small', width: 320, height: 640, isMobile: true, hasTouch: true },
    { name: 'tablet', width: 820, height: 1180, isMobile: true, hasTouch: true },
    { name: 'desktop', width: 1366, height: 900 },
  ];
  for (const vp of viewports) {
    await page.setViewport({ ...vp, deviceScaleFactor: 1 });
    for (const [slug, path] of [['home', '/ng'], ['listing', '/ng/services?category=gifts'], ['detail', '/ng/services/branded-t-shirts'], ['cart', '/ng/cart'], ['checkout', '/ng/checkout']]) {
      await go(path); await sleep(300);
      const o = await overflow(vp.width);
      check(`23. ${vp.name} ${slug}: nothing overflows the viewport`, o === 0, o || '');
      await page.screenshot({ path: `${OUT}/23-${vp.name}-${slug}.png` });
    }
  }
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await go('/ng/services');
  const hiddenBefore = await page.$eval('aside form', (f) => getComputedStyle(f).display === 'none');
  await clickVisible('aside button[aria-expanded]'); await sleep(150);
  const shownAfter = await page.$eval('aside form', (f) => getComputedStyle(f).display !== 'none');
  check('23. Mobile filter panel collapses and toggles', hiddenBefore && shownAfter);
  await page.screenshot({ path: `${OUT}/23-mobile-filters-open.png` });

  // Keyboard
  await page.setViewport({ width: 1366, height: 900 });
  await go('/ng');
  await page.keyboard.press('Tab');
  const skip = await page.evaluate(() => ({ text: document.activeElement?.textContent, visible: document.activeElement?.getBoundingClientRect().width > 1 }));
  check('A11y: skip link first and visible on focus', skip.text === 'Skip to content' && skip.visible, JSON.stringify(skip));
  await go('/ng/services/flyers');
  await page.focus('input[name="quantity"][value="250"]');
  await page.keyboard.press('ArrowDown'); await sleep(100);
  check('A11y: option radios operable with arrow keys', await page.$eval('input[name="quantity"][value="500"]', (i) => i.checked));

  await browser.close();
  console.log('\n=== Browser console errors/warnings (incl. hydration) ===');
  console.log(consoleIssues.length ? consoleIssues.join('\n') : 'none');
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error('E2E crashed:', e); process.exit(2); });
