import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { routes, pageMeta, resolveRoute, translatedPath } from '../src/content/routes.js';
import { projects } from '../src/content/projects.js';
import { experiences, profile } from '../src/content/profile.js';
import { createPreviewServer } from '../scripts/serve.mjs';

test('every public route has matching static content, language and canonical metadata', async () => {
  assert.equal(routes.length, 10);
  for (const route of routes) {
    const html = await readFile(join('dist', route.path, 'index.html'), 'utf8');
    assert.equal((html.match(/<h1\b/g) || []).length, 1, route.path);
    assert.ok(html.includes(`lang="${route.locale === 'en' ? 'en' : 'zh-Hans'}"`), route.path);
    assert.ok(html.includes(`<link rel="canonical" href="${pageMeta(route).canonical}">`));
    if (route.kind !== 'project') assert.ok(html.includes(`mailto:${profile.email}`), route.path);
    assert.ok(html.includes('id="main"'));
    if (route.kind === 'project') assert.ok(html.includes(projects.find(p => p.id === route.projectId)[route.locale].title));
    if (route.kind === 'resume') for (const item of experiences) assert.ok(html.includes(item.company[route.locale]));
  }
});

test('language switches preserve the page and existing anchors remain readable without JavaScript', async () => {
  for (const route of routes) assert.equal(translatedPath(resolveRoute(translatedPath(route))), route.path);
  for (const locale of ['/', '/zh/']) {
    const html = await readFile(join('dist', locale, 'index.html'), 'utf8');
    for (const id of ['about','independent','work','contact','projects','life']) assert.ok(html.includes(`id="${id}"`));
    assert.ok(html.includes('<details class="earlier-experience">'));
    assert.ok(html.includes('2012.01'));
    for (const href of ['https://hk.datatrade.top/','https://xhslink.com/m/5DkJLXbYHA4','https://blog.csdn.net/patrickstar231','https://www.zhihu.com/people/patrick-pan-7']) assert.ok(html.includes(`href="${href}"`));
    assert.ok(!html.includes('opacity:0'));
  }
});

test('generated work photography has responsive modern and fallback formats', async () => {
  for (const name of ['work-planning','work-onsite','work-review']) {
    for (const width of [640,960,1440]) {
      for (const extension of ['webp','jpg']) await readFile(join('public','images',`${name}-${width}.${extension}`));
    }
  }
});

test('all document links lead to generated pages, resources or existing fragments', async () => {
  for (const route of routes) {
    const html = await readFile(join('dist', route.path, 'index.html'), 'utf8');
    for (const [,href] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      if (!href.startsWith('/') && !href.startsWith('#')) continue;
      const url = new URL(href, `https://resume.datatrade.top${route.path}`);
      const target = routes.find(r => r.path === url.pathname);
      assert.ok(target, `${route.path} -> ${href}`);
      if (url.hash) {
        const content = await readFile(join('dist', target.path, 'index.html'), 'utf8');
        assert.ok(content.includes(`id="${url.hash.slice(1)}"`), href);
      }
    }
  }
});

test('deployment output excludes removed models, unpublished metrics and credentials', async () => {
  const entries = await readdir('dist');
  assert.ok(!entries.includes('desktop_pc') && !entries.includes('planet'));
  for (const route of routes) {
    const html = await readFile(join('dist', route.path, 'index.html'), 'utf8');
    assert.doesNotMatch(html, /github_pat_|randomuser\.me|<canvas|Billion-Dollar|1\.2万|9\.8亿|23亿|to_email|VITE_APP_EMAILJS|needs_review|\b1[3-9]\d{9}\b/);
    assert.doesNotMatch(html, /[—–]/);
    assert.ok(!html.includes('2023/06/13'));
  }
});

test('first-route script fits the PRD budget and contains no WebGL application dependency', async () => {
  const html = await readFile('dist/index.html','utf8');
  const match = html.match(/<script[^>]*src="(\/assets\/[^"]+\.js)"/);
  assert.ok(match);
  const bytes = await readFile(join('dist', match[1]));
  assert.ok(gzipSync(bytes).length <= 180 * 1024);
  const pkg = JSON.parse(await readFile('package.json','utf8'));
  for (const old of ['three','@react-three/fiber','@react-three/drei','maath','framer-motion','@emailjs/browser','react-tilt','react-vertical-timeline-component']) assert.ok(!pkg.dependencies[old]);
});

test('HTTP preview serves real pages, preserves queries during redirects, and returns genuine 404s', async (t) => {
  const server = createPreviewServer();
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const root = `http://127.0.0.1:${server.address().port}`;
  for (const route of routes) assert.equal((await fetch(root + route.path)).status,200,route.path);
  const compressed = await fetch(root + '/', { headers:{ 'Accept-Encoding':'gzip' } });
  assert.equal(compressed.headers.get('content-encoding'),'gzip');
  assert.ok((await compressed.text()).includes('id="main"'));
  const identity = await fetch(root + '/', { headers:{ 'Accept-Encoding':'gzip;q=0' } });
  assert.equal(identity.headers.get('content-encoding'),null);
  const redirect = await fetch(root + '/zh/resume?source=test',{ redirect:'manual' });
  assert.equal(redirect.status,308);
  assert.equal(redirect.headers.get('location'),'/zh/resume/?source=test');
  for (const path of ['/not-a-page/','/zh/does-not-exist/','/images/missing.webp']) {
    const response = await fetch(root + path);
    assert.equal(response.status,404);
    assert.ok((await response.text()).includes('This page isn’t here.'));
  }
});
