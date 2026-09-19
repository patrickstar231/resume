import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { cantoneseProject, machine, roster, socials } from '../data/site';
import { CapsuleIcon, ExternalIcon, GridIcon, StarIcon } from './icons';
import { CapsuleShell, GoodsLabel, Panel, cn } from './ui';

/* ── 关于 / 履历 = 中奖名录 ───────────────────────────────────
   滚轮式名录墙（旋转木马布局）负责「爽」，下方贴纸清单负责「读得到」。 */

function RosterWheel() {
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start end', 'end start'] });
  const spin = useTransform(scrollYProgress, [0, 1], [-34, 34]);
  const still = useMotionValue(0);
  const step = 360 / roster.entries.length;

  return (
    <div
      ref={wrap}
      aria-hidden
      className="relative hidden h-[300px] overflow-hidden md:block"
      style={{ perspective: 1050 }}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative h-[176px] w-[224px]"
          style={{ rotateY: reduced ? 0 : spin, transformStyle: 'preserve-3d' }}
        >
          {roster.entries.map((entry, i) => (
            <WheelCard
              key={entry.code}
              entry={entry}
              angle={i * step}
              spin={reduced ? still : spin}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/** 滚轮上的一块铭牌：转到侧向就淡出，只留正对镜头的读得懂的卡片 */
function WheelCard({
  entry,
  angle,
  spin,
}: {
  entry: (typeof roster.entries)[number];
  angle: number;
  spin: MotionValue<number>;
}) {
  /* 正对镜头 ≤46° 全显，46→70° 淡出，侧向不再出现挤成一列的糊字 */
  const legibility = (rotation: number) => {
    const raw = (((angle + rotation) % 360) + 360) % 360;
    const off = Math.min(raw, 360 - raw);
    return off > 70 ? 0 : 1 - Math.max(0, (off - 46) / 24);
  };
  const opacity = useTransform(spin, legibility);

  return (
    <motion.div
      className="absolute inset-0 rounded-panel border-2 border-ink bg-plate p-4 shadow-press-sm"
      style={{
        transform: `rotateY(${angle}deg) translateZ(208px)`,
        backfaceVisibility: 'hidden',
        opacity,
      }}
    >
      <span className="tag">{entry.code}</span>
      <p className="mt-2 font-display text-h2 leading-none">{entry.org}</p>
      <p className="mt-2 text-tag leading-snug">{entry.kind}</p>
      <p className="mt-3 border-t-2 border-ink pt-2 text-tag leading-snug opacity-80">
        {entry.line}
      </p>
    </motion.div>
  );
}

/** 限定彩蛋：金色胶囊，开蛋逻辑与货架一致 */
function BonusCapsule() {
  const reduced = useReducedMotion() ?? false;
  const [open, setOpen] = useState(reduced);
  const egg = cantoneseProject;

  return (
    <Panel className="relative overflow-hidden">
      <span
        aria-hidden
        className="absolute -right-6 -top-6 grid h-24 w-24 rotate-12 place-items-center rounded-capsule border-2 border-ink bg-capsule font-display text-shell"
      >
        <StarIcon className="h-8 w-8 text-ink" />
      </span>
      <p className="tag flex items-center gap-2">
        <StarIcon className="h-4 w-4" /> 限定彩蛋 / LIMITED EDITION
      </p>
      <div className="mt-[var(--spacing-stack-md)] flex flex-wrap items-start gap-[var(--spacing-stack-md)]">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="bonus-prize"
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-[var(--spacing-hit)] items-center gap-3 rounded-handle border-2 border-ink bg-plate px-3 py-2 text-tag transition-colors duration-150 hover:bg-cobalt hover:text-shell"
        >
          <CapsuleShell tone="gold" open={open} size={64} stamp="00" />
          <span className="flex items-center gap-1.5">
            <CapsuleIcon className="h-4 w-4" />
            {open ? '收回彩蛋' : '扭开彩蛋'}
          </span>
        </button>
        <GoodsLabel
          className="min-w-[200px] flex-1"
          code={egg.code}
          goods={`${egg.goods} · ${egg.name}`}
          params={egg.metric}
          tone="gold"
        />
      </div>
      <p className="mt-[var(--spacing-stack-md)] max-w-[50ch] text-body">{egg.summary}</p>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id="bonus-prize"
            key="bonus"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <dl className="mt-[var(--spacing-stack-md)] grid gap-3 border-t-2 border-ink pt-[var(--spacing-stack-md)] sm:grid-cols-3">
              {egg.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-0 rounded-panel border-2 border-ink bg-shell p-3"
                >
                  <dt className="tag">{stat.label}</dt>
                  <dd className="mt-1 font-display numbers text-h3 break-words tabular-nums">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
            <ul className="mt-3 grid gap-2 text-body">
              {egg.bullets.map((line) => (
                <li key={line} className="border-l-2 border-ink pl-3">
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <a
        href={egg.url}
        target="_blank"
        rel="noreferrer"
        className="mt-[var(--spacing-stack-md)] flex min-h-[var(--spacing-hit)] w-fit items-center gap-2 rounded-handle border-2 border-ink bg-gold px-5 text-tag text-ink transition-transform duration-150 hover:-translate-y-[2px] active:translate-y-[2px]"
      >
        <ExternalIcon className="h-4 w-4" />
        打开 hk.datatrade.top
      </a>
    </Panel>
  );
}

/** 粉丝俱乐部贴纸区：社媒三链 + 真实二维码 */
function FanClub() {
  return (
    <Panel as="aside">
      <p className="tag flex items-center gap-2">
        <GridIcon className="h-4 w-4" /> 粉丝俱乐部 / FAN CLUB
      </p>
      <h3 className="mt-2 font-display text-h2">贴纸三张，扫码即达</h3>
      <ul className="mt-[var(--spacing-stack-md)] grid gap-3">
        {socials.map((social) => (
          <li key={social.name} className="-rotate-[0.6deg] odd:rotate-[0.7deg]">
            <a
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[var(--spacing-hit)] items-center gap-4 rounded-panel border-2 border-ink bg-shell p-3 transition-colors duration-150 hover:bg-cobalt hover:text-shell"
            >
              <span className="grid h-[76px] w-[76px] shrink-0 place-items-center rounded-panel border-2 border-ink bg-plate p-1.5 text-ink">
                <QRCodeSVG value={social.url} size={64} fgColor="currentColor" bgColor="transparent" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-h3">{social.name}</span>
                <span className="mt-1 block text-tag leading-snug">{social.note}</span>
              </span>
              <ExternalIcon className="ml-auto h-5 w-5 shrink-0" />
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-[var(--spacing-stack-sm)] text-tag opacity-75">
        三条链接由本人逐条确认可达（2026-09-18）。二维码内容即上方真实主页地址。
      </p>
    </Panel>
  );
}

export function RosterSection() {
  return (
    <section id="roster" className="relative px-[var(--spacing-section-x)] py-section-y">
      <div className="w-full lg:max-w-[52%]">
        <p className="tag">中奖名录 / WINNER LIST</p>
        <h2 className="mt-2 max-w-[22ch] font-display text-h1">
          15 年 527 个项目，
          <br />
          全在这台机的出货记录里
        </h2>

        <dl className="mt-[var(--spacing-stack-lg)] grid gap-3 sm:grid-cols-3">
          {roster.figures.map((figure) => (
            <div
              key={figure.label}
              className={cn(
                'rounded-panel border-2 border-ink p-4 shadow-press-sm',
                figure.value === '527' ? 'bg-cobalt text-shell' : 'bg-plate',
              )}
            >
              <dt className="tag">{figure.label}</dt>
              <dd className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
                <span className="font-display numbers text-h2 tabular-nums leading-none">
                  {figure.value}
                </span>
                <span className="text-tag whitespace-nowrap">{figure.unit}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-[var(--spacing-stack-xl)]">
          <RosterWheel />
        </div>

        {/* 名录清单：滚轮的兜底阅读路径，条目与轮上一一对应 */}
        <div className="mt-[var(--spacing-stack-lg)] rounded-panel border-2 border-ink bg-plate p-[clamp(1rem,2.4vw,1.75rem)]">
          <p className="tag">履历序列 / 出场顺序即在职先后</p>
          <ol className="mt-3">
            {roster.entries.map((entry) => (
              <li
                key={entry.code}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b-2 border-ink py-3 last:border-b-0"
              >
                <span className="tag w-[72px] shrink-0">{entry.code}</span>
                <span className="font-display text-h3">{entry.org}</span>
                <span className="text-tag">{entry.kind}</span>
                <span className="ml-auto max-w-[26ch] text-tag opacity-80">{entry.line}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-tag opacity-75">{roster.note}</p>
        </div>

        <div className="mt-[var(--spacing-stack-xl)] grid gap-[var(--spacing-stack-md)] xl:grid-cols-2 xl:items-start">
          <BonusCapsule />
          <FanClub />
        </div>

        <p className="mt-[var(--spacing-stack-lg)] flex flex-wrap items-center gap-2 text-tag">
          <span aria-hidden className="h-3 w-3 rounded-capsule border-2 border-ink bg-gold" />
          {machine.capacity} · 本机不投放任何虚构奖项、虚构数字与虚构 testimonial。
        </p>
      </div>
    </section>
  );
}
