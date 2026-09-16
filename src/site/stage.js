// The 3D stage engine. One requestAnimationFrame loop writes custom properties,
// so the per-frame cost is a handful of style writes instead of one per element.
//
// Layers of the effect:
//   1. camera dolly       hero scroll pushes the world along Z, so depth layers stream past
//   2. depth drift        [data-depth] blocks ride the Z axis while they cross the viewport
//   3. pointer parallax   pointer angle tilts the hero world (pointer devices only)
//   4. focal plane        [data-focus] blocks ease from blurred and recessed to sharp
//   5. timecode           page progress becomes a 25 fps broadcast timecode
//
// Everything is opt-in and reversible: without this module, or with reduced motion,
// the document is a plain readable page.

const FRAME_RATE = 25;
const TOTAL_HOURS = 16; // sixteen years of work, one hour each
const DRIFT_LIMIT = 1;  // fraction of a block's depth travelled across one viewport pass

const cubic = (value) => value * value * (3 - 2 * value);
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const timecode = (progress) => {
  const seconds = clamp(progress) * TOTAL_HOURS * 3600;
  const whole = Math.floor(seconds);
  const frames = Math.min(FRAME_RATE - 1, Math.floor((seconds - whole) * FRAME_RATE));
  const pad = (value) => String(value).padStart(2, '0');
  return [pad(Math.floor(whole / 3600)), pad(Math.floor(whole / 60) % 60), pad(whole % 60), pad(frames)].join(':');
};

// offsetTop walks the layout tree, so it stays valid while transforms are running.
const layoutTop = (element) => {
  let top = 0, node = element;
  while (node) { top += node.offsetTop; node = node.offsetParent; }
  return top;
};

