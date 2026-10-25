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
  { path: '/', label: 'home', widths: [1440, 1280, 1100, 1050, 768, 390] },
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
    const failedFontRequests = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400 && (response.url().startsWith(baseUrl) || ['image', 'font'].includes(response.request().resourceType()))) {
        failedAssets.push(response.status() + ' ' + response.url());
      }
    });

    page.on('requestfailed', request => {
      if (request.resourceType() === 'image') failedImageRequests.push(request.url());
      if (request.resourceType() === 'font') failedFontRequests.push(request.url());
    });

    // External photography/fonts may continue loading; avoid an unbounded network-idle wait.
    const response = await page.goto(baseUrl + item.path, { waitUntil: 'domcontentloaded', timeout: 45000 });
    assert.equal(response?.status(), 200, item.path + ': expected HTTP 200');
    const assetsSettled = await page.evaluate(async () => {
      const ready = Promise.all([
        document.fonts.ready,
        Promise.all([...document.images].map(img => img.decode().catch(() => {}))),
      ]).then(() => true);
      const timeout = new Promise(resolve => setTimeout(() => resolve(false), 20000));
      return Promise.race([ready, timeout]);
    });
    if (!assetsSettled) failures.push(item.path + ' @ ' + width + ': fonts/images timed out before screenshot');
    await page.screenshot({ path: output + '/' + item.label + '-' + width + '.png', fullPage: true });

    const metrics = await page.evaluate(() => {
      const rect = selector => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
      };
      const visible = el => el.getClientRects().length > 0;
      const clipping = selector => [...document.querySelectorAll(selector)]
        .filter(el => visible(el) && el.scrollWidth > el.clientWidth + 4)
        .map(el => el.className || el.tagName).slice(0, 10);
      return {
        viewport: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        title: document.title,
        heroHeading: rect('.ddzv4-copy h1'),
        heroPhone: rect('.ddzv4-dz'),
        appRail: rect('.ddzv4-cards'),
        heroV4: rect('.ddzv4-hero'),
        heroCopy: rect('.ddzv4-copy'),
        heroValues: rect('.ddzv4-values'),
        heroPrimaryCard: rect('.ddzv4-dz'),
        heroGrigleCard: rect('.ddzv4-grigle'),
        heroMylockCard: rect('.ddzv4-mylock'),
        heroValueCentres: [...document.querySelectorAll('.ddzv4-value')]
          .filter(visible).map(el => Math.round(el.getBoundingClientRect().x + el.getBoundingClientRect().width / 2)),
        heroValueInner: rect('.ddzv4-values-inner'),
        heroBackgroundImage: document.querySelector('.ddzv4-hero') ? getComputedStyle(document.querySelector('.ddzv4-hero'), '::before').backgroundImage : '',
        isV4Visible: !!document.querySelector('.ddzv4-hero') && visible(document.querySelector('.ddzv4-hero')),
        isLegacyVisible: !!document.querySelector('.hero') && visible(document.querySelector('.hero')),
        detailHeading: rect('.detail-title'),
        clipping: clipping('.ddzv4-copy h1, .ddzv4-card-head, .ddzv4-description, .hero-copy h1, .hero .app-panel .panel-copy p, .panel-topline, .product-copy, .screen-moment'),
        textOverflow: [...document.querySelectorAll(
          '.ddzv4-copy h1, .ddzv4-description, .hero-copy h1, .hero-intro, .section-heading h2, .product-title-row h3, .detail-title, .detail-tagline, .screen-story-head h2, .studio-heading-block h2'
        )].filter(el => visible(el) && el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 4)
          .map(el => ({ selector: el.className || el.tagName.toLowerCase(), difference: el.scrollWidth - el.clientWidth })).slice(0, 12),
        primaryVisualOutsideViewport: [...document.querySelectorAll('.ddzv4-cards, .hero .phone-mockup, .hero .app-rail, .detail-stage .detail-device')]
          .filter(el => visible(el)).filter(el => {
            const box = el.getBoundingClientRect();
            return box.left < -4 || box.right > window.innerWidth + 4;
          }).map(el => el.className),
        posterTextWidths: [...document.querySelectorAll('.hero .app-panel .panel-copy p')].filter(visible).map(el => Math.round(el.getBoundingClientRect().width)),
        brokenImages: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.currentSrc || img.src),
      };
    });
    const record = { page: item.path, width, ...metrics, assetsSettled, pageErrors: [...pageErrors], failedAssets: [...failedAssets], failedImageRequests: [...failedImageRequests], failedFontRequests: [...failedFontRequests] };
    report.push(record);
    const actualWidth = Math.max(metrics.scrollWidth, metrics.bodyWidth);
    if (actualWidth > width + 3) failures.push(item.path + ' @ ' + width + ': horizontal overflow ' + actualWidth);
    if (pageErrors.length) failures.push(item.path + ' @ ' + width + ': JS error ' + pageErrors.join('; '));
    if (failedAssets.length) failures.push(item.path + ' @ ' + width + ': missing asset ' + failedAssets.join('; '));
    if (failedImageRequests.length) failures.push(item.path + ' @ ' + width + ': failed image requests ' + failedImageRequests.join('; '));
    if (failedFontRequests.length) failures.push(item.path + ' @ ' + width + ': failed font requests ' + failedFontRequests.join('; '));
    if (metrics.brokenImages.length) failures.push(item.path + ' @ ' + width + ': broken image elements ' + metrics.brokenImages.join('; '));
    if (metrics.clipping.length) failures.push(item.path + ' @ ' + width + ': clipped text/card content ' + metrics.clipping.join('; '));
    if (metrics.textOverflow.length) failures.push(item.path + ' @ ' + width + ': text overflow ' + JSON.stringify(metrics.textOverflow));
    // Legacy mobile poster columns are intentionally narrow and wrap text.
    // Measure actual clipping above, not an arbitrary 140px minimum width.
    if (metrics.primaryVisualOutsideViewport.length) failures.push(item.path + ' @ ' + width + ': central showcase outside viewport ' + metrics.primaryVisualOutsideViewport.join('; '));

    // R5.3 approval: photographic background, 612x448 or 540x408 1+2 layout,
    // compact single-panel values bar; mobile retains the earlier hero.
    if (item.path === '/') {
      const r = metrics;
      if (width >= 1051) {
        const expectedWidth = width >= 1280 ? 612 : 540;
        const expectedHeight = width >= 1280 ? 448 : 408;
        if (!r.isV4Visible || r.isLegacyVisible) failures.push('R5.3 desktop hero visibility incorrect @ ' + width);
        if (!r.heroBackgroundImage.includes('dudozi-hero-r53-workspace.webp')) {
          failures.push('R5.3 approved photo background missing @ ' + width);
        }
        if (!r.appRail || Math.abs(r.appRail.width - expectedWidth) > 2 ||
            Math.abs(r.appRail.height - expectedHeight) > 2) {
          failures.push('R5.3 app-card group size @ ' + width + ': ' + JSON.stringify(r.appRail));
        }
        if (!r.heroPrimaryCard || !r.heroGrigleCard || !r.heroMylockCard ||
            Math.abs(r.heroPrimaryCard.height - r.heroGrigleCard.height - r.heroMylockCard.height - 16) > 2) {
          failures.push('R5.3 app-card height balance @ ' + width);
        }
        if (!r.heroValueInner || r.heroValueInner.width > 963 ||
            !r.heroValues || r.heroValues.height < 75) {
          failures.push('R5.3 compact value panel dimensions @ ' + width);
        }
        if (r.heroValueInner && r.heroValueCentres.length === 3) {
          const expected = [1/6, 1/2, 5/6].map(frac => r.heroValueInner.x + r.heroValueInner.width * frac);
          if (r.heroValueCentres.some((x, i) => Math.abs(x - expected[i]) > 12)) {
            failures.push('R5.3 value icon centres @ ' + width + ': ' + JSON.stringify(r.heroValueCentres));
          }
        } else {
          failures.push('R5.3 values must stay in one three-column panel @ ' + width);
        }
      } else {
        if (r.isV4Visible || !r.isLegacyVisible) failures.push('Legacy mobile hero visibility incorrect @ ' + width);
      }
    }

    // Exercise real app-card navigation after screenshot metrics are locked to the homepage.
    // Capture interaction failures separately so detail-page loads are not misattributed to /.
    if (item.path === '/' && width === 1440) {
      const initial = { js: pageErrors.length, assets: failedAssets.length, images: failedImageRequests.length };
      for (const appName of ['dzlog', 'grigle', 'mylock']) {
        try {
          const heroSelector = {
            dzlog: '.ddzv4-card.ddzv4-dz',
            grigle: '.ddzv4-card.ddzv4-grigle',
            mylock: '.ddzv4-card.ddzv4-mylock',
          }[appName];
          await page.locator(heroSelector).click();
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
  console.log('Visual QA passed: R5.3 PC 1440/1280/1100 + mobile 1050/768/390, app detail routes, navigation, text fit, assets and JS.');
}
