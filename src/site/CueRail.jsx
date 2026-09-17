// 常驻 CUE 表。桌面端钉在左栏，移动端收成顶部一条；当前幕由 IntersectionObserver 决定。
import { useEffect, useState } from 'react';
import { cues, ui } from '../content/ui.js';
import { homePath } from '../content/routes.js';

export function CueRail({ locale }) {
  const [active, setActive] = useState('intro');
  const t = ui[locale];

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const sections = Array.from(document.querySelectorAll('main [data-cue]'));
    if (!sections.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActive(visible.target.dataset.cue);
    }, { rootMargin: '-25% 0px -55% 0px', threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const index = cues.findIndex((cue) => cue.id === active);

  return <>
    <aside className="cue-rail" aria-label={t.cueList}>
      <p className="cue-rail-title"><span className="rec" />{t.cueList}</p>
      <ol>
        {cues.map((cue, i) => <li key={cue.id} className={active === cue.id ? 'is-active' : ''}>
          <a href={`${homePath(locale)}#${cue.id}`}>
            <span className="cue-num">{cue.num}</span>
            <span className="cue-name">{cue[locale]}</span>
          </a>
        </li>)}
      </ol>
    </aside>
    <div className="cue-meter" aria-hidden="true">
      <span className="cue-meter-label">{cues[index < 0 ? 0 : index].num}</span>
      <i style={{ transform: `scaleX(${(index < 0 ? 0 : index) / (cues.length - 1)})` }} />
      <span className="cue-meter-label">{cues[cues.length - 1].num}</span>
    </div>
  </>;
}
