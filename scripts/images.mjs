import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const sourceIndex = process.argv.indexOf('--source-dir');
if (sourceIndex < 0 || !process.argv[sourceIndex + 1]) throw new Error('Usage: npm run images -- --source-dir /path/to/original/photos');
const source = resolve(process.argv[sourceIndex + 1]);
const destination = resolve('public/images');
await mkdir(destination, { recursive:true });

const images = [
  { name:'desk', file:'IMG_7721.jpeg', ratio:4/5, focus:[.64,.42], widths:[640,960,1440] },
  { name:'desk-mobile', file:'IMG_7721.jpeg', ratio:3/2, focus:[.64,.42], widths:[640,960,1440] },
  { name:'camping', file:'IMG_4537.JPG', ratio:4/3, focus:[.32,.48], widths:[640,960,1440] },
  { name:'snow', file:'IMG_2216.JPG', ratio:3/4, focus:[.5,.5], widths:[480,640,768] },
];

const manifest = [];
for (const item of images) {
  const original = await sharp(join(source, item.file)).rotate().toBuffer();
  const meta = await sharp(original).metadata();
  const width = Math.floor(Math.min(meta.width, meta.height * item.ratio));
  const height = Math.floor(width / item.ratio);
  const left = Math.round((meta.width - width) * item.focus[0]);
  const top = Math.round((meta.height - height) * item.focus[1]);
  for (const size of item.widths) {
    for (const type of ['webp','jpg']) {
      const output = join(destination, `${item.name}-${size}.${type}`);
      const budget = (item.name.startsWith('desk') ? 250 : 180) * 1024;
      let quality = 79, buffer;
      do {
        const image = sharp(original).extract({ left, top, width, height }).resize(size, Math.round(size / item.ratio));
        buffer = await (type === 'webp' ? image.webp({ quality, effort:6 }) : image.jpeg({ quality, mozjpeg:true })).toBuffer();
        if (buffer.length <= budget || quality <= 59) break;
        quality -= 5;
      } while (true);
      if (buffer.length > budget) throw new Error(`${item.name}-${size}.${type} exceeds its image budget`);
      await writeFile(output, buffer);
      manifest.push({ file:`${item.name}-${size}.${type}`, width:size, height:Math.round(size / item.ratio), bytes:buffer.length, quality });
    }
  }
}
const portrait = await sharp(join(source, 'IMG_7721.jpeg')).rotate().resize(470,630,{ fit:'cover', position:sharp.strategy.attention }).jpeg({ quality:85 }).toBuffer();
const panel = Buffer.from(`<svg width="730" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="730" height="630" fill="#131416"/><g fill="#EDEEEF" font-family="sans-serif"><text x="56" y="244" font-size="82" font-weight="600">Patrick Pan</text><text x="60" y="330" font-size="28">Brand Events</text><text x="60" y="374" font-size="28">&amp; Digital Marketing</text></g><text x="60" y="540" fill="#B3A0E6" font-family="sans-serif" font-size="20">resume.datatrade.top</text></svg>`);
await sharp({ create:{ width:1200, height:630, channels:3, background:'#131416' } }).composite([{ input:panel,left:0,top:0 }, { input:portrait,left:730,top:0 }]).jpeg({ quality:87 }).toFile(join(destination,'share.jpg'));
await writeFile('docs/image-manifest.json', JSON.stringify(manifest,null,2)+'\n');
console.log(`Exported ${manifest.length} responsive images and a 1200 × 630 sharing image; original files are unchanged.`);
