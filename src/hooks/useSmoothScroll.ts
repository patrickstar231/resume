import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { scroller } from '../state/scroll';

export function useSmoothScroll(active: boolean) {
  useEffect(() => {
    scroller.reduced = !active;
    scroller.lenis = null;
    if (!active) return;
    /* 触控设备保留原生惯性滚动，不接管 */
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.9,
      smoothWheel: true,
    });
    scroller.lenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      scroller.lenis = null;
    };
  }, [active]);
}

/**
 * 一档节目 = 一屏。present：进入视口前提前 200px 挂载并播放母带，
 * 离开即暂停归零，避免三块屏幕同时解码。
 */
export function usePresence<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [present, setPresent] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setPresent(entry.isIntersecting), {
      rootMargin: '200px 0px',
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return { ref, present };
}
