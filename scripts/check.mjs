import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const html=readFileSync('public/index.html','utf8');
const css=readFileSync('public/home-r2.css','utf8');
const js=readFileSync('public/home-r2.js','utf8');
assert.match(html,/lang="ko"/);
assert.match(html,/name="viewport"/);
assert.match(html,/일상에 작은 편리함을/);
assert.match(html,/취향에 작은 즐거움을/);
assert.match(html,/자주 쓰는 기능은 더 편리하게/);
assert.match(html,/id="dzlog"/);
assert.match(html,/id="grigle"/);
assert.match(html,/id="mylock"/);
assert.ok(html.indexOf('id="dzlog"')<html.indexOf('id="grigle"'));
assert.ok(html.indexOf('id="grigle"')<html.indexOf('id="mylock"'));
assert.match(html,/프로토타입/);
assert.match(html,/개발 중/);
assert.match(html,/키보드/);
assert.match(css,/@media\(max-width:760px\)/);
assert.match(css,/@media\(max-width:450px\)/);
assert.match(js,/Escape/);
assert.ok(existsSync('public/assets/ddz-mark.svg'));
assert.ok(existsSync('public/support.html'));
for(const match of html.matchAll(/href="#([^"]+)"/g)){assert.ok(html.includes('id="'+match[1]+'"'),'Missing anchor '+match[1]);}
for(const match of html.matchAll(/(?:src|href)="\/(?!#)([^"]+)"/g)){assert.ok(existsSync('public/'+match[1]),'Missing local asset '+match[1]);}
console.log('Homepage R2 static checks passed');