export function attachStage(root, { timecodeTarget } = {}) {
  if (!root || typeof window === 'undefined') return { destroy() {} };

  const html = document.documentElement;
  const hero = root.querySelector('.stage-hero');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const wideQuery = window.matchMedia('(min-width: 1024px)');
  const fineQuery = window.matchMedia('(pointer: fine)');
  const still = () => html.dataset.motion === 'reduce' || !motionQuery.matches;
  const staged = () => !still() && wideQuery.matches;
  const tiltOn = () => staged() && fineQuery.matches;

  // ---------------------------------------------------------------- focal plane
  // Only armed when IntersectionObserver exists, so a failure can never leave
  // content stuck in its pre-focus state.
  let observer = null;
  if ('IntersectionObserver' in window && motionQuery.matches) {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.classList.add('in-focus');
        else if (entry.boundingClientRect.top > 0) entry.target.classList.remove('in-focus');
      }
    }, { rootMargin: '-8% 0px -18% 0px', threshold: 0.08 });
    root.querySelectorAll('[data-focus]').forEach((element) => observer.observe(element));
    root.querySelectorAll('.experience-list .experience-item').forEach((element) => observer.observe(element));
    html.classList.add('focus-ready');
  }

  // ---------------------------------------------------------------- depth drift
  const blocks = Array.from(root.querySelectorAll('[data-depth]')).map((element) => ({
    element, depth: Number(element.dataset.depth) || 0, top: 0, height: 1, written: 0,
  }));
  const measure = () => {
    for (const block of blocks) {
      block.element.style.setProperty('--drift', '0');
      block.top = layoutTop(block.element);
      block.height = Math.max(1, block.element.offsetHeight);
      block.written = 0;
    }
  };
  measure();
  let measureTimer = 0;
  const onResize = () => { window.clearTimeout(measureTimer); measureTimer = window.setTimeout(measure, 180); };
  window.addEventListener('resize', onResize, { passive: true });

  // ---------------------------------------------------------------- pointer
  let pointerX = 0, pointerY = 0;   // normalised target, -1 .. 1
  let glowX = -999, glowY = -999;   // absolute pointer position for the follow spot
  const onPointer = (event) => {
    if (!tiltOn()) return;
    pointerX = (event.clientX / window.innerWidth) * 2 - 1;
    pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    glowX = event.clientX;
    glowY = event.clientY + window.scrollY;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  // ---------------------------------------------------------------- loop
  let frame = 0, progress = 0, heroProgress = 0, tiltX = 0, tiltY = 0;
  let glowSmoothX = -999, glowSmoothY = -999, atTop = null;

  const render = () => {
    const scrollY = window.scrollY;
    const viewport = window.innerHeight;
    const scrollable = Math.max(1, html.scrollHeight - viewport);
    const nextProgress = clamp(scrollY / scrollable);
    const heroHeight = hero ? hero.offsetHeight : viewport;
    const nextHero = clamp(scrollY / Math.max(1, heroHeight - viewport * 0.35));
    const nextTiltX = tiltOn() ? pointerY * -2.6 : 0;
    const nextTiltY = tiltOn() ? pointerX * 3.4 : 0;

    progress += (nextProgress - progress) * 0.14;
    heroProgress += (nextHero - heroProgress) * 0.12;
    tiltX += (nextTiltX - tiltX) * 0.07;
    tiltY += (nextTiltY - tiltY) * 0.07;
    if (glowSmoothX < -900) { glowSmoothX = glowX; glowSmoothY = glowY; }
    glowSmoothX += (glowX - glowSmoothX) * 0.09;
    glowSmoothY += (glowY - glowSmoothY) * 0.09;

    const heroEase = cubic(clamp(heroProgress));
    html.style.setProperty('--sprog', progress.toFixed(4));
    html.style.setProperty('--hp', heroEase.toFixed(4));
    // The world stops short of the far wall so the room and the rig stay behind the
    // camera while the foreground dust streams past it.
    html.style.setProperty('--camz', (heroEase * 760).toFixed(1));
    html.style.setProperty('--rx', tiltX.toFixed(3));
    html.style.setProperty('--ry', tiltY.toFixed(3));
    html.style.setProperty('--mx', (tiltOn() ? pointerX : 0).toFixed(3));
    html.style.setProperty('--my', (tiltOn() ? pointerY : 0).toFixed(3));
    html.style.setProperty('--glowx', `${glowSmoothX.toFixed(1)}px`);
    html.style.setProperty('--glowy', `${glowSmoothY.toFixed(1)}px`);
    if (timecodeTarget) timecodeTarget.textContent = timecode(progress);

    const shouldBeAtTop = scrollY < 16;
    if (shouldBeAtTop !== atTop) {
      atTop = shouldBeAtTop;
      if (atTop) html.dataset.atTop = 'true';
      else delete html.dataset.atTop;
    }

    if (staged()) {
      const span = viewport + 1200;
      for (const block of blocks) {
        const seen = clamp((scrollY + viewport - block.top) / span);
        const drift = Math.round((seen - 0.5) * block.depth * DRIFT_LIMIT * 10) / 10;
        if (Math.abs(drift - block.written) > 0.4) {
          block.written = drift;
          block.element.style.setProperty('--drift', String(drift));
        }
      }
    } else if (blocks.some((block) => block.written !== 0)) {
      for (const block of blocks) { block.written = 0; block.element.style.setProperty('--drift', '0'); }
    }

    frame = window.requestAnimationFrame(render);
  };
  frame = window.requestAnimationFrame(render);

  const onMotionChange = () => { measure(); };
  motionQuery.addEventListener('change', onMotionChange);
  wideQuery.addEventListener('change', onMotionChange);

  return {
    remeasure: measure,
    destroy() {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(measureTimer);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      motionQuery.removeEventListener('change', onMotionChange);
      wideQuery.removeEventListener('change', onMotionChange);
      observer?.disconnect();
      html.classList.remove('focus-ready');
      delete html.dataset.atTop;
      for (const property of ['--sprog', '--hp', '--camz', '--rx', '--ry', '--mx', '--my', '--glowx', '--glowy']) html.style.removeProperty(property);
      for (const block of blocks) block.element.style.removeProperty('--drift');
    },
  };
}
