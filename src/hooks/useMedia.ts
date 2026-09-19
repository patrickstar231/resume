import { useEffect, useState } from 'react';

/**
 * 素材投放探测：HEAD 请求 + content-type 以 video/ 开头才算可用。
 * 素材未投放时返回 false，调用方回落静态剧照，不会出现空层或 404。
 */
export function useMedia(src?: string) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!src) {
      setOk(false);
      return;
    }
    let alive = true;
    fetch(src, { method: 'HEAD' })
      .then((res) =>
        alive && setOk(res.ok && (res.headers.get('content-type') ?? '').startsWith('video/')),
      )
      .catch(() => {
        if (alive) setOk(false);
      });
    return () => {
      alive = false;
    };
  }, [src]);
  return ok;
}
