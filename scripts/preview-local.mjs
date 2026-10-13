import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { resolve, sep, extname } from 'node:path';

const root = resolve('dist');
const port = Number(process.env.PORT || 4173);
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
};

if (!existsSync(root)) {
  console.error('Missing dist/. Run npm run build first.');
  process.exit(1);
}

createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end('Bad request'); return; }
  if (pathname.includes('\\') || pathname.includes('\0')) {
    res.writeHead(400).end('Bad path'); return;
  }
  const candidate = resolve(root, '.' + pathname);
  if (candidate !== root && !candidate.startsWith(root + sep)) {
    res.writeHead(403).end('Forbidden'); return;
  }
  let file = candidate;
  try {
    if (statSync(file).isDirectory()) file = resolve(file, 'index.html');
    if (!statSync(file).isFile()) throw new Error('Not a file');
  } catch { res.writeHead(404).end('Not found'); return; }
  res.writeHead(200, {
    'Content-Type': mime[extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
  });
  const stream = createReadStream(file);
  stream.on('error', () => res.destroy());
  stream.pipe(res);
}).listen(port, '127.0.0.1', () => {
  console.log(`Dudozi local review: http://127.0.0.1:${port}/`);
  console.log('Press Ctrl+C to stop. This does not publish the website.');
});
