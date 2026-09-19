/**
 * CHANNEL 潘 · 午夜购物频道 —— 无头 Chrome 视觉 / 行为复验
 * 用法：
 *   npm run preview -- --port 4190 &
 *   node tools/verify-headless.mjs http://localhost:4190
 * 依赖：puppeteer-core 装在仓外/忽略目录（默认 .verify/node_modules，PUPPETEER 可覆盖），
 *       系统 Chrome。截图与断言结果写入 .design-qa/。
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRE = createRequire(import.meta.url);
const ROOT = path.resolve(fileURLToPath(import.meta.url), '..', '..');
const BASE = process.argv[2] ?? 'http://localhost:4190';
const PUPPETEER = process.env.PUPPETEER ?? path.join(ROOT, '.verify', 'node_modules');
const OUT = process.env.OUT ?? path.join(ROOT, '.design-qa');

const puppeteer = REQUIRE(path.join(PUPPETEER, 'puppeteer-core'));
fs.mkdirSync(OUT, { recursive: true });

const EXEC = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARGS = [
  '--no-sandbox',
  '--enable-unsafe-swiftshader',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--font-render-hinting=none',
];

const browser = await puppeteer.launch({ executablePath: EXEC, args: ARGS, headless: 'new' });
const consoleErrors = [];
const aborted = [];
const failures = [];

function log(...args) {
  console.log(...args);
}

async function open(name, viewport, { reduced = false, waitSplash = false } = {}) {
  const page = await browser.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(`[${name}] ${m.text()}`);
  });
  page.on('pageerror', (e) => consoleErrors.push(`[${name}] pageerror: ${e.message}`));
  page.on('requestfailed', (r) => {
    if (!r.url().startsWith(BASE)) return;
    const reason = r.failure()?.errorText ?? '';
    if (reason === 'net::ERR_ABORTED' && r.url().includes('/media/')) {
      aborted.push(`[${name}] ${r.url().split('/').pop()} ${reason}`);
      return;
    }
    consoleErrors.push(`[${name}] 请求失败 ${r.url()} ${reason}`);
  });
  await page.setViewport(viewport);
  if (reduced) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  }
  await page.goto(BASE, { waitUntil: waitSplash ? 'domcontentloaded' : 'networkidle2' });
  if (!waitSplash) await new Promise((r) => setTimeout(r, 2400));
  return page;
}

const shot = (page, file) => page.screenshot({ path: path.join(OUT, file) });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 横向溢出：body/documentElement 双读数 + 逐个越界元素定位 */
async function overflow(page, label) {
  const m = await page.evaluate(() => {
    const w = window.innerWidth;
    const bad = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > w + 1) {
        bad.push(
          `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 46)}→${Math.round(r.right)}`,
        );
      }
      if (bad.length > 6) break;
    }
    return {
      innerW: w,
      bodyScrollW: document.body.scrollWidth,
      htmlScrollW: document.documentElement.scrollWidth,
      bad,
    };
  });
  const ok = m.bodyScrollW === m.innerW && m.htmlScrollW === m.innerW;
  log(`[${label}] inner=${m.innerW} body.scrollWidth=${m.bodyScrollW} html=${m.htmlScrollW} 无横向溢出=${ok}`);
  if (!ok) {
    failures.push(`${label} 横向溢出`);
    log(`   越界元素: ${m.bad.join(' | ') || '（未定位到）'}`);
  }
  return ok;
}

