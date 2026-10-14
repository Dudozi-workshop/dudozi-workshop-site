import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const pages = [
  { file: 'public/index.html', label: 'Homepage', route: '/' },
  { file: 'public/apps/dzlog/index.html', label: 'DZlog', route: '/apps/dzlog/' },
  { file: 'public/apps/grigle/index.html', label: '그리글', route: '/apps/grigle/' },
  { file: 'public/apps/mylock/index.html', label: 'MY LOCK', route: '/apps/mylock/' },
];
const htmlByRoute = new Map();
const requiredAssets = [
  'public/assets/ddz-mark.svg',
  'public/assets/mylock-candy-soft-trio.webp',
  'public/mylock-authored-art-r42.css',
  'public/product-concept-r43.css',
  'public/assets/app-dzlog-launcher.webp',
  'public/assets/app-grigle-launcher.webp',
  'public/assets/app-mylock-launcher.png',
  'public/styles/app-brand-icons.css',
  'public/vendor/modern-normalize.css',
  'public/vendor/modern-normalize.LICENSE',
  'public/vendor/lucide-sprite.svg',
  'public/vendor/lucide.LICENSE',
  'public/styles/tokens.css',
  'public/styles/base.css',
  'public/styles/components.css',
  'public/home-r2.css',
  'public/home-visual-r3.css',
  'public/home-hero-r4.css',
  'public/home-polish-r41.css',
  'public/home-hero-v4-pc.css',
  'public/home-r2.js',
  'public/apps/app-detail.css',
  'public/apps/app-visual-r3.css',
  'public/support.html',
];

for (const asset of requiredAssets) {
  assert.ok(existsSync(asset), 'Missing shared asset ' + asset);
}

const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
assert.equal(
  vercel.git?.deploymentEnabled?.['feat/homepage-visual-r3-hifi'],
  false,
  'The active PC design branch must not trigger automatic Vercel deployments'
);

const resolveAsset = (path) => 'public/' + path.replace(/^\//, '');
for (const page of pages) {
  assert.ok(existsSync(page.file), 'Missing route ' + page.route);
  const html = readFileSync(page.file, 'utf8');
  htmlByRoute.set(page.route, html);
  assert.match(html, /<html lang="ko">/, page.label + ': Korean language');
  assert.match(html, /name="viewport"/, page.label + ': responsive viewport');
  assert.match(html, /<main(?:\s|>)/, page.label + ': main landmark');
  assert.match(html, /Noto\+Sans\+KR/, page.label + ': font load');

  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, page.label + ': duplicate IDs');

  for (const match of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.includes(match[1]), page.label + ': broken in-page anchor #' + match[1]);
  }

  for (const match of html.matchAll(/(?:src|href)="\/([^"#?]+)(?:[?#][^"]*)?"/g)) {
    const target = match[1];
    if (target.endsWith('/')) {
      assert.ok(existsSync(resolveAsset(target + 'index.html')), page.label + ': missing app route /' + target);
    } else {
      assert.ok(existsSync(resolveAsset(target)), page.label + ': missing local asset /' + target);
    }
  }
}

