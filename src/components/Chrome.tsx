import { useSyncExternalStore } from 'react';
import { navLinks, profile } from '../data/site';
import {
  SECTION_WINDOWS,
  fastPassTo,
  getActive,
  sectionWindow,
  subscribeActive,
  type SectionId,
} from '../state/coaster';

/** 离散「当前区间」：只在跨站时推一次更新，不跟帧。 */
export function useActiveSection() {
  return useSyncExternalStore(subscribeActive, getActive, () => 'boarding' as SectionId);
}

/**
 * FAST PASS 导航：点击 = 程序化平滑滚动到对应站点区间中点。
 * 保留真实 href —— 无 JS / reduced-motion 时退化为原生锚点，且不劫持 wheel。
 */
export function FastPassBar() {
  const active = useActiveSection();

  const go = (event: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    event.preventDefault();
    fastPassTo(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="flex items-stretch justify-between border-b-2 border-edge bg-night">
        <a
          href="#top"
          onClick={(e) => go(e, 'boarding')}
          className="flex min-h-[52px] items-center gap-3 border-r-2 border-edge px-[var(--spacing-rail-x)]"
        >
          <span
            aria-hidden
            className="grid h-7 w-7 shrink-0 place-items-center border-2 border-edge bg-candy font-slab text-[0.9rem] leading-none text-cream"
          >
            潘
          </span>
          <span className="label-caps truncate text-cream">
            {profile.nameLatin}
            <span className="text-candy" aria-hidden>
              *
            </span>
          </span>
        </a>

        <nav aria-label="FAST PASS 快速乘车" className="flex items-stretch">
          {navLinks.map((link) => {
            const on = active === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => go(e, link.id)}
                aria-current={on ? 'true' : undefined}
                className={`label-caps relative flex min-h-[52px] items-center border-l-2 border-edge px-3 leading-none transition-colors duration-200 sm:px-5 ${
                  on
                    ? 'bg-candy text-cream'
                    : 'bg-night text-cream/75 hover:bg-night-lift hover:text-cream'
                }`}
              >
                {link.label}
                {on ? (
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-brass" />
                ) : null}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

/** 乘坐 HUD：已乘坐百分比 + 当前区间 + 下一站。读数全部来自真实区间。 */
export function RideHud() {
  const active = useActiveSection();
  const idx = SECTION_WINDOWS.findIndex((w) => w.id === active);
  const next = SECTION_WINDOWS[idx + 1];
  const pct = Math.round(((idx + 1) / SECTION_WINDOWS.length) * 100);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 border-t-2 border-edge bg-night"
    >
      <div className="flex items-stretch justify-between">
        <div className="flex min-w-0 items-center gap-3 px-[var(--spacing-rail-x)] py-2.5">
          <span className="h-3.5 w-3.5 shrink-0 border-2 border-edge bg-candy" />
          <span className="label-caps truncate text-cream">{sectionWindow(active).label}</span>
        </div>
        <div className="flex items-center gap-3 border-l-2 border-edge px-3 sm:gap-4 sm:px-5">
          <span className="label-caps hidden text-cream/70 lg:inline">
            {next ? `NEXT · ${next.label}` : 'TERMINUS · 已到站'}
          </span>
          <span className="relative block h-3.5 w-[5.5rem] overflow-hidden border-2 border-edge bg-night sm:w-32">
            <span className="absolute inset-y-0 left-0 bg-candy" style={{ width: `${pct}%` }} />
          </span>
          <span className="label-caps tabular-nums text-brass">
            {String(pct).padStart(2, '0')}%
          </span>
        </div>
      </div>
    </div>
  );
}
