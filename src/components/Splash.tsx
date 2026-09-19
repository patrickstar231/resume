import { useEffect, useState } from 'react';
import { machine, profile } from '../data/site';
import { CoinIcon, KnobIcon } from './icons';
import { cn } from './ui';

/** 开机＝投币启动：一个 2px 描边的投币口。点击 / 任意键进入；reduced-motion 由 App 直接跳过。 */
export function Splash({ onEnter }: { onEnter: () => void }) {
  const [dropping, setDropping] = useState(false);

  const insert = () => {
    if (dropping) return;
    setDropping(true);
    window.setTimeout(onEnter, 560);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      insert();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dropping, onEnter]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[70] grid place-items-center bg-shell px-[var(--spacing-section-x)] py-8',
        dropping && 'pointer-events-none',
      )}
      onClick={insert}
    >
      <div className="w-full max-w-[560px]">
        <div className="relative rounded-panel border-2 border-ink bg-plate p-[clamp(1.4rem,4vw,2.6rem)] shadow-press">
          <div className="flex items-center justify-between gap-3">
            <span className="tag">
              {machine.model} / {machine.serial}
            </span>
            <span className="tag opacity-70">{machine.maker}</span>
          </div>

          <p className="mt-[var(--spacing-stack-md)] font-display text-display">{profile.nameZh}</p>
          <p className="mt-1 font-display text-h3">{profile.nameLatin}</p>
          <p className="mt-[var(--spacing-stack-sm)] text-lede">{profile.tagline}</p>

          {/* 投币口 */}
          <div className="relative mt-[var(--spacing-stack-lg)]">
            <div className="flex items-center gap-4 rounded-handle border-2 border-ink bg-liner px-5 py-4">
              <span className="relative block h-2 w-[min(46vw,180px)] shrink-0 rounded-capsule border-2 border-shell bg-ink" />
              <span className="tag text-shell">
                INSERT RESUME
                <span
                  aria-hidden
                  className="pm-blink ml-2 inline-block h-3 w-2 translate-y-[1px] bg-capsule"
                />
              </span>
            </div>
            {dropping ? (
              <span className="pm-coin absolute -top-1 left-10 grid h-9 w-9 place-items-center rounded-capsule border-2 border-ink bg-capsule text-ink">
                <CoinIcon className="h-5 w-5" />
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              insert();
            }}
            className="mt-[var(--spacing-stack-md)] flex min-h-[var(--spacing-hit)] w-full items-center justify-center gap-3 rounded-handle border-2 border-ink bg-punch px-6 py-4 font-display text-[1.35rem] uppercase leading-none text-shell shadow-press-sm transition-transform duration-150 hover:-translate-y-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <CoinIcon className="h-6 w-6" />
            {machine.coinSlogan}
          </button>
          <p className="mt-3 flex items-center gap-2 text-tag">
            <KnobIcon className="h-4 w-4" />
            点击按钮或按任意键开机。{machine.capacity}。
          </p>
        </div>
      </div>
    </div>
  );
}
