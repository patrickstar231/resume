import sharp from 'sharp';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const sourceIndex = process.argv.indexOf('--source-dir');
if (sourceIndex < 0 || !process.argv[sourceIndex + 1]) throw new Error('Usage: npm run images -- --source-dir /path/to/original/photos');
const source = resolve(process.argv[sourceIndex + 1]);
const destination = resolve('public/images');
await mkdir(destination, { recursive:true });

// Every published image is a crop of a real photograph. `file` is relative to the
// source directory; case photographs live in the repository under source/cases/.
// `focus` is the point that must survive the crop: 0 = left or top edge, 1 = right or bottom.
const images = [
  { name:'work-crew', file:'IMG_7598.jpeg', ratio:3/2, focus:[.5,.46], widths:[640,960,1440], budget:220 },
  { name:'work-table', file:'beauty_1674806609290.JPG', ratio:3/2, focus:[.5,.52], widths:[640,960,1440], budget:220 },
  { name:'camping', file:'IMG_4537.JPG', ratio:4/3, focus:[.32,.48], widths:[640,960,1440], budget:200 },
  { name:'snow', file:'IMG_2216.JPG', ratio:3/4, focus:[.5,.5], widths:[480,640,768], budget:200 },
  { name:'case-porsche', file:'source/cases/porsche.jpg', ratio:16/9, focus:[.5,.5], widths:[720,1440], budget:260, fromRepo:true },
  { name:'case-huawei', file:'source/cases/huawei.jpg', ratio:16/9, focus:[.5,.5], widths:[720,1440], budget:260, fromRepo:true },
  { name:'case-tencent', file:'source/cases/tencent.jpg', ratio:16/9, focus:[.5,.5], widths:[720,1440], budget:260, fromRepo:true },
];

const manifest = [];
for (const item of images) {
  const origin = item.fromRepo ? resolve(item.file) : join(source, item.file);
  const original = await sharp(origin).rotate().toBuffer();
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

// Sharing card. Uses the team photograph; nothing from a private album.
const portrait = await sharp(join(source, 'IMG_7598.jpeg')).rotate().resize(470,630,{ fit:'cover', position:sharp.strategy.attention }).jpeg({ quality:85 }).toBuffer();
const panel = Buffer.from(`<svg width="730" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="730" height="630" fill="#0B0A08"/><circle cx="120" cy="140" r="210" fill="#FFB25A" opacity="0.18"/><circle cx="660" cy="540" r="200" fill="#1F3A38" opacity="0.5"/><g font-family="serif"><text x="56" y="258" font-size="84" font-weight="600" fill="#F4F0E9">Patrick Pan</text></g><g fill="#8A857C" font-family="sans-serif"><text x="60" y="340" font-size="27">品牌活动与数字营销</text><text x="60" y="382" font-size="27">Brand Events &amp; Digital Marketing</text></g><circle cx="66" cy="112" r="7" fill="#FFB25A"/><text x="86" y="119" fill="#8A857C" font-family="monospace" font-size="19">REC 16:00:00:00</text><text x="60" y="546" fill="#FFB25A" font-family="monospace" font-size="19">resume.datatrade.top</text></svg>`);
await sharp({ create:{ width:1200, height:630, channels:3, background:'#0B0A08' } }).composite([{ input:panel,left:0,top:0 }, { input:portrait,left:730,top:0 }]).jpeg({ quality:87 }).toFile(join(destination,'share.jpg'));

for (const stale of process.argv.slice(2).filter(arg => arg.startsWith('--remove='))) {
  await rm(join(destination, stale.slice('--remove='.length)), { force:true });
}
await writeFile('docs/image-manifest.json', JSON.stringify(manifest,null,2)+'\n');
console.log(`Exported ${manifest.length} responsive images and a 1200 x 630 sharing image; original files are unchanged.`);