const homepage = htmlByRoute.get('/');
assert.match(homepage, /일상에 작은 편리함을/);
assert.match(homepage, /취향에 작은 즐거움을/);
assert.match(homepage, /자주 쓰는 기능은 더 편리하게/);
assert.match(homepage, /HOW WE MAKE/);
assert.match(homepage, /NOW MAKING/);
assert.ok(homepage.indexOf('id="dzlog"') < homepage.indexOf('id="grigle"'));
assert.ok(homepage.indexOf('id="grigle"') < homepage.indexOf('id="mylock"'));
assert.ok(homepage.indexOf('id="apps"') < homepage.indexOf('id="studio"'));
assert.match(homepage, /href="#apps"/, 'Home menu should show overview');
assert.match(homepage, /mylock-authored-art-r42\.css/, 'Homepage MY LOCK approved artwork stylesheet');
assert.match(homepage, /product-concept-r43\.css/, 'Homepage R4.3 verified product concepts');
assert.match(homepage, /class="overview-concept-note"[^>]*>[^<]*구성 예시/, 'Homepage mock UI concept disclosure required');
assert.match(homepage, /grigle-poster/, 'Grigle source-accurate gesture poster');
assert.match(homepage, /grigle-poster-caption">← ↑ <span>=<\/span> ㄱ/, 'GRIGLE poster must show L,U = ㄱ');
assert.match(homepage, /grigle-catalog-gesture[^>]*><span>←<\/span><span>↑<\/span><strong>ㄱ<\/strong>/, 'GRIGLE home catalog must show L,U = ㄱ');
assert.match(htmlByRoute.get('/apps/grigle/'), /grigle-direction-result[^>]*><span>←<\/span><span>↑<\/span><i>=<\/i><strong>ㄱ<\/strong>/, 'GRIGLE detail must show L,U = ㄱ');
assert.match(htmlByRoute.get('/apps/grigle/'), /↑ → 는 ㅏ/, 'GRIGLE detail must show U,R = ㅏ');
assert.match(htmlByRoute.get('/apps/grigle/'), /grigle-direction-result/, 'Grigle direction mapping detail demo');
assert.match(htmlByRoute.get('/apps/dzlog/'), /dzlog-folder-demo/, 'DZlog file workflow detail demo');
assert.match(htmlByRoute.get('/apps/mylock/'), /mylock-authored-art-r42\.css/, 'MY LOCK detail approved artwork stylesheet');
assert.match(htmlByRoute.get('/apps/mylock/'), /mylock-concept-note[^>]*>[^<]*실제 앱 화면 캡처는 아닙니다/, 'MY LOCK detail must distinguish concept art from actual screenshots');
assert.match(homepage, /home-visual-r3\.css/, 'Homepage R3 visual stylesheet missing');
assert.match(homepage, /home-hero-r4\.css/, 'Homepage R4 hero stylesheet missing');
assert.match(homepage, /home-polish-r41\.css/, 'Homepage R4.1 polish stylesheet missing');
assert.ok(homepage.includes('href="/home-hero-v4-pc.css"'), 'PC Hero v4 style must be linked');
assert.match(homepage, /class="ddzv4-hero"/, 'PC Hero v4 missing');
assert.match(homepage, /class="ddzv4-values"/, 'PC Hero v4 values missing');
assert.match(homepage, /id="ddzv4-title"/, 'PC Hero v4 headline missing');
assert.match(homepage, /class="ddzv4-keyboard"/, 'Grigle keyboard concept missing');
assert.match(homepage, /ddzv4-direction ddzv4-center/, 'Grigle actual four-direction pad missing');
assert.match(homepage, /class="ddzv4-finger"/, 'Grigle gesture demonstration missing');
assert.match(homepage, /ddzv4-frame-corner top-left/, 'DZlog camera frame corners missing');
assert.match(homepage, /ddzv4-camera-filename/, 'DZlog capture filename preview missing');
assert.match(homepage, /T1_01\\.jpg/, 'DZlog filename placeholder missing');
assert.match(homepage, /class="ddzv4-candy-art"/, 'MY LOCK approved art container missing');
assert.doesNotMatch(homepage, /ddzv4-lock-shapes/, 'MY LOCK must not use redrawn generic shapes in PC hero');
assert.match(homepage, /product-small-link/, 'Supporting app detail links missing');
for (const [name, extension] of [['dzlog', 'webp'], ['grigle', 'webp'], ['mylock', 'png']]) {
  assert.match(homepage, new RegExp('app-' + name + '-launcher\\.' + extension), 'Missing actual launcher mark: ' + name);
}
for (const route of ['/apps/dzlog/', '/apps/grigle/', '/apps/mylock/']) {
  assert.match(homepage, new RegExp('href="' + route + '"'), 'Homepage direct link to ' + route);
}

for (const page of pages.slice(1)) {
  const html = htmlByRoute.get(page.route);
  assert.match(html, /id="features"/, page.label + ': feature section');
  assert.match(html, /id="screen-story-title"/, page.label + ': product screenshots concept');
  assert.match(html, /href="\/#apps"/, page.label + ': back to apps');
  assert.match(html, /class="other-app-grid"/, page.label + ': other app discovery');
  assert.match(html, /app-visual-r3\.css/, page.label + ': shared R3 visual stylesheet');
  assert.match(html, /class="detail-brand-appicon"/, page.label + ': launcher icon missing');
  assert.match(html, /app-brand-icons\.css/, page.label + ': shared official icon CSS missing');
}

const stylesheet = readFileSync('public/home-r2.css', 'utf8');
const detailCss = readFileSync('public/apps/app-detail.css', 'utf8');
const homeVisualCss = readFileSync('public/home-visual-r3.css', 'utf8');
const heroR4Css = readFileSync('public/home-hero-r4.css', 'utf8');
const polishR41Css = readFileSync('public/home-polish-r41.css', 'utf8');
const heroV4Css = readFileSync('public/home-hero-v4-pc.css', 'utf8');
for (const [item, text] of [
  ['primary width', '--ddzv4-primary-width:260px'],
  ['secondary width', '--ddzv4-secondary-width:276px'],
  ['primary height', '--ddzv4-card-height:400px'],
  ['secondary height', '--ddzv4-secondary-height:194px'],
  ['value bar', '.ddzv4-values{height:74px'],
  ['left value anchor', 'left:22.222222%'],
  ['right value anchor', 'left:77.777778%'],
  ['Grigle movement', '@keyframes ddzv4-swipe'],
  ['DZlog camera frame', '.ddzv4-frame-corner'],
  ['DZlog filename', '.ddzv4-camera-filename'],
  ['MY LOCK original art', "mylock-candy-soft-trio.webp"],
  ['desktop boundary', '@media (min-width:1051px)'],
  ['mobile fallback', '@media (max-width:1050px)'],
]) {
  assert.ok(heroV4Css.includes(text), 'PC Hero v4: missing ' + item);
}
assert.ok(!heroV4Css.includes('.ddzv4-lock-shapes'), 'MY LOCK must not return to generic shapes');
assert.match(heroR4Css, /w=2560&q=88/, 'R4 hero should request high-resolution photographic backdrop');
assert.match(heroR4Css, /\.hero \.hero-decor-books\{\s*display:none!important/, 'R4 hero should not composite low-resolution desk-book cut-out');
assert.match(heroR4Css, /\.hero \.hero-decor-leaf\{\s*display:none!important/, 'R4 hero should not composite low-resolution leaf cut-out');
assert.doesNotMatch(heroR4Css, /url\('\/assets\/podium\.webp'\)/, 'R4 hero must not upscale low-resolution podium texture');

const appVisualCss = readFileSync('public/apps/app-visual-r3.css', 'utf8');
const tokens = readFileSync('public/styles/tokens.css', 'utf8');
const components = readFileSync('public/styles/components.css', 'utf8');
const scripts = readFileSync('public/home-r2.js', 'utf8');
assert.match(stylesheet, /@media\(max-width:760px\)/);
assert.match(stylesheet, /@media\(max-width:450px\)/);
assert.match(stylesheet, /prefers-reduced-motion/);
assert.match(detailCss, /screen-story-grid/);
assert.match(homeVisualCss, /assets\/podium\.webp/);
assert.match(appVisualCss, /assets\/podium\.webp/);
assert.match(tokens, /--color-green/);
assert.match(components, /\.button/);
assert.match(scripts, /Escape/);

for (const [file, css] of [['home-r2.css', stylesheet], ['app-detail.css', detailCss], ['home-visual-r3.css', homeVisualCss], ['home-hero-r4.css', heroR4Css], ['home-polish-r41.css', polishR41Css], ['home-hero-v4-pc.css', heroV4Css], ['app-visual-r3.css', appVisualCss]]) {
  for (const match of css.matchAll(/url\(['"]?(\/[^)'"]+)['"]?\)/g)) {
    assert.ok(existsSync(resolveAsset(match[1])), file + ': missing referenced asset ' + match[1]);
  }
}
for (const file of ['public/home-r2.js', 'scripts/check.mjs', 'scripts/build.mjs', 'scripts/preview-local.mjs', 'scripts/visual-check.mjs']) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  assert.equal(result.status, 0, file + ': invalid JavaScript\n' + result.stderr);
}
console.log('Static QA passed: homepage, three app pages, navigation, local assets and JS syntax.');
