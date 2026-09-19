import { machine, marqueeWords, navLinks, profile, projects } from '../data/site';
import { ArrowIcon, CapsuleIcon, CoinIcon, GridIcon, MailIcon, TicketIcon } from './icons';
import { LightBox, Rivets, StaticMachine, cn } from './ui';

/** 机顶灯箱导航：铭牌 + 三段锚点，44px 命中区，原生锚点跳转 */
export function NavBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b-2 border-ink bg-shell">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-6 gap-y-2 px-[var(--spacing-section-x)] py-3">
        <a
          href="#top"
          className="flex min-h-[var(--spacing-hit)] items-center gap-2 font-display text-[1.02rem] uppercase tracking-[0.06em]"
        >
          <CoinIcon className="h-5 w-5" />
          {profile.nameLatin}
          <span className="tag ml-1 rounded-capsule border-2 border-ink bg-capsule px-2 py-0.5">
            {machine.model}
          </span>
        </a>
        <nav aria-label="主导航" className="ml-auto flex flex-wrap items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="flex min-h-[var(--spacing-hit)] items-center gap-2 rounded-handle px-3 text-tag transition-colors duration-150 hover:bg-cobalt hover:text-shell"
            >
              <span className="font-display">{link.latin}</span>
              <span className="hidden sm:inline">{link.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

/** P0 机舱铭牌：第一视角坐在驾驶位，左手说明书、右手玻璃仓 */
export function HeroSection({ compact }: { compact: boolean }) {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end px-[var(--spacing-section-x)] pb-[var(--spacing-stack-xl)] pt-28"
    >
      <div className={cn('w-full', !compact && 'lg:max-w-[52%]')}>
        <p className="tag flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="rounded-capsule border-2 border-ink bg-plate px-3 py-1">
            机台操作说明书
          </span>
          <span>{machine.serial}</span>
          <Rivets count={compact ? 3 : 5} />
        </p>

        <h1 className="mt-[var(--spacing-stack-md)] font-display text-display">
          抓到才算
          <br />
          看过简历
        </h1>

        <p className="mt-[var(--spacing-stack-md)] max-w-[42ch] text-lede">
          {profile.nameZh} · {profile.role}。{machine.notice}
        </p>

        {compact ? (
          <div className="mt-[var(--spacing-stack-lg)]">
            <StaticMachine capsules={projects.map((project) => project.color)} />
          </div>
        ) : null}

        {/* 操作三步：把「读简历」写成一页玩具说明书 */}
        <ol className="mt-[var(--spacing-stack-lg)] grid gap-3 sm:grid-cols-3">
          {[
            { n: 'STEP 1', t: '投币', d: '把这份履历当成一枚硬币，投进去', icon: <CoinIcon className="h-5 w-5" /> },
            { n: 'STEP 2', t: '扭旋钮', d: '滚动 = 送蛋，当期胶囊沿滑道落下', icon: <CapsuleIcon className="h-5 w-5" /> },
            { n: 'STEP 3', t: '取奖品', d: '点开胶囊，读到的是真实数据', icon: <TicketIcon className="h-5 w-5" /> },
          ].map((step) => (
            <li
              key={step.n}
              className="rounded-panel border-2 border-ink bg-plate p-4 shadow-press-sm"
            >
              <span className="flex items-center gap-2 text-ink">
                {step.icon}
                <span className="tag">{step.n}</span>
              </span>
              <p className="mt-2 font-display text-h3">{step.t}</p>
              <p className="mt-1 text-tag leading-snug">{step.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-[var(--spacing-stack-lg)] flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="flex min-h-[var(--spacing-hit)] items-center gap-3 rounded-handle border-2 border-ink bg-punch px-6 py-3 font-display text-[1.2rem] uppercase leading-none text-shell shadow-press-sm transition-transform duration-150 hover:-translate-y-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <MailIcon className="h-5 w-5" />
            直接谈这一场
          </a>
          <a
            href="#work"
            className="flex min-h-[var(--spacing-hit)] items-center gap-2 rounded-handle border-2 border-ink bg-plate px-5 py-3 text-tag transition-colors duration-150 hover:bg-cobalt hover:text-shell"
          >
            <GridIcon className="h-5 w-5" />
            走到货架前
            <ArrowIcon className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-[var(--spacing-stack-md)] flex flex-wrap items-center gap-2 text-tag">
          <span
            aria-hidden
            className="inline-block h-3 w-3 rounded-capsule border-2 border-ink bg-punch"
          />
          <span className="tag">{profile.available}</span>
          <span className="max-w-[40ch] opacity-70">
            本机共 {machine.capsuleCount} 颗胶囊 —— 不开蛋也能从机台标签读到全部关键数据。
          </span>
        </p>
      </div>

      <div className="mt-[var(--spacing-stack-xl)] -mx-[var(--spacing-section-x)]">
        <LightBox words={marqueeWords} />
      </div>
    </section>
  );
}
