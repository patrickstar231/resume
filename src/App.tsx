import { useReducedMotion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { Cover, Spine, Splash, TopBar } from './components/Chrome';
import {
  ExperienceSection,
  MethodSection,
  ShotBand,
  SiteFooter,
  WorkSection,
} from './components/Sections';
import { useSmoothScroll } from './hooks/useSmoothScroll';

const HeroCanvas = lazy(() => import('./canvas/HeroCanvas').then((m) => ({ default: m.HeroCanvas })));

export default function App() {
  const reducedMotion = useReducedMotion() ?? false;
  useSmoothScroll(!reducedMotion);

  return (
    <>
      <a
        href="#top"
        className="label-mono sr-only focus:not-sr-only focus:fixed focus:left-section-x focus:top-4 focus:z-50 focus:bg-cream focus:px-4 focus:py-2 focus:text-ink"
      >
        跳到主要内容
      </a>
      <Splash reducedMotion={reducedMotion} />
      <Spine />
      <TopBar />
      <Suspense fallback={null}>
        <HeroCanvas reducedMotion={reducedMotion} />
      </Suspense>
      {/* 脊轨固定，正文列整体右移一个脊宽；页脚同列，保持单一阅读轴 */}
      <div className="relative z-10 lg:pl-spine">
        <main>
          <Cover />
          {/* Cover 之后的区块必须不透明，否则固定的 WebGL 画布会透出 */}
          <div className="bg-bg">
            <ExperienceSection />
            <ShotBand />
            <WorkSection />
            <MethodSection reducedMotion={reducedMotion} />
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
