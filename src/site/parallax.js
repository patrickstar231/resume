import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Per-photograph drift. The page level camera and the video playhead live in stage.js;
// this module only moves the image inside its own frame, so the two effects never fight
// for the same transform.
export function attachParallax({ frame, element, kind, query }) {
  const media = gsap.matchMedia();
  const offsets = { crew: [-46, 46], table: [30, -30], camping: [28, -28], snow: [-38, 38], case: [-30, 30] };
  const [from, to] = offsets[kind] || [0, 0];
  media.add(query, () => {
    gsap.fromTo(element, { y: from }, {
      y: to, ease: 'none',
      scrollTrigger: {
        trigger: frame.closest('.frame') || frame,
        start: 'top bottom', end: 'bottom top', scrub: 0.3,
        invalidateOnRefresh: true,
      },
    });
  });
  return { media, refresh: () => ScrollTrigger.refresh() };
}
