import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const baseUrl = process.env.SITE_URL || 'http://127.0.0.1:4173';
const output = 'artifacts/pc-visual-qa';
mkdirSync(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = [];
const failures = [];

const pages = [
  { path: '/', label: 'home', widths: [1440, 1280, 1100] },
  { path: '/apps/dzlog/', label: 'dzlog', widths: [1440, 1280, 1100] },
  { path: '/apps/grigle/', label: 'grigle', widths: [1440, 1280, 1100] },
  { path: '/apps/mylock/', label: 'mylock', widths: [1440, 1280, 1100] },
];

for (const item of pages) {
  for (const width of item.widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const pageErrors = [];
    const failedAssets = [];
    const failedImageRequests = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400 && (response.url().startsWith(baseUrl) || response.request().resourceType() === 'image')) {
        failedAssets.push(response.status() + ' ' + response.url());
      }
    });

    page.on('requestfailed', request => {
      if (request.resourceType() === 'image') failedImageRequests.push(request.url());
    });

    const response = await page.goto(baseUrl + item.path, { waitUntil: 'networkidle', timeout: 45000 });
    assert.equal(response?.status(), 200, item.path + ': expected HTTP 200');
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
    });
    await page.screenshot({ path: output + '/' + item.label + '-' + width + '.png', fullPage: true });

    const metrics = await page.evaluate(() => {
      const rect = selector => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
      };
      const clipping = selector => [...document.querySelectorAll(selector)]
        .filter(el => el.scrollWidth > el.clientWidth + 4)
        .map(el => el.className || el.tagName).slice(0, 10);
      return {
        viewport: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        title: document.title,
        heroHeading: rect('.hero-copy h1'),
        heroPhone: rect('.phone-mockup'),
        appRail: rect('.app-rail'),
        detailHeading: rect('.detail-title'),
        clipping: clipping('.hero-copy h1, .panel-topline, .product-copy, .screen-moment'),
        textOverflow: [...document.querySelectorAll(
          '.hero-copy h1, .hero-intro, .section-heading h2, .product-title-row h3, .detail-title, .detail-tagline, .screen-story-head h2, .studio-heading-block h2'
        )].filter(el => el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 4)
          .map(el => ({ selector: el.className || el.tagName.toLowerCase(), difference: el.scrollWidth - el.clientWidth })).slice(0, 12),
        primaryVisualOutsideViewport: [...document.querySelectorAll('.hero .phone-mockup, .hero .app-rail, .detail-stage .detail-device')]
          .filter(el => {
            const box = el.getBoundingClientRect();
            return box.left < -4 || box.right > window.innerWidth + 4;
          }).map(el => el.className),
        brokenImages: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.currentSrc || img.src),
      };
    });
    const record = { page: item.path, width, ...metrics, pageErrors: [...pageErrors], failedAssets: [...failedAssets], failedImageRequests: [...failedImageRequests] };
    report.push(record);
    const actualWidth = Math.max(metrics.scrollWidth, metrics.bodyWidth);
    if (actualWidth > width + 3) failures.push(item.path + ' @ ' + width + ': horizontal overflow ' + actualWidth);
    if (pageErrors.length) failures.push(item.path + ' @ ' + width + ': JS error ' + pageErrors.join('; '));
    if (failedAssets.length) failures.push(item.path + ' @ ' + width + ': missing asset ' + failedAssets.join('; '));
    if (failedImageRequests.length) failures.push(item.path + ' @ ' + width + ': failed image requests ' + failedImageRequests.join('; '));
    if (metrics.brokenImages.length) failures.push(item.path + ' @ ' + width + ': broken image elements ' + metrics.brokenImages.join('; '));
    if (metrics.clipping.length) failures.push(item.path + ' @ ' + width + ': clipped text/card content ' + metrics.clipping.join('; '));
    if (metrics.textOverflow.length) failures.push(item.path + ' @ ' + width + ': text overflow ' + JSON.stringify(metrics.textOverflow));
    if (metrics.primaryVisualOutsideViewport.length) failures.push(item.path + ' @ ' + width + ': central showcase outside viewport ' + metrics.primaryVisualOutsideViewport.join('; '));

    // Exercise real app-card navigation after screenshot metrics are locked to the homepage.
    // Capture interaction failures separately so detail-page loads are not misattributed to /.
    if (item.path === '/' && width === 1440) {
      const initial = { js: pageErrors.length, assets: failedAssets.length, images: failedImageRequests.length };
      for (const appName of ['dzlog', 'grigle', 'mylock']) {
        try {
          await page.locator('a#' + appName).click();
          await page.waitForURL(url => url.pathname === '/apps/' + appName + '/', { timeout: 12000 });
          await page.locator('a.detail-back').click();
          await page.waitForURL(url => url.pathname === '/' && url.hash === '#apps', { timeout: 12000 });
        } catch (error) {
          failures.push('App detail round trip failed for ' + appName + ': ' + error.message);
          await page.goto(baseUrl + '/', { waitUntil: 'domcontentloaded' });
        }
      }
      if (pageErrors.length > initial.js) failures.push('App navigation JS errors: ' + pageErrors.slice(initial.js).join('; '));
      if (failedAssets.length > initial.assets) failures.push('App navigation asset errors: ' + failedAssets.slice(initial.assets).join('; '));
      // Navigation can intentionally abort image loads on the previous page.
      // Ignore requestfailed from those transitions; each detail route is tested independently above.
    }

    await page.close();
  }
}
await browser.close();
writeFileSync(output + '/report.json', JSON.stringify(report, null, 2));
report.forEach(x => console.log(JSON.stringify(x)));
if (failures.length) {
  console.error('Visual QA failed: ' + failures.join(' | '));
  process.exitCode = 1;
} else {
  console.log('Visual QA passed: 1440/1280/1100px homepage and app details, navigation, text fit, images and JS.');
}
