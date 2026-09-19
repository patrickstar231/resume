/**
 * 无头 Chrome 视觉/行为复验 —— SCROLL COASTER 方向 B
 *
 * 用法：
 *   npm run preview -- --port 4290
 *   PUPPETEER=/tmp/vischeck/node_modules node tools/verify-headless.mjs http://localhost:4290
 *
 * 依赖 puppeteer-core + 系统 Chrome，装在仓库外（/tmp），**不进 package.json**。
 * 截图落 .design-qa/（已 gitignore 之外的目录，不入库）。
 *
 * WebGL 画面是否真空白：readback 一张 WebGL canvas 需要 preserveDrawingBuffer，
 * 为不加这层开销，改为「截图 → 用浏览器自身解码成 2D canvas → 统计像素」。
 */
import fs from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:4290';
const PUPPETEER = process.env.PUPPETEER ?? '/tmp/vischeck/node_modules';
const OUT = process.env.OUT ?? '.design-qa';

const { pathToFileURL } = await import('node:url');
const { existsSync } = await import('node:fs');
// 不同 puppeteer-core 版本的 ESM 入口位置不一致，逐个探测。
const CANDIDATES = [
  'lib/esm/puppeteer/puppeteer-core.js',
  'lib/puppeteer/puppeteer-core.js',
  'lib/cjs/puppeteer/puppeteer-core.js',
];
const entry =
  CANDIDATES.map((c) => `${PUPPETEER}/puppeteer-core/${c}`).find((p) => existsSync(p)) ??
  `${PUPPETEER}/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js`;
const mod = await import(pathToFileURL(entry).href);
const puppeteer = mod.default ?? mod;

fs.mkdirSync(OUT, { recursive: true });

const EXEC = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARGS = [
  '--no-sandbox',
  '--enable-unsafe-swiftshader',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--font-render-hinting=none',
];

const browser = await puppeteer.launch({ executablePath: EXEC, args: ARGS, headless: 'new' });
const problems = [];
const consoleTotals = [];

/* ---------- 通用工具 ---------- */

async function session(name, viewport, opts = {}) {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    // 反爬外链 / favicon / React devtools 提示不计入站点自身缺陷
    if (/favicon|ERR_|net::|Download the React DevTools|Failed to load resource/i.test(t)) return;
    errors.push(t);
  });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  await page.setViewport(viewport);
  if (opts.reduced) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  }
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await settle(page, opts.settle ?? 3200);
  consoleTotals.push({ name, errors });
  return page;
}

const settle = (page, ms) => new Promise((r) => setTimeout(r, ms));

async function shot(page, file) {
  const path = `${OUT}/${file}`;
  await page.screenshot({ path });
  return path;
}

/** 滚到全局进度的某个百分比处（用真实滚动，不走 FAST PASS）。 */
async function scrollToProgress(page, pct) {
  await page.evaluate((p) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.round(max * p));
  }, pct);
  await settle(page, 1500);
}

/** 截图像素统计：整幅近均匀 = 画面塌了。 */
async function pixelStats(page, pngPath, region) {
  const b64 = fs.readFileSync(pngPath).toString('base64');
  const scratch = await browser.newPage();
  await scratch.goto('about:blank');
  const res = await scratch.evaluate(
    async (data, box) => {
      const img = new Image();
      img.src = `data:image/png;base64,${data}`;
      await img.decode();
      const cv = document.createElement('canvas');
      cv.width = img.width;
      cv.height = img.height;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const { data: px } = ctx.getImageData(
        box.x,
        box.y,
        Math.max(box.w, 1),
        Math.max(box.h, 1),
      );
      let n = 0;
      let sum = 0;
      let sum2 = 0;
      let uniq = new Set();
      for (let i = 0; i < px.length; i += 40) {
        const v = (px[i] + px[i + 1] + px[i + 2]) / 3;
        sum += v;
        sum2 += v * v;
        n += 1;
        if (n % 7 === 0) uniq.add(`${px[i] >> 4},${px[i + 1] >> 4},${px[i + 2] >> 4}`);
      }
      const mean = sum / n;
      return {
        mean: Math.round(mean),
        sd: Math.round(Math.sqrt(Math.max(sum2 / n - mean * mean, 0))),
        colors: uniq.size,
        dims: `${img.width}x${img.height}`,
      };
    },
    b64,
    region,
  );
  await scratch.close();
  return res;
}

