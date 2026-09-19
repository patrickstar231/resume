import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  boarding,
  cantoneseProject,
  methodology,
  profile,
  projects,
  socials,
  stations,
  tablets,
  terminus,
  type Project,
  type Station,
} from '../data/site';
import {
  coaster,
  coasterScroll,
  clamp,
  fastPassTo,
  sectionAlpha,
  sectionWindow,
  type SectionId,
} from '../state/coaster';

/* ================== 共享零件 ================== */

/** 区间可见度：只读一个 MotionValue，滚动期间零 React 渲染；`hot` 只在跨过 50% 时更新一次。 */
function useSectionFade(id: SectionId) {
  const w = sectionWindow(id);
  const progress = useTransform(coasterScroll, (y) => clamp(y / coaster.docHeight, 0, 1));
  const alpha = useTransform(progress, (p) => sectionAlpha(p, w));
  const opacity = useMotionValue(0);
  const y = useTransform(alpha, (a) => (1 - a) * 26);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    const first = alpha.get();
    opacity.set(first);
    setHot(first > 0.5);
    return alpha.on('change', (v) => {
      opacity.set(v);
      setHot(v > 0.5);
    });
  }, [alpha, opacity]);

  return { opacity, y, hot, window: w };
}

/** 霓虹字牌：纯实色 + 2px 硬描边 + 底部平涂暗面。不发光、不做 text-shadow。 */
function NeonSign({ value, caption }: { value: string; caption: string }) {
  return (
    <div className="inline-flex max-w-full items-end gap-3 border-2 border-edge bg-candy p-2 pr-4 shadow-[4px_4px_0_0_var(--color-edge)] sm:p-3 sm:pr-5">
      <span
        aria-hidden
        className="grid h-9 w-9 shrink-0 place-items-center border-2 border-edge bg-edge font-slab text-[0.95rem] leading-none text-brass sm:h-11 sm:w-11 sm:text-[1.1rem]"
      >
        ★
      </span>
      <span className="min-w-0">
        <span className="block font-slab text-[clamp(1.9rem,4.4vw,3rem)] leading-[0.92] text-cream">
          {value}
        </span>
        <span className="label-caps mt-1 block text-cream/85">{caption}</span>
      </span>
    </div>
  );
}

/** 票根编号条：黄铜，纯装饰。 */
function Serial({ text }: { text: string }) {
  return (
    <span aria-hidden className="label-caps text-brass">
      {text}
    </span>
  );
}

function Arrow() {
  return (
    <span aria-hidden className="inline-block translate-y-px">
      →
    </span>
  );
}

/** HEAD 探测视频；拿不到 video/* 就回落实拍图，不出现空层或 404。 */
function useProjectVideo(src?: string) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!src) return;
    let alive = true;
    fetch(src, { method: 'HEAD' })
      .then((r) =>
        alive && setOk(r.ok && (r.headers.get('content-type') ?? '').startsWith('video/')),
      )
      .catch(() => alive && setOk(false));
    return () => {
      alive = false;
    };
  }, [src]);
  return ok;
}

