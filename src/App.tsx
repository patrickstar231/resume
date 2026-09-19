import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { StationFooter, StationHeader, useTunerKeys } from './components/Chrome';
import { GuideChannel, HotlineSection, OrderSection, Teleticker } from './components/Sections';
import { ProgramChannel } from './components/ProgramChannel';
import { Remote, SnowFlash } from './components/Remote';
import { TestCard } from './components/TestCard';
import { programs, station } from './data/site';
import { useOnAir } from './hooks/useOnAir';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { scrollToElement, scrollToTop } from './state/scroll';
import { fireChannelFlash, setActiveChannel, useTuner } from './state/tuner';

const SECTION_IDS = ['ch00', 'ch01', 'ch02', 'ch03', 'hotline', 'order'] as const;

function channelId(key: string) {
  return key === '0' ? 'ch00' : `ch${key.padStart(2, '0')}`;
}

function channelBadge(key: string) {
  if (key === '0') return 'CH00';
  const program = programs.find((p) => p.key === key);
  return program ? program.channel : 'CH00';
}

export default function App() {
  const reduced = useReducedMotion() ?? false;
  useSmoothScroll(!reduced);
  useOnAir(SECTION_IDS, true);

  const { active, flash } = useTuner();
  const [boot, setBoot] = useState(!reduced);
  const [bootKey, setBootKey] = useState(0);
  const [flashLabel, setFlashLabel] = useState(station.id);

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduce' : 'full';
  }, [reduced]);

  const jump = useCallback(
    (key: string) => {
      const id = channelId(key);
      setFlashLabel(channelBadge(key));
      setActiveChannel(id);
      if (!reduced) fireChannelFlash();

      const target = document.getElementById(id);
      if (!target) return;
      if (reduced) {
        scrollToElement(target);
        return;
      }
      window.setTimeout(() => scrollToElement(target), 70);
    },
    [reduced],
  );

  const power = useCallback(() => {
    if (boot) {
      setBoot(false);
      return;
    }
    scrollToTop();
    setBootKey((k) => k + 1);
    setBoot(true);
  }, [boot]);

  useTunerKeys(jump, power);

  return (
    <>
      <a
        href="#ch00"
        className="label sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[80] focus:bg-cream focus:px-4 focus:py-2 focus:text-ink"
      >
        跳到节目目录
      </a>

      <AnimatePresence>{boot ? <TestCard key={bootKey} onDone={() => setBoot(false)} /> : null}</AnimatePresence>
      <SnowFlash tick={flash} label={flashLabel} enabled={!reduced} />

      <StationHeader active={active} />

      <main>
        <GuideChannel onJump={jump} />
        {programs.map((program, i) => (
          <ProgramChannel key={program.id} program={program} ordinal={i + 1} />
        ))}
        <HotlineSection />
        <OrderSection />
      </main>

      <StationFooter />
      <Teleticker />
      <Remote active={active} onJump={jump} onPower={power} />
    </>
  );
}