const check = (label, cond, detail) => {
  if (!cond) problems.push(`${label}: ${detail}`);
  console.log(`  ${cond ? 'OK  ' : 'FAIL'} ${label} — ${detail}`);
};

/* ---------- 布局度量 ---------- */

async function metrics(page, label, opts = {}) {
  const { canvas: wantCanvas = true, flow = false } = opts;
  const m = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const hud = document.querySelector('.fixed.inset-x-0.bottom-0');
    const header = document.querySelector('header');
    const effOpacity = (el) => {
      let o = 1;
      let n = el;
      while (n && n.nodeType === 1) {
        o *= parseFloat(getComputedStyle(n).opacity) || 0;
        if (o < 0.02) break;
        n = n.parentElement;
      }
      return o;
    };
    const visiblePanels = [...document.querySelectorAll('main section, [class*="hard-edge"]')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return (
          effOpacity(el) > 0.5 && r.width > 40 && r.height > 40 && r.bottom > 0 && r.top < window.innerHeight
        );
      })
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          id: el.id || el.className.toString().slice(0, 18),
          box: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)],
        };
      });
    const smallest = (() => {
      let min = 999;
      document.querySelectorAll('body *').forEach((el) => {
        if (!el.textContent?.trim()) return;
        if (el.children.length) return;
        if (el.closest('[aria-hidden="true"]')) return;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs < min) min = fs;
      });
      return Math.round(min * 100) / 100;
    })();
    const targets = [...document.querySelectorAll('a,button')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.top < window.innerHeight && r.bottom > 0;
    });
    const smallTargets = targets
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.height < 44 - 0.5 || r.width < 30;
      })
      .map((el) => `${el.tagName}:${(el.textContent || '').trim().slice(0, 16)}`);
    return {
      innerW: window.innerWidth,
      innerH: window.innerHeight,
      scrollW: document.documentElement.scrollWidth,
      bodyScrollW: document.body.scrollWidth,
      docH: document.documentElement.scrollHeight,
      canvas: canvas ? `${canvas.width}x${canvas.height}` : 'none',
      hud: hud?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 64) ?? '',
      headerH: Math.round(header?.getBoundingClientRect().height ?? 0),
      visiblePanels,
      smallestFont: smallest,
      smallTargets: [...new Set(smallTargets)].slice(0, 6),
      flowOpaque: [...document.querySelectorAll('main section[id]')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.height > 80 && r.bottom > 4 && r.top < window.innerHeight - 4;
        })
        .every((el) => effOpacity(el) > 0.98),
    };
  });

  console.log(`[${label}] overflow=${m.bodyScrollW - m.innerW}px canvas=${m.canvas} doc=${m.docH}px header=${m.headerH}px`);
  console.log(`  HUD: ${m.hud}`);
  console.log(
    `  可见面板: ${m.visiblePanels.map((p) => `${p.id}${JSON.stringify(p.box)}`).join(' ') || '无'}`,
  );

  check(`${label} 无横向溢出`, m.bodyScrollW === m.innerW, `scrollWidth=${m.bodyScrollW} innerWidth=${m.innerW}`);
  check(
    `${label} 乘坐长度 ≥2 视口`,
    m.docH >= m.innerH * 2,
    `docH=${m.docH} innerH=${m.innerH}`,
  );
  check(`${label} header 不吃掉画幅`, m.headerH <= 60, `headerH=${m.headerH}`);
  check(`${label} 正文字号 ≥14px`, m.smallestFont >= 13.9, `最小字号=${m.smallestFont}px`);
  check(
    `${label} 可交互目标 ≥44px`,
    m.smallTargets.length === 0,
    m.smallTargets.length ? `过小: ${m.smallTargets.join(',')}` : '全部达标',
  );
  if (wantCanvas) {
    check(`${label} WebGL 有画布`, m.canvas !== 'none', `canvas=${m.canvas}`);
  }

  if (flow) {
    // 静态卡片流按设计就该铺满阅读宽度，检查点换成「读到的一定是全不透明的」
    check(`${label} 卡片流内容恒为不透明`, m.flowOpaque, `flowOpaque=${m.flowOpaque}`);
    return m;
  }

  // 构图自检（代替肉眼）：同时只允许一张面板在读，且不能把 3D 世界挡死。
  const area = (b) => Math.max(0, b[2] - b[0]) * Math.max(0, b[3] - b[1]);
  const inter = (a, b) =>
    Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) *
    Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
  let worstOverlap = 0;
  let worstPair = '';
  for (let a = 0; a < m.visiblePanels.length; a += 1) {
    for (let b = a + 1; b < m.visiblePanels.length; b += 1) {
      const A = m.visiblePanels[a].box;
      const B = m.visiblePanels[b].box;
      const ov = inter(A, B);
      // 父子嵌套的同级卡片会完全重合，只有「跨面板」重叠才算问题
      if (ov > 0 && Math.abs(area(A) - ov) / Math.max(area(A), area(B), 1) < 0.98) {
        if (ov > worstOverlap) {
          worstOverlap = ov;
          worstPair = `${m.visiblePanels[a].id} × ${m.visiblePanels[b].id}`;
        }
      }
    }
  }
  const vpArea = m.innerW * m.innerH;
  const biggest = m.visiblePanels.reduce((mx, p) => Math.max(mx, area(p.box)), 0);
  const covered = Math.round((100 * biggest) / vpArea);
  console.log(
    `  构图: 面板重叠=${Math.round(worstOverlap)}px² (${worstPair || '无'}) 最大单块覆盖率=${covered}%`,
  );
  check(
    `${label} 面板互不遮挡`,
    worstOverlap < vpArea * 0.03,
    worstPair ? `重叠 ${Math.round(worstOverlap)}px² ${worstPair}` : '无跨面板重叠',
  );
  check(`${label} DOM 未挡死 3D 世界`, covered <= 46, `最大面板覆盖视口 ${covered}%`);
  return m;
}

