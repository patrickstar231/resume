import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { machine, projects, type Project } from '../data/site';
import { useMediaProbe, useMediaQuery } from '../hooks/useMachine';
import { ArrowIcon, CapsuleIcon, ChevronIcon, ExternalIcon, PlayIcon } from './icons';
import { CapsuleShell, GoodsLabel, Panel, cn } from './ui';

/* ── 扭蛋交互（核心） ───────────────────────────────────────────
   滚动到货架 → 当期胶囊落进底部取物盘 → 点/键盘开蛋 → 两半弹开、
   胶囊内页展开成 DOM 项目卡（真实 metric、外链、演示视频 HEAD 探测）。
   机台标签常驻货架：不开蛋也读得到品名 + 编号 + 一句话参数。 */

function ProjectMedia({ project, live }: { project: Project; live: boolean }) {
  const hasVideo = useMediaProbe(project.hoverVideo);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el || !hasVideo) return;
    if (live) void el.play().catch(() => undefined);
    else {
      el.pause();
      el.currentTime = 0;
    }
  }, [hasVideo, live]);

  return (
    <figure className="relative mt-[var(--spacing-stack-md)] overflow-hidden rounded-panel border-2 border-ink">
      <img
        src={project.image}
        alt={`${project.name} 现场`}
        loading="lazy"
        decoding="async"
        className="aspect-16/9 w-full object-cover"
      />
      {hasVideo ? (
        <video
          ref={video}
          src={project.hoverVideo}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <figcaption className="absolute bottom-0 left-0 flex items-center gap-2 border-t-2 border-r-2 border-ink bg-capsule px-3 py-1.5 tag">
        {hasVideo ? <PlayIcon className="h-4 w-4" /> : <ArrowIcon className="h-4 w-4" />}
        {hasVideo ? '奖品种演示视频 · 实机采集' : '现场实拍'} · {project.metric}
      </figcaption>
    </figure>
  );
}

function CapsuleDraw({
  project,
  open,
  onToggle,
  register,
}: {
  project: Project;
  open: boolean;
  onToggle: (code: string) => void;
  register: (code: string, node: HTMLElement | null) => void;
}) {
  const anchor = `draw-${project.code}`;
  return (
    <li
      id={anchor}
      tabIndex={-1}
      ref={(node) => register(project.code, node)}
      className="scroll-mt-32 list-none outline-none"
    >
      <Panel as="article" className="relative">
        <div className="flex flex-wrap items-start gap-[var(--spacing-stack-md)]">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`${anchor}-prize`}
            onClick={() => onToggle(project.code)}
            className="group flex min-h-[var(--spacing-hit)] items-center gap-3 rounded-handle border-2 border-ink bg-plate px-3 py-2 text-tag transition-colors duration-150 hover:bg-cobalt hover:text-shell"
          >
            <CapsuleShell tone={project.color} open={open} size={64} stamp={project.index} />
            <span className="flex items-center gap-1.5">
              <CapsuleIcon className="h-4 w-4" />
              {open ? '收回胶囊' : '扭开取奖品'}
            </span>
          </button>
          <GoodsLabel
            className="min-w-[220px] flex-1"
            code={project.code}
            goods={`${project.goods} · ${project.name}`}
            params={project.metric}
            tone={project.color}
          />
        </div>

        <p className="mt-[var(--spacing-stack-md)] max-w-[54ch] text-body">{project.summary}</p>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              id={`${anchor}-prize`}
              key="prize"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t-2 border-ink pt-[var(--spacing-stack-md)]">
                <p className="tag">奖品明细 / {project.category}</p>
                <ul className="mt-3 grid gap-2 md:grid-cols-3">
                  {project.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="rounded-panel border-2 border-ink bg-shell p-3 text-body leading-snug"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
                <ProjectMedia project={project} live={open} />
                <div className="mt-[var(--spacing-stack-md)] flex flex-wrap items-center gap-3">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-[var(--spacing-hit)] items-center gap-2 rounded-handle border-2 border-ink bg-shell px-5 text-tag transition-colors duration-150 hover:bg-cobalt hover:text-shell"
                  >
                    <ExternalIcon className="h-4 w-4" />
                    打开项目现场
                  </a>
                  <span className="tag opacity-70">
                    奖品编号 {project.code} · 出货批次 {machine.batch}
                  </span>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Panel>
    </li>
  );
}

/** 取物盘：当期胶囊 + 旋钮切换，Enter / Space 开蛋。
    lg 以上为右下浮动轨道；窄屏改为段内铭牌 —— 浮动层压住机台标签是硬伤。 */
function PrizeTray({
  docked,
  visible,
  active,
  onCycle,
  onOpen,
}: {
  docked: boolean;
  visible: boolean;
  active: Project;
  onCycle: (dir: 1 | -1) => void;
  onOpen: (code: string) => void;
}) {
  const sunk = docked && !visible;
  return (
    <motion.div
      className={cn(
        'w-full',
        docked &&
          'fixed inset-x-0 bottom-0 z-40 flex justify-end px-[var(--spacing-section-x)] pb-4 pointer-events-none',
        !docked && 'mt-[var(--spacing-stack-lg)] flex justify-center',
      )}
      initial={false}
      animate={docked ? { y: visible ? 0 : 180, opacity: visible ? 1 : 0 } : { y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 210, damping: 26 }}
      aria-hidden={sunk || undefined}
      {...(sunk ? { inert: true as unknown as boolean } : {})}
    >
      <div
        className={cn(
          'pointer-events-auto w-full max-w-[560px] rounded-panel border-2 border-ink bg-cobalt p-3 shadow-press',
          docked && 'lg:w-[520px] lg:max-w-[520px]',
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="tag text-shell/90">取物盘 / PRIZE TRAY</span>
          <p aria-live="polite" className="tag min-w-[150px] flex-1 truncate text-shell">
            当前可开：{active.code} · {active.goods}，按 Enter 扭开
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onCycle(-1)}
              aria-label="上一颗胶囊"
              className="grid h-11 w-11 place-items-center rounded-handle border-2 border-ink bg-capsule text-ink transition-transform duration-150 hover:-translate-y-[2px] active:translate-y-[2px]"
            >
              <ChevronIcon className="h-5 w-5 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => onCycle(1)}
              aria-label="下一颗胶囊"
              className="grid h-11 w-11 place-items-center rounded-handle border-2 border-ink bg-capsule text-ink transition-transform duration-150 hover:-translate-y-[2px] active:translate-y-[2px]"
            >
              <ChevronIcon className="h-5 w-5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => onOpen(active.code)}
            className="flex min-h-[var(--spacing-hit)] items-center gap-2 rounded-handle border-2 border-ink bg-punch px-4 py-2 font-display text-[1.2rem] uppercase leading-none text-shell transition-transform duration-150 hover:-translate-y-[2px] active:translate-y-[2px]"
          >
            <CapsuleShell tone={active.color} size={34} stamp={active.index} />
            扭开这颗
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function CapsuleShelf() {
  const reduced = useReducedMotion() ?? false;
  const docked = useMediaQuery('(min-width: 1024px)');
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    reduced ? Object.fromEntries(projects.map((p) => [p.code, true])) : {},
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [trayIn, setTrayIn] = useState(false);
  const shelf = useRef<HTMLUListElement>(null);
  const nodes = useRef<Map<string, HTMLElement>>(new Map());

  const register = useCallback((code: string, node: HTMLElement | null) => {
    if (node) nodes.current.set(code, node);
    else nodes.current.delete(code);
  }, []);

  // 哪一颗停在视口中线，哪一颗就落进取物盘
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (!hit) return;
        const code = hit.target.id.replace('draw-', '');
        const next = projects.findIndex((p) => p.code === code);
        if (next >= 0) setActiveIndex(next);
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    nodes.current.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, []);

  // 取物盘只在货架在屏时升起；走到中奖名录就收回，避免压住任何标签
  useEffect(() => {
    const node = shelf.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setTrayIn(entry.isIntersecting));
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const toggle = useCallback((code: string) => {
    setOpen((state) => ({ ...state, [code]: !state[code] }));
  }, []);

  const openAndReveal = useCallback((code: string) => {
    setOpen((state) => ({ ...state, [code]: true }));
    const node = nodes.current.get(code);
    if (!node) return;
    node.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    node.focus({ preventScroll: true });
  }, [reduced]);

  const allOpen = useMemo(() => projects.every((p) => open[p.code]), [open]);
  const active = projects[activeIndex] ?? projects[0];

  return (
    <section
      id="work"
      className={cn(
        'relative px-[var(--spacing-section-x)] pt-section-y',
        docked
          ? 'pb-[calc(var(--spacing-section-y)+9rem)]'
          : 'pb-[calc(var(--spacing-section-y)+2rem)]',
      )}
    >
      <div className="w-full lg:max-w-[52%]">
        <div className="flex flex-wrap items-end justify-between gap-[var(--spacing-stack-md)]">
          <div>
            <p className="tag">胶囊货架 / CAPSULE SHELF</p>
            <h2 className="mt-2 max-w-[20ch] font-display text-h1">
              三颗常规蛋，
              <br />
              开出来全是真数据
            </h2>
          </div>
          <button
            type="button"
            aria-pressed={allOpen}
            onClick={() =>
              setOpen(Object.fromEntries(projects.map((p) => [p.code, !allOpen])))
            }
            className="flex min-h-[var(--spacing-hit)] items-center gap-2 rounded-handle border-2 border-ink bg-plate px-5 text-tag transition-colors duration-150 hover:bg-capsule"
          >
            <span
              aria-hidden
              className={cn(
                'h-3.5 w-3.5 rounded-capsule border-2 border-ink',
                allOpen ? 'bg-punch' : 'bg-shell',
              )}
            />
            {allOpen ? '全部收回' : '全部扭开'}
          </button>
        </div>

        <p className="mt-[var(--spacing-stack-md)] max-w-[52ch] text-lede">
          每颗胶囊下方的机台标签已写明品名、编号与一句话参数 —— 交互只负责好玩，不负责遮挡内容。
        </p>

        <ul ref={shelf} className="mt-[var(--spacing-stack-lg)] grid gap-[var(--spacing-stack-md)]">
          {projects.map((project) => (
            <CapsuleDraw
              key={project.code}
              project={project}
              open={!!open[project.code]}
              onToggle={toggle}
              register={register}
            />
          ))}
        </ul>
      </div>

      <PrizeTray
        docked={docked}
        visible={trayIn}
        active={active}
        onCycle={(dir) =>
          setActiveIndex((i) => (i + dir + projects.length) % projects.length)
        }
        onOpen={openAndReveal}
      />
    </section>
  );
}
