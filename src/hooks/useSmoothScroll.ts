import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { coaster, measure, publishScroll, registerScrollApi } from '../state/coaster';

/**
 * 滚动驱动：Lenis 只做「平滑」，**不接管滚动容器**——
 * 原生 wheel / 键盘 / 锚点 / Home·End 全部照常，读屏顺序不变。
 *
 * 单一读取源：一个 rAF 读 window.scrollY 再 publish，
 * 这样无论是 Lenis、键盘还是锚点跳转，画布与面板拿到的都是同一个值。
 */
export function useSmoothScroll(active: boolean) {
  useEffect(() => {
    measure();
    publishScroll(window.scrollY);

    const onResize = () => {
      measure();
      publishScroll(window.scrollY);
    };
    window.addEventListener('resize', onResize, { passive: true });

    let lenis: Lenis | null = null;
    if (active) {
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 0.9,
        smoothWheel: !coarse,
        touchMultiplier: 1.6,
      });
      registerScrollApi({ scrollTo: (y) => lenis?.scrollTo(y, { duration: 1.15 }) });
    } else {
      registerScrollApi(null);
    }

    let frame = 0;
    const loop = (time: number) => {
      lenis?.raf(time);
      publishScroll(window.scrollY);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      registerScrollApi(null);
      window.removeEventListener('resize', onResize);
    };
  }, [active]);
}

/** 390×844 断点：画布要靠它真的重渲染（降细分、切 DOM 站点卡），不能只改可变标记。 */
export function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia('(max-width: 767px)').matches,
  );
  useEffect(() => {
    const mb = window.matchMedia('(max-width: 767px)');
    const sync = () => {
      setMobile(mb.matches);
      coaster.mobile = mb.matches;
      measure();
    };
    sync();
    mb.addEventListener('change', sync);
    return () => mb.removeEventListener('change', sync);
  }, []);
  return mobile;
}

/** 同步 reduced / mobile 标记，供画布与 DOM 分支判断。 */
export function useCoasterFlags() {
  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mb = window.matchMedia('(max-width: 767px)');
    const sync = () => {
      coaster.reduced = rm.matches;
      coaster.mobile = mb.matches;
      measure();
    };
    sync();
    rm.addEventListener('change', sync);
    mb.addEventListener('change', sync);
    return () => {
      rm.removeEventListener('change', sync);
      mb.removeEventListener('change', sync);
    };
  }, []);
}
