import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  cantoneseProject,
  capabilities,
  companies,
  experiences,
  profile,
  projects,
  shots,
  socials,
  type Project,
} from '../data/site';

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

/* ── 现场素材带：一排、每张照片一份语义 ─────────────────────────
   第二组只用于滚动填充，alt 置空，读屏不会数到重复条目。 */
export function ShotBand() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const shifted = useTransform(scrollYProgress, [0, 1], ['4%', '-14%']);
  const x = reduced ? 0 : shifted;

  return (
    <section
      ref={ref}
      role="group"
      aria-label="现场素材带"
      className="overflow-hidden border-y border-line py-stack-lg"
    >
      <motion.div style={{ x }} className="flex w-max gap-4 will-change-transform">
        {[0, 1].map((set) =>
          shots.map((shot, i) => (
            <img
              key={`${set}-${shot.src}`}
              src={shot.src}
              alt={set === 0 ? shot.alt : ''}
              loading={set === 0 && i < 2 ? 'eager' : 'lazy'}
              decoding="async"
              className="h-band min-h-40 w-shot min-w-xs shrink-0 object-cover opacity-90"
            />
          )),
        )}
      </motion.div>
    </section>
  );
}

/* ── Experience：履历 rundown 表 ──────────────────────────────── */
export function ExperienceSection() {
  return (
    <section id="experience" className="px-section-x py-section-y">
      <p className="label-mono text-muted">Experience · 2019—至今</p>
      <h2 className="mt-stack-sm max-w-heading text-balance font-display text-h1">
        四段任职，做的是同一件事：把<span className="inline-block italic text-brass">现场</span>写成流程
      </h2>

      <table className="mt-stack-xl w-full border-collapse text-left">
        <caption className="sr-only">
          潘宇龙的任职履历：年份、机构与职务、一句话结果、可核对指标
        </caption>
        <thead className="hidden border-b border-line-strong md:table-header-group">
          <tr className="label-mono text-muted">
            <th scope="col" className="py-3 pr-4 font-normal">
              年份
            </th>
            <th scope="col" className="py-3 pr-4 font-normal">
              机构 / 职务
            </th>
            <th scope="col" className="py-3 pr-4 font-normal">
              结果
            </th>
            <th scope="col" className="py-3 font-normal">硬指标</th>
          </tr>
        </thead>
        <tbody>
          {experiences.map((e) => (
            <tr
              key={`${e.company}-${e.from}`}
              className="rule-row block transition-colors duration-200 hover:bg-surface focus-within:bg-surface md:table-row"
            >
              <td className="num block py-3 text-caption text-muted md:table-cell md:align-top md:whitespace-nowrap md:pr-4">
                {e.from} — {e.to}
              </td>
              <td className="block py-1 md:table-cell md:py-3 md:align-top md:pr-4">
                <span className="block font-display text-h3 text-cream">{e.title}</span>
                <span className="num mt-1 block text-caption text-muted">{e.company}</span>
              </td>
              <td className="block max-w-body py-1 text-body text-muted md:table-cell md:py-3 md:align-top md:pr-4">
                {e.result}
              </td>
              <td className="block py-3 md:table-cell md:align-top">
                <ul className="grid gap-1">
                  {e.metrics.map((m) => (
                    <li key={m} className="num text-caption text-cream/90">
                      {m}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="num mt-stack-lg text-caption text-muted">
        服务客户：{companies.join(' · ')}
      </p>
    </section>
  );
}

/* ── Work：三张 sticky 堆叠卡 ─────────────────────────────────── */
/* 槽位起始 96，每往下一张再让出 28；三个值都落在 --spacing-slot-* token 上 */
const STACK_SLOTS = ['top-slot-1', 'top-slot-2', 'top-slot-3'];

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
      className={`sticky flex min-h-card items-start pt-stack-lg ${STACK_SLOTS[index]}`}
    >
      <motion.article
        style={{ scale }}
        onMouseEnter={play}
        onMouseLeave={stop}
        onFocus={play}
        onBlur={stop}
        className="grain w-full border border-line bg-surface p-card-pad will-change-transform"
      >
        <header className="flex flex-wrap items-end justify-between gap-stack-md border-b border-line pb-stack-md">
          <div className="flex items-end gap-6">
            <span className="num text-h1 text-muted">{project.index}</span>
            <div>
              <p className="label-mono text-muted">{project.category}</p>
              <h3 className="mt-2 font-display text-h2">{project.name}</h3>
            </div>
          </div>
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="label-mono inline-flex min-h-hit items-center gap-2 border border-line-strong px-5 text-cream transition-colors duration-200 hover:border-brass hover:text-brass active:scale-tap"
          >
            打开项目现场 <span aria-hidden>↗</span>
          </a>
        </header>

        <p className="mt-stack-md max-w-measure text-body text-muted">{project.summary}</p>
        <ul className="mt-stack-md grid gap-2 text-body text-cream/90 md:grid-cols-3">
          {project.bullets.map((bullet) => (
            <li key={bullet} className="border-l border-line pl-4">
              {bullet}
            </li>
          ))}
        </ul>

        <figure className="relative mt-stack-lg overflow-hidden">
          <img
            src={project.image}
            alt={`${project.name} 现场`}
            loading="lazy"
            decoding="async"
            className="aspect-16/9 w-full object-cover transition-transform duration-500 ease-out hover:scale-lift"
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

export function WorkSection() {
  return (
    <section id="work" className="px-section-x py-section-y">
      <p className="label-mono text-muted">Selected work · 三个落地项目</p>
      <h2 className="mt-stack-sm max-w-heading text-balance font-display text-h1">
        三次把 <span className="inline-block italic text-brass">不可复制</span> 的现场，交付成标准件
      </h2>
      <div className="mt-stack-xl">
        {projects.map((project, index) => (
          <ProjectCard key={project.index} project={project} index={index} total={projects.length} />
        ))}
      </div>
    </section>
  );
}

/* ── Method：能力轨 + 自己写的东西 ────────────────────────────── */
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
      <p ref={ref} className="max-w-body text-lede text-cream">
        {text}
      </p>
    );
  }
  return (
    <p ref={ref} className="max-w-body text-lede text-cream">
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

    /* 颜色从 @theme 读，不在 canvas 里再抄一份十六进制 */
    const css = getComputedStyle(document.documentElement);
    const accent = css.getPropertyValue('--color-verdigris').trim();
    const base = css.getPropertyValue('--color-cream').trim();
    if (!accent || !base) return;

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
        ctx.globalAlpha = d.accent ? 0.5 : 0.22;
        ctx.fillStyle = d.accent ? accent : base;
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
      className="glyph-mask absolute inset-0 h-full w-full opacity-25"
    />
  );
}

export function MethodSection({ reducedMotion }: { reducedMotion: boolean }) {
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
      id="method"
      ref={ref}
      className="grain relative overflow-hidden border-t border-line px-section-x py-section-y"
    >
      {!reducedMotion && visible ? <GlyphRain active={visible} /> : null}

      <div className="relative">
        <p className="label-mono text-muted">Method · 怎么干活</p>
        <h2 className="mt-stack-sm max-w-heading text-balance font-display text-h1">
          四轨并行：<span className="inline-block italic text-brass">策划</span>定形式，工程定重复成本
        </h2>

        <ul className="mt-stack-xl grid border-t border-line-strong md:grid-cols-2">
          {capabilities.map((cap, i) => (
            <li
              key={cap.latin}
              className="rule-row grid gap-2 border-r border-line px-1 py-stack-md transition-colors duration-200 hover:bg-surface"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="label-mono text-cream">{cap.latin}</span>
                <span className="num text-caption text-muted">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <p className="font-display text-h3 text-cream">{cap.zh}</p>
              <p className="num text-caption text-brass">{cap.proof}</p>
              <p className="text-caption text-muted">{cap.evidence}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-stack-xl grid gap-stack-xl lg:grid-cols-12">
        <div className="grid grid-cols-2 gap-4 self-start lg:col-span-5 lg:row-start-1">
          {shots.slice(3).map((shot) => (
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
        <div className="lg:col-start-6 lg:col-span-7">
          <p className="label-mono text-muted">Side project · 粤语</p>
          <h3 className="mt-stack-sm font-display text-h1">
            学嘢<span className="text-verdigris">·</span>一个人写完的粤语 App
          </h3>
          <div className="mt-stack-md">
            <CharacterReveal text={cantoneseProject.summary} />
          </div>
          <dl className="mt-stack-lg flex flex-wrap gap-x-stack-lg gap-y-stack-md">
            {cantoneseProject.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="label-mono text-muted">{stat.label}</dt>
                <dd className="num mt-1 text-h3 text-cream">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <a
            href={cantoneseProject.url}
            target="_blank"
            rel="noreferrer"
            className="mt-stack-lg inline-flex min-h-hit-lg items-center gap-3 border border-line-strong px-6 text-cream transition-colors duration-200 hover:border-verdigris hover:text-verdigris active:scale-tap"
          >
            <span className="label-mono">打开 hk.datatrade.top</span>
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Contact：社媒并入页脚，链接只出现一次 ───────────────────── */
export function SiteFooter() {
  const reduced = useReducedMotion();
  const footRef = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const hasReverse = useMedia('/media/footer-reverse.mp4');

  useEffect(() => {
    const el = footRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), {
      rootMargin: '300px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showReverse = hasReverse && near && !reduced;

  return (
    <footer
      id="contact"
      ref={footRef}
      className="grain relative overflow-hidden border-t border-line bg-ink px-section-x py-section-y"
    >
      {showReverse ? (
        <>
          <video
            aria-hidden
            tabIndex={-1}
            src="/media/footer-reverse.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-14"
          />
          <div aria-hidden className="absolute inset-0 bg-ink/80" />
        </>
      ) : null}

      <div className="relative grid gap-stack-xl lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label-mono text-muted">Contact</p>
          <h2 className="mt-stack-sm max-w-heading text-balance font-display text-h1">
            下一场现场，交给你<span className="text-brass">。</span>
          </h2>
          <div className="mt-stack-lg flex flex-wrap items-center gap-stack-md">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-hit-lg items-center bg-cream px-7 text-ink transition-colors duration-200 hover:bg-brass active:scale-tap"
            >
              <span className="label-mono">{profile.email}</span>
            </a>
            <a
              href={profile.cvPath}
              download="潘宇龙 · 简历.pdf"
              className="label-mono inline-flex min-h-hit-lg items-center border-b border-line-strong text-cream transition-colors duration-200 hover:border-brass hover:text-brass"
            >
              下载 PDF 简历 ↓
            </a>
          </div>
          <p className="mt-stack-md flex items-center gap-3 text-caption text-muted">
            <span className="h-2 w-2 bg-verdigris" aria-hidden />
            {profile.available}
          </p>
        </div>

        <ul className="grid gap-4 self-end md:grid-cols-3 md:gap-5 lg:col-start-8 lg:col-span-5">
          {socials.map((social) => (
            <li key={social.name} className="rule-row pt-3">
              <a
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="group grid gap-3"
                aria-label={`${social.name}主页（新窗口打开）`}
              >
                <span className="bg-cream p-2" aria-hidden>
                  {/* QR 需要字面色串：fg = --color-ink #0b0a09，底用纯白才扫得出 */}
                  <QRCodeSVG
                    value={social.url}
                    size={72}
                    bgColor="#fff"
                    fgColor="#0b0a09"
                    level="M"
                    aria-hidden
                  />
                </span>
                <span className="label-mono block text-cream transition-colors duration-200 group-hover:text-brass">
                  {social.name} <span aria-hidden>↗</span>
                </span>
                <span className="text-caption text-muted">{social.note}</span>
              </a>
            </li>
          ))}
          <li className="label-mono text-muted md:col-span-3 md:pt-2">© 2026 {profile.nameLatin}</li>
        </ul>
      </div>
    </footer>
  );
}
