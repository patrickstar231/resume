import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function attachParallax({ frame, element, kind, query }) {
  const media = gsap.matchMedia();
  const offsets = { hero: [0, 104], project: [-44, 44], planning: [-38, 38], onsite: [34, -34], review: [-30, 30], camping: [28, -28], snow: [-38, 38] };
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

export function attachPageParallax(root) {
  const media = gsap.matchMedia();
  const query = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';
  const offsets = { lead: [-12, 18], heading: [30, -22], band: [18, -18] };
  media.add(query, () => {
    const targets = gsap.utils.toArray(root.querySelectorAll('[data-parallax]'));
    targets.forEach(element => {
      const [from, to] = offsets[element.dataset.parallax] || offsets.band;
      gsap.fromTo(element, { y: from }, {
        y: to,
        ease: 'none',
        scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: .8, invalidateOnRefresh: true },
      });
    });
  });
  return { media, refresh: () => ScrollTrigger.refresh() };
}