/** 电视机屏幕：WebGL canvas 是否有画面（非纯黑 / 非纯白） */
async function probeScreens(page, label) {
  const probe = await page.evaluate(async () => {
    const out = [];
    const canvases = [...document.querySelectorAll('canvas')];
    for (const src of canvases) {
      const rect = src.getBoundingClientRect();
      if (rect.width < 100) continue;
      const W = 120;
      const H = 75;
      const off = document.createElement('canvas');
      off.width = W;
      off.height = H;
      const ctx = off.getContext('2d', { willReadFrequently: true });
      await new Promise((r) => requestAnimationFrame(() => r()));
      ctx.drawImage(src, 0, 0, W, H);
      const { data } = ctx.getImageData(0, 0, W, H);
      let sum = 0;
      let sum2 = 0;
      let n = 0;
      let white = 0;
      let black = 0;
      for (let y = 10; y < 65; y += 2) {
        for (let x = 15; x < 105; x += 2) {
          const i = (y * W + x) * 4;
          const v = (data[i] + data[i + 1] + data[i + 2]) / 3;
          sum += v;
          sum2 += v * v;
          n += 1;
          if (data[i] > 248 && data[i + 1] > 248 && data[i + 2] > 248) white += 1;
          if (v < 12) black += 1;
        }
      }
      const mean = sum / n;
      out.push({
        size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
        mean: Math.round(mean),
        sd: Math.round(Math.sqrt(Math.max(sum2 / n - mean * mean, 0))),
        whitePct: Math.round((100 * white) / n),
        blackPct: Math.round((100 * black) / n),
      });
    }
    const video = [...document.querySelectorAll('video')].map((v) => ({
      src: (v.currentSrc || v.src || '').split('/').pop(),
      t: Math.round(v.currentTime * 10) / 10,
      paused: v.paused,
      ready: v.readyState,
    }));
    return { out, video };
  });
  for (const c of probe.out) {
    const live = c.sd > 6 && c.whitePct < 60 && c.blackPct < 92;
    log(`[${label}] canvas ${c.size} mean=${c.mean} 方差=${c.sd} 白=${c.whitePct}% 黑=${c.blackPct}% 有画面=${live}`);
    if (!live) failures.push(`${label} 屏幕疑似空白`);
  }
  if (!probe.out.length) log(`[${label}] canvas: 本页该状态无 WebGL 层（CSS 兜底）`);
  for (const v of probe.video) {
    log(`[${label}] video ${v.src} currentTime=${v.t} paused=${v.paused} readyState=${v.ready}`);
  }
  return probe;
}

async function tunerState(page) {
  return page.evaluate(() => {
    const pressed = [...document.querySelectorAll('button[aria-pressed]')].map((b) => ({
      label: b.getAttribute('aria-label') ?? '',
      on: b.getAttribute('aria-pressed') === 'true',
    }));
    const knob = document.querySelector('[role="slider"]');
    return {
      pressed,
      knob: knob
        ? {
            now: knob.getAttribute('aria-valuenow'),
            label: knob.getAttribute('aria-label'),
          }
        : null,
      activeNav: [...document.querySelectorAll('nav a[aria-current]')].map((a) => a.textContent),
      scrollY: Math.round(window.scrollY),
      channels: [...document.querySelectorAll('section[id^="ch"]')].map((s) => s.id),
      splash: Boolean(document.querySelector('[role="status"]')),
      minTarget: [...document.querySelectorAll('a,button,[role="slider"]')]
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { tag: el.tagName.toLowerCase(), text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 20), h: Math.round(r.height), w: Math.round(r.width) };
        })
        .filter((t) => t.h >= 8 && (t.h < 44 || t.w < 44)),
    };
  });
}

async function pressKey(page, key) {
  await page.evaluate((k) => {
    const btn = [...document.querySelectorAll('button[aria-pressed]')].find((b) =>
      (b.getAttribute('aria-label') ?? '').startsWith(`换台 CH${String(k).padStart(2, '0')}`),
    );
    if (!btn) throw new Error(`找不到遥控器数字键 ${k}`);
    btn.click();
  }, key);
  await sleep(1500);
}

/* ---------------- 桌面 1440×900 ---------------- */
log('\n=== 桌面 1440×900 ===');
const desk = await open('desktop', { width: 1440, height: 900 }, { waitSplash: true });
await sleep(400);
await shot(desk, 'd1-splash-1440.png');
const splashSeen = (await tunerState(desk)).splash;
log(`[desktop] 测试卡挂载=${splashSeen}`);
await sleep(2200);
await shot(desk, 'd2-ch00-1440.png');
await overflow(desk, 'desktop-ch00');
let st = await tunerState(desk);
log(`[desktop] 频道=${st.channels.join(',')} 在架键=${st.pressed.filter((p) => p.on).length} 旋钮=${st.knob?.now}%`);

