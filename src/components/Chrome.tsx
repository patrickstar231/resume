import { useEffect, useRef } from 'react';
import { navLinks, profile, station } from '../data/site';
import { setActiveChannel } from '../state/tuner';
import { scrollToTop } from '../state/scroll';
import { AntennaIcon } from './icons';

/** 台标条：频道 ID + 导视锚点。换台时点亮当前频道（磷光绿 = 在架状态）。 */
export function StationHeader({ active }: { active: string }) {
  const navRef = useRef<HTMLElement>(null);

  /* 窄屏导视条可横滑：换台后把「在架」那一项滚进可见区（只动这条，不动页面） */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    nav.querySelector('[aria-current="true"]')?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }, [active]);

  return (
    <header className="sticky top-0 z-30 border-b-2 border-line bg-ink/95">
      <div className="mx-auto flex h-14 w-full max-w-[1100px] items-center gap-x-4 px-[var(--spacing-gutter)]">
        <a
          href="#ch00"
          onClick={() => scrollToTop()}
          className="flex min-h-11 shrink-0 items-center gap-2 text-cream"
        >
          <AntennaIcon size={22} className="text-lemon" />
          <span className="font-display text-[1.15rem] leading-none tracking-tight">
            {station.id}
          </span>
        </a>
        <span className="label hidden text-muted md:inline">{station.zh}</span>
        <nav
          ref={navRef}
          aria-label="节目导视"
          className="no-bar ml-auto flex min-w-0 flex-1 flex-nowrap items-center gap-1 overflow-x-auto overscroll-x-contain pl-1 sm:flex-none sm:justify-end sm:pl-0"
        >
          {navLinks.map((link) => {
            const onAir = active === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={onAir ? 'true' : undefined}
                onClick={() => setActiveChannel(link.id)}
                className={`label inline-flex min-h-11 shrink-0 items-center whitespace-nowrap px-3 transition-colors duration-200 ${
                  onAir ? 'bg-ink-soft text-phosphor' : 'text-muted hover:text-cream'
                }`}
              >
                {onAir ? <span aria-hidden className="mr-2 h-2 w-2 rounded-key bg-phosphor" /> : null}
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

/** 遥控器与键盘共用：0-3 换台 / Esc 关机回测试卡 / 方向键由 VOL 旋钮承接。 */
export function useTunerKeys(jump: (key: string) => void, onPower: () => void) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        onPower();
        return;
      }
      if (['0', '1', '2', '3'].includes(event.key)) {
        event.preventDefault();
        jump(event.key);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [jump, onPower]);
}

export function StationFooter() {
  return (
    <p className="label border-t-2 border-line px-[var(--spacing-gutter)] py-4 text-muted">
      © 2026 {profile.nameLatin} · {station.id} 试播台标 · 本页全部数值取自本人真实交付记录
    </p>
  );
}
