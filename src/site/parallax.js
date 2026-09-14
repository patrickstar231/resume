import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function attachParallax({ frame, element, kind, query }) {
  const media = gsap.matchMedia();
  const offsets = { hero: [0, 48], project: [-28, 28], camping: [16, -16], snow: [-24, 24] };
  const [from, to] = offsets[kind] || [0, 0];
  media.add(query, () => {
    gsap.fromTo(element, { y: from }, {
      y: to, ease: 'none',
      scrollTrigger: {
        trigger: kind === 'hero' ? frame.closest('.hero') : kind === 'camping' || kind === 'snow' ? frame.closest('#life') : frame,
        start: kind === 'hero' ? 'top top' : 'top bottom', end: 'bottom top', scrub: 0.3,
        invalidateOnRefresh: true,
      },
    });
  });
  return { media, refresh: () => ScrollTrigger.refresh() };
}