for (const [key, file] of [
  ['1', 'd3-ch01-1440.png'],
  ['2', 'd4-ch02-1440.png'],
  ['3', 'd5-ch03-1440.png'],
]) {
  await pressKey(desk, key);
  await shot(desk, file);
  const s = await tunerState(desk);
  const on = s.pressed.find((p) => p.on);
  log(`[desktop] 换台 CH${key} → 点亮=${on ? on.label : '无'} scrollY=${s.scrollY}`);
  if (!on || !on.label.includes(`CH0${key}`)) failures.push(`desktop 换台 CH${key} 未点亮`);
  await overflow(desk, `desktop-ch0${key}`);
  await probeScreens(desk, `desktop-ch0${key}`);
}

await desk.evaluate(() => document.getElementById('hotline')?.scrollIntoView());
await sleep(1200);
await shot(desk, 'd6-hotline-1440.png');
await overflow(desk, 'desktop-hotline');
await desk.evaluate(() => document.getElementById('order')?.scrollIntoView());
await sleep(1200);
await shot(desk, 'd7-order-1440.png');
await overflow(desk, 'desktop-order');

/* VOL 旋钮键盘走带（先回到顶部，否则已在文档底部无法再向下） */
await desk.evaluate(() => window.scrollTo(0, 0));
await sleep(900);
const beforeVol = await desk.evaluate(() => Math.round(window.scrollY));
await desk.evaluate(() => document.querySelector('[role="slider"]')?.focus());
await desk.keyboard.press('ArrowUp');
await desk.keyboard.press('ArrowUp');
await sleep(1400);
const afterVol = await desk.evaluate(() => Math.round(window.scrollY));
log(`[desktop] VOL 键走带 ${beforeVol} → ${afterVol}`);
if (afterVol <= beforeVol) failures.push('desktop VOL 旋钮键盘走带无效');

/* Esc = POWER 回测试卡 */
await desk.keyboard.press('Escape');
await sleep(600);
const powered = (await tunerState(desk)).splash;
log(`[desktop] Esc → 测试卡=${powered} scrollY=${(await tunerState(desk)).scrollY}`);
if (!powered) failures.push('desktop Esc 未回到测试卡');
await shot(desk, 'd8-power-1440.png');
await desk.keyboard.press('Escape');
await sleep(700);
if ((await tunerState(desk)).splash) failures.push('desktop 测试卡无法再次关闭');

/* 触控目标尺寸 */
const smallDesk = st.minTarget.concat(await tunerState(desk).then((s) => s.minTarget));
if (smallDesk.length) {
  log(`[desktop] 小于 44px 的交互元素: ${smallDesk.map((t) => `${t.tag}:${t.text}=${t.w}x${t.h}`).join(' | ')}`);
}

