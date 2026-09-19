/**
 * 「巨型扭蛋机」无头 Chrome 复验（Design QA 用，产物落 .design-qa/）
 *
 * 零依赖：直接驱动 Chrome DevTools Protocol（Node 22 自带 WebSocket），
 * 不引 puppeteer / playwright，也不改 package.json。
 *
 * 用法：
 *   npm run preview -- --port 4390 &
 *   node tools/verify-headless.mjs http://localhost:4390
 * 可选环境变量：
 *   CHROME=自定义 Chrome 路径   PORT=CDP 端口（默认 9333）   OUT=输出目录（默认 .design-qa）
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const BASE = process.argv[2] ?? 'http://localhost:4390';
const PORT = Number(process.env.PORT ?? 9333);
const OUT = process.env.OUT ?? '.design-qa';
const CHROME =
  process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

fs.mkdirSync(OUT, { recursive: true });
const problems = [];
const notes = [];

/* ── CDP 客户端 ─────────────────────────────────────────────── */
async function waitForDebugger() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const json = await res.json();
      if (json.webSocketDebuggerUrl) return json.webSocketDebuggerUrl;
    } catch {
      /* 还没起来 */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('Chrome 远程调试端口未就绪');
}

class Cdp {
  constructor(url) {
    this.url = url;
    this.id = 0;
    this.pending = new Map();
    this.handlers = new Map();
  }
  async open() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      } else if (msg.method) {
        (this.handlers.get(msg.method) ?? []).forEach((fn) => fn(msg.params));
      }
    });
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params, sessionId }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  on(method, fn) {
    if (!this.handlers.has(method)) this.handlers.set(method, []);
    this.handlers.get(method).push(fn);
  }
}

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(), 'pm527-'))}`,
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--hide-scrollbars',
    '--font-render-hinting=none',
    '--window-size=1440,900',
    'about:blank',
  ],
  { stdio: 'ignore' },
);
process.on('exit', () => chrome.kill());

const browser = new Cdp(await waitForDebugger());
await browser.open();

/* ── 一次会话（视口 / 减弱动效） ─────────────────────────────── */
async function session(label, viewport, { reduced = false } = {}) {
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });
  const errors = [];
  const keep = (method, fn) => browser.on(`${method}`, fn);
  keep('Runtime.consoleAPICalled', (p) => {
    if (p.type !== 'error') return;
    const text = (p.args ?? []).map((a) => a.value ?? a.description ?? a.type).join(' ');
    errors.push(`console: ${text}`);
  });
  keep('Runtime.exceptionThrown', (p) =>
    errors.push(`pageerror: ${p.exceptionDetails?.exception?.description ?? 'unknown'}`),
  );
  keep('Log.entryAdded', (p) => {
    if (p.entry.level !== 'error') return;
    errors.push(`log: ${p.entry.text?.slice(0, 160)}`);
  });

  const call = (method, params = {}) => browser.send(method, params, sessionId);
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Log.enable');
  await call('Network.enable');
  await call('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.deviceScaleFactor ?? 2,
    mobile: Boolean(viewport.isMobile),
  });
  if (reduced) {
    await call('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    });
  }
  await call('Page.navigate', { url: BASE });
  await new Promise((r) => setTimeout(r, 2600));

  const ev = async (expression) => {
    const res = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) {
      errors.push(`eval: ${res.exceptionDetails.text}`);
      return undefined;
    }
    return res.result?.value;
  };
  const shot = async (file) => {
    const { data } = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(path.join(OUT, file), Buffer.from(data, 'base64'));
    notes.push(`${label} → ${file}`);
  };
  const to = async (id, wait = 1500) => {
    await ev(`document.getElementById(${JSON.stringify(id)})?.scrollIntoView({block:'start'})`);
    await new Promise((r) => setTimeout(r, wait));
  };
  return { label, sessionId, targetId, errors, ev, shot, to, call };
}

const ok = (cond, msg) => {
  if (!cond) problems.push(msg);
  console.log(`${cond ? '  ok ' : '  !! '} ${msg}`);
};

/* ── 1. 桌面 1440×900 ──────────────────────────────────────── */
console.log('\n[desktop 1440x900]');
const desk = await session('desktop', { width: 1440, height: 900 });

const booted = await desk.ev(
  `(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('开始扭蛋')); b?.click(); return Boolean(b); })()`,
);
ok(booted, 'Splash 投币口 CTA 存在且可点');
await new Promise((r) => setTimeout(r, 1200));
ok(
  await desk.ev(`!([...document.querySelectorAll('button')].some(x => x.textContent.includes('开始扭蛋')))`),
  '投币后 Splash 卸载，主场景可交互',
);
ok(
  (await desk.ev(`getComputedStyle(document.documentElement).overflow`)) !== 'hidden',
  '投币后文档滚动已解锁（保留原生滚动）',
);

const geom = await desk.ev(`({ inner: window.innerWidth, body: document.body.scrollWidth, html: document.documentElement.scrollWidth, canvas: (() => { const c = document.querySelector('canvas'); return c ? [c.width, c.height] : null })() })`);
console.log(`  读数 inner=${geom.inner} body=${geom.body} html=${geom.html} canvas=${geom.canvas}`);
ok(geom.body === geom.inner && geom.html === geom.inner, '无横向溢出 body.scrollWidth === innerWidth');
ok(Boolean(geom.canvas) && geom.canvas[0] > 0, '桌面端 WebGL 舱内层已挂载');

const labelFacts = await desk.ev(
  `(() => { const t = document.body.innerText; return ['PM-01','PM-02','PM-03','PM-00','980M+','12,000','2.3B+','527'].filter(k => !t.includes(k)); })()`,
);
ok(labelFacts.length === 0, `机台标签在「零开蛋」状态下已含全部关键数据（缺失：${labelFacts.join(',') || '无'}）`);

await desk.shot('d0-hero.png');
await desk.to('work', 2200);
await desk.shot('d1-shelf.png');
const hitTargets = await desk.ev(
  `(() => { const bad = []; document.querySelectorAll('button, a').forEach(el => { const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) return; if (r.top < -4 || r.bottom > window.innerHeight + 4) return; if (r.height < 43 || r.width < 24) bad.push(el.textContent.trim().slice(0,18) + '|' + Math.round(r.width) + 'x' + Math.round(r.height)); }); return bad.slice(0, 8); })()`,
);
ok(hitTargets.length === 0, `可视命中区 ≥44px（违例：${hitTargets.join(' / ') || '无'}）`);

const tray = await desk.ev(
  `(() => { const live = document.querySelector('[aria-live]'); const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('扭开这颗')); return { live: live?.textContent?.trim().slice(0, 60) ?? '', pressed: btn?.getAttribute('aria-hidden') ?? 'n/a', top: btn ? Math.round(btn.getBoundingClientRect().top) : -1 }; })()`,
);
console.log(`  取物盘 aria-live="${tray.live}"`);
ok(tray.live.includes('当前可开'), '取物盘 aria-live 报出当前可开胶囊');
ok(tray.top > 0 && tray.top < 900, '取物盘在视口内可见');

const overlap = await desk.ev(`(() => {
  const wrap = document.querySelector('[aria-live]')?.closest('.fixed');
  const trayEl = wrap?.querySelector('.pointer-events-auto') || wrap;
  if (!trayEl) return ['no tray'];
  const a = trayEl.getBoundingClientRect();
  const hits = [];
  document.querySelectorAll('#work li[id^="draw-"]').forEach((li) => {
    const b = li.getBoundingClientRect();
    if (b.height === 0) return;
    const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (ox > 1 && oy > 1) hits.push(li.id + '(' + Math.round(ox) + 'x' + Math.round(oy) + ')');
  });
  if (hits.length) hits.push('tray=' + [a.left, a.top, a.right, a.bottom].map(Math.round).join(','));
  return hits;
})()`);
ok(overlap.length === 0, `取物盘不遮挡任何机台标签（重叠：${overlap.join(', ') || '无'}）`);

const opened = await desk.ev(
  `(() => { const b = document.querySelector('#work [aria-expanded="false"]'); if (!b) return 'none'; b.click(); return b.getAttribute('aria-controls'); })()`,
);
await new Promise((r) => setTimeout(r, 1600));
ok(opened !== 'none' && opened !== false, `点击胶囊开蛋（aria-controls=${opened}）`);
await desk.shot('d2-capsule-open.png');
const openContent = await desk.ev(
  `(() => { const el = document.getElementById('${opened}'); const r = el?.getBoundingClientRect(); return { h: r ? Math.round(r.height) : 0, txt: el?.innerText ?? '' }; })()`,
);
ok(openContent.h > 240, `胶囊内页展开高度 ${openContent.h}px（含真实 metric）`);
ok(openContent.txt.includes('打开项目现场'), '开蛋后含官网外链');

await desk.ev(
  `(() => { const btns = [...document.querySelectorAll('#work button[aria-label]')]; btns.find(b => b.getAttribute('aria-label') === '下一颗胶囊')?.click(); })()`,
);
await new Promise((r) => setTimeout(r, 800));
await desk.shot('d3-tray-next.png');

await desk.to('roster', 2000);
await desk.shot('d4-roster.png');
const wheel = await desk.ev(
  `(() => { const ring = document.querySelector('[style*="preserve-3d"]'); return ring ? getComputedStyle(ring).transform.slice(0, 24) : null; })()`,
);
ok(Boolean(wheel), `中奖名录滚轮为真实 3D 变换（transform=${wheel}）`);
const wheelFaces = await desk.ev(`(() => {
  const ring = document.querySelector('[style*="preserve-3d"]');
  if (!ring) return null;
  const cards = [...ring.children].map((c) => Number(getComputedStyle(c).opacity));
  return { lit: cards.filter((o) => o > 0.05).length, total: cards.length };
})()`);
ok(
  Boolean(wheelFaces) && wheelFaces.lit >= 1 && wheelFaces.lit <= 3,
  `滚轮侧向铭牌淡出，同一刻仅 ${wheelFaces?.lit}/${wheelFaces?.total} 块可读`,
);
const bonus = await desk.ev(
  `(() => { const b = [...document.querySelectorAll('button[aria-expanded]')].find(x => x.textContent.includes('扭开彩蛋')); b?.click(); return b ? b.getAttribute('aria-expanded') : 'none'; })()`,
);
await new Promise((r) => setTimeout(r, 700));
const bonusIn = await desk.ev(
  `(() => { const el = document.getElementById('bonus-prize'); if (!el) return false; window.scrollTo(0, Math.max(0, el.getBoundingClientRect().top + window.scrollY - 230)); return true; })()`,
);
await new Promise((r) => setTimeout(r, 1500));
await desk.shot('d5-bonus-open.png');
ok(bonus === 'false', `限定金色彩蛋可开（点击前 aria-expanded=${bonus}）`);
const bonusBody = await desk.ev(
  `(() => { const el = document.getElementById('bonus-prize'); const r = el?.getBoundingClientRect(); return { h: r ? Math.round(r.height) : 0, top: r ? Math.round(r.top) : -1, txt: el?.innerText ?? '' }; })()`,
);
ok(
  bonusIn && bonusBody.h > 160 && bonusBody.top < 700 && /\d/.test(bonusBody.txt),
  `彩蛋展开高度 ${bonusBody.h}px、位于视口内（top=${bonusBody.top}）且含真实统计`,
);

await desk.to('contact', 1600);
await desk.shot('d6-redeem.png');
const redeem = await desk.ev(
  `(() => ({ mail: !!document.querySelector('a[href^="mailto"]'), pdf: !!document.querySelector('a[download][href$=".pdf"]'), status: document.body.innerText.includes('补货中') }))()`,
);
ok(redeem.mail && redeem.pdf && redeem.status, '兑奖处含 mailto / PDF 下载 / 补货中状态标签');

/* ── 2. 移动 390×844 ───────────────────────────────────────── */
console.log('\n[mobile 390x844]');
const mob = await session('mobile', { width: 390, height: 844, isMobile: true, hasTouch: true });
await mob.ev(
  `(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('开始扭蛋')); b?.click(); return Boolean(b); })()`,
);
await new Promise((r) => setTimeout(r, 1400));
const mobGeom = await mob.ev(
  `({ inner: window.innerWidth, body: document.body.scrollWidth, canvas: !!document.querySelector('canvas'), machine: document.body.innerText.includes('prize tray') })`,
);
console.log(`  读数 inner=${mobGeom.inner} body=${mobGeom.body} canvas=${mobGeom.canvas}`);
ok(mobGeom.body === mobGeom.inner, '移动端无横向溢出');
ok(!mobGeom.canvas, '移动端未挂载 WebGL（退化为静态机台插画）');
await mob.shot('m0-hero.png');
await mob.to('work', 1800);
await mob.shot('m1-shelf.png');
const mobTrayMode = await mob.ev(
  `(() => { const live = document.querySelector('[aria-live]'); return live ? (live.closest('.fixed') ? 'floating' : 'in-flow') : 'none'; })()`,
);
ok(
  mobTrayMode === 'in-flow',
  `移动端取物盘退为段内铭牌，不悬浮压标签（模式：${mobTrayMode}）`,
);
const mobOpen = await mob.ev(
  `(() => { const b = document.querySelector('#work [aria-expanded="false"]'); b?.click(); return Boolean(b); })()`,
);
await new Promise((r) => setTimeout(r, 1600));
ok(mobOpen, '移动端胶囊卡片仍可弹开');
await mob.shot('m2-capsule-open.png');
await mob.to('contact', 1400);
await mob.shot('m3-redeem.png');
const mobTray = await mob.ev(
  `(() => { const els = [...document.querySelectorAll('button, a')]; return els.filter(el => { const r = el.getBoundingClientRect(); return r.height > 0 && r.height < 43 && r.width >= 24; }).length; })()`,
);
ok(mobTray === 0, `移动端命中区 ≥44px（违例 ${mobTray} 个）`);

/* ── 3. 减弱动效 1440×900 ─────────────────────────────────── */
console.log('\n[reduced-motion 1440x900]');
const red = await session('reduced', { width: 1440, height: 900 }, { reduced: true });
const redState = await red.ev(
  `(() => ({ splash: [...document.querySelectorAll('button')].some(x => x.textContent.includes('开始扭蛋')), expanded: [...document.querySelectorAll('#work button[aria-expanded]')].map(b => b.getAttribute('aria-expanded')), overflow: document.body.scrollWidth - window.innerWidth }))()`,
);
ok(!redState.splash, 'reduced-motion 直接跳过投币开机');
ok(
  redState.expanded.length >= 3 && redState.expanded.every((v) => v === 'true'),
  `reduced-motion 默认展开全部胶囊卡（${redState.expanded.join(',')}）`,
);
ok(redState.overflow === 0, 'reduced-motion 无横向溢出');
await red.shot('r0-hero.png');
await red.to('work', 1200);
await red.shot('r1-shelf.png');
await red.to('roster', 1200);
await red.shot('r2-roster.png');
await red.to('contact', 1200);
await red.shot('r3-redeem.png');

/* ── 汇总 ─────────────────────────────────────────────────── */
let failed = 0;
for (const s of [desk, mob, red]) {
  const real = s.errors.filter(
    (e) => !/favicon|ERR_INTERNET_DISCONNECTED|Download the React/i.test(e),
  );
  console.log(`[${s.label}] console/page errors: ${real.length}`);
  real.slice(0, 8).forEach((e) => console.log(`   ! ${e.slice(0, 200)}`));
  failed += real.length;
}
failed += problems.length;
problems.forEach((p) => console.log(`   ! 断言失败: ${p}`));
console.log(`\n截图 ${notes.length} 张 → ${OUT}/`);
console.log(failed === 0 ? 'RESULT: PASS' : `RESULT: FAIL (${failed} 项)`);
chrome.kill();
process.exit(failed === 0 ? 0 : 1);
