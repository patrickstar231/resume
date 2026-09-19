import { motion, useReducedMotion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { bRoll, bars, profile, programs, sisterShow, socials, station, tickerFacts } from '../data/site';
import { usePresence } from '../hooks/useSmoothScroll';
import { scrollToElement } from '../state/scroll';
import {
  ArrowRightIcon,
  DownloadIcon,
  EnvelopeIcon,
  ExternalIcon,
  PhoneRingIcon,
  SealIcon,
  TagIcon,
  TvIcon,
} from './icons';

function BarsStrip({ height = 'h-4' }: { height?: string }) {
  return (
    <div aria-hidden className={`flex w-full ${height}`}>
      {bars.map((b) => (
        <span key={b} className={`flex-1 ${b}`} />
      ))}
    </div>
  );
}

/** CH00 导视：台标 + 主持人 + 今日在售目录 + 库存状态。 */
export function GuideChannel({ onJump }: { onJump: (key: string) => void }) {
  const { ref } = usePresence<HTMLElement>();

  return (
    <section
      id="ch00"
      ref={ref}
      aria-labelledby="ch00-title"
      className="min-h-[100svh] border-t-2 border-line"
    >
      <BarsStrip height="h-6" />
      <div className="mx-auto grid w-full max-w-[1100px] gap-x-[var(--spacing-stack-xl)] gap-y-[var(--spacing-stack-lg)] px-[var(--spacing-gutter)] py-[var(--spacing-page-y)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-w-0">
          <p className="label flex items-center gap-2 text-phosphor">
            <span aria-hidden className="crt-flicker h-2.5 w-2.5 rounded-key bg-phosphor" />
            ON AIR · {station.zh}
          </p>
          <h1
            id="ch00-title"
            className="mt-[var(--spacing-stack-md)] font-display text-display"
          >
            CHANNEL 潘
            <span className="mt-2 block text-h1 text-lemon">永不打烊的现场购物台</span>
          </h1>
          <p className="mt-[var(--spacing-stack-md)] max-w-[46ch] text-lede text-cream">
            {station.line}
          </p>
          <p className="mt-[var(--spacing-stack-md)] max-w-[48ch] text-body text-muted">
            {station.intro}
          </p>

          <dl className="mt-[var(--spacing-stack-lg)] grid gap-x-[var(--spacing-stack-lg)] gap-y-3 sm:grid-cols-2">
            <div className="border-t-2 border-line pt-2">
              <dt className="label text-muted">主持人 / 制作</dt>
              <dd className="mt-1 font-display text-h3 text-cream">
                {profile.nameZh}
                <span className="ml-2 text-caption text-muted">{profile.nameLatin}</span>
              </dd>
            </div>
            <div className="border-t-2 border-line pt-2">
              <dt className="label text-muted">本台职责</dt>
              <dd className="mt-1 text-body text-cream">{profile.role}</dd>
            </div>
            <div className="border-t-2 border-line pt-2">
              <dt className="label text-muted">台训</dt>
              <dd className="mt-1 text-body text-cream">{profile.tagline}</dd>
            </div>
            <div className="border-t-2 border-line pt-2">
              <dt className="label text-muted">库存状态</dt>
              <dd className="mt-1 flex items-center gap-2 text-body text-cream">
                <span aria-hidden className="h-2.5 w-2.5 rounded-key border border-ink bg-phosphor" />
                {profile.stock} · {profile.available}
              </dd>
            </div>
          </dl>
        </div>

        {/* 今日在售目录 */}
        <div className="min-w-0">
          <div className="border-2 border-line bg-ink-soft">
            <div className="flex items-center justify-between gap-3 border-b-2 border-line px-[var(--spacing-stack-md)] py-3">
              <span className="label text-cream">今日在售 · 三档节目</span>
              <span className="label text-muted">ON SALE NOW</span>
            </div>
            <ul>
              {programs.map((program) => (
                <li key={program.id} className="border-b border-line last:border-b-0">
                  <a
                    href={`#${program.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      onJump(program.key);
                    }}
                    className="group flex min-h-[64px] items-center gap-4 px-[var(--spacing-stack-md)] py-3"
                  >
                    <span
                      aria-hidden
                      className={`grid h-12 w-16 shrink-0 place-items-center ${program.solid} font-display text-[1.05rem] text-ink`}
                    >
                      {program.channel}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body text-cream group-hover:text-lemon">
                        {program.title}
                      </span>
                      <span className="label mt-1 block text-muted">
                        {program.category}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-display text-h3 tabular-nums text-lemon">
                        {program.price}
                      </span>
                      <span className="label block text-muted">成交记录</span>
                    </span>
                    <ArrowRightIcon size={20} className="shrink-0 text-cream" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="label px-[var(--spacing-stack-md)] py-3 text-muted">
              遥控器数字键 1 / 2 / 3 可直接换台
            </p>
          </div>

          <div className="mt-[var(--spacing-stack-md)] flex items-start gap-3 border-2 border-lemon p-[var(--spacing-stack-md)]">
            <SealIcon size={26} className="mt-0.5 shrink-0 text-lemon" />
            <p className="text-body text-cream">
              {station.notice}
              <span className="mt-1 block text-caption text-muted">
                数值出处：本人交付记录与项目现场原件，可逐条回播核对。
              </span>
            </p>
          </div>

          <div className="mt-[var(--spacing-stack-md)] grid grid-cols-2 gap-[var(--spacing-stack-md)]">
            <a
              href="#order"
              onClick={(event) => {
                event.preventDefault();
                const target = document.getElementById('order');
                if (target) scrollToElement(target);
              }}
              className="flex min-h-[64px] flex-col justify-center gap-1 bg-lemon px-5 text-ink"
            >
              <span className="label">限时下单 · 本台不收定金</span>
              <span className="flex items-center gap-2 whitespace-nowrap font-display text-h3">
                现在买
                <ArrowRightIcon size={20} />
              </span>
            </a>
            <div className="flex min-h-[64px] items-center gap-3 border-2 border-line bg-ink-soft px-5">
              <TagIcon size={22} className="shrink-0 text-cream" />
              <span className="label text-muted">
                3 档节目 · 527 个项目累计成交
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 底部信息字幕条：真实履历事实走带。 */
export function Teleticker() {
  const reduced = useReducedMotion() ?? false;
  const line = tickerFacts.join(' · ');

  return (
    <div
      aria-label="本台实录字幕：真实履历事实"
      className={`fixed inset-x-0 bottom-0 z-30 flex h-[var(--spacing-ticker)] items-center gap-3 border-t-2 border-line bg-ink-soft pl-3 ${
        reduced ? 'overflow-x-auto' : 'overflow-hidden'
      }`}
    >
      <span className="label flex shrink-0 items-center gap-2 text-phosphor">
        <span aria-hidden className="h-2 w-2 rounded-key bg-phosphor" />
        字幕
      </span>
      {reduced ? (
        <p className="label shrink-0 whitespace-nowrap pr-3 text-cream">{line}</p>
      ) : (
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="ticker-track">
            <span className="label whitespace-nowrap pr-16 text-cream">{line}</span>
            <span aria-hidden className="label whitespace-nowrap pr-16 text-cream">
              {line}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/** 姊妹栏目 + 观众热线 */
export function HotlineSection() {
  return (
    <section
      id="hotline"
      aria-labelledby="hotline-title"
      className="border-t-2 border-line"
    >
      <div className="mx-auto grid w-full max-w-[1100px] gap-x-[var(--spacing-stack-lg)] gap-y-[var(--spacing-stack-lg)] px-[var(--spacing-gutter)] py-[var(--spacing-page-y)] lg:grid-cols-[1.02fr_0.98fr]">
        <div className="min-w-0">
          <p className="label text-cyanbar">{sisterShow.tag}</p>
          <h2 id="hotline-title" className="mt-2 font-display text-h1 text-cream">
            {sisterShow.name}
          </h2>
          <p className="mt-[var(--spacing-stack-md)] max-w-[46ch] text-lede text-muted">
            {sisterShow.summary}
          </p>
          <dl className="mt-[var(--spacing-stack-md)] flex flex-wrap gap-x-[var(--spacing-stack-lg)] gap-y-3">
            {sisterShow.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="label text-muted">{stat.label}</dt>
                <dd className="mt-1 font-display text-h3 tabular-nums text-cream">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <a
            href={sisterShow.url}
            target="_blank"
            rel="noreferrer"
            className="label mt-[var(--spacing-stack-lg)] inline-flex min-h-12 items-center gap-3 border-2 border-line-strong px-6 text-cream transition-colors duration-200 hover:border-cyanbar hover:text-cyanbar"
          >
            打开姊妹栏目 hk.datatrade.top
            <ExternalIcon size={18} />
          </a>

          <div className="mt-[var(--spacing-stack-lg)] grid grid-cols-2 gap-3">
            {bRoll.map((shot) => (
              <figure key={shot.src} className="border-2 border-line">
                <img
                  src={shot.src}
                  alt={shot.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-4/5 w-full object-cover"
                />
                <figcaption className="label bg-ink-soft px-2 py-1 text-muted">本台外拍</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-3 border-b-2 border-line pb-3">
            <PhoneRingIcon size={24} className="text-vermilion" />
            <h3 className="font-display text-h2 text-cream">观众热线</h3>
            <span className="label ml-auto text-muted">三条线同时接</span>
          </div>
          <ul className="mt-[var(--spacing-stack-md)] grid gap-3">
            {socials.map((social) => (
              <li key={social.name}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-[76px] items-center gap-4 border-2 border-line bg-ink-soft p-3 transition-colors duration-200 hover:border-cream"
                >
                  <span aria-hidden className="shrink-0 bg-cream p-1.5">
                    <QRCodeSVG value={social.url} size={60} bgColor="#f2e9dc" fgColor="#141210" level="M" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="label block text-cream">扫码 · {social.name}</span>
                    <span className="mt-1 block text-body text-muted">{social.note}</span>
                  </span>
                  <ExternalIcon size={18} className="shrink-0 text-cream" />
                </a>
              </li>
            ))}
          </ul>
          <p className="label mt-3 text-muted">
            二维码由本页实时生成，指向本人公开主页。
          </p>
        </div>
      </div>
    </section>
  );
}

/** 限时下单：mailto CTA + 简历下载 + 400 式来电条 + 库存状态 */
export function OrderSection() {
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
    '【CHANNEL 潘 下单】现场 / 直播 / 增长项目合作',
  )}&body=${encodeURIComponent(
    '潘宇龙您好：\n\n我想就本台节目下单，项目信息如下：\n\n场景：\n时间：\n预算：\n联系方式：',
  )}`;

  return (
    <section id="order" aria-labelledby="order-title" className="border-t-2 border-line">
      <div className="mx-auto grid w-full max-w-[1100px] gap-x-[var(--spacing-stack-xl)] gap-y-[var(--spacing-stack-lg)] px-[var(--spacing-gutter)] py-[var(--spacing-page-y)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0">
          <p className="label text-vermilion">限时下单 · 本台不收定金</p>
          <h2 id="order-title" className="mt-2 max-w-[20ch] font-display text-h1 text-cream">
            下一档节目，
            <br />
            由您点单
          </h2>
          <p className="mt-[var(--spacing-stack-md)] max-w-[44ch] text-lede text-muted">
            打通热线即发信：邮件里写清场景与档期，本台 24 小时内回播。所有在售参数均可核对原件。
          </p>

          <div className="mt-[var(--spacing-stack-lg)] flex flex-wrap items-center gap-[var(--spacing-stack-md)]">
            <a
              href={mailto}
              className="inline-flex min-h-14 items-center gap-4 bg-lemon px-7 text-ink transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <EnvelopeIcon size={24} />
              <span className="font-display text-[clamp(1.05rem,2vw,1.4rem)]">现在下单 → 发信给潘宇龙</span>
            </a>
            <a
              href={profile.cvPath}
              download={`${profile.nameZh}·简历.pdf`}
              className="label inline-flex min-h-14 items-center gap-3 border-2 border-line-strong px-5 text-cream transition-colors duration-200 hover:border-cream"
            >
              <DownloadIcon size={20} />
              下载完整简历 PDF
            </a>
          </div>
        </div>

        <div className="min-w-0">
          {/* 400 式来电条：内容是本台真实邮箱 */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative border-2 border-line bg-ink-soft p-[var(--spacing-stack-md)]"
          >
            <div className="flex items-center gap-4">
              <span aria-hidden className="relative grid h-12 w-12 shrink-0 place-items-center">
                <span
                  className="crt-ring absolute inset-0 rounded-key border-2 border-vermilion"
                  style={{ animation: 'ring 1.8s ease-out infinite' }}
                />
                <span
                  className="crt-ring absolute inset-2 rounded-key border-2 border-vermilion/60"
                  style={{ animation: 'ring 1.8s ease-out 0.45s infinite' }}
                />
                <PhoneRingIcon size={22} className="relative text-vermilion" />
              </span>
              <span className="min-w-0">
                <span className="label block text-muted">观众来电 · 本台热线</span>
                <a
                  href={mailto}
                  className="mt-1 block min-h-11 max-w-full break-all font-mono text-[clamp(0.95rem,3.4vw,1.25rem)] leading-snug tabular-nums text-cream hover:text-lemon"
                >
                  {profile.email}
                </a>
              </span>
            </div>
            <p className="label mt-3 text-muted">来电即转邮件 · 接通后由本人接听</p>

            <dl className="mt-[var(--spacing-stack-md)] grid grid-cols-2 gap-3 border-t-2 border-line pt-3">
              <div>
                <dt className="label text-muted">库存状态</dt>
                <dd className="mt-1 text-body text-cream">{profile.stock}</dd>
              </div>
              <div>
                <dt className="label text-muted">可承接档期</dt>
                <dd className="mt-1 text-body text-cream tabular-nums">{profile.available}</dd>
              </div>
              <div>
                <dt className="label text-muted">累计成交</dt>
                <dd className="mt-1 text-body text-cream tabular-nums">527 个项目</dd>
              </div>
              <div>
                <dt className="label text-muted">播出保障</dt>
                <dd className="mt-1 text-body text-cream">15 年 0 事故</dd>
              </div>
            </dl>
          </motion.div>

          <div className="mt-[var(--spacing-stack-md)] flex items-center gap-3 border-2 border-phosphor px-4 py-3">
            <TvIcon size={22} className="shrink-0 text-phosphor" />
            <p className="label text-phosphor">
              ON AIR · 本台 24 小时播出，随时可插播您的项目
            </p>
          </div>
        </div>
      </div>
      <BarsStrip height="h-6" />
    </section>
  );
}
