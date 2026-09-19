import type Lenis from 'lenis';

/* Lenis 只做平滑，不接管滚动容器：原生滚动语义（锚点 / PageDown / Home / End / 读屏）全部保留。 */
export const scroller: { lenis: Lenis | null; reduced: boolean } = {
  lenis: null,
  reduced: false,
};

/** 台标条是 sticky 的，程序化换台要为它让出高度，否则频道识别带会被压住。 */
function headerOffset() {
  const header = document.querySelector('header');
  return (header?.getBoundingClientRect().height ?? 56) + 4;
}

export function scrollToElement(el: Element) {
  const top = Math.max(0, window.scrollY + el.getBoundingClientRect().top - headerOffset());
  if (scroller.lenis) scroller.lenis.scrollTo(top, { immediate: scroller.reduced });
  else window.scrollTo({ top, behavior: scroller.reduced ? 'auto' : 'smooth' });
}

export function scrollToTop() {
  if (scroller.lenis) scroller.lenis.scrollTo(0, { immediate: scroller.reduced });
  else window.scrollTo({ top: 0, behavior: scroller.reduced ? 'auto' : 'smooth' });
}

export function scrollByRatio(ratio: number) {
  const top = Math.max(0, Math.min(window.scrollY + window.innerHeight * ratio, document.body.scrollHeight));
  if (scroller.lenis) scroller.lenis.scrollTo(top, { immediate: scroller.reduced });
  else window.scrollTo({ top, behavior: scroller.reduced ? 'auto' : 'smooth' });
}

/* VOL 旋钮的当前读数（0-100），role="slider" 的 aria-valuenow */
export function readScrollPercent() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.round(Math.min(1, Math.max(0, window.scrollY / max)) * 100);
}
