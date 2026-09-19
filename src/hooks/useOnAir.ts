import { useEffect } from 'react';
import { setActiveChannel } from '../state/tuner';

/**
 * 「在架频道」= 视口 42% 高度处所在的那一档。
 * 用一次 rAF 节流的算式取代多个 IntersectionObserver：观察者会在平滑滚动中途交错触发，
 * 导致遥控器点亮刚被换掉的频道（实测竞态）。锚点、PageDown、VOL 键走带全都适用。
 */
export function useOnAir(ids: readonly string[], enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;

    const compute = () => {
      raf = 0;
      const mid = window.scrollY + window.innerHeight * 0.42;
      let best = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= mid) best = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        best = ids[ids.length - 1];
      }
      setActiveChannel(best);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ids, enabled]);
}
