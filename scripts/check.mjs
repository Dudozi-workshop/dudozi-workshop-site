import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync('public/index.html', 'utf8');
const css = readFileSync('public/theme.css', 'utf8');
const support = readFileSync('public/support.html', 'utf8');
assert.match(html, /lang="ko"/);
assert.match(html, /name="viewport"/);
assert.match(html, /두도지공방/);
assert.match(html, /id="dzlog"/);
assert.match(html, /id="grigle"/);
assert.match(html, /id="mylock"/);
assert.match(html, /프로토타입/);
assert.match(html, /개발 중/);
assert.ok(html.indexOf('id="dzlog"') < html.indexOf('id="grigle"'));
assert.ok(html.indexOf('id="grigle"') < html.indexOf('id="mylock"'));
assert.match(css, /@media\(max-width:720px\)/);
assert.match(support, /문의 접수 준비 중/);
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(html.includes('id="' + match[1] + '"'), 'Missing anchor: ' + match[1]);
}
console.log('Site checks passed');
