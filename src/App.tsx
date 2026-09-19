import { useReducedMotion } from 'framer-motion';
import { lazy, Suspense, useState } from 'react';
import { HeroSection, NavBar } from './components/Chrome';
import { CapsuleShelf } from './components/CapsuleShelf';
import { RedeemSection } from './components/Redeem';
import { RosterSection } from './components/Roster';
import { Splash } from './components/Splash';
import { marqueeWords } from './data/site';
import { useMediaQuery, useScrollLock } from './hooks/useMachine';
import { useSmoothScroll } from './hooks/useSmoothScroll';

const PrizeCabin = lazy(() =>
  import('./canvas/PrizeCabin').then((m) => ({ default: m.PrizeCabin })),
);

export default function App() {
  const reducedMotion = useReducedMotion() ?? false;
  // 移动端 / 窄屏：WebGL 整段不挂载，改由 CSS 机台插画顶上
  const compact = useMediaQuery('(max-width: 767px)');
  const [booted, setBooted] = useState(reducedMotion);

  useSmoothScroll(!reducedMotion && booted);
  useScrollLock(!booted);

  return (
    <>
      <a
        href="#top"
        className="tag sr-only focus:not-sr-only focus:fixed focus:left-[var(--spacing-section-x)] focus:top-20 focus:z-50 focus:rounded-handle focus:border-2 focus:border-ink focus:bg-capsule focus:px-4 focus:py-2 focus:text-ink"
      >
        跳到主要内容
      </a>

      {!booted ? <Splash onEnter={() => setBooted(true)} /> : null}
      <NavBar />

      {compact ? null : (
        <Suspense fallback={null}>
          <PrizeCabin reduced={reducedMotion} />
        </Suspense>
      )}

      <main className="relative z-10">
        <HeroSection compact={compact} />
        <CapsuleShelf />
        <RosterSection />
        <RedeemSection words={marqueeWords} />
      </main>
    </>
  );
}
