export const scrollState = {
  y: 0,
  heroProgress: 0,
  viewport: 1,
  pointerX: 0,
  pointerY: 0,
};

export function syncScroll(y: number) {
  const vh = window.innerHeight;
  scrollState.y = y;
  scrollState.viewport = vh;
  scrollState.heroProgress = Math.min(Math.max(y / vh, 0), 1);
}