/** 移动端 / reduced 卡片流里的站点画面：保留真实视频纹理。 */
function ProjectMedia({ project }: { project: Project }) {
  const hasVideo = useProjectVideo(project.hoverVideo);
  const fig = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = fig.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (near) void v.play().catch(() => undefined);
    else {
      v.pause();
      v.currentTime = 0;
    }
  }, [near, hasVideo]);

  return (
    <figure
      ref={(node) => {
        fig.current = node;
      }}
      className="relative border-2 border-edge bg-edge"
    >
      <img
        src={project.image}
        alt={`${project.name} 现场`}
        loading="lazy"
        decoding="async"
        className={`aspect-video w-full object-cover ${hasVideo && near ? 'opacity-0' : ''}`}
      />
      {hasVideo ? (
        <video
          ref={vid}
          src={project.hoverVideo}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <figcaption className="label-caps absolute bottom-0 left-0 border-r-2 border-t-2 border-edge bg-candy px-3 py-2 text-cream">
        {project.metric}
      </figcaption>
    </figure>
  );
}

/* ================== 站点正文（固定面板与静态卡片流共用） ================== */

function StationBody({
  project,
  station,
  withMedia,
}: {
  project: Project;
  station: Station;
  withMedia?: boolean;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <Serial text={`NO.${project.index} / 03`} />
        <span className="label-caps text-ink/70">{station.schedule}</span>
      </div>
      <p className="label-caps mt-2 text-candy">{project.category}</p>
      <h2 className="mt-2 font-slab text-[clamp(1.45rem,3.4vw,2.35rem)] leading-[1.03] text-ink">
        {station.hall}
      </h2>
      <div className="mt-4">
        <NeonSign value={station.sign} caption={project.metric} />
      </div>
      <p className="mt-4 max-w-[46ch] text-body text-ink/90">{project.summary}</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {project.bullets.map((b) => (
          <li key={b} className="border-l-[3px] border-candy pl-3 text-[0.95rem] leading-snug text-ink/85">
            {b}
          </li>
        ))}
      </ul>
      {withMedia ? (
        <div className="mt-5">
          <ProjectMedia project={project} />
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="label-caps inline-flex min-h-[44px] items-center gap-2 border-2 border-edge bg-candy px-5 text-cream transition-colors duration-150 hover:bg-ink active:translate-y-[2px]"
        >
          {station.alight}
          <span aria-hidden>↗</span>
        </a>
        <span className="label-caps text-ink/60">
          {withMedia ? '视频源：项目现场直出' : '本站画面在轨道上方的巨型屏上'}
        </span>
      </div>
    </>
  );
}

const PAPER = 'hard-edge ticket border-2 border-edge bg-cream';

/* ================== 固定面板（桌面乘坐模式） ================== */

function BoardingPanel() {
  const { opacity, y, hot } = useSectionFade('boarding');
  return (
    <motion.div
      style={{ opacity, y, pointerEvents: hot ? 'auto' : 'none' }}
      aria-hidden={!hot}
      className="absolute inset-x-0 bottom-[6.5rem] px-[var(--spacing-rail-x)] lg:bottom-auto lg:left-0 lg:right-auto lg:top-1/2 lg:max-w-[38rem] lg:-translate-y-1/2 lg:px-0 lg:pl-[var(--spacing-rail-x)]"
    >
      <div data-surface="paper" className={`${PAPER} p-[clamp(1.1rem,3vw,2rem)]`}>
        <p className="label-caps text-candy">{boarding.kicker}</p>
        <h1 className="mt-3 font-slab text-[clamp(2rem,5.4vw,3.5rem)] leading-[0.96] text-ink">
          {boarding.title}
          <br />
          <span className="text-candy">{boarding.titleAccent}</span>
        </h1>
        <p className="mt-4 max-w-[40ch] text-body text-ink/85">{boarding.lede}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fastPassTo('station-1')}
            className="label-caps inline-flex min-h-[44px] items-center gap-2 border-2 border-edge bg-ink px-5 text-cream transition-colors duration-150 hover:bg-candy active:translate-y-[2px]"
          >
            FAST PASS · 直达第一站
            <Arrow />
          </button>
          <span className="label-caps text-ink/60">向下滚动 = 向前开车</span>
        </div>
      </div>
    </motion.div>
  );
}

function StationPanel({ index }: { index: 0 | 1 | 2 }) {
  const project = projects[index];
  const station = stations[index];
  const { opacity, y, hot } = useSectionFade(station.id);
  return (
    <motion.div
      style={{ opacity, y, pointerEvents: hot ? 'auto' : 'none' }}
      aria-hidden={!hot}
      className="absolute inset-x-0 bottom-[6.5rem] px-[var(--spacing-rail-x)] lg:bottom-auto lg:left-0 lg:right-auto lg:top-1/2 lg:max-h-[70vh] lg:max-w-[40rem] lg:-translate-y-1/2 lg:overflow-y-auto lg:px-0 lg:pl-[var(--spacing-rail-x)]"
      data-lenis-prevent=""
    >
      <div data-surface="paper" className={`${PAPER} p-[clamp(1.1rem,2.6vw,1.85rem)]`}>
        <StationBody project={project} station={station} />
      </div>
    </motion.div>
  );
}

function ObservationPanel() {
  const { opacity, y, hot } = useSectionFade('observation');
  return (
    <motion.div
      style={{ opacity, y, pointerEvents: hot ? 'auto' : 'none' }}
      aria-hidden={!hot}
      className="absolute inset-x-0 bottom-[6.5rem] max-h-[74vh] overflow-y-auto px-[var(--spacing-rail-x)] pb-2 lg:bottom-auto lg:top-[4.25rem] lg:max-h-none lg:overflow-visible"
      data-lenis-prevent=""
    >
      <div className="grid gap-3 lg:grid-cols-[1.04fr_0.96fr]">
        <div data-surface="paper" className={`${PAPER} p-[clamp(1rem,2.2vw,1.6rem)]`}>
          <p className="label-caps text-candy">OBSERVATION DECK · 中途观景台</p>
          <h2 className="mt-2 font-slab text-[clamp(1.4rem,2.8vw,2rem)] leading-[1.04] text-ink">
            {profile.nameZh} · {profile.role}
          </h2>
          <p className="mt-2 max-w-[44ch] text-body text-ink/85">{profile.tagline}</p>
          <dl className="mt-4 grid gap-3">
            {methodology.map((m) => (
              <div key={m.title} className="border-l-[3px] border-edge pl-3">
                <dt className="label-caps text-ink">{m.title}</dt>
                <dd className="mt-1 text-[0.95rem] leading-snug text-ink/80">{m.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid content-start gap-3">
          {tablets.map((t) => (
            <div key={t.label} className="tablet-flat flex items-end justify-between gap-3 px-4 py-3">
              <span className="min-w-0">
                <span className="label-caps block text-brass">{t.label}</span>
                <span className="mt-1 block text-[0.95rem] leading-snug text-cream/85">{t.note}</span>
              </span>
              <span className="shrink-0 font-slab text-[clamp(1.7rem,3.2vw,2.4rem)] leading-none text-cream">
                {t.value}
                <span className="ml-1 text-[0.95rem] text-cream/70">{t.unit}</span>
              </span>
            </div>
          ))}
          <NightShow />
        </div>
      </div>
      <ExitMap />
    </motion.div>
  );
}

/** 隐藏项目 · 夜场入口 */
function NightShow() {
  return (
    <a
      href={cantoneseProject.url}
      target="_blank"
      rel="noreferrer"
      className="hard-edge flex items-center justify-between gap-3 border-2 border-edge bg-night-lift px-4 py-3 transition-colors duration-150 hover:bg-candy"
    >
      <span className="min-w-0">
        <span className="label-caps block text-brass">HIDDEN STATION · 隐藏项目 · 夜场</span>
        <span className="mt-1 block font-slab text-[1.15rem] leading-none text-cream">
          {cantoneseProject.name}
          <span className="label-caps ml-2 text-cream/70">hk.datatrade.top</span>
        </span>
      </span>
      <span aria-hidden className="shrink-0 font-slab text-[1.4rem] leading-none text-cream">
        ↗
      </span>
    </a>
  );
}

/** 园区地图 · 出口：社媒三链 + 二维码 */
function ExitMap() {
  return (
    <div data-surface="paper" className={`${PAPER} mt-3 px-4 py-3`}>
      <p className="label-caps text-ink/70">PARK MAP · 园区地图 · 出口</p>
      <ul className="mt-2 grid gap-2 sm:grid-cols-3">
        {socials.map((s) => (
          <li key={s.name}>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[44px] items-center gap-3 border-2 border-edge bg-night px-3 py-2 transition-colors duration-150 hover:bg-candy"
            >
              <span className="shrink-0 bg-cream p-1">
                <QRCodeSVG value={s.url} size={40} bgColor="#f4ebdd" fgColor="#0a1410" level="M" />
              </span>
              <span className="min-w-0">
                <span className="label-caps block text-cream">{s.name}</span>
                <span className="block truncate text-[0.95rem] leading-tight text-cream/75">
                  {s.note}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TerminusPanel() {
  const { opacity, y, hot } = useSectionFade('terminus');
  return (
    <motion.div
      style={{ opacity, y, pointerEvents: hot ? 'auto' : 'none' }}
      aria-hidden={!hot}
      className="absolute inset-x-0 bottom-[6.5rem] px-[var(--spacing-rail-x)] lg:bottom-auto lg:left-0 lg:right-auto lg:top-1/2 lg:max-w-[40rem] lg:-translate-y-1/2 lg:px-0 lg:pl-[var(--spacing-rail-x)]"
    >
      <div data-surface="paper" className={`${PAPER} p-[clamp(1.2rem,3vw,2.25rem)]`}>
        <p className="label-caps text-candy">{terminus.kicker} · 终点站台</p>
        <h2 className="mt-3 font-slab text-[clamp(1.9rem,4.4vw,2.9rem)] leading-[0.98] text-ink">
          {terminus.title}
        </h2>
        <p className="mt-3 max-w-[38ch] text-body text-ink/85">{terminus.body}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="label-caps inline-flex min-h-[44px] items-center gap-2 border-2 border-edge bg-candy px-5 text-cream transition-colors duration-150 hover:bg-ink active:translate-y-[2px]"
          >
            {profile.email}
            <Arrow />
          </a>
          <a
            href={profile.cvPath}
            download="潘宇龙 · 简历.pdf"
            className="label-caps inline-flex min-h-[44px] items-center gap-2 border-2 border-edge bg-cream px-5 text-ink transition-colors duration-150 hover:bg-night-lift hover:text-cream active:translate-y-[2px]"
          >
            下载 PDF 简历
            <span aria-hidden>↓</span>
          </a>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t-2 border-edge/15 pt-3">
          <Serial text="ADMIT ONE · NO.2026-PYL" />
          <span className="label-caps text-ink/60">{profile.available}</span>
          <span className="label-caps text-ink/60">© 2026 {profile.nameLatin}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ================== 轨道长度与锚点 ================== */

const RAIL_VH = 780;

function midOf(id: SectionId) {
  const w = sectionWindow(id);
  return (w.start + w.end) / 2;
}

/** 桌面乘坐模式：一条长轨道撑出滚动区间；锚点按区间中点定位，无 JS 也能跳。 */
function RideRail() {
  return (
    <div className="relative w-full" style={{ height: `${RAIL_VH}vh` }}>
      {(
        [
          ['top', 'boarding'],
          ['station-1', 'station-1'],
          ['work', 'station-1'],
          ['station-2', 'station-2'],
          ['station-3', 'station-3'],
          ['about', 'observation'],
          ['observation', 'observation'],
          ['contact', 'terminus'],
          ['terminus', 'terminus'],
        ] as const
      ).map(([domId, section]) => (
        <span
          key={domId}
          aria-hidden
          className="pointer-events-none absolute left-0 h-px w-px scroll-mt-[60px]"
          style={{ top: `${midOf(section) * RAIL_VH}vh` }}
          id={domId}
        />
      ))}
    </div>
  );
}

/* ================== 静态卡片流（移动端 / reduced-motion） ================== */

/** 相机冻结在终点全景，内容退化为完整纵向卡片流：不靠透明度抢读。 */
function RideFlow() {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[46rem] flex-col gap-4 px-[var(--spacing-rail-x)] pb-[6rem] pt-[4.75rem]">
      <section id="top" data-surface="paper" className={`${PAPER} p-[clamp(1.1rem,4vw,1.75rem)]`}>
        <p className="label-caps text-candy">{boarding.kicker}</p>
        <h1 className="mt-3 font-slab text-[clamp(1.9rem,7.6vw,2.9rem)] leading-[0.98] text-ink">
          {boarding.title}
          <br />
          <span className="text-candy">{boarding.titleAccent}</span>
        </h1>
        <p className="mt-3 text-body text-ink/85">{boarding.lede}</p>
      </section>

      {stations.map((station, i) => (
        <section
          key={station.id}
          id={station.id}
          data-surface="paper"
          className={`${PAPER} scroll-mt-[60px] p-[clamp(1.1rem,4vw,1.75rem)]`}
        >
          <StationBody project={projects[i]} station={station} withMedia />
        </section>
      ))}

      <section id="work" className="sr-only">
        三座站台即 Selected work
      </section>
      <section id="about" className="sr-only">
        观景台即 About
      </section>
      <section id="contact" className="sr-only">
        终点站台即 Contact
      </section>

      <section
        id="observation"
        className="hard-edge scroll-mt-[60px] border-2 border-edge bg-night p-[clamp(1.1rem,4vw,1.75rem)]"
      >
        <p className="label-caps text-candy">OBSERVATION DECK · 中途观景台</p>
        <h2 className="mt-2 font-slab text-[clamp(1.4rem,5.2vw,1.9rem)] leading-[1.04] text-cream">
          {profile.nameZh} · {profile.role}
        </h2>
        <p className="mt-2 text-body text-cream/85">{profile.tagline}</p>
        <dl className="mt-4 grid gap-3">
          {methodology.map((m) => (
            <div key={m.title} className="border-l-[3px] border-candy pl-3">
              <dt className="label-caps text-cream">{m.title}</dt>
              <dd className="mt-1 text-[0.95rem] leading-snug text-cream/80">{m.body}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {tablets.map((t) => (
            <li key={t.label} className="tablet-flat px-3 py-3">
              <span className="label-caps block text-brass">{t.label}</span>
              <span className="mt-1 block font-slab text-[1.85rem] leading-none text-cream">
                {t.value}
                {t.unit}
              </span>
              <span className="mt-1 block text-[0.95rem] leading-snug text-cream/75">{t.note}</span>
            </li>
          ))}
        </ul>
        <NightShow />
        <div className="mt-4 -mx-[clamp(1.1rem,4vw,1.75rem)] -mb-[clamp(1.1rem,4vw,1.75rem)] border-t-2 border-edge">
          <div className="px-[clamp(1.1rem,4vw,1.75rem)]">
            <ExitMap />
          </div>
        </div>
      </section>

      <section
        id="terminus"
        data-surface="paper"
        className={`${PAPER} scroll-mt-[60px] p-[clamp(1.1rem,4vw,1.75rem)]`}
      >
        <p className="label-caps text-candy">{terminus.kicker} · 终点站台</p>
        <h2 className="mt-3 font-slab text-[clamp(1.7rem,6.4vw,2.5rem)] leading-[0.98] text-ink">
          {terminus.title}
        </h2>
        <p className="mt-3 text-body text-ink/85">{terminus.body}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="label-caps inline-flex min-h-[44px] items-center gap-2 border-2 border-edge bg-candy px-5 text-cream transition-colors duration-150 hover:bg-ink active:translate-y-[2px]"
          >
            {profile.email}
            <Arrow />
          </a>
          <a
            href={profile.cvPath}
            download="潘宇龙 · 简历.pdf"
            className="label-caps inline-flex min-h-[44px] items-center gap-2 border-2 border-edge bg-cream px-5 text-ink transition-colors duration-150 hover:bg-night-lift hover:text-cream active:translate-y-[2px]"
          >
            下载 PDF 简历
            <span aria-hidden>↓</span>
          </a>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t-2 border-edge/15 pt-3">
          <Serial text="ADMIT ONE · NO.2026-PYL" />
          <span className="label-caps text-ink/60">{profile.available}</span>
          <span className="label-caps text-ink/60">© 2026 {profile.nameLatin}</span>
        </div>
      </section>
    </div>
  );
}

/* ================== 出口 ================== */

export function Ride({ flow }: { flow: boolean }) {
  if (flow) {
    return (
      <main className="relative">
        <RideFlow />
      </main>
    );
  }
  return (
    <>
      <main className="relative">
        <h1 className="sr-only">
          {profile.nameZh} · {profile.role} — 过山车简历，滚动即乘坐
        </h1>
        <RideRail />
      </main>
      <div className="pointer-events-none fixed inset-0 z-20">
        <BoardingPanel />
        <StationPanel index={0} />
        <StationPanel index={1} />
        <StationPanel index={2} />
        <ObservationPanel />
        <TerminusPanel />
      </div>
    </>
  );
}
