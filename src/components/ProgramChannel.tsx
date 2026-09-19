import { usePresence } from '../hooks/useSmoothScroll';
import { profile, type Program } from '../data/site';
import { TvSet } from './TvSet';
import { ArrowRightIcon, ExternalIcon, SealIcon } from './icons';

/** 一档节目 = 一屏：屏幕内播母带，屏幕外贴规格表与价格签。 */
export function ProgramChannel({ program, ordinal }: { program: Program; ordinal: number }) {
  const { ref, present } = usePresence<HTMLElement>();
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
    `【${program.channel} 咨询】${program.title} · 来自 CHANNEL 潘`,
  )}&body=${encodeURIComponent(
    `潘宇龙您好：\n\n我想就本台 ${program.channel}《${program.title}》下单（${program.priceNote}：${program.price}）。\n\n联系方式：`,
  )}`;

  return (
    <section
      id={program.id}
      ref={ref}
      aria-labelledby={`${program.id}-title`}
      className="min-h-[100svh] border-t-2 border-line"
    >
      {/* 频道识别带：整块高饱和实色，墨黑字 */}
      <div className={`${program.solid} on-solid text-ink`}>
        <div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-end justify-between gap-x-6 gap-y-1 px-[var(--spacing-gutter)] py-3">
          <div className="flex min-w-0 flex-wrap items-end gap-x-4 gap-y-1">
            <span className="font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-none">
              {program.channel}
            </span>
            <h2
              id={`${program.id}-title`}
              className="min-w-0 font-display text-h2 leading-tight"
            >
              {program.title}
            </h2>
          </div>
          <p className="label min-w-0">
            {program.latin}
            <span className="whitespace-nowrap"> · 第 {ordinal} / 3 档</span>
          </p>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1100px] items-start gap-x-[var(--spacing-stack-lg)] gap-y-[var(--spacing-stack-lg)] px-[var(--spacing-gutter)] py-[var(--spacing-page-y)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0">
          <TvSet program={program} active={present} />

          <div className="mt-[var(--spacing-stack-md)] flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="label inline-flex items-center gap-2 text-phosphor">
              <span aria-hidden className="h-2.5 w-2.5 rounded-key bg-phosphor" />
              {program.status}
            </span>
            <span className="label text-muted">{program.category}</span>
          </div>

          <p className="mt-[var(--spacing-stack-md)] max-w-[52ch] text-body text-muted">
            {program.summary}
          </p>

          <ul className="mt-[var(--spacing-stack-md)] grid gap-x-[var(--spacing-stack-lg)] gap-y-2 border-t border-line pt-[var(--spacing-stack-md)] md:grid-cols-3">
            {program.bullets.map((bullet) => (
              <li key={bullet} className="text-body text-cream/90">
                <span aria-hidden className="mr-2 text-lemon">
                  ▸
                </span>
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        <aside className="min-w-0">
          {/* 价格签：柠檬黄只用于价格 / 成交 */}
          <div className="-rotate-[1.5deg] bg-lemon px-5 py-4 text-ink">
            <div className="flex items-center justify-between gap-3">
              <span className="label">本台成交记录</span>
              <SealIcon size={22} />
            </div>
            <p className="font-display text-price tabular-nums">{program.price}</p>
            <p className="label">{program.priceNote}</p>
          </div>

          <div className="mt-[var(--spacing-stack-md)] border-2 border-line bg-ink-soft p-[var(--spacing-stack-md)]">
            <div className="flex items-center justify-between gap-3 border-b-2 border-line pb-2">
              <span className="label text-cream">商品规格表 · 本台实测</span>
              <span className="label text-muted">SPECS</span>
            </div>
            <dl>
              {program.specs.map((spec) => (
                <div key={spec.label} className="border-b border-line py-2 last:border-b-0">
                  <div className="flex items-baseline gap-2">
                    <dt className="label shrink-0 text-muted">{spec.label}</dt>
                    <span aria-hidden className="min-w-4 flex-1 border-b border-dotted border-line-strong" />
                    <dd className="shrink-0 text-right font-mono text-body tabular-nums text-cream">
                      {spec.value}
                    </dd>
                  </div>
                  <p className="mt-1 text-caption text-muted">{spec.note}</p>
                </div>
              ))}
            </dl>
          </div>

          <figure className="mt-[var(--spacing-stack-md)] border-l-4 border-cream/70 bg-ink-soft p-[var(--spacing-stack-md)]">
            <figcaption className="label text-muted">主持人串词 · 本台话术组</figcaption>
            <blockquote className="mt-2 text-lede text-cream">{program.pitch}</blockquote>
          </figure>

          <div className="mt-[var(--spacing-stack-md)] flex flex-wrap items-center gap-3">
            <a
              href={mailto}
              className={`inline-flex min-h-12 items-center gap-3 px-6 text-body font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 ${program.solid} on-solid`}
            >
              <span className="label">打进本档热线</span>
              <ArrowRightIcon size={20} />
            </a>
            <a
              href={program.url}
              target="_blank"
              rel="noreferrer"
              className="label inline-flex min-h-12 items-center gap-2 border-2 border-line-strong px-5 text-cream transition-colors duration-200 hover:border-cream"
            >
              核对现场原件
              <ExternalIcon size={18} />
            </a>
          </div>
          <p className="label mt-2 text-muted">
            本档所有参数可在现场原件与母带中逐条回放核对。
          </p>
        </aside>
      </div>
    </section>
  );
}
