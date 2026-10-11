import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const html = readFileSync('public/index.html', 'utf8');
assert.match(html, /lang="ko"/);
assert.match(html, /name="viewport"/);
assert.match(html, /두도지공방/);
assert.match(html, /문의 접수 준비 중/);
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(html.includes(`id="${match[1]}"`), `Missing anchor: ${match[1]}`);
}
console.log('Site checks passed');
