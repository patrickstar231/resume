import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { render } from '../.ssr/entry-server.js';
import { routes, resolveRoute, pageMeta, translatedPath } from '../src/content/routes.js';
import { profile } from '../src/content/profile.js';

const template = await readFile('dist/index.html', 'utf8');
const year = new Date().getUTCFullYear();
const latinFont = (await readdir('dist/assets')).find(name => /^manrope-latin-wght-normal-.*\.woff2$/.test(name));
const escape = text => String(text).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const isPreview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';

for (const route of [...routes, resolveRoute('/404.html')]) {
  const meta = pageMeta(route), alternate = translatedPath(route);
  const en = route.locale === 'en' ? route.path : alternate;
  const zh = route.locale === 'zh' ? route.path : alternate;
  const data = { '@context':'https://schema.org', '@type':'ProfilePage', url:meta.canonical, mainEntity: { '@type':'Person', name:profile.name, alternateName:profile.chineseName, url:profile.origin, email:profile.email, jobTitle:profile.title[route.locale] } };
  const tags = [
    ...(latinFont ? [`<link rel="preload" href="/assets/${latinFont}" as="font" type="font/woff2" crossorigin>`] : []),
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}">`,
    `<meta name="robots" content="${isPreview || route.kind === '404' ? 'noindex, nofollow' : 'index, follow'}">`,
    `<meta property="og:title" content="${escape(meta.title)}">`,
    `<meta property="og:description" content="${escape(meta.description)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Patrick Pan">`,
    `<meta property="og:image" content="${profile.origin}/images/share.jpg">`,
    `<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="Patrick Pan, Brand Events and Digital Marketing">`,
    `<meta property="og:locale" content="${route.locale === 'zh' ? 'zh_CN' : 'en_US'}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
  ];
  if (route.kind !== '404') tags.push(
    `<link rel="canonical" href="${meta.canonical}">`,
    `<meta property="og:url" content="${meta.canonical}">`,
    `<link rel="alternate" hreflang="en" href="${profile.origin}${en}">`,
    `<link rel="alternate" hreflang="zh-Hans" href="${profile.origin}${zh}">`,
    `<link rel="alternate" hreflang="x-default" href="${profile.origin}${en}">`,
  );
  if (route.kind === 'home') tags.push(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
  const page = template.replace(/<html lang="en">/, `<html lang="${meta.language}" data-build-year="${year}">`)
    .replace('<!--page-head-->', tags.join('\n'))
    .replace('<div id="root"></div>', `<div id="root">${render(route.path, year)}</div>`);
  const file = route.kind === '404' ? 'dist/404.html' : join('dist', route.path, 'index.html');
  await mkdir(dirname(file), { recursive:true });
  await writeFile(file, page);
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${profile.origin}${route.path}</loc></url>`).join('')}</urlset>\n`;
await writeFile('dist/sitemap.xml', sitemap);
await writeFile('dist/robots.txt', isPreview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${profile.origin}/sitemap.xml\n`);
console.log(`Generated ${routes.length} content pages, 404, sitemap and robots.txt.`);
