/* 单一滚动状态：DOM 与 WebGL 共用一份读数。
   Lenis 只负责平滑，不改写文档流；这里所有进度都由真实 getBoundingClientRect 派生。 */
export const scrollState = {
  y: 0,
  viewport: 1,
  pointerX: 0,
  pointerY: 0,
  /** 滚动速度（px / 次采样），给胶囊弹簧提供「撞击」冲量 */
  velocity: 0,
  /** Hero 舱内视角推进：0 = 刚投币，1 = 完全离开首屏 */
  heroProgress: 0,
  /** 货架推进：决定当期胶囊沿螺旋滑道落到取物盘 */
  workProgress: 0,
  /** 机舱是否该继续出帧（离开视口即停帧） */
  cabinLive: true,
};

let lastY = 0;

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function spanProgress(id: string) {
  const el = document.getElementById(id);
  if (!el) return 0;
  const rect = el.getBoundingClientRect();
  const total = rect.height + window.innerHeight;
  if (total <= 0) return 0;
  return clamp01((window.innerHeight - rect.top) / total);
}

export function syncScroll(y: number) {
  const vh = window.innerHeight;
  scrollState.velocity = y - lastY;
  lastY = y;
  scrollState.y = y;
  scrollState.viewport = vh;
  scrollState.heroProgress = clamp01(y / vh);
  scrollState.workProgress = spanProgress('work');
  scrollState.cabinLive = y < vh * 6.2;
}

export function syncPointer(clientX: number, clientY: number) {
  scrollState.pointerX = (clientX / window.innerWidth) * 2 - 1;
  scrollState.pointerY = -((clientY / window.innerHeight) * 2 - 1);
}
