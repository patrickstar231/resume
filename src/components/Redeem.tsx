import { machine, profile, socials } from '../data/site';
import { CoinIcon, DownloadIcon, ExternalIcon, MailIcon, TicketIcon } from './icons';
import { LightBox, Rivets, cn } from './ui';

/* ── Contact = 兑奖处 ───────────────────────────────────────
   把「联系我」写成柜台：投币口在别处，兑换只在这里发生。 */

export function RedeemSection({ words }: { words: string[] }) {
  return (
    <footer
      id="contact"
      className={cn(
        'relative border-t-2 border-ink bg-cobalt px-[var(--spacing-section-x)] pt-[var(--spacing-stack-lg)] text-shell',
      )}
    >
      <div className="w-full lg:max-w-[52%]">
        <p className="tag flex flex-wrap items-center gap-3 text-shell/90">
          <TicketIcon className="h-5 w-5" />
          兑奖处 / PRIZE REDEMPTION
          <span className="rounded-capsule border-2 border-ink bg-capsule px-3 py-1 text-ink">
            {profile.available}
          </span>
        </p>

        <h2 className="mt-[var(--spacing-stack-md)] max-w-[18ch] text-balance font-display text-h1">
          把这份履历
          <br />
          兑换成一场活动
        </h2>

        <p className="mt-[var(--spacing-stack-md)] max-w-[46ch] text-lede">
          发布会、直播、沉浸展、增长链路——写清楚场地、人数与风险点，我按机台标签上的口径给你一份可执行方案。
        </p>

        <div className="mt-[var(--spacing-stack-lg)] flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="flex min-h-[var(--spacing-hit)] items-center gap-3 rounded-handle border-2 border-ink bg-punch px-6 py-3 font-display text-[1.3rem] uppercase leading-none text-shell shadow-press-sm transition-transform duration-150 hover:-translate-y-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <MailIcon className="h-5 w-5" />
            现在兑奖
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="flex min-h-[var(--spacing-hit)] items-center gap-2 rounded-handle border-2 border-shell px-4 py-3 text-tag transition-colors duration-150 hover:bg-shell hover:text-cobalt"
          >
            {profile.email}
          </a>
          <a
            href={profile.cvPath}
            download="潘宇龙 · 简历.pdf"
            className="flex min-h-[var(--spacing-hit)] items-center gap-2 rounded-handle border-2 border-shell px-4 py-3 text-tag transition-colors duration-150 hover:bg-capsule hover:text-ink"
          >
            <DownloadIcon className="h-5 w-5" />
            兑换完整 PDF 简历
          </a>
        </div>

        {/* 柜台小票：机台铭牌信息，编号自洽 */}
        <div className="mt-[var(--spacing-stack-xl)] rounded-panel border-2 border-ink bg-plate p-[clamp(1rem,2.4vw,1.75rem)] text-ink">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="tag flex items-center gap-2">
              <CoinIcon className="h-4 w-4" /> 本机铭牌
            </span>
            <Rivets count={4} />
          </div>
          <dl className="mt-3 grid gap-x-6 gap-y-2 text-tag sm:grid-cols-3">
            <div className="flex justify-between gap-3 border-b-2 border-ink pb-2">
              <dt className="opacity-70">型号</dt>
              <dd className="font-display">{machine.model}</dd>
            </div>
            <div className="flex justify-between gap-3 border-b-2 border-ink pb-2">
              <dt className="opacity-70">序列号</dt>
              <dd className="font-display">{machine.serial}</dd>
            </div>
            <div className="flex justify-between gap-3 border-b-2 border-ink pb-2">
              <dt className="opacity-70">出货批次</dt>
              <dd className="font-display">{machine.batch}</dd>
            </div>
          </dl>
          <ul className="mt-4 flex flex-wrap gap-2">
            {socials.map((social) => (
              <li key={social.name}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-[var(--spacing-hit)] items-center gap-2 rounded-handle border-2 border-ink px-4 text-tag transition-colors duration-150 hover:bg-cobalt hover:text-shell"
                >
                  {social.name}
                  <ExternalIcon className="h-4 w-4" />
                </a>
              </li>
            ))}
            <li>
              <a
                href="#top"
                className="flex min-h-[var(--spacing-hit)] items-center gap-2 rounded-handle border-2 border-ink bg-capsule px-4 text-tag transition-transform duration-150 hover:-translate-y-[2px]"
              >
                再投一次币
              </a>
            </li>
          </ul>
        </div>

        <p className="py-[var(--spacing-stack-md)] text-tag text-shell/80">
          © 2026 {profile.nameLatin} · {machine.maker} · 站内所有数据来自真实交付记录
        </p>
      </div>

      <div className="-mx-[var(--spacing-section-x)]">
        <LightBox words={words} />
      </div>
    </footer>
  );
}
