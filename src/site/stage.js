// The 3D stage engine, v2. One requestAnimationFrame loop owns every moving value on
// the page: the hero camera dolly, per-block depth drift, pointer tilt, focal-plane
// arming, the broadcast timecode and the video playhead.
//
// Video scrubbing: each [data-scrub] element is a <video> whose currentTime is driven
// by how far its [data-scene] has crossed the viewport. Seeking is throttled to one
// frame (1/25 s) so a slow seek never turns into jank, and every scene metric is
// measured with offsetTop so transforms never corrupt the reading.

const FRAME_RATE = 25;
const TOTAL_HOURS = 16;

const cubic = (value) => value * value * (3 - 2 * value);
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const timecode = (progress) => {
  const seconds = clamp(progress) * TOTAL_HOURS * 3600;
  const whole = Math.floor(seconds);
  const frames = Math.min(FRAME_RATE - 1, Math.floor((seconds - whole) * FRAME_RATE));
  const pad = (value) => String(value).padStart(2, '0');
  return [pad(Math.floor(whole / 3600)), pad(Math.floor(whole / 60) % 60), pad(whole % 60), pad(frames)].join(':');
};

const layoutTop = (element) => {
  let top = 0, node = element;
  while (node) { top += node.offsetTop; node = node.offsetParent; }
  return top;
};

export function attachStage(root, { timecodeTarget } = {}) {
  if (!root || typeof window === 'undefined') return { destroy() {}, remeasure() {} };

  const html = document.documentElement;
  const hero = root.querySelector('.stage-hero');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const wideQuery = window.matchMedia('(min-width: 1024px)');
  const fineQuery = window.matchMedia('(pointer: fine)');
  const still = () => html.dataset.motion === 'reduce' || !motionQuery.matches;
  const staged = () => !still() && wideQuery.matches;
  const tiltOn = () => staged() && fineQuery.matches;

  // ---------------------------------------------------------------- focal plane
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

  // ---------------------------------------------------------------- scene metrics
  const scenes = Array.from(root.querySelectorAll('[data-scene]')).map((element) => ({
    element, top: 0, height: 1,
    videos: Array.from(element.querySelectorAll('[data-scrub]')).map((video) => ({ video, written: -1 })),
  }));
  const blocks = Array.from(root.querySelectorAll('[data-depth]')).map((element) => ({
    element, depth: Number(element.dataset.depth) || 0, top: 0, height: 1, written: 0,
  }));

  const measure = () => {
    for (const scene of scenes) {
      scene.top = layoutTop(scene.element);
      scene.height = Math.max(1, scene.element.offsetHeight);
    }
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
  let pointerX = 0, pointerY = 0, glowX = -999, glowY = -999;
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
    const heroHeight = hero ? hero.offsetHeight : viewport;
    const nextHero = clamp(scrollY / Math.max(1, heroHeight - viewport * 0.35));
    const nextTiltX = tiltOn() ? pointerY * -2.4 : 0;
    const nextTiltY = tiltOn() ? pointerX * 3 : 0;

    progress += (clamp(scrollY / scrollable) - progress) * 0.14;
    heroProgress += (nextHero - heroProgress) * 0.12;
    tiltX += (nextTiltX - tiltX) * 0.07;
    tiltY += (nextTiltY - tiltY) * 0.07;
    if (glowSmoothX < -900) { glowSmoothX = glowX; glowSmoothY = glowY; }
    glowSmoothX += (glowX - glowSmoothX) * 0.09;
    glowSmoothY += (glowY - glowSmoothY) * 0.09;

    const heroEase = cubic(clamp(heroProgress));
    html.style.setProperty('--sprog', progress.toFixed(4));
    html.style.setProperty('--hp', heroEase.toFixed(4));
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

    const span = viewport + 1200;
    for (const scene of scenes) {
      const seen = clamp((scrollY + viewport - scene.top) / span);
      for (const item of scene.videos) {
        const video = item.video;
        if (!video || video.readyState < 1 || !Number.isFinite(video.duration) || video.duration <= 0) continue;
        const target = Math.min(video.duration - 1 / FRAME_RATE, seen * video.duration);
        if (Math.abs(target - item.written) > 1 / FRAME_RATE) {
          item.written = target;
          try { video.currentTime = target; } catch { /* Seeking before metadata arrives is harmless. */ }
        }
      }
    }

    if (staged()) {
      for (const block of blocks) {
        const seen = clamp((scrollY + viewport - block.top) / span);
        const drift = Math.round((seen - 0.5) * block.depth * 10) / 10;
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

  const onMotionChange = () => measure();
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
