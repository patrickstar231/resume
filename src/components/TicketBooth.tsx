import { useEffect, useState } from 'react';
import { profile } from '../data/site';

/**
 * Splash 售票亭：一张奶油票根（齿孔边用 CSS mask），
 * 红色印章 0.8s 盖下 → 闸门开启 → 登车。可跳过；reduced-motion 直接过。
 */
export function TicketBooth({ onBoard }: { onBoard: () => void }) {
  const [gone, setGone] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const total = window.setTimeout(() => setGone(true), 2450);
    const gate = window.setTimeout(() => setLeaving(true), 1500);
    return () => {
      clearTimeout(total);
      clearTimeout(gate);
    };
  }, []);

  useEffect(() => {
    if (gone) onBoard();
  }, [gone, onBoard]);

  if (gone) return null;

  const skip = () => {
    setGone(true);
  };

  return (
    <section
      aria-label="售票亭"
      className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-night px-5"
    >
      <div aria-hidden className="halftone absolute inset-0 opacity-60" />
      {/* 闸门两片：硬边漆面，向两侧滑开 */}
      <div
        aria-hidden
        className={`gate-leaf gate-leaf--open-left absolute inset-y-0 left-0 w-1/2 border-r-2 border-edge bg-candy`}
      >
        <div className="absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 bg-candy-shade" />
        <div className="absolute inset-x-0 top-1/2 mt-6 h-1.5 bg-edge" />
      </div>
      <div
        aria-hidden
        className={`gate-leaf gate-leaf--open-right absolute inset-y-0 right-0 w-1/2 border-l-2 border-edge bg-candy`}
      >
        <div className="absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 bg-candy-shade" />
        <div className="absolute inset-x-0 top-1/2 mt-6 h-1.5 bg-edge" />
      </div>

      {/* 票根 */}
      <div className="relative w-full max-w-[42rem]">
        <div
          className={`ticket ticket-perf hard-edge flex items-stretch transition-transform duration-700 ${
            leaving ? '-translate-y-3 opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          {/* 票根存根联 */}
          <div className="relative flex w-[24%] min-w-[6rem] flex-col items-center justify-between border-r-2 border-dashed border-edge/45 py-6">
            <span className="label-caps [writing-mode:vertical-rl] text-ink/70">ADMIT ONE</span>
            <span className="font-slab text-[1.6rem] leading-none text-candy">01</span>
            <span className="label-caps [writing-mode:vertical-rl] text-brass">NO.2026-PYL</span>
          </div>

          <div className="flex-1 px-[clamp(1rem,4vw,2.25rem)] py-[clamp(1.25rem,4vw,2rem)]">
            <p className="label-caps text-ink/70">BOX OFFICE · 售票亭</p>
            <h1 className="mt-3 font-slab text-[clamp(2.1rem,7.2vw,4.1rem)] leading-[0.94] text-ink">
              {profile.nameLatin}
            </h1>
            <p className="mt-3 text-lede text-ink/85">
              {profile.nameZh}
              <span className="mx-2 text-candy" aria-hidden>
                /
              </span>
              {profile.role}
            </p>
            <p className="mt-4 max-w-[34ch] text-body text-ink/80">{profile.tagline}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t-2 border-edge/15 pt-3">
              <span className="label-caps text-ink/70">SINGLE RIDE</span>
              <span className="label-caps text-candy">3 STATIONS</span>
              <span className="label-caps text-ink/70">NO REFUND</span>
            </div>
          </div>
        </div>

        {/* 红色印章：0.8s 盖下 */}
        <div
          aria-hidden
          className="animate-stamp pointer-events-none absolute -right-2 top-[58%] select-none sm:right-6"
        >
          <div className="relative grid h-24 w-24 -rotate-[11deg] place-items-center border-[3px] border-candy text-center text-candy sm:h-28 sm:w-28">
            <span className="halftone absolute inset-1 opacity-25" />
            <span className="relative font-slab text-[0.95rem] leading-none">PASSED</span>
            <span className="relative mt-1 font-slab text-[0.875rem] leading-none">已验票</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={skip}
        className="label-caps absolute bottom-7 right-[clamp(1.15rem,5vw,4.5rem)] inline-flex min-h-[44px] items-center gap-2 border-2 border-edge bg-night px-5 text-cream transition-colors duration-200 hover:bg-candy hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        跳过 · 直接上车
        <span aria-hidden>→</span>
      </button>
    </section>
  );
}
