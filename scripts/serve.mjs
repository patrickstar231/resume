import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { routes } from '../src/content/routes.js';

const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.xml':'application/xml', '.txt':'text/plain; charset=utf-8', '.webp':'image/webp', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.woff2':'font/woff2' };

export function createPreviewServer(directory = 'dist') {
  const root = resolve(directory);
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      const path = decodeURIComponent(url.pathname);
      const exactRoute = routes.find(route => route.path === path);
      if (!path.endsWith('/') && routes.some(route => route.path === `${path}/`)) {
        response.writeHead(308, { Location:`${path}/${url.search}` }); response.end(); return;
      }
      let file = resolve(root, `.${path}`);
      if (file !== root && !file.startsWith(root + sep)) { response.writeHead(400); response.end('Invalid path'); return; }
      if (exactRoute) file = resolve(file, 'index.html');
      let status = 200;
      try { if (!(await stat(file)).isFile()) throw new Error('Not a file'); }
      catch { file = resolve(root, '404.html'); status = 404; }
      let body = await readFile(file);
      const headers = { 'Content-Type':types[extname(file)] || 'application/octet-stream', 'X-Content-Type-Options':'nosniff', 'Cache-Control':'no-cache', Vary:'Accept-Encoding' };
      const acceptsGzip = (request.headers['accept-encoding'] || '').split(',').some(part => {
        const [name, ...parameters] = part.trim().split(';');
        const quality = parameters.find(value => value.trim().startsWith('q='));
        return name === 'gzip' && (!quality || Number(quality.trim().slice(2)) > 0);
      });
      if (acceptsGzip && /\.(html|css|js|json|xml|txt|svg)$/.test(file) && body.length > 512) {
        body = gzipSync(body);
        headers['Content-Encoding'] = 'gzip';
      }
      headers['Content-Length'] = body.length;
      response.writeHead(status, headers);
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch {
      if (!response.headersSent) response.writeHead(400, { 'Content-Type':'text/plain' });
      response.end('Invalid request');
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const index = process.argv.indexOf('--port');
  const port = Number(index >= 0 ? process.argv[index + 1] : process.env.PORT || 4173);
  createPreviewServer().listen(port, '0.0.0.0', () => console.log(`Preview: http://localhost:${port}`));
}
