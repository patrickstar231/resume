import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { bars, profile, station } from '../data/site';

const STEP = 240; // 5-4-3-2-1
const HOLD = 600; // ON AIR
const COUNT = station.countdown.length;

/**
 * 开机测试卡：SMPTE 实色彩条 + 中央白圆倒计时 → ON AIR，全程 1.8s。
 * 点击任意处 / 按 Esc（由遥控器 POWER 接管）可跳过；reduced-motion 下 App 不挂载本组件。
 */
export function TestCard({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = Array.from({ length: COUNT }).map((_, i) =>
      window.setTimeout(() => setStep(i + 1), STEP * (i + 1)),
    );
    const done = window.setTimeout(onDone, STEP * COUNT + HOLD);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(done);
    };
  }, [onDone]);

  const onAir = step >= COUNT;
  const number = onAir ? null : station.countdown[Math.min(step, COUNT - 1)];

  return (
    <motion.div
      role="status"
      aria-label="频道试机信号"
      onMouseDown={onDone}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      className="fixed inset-0 z-[70] flex cursor-pointer flex-col bg-screen"
    >
      <div aria-hidden className="flex min-h-0 flex-1 gap-px">
        {bars.map((b) => (
          <span key={b} className={`flex-1 ${b}`} />
        ))}
      </div>

      <div aria-hidden className="flex h-[16%] shrink-0 gap-px">
        <span className="flex-[2] bg-screen-dim" />
        <span className="flex-[2] bg-cream" />
        <span className="flex-[2] bg-screen-dim" />
        <span className="flex-[2] bg-cyanbar" />
        <span className="flex-[2] bg-screen-dim" />
        <span className="flex-[2] bg-vermilion" />
        <span className="flex-[2] bg-screen-dim" />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative grid h-[min(58vmin,320px)] w-[min(58vmin,320px)] place-items-center rounded-key bg-cream">
          <span aria-hidden className="absolute inset-x-0 top-1/2 h-px -translate-y-px bg-ink/45" />
          <span aria-hidden className="absolute inset-y-0 left-1/2 w-px -translate-x-px bg-ink/45" />
          <span aria-hidden className="absolute inset-6 rounded-key border-2 border-ink/35" />
          {onAir ? (
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="relative px-3 font-display text-[clamp(1.75rem,7vmin,3.5rem)] text-vermilion"
            >
              ON AIR
            </motion.span>
          ) : (
            <motion.span
              key={number}
              initial={{ opacity: 0, transform: 'scale(1.16)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              transition={{ duration: 0.14 }}
              className="relative font-display text-[clamp(3.5rem,17vmin,9rem)] tabular-nums text-ink"
            >
              {number}
            </motion.span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-2 bg-ink px-[var(--spacing-gutter)] py-3">
        <span className="label text-cream">
          {station.id} · 试机信号 TEST PATTERN
        </span>
        <span className="label text-muted">
          {profile.nameZh} · {profile.role}
        </span>
        <span className="label text-lemon">点击任意处或按 Esc 直接进台</span>
      </div>
    </motion.div>
  );
}
