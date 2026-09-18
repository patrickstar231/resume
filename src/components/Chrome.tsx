import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { experiences, navLinks, profile } from '../data/site';

const BLOCKS = 5;

export function Splash({ reducedMotion }: { reducedMotion: boolean }) {
  const [hidden, setHidden] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;
    const hide = window.setTimeout(() => setHidden(true), 1450);
    return () => window.clearTimeout(hide);
  }, [reducedMotion]);

  if (hidden) return null;

  return (
    <div className="stage-perspective pointer-events-none fixed inset-0 z-50 grid grid-rows-2" aria-hidden>
      {[0, 1].map((row) => (
        <div key={row} className="grid grid-cols-5 overflow-hidden">
          {Array.from({ length: BLOCKS }).map((_, col) => (
            <motion.span
              key={col}
              className={`bg-ink ${row === 0 ? 'origin-top' : 'origin-bottom'}`}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: row === 0 ? -92 : 92 }}
              transition={{
                duration: 0.75,
                delay: 0.72 + col * 0.05 + row * 0.03,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
          ))}
        </div>
      ))}
      <div className="absolute inset-0 grid place-items-center">
        <span className="label-mono text-cream/70">
          {profile.nameLatin.split('').map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.4, delay: i * 0.045 }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      </div>
    </div>
  );
}

export function Magnetic({
  children,
  strength = 4,
  padding = 120,
}: {
  children: ReactNode;
  strength?: number;
  padding?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 320, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 320, damping: 22, mass: 0.6 });
  const translate = useTransform([sx, sy], ([nx, ny]: number[]) => `translate3d(${nx}px,${ny}px,0)`);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const inside =
        Math.abs(dx) < rect.width / 2 + padding && Math.abs(dy) < rect.height / 2 + padding;
      x.set(inside ? dx / strength : 0);
      y.set(inside ? dy / strength : 0);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [padding, strength, x, y]);

  return (
    <motion.span ref={ref} style={{ x: translate }} className="inline-block will-change-transform">
      {children}
    </motion.span>
  );
}

/* 当前所在段：读屏与脊轨高亮共用同一个真相源 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(',');
  useEffect(() => {
    const nodes = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit?.target.id) setActive(hit.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.6] },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [key]);
  return active;
}

const SECTION_IDS = navLinks.map((l) => l.id);

function StatusMark() {
  return (
    <span className="flex items-center gap-2 text-caption text-muted">
      <span className="h-2 w-2 shrink-0 bg-verdigris" aria-hidden />
      {profile.available}
    </span>
  );
}

function Masthead() {
  return (
    <a
      href="#top"
      className="label-mono inline-flex min-h-hit items-center text-cream transition-colors duration-200 hover:text-brass"
    >
      {profile.nameZh}
      <span className="text-brass">*</span>
    </a>
  );
}

function ContactBlock() {
  const [user, domain] = profile.email.split('@');

  return (
    <div className="grid gap-2">
      <a
        href={`mailto:${profile.email}`}
        className="label-mono w-fit min-h-hit text-cream transition-colors duration-200 hover:text-brass"
      >
        {user}@<wbr />
        {domain}
      </a>
      <a
        href={profile.cvPath}
        download="潘宇龙 · 简历.pdf"
        className="label-mono inline-flex min-h-hit items-center text-muted transition-colors duration-200 hover:text-brass"
      >
        下载 PDF 简历 ↓
      </a>
    </div>
  );
}

/* 桌面：常驻脊轨，元数据 + 目录 + 三段任职缩略 */
export function Spine() {
  const active = useActiveSection(SECTION_IDS);

  return (
    <aside
      aria-label="个人信息与目录"
      className="fixed inset-y-0 left-0 z-40 hidden w-spine flex-col justify-between gap-stack-lg overflow-y-auto border-r border-line bg-ink px-8 py-8 lg:flex"
    >
      <div className="grid gap-stack-md">
        <Masthead />
        <p className="text-caption text-muted">{profile.role}</p>
        <nav aria-label="目录">
          <ul>
            {navLinks.map((link, i) => {
              const on = active === link.id;
              return (
                <li key={link.id} className="rule-row">
                  <a
                    href={`#${link.id}`}
                    aria-current={on ? 'true' : undefined}
                    className="flex min-h-hit items-baseline gap-3 py-2"
                  >
                    <span className="num text-caption text-muted">{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className={`label-mono transition-colors duration-200 ${
                        on ? 'text-brass' : 'text-cream/80 hover:text-cream'
                      }`}
                    >
                      {link.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="grid gap-stack-md">
        <div>
          <p className="label-mono mb-2 text-muted">Rundown</p>
          <ul className="grid gap-2">
            {experiences.map((e) => (
              <li key={`${e.company}-${e.from}`} className="num text-caption text-muted">
                {e.from}—{e.to} · {e.title}
              </li>
            ))}
          </ul>
        </div>
        <ContactBlock />
      </div>
    </aside>
  );
}

/* 移动 / 平板：脊轨折成顶栏 + 元数据抽屉 */
export function TopBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-ink/95 px-section-x backdrop-blur-sm lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <Masthead />
        <button
          type="button"
          aria-expanded={open}
          aria-controls="meta-drawer"
          onClick={() => setOpen((v) => !v)}
          className="label-mono inline-flex min-h-hit items-center gap-2 text-cream active:scale-tap"
        >
          {open ? '关闭' : '目录'}
          <span aria-hidden>{open ? '×' : '≡'}</span>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.nav
            id="meta-drawer"
            aria-label="目录"
            key="drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.76, 0, 0.24, 1] }}
            className="overflow-hidden"
          >
            <ul className="grid pb-2">
              {navLinks.map((link) => (
                <li key={link.id} className="rule-row">
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className="label-mono flex min-h-hit items-center text-cream hover:text-brass"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="border-t border-line py-4">
              <ContactBlock />
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

/* 封面：场刊第一页，左下锚定，不做居中堆栈 */
export function Cover() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh flex-col justify-end px-section-x pb-stack-xl pt-32"
    >
      <div aria-hidden className="scrim-top" />
      <div aria-hidden className="scrim-left" />
      <div aria-hidden className="scrim-flat" />
      <div aria-hidden className="scrim-bottom" />

      <p className="label-mono text-muted">Programme 2019—2026 · {profile.nameLatin}</p>
      <h1 className="mt-stack-md max-w-title font-display text-display">
        把现场
        <br />
        <span className="italic text-brass">做成</span>系统
      </h1>
      <p className="mt-stack-md max-w-lead text-lede text-muted">
        12,000 人同时在线的技术直播、980M 曝光的保时捷沉浸展、一个人写完的粤语 App——用的是同一套工程习惯。
      </p>
      <div className="mt-stack-lg flex flex-wrap items-center gap-stack-md">
        <Magnetic>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex min-h-hit-lg items-center gap-3 bg-cream px-7 py-3 text-ink transition-colors duration-200 hover:bg-brass focus-visible:outline-offset-4 active:scale-tap"
          >
            <span className="label-mono">给潘宇龙写封邮件</span>
            <span aria-hidden>→</span>
          </a>
        </Magnetic>
        <a
          href="#experience"
          className="label-mono inline-flex min-h-hit items-center text-cream underline decoration-line-strong underline-offset-8 transition-colors duration-200 hover:text-brass"
        >
          先看履历表
        </a>
      </div>
      <p className="mt-stack-lg">
        <StatusMark />
      </p>
    </section>
  );
}
