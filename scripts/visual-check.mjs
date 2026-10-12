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
  { path: '/apps/dzlog/', label: 'dzlog', widths: [1440] },
  { path: '/apps/grigle/', label: 'grigle', widths: [1440] },
  { path: '/apps/mylock/', label: 'mylock', widths: [1440] },
];

for (const item of pages) {
  for (const width of item.widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const pageErrors = [];
    const failedAssets = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400 && response.url().startsWith(baseUrl)) {
        failedAssets.push(response.status() + ' ' + response.url());
      }
    });

    const response = await page.goto(baseUrl + item.path, { waitUntil: 'networkidle', timeout: 45000 });
    assert.equal(response?.status(), 200, item.path + ': expected HTTP 200');
    await page.evaluate(async () => { await document.fonts.ready; });
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
      };
    });
    const record = { page: item.path, width, ...metrics, pageErrors, failedAssets };
    report.push(record);
    const actualWidth = Math.max(metrics.scrollWidth, metrics.bodyWidth);
    if (actualWidth > width + 3) failures.push(item.path + ' @ ' + width + ': horizontal overflow ' + actualWidth);
    if (pageErrors.length) failures.push(item.path + ' @ ' + width + ': JS error ' + pageErrors.join('; '));
    if (failedAssets.length) failures.push(item.path + ' @ ' + width + ': missing asset ' + failedAssets.join('; '));
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
  console.log('Visual QA passed: PC homepage widths and all three app details.');
}