/* ================== 桌面 1440×900：五帧 ================== */

console.log('\n=== DESKTOP 1440×900 ===');

/** 售票亭只活 2.45s，必须用一条不等 networkidle 的独立会话去抓它。 */
{
  const sp = await browser.newPage();
  await sp.setViewport({ width: 1440, height: 900 });
  await sp.goto(BASE, { waitUntil: 'domcontentloaded' });
  let mask = 'timeout';
  try {
    await sp.waitForSelector('.ticket-perf', { timeout: 4000 });
    mask = await sp.evaluate(() => {
      const el = document.querySelector('.ticket-perf');
      const cs = getComputedStyle(el);
      const v = cs.maskImage && cs.maskImage !== 'none' ? cs.maskImage : cs.webkitMaskImage;
      return v && v !== 'none' ? 'applied' : 'none';
    });
    await settle(sp, 500);
    await shot(sp, 'd0-splash-ticket.png');
  } catch (e) {
    mask = `no-el (${e.message.slice(0, 40)})`;
  }
  console.log(`  票根齿孔 mask: ${mask}`);
  check('票根齿孔用 CSS mask 实现', mask === 'applied', `mask=${mask}`);
  await sp.close();
}

const desk = await session('desktop', { width: 1440, height: 900 }, { settle: 3200 });
const steps = [0, 0.25, 0.5, 0.75, 1];
let i = 0;
for (const p of steps) {
  i += 1;
  await scrollToProgress(desk, p);
  const file = `d${i}-progress-${String(Math.round(p * 100)).padStart(3, '0')}.png`;
  const path = await shot(desk, file);
  const px = await pixelStats(desk, path, { x: 0, y: 0, w: 1440, h: 900 });
  console.log(`  帧 ${file} 像素 mean=${px.mean} sd=${px.sd} 色数=${px.colors} ${px.dims}`);
  check(`desktop@${p} 3D 画面非空白`, px.sd > 6 && px.colors > 12, `sd=${px.sd} colors=${px.colors}`);
  await metrics(desk, `desktop@${Math.round(p * 100)}%`, { canvas: true });
}

// FAST PASS：点导航 → 平滑滚到对应区间中点，且不劫持 wheel
const fp = await desk.evaluate(async () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector('header nav a[href="#station-1"]')?.click();
  await new Promise((r) => setTimeout(r, 2200));
  return { at: window.scrollY, max };
});
const want = ((0.16 + 0.33) / 2) * fp.max;
check(
  'FAST PASS 导航点击 → 平滑落到对应站点区间',
  Math.abs(fp.at - want) < fp.max * 0.06,
  `落在 ${Math.round(fp.at)}，目标 ${Math.round(want)}`,
);
await shot(desk, 'd6-fastpass-station-1.png');

