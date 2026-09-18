import { useReducedMotion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { HeroCopy, NavBar, Splash } from './components/Chrome';
import {
  AboutSection,
  ProjectsSection,
  SiteFooter,
  SocialRail,
  WorkMarquee,
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
        className="label-mono sr-only focus:not-sr-only focus:fixed focus:left-[var(--spacing-section-x)] focus:top-4 focus:z-50 focus:bg-cream focus:px-4 focus:py-2 focus:text-ink"
      >
        跳到主要内容
      </a>
      <Splash reducedMotion={reducedMotion} />
      <NavBar />
      <Suspense fallback={null}>
        <HeroCanvas reducedMotion={reducedMotion} />
      </Suspense>
      <main className="relative z-10">
        <HeroCopy />
        <div className="bg-bg">
          <WorkMarquee />
          <SocialRail />
          <AboutSection reducedMotion={reducedMotion} />
          <ProjectsSection />
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
