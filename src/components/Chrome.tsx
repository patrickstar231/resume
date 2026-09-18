import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { navLinks, profile } from '../data/site';

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
    <div
      className="pointer-events-none fixed inset-0 z-50 grid grid-rows-2 [perspective:900px]"
      aria-hidden
    >
      {[0, 1].map((row) => (
        <div key={row} className="grid grid-cols-5 overflow-hidden">
          {Array.from({ length: BLOCKS }).map((_, col) => (
            <motion.span
              key={col}
              className="bg-ink"
              style={{ transformOrigin: row === 0 ? 'top' : 'bottom' }}
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

export function NavBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-[var(--spacing-section-x)] py-6">
      <a
        href="#top"
        className="label-mono relative text-cream before:absolute before:-inset-y-3 before:-inset-x-2 before:content-[''] hover:text-brass"
      >
        潘宇龙<span className="text-brass">*</span>
      </a>
      <nav aria-label="主导航" className="flex items-center gap-6">
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="label-mono relative text-muted before:absolute before:-inset-y-3 before:-inset-x-2 before:content-[''] transition-colors duration-200 hover:text-cream"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
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

export function HeroCopy() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-end px-[var(--spacing-section-x)] pb-[var(--spacing-stack-xl)] pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-ink via-ink/85 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 hidden h-full w-[64%] bg-gradient-to-r from-ink via-ink/80 to-transparent lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-ink/55 lg:hidden"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[62%] bg-gradient-to-t from-bg via-bg/85 to-transparent lg:hidden"
      />
      <p className="label-mono text-muted">
        {profile.nameZh} · {profile.role}
      </p>
      <h1 className="mt-[var(--spacing-stack-md)] max-w-[14ch] font-display text-display">
        把现场
        <br />
        <span className="italic text-brass">做成</span>系统
      </h1>
      <p className="mt-[var(--spacing-stack-md)] max-w-[46ch] text-lede text-muted">
        12,000 人同时在线的技术直播、980M 曝光的保时捷沉浸展、一个人写完的粤语 App——用的是同一套工程习惯。
      </p>
      <div className="mt-[var(--spacing-stack-lg)] flex flex-wrap items-center gap-[var(--spacing-stack-md)]">
        <Magnetic>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex min-h-[48px] items-center gap-3 bg-cream px-7 py-3 text-ink transition-colors duration-200 hover:bg-brass focus-visible:outline-offset-4 active:scale-[0.98]"
          >
            <span className="label-mono">给潘宇龙写封邮件</span>
            <span aria-hidden>→</span>
          </a>
        </Magnetic>
        <a
          href="#work"
          className="label-mono inline-flex min-h-[44px] items-center text-cream underline decoration-line-strong underline-offset-8 transition-colors duration-200 hover:text-brass"
        >
          看三个落地项目
        </a>
      </div>
      <p className="mt-[var(--spacing-stack-lg)] flex items-center gap-3 text-caption text-muted">
        <span className="h-2 w-2 rounded-full bg-verdigris" aria-hidden />
        {profile.available}
      </p>
    </section>
  );
}
