import sharp from 'sharp';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const sourceIndex = process.argv.indexOf('--source-dir');
if (sourceIndex < 0 || !process.argv[sourceIndex + 1]) throw new Error('Usage: npm run images -- --source-dir /path/to/original/photos');
const source = resolve(process.argv[sourceIndex + 1]);
const destination = resolve('public/images');
await mkdir(destination, { recursive:true });

// Every published image is a crop of a real photograph supplied by the owner.
// `focus` is the point of the frame that must survive the crop: 0 is the left or
// top edge, 1 the right or bottom edge.
const images = [
  { name:'desk', file:'IMG_7721.jpeg', ratio:4/5, focus:[.64,.42], widths:[640,960,1440], budget:250 },
  { name:'desk-mobile', file:'IMG_7721.jpeg', ratio:3/2, focus:[.64,.42], widths:[640,960,1440], budget:250 },
  { name:'work-desk', file:'IMG_7721.jpeg', ratio:3/2, focus:[.5,.46], widths:[640,960,1440], budget:220 },
  { name:'work-crew', file:'IMG_7598.jpeg', ratio:3/2, focus:[.5,.46], widths:[640,960,1440], budget:220 },
  { name:'work-table', file:'beauty_1674806609290.JPG', ratio:3/2, focus:[.5,.52], widths:[640,960,1440], budget:220 },
  { name:'camping', file:'IMG_4537.JPG', ratio:4/3, focus:[.32,.48], widths:[640,960,1440], budget:200 },
  { name:'snow', file:'IMG_2216.JPG', ratio:3/4, focus:[.5,.5], widths:[480,640,768], budget:200 },
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
      const budget = item.budget * 1024;
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
const panel = Buffer.from(`<svg width="730" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="730" height="630" fill="#08090B"/><circle cx="96" cy="150" r="200" fill="#FFB25A" opacity="0.22"/><circle cx="640" cy="520" r="220" fill="#56D8D0" opacity="0.10"/><g fill="#F3EEE6" font-family="sans-serif"><text x="56" y="256" font-size="80" font-weight="600">Patrick Pan</text><text x="60" y="340" font-size="28" fill="#9B9CA5">Brand Events</text><text x="60" y="382" font-size="28" fill="#9B9CA5">&amp; Digital Marketing</text></g><circle cx="66" cy="112" r="7" fill="#FF4D7D"/><text x="86" y="119" fill="#9B9CA5" font-family="sans-serif" font-size="20" letter-spacing="3">REC 16:00:00:00</text><text x="60" y="546" fill="#FFB25A" font-family="sans-serif" font-size="20">resume.datatrade.top</text></svg>`);
await sharp({ create:{ width:1200, height:630, channels:3, background:'#08090B' } }).composite([{ input:panel,left:0,top:0 }, { input:portrait,left:730,top:0 }]).jpeg({ quality:87 }).toFile(join(destination,'share.jpg'));

for (const stale of process.argv.slice(2).filter(arg => arg.startsWith('--remove='))) {
  await rm(join(destination, stale.slice('--remove='.length)), { force:true });
}
await writeFile('docs/image-manifest.json', JSON.stringify(manifest,null,2)+'\n');
console.log(`Exported ${manifest.length} responsive images and a 1200 x 630 sharing image; original files are unchanged.`);