/* ---------------- 移动 390×844 ---------------- */
log('\n=== 移动 390×844 ===');
const mob = await open('mobile', { width: 390, height: 844, isMobile: true, hasTouch: true }, { waitSplash: true });
await sleep(400);
await shot(mob, 'm1-splash-390.png');
await sleep(2200);
await shot(mob, 'm2-ch00-390.png');
await overflow(mob, 'mobile-ch00');
for (const [key, file] of [
  ['1', 'm3-ch01-390.png'],
  ['2', 'm4-ch02-390.png'],
  ['3', 'm5-ch03-390.png'],
]) {
  await pressKey(mob, key);
  await shot(mob, file);
  await overflow(mob, `mobile-ch0${key}`);
  const s = await tunerState(mob);
  log(`[mobile] 换台 CH0${key} scrollY=${s.scrollY} 在架=${s.pressed.filter((p) => p.on).length}`);
}
await mob.evaluate(() => document.getElementById('hotline')?.scrollIntoView());
await sleep(1000);
await shot(mob, 'm6-hotline-390.png');
await overflow(mob, 'mobile-hotline');
await mob.evaluate(() => document.getElementById('order')?.scrollIntoView());
await sleep(1000);
await shot(mob, 'm7-order-390.png');
await overflow(mob, 'mobile-order');
const mobSmall = await tunerState(mob);
const mobCompaction = await mob.evaluate(() => {
  const bar = [...document.querySelectorAll('div.fixed')].find((d) => d.querySelector('[role="slider"]'));
  const shell = bar?.firstElementChild;
  const header = document.querySelector('header');
  const headerRow = header?.firstElementChild;
  const nav = document.querySelector('nav[aria-label="节目导视"]');
  const r = bar?.getBoundingClientRect();
  return {
    barBottomGap: r ? Math.round(window.innerHeight - r.bottom) : -1,
    barWidthRatio: r ? Math.round((100 * r.width) / window.innerWidth) : 0,
    shellH: shell ? Math.round(shell.getBoundingClientRect().height) : -1,
    headerH: headerRow ? Math.round(headerRow.getBoundingClientRect().height) : -1,
    navRows: nav ? Math.round(nav.getBoundingClientRect().height) : -1,
    navScrollable: nav ? nav.scrollWidth > nav.clientWidth : false,
  };
});
log(
  `[mobile] 遥控器折叠为底部一条 bar=${
    Math.abs(mobCompaction.barBottomGap) < 60 && mobCompaction.barWidthRatio > 60
  } 面板高=${mobCompaction.shellH}px 台标条高=${mobCompaction.headerH}px 导视条高=${mobCompaction.navRows}px 导视可横滑=${mobCompaction.navScrollable}`,
);
if (mobCompaction.shellH > 90) failures.push(`mobile 遥控器面板过高（${mobCompaction.shellH}px），未折叠成一条 bar`);
if (mobCompaction.headerH > 64) failures.push(`mobile 台标条换行（${mobCompaction.headerH}px）`);
if (mobSmall.minTarget.length) {
  log(`[mobile] 小于 44px: ${mobSmall.minTarget.map((t) => `${t.tag}:${t.text}=${t.w}x${t.h}`).join(' | ')}`);
}

/* ---------------- reduced-motion ---------------- */
log('\n=== reduced-motion 1440×900 ===');
const red = await open('reduced', { width: 1440, height: 900 }, { reduced: true });
await sleep(400);
const redState = await tunerState(red);
log(`[reduced] data-motion=${await red.evaluate(() => document.documentElement.dataset.motion)} 测试卡=${redState.splash} scrollY=${redState.scrollY}`);
if (redState.splash) failures.push('reduced 下仍弹出测试卡');
await shot(red, 'r1-ch00-1440-reduced.png');
await overflow(red, 'reduced-ch00');
await red.evaluate(() => document.getElementById('ch01')?.scrollIntoView());
await sleep(1200);
await shot(red, 'r2-ch01-1440-reduced.png');
await probeScreens(red, 'reduced-ch01');
const redCrt = await red.evaluate(() => ({
  lines: document.querySelectorAll('.crt-lines, .crt-noise, .crt-roll').length,
  anim: [...document.querySelectorAll('.ticker-track')].length,
  videos: [...document.querySelectorAll('video')].map((v) => v.paused),
}));
log(`[reduced] CRT 装饰层=${redCrt.lines} 走带=${redCrt.anim} 视频 paused=${redCrt.videos.join(',')}`);
if (redCrt.lines > 0) failures.push('reduced 下仍有扫描线 / 雪花层');
await red.evaluate(() => document.getElementById('order')?.scrollIntoView());
await sleep(1000);
await shot(red, 'r3-order-1440-reduced.png');
await overflow(red, 'reduced-order');

await browser.close();

/* ---------------- 汇总 ---------------- */
log('\n=== console 错误 ===');
const real = consoleErrors.filter((e) => !/favicon|Download the React/i.test(e));
real.slice(0, 12).forEach((e) => log(`   ! ${e.slice(0, 200)}`));
log(`console 错误数=${real.length}`);
log(`（另：离架暂停主动取消的媒体分段请求 ${aborted.length} 次，不计入错误）`);
const total = real.length + failures.length;
failures.forEach((f) => log(`   ! 断言失败: ${f}`));
log(total === 0 ? '\nRESULT: PASS' : `\nRESULT: FAIL (${total} 项)`);
process.exitCode = total === 0 ? 0 : 1;
