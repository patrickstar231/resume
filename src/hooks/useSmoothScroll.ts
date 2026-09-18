import { useEffect } from 'react';
import Lenis from 'lenis';
import { syncScroll } from '../state/scroll';

export function useSmoothScroll(active: boolean) {
  useEffect(() => {
    const onNativeScroll = () => syncScroll(window.scrollY);
    if (!active) {
      syncScroll(window.scrollY);
      window.addEventListener('scroll', onNativeScroll, { passive: true });
      return () => window.removeEventListener('scroll', onNativeScroll);
    }

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.9,
      smoothWheel: !window.matchMedia('(pointer: coarse)').matches,
    });
    lenis.on('scroll', (instance: { scroll: number }) => syncScroll(instance.scroll));

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [active]);
}
