import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { machine } from '../data/site';
import type { CapsuleColor } from '../data/site';

/* ── 机台零件库：注塑塑料 × 游戏厅灯箱 ─────────────────────────
   全部实色 + 2px 巧克力棕硬描边；唯一的「光」是 1px 上缘亮线。 */

export const cn = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export const TONE: Record<
  CapsuleColor,
  { solid: string; shell: string; ring: string; ink: string; name: string }
> = {
  punch: { solid: 'bg-punch', shell: 'bg-punch/35', ring: 'bg-punch', ink: 'text-shell', name: '大红' },
  cobalt: {
    solid: 'bg-cobalt',
    shell: 'bg-cobalt/30',
    ring: 'bg-cobalt',
    ink: 'text-shell',
    name: '钴蓝',
  },
  capsule: {
    solid: 'bg-capsule',
    shell: 'bg-capsule/45',
    ring: 'bg-capsule',
    ink: 'text-ink',
    name: '明黄',
  },
  gold: { solid: 'bg-gold', shell: 'bg-gold/35', ring: 'bg-gold', ink: 'text-ink', name: '限定金' },
};

/** 胶囊本体：上半透明壳 + 下半实色，open 时两半绕水平轴弹开（CSS 3D，无玻璃拟态 UI） */
export function CapsuleShell({
  tone,
  open = false,
  size = 88,
  stamp,
}: {
  tone: CapsuleColor;
  open?: boolean;
  size?: number;
  stamp?: string;
}) {
  const t = TONE[tone];
  // 开蛋：两半绕合模线铰开（半壳仍看得懂是塑料壳），中间露出奖品内核，不留空壳
  const swing = open
    ? {
        top: { rotateX: -62, y: -size * 0.07 },
        bottom: { rotateX: 52, y: size * 0.07 },
      }
    : { top: { rotateX: 0, y: 0 }, bottom: { rotateX: 0, y: 0 } };

  return (
    <span
      aria-hidden
      className="relative block shrink-0"
      style={{ width: size, height: size, perspective: size * 3.4 }}
    >
      <motion.span
        className={cn(
          'absolute inset-x-0 top-0 h-1/2 rounded-t-capsule border-2 border-b-0 border-ink shadow-mold',
          t.shell,
        )}
        style={{ transformOrigin: '50% 100%' }}
        animate={swing.top}
        transition={{ type: 'spring', stiffness: 240, damping: 19 }}
      />
      <motion.span
        className={cn(
          'absolute inset-x-0 bottom-0 flex h-1/2 items-center justify-center rounded-b-capsule border-2 border-t-0 border-ink',
          t.solid,
        )}
        style={{ transformOrigin: '50% 0%' }}
        animate={swing.bottom}
        transition={{ type: 'spring', stiffness: 210, damping: 18 }}
      >
        {stamp ? (
          <span
            className={cn('font-display tabular-nums', t.ink)}
            style={{ fontSize: size * 0.3, lineHeight: 1 }}
          >
            {stamp}
          </span>
        ) : null}
      </motion.span>
      <span
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-capsule border-2 border-ink bg-cobalt transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0',
        )}
        style={{ width: size * 0.44, height: size * 0.44 }}
      />
      <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-ink" />
    </span>
  );
}

/** 机台标签：品名 + 编号 + 一句话参数。内容永远印在货架上，不依赖开蛋 */
export function GoodsLabel({
  code,
  goods,
  params,
  tone,
  className,
}: {
  code: string;
  goods: string;
  params: string;
  tone: CapsuleColor;
  className?: string;
}) {
  return (
    <div className={cn('border-t-2 border-ink pt-[var(--spacing-stack-sm)]', className)}>
      <div className="flex items-center gap-2">
        <span className={cn('h-2.5 w-2.5 rounded-capsule border-2 border-ink', TONE[tone].solid)} />
        <span className="tag">{code}</span>
        <span className="ml-auto tag opacity-70">MADE IN {machine.model}</span>
      </div>
      <p className="mt-1 font-display text-h3">{goods}</p>
      <p className="mt-1 text-tag leading-snug">{params}</p>
    </div>
  );
}

export function Panel({
  children,
  className,
  as: As = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'aside' | 'li';
}) {
  return <As className={cn('panel p-[clamp(1.1rem,2.6vw,2rem)]', className)}>{children}</As>;
}

/** 铆钉排：机壳注塑的分模线，纯装饰 */
export function Rivets({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <span aria-hidden className={cn('flex items-center gap-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="h-2 w-2 rounded-capsule border-2 border-ink bg-plate" />
      ))}
    </span>
  );
}

/** 游戏厅灯箱跑马灯：实色底 + 棕字，滚动位移由 CSS 动画完成 */
export function LightBox({ words }: { words: string[] }) {
  const line = words.join('  ·  ');
  return (
    <div className="overflow-hidden border-y-2 border-ink bg-capsule py-3">
      <div className="pm-marquee flex w-max gap-14 whitespace-nowrap">
        {[0, 1, 2, 3].map((k) => (
          <span key={k} className="plate-label text-ink">
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 移动端：静态机台插画级 CSS 版（三原色实块 + 描边拼合，无 WebGL） */
export function StaticMachine({ capsules }: { capsules: CapsuleColor[] }) {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[330px] select-none">
      <div className="rounded-panel border-2 border-ink bg-plate p-4 shadow-press">
        <div className="rounded-t-capsule border-2 border-ink bg-liner p-3">
          <div className="grid grid-cols-4 gap-2">
            {capsules.concat(['punch', 'cobalt', 'capsule', 'gold', 'punch', 'cobalt']).map(
              (tone, i) => (
                <span key={i} className="overflow-hidden rounded-capsule border-2 border-ink">
                  <span className={cn('block h-2.5 w-full', TONE[tone].shell)} />
                  <span className={cn('block h-2.5 w-full', TONE[tone].solid)} />
                </span>
              ),
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-capsule border-2 border-ink bg-punch">
            <span className="h-4 w-1.5 rounded-capsule bg-plate" />
          </span>
          <span className="flex-1 rounded-handle border-2 border-ink bg-cobalt px-3 py-2">
            <span className="plate-label block text-shell">prize tray</span>
          </span>
        </div>
      </div>
      <div className="mx-auto h-4 w-24 rounded-b-panel border-2 border-t-0 border-ink bg-shell" />
    </div>
  );
}
