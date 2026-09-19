import { lazy, Suspense, useCallback, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { FastPassBar, RideHud } from './components/Chrome';
import { Ride } from './components/Ride';
import { TicketBooth } from './components/TicketBooth';
import { useCoasterFlags, useIsMobile, useSmoothScroll } from './hooks/useSmoothScroll';

const CoasterCanvas = lazy(() =>
  import('./canvas/CoasterCanvas').then((m) => ({ default: m.CoasterCanvas })),
);

export default function App() {
  const reduced = useReducedMotion() ?? false;
  const mobile = useIsMobile();
  useCoasterFlags();
  // reduced-motion 下不接管滚动：静态卡片流 + 原生滚动
  useSmoothScroll(!reduced);

  const [boarded, setBoarded] = useState(reduced);
  const onBoard = useCallback(() => setBoarded(true), []);
  // 移动端与 reduced-motion 都走完整纵向卡片流
  const flow = reduced || mobile;

  return (
    <>
      <a
        href="#top"
        className="label-caps sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:bg-cream focus:px-4 focus:py-3 focus:text-ink"
      >
        跳到主要内容
      </a>

      {boarded ? null : <TicketBooth onBoard={onBoard} />}

      <Suspense fallback={null}>
        <CoasterCanvas reduced={reduced} mobile={mobile} boarded={boarded} />
      </Suspense>

      <FastPassBar />
      <Ride flow={flow} />
      <RideHud />
    </>
  );
}
