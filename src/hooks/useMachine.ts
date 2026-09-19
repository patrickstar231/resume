import { useEffect, useState } from 'react';

/** HEAD 探测：素材真的存在（且是视频）才挂载媒体层，缺省回落静态图。 */
export function useMediaProbe(src?: string) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!src) {
      setOk(false);
      return;
    }
    let alive = true;
    fetch(src, { method: 'HEAD' })
      .then((res) => {
        if (!alive) return;
        setOk(res.ok && (res.headers.get('content-type') ?? '').startsWith('video/'));
      })
      .catch(() => {
        if (alive) setOk(false);
      });
    return () => {
      alive = false;
    };
  }, [src]);
  return ok;
}

/** 断点探测：移动端整段不挂载 WebGL，改为静态机台插画 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** 只在「一次」内允许出现的开机态：Splash 投币后解锁滚动 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const style = document.documentElement.style;
    const prev = style.overflow;
    style.overflow = 'hidden';
    return () => {
      style.overflow = prev;
    };
  }, [locked]);
}
