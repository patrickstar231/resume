// 景深底板。有视频文件时由滚动驱动播放头（stage.js 的 data-scrub），没有时退化为
// 由设计出来的空场底色 + 颗粒 + 暗角。两者都是内容本身，不是占位图形。
import { useEffect, useRef, useState } from 'react';

export function Plate({ src, poster, tone = 'void', className = '', label }) {
  const [failed, setFailed] = useState(false);
  const video = useRef(null);
  const live = Boolean(src) && !failed;

  useEffect(() => {
    const element = video.current;
    if (!element || !live) return;
    // Scrubbing needs the decoder warm but must never autoplay.
    element.pause();
    const onReady = () => { if (element.duration > 0) element.currentTime = 0; };
    element.addEventListener('loadedmetadata', onReady, { once: true });
    return () => element.removeEventListener('loadedmetadata', onReady);
  }, [live, src]);

  return <div className={`plate plate-${tone} ${className}`} aria-hidden="true" data-plate={tone}>
    {live ? <video
      ref={video}
      className="plate-video"
      data-scrub=""
      src={src}
      poster={poster}
      preload="metadata"
      muted
      playsInline
      disablePictureInPicture
      tabIndex={-1}
      aria-hidden="true"
      onError={() => setFailed(true)}
    /> : null}
    {label ? <span className="plate-label">{label}</span> : null}
    <i className="plate-grain" />
    <i className="plate-vignette" />
  </div>;
}
