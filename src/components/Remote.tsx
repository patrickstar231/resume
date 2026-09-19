import { useCallback, useEffect, useRef, useState } from 'react';
import { profile, station } from '../data/site';
import { readScrollPercent, scrollByRatio } from '../state/scroll';
import { ChevronDownIcon, ChevronUpIcon, PowerIcon } from './icons';

const KEYS = [
  { key: '0', channel: 'CH00', label: '导视 · 今日在售' },
  { key: '1', channel: 'CH01', label: '保时捷 911 传奇沉浸展' },
  { key: '2', channel: 'CH02', label: '华为云 · 快成长直播' },
  { key: '3', channel: 'CH03', label: '腾讯数字生态大会' },
];

/** 换台瞬间的 120ms 雪花：小尺寸画布逐帧随机噪点，放大后呈像素块状电视雪花。 */
function Noise({ label }: { label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    let frame = 0;
    const draw = () => {
      const { width, height } = canvas;
      const img = ctx.createImageData(width, height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() > 0.5 ? 240 : 20 + Math.random() * 60;
        img.data[i] = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[65] bg-screen">
      <canvas
        ref={ref}
        width={176}
        height={110}
        className="h-full w-full"
        style={{ imageRendering: 'pixelated' }}
      />
      <span className="absolute inset-0 grid place-items-center font-display text-[clamp(2.5rem,9vw,6rem)] text-cream">
        {label}
      </span>
    </div>
  );
}

export function SnowFlash({
  tick,
  label,
  enabled,
}: {
  tick: number;
  label: string;
  enabled: boolean;
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!tick || !enabled) return;
    setOn(true);
    const id = window.setTimeout(() => setOn(false), 120);
    return () => window.clearTimeout(id);
  }, [tick, enabled]);

  if (!on) return null;
  return <Noise label={label} />;
}

/**
 * 悬浮遥控器：数字键 0-3 换台、POWER 回测试卡、VOL 旋钮纵向滚页。
 * ≥1360px 悬浮在右下，窄屏折叠为贴在字幕条上方的一条 bar。
 */
export function Remote({
  active,
  onJump,
  onPower,
}: {
  active: string;
  onJump: (key: string) => void;
  onPower: () => void;
}) {
  const [percent, setPercent] = useState(0);
  const dragging = useRef<{ y: number } | null>(null);

  useEffect(() => {
    const onScroll = () => setPercent(readScrollPercent());
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const angle = -135 + (percent / 100) * 270;

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const node = event.currentTarget;
    node.setPointerCapture(event.pointerId);
    dragging.current = { y: event.clientY };
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragging.current;
    if (!state) return;
    const dy = state.y - event.clientY;
    if (Math.abs(dy) < 2) return;
    scrollByRatio(dy / window.innerHeight);
    dragging.current = { y: event.clientY };
  }, []);

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const onKnobKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = {
      ArrowUp: 0.18,
      ArrowRight: 0.18,
      ArrowDown: -0.18,
      ArrowLeft: -0.18,
      PageUp: 0.8,
      PageDown: -0.8,
    };
    const step = map[event.key];
    if (step === undefined) return;
    event.preventDefault();
    scrollByRatio(step);
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-[var(--spacing-ticker)] z-40 flex justify-center px-2 pb-2 min-[1360px]:inset-x-auto min-[1360px]:bottom-[calc(var(--spacing-ticker)+1rem)] min-[1360px]:right-5 min-[1360px]:justify-end min-[1360px]:px-0 min-[1360px]:pb-0">
      <div className="shell w-full max-w-[540px] px-2 py-2 min-[1360px]:w-[316px] min-[1360px]:px-4 min-[1360px]:py-4">
        <span className="label mb-3 hidden truncate whitespace-nowrap text-muted min-[1360px]:block">
          遥控器 · {station.id}
        </span>

        <div className="flex items-center gap-1.5 min-[1360px]:flex-col min-[1360px]:items-stretch min-[1360px]:gap-4">
          <div className="flex items-center justify-between gap-2 min-[1360px]:w-full">
            <span className="label hidden text-muted min-[1360px]:block">频道 / CHANNEL</span>
            <button
              type="button"
              onClick={onPower}
              aria-label="POWER：关机并回到测试卡"
              title="POWER：回到测试卡"
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-key border-2 border-line-strong bg-ink text-cream transition-colors duration-200 hover:border-vermilion hover:text-vermilion active:translate-y-px"
            >
              <PowerIcon size={20} />
            </button>
          </div>

          <div
            role="group"
            aria-label="频道数字键"
            className="flex min-w-0 items-center gap-1.5 min-[1360px]:grid min-[1360px]:grid-cols-2 min-[1360px]:gap-3"
          >
            {KEYS.map((k) => {
              const onAir = active === `ch${k.key.padStart(2, '0')}`;
              return (
                <button
                  key={k.key}
                  type="button"
                  onClick={() => onJump(k.key)}
                  aria-pressed={onAir}
                  aria-label={`换台 ${k.channel}：${k.label}`}
                  title={`${k.channel} ${k.label}`}
                  className={`inline-flex min-h-11 min-w-11 flex-1 items-center justify-center rounded-key border-2 font-display text-key transition-colors duration-200 active:translate-y-px ${
                    onAir
                      ? 'border-phosphor bg-ink text-phosphor'
                      : 'border-line-strong bg-ink text-cream hover:border-cream'
                  }`}
                >
                  {k.key}
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 min-[1360px]:ml-0 min-[1360px]:w-full min-[1360px]:justify-between">
            <div className="hidden flex-col gap-1 min-[1360px]:flex">
              <button
                type="button"
                onClick={() => scrollByRatio(0.6)}
                aria-label="VOL＋：向下翻一页"
                title="VOL＋：向下翻一页"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-key border-2 border-line bg-ink text-cream hover:border-cream active:translate-y-px"
              >
                <ChevronDownIcon size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollByRatio(-0.6)}
                aria-label="VOL－：向上翻一页"
                title="VOL－：向上翻一页"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-key border-2 border-line bg-ink text-cream hover:border-cream active:translate-y-px"
              >
                <ChevronUpIcon size={18} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div
                role="slider"
                tabIndex={0}
                aria-label="VOL 旋钮：纵向滚动整页"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-valuetext={`页面位置 ${percent}%`}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={onKnobKey}
                className="relative grid min-h-14 min-w-14 cursor-ns-resize touch-none place-items-center rounded-key border-2 border-line-strong bg-ink-soft"
                style={{ boxShadow: 'inset 0 3px 0 0 #141210' }}
              >
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-6 w-[3px] -translate-x-1/2 -translate-y-full bg-lemon"
                  style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)`, transformOrigin: 'bottom center' }}
                />
                <span aria-hidden className="label text-muted">
                  VOL
                </span>
              </div>
              <span className="label hidden tabular-nums text-muted min-[1360px]:block">
                {percent}%
              </span>
            </div>
          </div>
        </div>

        <p className="label mt-4 hidden text-muted min-[1360px]:block">
          键盘 0-3 换台 · Esc 关机
        </p>
        <p className="label mt-1 hidden whitespace-nowrap text-muted min-[1360px]:block" title={profile.email}>
          热线 {profile.email}
        </p>
      </div>
    </div>
  );
}
