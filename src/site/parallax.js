import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Per-photograph drift. The page level camera lives in stage.js; this module only
// moves the image inside its own frame, so the two effects never fight for the
// same transform.
export function attachParallax({ frame, element, kind, query }) {
  const media = gsap.matchMedia();
  const offsets = { hero: [0, 104], crew: [-46, 46], onsite: [30, -30], table: [-34, 34], camping: [28, -28], snow: [-38, 38] };
  const [from, to] = offsets[kind] || [0, 0];
  media.add(query, () => {
    gsap.fromTo(element, { y: from }, {
      y: to, ease: 'none',
      scrollTrigger: {
        trigger: kind === 'hero' ? frame.closest('.stage-hero') : frame.closest('.frame') || frame,
        start: kind === 'hero' ? 'top top' : 'top bottom', end: 'bottom top', scrub: 0.3,
        invalidateOnRefresh: true,
      },
    });
  });
  return { media, refresh: () => ScrollTrigger.refresh() };
}
