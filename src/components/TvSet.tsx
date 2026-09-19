import { Suspense, lazy, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useMedia } from '../hooks/useMedia';
import type { Program } from '../data/site';

const CrtLayer = lazy(() => import('../crt/CrtLayer').then((m) => ({ default: m.CrtLayer })));

function pad(n: number, len = 2) {
  return String(Math.floor(n)).padStart(len, '0');
}

/** 屏幕内：真实播放的节目母带 + 时码；屏幕外一切信息走文字与实色块。 */
function TvScreen({ program, active }: { program: Program; active: boolean }) {
  const reduced = useReducedMotion() ?? false;
  const hasClip = useMedia(program.clip);
  const [source, setSource] = useState<HTMLVideoElement | HTMLImageElement | null>(null);
  const [clock, setClock] = useState('00:00:00:00');

  useEffect(() => {
    const el = source;
    if (!el) return;
    if (!reduced && active && 'play' in el && typeof el.play === 'function') {
      void el.play().catch(() => undefined);
    } else if ('pause' in el && typeof el.pause === 'function') {
      el.pause();
      if (el.currentTime > 0.1) el.currentTime = 0;
    }
  }, [active, reduced, source]);

  /* shader 层一旦被点亮就保留：卸载/重建 WebGL 上下文会在回滑时闪黑 */
  const [everLive, setEverLive] = useState(false);
  useEffect(() => {
    if (active) setEverLive(true);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      const el = source;
      if (!el || !('currentTime' in el)) return;
      const t = (el as HTMLVideoElement).currentTime || 0;
      const frames = Math.floor((t % 1) * 25);
      setClock(`${pad(t / 3600)}:${pad((t / 60) % 60)}:${pad(t % 60)}:${pad(frames)}`);
    }, 200);
    return () => window.clearInterval(id);
  }, [active, source]);

  return (
    <div className="screen-face aspect-16/10 w-full">
      {hasClip ? (
        <video
          ref={setSource}
          aria-hidden
          tabIndex={-1}
          className="crt-video absolute inset-0 h-full w-full object-cover"
          src={program.clip}
          poster={program.clipPoster}
          muted
          loop
          playsInline
          preload={active ? 'auto' : 'metadata'}
        />
      ) : (
        <img
          ref={setSource}
          alt={`${program.title} 现场剧照：${program.imageAlt}`}
          className="absolute inset-0 h-full w-full object-cover"
          src={program.image}
          decoding="async"
        />
      )}

      {hasClip && !reduced && everLive ? (
        <Suspense fallback={null}>
          <CrtLayer source={source} live={active} />
        </Suspense>
      ) : null}

      {/* CSS 兜底层：WebGL 缺席时仍有扫描线与雪花；reduced-motion 下整层不渲染 */}
      {!reduced ? (
        <>
          <div aria-hidden className="crt-lines pointer-events-none absolute inset-0 opacity-70" />
          <div aria-hidden className="crt-noise pointer-events-none absolute inset-0" />
          <div
            aria-hidden
            className="crt-roll pointer-events-none absolute inset-x-0 h-1/3 bg-cream/5"
            style={{ animation: 'scan 7s linear infinite' }}
          />
        </>
      ) : null}

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between gap-2 p-[3%]">
        <div className="flex items-start justify-between gap-2">
          <span className="label whitespace-nowrap bg-screen/85 px-2 py-1 text-cream">{program.channel}</span>
          <span className="label flex items-center gap-2 whitespace-nowrap bg-screen/85 px-2 py-1 text-phosphor">
            <span
              aria-hidden
              className="crt-flicker h-2 w-2 shrink-0 rounded-key bg-phosphor"
              style={{ animation: 'hum 2.6s ease-in-out infinite' }}
            />
            ON AIR
          </span>
        </div>
        <div className="flex items-end justify-between gap-2">
          <span className="label min-w-0 truncate whitespace-nowrap bg-screen/85 px-2 py-1 tabular-nums text-cream">
            {reduced ? '静帧 · STILL' : `TC ${clock}`}
          </span>
          <span className="label shrink-0 whitespace-nowrap bg-screen/85 px-2 py-1 text-muted">
            {hasClip ? (
              <>
                <span className="hidden sm:inline">固定机位 · </span>母带循环
              </>
            ) : (
              <>
                <span className="hidden sm:inline">资料画面 · </span>静帧
              </>
            )}
          </span>
        </div>
      </div>
      <p className="sr-only">
        本台资料画面：{program.title}，{program.category}。画面为固定机位循环片段。
      </p>
    </div>
  );
}

const GRILLE =
  'repeating-linear-gradient(to bottom, #3a342c 0px, #3a342c 2px, #141210 2px, #141210 6px)';

export function TvSet({ program, active }: { program: Program; active: boolean }) {
  return (
    <div className="relative">
      {/* 天线（装饰） */}
      <div aria-hidden className="pointer-events-none absolute -top-10 left-1/2 hidden h-10 w-40 sm:block">
        <span className="absolute bottom-0 left-1/2 h-px w-24 -translate-x-1/2 bg-line-strong" />
        <span className="absolute bottom-0 left-1/2 h-10 w-px origin-bottom -rotate-[24deg] bg-line-strong" />
        <span className="absolute bottom-0 left-1/2 h-10 w-px origin-bottom rotate-[24deg] bg-line-strong" />
      </div>

      <div className="rounded-shell border-2 border-line bg-ink-soft p-2 sm:p-4">
        <div className="flex gap-2 sm:gap-4">
          <TvScreen program={program} active={active} />
          <div className="hidden w-14 shrink-0 flex-col items-center justify-between py-1 sm:flex">
            <div aria-hidden className="h-16 w-full" style={{ backgroundImage: GRILLE }} />
            <div className="flex flex-col items-center gap-2">
              <span
                aria-hidden
                className="h-8 w-8 rounded-key border-2 border-line-strong bg-ink"
                style={{ boxShadow: 'inset 0 2px 0 0 #3a342c' }}
              />
              <span className="label text-[0.875rem] text-muted">VOL</span>
              <span
                aria-hidden
                className="h-6 w-6 rounded-key border-2 border-line bg-ink"
              />
              <span className="label text-[0.875rem] text-muted">CH</span>
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 px-1 sm:mt-3">
          <span className="label text-muted">
            {program.latin}
          </span>
          <div aria-hidden className="flex items-center gap-1.5">
            {['1', '2', '3'].map((k) => (
              <span key={k} className="h-3 w-3 rounded-key border border-line-strong bg-ink" />
            ))}
            <span className="h-3 w-3 rounded-key bg-vermilion" />
          </div>
        </div>
      </div>
    </div>
  );
}