const wheelNative = await desk.evaluate(() => {
  const d = document.documentElement;
  return {
    lenisWrapped: d.classList.contains('lenis') || !!document.querySelector('.lenis'),
    // 页面必须仍是文档滚动（没有 transform 包裹层）
    transformed: getComputedStyle(d).transform !== 'none' || getComputedStyle(document.body).transform !== 'none',
  };
});
check(
  '保留原生文档滚动（Lenis 不接管容器）',
  !wheelNative.transformed,
  `html/body transform=${wheelNative.transformed}`,
);

// reduced 标记下字体是否落到 styled 字体
const fonts = await desk.evaluate(() => ({
  slab: getComputedStyle(document.querySelector('h1, h2') ?? document.body).fontFamily,
  loaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
}));
console.log(`  字体: display=${fonts.slab.slice(0, 46)} loaded=[${[...new Set(fonts.loaded)].join(', ')}]`);

/* ================== 移动 390×844 ================== */

console.log('\n=== MOBILE 390×844 ===');
const mob = await session('mobile', { width: 390, height: 844, isMobile: true, hasTouch: true });
await scrollToProgress(mob, 0);
await shot(mob, 'm1-flow-top.png');
const mm = await metrics(mob, 'mobile@0', { flow: true });
await scrollToProgress(mob, 0.45);
await shot(mob, 'm2-flow-mid.png');
await metrics(mob, 'mobile@45', { flow: true });
await scrollToProgress(mob, 1);
await shot(mob, 'm3-flow-end.png');
await metrics(mob, 'mobile@100', { flow: true });

const mobVid = await mob.evaluate(() => {
  const v = document.querySelector('section video');
  return {
    hasVideoEl: !!v,
    sections: [...document.querySelectorAll('main section[id]')].map((s) => s.id),
    docFlow: document.documentElement.scrollHeight > window.innerHeight * 3,
  };
});
check('移动端为竖向站点卡流', mobVid.docFlow, `docHeight=${mm.docH}`);
check(
  '移动端卡片内保留视频纹理（探测成功则挂载 <video>）',
  mobVid.hasVideoEl,
  `video=${mobVid.hasVideoEl} sections=[${mobVid.sections.join(',')}]`,
);

/* ================== reduced-motion ================== */

console.log('\n=== REDUCED MOTION 1440×900 ===');
const red = await session('reduced', { width: 1440, height: 900 }, { reduced: true, settle: 1800 });
const redState = await red.evaluate(() => ({
  splash: !!document.querySelector('[aria-label="售票亭"]'),
  sections: [...document.querySelectorAll('main section[id]')].map((s) => s.id),
  visible: [...document.querySelectorAll('main section[id]')].filter(
    (s) => getComputedStyle(s).opacity === '1',
  ).length,
  canvas: !!document.querySelector('canvas'),
}));
check('reduced 跳过 Splash', !redState.splash, `splash=${redState.splash}`);
check(
  'reduced 退化为完整静态卡片流（全部区块在文档流中）',
  redState.sections.length >= 6 && redState.visible > 3,
  `sections=${redState.sections.length} 可见=${redState.visible}`,
);
await shot(red, 'r1-reduced-top.png');
await scrollToProgress(red, 0.5);
await shot(red, 'r2-reduced-mid.png');
await metrics(red, 'reduced@50', { flow: true });
await scrollToProgress(red, 1);
const rEnd = await shot(red, 'r3-reduced-end.png');
const rpx = await pixelStats(red, rEnd, { x: 700, y: 60, w: 700, h: 700 });
check('reduced 终点全景仍在渲染', rpx.sd > 4, `sd=${rpx.sd} colors=${rpx.colors}`);

/* ================== 汇总 ================== */

let failed = 0;
for (const r of consoleTotals) {
  console.log(`[${r.name}] console errors: ${r.errors.length}`);
  r.errors.slice(0, 8).forEach((e) => console.log(`   ! ${e.slice(0, 200)}`));
  failed += r.errors.length;
}
failed += problems.length;
problems.forEach((p) => console.log(`   ! 断言失败: ${p}`));
console.log(failed === 0 ? '\nRESULT: PASS' : `\nRESULT: FAIL (${failed} 项)`);
await browser.close();
process.exit(failed === 0 ? 0 : 1);
