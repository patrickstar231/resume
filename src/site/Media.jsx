// Client-side motion is an optional leaf; server rendering emits visible media.
import { useEffect, useRef, useState } from 'react';
import { usePreferences } from './Preferences.jsx';
import { ui } from '../content/ui.js';

const mediaConfig = {
  desk: { widths: [640, 960, 1440], ratio: [4, 5], sizes: '(max-width: 767px) calc(100vw - 40px), 32vw' },
  camping: { widths: [640, 960, 1440], ratio: [4, 3], sizes: '(max-width: 767px) calc(100vw - 40px), 55vw' },
  snow: { widths: [480, 640, 768], ratio: [3, 4], sizes: '(max-width: 767px) 78vw, 32vw' },
  'work-crew': { widths: [640, 960, 1440], ratio: [3, 2], sizes: '(max-width: 767px) calc(100vw - 40px), 56vw' },
  'work-desk': { widths: [640, 960, 1440], ratio: [3, 2], sizes: '(max-width: 767px) calc(100vw - 40px), 56vw' },
  'work-table': { widths: [640, 960, 1440], ratio: [3, 2], sizes: '(max-width: 767px) calc(100vw - 40px), 56vw' },
};

export function Photo({ name, locale, alt, className = '', motionKind, priority = false }) {
  const [failed, setFailed] = useState(false);
  const frame = useRef(null), inner = useRef(null);
  const { motion, ready } = usePreferences();
  const config = mediaConfig[name] || mediaConfig.camping;
  const { widths, ratio, sizes } = config;
  const sourceSet = (base, extension) => widths.map(width => `/images/${base}-${width}.${extension} ${width}w`).join(', ');

  useEffect(() => {
    // An eager image can fail before React attaches its error handler.
    const img = frame.current?.querySelector('img');
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, [name]);

  useEffect(() => {
    if (!ready || !motionKind || motion === 'reduce' || failed) return;
    let disposed = false, media, loading = false;
    let refresh = () => {};
    const el = inner.current;
    const query = '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
    const condition = window.matchMedia(query);
    // Lazy loading isolates an animation failure from the readable document.
    const enable = () => {
      if (!condition.matches || loading || media) return;
      loading = true;
      import('./parallax.js').then(({ attachParallax }) => {
      if (disposed) return;
      const instance = attachParallax({ frame: frame.current, element: el, kind: motionKind, query });
      media = instance.media;
      refresh = instance.refresh;
      frame.current?.querySelectorAll('img').forEach(img => {
        if (!img.complete) img.addEventListener('load', refresh, { once: true });
      });
      document.fonts?.ready.then(() => { if (!disposed) refresh(); });
      }).catch(() => { if (el) el.style.removeProperty('transform'); });
    };
    enable();
    condition.addEventListener('change', enable);
    return () => {
      disposed = true;
      condition.removeEventListener('change', enable);
      media?.revert();
      el?.querySelectorAll('img').forEach(img => img.removeEventListener('load', refresh));
    };
  }, [motion, ready, motionKind, failed]);

  return <div ref={frame} className={`photo photo-${name} ${className}`} data-motion-kind={motionKind} style={{ '--photo-ratio': `${ratio[0]} / ${ratio[1]}` }}>
    {failed ? <span className="photo-fallback" role="img" aria-label={alt}>{ui[locale].photoUnavailable}</span>
      : <div className="photo-inner" ref={inner}>
        <picture>
          {name === 'desk' && <><source media="(max-width: 767px)" type="image/webp" srcSet={sourceSet('desk-mobile', 'webp')} sizes="calc(100vw - 40px)" /><source media="(max-width: 767px)" srcSet={sourceSet('desk-mobile', 'jpg')} sizes="calc(100vw - 40px)" /></>}
          <source type="image/webp" srcSet={sourceSet(name, 'webp')} sizes={sizes} />
          <img src={`/images/${name}-${widths[1]}.jpg`} srcSet={sourceSet(name, 'jpg')} sizes={sizes} width={widths[1]} height={Math.round(widths[1] * ratio[1] / ratio[0])} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchpriority={priority ? 'high' : 'auto'} decoding="async" onError={() => setFailed(true)} />
        </picture>
      </div>}
  </div>;
}
