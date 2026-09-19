import { motionValue, type MotionValue } from 'framer-motion';

/**
 * 过山车滚动状态机。
 *
 * 两条通路各司其职：
 *  - `coasterScroll`：单一事实源的 MotionValue，画布与 DOM 面板都用 useTransform 读它，
 *    因此滚动过程中 **不触发任何 React 重渲染**（帧率不被 reconciler 拖）。
 *  - `subscribeActive()`：只发布「离散结果」（当前落在哪个区间），DOM 侧需要切换
 *    pointer-events / aria 时才订阅，变化频率 = 站点数，不是帧数。
 */

export type SectionId =
  | 'boarding'
  | 'station-1'
  | 'station-2'
  | 'station-3'
  | 'observation'
  | 'terminus';

export type Window = { id: SectionId; start: number; end: number; label: string };

/**
 * 乘坐顺序 = 简历阅读顺序。区间为全局滚动进度 [0,1]。
 *
 * **与 canvas/CoasterCanvas.tsx 的 STATION_U 绑死**：三块站屏立在轨道直道末端
 * u = 0.34 / 0.59 / 0.87，每个窗口的中点落在屏前方 0.08–0.12 弧长处，
 * 于是「读这段文字时，这块站屏正好在右半屏里完整入画」；窗口尾部就是超车进站，
 * 屏从右侧擦出画面。观景台/终点排在最后一块屏之后，画面上没有遮挡物。
 * 几何验算见 DESIGN_SPEC.md「构图预算」一节。
 */
export const SECTION_WINDOWS: Window[] = [
  { id: 'boarding', start: 0.0, end: 0.14, label: '登车' },
  { id: 'station-1', start: 0.16, end: 0.35, label: 'STATION 01 · PORSCHE' },
  { id: 'station-2', start: 0.415, end: 0.6, label: 'STATION 02 · HUAWEI CLOUD' },
  { id: 'station-3', start: 0.665, end: 0.85, label: 'STATION 03 · TENCENT DES' },
  { id: 'observation', start: 0.875, end: 0.938, label: '观景台' },
  { id: 'terminus', start: 0.95, end: 1.0, label: '终点站台' },
];

/** 进出各占区间长度这个比例做淡入淡出，中段完全可读。 */
const RAMP = 0.16;

export const coaster = {
  /** 平滑后的滚动像素 */
  scroll: 0,
  /** 0..1 全局乘坐进度（相机沿轨道的位置） */
  progress: 0,
  /** 归一化滚动速度 0..1，喂给 FOV 做速度感 */
  velocity: 0,
  pointerX: 0,
  pointerY: 0,
  docHeight: 1,
  viewport: 1,
  mobile: false,
  reduced: false,
};

export const coasterScroll: MotionValue<number> = motionValue(0);

const listeners = new Set<() => void>();
let cached: SectionId = 'boarding';

function measure() {
  coaster.viewport = window.innerHeight;
  coaster.docHeight = Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    1,
  );
  coaster.mobile = window.matchMedia('(max-width: 767px)').matches;
}

function computeActive(p: number): SectionId {
  for (const w of SECTION_WINDOWS) {
    if (p >= w.start && p <= w.end) return w.id;
  }
  // 区间之间留有换乘缝隙：取最近的一个，保证面板状态与 aria 永不落空。
  let best: SectionId = 'boarding';
  let bestD = Number.POSITIVE_INFINITY;
  for (const w of SECTION_WINDOWS) {
    const d = p < w.start ? w.start - p : p - w.end;
    if (d < bestD) {
      bestD = d;
      best = w.id;
    }
  }
  return best;
}

/** 由 Lenis（或原生 scroll）每帧调用一次。 */
export function publishScroll(y: number) {
  const prev = coaster.scroll;
  const now = performance.now();
  const dt = Math.max(lastTickAt ? now - lastTickAt : 16.7, 1) / 1000;
  lastTickAt = now;
  const dy = y - prev;
  const pxPerSec = Math.abs(dy) / dt;
  const target = Math.min(pxPerSec / 2600, 1);
  coaster.velocity += (target - coaster.velocity) * 0.25;

  coaster.scroll = y;
  coaster.progress = clamp(y / coaster.docHeight, 0, 1);
  coasterScroll.set(y);

  const next = computeActive(coaster.progress);
  if (next !== cached) {
    cached = next;
    listeners.forEach((l) => l());
  }
}

let lastTickAt = 0;

export function subscribeActive(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getActive() {
  return cached;
}

export function sectionWindow(id: SectionId) {
  return SECTION_WINDOWS.find((w) => w.id === id) ?? SECTION_WINDOWS[0];
}

/**
 * 面板可见度：区间内先淡入、中段 1、尾部淡出。
 * 关键：**只在区间边缘动 opacity**，中段恒为 1，不靠低透明度抢阅读。
 */
export function sectionAlpha(p: number, w: Window) {
  const span = Math.max(w.end - w.start, 0.0001);
  const ramp = span * RAMP;
  const first = SECTION_WINDOWS[0].id === w.id;
  const last = SECTION_WINDOWS[SECTION_WINDOWS.length - 1].id === w.id;

  // 文档两端不做淡出：起点必须读得到「登车」，终点必须读得到「到站」。
  if (!first && p <= w.start - ramp) return 0;
  if (!last && p >= w.end + ramp) return 0;
  if (!first && p < w.start + ramp) return (p - (w.start - ramp)) / (ramp * 2);
  if (!last && p > w.end - ramp) return 1 - (p - (w.end - ramp)) / (ramp * 2);
  return 1;
}

export const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

/* ---------------- FAST PASS：程序化平滑滚动 ---------------- */

type ScrollApi = { scrollTo: (y: number) => void };
let scrollApi: ScrollApi | null = null;

/** useSmoothScroll 注册它的滚动驱动（Lenis 或原生）。 */
export function registerScrollApi(api: ScrollApi | null) {
  scrollApi = api;
}

/** 点击导航 = 平滑滚到对应站点的「完全进站」位置，不劫持原生 wheel。 */
export function fastPassTo(id: SectionId) {
  const w = sectionWindow(id);
  const y = Math.round((w.start + w.end) / 2 * coaster.docHeight);
  if (coaster.reduced || !scrollApi) {
    window.scrollTo({ top: y, behavior: 'auto' });
    publishScroll(y);
    return;
  }
  scrollApi.scrollTo(y);
}

export { measure };
