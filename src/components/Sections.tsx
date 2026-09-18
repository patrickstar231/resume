import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { cantoneseProject, marqueeWords, profile, projects, socials, type Project } from '../data/site';

function useMedia(src?: string) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!src) return;
    let alive = true;
    fetch(src, { method: 'HEAD' })
      .then((res) =>
        alive && setOk(res.ok && (res.headers.get('content-type') ?? '').startsWith('video/'))
      )
      .catch(() => alive && setOk(false));
    return () => {
      alive = false;
    };
  }, [src]);
  return ok;
}

const SHOTS = [
  { src: '/images/porsche1.jpg', alt: '保时捷 911 沉浸展现场' },
  { src: '/images/huawei1.jpg', alt: '华为云快成长直播推流台' },
  { src: '/images/tencent1.jpg', alt: '腾讯数字生态大会主视觉' },
  { src: '/images/life/teahouse.jpg', alt: '围炉煮茶现场记录' },
  { src: '/images/life/dinner.jpg', alt: '客户晚宴动线实拍' },
];

function Row({ reverse, offset }: { reverse: boolean; offset: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const shifted = useTransform(scrollYProgress, [0, 1], reverse ? ['-18%', '6%'] : ['6%', '-18%']);
  const x = reduced ? 0 : shifted;
  return (
    <motion.div ref={ref} style={{ x }} className="flex w-[160%] gap-4 will-change-transform">
      {Array.from({ length: 4 }).map((_, group) => (
        <div key={group} className="flex shrink-0 gap-4">
          {SHOTS.map((shot, i) => (
            <img
              key={`${group}-${i}`}
              src={shot.src}
              alt={group === 0 ? shot.alt : ''}
              loading={group === 0 && offset === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="h-[22vh] w-[34vw] min-w-[240px] object-cover opacity-90"
            />
          ))}
        </div>
      ))}
    </motion.div>
  );
}

export function WorkMarquee() {
  return (
    <section aria-label="项目现场画面" className="overflow-hidden py-[var(--spacing-stack-lg)]">
      <div className="space-y-4">
        <Row reverse={false} offset={0} />
        <Row reverse offset={1} />
      </div>
      <WordBand />
    </section>
  );
}

function WordBand() {
  const line = marqueeWords.join(' · ');
  const reduced = useReducedMotion() ?? false;
  return (
    <div className="mt-[var(--spacing-stack-lg)] overflow-hidden border-y border-line py-4">
      <motion.div
        className="flex gap-16 whitespace-nowrap"
        animate={reduced ? undefined : { x: ['0%', '-50%'] }}
        transition={reduced ? undefined : { duration: 38, ease: 'linear', repeat: Infinity }}
      >
        {[0, 1].map((k) => (
          <span key={k} className="label-mono text-cream/60">
            {line} · {line}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Char({ ch, i, total, progress }: { ch: string; i: number; total: number; progress: MotionValue<number> }) {
  const start = (i / total) * 0.75;
  const opacity = useTransform(progress, [start, start + 0.22], [0.55, 1]);
  return (
    <motion.span style={{ opacity }} className={ch === ' ' ? 'whitespace-pre' : undefined}>
      {ch}
    </motion.span>
  );
}

function CharacterReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.35'] });
  const chars = useMemo(() => text.split(''), [text]);
  if (reduced) {
    return (
      <p className="max-w-[42ch] text-lede text-cream">
        {text}
      </p>
    );
  }
  return (
    <p ref={ref} className="max-w-[42ch] text-lede text-cream">
      {chars.map((ch, i) => (
        <Char key={i} ch={ch} i={i} total={chars.length} progress={scrollYProgress} />
      ))}
    </p>
  );
}

function GlyphRain({ active }: { active: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    const ctx = node.getContext('2d');
    if (!ctx) return;

    const glyphs = '粵語飲茶嘅咗唔哋冇'.split('');
    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      node.width = node.offsetWidth * dpr;
      node.height = node.offsetHeight * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    const drops = Array.from({ length: 46 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      v: 0.0006 + Math.random() * 0.0016,
      size: 12 + Math.random() * 26,
      glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
      accent: Math.random() > 0.86,
    }));

    let frame = 0;
    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (!active) return;
      ctx.clearRect(0, 0, node.width, node.height);
      for (const d of drops) {
        d.y += d.v;
        if (d.y > 1.05) d.y = -0.05;
        ctx.font = `${d.size * dpr}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = d.accent ? 'rgba(94,140,127,0.5)' : 'rgba(242,239,230,0.22)';
        ctx.fillText(d.glyph, d.x * node.width, d.y * node.height);
      }
    };
    draw();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className="absolute inset-0 h-full w-full opacity-40"
      style={{
        maskImage: 'radial-gradient(115% 90% at 84% 42%, #000 0%, #000 34%, transparent 72%)',
        WebkitMaskImage: 'radial-gradient(115% 90% at 84% 42%, #000 0%, #000 34%, transparent 72%)',
      }}
    />
  );
}

export function AboutSection({ reducedMotion }: { reducedMotion: boolean }) {
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={ref}
      className="grain relative overflow-hidden border-t border-line px-[var(--spacing-section-x)] py-section-y"
    >
      {!reducedMotion && visible ? <GlyphRain active={visible} /> : null}
      <div className="relative grid gap-[var(--spacing-stack-xl)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:col-start-2">
          <p className="label-mono text-muted">Side project · 粤语</p>
          <h2 className="mt-[var(--spacing-stack-sm)] font-display text-h1">
            学嘢<span className="text-verdigris">·</span>一个人写完的粤语 App
          </h2>
          <div className="mt-[var(--spacing-stack-md)]">
            <CharacterReveal text={cantoneseProject.summary} />
          </div>
          <dl className="mt-[var(--spacing-stack-lg)] flex flex-wrap gap-x-[var(--spacing-stack-lg)] gap-y-[var(--spacing-stack-md)]">
            {cantoneseProject.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="label-mono text-muted">{stat.label}</dt>
                <dd className="mt-1 font-mono text-h3 tabular-nums text-cream">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <a
            href={cantoneseProject.url}
            target="_blank"
            rel="noreferrer"
            className="mt-[var(--spacing-stack-lg)] inline-flex min-h-[48px] items-center gap-3 border border-line-strong px-6 text-cream transition-colors duration-200 hover:border-verdigris hover:text-verdigris active:scale-[0.98]"
          >
            <span className="label-mono">打开 hk.datatrade.top</span>
            <span aria-hidden>↗</span>
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4 self-start lg:col-start-1 lg:row-start-1">
          {SHOTS.slice(3).map((shot) => (
            <img
              key={shot.src}
              src={shot.src}
              alt={shot.alt}
              loading="lazy"
              decoding="async"
              className="aspect-4/5 w-full object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const squeezed = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const scale = reduced ? 1 : squeezed;
  const hasVideo = useMedia(project.hoverVideo);
  const video = useRef<HTMLVideoElement>(null);

  const play = () => {
    if (!hasVideo) return;
    void video.current?.play().catch(() => undefined);
  };
  const stop = () => {
    if (!video.current) return;
    video.current.pause();
    video.current.currentTime = 0;
  };

  return (
    <div
      ref={ref}
      className="sticky flex min-h-[86vh] items-start pt-[var(--spacing-stack-lg)]"
      style={{ top: `${96 + index * 28}px` }}
    >
      <motion.article
        style={{ scale }}
        onMouseEnter={play}
        onMouseLeave={stop}
        onFocus={play}
        onBlur={stop}
        className="grain w-full border border-line bg-surface p-[clamp(1.25rem,3vw,2.75rem)] will-change-transform"
      >
        <header className="flex flex-wrap items-end justify-between gap-[var(--spacing-stack-md)] border-b border-line pb-[var(--spacing-stack-md)]">
          <div className="flex items-end gap-6">
            <span className="font-mono text-h1 tabular-nums text-muted">{project.index}</span>
            <div>
              <p className="label-mono text-muted">{project.category}</p>
              <h3 className="mt-2 font-display text-h2">{project.name}</h3>
            </div>
          </div>
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 border border-line-strong px-5 text-caption uppercase tracking-[0.14em] text-cream transition-colors duration-200 hover:border-brass hover:text-brass active:scale-[0.98]"
          >
            打开项目现场 <span aria-hidden>↗</span>
          </a>
        </header>

        <p className="mt-[var(--spacing-stack-md)] max-w-[52ch] text-body text-muted">{project.summary}</p>
        <ul className="mt-[var(--spacing-stack-md)] grid gap-2 text-body text-cream/90 md:grid-cols-3">
          {project.bullets.map((bullet) => (
            <li key={bullet} className="border-l border-line pl-4">
              {bullet}
            </li>
          ))}
        </ul>

        <figure className="relative mt-[var(--spacing-stack-lg)] overflow-hidden">
          <img
            src={project.image}
            alt={`${project.name} 现场`}
            loading="lazy"
            decoding="async"
            className="aspect-16/9 w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
          />
          {hasVideo ? (
            <video
              ref={video}
              src={project.hoverVideo}
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <figcaption className="label-mono absolute bottom-4 left-4 bg-ink/80 px-3 py-1 text-cream">
            {project.metric}
          </figcaption>
        </figure>
      </motion.article>
    </div>
  );
}

export function ProjectsSection() {
  return (
    <section id="work" className="px-[var(--spacing-section-x)] py-section-y">
      <p className="label-mono text-muted">Selected work · 2019—2025</p>
      <h2 className="mt-[var(--spacing-stack-sm)] max-w-[18ch] font-display text-h1">
        三次把 <span className="italic text-brass">不可复制</span> 的现场，交付成标准件
      </h2>
      <div className="mt-[var(--spacing-stack-xl)]">
        {projects.map((project, index) => (
          <ProjectCard key={project.index} project={project} index={index} total={projects.length} />
        ))}
      </div>
    </section>
  );
}

export function SocialRail() {
  return (
    <section aria-label="社媒矩阵" className="border-t border-line px-[var(--spacing-section-x)] py-[var(--spacing-stack-xl)]">
      <div className="grid gap-[var(--spacing-stack-lg)] md:grid-cols-3">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-5 border border-line bg-surface p-5 transition-colors duration-200 hover:border-brass focus-visible:border-brass"
          >
            <span className="bg-cream p-2">
              <QRCodeSVG value={social.url} size={72} bgColor="#ffffff" fgColor="#0b0a09" level="M" />
            </span>
            <span>
              <span className="label-mono block text-cream">{social.name}</span>
              <span className="mt-1 block text-caption text-muted">{social.note}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function SiteFooter() {
  const reduced = useReducedMotion();
  const footRef = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const hasReverse = useMedia('/media/footer-reverse.mp4');

  useEffect(() => {
    const el = footRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setNear(true),
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showReverse = hasReverse && near && !reduced;

  return (
    <footer
      id="contact"
      ref={footRef}
      className="grain relative overflow-hidden border-t border-line bg-ink px-[var(--spacing-section-x)] py-section-y"
    >
      {showReverse ? (
        <video
          aria-hidden
          tabIndex={-1}
          src="/media/footer-reverse.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.14]"
        />
      ) : null}
      {showReverse ? <div aria-hidden className="absolute inset-0 bg-ink/80" /> : null}
      <div className="relative grid gap-[var(--spacing-stack-xl)] lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="label-mono text-muted">Contact</p>
          <h2 className="mt-[var(--spacing-stack-sm)] max-w-[16ch] text-balance font-display text-h1">
            下一场现场，交给你<span className="text-brass">。</span>
          </h2>
          <div className="mt-[var(--spacing-stack-lg)] flex flex-wrap items-center gap-[var(--spacing-stack-md)]">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-[48px] items-center bg-cream px-7 text-ink transition-colors duration-200 hover:bg-brass active:scale-[0.98]"
            >
              <span className="label-mono">{profile.email}</span>
            </a>
            <a
              href={profile.cvPath}
              download="潘宇龙 · 简历.pdf"
              className="label-mono inline-flex min-h-[48px] items-center border-b border-line-strong text-cream transition-colors duration-200 hover:border-brass hover:text-brass"
            >
              下载 PDF 简历 ↓
            </a>
          </div>
        </div>
        <ul className="grid gap-3 self-end">
          {socials.map((social) => (
            <li key={social.name} className="flex items-center justify-between border-t border-line pt-3">
              <a
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="label-mono relative text-cream before:absolute before:-inset-y-2.5 before:-inset-x-1 before:content-[''] hover:text-brass"
              >
                {social.name}
              </a>
              <span aria-hidden className="text-muted">↗</span>
            </li>
          ))}
          <li className="label-mono mt-4 text-muted">© 2026 {profile.nameLatin}</li>
        </ul>
      </div>
    </footer>
  );
}
